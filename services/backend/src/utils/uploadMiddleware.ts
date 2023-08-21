import multer from 'multer';
import fs from 'fs';
import path from 'path';
import logger from './logger.js';

const __dirname = path.resolve();

const createDirIfNotExists = async (dir: string) => {
  if (!fs.existsSync(path.resolve(__dirname, dir))) {
    try {
      await fs.promises.mkdir(path.resolve(__dirname, dir), { recursive: true });
      logger.info(`Dir ${dir} created`);
    } catch(error) {
      logger.error(error);
      process.exit(1);
    }
  }
};

export const foodPicturesDir = './public/pictures/food';
export const modulesPicturesDir = './public/pictures/modules';
export const multerTempDir = './public/multerTemp';

await createDirIfNotExists('./public/pictures/food');
await createDirIfNotExists('./public/pictures/modules');
await createDirIfNotExists('./public/multerTemp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/multerTemp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
  }
});

export const upload = multer({ storage: storage });

// export const upload = multer({ dest: '../public/multerTemp' });