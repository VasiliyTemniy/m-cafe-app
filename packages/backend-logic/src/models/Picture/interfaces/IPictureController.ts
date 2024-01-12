/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';


/**
 * Picture controller with only one method: updateAltTextLoc for a picture
 */
export interface IPictureController {
  updateAltTextLoc(...args: any): Promise<void>;
}

/**
 * Picture http controller with only one method: updateAltTextLoc for a picture
 */
export interface IPictureControllerHttp {
  updateAltTextLoc(req: Request, res: Response): Promise<void>;
}