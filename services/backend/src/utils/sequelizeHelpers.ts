import { LocString } from '../models';
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