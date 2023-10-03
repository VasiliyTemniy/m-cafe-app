/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController } from '../../../utils';

export interface IUiSettingController extends ICRUDController {
  getAllByScope(...args: any): Promise<void>
}