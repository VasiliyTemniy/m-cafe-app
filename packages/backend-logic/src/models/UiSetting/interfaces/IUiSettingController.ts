/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController } from '../../../utils';

export interface IUiSettingController extends ICRUDController {
  getByScope(...args: any): Promise<void>
  reset(...args: any): Promise<void>
}