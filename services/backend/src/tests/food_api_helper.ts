import type { FoodDTN, FoodTypeDT, FoodTypeDTN, LocStringDTN } from '@m-cafe-app/models';
import { foodService, foodTypeService } from '../controllers';


export const initialFoodLocStrings: LocStringDTN[] = [
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

export const initialFoodTypes: FoodTypeDTN[] = [
  {
    nameLoc: initialFoodLocStrings[0],
    descriptionLoc: initialFoodLocStrings[1]
  },
  {
    nameLoc: initialFoodLocStrings[2],
    descriptionLoc: initialFoodLocStrings[3]
  },
  {
    nameLoc: initialFoodLocStrings[4],
    descriptionLoc: initialFoodLocStrings[5]
  },
  {
    nameLoc: initialFoodLocStrings[6],
    descriptionLoc: initialFoodLocStrings[7]
  }
];

export const initialFoods: Omit<FoodDTN, 'foodTypeId'>[] = [
  {
    nameLoc: initialFoodLocStrings[8],
    descriptionLoc: initialFoodLocStrings[9],
    price: 150,
    // foodTypeId: 1
  },
  {
    nameLoc: initialFoodLocStrings[10],
    descriptionLoc: initialFoodLocStrings[11],
    price: 250,
    // foodTypeId: 1
  },
  {
    nameLoc: initialFoodLocStrings[12],
    descriptionLoc: initialFoodLocStrings[13],
    price: 357,
    // foodTypeId: 1
  },
  {
    nameLoc: initialFoodLocStrings[14],
    descriptionLoc: initialFoodLocStrings[15],
    price: 480,
    // foodTypeId: 2
  }
];


export const initFoodTypes = async (foodTypesCount?: number) => {

  const foodTypes = [];

  let i = 0;

  for (const _newFoodType of initialFoodTypes) {
    const foodType = await foodTypeService.create(initialFoodTypes[i]);
    i++;
    foodTypes.push(foodType);

    if (foodTypesCount && i >= foodTypesCount) return foodTypes;
  }

  return foodTypes;
};

export const initFoods = async (foodTypes: FoodTypeDT[], foodsCount?: number) => {

  const foods = [];

  let i = 0;

  for (const newFood of initialFoods) {

    const randomFoodTypeId = foodTypes[Math.round(Math.random() * (foodTypes.length - 1))].id;

    const food = await foodService.create({
      ...newFood,
      foodTypeId: randomFoodTypeId
    });
    i++;
    foods.push(food);

    if (foodsCount && i >= foodsCount) return foods;
  }

  return foods;
};