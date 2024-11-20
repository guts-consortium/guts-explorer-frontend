// src/composables/backend.js
import { ref, inject } from 'vue';
const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

export function useBackend() {

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
        return "error"; // Optional: return an error status to handle in the UI
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

  return {
    checkInviteUser,
    inviteUser,
  };
}
