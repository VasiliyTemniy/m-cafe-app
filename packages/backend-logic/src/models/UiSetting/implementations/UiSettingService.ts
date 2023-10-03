import type { UiSettingDT, UiSettingDTNU } from '../UiSettingDT.js';
import type { IUiSettingService, IUiSettingRepo } from '../interfaces';
import { ApplicationError } from '@m-cafe-app/utils';
import { UiSettingMapper } from '../UiSettingMapper';

export class UiSettingService implements IUiSettingService {
  constructor( readonly dbRepo: IUiSettingRepo ) {}

  async getAll() {
    const uiSettings = await this.dbRepo.getAll();

    const res: UiSettingDT[] =
      uiSettings.map(uiSetting => UiSettingMapper.domainToHttp(uiSetting));

    return res;
  }

  async getById(id: number) {
    const uiSetting = await this.dbRepo.getById(id);

    const res: UiSettingDT = UiSettingMapper.domainToHttp(uiSetting);

    return res;
  }

  async getAllByScope(scope: string = 'defaultScope') {
    const uiSettings = await this.dbRepo.getAllByScope(scope);

    const res: UiSettingDT[] = uiSettings.map(uiSetting => UiSettingMapper.domainToHttp(uiSetting));

    return res;
  }

  async create(uiSettingDTNU: UiSettingDTNU) {
    if (!this.dbRepo.create) throw new ApplicationError(`Create method not implemented for repository ${this.dbRepo.constructor.name}`);
    const savedUiSetting = await this.dbRepo.create(uiSettingDTNU);

    const res: UiSettingDT = UiSettingMapper.domainToHttp(savedUiSetting);
    
    return res;
  }

  async update(uiSettingDTNU: UiSettingDTNU) {
    if (!this.dbRepo.update) throw new ApplicationError(`Update method not implemented for repository ${this.dbRepo.constructor.name}`);
    const updatedUiSetting = await this.dbRepo.update(uiSettingDTNU);

    const res: UiSettingDT = UiSettingMapper.domainToHttp(updatedUiSetting);
    
    return res;
  }

  async updateMany(uiSettingsDTNU: UiSettingDTNU[]) {
    if (!this.dbRepo.updateMany) throw new ApplicationError(`Update many method not implemented for repository ${this.dbRepo.constructor.name}`);
    const updatedUiSettings = await this.dbRepo.updateMany(uiSettingsDTNU);

    const res: UiSettingDT[] = updatedUiSettings.map(uiSetting => UiSettingMapper.domainToHttp(uiSetting));

    return res;
  }

  async remove(id: number) {
    if (!this.dbRepo.remove) throw new ApplicationError(`Remove method not implemented for repository ${this.dbRepo.constructor.name}`);
    await this.dbRepo.remove(id);
  }

}