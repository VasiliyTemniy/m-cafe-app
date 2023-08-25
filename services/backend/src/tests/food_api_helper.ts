import { FoodData, FoodTypeData, LocStringData } from "@m-cafe-app/db";
import { Food, FoodType, LocString } from '@m-cafe-app/db';


export const initialFoodLocStrings: Omit<LocStringData, 'id'>[] = [
  {
    mainStr: 'Роллы',
    secStr: 'Rolls',
    altStr: 'Roullettesse'
  },
  {
    mainStr: 'Те самые роллы',
    secStr: 'Rolls, you know',
    altStr: 'Imagine that it`s not engrish'
  },
  {
    mainStr: 'Бургеры',
    secStr: 'Burgers',
    altStr: 'Bourgerettes'
  },
  {
    mainStr: 'Бургеры - жратва такая',
    secStr: 'Burgers is what you can eat',
    altStr: 'Imagine that it`s not engrish'
  },
  {
    mainStr: 'Напитки',
    secStr: 'Drinks',
    altStr: 'Wasserunterubercanisterdrinkone'
  },
  {
    mainStr: 'Соки, воды, газировки, алкоголъ',
    secStr: 'You can drink this',
    altStr: 'Imagine that it`s not engrish'
  },
  {
    mainStr: 'Сеты'
  },
  {
    mainStr: 'Набор еды из различных других типов'
  },
  {
    mainStr: 'Калифорния',
    secStr: 'California',
    altStr: '32dfg35k3df'
  },
  {
    mainStr: 'Вкусняшко',
    secStr: 'Mm, tasty',
    altStr: 'abirvalg'
  },
  {
    mainStr: 'Филадельфия',
  },
  {
    mainStr: 'Вкусняшко тоже',
  },
  {
    mainStr: 'Шаверма классическая',
  },
  {
    mainStr: 'Нежный лаваш, сочное мясо, которое вчера даже не мяукало',
  },
  {
    mainStr: 'МаргаритаБургер',
  },
  {
    mainStr: 'Бургер, правда?',
  }
];

export const initialFoodTypes: Omit<FoodTypeData, 'id' | 'nameLocId' | 'descriptionLocId'>[] = [
  {
    // id: 1,
    // nameLocId: 1,
    // descriptionLocId: 2
  },
  {
    // id: 2,
    // nameLocId: 3,
    // descriptionLocId: 4
  },
  {
    // id: 3,
    // nameLocId: 5,
    // descriptionLocId: 6
  },
  {
    // id: 4,
    // nameLocId: 7,
    // descriptionLocId: 8
  }
];

export const initialFoods: Omit<FoodData, 'id' | 'nameLocId' | 'descriptionLocId' | 'foodTypeId'>[] = [
  {
    // id: 1,
    // nameLocId: 9,
    // descriptionLocId: 10,
    price: 150,
    // foodTypeId: 1
  },
  {
    // id: 2,
    // nameLocId: 11,
    // descriptionLocId: 12,
    price: 250,
    // foodTypeId: 1
  },
  {
    // id: 3,
    // nameLocId: 13,
    // descriptionLocId: 14,
    price: 357,
    // foodTypeId: 1
  },
  {
    // id: 4,
    // nameLocId: 15,
    // descriptionLocId: 16,
    price: 480,
    // foodTypeId: 2
  }
];


export const initFoodTypes = async (foodTypesCount?: number) => {

  const locStrings = await LocString.bulkCreate(initialFoodLocStrings);

  let i = 0;

  let j = 0;

  const foodTypes = [];

  for (const _newFoodType of initialFoodTypes) {
    const foodType = await FoodType.create({
      nameLocId: locStrings[i].id,
      descriptionLocId: locStrings[i+1].id
    });
    i += 2;
    j++;
    foodTypes.push(foodType);

    if (foodTypesCount && j >= foodTypesCount) return foodTypes;
  }

  return foodTypes;
};

export const initFoods = async (foodsCount?: number) => {

  const locStrings = await LocString.bulkCreate(initialFoodLocStrings);

  let i = 0;

  const foodTypes = [];

  for (const _newFoodType of initialFoodTypes) {
    const foodType = await FoodType.create({
      nameLocId: locStrings[i].id,
      descriptionLocId: locStrings[i+1].id
    });
    i += 2;
    foodTypes.push(foodType);
  }

  let j = 0;

  const foods = [];

  for (const newFood of initialFoods) {
    const food = await Food.create({
      nameLocId: locStrings[i].id,
      descriptionLocId: locStrings[i+1].id,
      price: newFood.price,
      foodTypeId: foodTypes[j].id
    });
    i += 2;
    j++;
    foods.push(food);

    if (foodsCount && j >= foodsCount) return foods;
  }

  return foods;
};