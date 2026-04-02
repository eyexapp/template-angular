import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User } from '../models';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.user()),
    displayName: computed(() => store.user()?.displayName ?? ''),
  })),
  withMethods((store) => ({
    setUser(user: User, accessToken: string): void {
      patchState(store, { user, accessToken, error: null });
    },
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    setError(error: string): void {
      patchState(store, { error, isLoading: false });
    },
    clearAuth(): void {
      patchState(store, initialState);
    },
  })),
);
