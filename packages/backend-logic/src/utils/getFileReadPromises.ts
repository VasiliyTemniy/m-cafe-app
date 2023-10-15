import { glob } from 'glob';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * @param dirPath dirname like locales or src/controllers
 * @param ext file extension
 * @returns Promise of file contents strings
 */
export const getFileReadPromises = async (dirPath: string, ext: string) => {

  const res = await glob(`${dirPath}/*.${ext}`);

  // Read all locales files
  const fileReadPromises = res.map(async (file) => {

    const fileReadPromise = await readFile(path.resolve(file), 'utf8');

    return fileReadPromise;
  });

  return await Promise.all(fileReadPromises);
};