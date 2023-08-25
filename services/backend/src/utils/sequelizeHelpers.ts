import { Food, Ingredient, LocString } from '@m-cafe-app/db-models';
import { timestampsKeys } from '@m-cafe-app/utils';

export const includeNameLocNoTimestamps = {
  model: LocString,
  as: 'nameLoc',
  attributes: {
    exclude: [...timestampsKeys]
  }
};

export const includeNameLocNoTimestampsSecondLayer = {
  model: LocString,
  as: 'nameLoc',
  attributes: {
    exclude: [...timestampsKeys]
  }
};

export const includeDescriptionLocNoTimestamps = {
  model: LocString,
  as: 'descriptionLoc',
  attributes: {
    exclude: [...timestampsKeys]
  }
};

export const includeNameDescriptionLocNoTimestamps = [
  {
    model: LocString,
    as: 'nameLoc',
    attributes: {
      exclude: [...timestampsKeys]
    }
  },
  {
    model: LocString,
    as: 'descriptionLoc',
    attributes: {
      exclude: [...timestampsKeys]
    }
  }
];

// Object spread on an array was causing weird bugs when used on the same array in two different layers of include
// Workaround without deeeeep cloning...
export const includeNameDescriptionLocNoTimestampsSecondLayer = [
  {
    model: LocString,
    as: 'nameLoc',
    attributes: {
      exclude: [...timestampsKeys]
    }
  },
  {
    model: LocString,
    as: 'descriptionLoc',
    attributes: {
      exclude: [...timestampsKeys]
    }
  }
];

export const includeAltTextLocNoTimestamps = {
  model: LocString,
  as: 'altTextLoc',
  attributes: {
    exclude: [...timestampsKeys]
  }
};

export const includeLocStringNoTimestamps = {
  model: LocString,
  as: 'locString',
  required: false,
  attributes: {
    exclude: [...timestampsKeys]
  }
};

export const includeStockMeasureLocNoTimestamps = {
  model: LocString,
  as: 'stockMeasureLoc',
  attributes: {
    exclude: [...timestampsKeys]
  }
};

export const includeFoodComponentData = [
  {
    model: Food,
    as: 'food',
    attributes: {
      exclude: ['nameLocId', 'descriptionLocId', 'foodTypeId', 'price', ...timestampsKeys]
    },
    include: [
      { ...includeNameLocNoTimestamps }
    ]
  },
  {
    model: Ingredient,
    as: 'ingredient',
    attributes: {
      exclude: ['nameLocId', 'stockMeasureLocId', ...timestampsKeys]
    },
    include: [
      { ...includeNameLocNoTimestamps }
    ]
  }
];