export enum DynamicModuleType {
  Picture = 'picture',
  Gallery = 'gallery',
  Text = 'text',
  Video = 'video',
  Button = 'button',
  Menu = 'menu',
  SidePanel = 'sidePanel',
  Page = 'page',
  Footer = 'footer',
}

export const DynamicModuleTypeNumericMapping = {
  [DynamicModuleType.Picture]: 0,
  [DynamicModuleType.Gallery]: 1,
  [DynamicModuleType.Text]: 2,
  [DynamicModuleType.Video]: 3,
  [DynamicModuleType.Button]: 4,
  [DynamicModuleType.Menu]: 5,
  [DynamicModuleType.SidePanel]: 6,
  [DynamicModuleType.Page]: 7,
  [DynamicModuleType.Footer]: 8,
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
  Absolute = 'absolute',
  StickyTop = 'stickyTop',
  StickyBottom = 'stickyBottom',
  Top = 'top',
  Bottom = 'bottom',
  Center = 'center',
}

export const DynamicModulePlacementTypeNumericMapping = {
  [DynamicModulePlacementType.BeforeMenu]: 0,
  [DynamicModulePlacementType.AfterMenu]: 1,
  [DynamicModulePlacementType.BeforeContent]: 2,
  [DynamicModulePlacementType.AfterContent]: 3,
  [DynamicModulePlacementType.BeforeFooter]: 4,
  [DynamicModulePlacementType.AfterFooter]: 5,
  [DynamicModulePlacementType.Absolute]: 6,
  [DynamicModulePlacementType.StickyTop]: 7,
  [DynamicModulePlacementType.StickyBottom]: 8,
  [DynamicModulePlacementType.Top]: 9,
  [DynamicModulePlacementType.Bottom]: 10,
  [DynamicModulePlacementType.Center]: 11,
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


export enum DynamicModulePageType {
  Products = 'products',
  Authorization = 'authorization',
  Orders = 'orders',
  Account = 'account',
  Catalog = 'catalog',
  Cms = 'cms',
  About = 'about',
  Contacts = 'contacts',
  Help = 'help',
  Feedback = 'feedback',
  NotFound = 'notFound',
  Cart = 'cart',
  Checkout = 'checkout',
  Payment = 'payment',
  Shipping = 'shipping',
  Settings = 'settings',
  Admin = 'admin',
  Facility = 'facility',
  Search = 'search',
  Events = 'events',
}

export const DynamicModulePageTypeNumericMapping = {
  [DynamicModulePageType.Products]: 0,
  [DynamicModulePageType.Authorization]: 1,
  [DynamicModulePageType.Orders]: 2,
  [DynamicModulePageType.Account]: 3,
  [DynamicModulePageType.Catalog]: 4,
  [DynamicModulePageType.Cms]: 5,
  [DynamicModulePageType.About]: 6,
  [DynamicModulePageType.Contacts]: 7,
  [DynamicModulePageType.Help]: 8,
  [DynamicModulePageType.Feedback]: 9,
  [DynamicModulePageType.NotFound]: 10,
  [DynamicModulePageType.Cart]: 11,
  [DynamicModulePageType.Checkout]: 12,
  [DynamicModulePageType.Payment]: 13,
  [DynamicModulePageType.Shipping]: 14,
  [DynamicModulePageType.Settings]: 15,
  [DynamicModulePageType.Admin]: 16,
  [DynamicModulePageType.Facility]: 17,
  [DynamicModulePageType.Search]: 18,
  [DynamicModulePageType.Events]: 19,
};

export const NumericToDynamicModulePageTypeMapping: { [key: number]: DynamicModulePageType } = {};
Object.values(DynamicModulePageType).forEach((value) => {
  NumericToDynamicModulePageTypeMapping[DynamicModulePageTypeNumericMapping[value]] = value;
});

export const isDynamicModulePageType = (type: unknown): type is DynamicModulePageType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(DynamicModulePageType).includes(type as DynamicModulePageType);
};


export enum DynamicModulePreset {
  Menu = 'menu',
  Content = 'content',
  Footer = 'footer',
  Gallery = 'gallery',
  Cms = 'cms',
  About = 'about',
  Contacts = 'contacts',
  Help = 'help',
  Feedback = 'feedback',
  NotFound = 'notFound',
  Cart = 'cart',
  Checkout = 'checkout',
  Payment = 'payment',
  Shipping = 'shipping',
  Settings = 'settings',
  Picture = 'picture',
  // Add moar presets
}

export const DynamicModulePresetNumericMapping = {
  [DynamicModulePreset.Menu]: 0,
  [DynamicModulePreset.Content]: 1,
  [DynamicModulePreset.Footer]: 2,
  [DynamicModulePreset.Gallery]: 3,
  [DynamicModulePreset.Cms]: 4,
  [DynamicModulePreset.About]: 5,
  [DynamicModulePreset.Contacts]: 6,
  [DynamicModulePreset.Help]: 7,
  [DynamicModulePreset.Feedback]: 8,
  [DynamicModulePreset.NotFound]: 9,
  [DynamicModulePreset.Cart]: 10,
  [DynamicModulePreset.Checkout]: 11,
  [DynamicModulePreset.Payment]: 12,
  [DynamicModulePreset.Shipping]: 13,
  [DynamicModulePreset.Settings]: 14,
  [DynamicModulePreset.Picture]: 15,
};

export const NumericToDynamicModulePresetMapping: { [key: number]: DynamicModulePreset } = {};
Object.values(DynamicModulePreset).forEach((value) => {
  NumericToDynamicModulePresetMapping[DynamicModulePresetNumericMapping[value]] = value;
});

export const isDynamicModulePreset = (type: unknown): type is DynamicModulePreset => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(DynamicModulePreset).includes(type as DynamicModulePreset);
};