<template>
    <v-menu location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn variant="outlined" size="x-small" v-bind="props" class="userbutton">
                <v-icon v-if="!isAuthenticated">mdi-account</v-icon>
                <v-avatar v-if="isAuthenticated && userInfo">
                    <img :src="userAvatarUrl" alt="User Avatar" />
                </v-avatar>
            </v-btn>
        </template>
        <v-list density="compact">
            <v-list-item v-if="!isAuthenticated" @click="loginSRAM">
                <v-list-item-title>Log in</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isAuthenticated && userInfo">
                <v-list-item-title>Welcome, {{ userInfo.name }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isAuthenticated" @click="logoutSRAM">
                <v-list-item-title>Log out</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup>
    import { ref, computed, inject} from 'vue';
    import { useAuth } from '@/composables/auth.js';
    import md5 from 'md5'

    const userInfo = inject('userInfo')
    const isAuthenticated = inject('isAuthenticated')

    const { login, logout} = useAuth(userInfo, isAuthenticated);
    
    const userAvatarUrl = computed(() => {
        const emailHash = md5(userInfo.value?.email.trim().toLowerCase() || Math.random().toString(36).substring(7));
        return `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
    });

    async function loginSRAM() {
        try {
            console.log("Calling the new login function now, should redirect to backend: api/login")
            await login();
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    async function logoutSRAM() {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    async function getUser() {
      try {
        const accessToken = auth.getAccessToken();
        if (accessToken) {
          userInfo.value = await auth.fetchUserInfo(accessToken);
          console.log(userInfo.value)
        } else {
          console.log('No access token found');
        }
      } catch (error) {
        console.error('Failed to fetch user information:', error);
      }
    }
</script>

<style scoped>
    .v-avatar img {
    width: 25px;
    height: 25px;
    padding-bottom: 10px;
    /* border-radius: 5px; */
    }
    .userbutton {
        width: 30px;
        height: 30px;
        border: 1px solid black;
        border-radius: 5px;
    }
</style>
