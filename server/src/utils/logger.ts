const info = (params: String) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(params)
  }
}

const error = (params: String) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(params)
  }
}

export default { info, error }