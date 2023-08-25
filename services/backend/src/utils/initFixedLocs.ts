import { FixedLocData, FixedLoc, LocString } from '@m-cafe-app/db';
import { NewLocString } from '@m-cafe-app/utils';

export const initFixedLocs = async () => {

  const fixedLocs = [] as FixedLoc[];

  for (const fixedLoc of initialFixedLocs) {

    // No LocString update if found!
    const foundFixedLoc = await FixedLoc.findOne({ where: { name: fixedLoc.name }});

    if (!foundFixedLoc) {
      const savedLocString = await LocString.create(fixedLoc.locString);
      const savedFixedLoc = await FixedLoc.create({
        name: fixedLoc.name,
        locStringId: savedLocString.id
      });
      fixedLocs.push(savedFixedLoc);
      continue;
    }

    fixedLocs.push(foundFixedLoc);
  }

  return fixedLocs;

};

// Will be changed and updated
const initialFixedLocs: Array<Omit<FixedLocData, 'id' | 'locStringId'> & { locString: NewLocString }> = [
  {
    name: 'cart',
    locString: {
      mainStr: 'Корзина',
      secStr: 'Cart'
    }
  },
  {
    name: 'address',
    locString: {
      mainStr: 'Адрес',
      secStr: 'Address'
    }
  },
  {
    name: 'user',
    locString: {
      mainStr: 'Пользователь',
      secStr: 'User'
    }
  },
  {
    name: 'password',
    locString: {
      mainStr: 'Пароль',
      secStr: 'Password'
    }
  },
  {
    name: 'birthdate',
    locString: {
      mainStr: 'День рождения',
      secStr: 'Birthdate'
    }
  },
];