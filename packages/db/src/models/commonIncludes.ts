import { Address } from './Address.js';
import { LocString } from './LocString.js';
import { Food } from './Food.js';
import { Ingredient } from './Ingredient.js';

export const includeAddress = {
  model: Address,
  as: 'address',
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  },
};

export const includeNameLoc = {
  model: LocString,
  as: 'nameLoc',
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
};

export const includeDescriptionLoc = {
  model: LocString,
  as: 'descriptionLoc',
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
};

export const includeNestedNameLoc = {
  model: LocString,
  as: 'nameLoc',
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
};

export const includeNestedDescriptionLoc = {
  model: LocString,
  as: 'descriptionLoc',
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
};

export const includeStockMeasureLoc = {
  model: LocString,
  as: 'stockMeasureLoc',
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
};


export const includeFoodComponentData = [
  {
    model: Food,
    as: 'food',
    attributes: {
      exclude: ['nameLocId', 'descriptionLocId', 'foodTypeId', 'price', 'createdAt', 'updatedAt']
    },
    include: [
      {
        model: LocString,
        as: 'nameLoc',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      {
        model: LocString,
        as: 'descriptionLoc',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    ]
  },
  {
    model: Ingredient,
    as: 'ingredient',
    attributes: {
      exclude: ['nameLocId', 'stockMeasureLocId', 'createdAt', 'updatedAt']
    },
    include: [
      {
        model: LocString,
        as: 'nameLoc',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      {
        model: LocString,
        as: 'stockMeasureLoc',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    ]
  }
];