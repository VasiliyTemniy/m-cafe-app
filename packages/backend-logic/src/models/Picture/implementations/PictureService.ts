import type { LocString, LocStringDTN, PictureDT } from '@m-cafe-app/models';
import type { IPictureRepo, IPictureService } from '../interfaces';
import type { GenericTransaction, ITransactionHandler } from '../../../utils';
import type { ILocStringRepo } from '../../LocString';
import { PictureMapper } from '../infrastructure';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { ApplicationError, UploadFileError, logger } from '@m-cafe-app/utils';

export class PictureService implements IPictureService {

  public readonly upload: multer.Multer;

  private readonly __dirname: string = path.resolve();

  constructor(
    readonly pictureRepo: IPictureRepo,
    readonly locStringRepo: ILocStringRepo,
    readonly transactionHandler: ITransactionHandler,
    readonly foodPicturesDir: string,
    readonly modulePicturesDir: string,
    readonly multerTempDir: string,
    readonly storage: multer.StorageEngine
  ) {

    this.createDirIfNotExists(foodPicturesDir);
    this.createDirIfNotExists(modulePicturesDir);
    this.createDirIfNotExists(multerTempDir);

    this.upload = multer({ storage });

  }

  private createDirIfNotExists(dir: string): void {
    if (!fs.existsSync(path.resolve(this.__dirname, dir))) {
      try {
        fs.mkdirSync(path.resolve(this.__dirname, dir), { recursive: true });
        logger.info(`Dir ${dir} created`);
      } catch(error) {
        logger.error(error);
        process.exit(1);
      }
    }
  }


  async getAll(): Promise<PictureDT[]> {
    const dbPictures = await this.pictureRepo.getAll();
    return dbPictures.map(dbPicture => PictureMapper.domainToDT(dbPicture));
  }

  async getById(id: number): Promise<PictureDT> {
    const dbPicture = await this.pictureRepo.getById(id);
    return PictureMapper.domainToDT(dbPicture);
  }

  async create(
    subjectId: number,
    altTextLocDTN: LocStringDTN,
    tempFilePath: string,
    originalFileName: string,
    type: 'foodPicture' | 'modulePicture',
    transaction?: GenericTransaction
  ): Promise<PictureDT> {

    let targetFilePath: string;

    switch (type) {
      case 'foodPicture':
        targetFilePath = path.join(this.__dirname, this.foodPicturesDir, `./${type}-${subjectId}.png`);
        break;
      case 'modulePicture':
        targetFilePath = path.join(this.__dirname, this.modulePicturesDir, `./${type}-${subjectId}.png`);
        break;
      default:
        throw new ApplicationError('Invalid picture type');
    }

    // Restrict to .png
    // Maybe change this to compressor / decompressor / image manager of some kind?
    // If someday: apply it as dependecy injection to PictureService
    if (path.extname(originalFileName).toLowerCase() === '.png') {
      try {
        await fs.promises.rename(tempFilePath, targetFilePath);
      } catch (e) {
        logger.shout('Filesystem cannot rename a file!', e);
        throw new ApplicationError('Filesystem cannot rename a file. Please, contact admins');
      }
    } else {
      try {
        await fs.promises.unlink(tempFilePath);
      } catch(e) {
        logger.shout('Filesystem cannot delete a file!', e);
        throw new ApplicationError('Filesystem cannot delete a file. Please, contact admins');
      }
      throw new UploadFileError('Only .png images are accepted');
    }

    const altTextLoc = await this.locStringRepo.create(
      altTextLocDTN,
      transaction
    );

    const picture = await this.pictureRepo.create(
      targetFilePath,
      altTextLoc,
      transaction
    );

    return PictureMapper.domainToDT(picture);
  }

  async update(
    pictureDT: PictureDT,
    oldPath: string,
    newPath: string,
    transaction?: GenericTransaction
  ): Promise<PictureDT> {
    try {
      await fs.promises.rename(oldPath, newPath);
    } catch (e) {
      logger.shout('Filesystem cannot rename a file!', e);
      throw new ApplicationError('Filesystem cannot rename a file. Please, contact admins');
    }

    const picture = await this.pictureRepo.update(
      pictureDT.id,
      newPath,
      transaction
    );

    return PictureMapper.domainToDT(picture);
  }

  async updateAltTextLoc(id: number, altTextLoc: LocString, transaction?: GenericTransaction): Promise<PictureDT> {
    const noOuterTransaction = !transaction;
    if (!transaction) {
      transaction = await this.transactionHandler.start();
    }

    try {
      await this.locStringRepo.update(altTextLoc, transaction);
      const picture = await this.pictureRepo.getById(id);

      if (noOuterTransaction) {
        await transaction.commit();
      }

      return PictureMapper.domainToDT(picture);
    } catch (err) {
      if (noOuterTransaction) {
        await transaction.rollback();
      }
      throw err;
    }
  }

  async remove(id: number, transaction?: GenericTransaction, deleteFile?: boolean): Promise<void> {

    const picture = await this.pictureRepo.getById(id);

    if (deleteFile) {
      await this.deletePictureFile(picture.src);
    }

    await this.locStringRepo.removeWithCount([picture.altTextLoc.id], transaction);
    await this.pictureRepo.remove(id, transaction);
  }

  async deletePictureFile(src: string): Promise<void> {
    try {
      await fs.promises.unlink(src);
    } catch (e) {
      logger.shout('Filesystem cannot delete a file!', e);
      throw new ApplicationError('Filesystem cannot delete a file. Please, contact admins');
    }
  }

  // async removeAll(wipeFiles: boolean): Promise<void> {
  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    // if (wipeFiles) {
    //   fs.rmSync(this.foodPicturesDir, { recursive: true, force: true });
    //   fs.rmSync(this.modulePicturesDir, { recursive: true, force: true });
    //   this.createDirIfNotExists(this.foodPicturesDir);
    //   this.createDirIfNotExists(this.modulePicturesDir);
    // }
    await this.pictureRepo.removeAll();
  }
}