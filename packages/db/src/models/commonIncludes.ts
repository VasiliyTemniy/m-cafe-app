import { Address } from './Address.js';
import { LocString } from './LocString.js';
import { Food } from './Food.js';
import { Ingredient } from './Ingredient.js';
import { FoodComponent } from './FoodComponent.js';
import { FoodPicture } from './FoodPicture.js';
import { Picture } from './Picture.js';

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

export const includeAltTextLoc = {
  model: LocString,
  as: 'altTextLoc',
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
};


export const includeFoodComponentData = [
  {
    model: Food,
    as: 'food', // as: 'component' ??? No, it is mapped to 'component' in afterFind hook
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
    as: 'ingredient', // as: 'component' ??? No, it is mapped to 'component' in afterFind hook
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


export const includeFoodComponents = {
  model: FoodComponent,
  as: 'foodComponents',
  include: includeFoodComponentData,
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
};


export const includeFoodMainPicture = {
  model: FoodPicture,
  as: 'mainPicture',
  where: {
    orderNumber: 0
  },
  include: [
    {
      model: Picture,
      as: 'picture',
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [
        includeAltTextLoc
      ]
    }
  ]
};


export const includeFoodGallery = {
  model: FoodPicture,
  as: 'gallery',
  include: [
    {
      model: Picture,
      as: 'picture',
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [
        includeAltTextLoc
      ]
    }
  ]
};


export const includeFoodSimple = {
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
    }
  ]
};