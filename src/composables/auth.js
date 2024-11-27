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
        console.log('Received message from unknown origin:', event.origin);
        console.log(event);
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
  async function checkInviteUser(email) {
    const user_endpoint = `${backendUrl}/api/user/${email}`;
    try {
      const response = await fetch(user_endpoint);
      if (response.ok) {
        const responseJson = await response.json();
        // If the user is registered, return "registered"
        if (responseJson === true) {
          return "registered";
        } else {
          // Otherwise, attempt to invite the user and return the result
          return await inviteUser(email);
        }
      } else {
        console.error("ERROR: user registration check GET to Neptune server failed");
        return "error";
      }
    } catch (error) {
      console.error("Error in checkInviteUser:", error);
      return "error";
    }
  }

  async function inviteUser(email) {
    const user_endpoint = `${backendUrl}/api/user/${email}`;
    try {
      const response = await fetch(user_endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (response.ok) {
        await response.json();
        return "invited";
      } else {
        console.error("ERROR: user registration POST to Neptune server failed");
        return "error";
      }
    } catch (error) {
      console.error("Error in inviteUser:", error);
      return "error";
    }
  }

  async function checkUser(email) {
    const user_endpoint = `${backendUrl}/api/user/${email}`;
    try {
      const response = await fetch(user_endpoint);
      if (response.ok) {
        const responseJson = await response.json();
        console.log(responseJson)
      } else {
        console.error("ERROR: user registration check GET to Neptune server failed");
        return "error";
      }
    } catch (error) {
      console.error("Error in checkUser:", error);
      return "error";
    }
  }

  async function deleteUser(email) {
    const user_endpoint = `${backendUrl}/api/user/${email}`;
    try {
      const response = await fetch(user_endpoint, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (response.ok) {
        const rp = await response.json();
        console.log(rp)
        return "DELETED or didnt exist";
      } else {
        console.error("ERROR: user registration DELETE to Neptune server failed");
        return "error";
      }
    } catch (error) {
      console.error("Error in deleteUser:", error);
      return "error";
    }
  }

  return {
    login,
    logout,
    checkInviteUser,
    inviteUser,
    checkUser,
    deleteUser
    
  };
}