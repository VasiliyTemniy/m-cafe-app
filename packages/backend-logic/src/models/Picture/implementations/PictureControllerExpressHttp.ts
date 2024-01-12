import type { IPictureControllerHttp, IPictureService } from '../interfaces';
import type { Request, Response } from 'express';
import type { PictureDT } from '@m-market-app/models';
import { RequestBodyError } from '@m-market-app/utils';
import { isLocStringDT } from '@m-market-app/models';


export class PictureControllerExpressHttp implements IPictureControllerHttp {
  constructor ( readonly service: IPictureService ) {}

  async updateAltTextLoc(req: Request, res: Response): Promise<void> {
    if (!isLocStringDT(req.body))
      throw new RequestBodyError('Invalid edit food picture request body');

    const { id, mainStr, secStr, altStr } = req.body;

    const updatedPicture: PictureDT = await this.service.updateAltTextLoc(
      Number(req.params.id),
      {
        id,
        mainStr,
        secStr,
        altStr
      }
    );

    res.status(200).json(updatedPicture);
  }
}