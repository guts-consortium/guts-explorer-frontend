// src/composables/auth.js
import {ref, inject} from 'vue'
const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

export function useAuth(userInfo, isAuthenticated) {

  async function login() {
    // Open a new window for the login process (the URL from the backend that starts the login process)
    const loginUrl = `${backendUrl}/api/login`;  // This URL will redirect to OIDC provider
    // const loginWindow = window.open(loginUrl, 'Login', 'width=500,height=600');
    const loginWindow = window.open(loginUrl, '_blank');

    // Set up a listener to capture the user info after login completes
    window.addEventListener('message', (event) => {
      if (event.origin !== backendUrl) {
        console.error('Received message from unknown origin:', event.origin);
        return;
      }

      // Process the received user info from the backend's `postMessage`
      userInfo.value = event.data;
      isAuthenticated.value = true;
      console.log('Received user info:', userInfo.value);
      // You can now store userInfo, update your Vue state, or redirect the user as needed
    });
  }

  async function logout() {
    const logoutUrl = `${backendUrl}/api/logout`;
    fetch(logoutUrl)
      .then((response) => {
          if (response.ok) {
            userInfo.value = null
            isAuthenticated.value = false
          } else {
              console.error(
                  "ERROR: problem logging out..."
              );
          }
      })
  }

  return {
    login,
    logout,
  };
}