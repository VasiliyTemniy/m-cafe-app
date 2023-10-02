// Maybe will be updated
export const componentTypesReadonly = [
  'input',
  'container',
  'wrapper',
  'tooltip',
  'text',
  'button',
  'button-group',
  'nav-item',
  'notification',
  'modal',
  'svg-image',
  'svg-button',
  'switch',
  'dropbox',
  'table',
  'image',
  'scrollbar',
  'layout'
] as const;

export type ComponentType = typeof componentTypesReadonly[number];

export const componentTypes = [ ...componentTypesReadonly as readonly string[] ];

export const isComponentType = (componentType: string): componentType is ComponentType => {
  return componentTypes.includes(componentType);
};

export const layoutComponentNamesReadonly = [
  // PLACEHOLDER
] as const;

export const layoutComponentNames = [ ...layoutComponentNamesReadonly as readonly string[] ];

export const isLayoutComponentName = (componentName: string): componentName is string => {
  return layoutComponentNames.includes(componentName);
};



export const componentGroupsReadonly = [ ...componentTypesReadonly, ...layoutComponentNamesReadonly ] as const;

export const componentGroups = [ ...componentTypes, ...layoutComponentNames ];