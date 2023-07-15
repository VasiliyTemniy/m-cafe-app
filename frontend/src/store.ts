import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
// import menuReducer from './reducers/menuReducer';
// import transactionsReducer from './reducers/transactionsReducer';
// import userReducer from './reducers/userReducer';
// import notificationsReducer from './reducers/notificationsReducer';
// import portfoliosReducer from './reducers/portfoliosReducer';
// import modalFormsReducer from './reducers/modalFormsReducer';
// import toolbarReducer from './reducers/toolbarReducer';
//import quotesReducer from './reducers/quotesReducer';

const store = configureStore({
  reducer: {
    // menu: menuReducer,
    // transactions: transactionsReducer,
    // user: userReducer,
    // notifications: notificationsReducer,
    // portfolios: portfoliosReducer,
    // modalForms: modalFormsReducer,
    // toolbar: toolbarReducer,
    //quotes: quotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

export default store;