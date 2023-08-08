import { FoodData, FoodTypeData, LocStringData } from "@m-cafe-app/db-models";
import { Food, FoodType, LocString } from '../models';


export const initialFoodLocStrings: Omit<LocStringData, 'id'>[] = [
  {
    ruString: 'Роллы',
    enString: 'Rolls',
    altString: 'Roullettesse'
  },
  {
    ruString: 'Те самые роллы',
    enString: 'Rolls, you know',
    altString: 'Imagine that it`s not engrish'
  },
  {
    ruString: 'Бургеры',
    enString: 'Burgers',
    altString: 'Bourgerettes'
  },
  {
    ruString: 'Бургеры - жратва такая',
    enString: 'Burgers is what you can eat',
    altString: 'Imagine that it`s not engrish'
  },
  {
    ruString: 'Напитки',
    enString: 'Drinks',
    altString: 'Wasserunterubercanisterdrinkone'
  },
  {
    ruString: 'Соки, воды, газировки, алкоголъ',
    enString: 'You can drink this',
    altString: 'Imagine that it`s not engrish'
  },
  {
    ruString: 'Сеты'
  },
  {
    ruString: 'Набор еды из различных других типов'
  },
  {
    ruString: 'Калифорния',
    enString: 'California',
    altString: '32dfg35k3df'
  },
  {
    ruString: 'Вкусняшко',
    enString: 'Mm, tasty',
    altString: 'abirvalg'
  },
  {
    ruString: 'Филадельфия',
  },
  {
    ruString: 'Вкусняшко тоже',
  },
  {
    ruString: 'Шаверма классическая',
  },
  {
    ruString: 'Нежный лаваш, сочное мясо, которое вчера даже не мяукало',
  },
  {
    ruString: 'МаргаритаБургер',
  },
  {
    ruString: 'Бургер, правда?',
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


export const initFoodTypes = async () => {

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