import { writable } from 'svelte/store';

// User store to keep track of authentication state and user info
export const user = writable({
  isLoggedIn: false,
  firstName: '',
  uuid: null,
  api_key: null
});
