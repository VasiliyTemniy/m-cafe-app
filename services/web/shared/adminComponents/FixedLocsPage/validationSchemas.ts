import type { TFunction } from '@m-market-app/frontend-logic/shared/hooks';
import * as yup from 'yup';

export const fixedLocValidationSchema = (t: TFunction) => {

  const tNode = 'fixedLocsPage.editFixedLocModal.validationErrors';

  return yup.object().shape({
    mainStr: yup
      .string()
      .trim()
      .required(t(`${tNode}.required.main`)),
    secStr: yup
      .string(),
    altStr:  yup
      .string()
  });
};