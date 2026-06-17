/**
 * @file Redux hooks
 * @description Typed hooks for Redux dispatch and selector, providing type safety when interacting with the store
 * @module store
 */

// React-Redux hooks
import { useDispatch, useSelector } from 'react-redux';
// Store type definitions
import type { RootState, AppDispatch } from '.';

/**
 * useAppDispatch
 * @description Typed dispatch hook. Use everywhere instead of plain `useDispatch` to ensure
 *   dispatched actions conform to the store's expected types.
 * @returns Typed dispatch function
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(setAuth({ user: res.data.user, accessToken: res.data.accessToken }));
*/
export const useAppDispatch = () => useDispatch<AppDispatch>();
/**
 * useAppSelector
 * @description Typed selector hook. Use everywhere instead of plain `useSelector` to ensure
 *   selected values match the store's state shape.
 * @param selector - A function that takes RootState and returns a derived value
 * @returns The selected value
 * @example
 * import { useAppSelector } from './hooks';
 * const user = useAppSelector((state) => state.auth.user);
 */
export const useAppSelector: <T>(selector: (state: RootState) => T) => T = useSelector;
