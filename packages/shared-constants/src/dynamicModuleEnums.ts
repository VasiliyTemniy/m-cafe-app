export enum DynamicModuleType {
  Picture = 0,
  Gallery = 1,
  Text = 2,
  Video = 3,
  Button = 4,
  Menu = 5,
  SidePanel = 6,
  Page = 7,
  Footer = 8,
}

export const isDynamicModuleType = (type: unknown): type is DynamicModuleType =>
  (typeof type === 'number' || typeof type === 'string') && (type in DynamicModuleType);


export enum DynamicModulePlacementType {
  BeforeMenu = 0,
  AfterMenu = 1,
  BeforeContent = 2,
  AfterContent = 3,
  BeforeFooter = 4,
  AfterFooter = 5,
  Absolute = 6,
  StickyTop = 7,
  StickyBottom = 8,
  Top = 9,
  Bottom = 10,
  Center = 11,
}

export const isDynamicModulePlacementType = (type: unknown): type is DynamicModulePlacementType =>
  (typeof type === 'number' || typeof type === 'string') && (type in DynamicModulePlacementType);


export enum DynamicModulePageType {
  Products = 0,
  Authorization = 1,
  Orders = 2,
  Account = 3,
  Catalog = 4,
  Cms = 5,
  About = 6,
  Contacts = 7,
  Help = 8,
  Feedback = 9,
  NotFound = 10,
  Cart = 11,
  Checkout = 12,
  Payment = 13,
  Shipping = 14,
  Settings = 15,
  Admin = 16,
  Facility = 17,
  Search = 18,
  Events = 19,
}

export const isDynamicModulePageType = (type: unknown): type is DynamicModulePageType =>
  (typeof type === 'number' || typeof type === 'string') && (type in DynamicModulePageType);


export enum DynamicModulePreset {
  Menu = 0,
  Content = 1,
  Footer = 2,
  Gallery = 3,
  Cms = 4,
  About = 5,
  Contacts = 6,
  Help = 7,
  Feedback = 8,
  NotFound = 9,
  Cart = 10,
  Checkout = 11,
  Payment = 12,
  Shipping = 13,
  Settings = 14,
  Picture = 15,
  // Add moar presets
}

export const isDynamicModulePreset = (type: unknown): type is DynamicModulePreset =>
  (typeof type === 'number' || typeof type === 'string') && (type in DynamicModulePreset);