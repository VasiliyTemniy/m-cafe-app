import { FixedLoc, LocString } from '@m-cafe-app/db';
import { ApplicationError, isNewLocString, isString, NewLocString } from '@m-cafe-app/utils';
import { glob } from 'glob';
import { readFile } from 'fs/promises';
import logger from './logger.js';


export const initFixedLocs = async () => {

  try {
    const fileReadResults = await getLocsFiles();

    for (const fileReadResult of fileReadResults) {

      // Strip JSONC comments
      const strippedFromCommentsFileReadResult = fileReadResult.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);

      const fixedLocTree = JSON.parse(strippedFromCommentsFileReadResult) as JSON;
      await parseLocTree(fixedLocTree);
    }

  } catch (error) {
    logger.error(error);
  }
};

const getLocsFiles = async () => {

  const prodFixedLocsGlobPath = 'locales/';
  const devFixedLocsRelativePath = 'locales/';
  const devFixedLocsRelativePathWin32 = 'locales\\';
  const fixedLocsReplacePath = './locales/';

  // Find all locales files
  const res = process.env.NODE_ENV === 'production'
    ? await glob(`${prodFixedLocsGlobPath}*.jsonc`)
    : await glob(`${devFixedLocsRelativePath}*.jsonc`);

  // Read all locales files
  const fileReadPromises = res.map(async (file) => {
    // Replace path is different for windows and in production src -> build
    const replacePath = process.platform === 'win32' ? devFixedLocsRelativePathWin32 :
      process.env.NODE_ENV === 'production' ? prodFixedLocsGlobPath : devFixedLocsRelativePath;

    const fileReadPromise = await readFile(file.replace(replacePath, fixedLocsReplacePath), "utf8");

    return fileReadPromise;
  });

  return await Promise.all(fileReadPromises);
};

const parseLocTree = async (locTree: JSON) => {

  for (const key in locTree) {
    const tNodeObj = locTree[key as keyof JSON];
    if (!isTNodeObj(tNodeObj)) throw new ApplicationError('Wrong locales structure! Check locales', { current: locTree });
    await parseTNodeTree(tNodeObj, key);
  }

};

const locKeys = ['mainStr', 'secStr', 'altStr'];

type TNodeObj = {
  [key:string] : unknown
};

const isTNodeObj = (obj: unknown): obj is TNodeObj => {
  if (!obj || !(typeof obj === 'object')) return false;
  for (const key in obj) {
    if (!isString(key)) return false;
  }
  return true;
};

const parseTNodeTree = async (tNodeParent: TNodeObj, tNodePath: string) => {

  for (const key in tNodeParent) {

    // If found locKey as mainStr, secStr, altStr then append foundFixedLocs
    if (locKeys.includes(key)) {
      if (!isNewLocString(tNodeParent)) throw new ApplicationError('Wrong locales structure! Check locales', { current: tNodeParent });
      await addFixedLocToDB(tNodePath, tNodeParent);
      // Break here means continue for parent of tNodeParent
      break;
    } else {
      const tNodeChild = tNodeParent[key];
      if (!isTNodeObj(tNodeChild)) throw new ApplicationError('Wrong JSON format! Check locales', { current: tNodeParent });
      await parseTNodeTree(tNodeChild, tNodePath + '.' + key);
    }
  }
};

const addFixedLocToDB = async (tNodePath: string, locString: NewLocString) => {
  const foundFixedLoc = await FixedLoc.findOne({ where: { name: tNodePath }});

  if (!foundFixedLoc) {
    const savedLocString = await LocString.create(locString);
    await FixedLoc.create({
      name: tNodePath,
      locStringId: savedLocString.id
    });
  }
};


// DEPRECATED
// export const initFixedLocs = async () => {

//   const fixedLocs = [] as FixedLoc[];

//   for (const fixedLoc of initialFixedLocs) {

//     // No LocString update if found!
//     const foundFixedLoc = await FixedLoc.findOne({ where: { name: fixedLoc.name }});

//     if (!foundFixedLoc) {
//       const savedLocString = await LocString.create(fixedLoc.locString);
//       const savedFixedLoc = await FixedLoc.create({
//         name: fixedLoc.name,
//         locStringId: savedLocString.id
//       });
//       fixedLocs.push(savedFixedLoc);
//       continue;
//     }

//     fixedLocs.push(foundFixedLoc);
//   }

//   return fixedLocs;

// };

// const initialFixedLocs: InitialFixedLoc[] = [
//   {
//     name: 'cart',
//     locString: {
//       mainStr: 'Корзина',
//       secStr: 'Cart'
//     }
//   },
//   {
//     name: 'address',
//     locString: {
//       mainStr: 'Адрес',
//       secStr: 'Address'
//     }
//   },
//   {
//     name: 'user',
//     locString: {
//       mainStr: 'Пользователь',
//       secStr: 'User'
//     }
//   },
//   {
//     name: 'password',
//     locString: {
//       mainStr: 'Пароль',
//       secStr: 'Password'
//     }
//   },
//   {
//     name: 'birthdate',
//     locString: {
//       mainStr: 'День рождения',
//       secStr: 'Birthdate'
//     }
//   },
// ];