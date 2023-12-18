export enum DynamicModuleType {
  Menu = 'menu',
  Page = 'page',
  Picture = 'picture',
  Gallery = 'gallery',
  Text = 'text',
  Video = 'video',
}

export const DynamicModuleTypeNumericMapping = {
  [DynamicModuleType.Menu]: 0,
  [DynamicModuleType.Page]: 1,
  [DynamicModuleType.Picture]: 2,
  [DynamicModuleType.Gallery]: 3,
  [DynamicModuleType.Text]: 4,
  [DynamicModuleType.Video]: 5,
};

export const NumericToDynamicModuleTypeMapping: { [key: number]: DynamicModuleType } = {};
Object.values(DynamicModuleType).forEach((value) => {
  NumericToDynamicModuleTypeMapping[DynamicModuleTypeNumericMapping[value]] = value;
});

export const isDynamicModuleType = (type: unknown): type is DynamicModuleType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(DynamicModuleType).includes(type as DynamicModuleType);
};


export enum DynamicModulePlacementType {
  BeforeMenu = 'beforeMenu',
  AfterMenu = 'afterMenu',
  BeforeContent = 'beforeContent',
  AfterContent = 'afterContent',
  BeforeFooter = 'beforeFooter',
  AfterFooter = 'afterFooter',
  // Add some for side panels?
}

export const DynamicModulePlacementTypeNumericMapping = {
  [DynamicModulePlacementType.BeforeMenu]: 0,
  [DynamicModulePlacementType.AfterMenu]: 1,
  [DynamicModulePlacementType.BeforeContent]: 2,
  [DynamicModulePlacementType.AfterContent]: 3,
  [DynamicModulePlacementType.BeforeFooter]: 4,
  [DynamicModulePlacementType.AfterFooter]: 5,
};

export const NumericToDynamicModulePlacementTypeMapping: { [key: number]: DynamicModulePlacementType } = {};
Object.values(DynamicModulePlacementType).forEach((value) => {
  NumericToDynamicModulePlacementTypeMapping[DynamicModulePlacementTypeNumericMapping[value]] = value;
});

export const isDynamicModulePlacementType = (type: unknown): type is DynamicModulePlacementType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(DynamicModulePlacementType).includes(type as DynamicModulePlacementType);
};