export const productRatingLowest = !isNaN(Number(process.env.PRODUCT_RATING_LOWEST))
  ? Number(process.env.PRODUCT_RATING_LOWEST)
  : 1;
export const productRatingHighest = !isNaN(Number(process.env.PRODUCT_RATING_HIGHEST))
  ? Number(process.env.PRODUCT_RATING_HIGHEST)
  : 5;