import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface UiState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  isLoading: boolean;
  toasts: Toast[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const initialState: UiState = {
  isSidebarOpen: false,
  theme: 'light',
  isLoading: false,
  toasts: [],
};

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isDarkTheme: computed(() => store.theme() === 'dark'),
    activeToasts: computed(() => store.toasts()),
  })),
  withMethods((store) => ({
    toggleSidebar(): void {
      patchState(store, { isSidebarOpen: !store.isSidebarOpen() });
    },
    setTheme(theme: 'light' | 'dark'): void {
      patchState(store, { theme });
    },
    setGlobalLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    addToast(message: string, type: Toast['type'] = 'info'): void {
      const toast: Toast = { id: crypto.randomUUID(), message, type };
      patchState(store, { toasts: [...store.toasts(), toast] });
      setTimeout(() => {
        patchState(store, { toasts: store.toasts().filter((t) => t.id !== toast.id) });
      }, 5000);
    },
    removeToast(id: string): void {
      patchState(store, { toasts: store.toasts().filter((t) => t.id !== id) });
    },
  })),
);
