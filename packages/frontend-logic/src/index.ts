export {
  useAppDispatch as customerUseAppDispatch,
  useAppSelector as customerUseAppSelector
} from "./customer/hooks/reduxHooks";
export {
  useAppDispatch as adminUseAppDispatch,
  useAppSelector as adminUseAppSelector
} from "./admin/hooks/reduxHooks";
export {
  useAppDispatch as managerUseAppDispatch,
  useAppSelector as managerUseAppSelector
} from "./manager/hooks/reduxHooks";

export type { RootState as AdminRootState,  } from "./admin/store";