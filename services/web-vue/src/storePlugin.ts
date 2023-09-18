import { reactive } from "vue";
import type { App } from "vue";
import type { EnhancedStore } from "@reduxjs/toolkit";
import type { RootState } from './redux/admin/store';

export const storeKey = Symbol("Redux-Store");

export const createRedux = (store: EnhancedStore) => {
    const rootStore = reactive<{ state: RootState }>({
        state: store.getState(),
    });
    const plugin = {
        install: (app: App) => {
            app.provide<{ state: RootState }>(storeKey, rootStore);

            store.subscribe(() => {
                rootStore.state = store.getState();
            });
        },
    };
    return plugin;
};