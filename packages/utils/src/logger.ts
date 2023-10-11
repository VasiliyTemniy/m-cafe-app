/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
const info = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(message, ...optionalParams);
  }
};

const error = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(message, ...optionalParams);
  }
};

const shout = (message?: any, ...optionalParams: any[]) => {
  console.log('SHOUT HEEEEREEEE!');
  console.log('SHOUT HEEEEREEEE!');
  console.log('SHOUT HEEEEREEEE!');
  console.log(message, ...optionalParams);
  console.log('END OF SHOUT');
  console.log('END OF SHOUT');
  console.log('END OF SHOUT');
};

export const logger = { info, error, shout };