import type { DynamicModulePageType, DynamicModulePlacementType, DynamicModulePreset, DynamicModuleType } from '@m-cafe-app/shared-constants';
import type { LocS } from './Loc.js';
import type { PictureS } from './Picture.js';

export class DynamicModule {
  constructor (
    readonly id: number,
    readonly moduleType: DynamicModuleType,
    readonly placement: number,
    readonly placementType: DynamicModulePlacementType,
    readonly nestLevel: number,
    readonly pages: DynamicModulePageType[],
    readonly locs?: LocS[],
    readonly preset?: DynamicModulePreset,
    readonly className?: string,
    readonly inlineCss?: string,
    readonly pictures?: PictureS[],
    readonly url?: string,
    readonly childDynamicModules?: DynamicModule[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}