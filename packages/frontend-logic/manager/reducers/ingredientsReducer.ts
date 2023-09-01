import { createSlice } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/errorHandler';
import { AppDispatch } from '../store';
import ingredientService from '../services/ingredient';
import { ApplicationError, IngredientDT, isIngredientDT, SafeyAny } from '@m-cafe-app/utils';
import { TFunction } from '../../shared/hooks';

type SetIngredientAction = {
  payload: {
    ingredients: IngredientDT[],
  };
};


export type IngredientState = IngredientDT[];

const initialState: IngredientState = [];

export const sharedIngredientSliceBase = {
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients(state: IngredientState, action: SetIngredientAction) {
      return { ...action.payload.ingredients };
    }
  }
};

const ingredientSlice = createSlice({
  ...sharedIngredientSliceBase
});

export const { setIngredients } = ingredientSlice.actions;

export const initIngredients = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const ingredients = await ingredientService.getIngredients();
      if (!Array.isArray(ingredients)) throw new ApplicationError('Server has sent wrong data', { current: ingredients });
      for (const ingredient of ingredients) {
        if (!isIngredientDT(ingredient)) throw new ApplicationError('Server has sent wrong data', { all: ingredients, current: ingredient as SafeyAny });
      }
      dispatch(setIngredients({ ingredients }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default ingredientSlice.reducer;