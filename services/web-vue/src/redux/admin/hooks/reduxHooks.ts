import { inject, computed } from "vue";
import type { RootState } from '../store';
import { store } from '../store';
import { storeKey } from "../../utils/storePlugin";


export const useAppDispatch = () => store.dispatch;


type EqualityFn<T> = (a: T, b: T) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NoInfer<T> = [T][T extends any ? 0 : never];

interface UseSelectorOptions<Selected = unknown> {
  equalityFn?: EqualityFn<Selected>;
  stabilityCheck?: CheckFrequency;
  noopCheck?: CheckFrequency;
}

type CheckFrequency = 'never' | 'once' | 'always';

interface TypedUseSelectorHook<TState> {
  <TSelected>(selector: (state: TState) => TSelected, equalityFn?: EqualityFn<NoInfer<TSelected>>): TSelected;
  <Selected = unknown>(selector: (state: TState) => Selected, options?: UseSelectorOptions<Selected>): Selected;
}

export const useAppSelector: TypedUseSelectorHook<RootState> = <State extends RootState = RootState>(
  fn: (state: State) => State[keyof State]
) => {
  const rootStore = inject(storeKey) as { state: RootState };
  return computed(() => fn(rootStore.state as State)).value;
};