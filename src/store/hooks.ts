import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '.';

/** Typed dispatch — use everywhere instead of plain useDispatch 
 * Whats a dispatch? 
 * Dispatch is a function that allows you to send actions to the Redux store. When you call dispatch with an action,
 * it triggers the store's reducer to update the state based on the action type and payload. In a React application,
 * you typically use dispatch to update the state in response to user interactions or other events. 
 * By using a typed dispatch, you can ensure that the actions you dispatch conform to the expected types defined in your Redux setup,
 * which helps catch errors and improve code maintainability.
 * 
 * @example
 * 
 * const dispatch = useAppDispatch();
 * dispatch(setAuth({ user: res.data.user, accessToken: res.data.accessToken }));
*/
export const useAppDispatch = () => useDispatch<AppDispatch>();
/** Typed selector — use everywhere instead of plain useSelector 
 * What's a selector?
 * A selector is a function that takes the Redux store state as an argument and returns a specific piece of data from that state.
 * Selectors are used to encapsulate the logic for retrieving data from the store, making it easier to access and manage state in a React application.
 * By using a typed selector, you can ensure that the data you retrieve from the store conforms to the expected types defined in your Redux setup,
 * which helps catch errors and improve code maintainability.
 * 
 * @example
 * 
 * import { useAppSelector } from './hooks';
 * const user = useAppSelector((state) => state.auth.user);
 */
export const useAppSelector: <T>(selector: (state: RootState) => T) => T = useSelector;
