import type { LocString } from './LocString.js';
import type { Picture } from './Picture.js';

export class DynamicModule {
  constructor (
    readonly id: number,
    readonly moduleType: string,
    readonly page: string,
    readonly placement: number,
    readonly placementType: string,
    readonly locString?: LocString,
    readonly className?: string,
    readonly inlineCss?: string,
    readonly picture?: Picture,
    readonly url?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}