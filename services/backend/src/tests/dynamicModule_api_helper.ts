import { DynamicModuleData, LocStringData } from "@m-cafe-app/db";
import { LocString, DynamicModule } from '@m-cafe-app/db';


export const initialDynamicModuleLocStrings: Omit<LocStringData, 'id'>[] = [
  {
    mainStr: 'Покупайти нащ щаверма! У нас лючче! Дещевше! Усигда цена 150%, только сегодня скидка 15%, итого 127,5% от реальной цены! Спешите, не смешите',
    secStr: 'This is actually not as intimidating as it is written',
  },
  {
    mainStr: 'О нас',
    secStr: 'About us',
  },
  {
    mainStr: 'Ишшо реклама!',
    secStr: 'Another advert!',
  },
  {
    mainStr: 'Больше рекламы!',
    secStr: 'Moar adverts!',
  }
];

export const initialDynamicModules: Omit<DynamicModuleData, 'id' | 'locStringId' | 'pictureId'>[] = [
  {
    // id: 1,
    moduleType: 'advertisement',
    page: 'all',
    placement: 0,
    placementType: 'afterMenuPicFirst'
  },
  {
    // id: 2,
    moduleType: 'header',
    page: 'all',
    placement: 1,
    placementType: 'leftRight',
    url: 'http://ya.ru'
  },
  {
    // id: 3,
    moduleType: 'advertisement',
    page: 'about',
    placement: 2,
    placementType: 'afterMenuPicFirst',
    className: 'advertisement-large-container',
    inlineCss: '{ backgroundColor: red }'
  },
  {
    // id: 4,
    moduleType: 'advertisement',
    page: 'all',
    placement: 3,
    placementType: 'afterMenuPicFirst'
  }
];


export const initDynamicModules = async (dynamicModulesCount?: number) => {

  const locStrings = await LocString.bulkCreate(initialDynamicModuleLocStrings);

  let i = 0;

  const dynamicModules = [];

  for (const newDynamicModule of initialDynamicModules) {
    const dynamicModule = await DynamicModule.create({
      locStringId: locStrings[i].id,
      ...newDynamicModule
    });
    i++;
    dynamicModules.push(dynamicModule);

    if (dynamicModulesCount && i >= dynamicModulesCount) return dynamicModules;
  }

  return dynamicModules;
};