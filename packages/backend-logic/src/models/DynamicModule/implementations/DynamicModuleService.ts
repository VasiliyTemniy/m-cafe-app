import type { ITransactionHandler } from '../../../utils';
import type { ILocStringRepo } from '../../LocString';
import type { IPictureService } from '../../Picture';
import type { IDynamicModuleRepo, IDynamicModuleService } from '../interfaces';
import type { DynamicModuleDT, DynamicModuleDTN, LocStringDTN, PictureForDynamicModuleDTN } from '@m-cafe-app/models';
import { LocStringMapper } from '../../LocString';
import { DynamicModuleMapper } from '../infrastructure';


export class DynamicModuleService implements IDynamicModuleService {
  constructor (
    readonly dynamicModuleRepo: IDynamicModuleRepo,
    readonly locStringRepo: ILocStringRepo,
    readonly pictureService: IPictureService,
    readonly transactionHandler: ITransactionHandler
  ) {}

  async getAll(): Promise<DynamicModuleDT[]> {
    const dynamicModules = await this.dynamicModuleRepo.getAll();
    return dynamicModules.map(dynamicModule => DynamicModuleMapper.domainToDT(dynamicModule));
  }

  async getById(id: number): Promise<DynamicModuleDT> {
    const dynamicModule = await this.dynamicModuleRepo.getById(id);
    return DynamicModuleMapper.domainToDT(dynamicModule);
  }

  async getAllByPage(page: string): Promise<DynamicModuleDT[]> {
    const dynamicModules = await this.dynamicModuleRepo.getAllByPage(page);
    return dynamicModules.map(dynamicModule => DynamicModuleMapper.domainToDT(dynamicModule));
  }

  async create(dynamicModuleDTN: DynamicModuleDTN): Promise<DynamicModuleDT> {
    
    const transaction = await this.transactionHandler.start();

    try {

      const createdLocString = dynamicModuleDTN.locString
        ? await this.locStringRepo.create(dynamicModuleDTN.locString, transaction)
        : undefined;

      // Cannot create picture here - picture data must contain file, file is sent via multipart/form-data

      const createdDynamicModule = await this.dynamicModuleRepo.create(
        dynamicModuleDTN,
        createdLocString,
        transaction
      );

      await transaction.commit();
      return DynamicModuleMapper.domainToDT(createdDynamicModule);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(dynamicModuleDT: DynamicModuleDT): Promise<DynamicModuleDT> {

    const transaction = await this.transactionHandler.start();

    try {

      if (dynamicModuleDT.locString) {
        await this.locStringRepo.update(LocStringMapper.dtToDomain(dynamicModuleDT.locString), transaction);
      }

      const updatedDynamicModule = await this.dynamicModuleRepo.update(
        DynamicModuleMapper.dtToDomain(dynamicModuleDT),
        transaction
      );

      await transaction.commit();
      return DynamicModuleMapper.domainToDT(updatedDynamicModule);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.transactionHandler.start();

    try {
      const foundDynamicModule = await this.dynamicModuleRepo.getById(id);
      if (foundDynamicModule.picture) {
        await this.pictureService.remove(foundDynamicModule.picture.id, transaction, true);
        await this.locStringRepo.removeWithCount([foundDynamicModule.picture.altTextLoc.id], transaction);
      }
      await this.dynamicModuleRepo.remove(id, transaction);
      if (foundDynamicModule.locString) {
        await this.locStringRepo.removeWithCount([foundDynamicModule.locString.id], transaction);
      }
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.dynamicModuleRepo.removeAll();
  }

  async addLocString(id: number, locStringDTN: LocStringDTN): Promise<DynamicModuleDT> {

    const transaction = await this.transactionHandler.start();

    try {
      
      const createdLocString = await this.locStringRepo.create(locStringDTN, transaction);

      const updatedDynamicModule = await this.dynamicModuleRepo.addLocString(
        id,
        createdLocString.id,
      );

      await transaction.commit();
      return DynamicModuleMapper.domainToDT(updatedDynamicModule);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removeLocString(id: number): Promise<DynamicModuleDT> {

    const transaction = await this.transactionHandler.start();

    try {

      const dynamicModule = await this.dynamicModuleRepo.getById(id);

      if (!dynamicModule.locString) {
        throw new Error('No locString to remove'); // Add a name for this specific error??
      }

      await this.locStringRepo.removeWithCount([dynamicModule.locString.id], transaction);
      
      const updatedDynamicModule = await this.dynamicModuleRepo.removeLocString(
        dynamicModule.id
      );

      await transaction.commit();
      return DynamicModuleMapper.domainToDT(updatedDynamicModule);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async addPicture(
    pictureDTN: PictureForDynamicModuleDTN,
    tempFilePath: string,
    originalFileName: string
  ): Promise<DynamicModuleDT> {

    const transaction = await this.transactionHandler.start();

    try {

      const picture = await this.pictureService.create(
        Number(pictureDTN.dynamicModuleId),
        {
          mainStr: pictureDTN.altTextMainStr,
          secStr: pictureDTN.altTextSecStr,
          altStr: pictureDTN.altTextAltStr
        },
        tempFilePath,
        originalFileName,
        'modulePicture',
        transaction
      );

      const updatedDynamicModule = await this.dynamicModuleRepo.addPicture(
        Number(pictureDTN.dynamicModuleId),
        picture.id,
        transaction
      );

      await transaction.commit();
      return DynamicModuleMapper.domainToDT(updatedDynamicModule);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removePicture(id: number): Promise<DynamicModuleDT> {

    const transaction = await this.transactionHandler.start();

    try {

      const dynamicModule = await this.dynamicModuleRepo.getById(id);

      if (!dynamicModule.picture) {
        throw new Error('No picture to remove'); // Add a name for this specific error??
      }

      await this.pictureService.remove(dynamicModule.picture.id, transaction, true);
  
      const updatedDynamicModule = await this.dynamicModuleRepo.removePicture(dynamicModule.id, transaction);

      await transaction.commit();
      return DynamicModuleMapper.domainToDT(updatedDynamicModule);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}