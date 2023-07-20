const info = (params: string | string[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(params);
  }
};

const error = (params: string | string[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(params);
  }
};

const shout = (params: string | string[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('SHOUT HEEEEREEEE!');
    console.log('SHOUT HEEEEREEEE!');
    console.log('SHOUT HEEEEREEEE!');
    console.log(params);
    console.log('END OF SHOUT');
    console.log('END OF SHOUT');
    console.log('END OF SHOUT');
  }
};

export default { info, error, shout };