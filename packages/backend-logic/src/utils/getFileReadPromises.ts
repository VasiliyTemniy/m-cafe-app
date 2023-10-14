import { glob } from 'glob';
import { readFile } from 'fs/promises';

/**
 * @param path dirname like locales or src/controllers
 * @param ext file extension
 * @returns Promise of file contents strings
 */
export const getFileReadPromises = async (path: string, ext: string) => {

  // Rewrite this later

  const prodGlobPath = `${path}/`;
  const devRelativePath = `${path}/`;
  const devRelativePathWin32 = `${path}\\`;
  const ReplacePath = `./${path}/`;

  // Find all locales files
  const res = process.env.NODE_ENV === 'production'
    ? await glob(`${prodGlobPath}*.${ext}`)
    : await glob(`${devRelativePath}*.${ext}`);

  // Read all locales files
  const fileReadPromises = res.map(async (file) => {
    // Replace path is different for windows and in production src -> build
    const replacePath = process.platform === 'win32' ? devRelativePathWin32 :
      process.env.NODE_ENV === 'production' ? prodGlobPath : devRelativePath;

    const fileReadPromise = await readFile(file.replace(replacePath, ReplacePath), 'utf8');

    return fileReadPromise;
  });

  return await Promise.all(fileReadPromises);
};