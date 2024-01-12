import type { FoodDT, PictureDT } from '@m-cafe-app/models';
import type { IFoodControllerHttp, IFoodService } from '../interfaces';
import type { Request, Response } from 'express';
import { isFoodDTN, isFoodDT, isPictureForFoodDTN, isPictureDT, isFoodPictureDTNUMany } from '@m-cafe-app/models';
import { RequestBodyError, RequestQueryError, UploadFileError } from '@m-cafe-app/utils';


export class FoodControllerExpressHttp implements IFoodControllerHttp {
  constructor( readonly service: IFoodService ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const foods: FoodDT[] = await this.service.getAll();
    res.status(200).json(foods);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const food: FoodDT = await this.service.getById(Number(req.params.id));
    res.status(200).json(food);
  }

  async getByIdWithAssociations(req: Request, res: Response): Promise<void> {

    let withComponents: boolean = false;
    let withMainPicture: boolean = false;
    let withGallery: boolean = false;

    if (req.query.withComponents) {
      withComponents = req.query.withComponents === 'true';
    }

    if (req.query.withMainPicture) {
      withMainPicture = req.query.withMainPicture === 'true';
    }

    if (req.query.withGallery) {
      withGallery = req.query.withGallery === 'true';
    }

    const food: FoodDT = await this.service.getByIdWithAssociations(Number(req.params.id), {
      components: withComponents,
      mainPicture: withMainPicture,
      gallery: withGallery
    });

    res.status(200).json(food);
  }

  async getSomeWithAssociations(req: Request, res: Response): Promise<void> {
    
    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    let foodTypeId: number | undefined = undefined;
    let withComponents: boolean = false;
    let withMainPicture: boolean = false;
    let withGallery: boolean = false;

    if (req.query.limit) {
      if (isNaN(Number(req.query.limit))) throw new RequestQueryError('Incorrect query string');
      limit = Number(req.query.limit);
    }

    if (req.query.offset) {
      if (isNaN(Number(req.query.offset))) throw new RequestQueryError('Incorrect query string');
      offset = Number(req.query.offset);
    }

    if (req.query.foodTypeId) {
      if (isNaN(Number(req.query.foodTypeId))) throw new RequestQueryError('Incorrect query string');
      foodTypeId = Number(req.query.foodTypeId);
    }

    if (req.query.withComponents) {
      withComponents = req.query.withComponents === 'true';
    }

    if (req.query.withMainPicture) {
      withMainPicture = req.query.withMainPicture === 'true';
    }

    if (req.query.withGallery) {
      withGallery = req.query.withGallery === 'true';
    }

    const food: FoodDT[] = await this.service.getSomeWithAssociations({
      components: withComponents,
      mainPicture: withMainPicture,
      gallery: withGallery
    }, limit, offset, foodTypeId);

    res.status(200).json(food);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isFoodDTN(req.body))
      throw new RequestBodyError('Invalid new food request body');

    const { nameLoc, descriptionLoc, foodTypeId, price } = req.body;

    const food: FoodDT = await this.service.create({
      nameLoc,
      descriptionLoc,
      foodTypeId,
      price
    });

    res.status(201).json(food);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!isFoodDT(req.body))
      throw new RequestBodyError('Invalid edit food request body');

    const { nameLoc, descriptionLoc, foodType, price } = req.body;

    const updatedFood: FoodDT = await this.service.update({
      id: Number(req.params.id),
      nameLoc,
      descriptionLoc,
      foodType,
      price
    });

    res.status(200).json(updatedFood);
  }

  async remove(req: Request, res: Response): Promise<void> {
    await this.service.remove(Number(req.params.id));
    res.status(204).end();
  }

  async removeAll(req: Request, res: Response): Promise<void> {
    await this.service.removeAll();
    res.status(204).end();
  }

  async addPicture(req: Request, res: Response): Promise<void> {
    if (!isPictureForFoodDTN(req.body))
      throw new RequestBodyError('Invalid new food picture request body');
    if (!req.file)
      throw new UploadFileError('File cannot be read');

    const { foodId, orderNumber, altTextMainStr, altTextSecStr, altTextAltStr } = req.body;

    const newPicture: PictureDT = await this.service.addPicture(
      {
        foodId,
        orderNumber,
        altTextMainStr,
        altTextSecStr,
        altTextAltStr
      },
      req.file.path,
      req.file.originalname
    );

    res.status(201).json(newPicture);
  }

  async updatePicturesOrder(req: Request, res: Response): Promise<void> {
    if (!isFoodPictureDTNUMany(req.body))
      throw new RequestBodyError('Invalid edit food pictures order request body');

    // No destructuring and restructuring?...

    await this.service.updatePicturesOrder(req.body);

    res.status(200).end();
  }

  async removePicture(req: Request, res: Response): Promise<void> {
    if (!isPictureDT(req.body))
      throw new RequestBodyError('Invalid remove food picture request body');

    const { id, src, altTextLoc } = req.body;

    await this.service.removePicture(
      {
        id,
        src,
        altTextLoc
      },
      Number(req.params.id)
    );

    res.status(204).end();
  }

  async removePicturesByFoodId(req: Request, res: Response): Promise<void> {
    await this.service.removePicturesByFoodId(Number(req.params.id));

    res.status(204).end();
  }
}