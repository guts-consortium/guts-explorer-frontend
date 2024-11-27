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
            <v-list-item v-if="!isAuthenticated" @click="loginRegister">
                <v-list-item-title><v-icon>mdi-login</v-icon> Log in / register</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isAuthenticated && userInfo">
                <v-list-item-title>Welcome, {{ userInfo.name }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isAuthenticated" @click="logoutSRAM">
                <v-list-item-title><v-icon>mdi-logout</v-icon> Log out</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>

    <v-dialog
        v-model="showLoginModal"
        max-width="500px"
        @click:outside="resetLoginModal">
        <RegisterLogin @close-dialog="resetLoginModal" :key="`input-${Date.now()}`"</RegisterLogin>
    </v-dialog>
</template>

<script setup>
    import { ref, computed, inject} from 'vue';
    import { useAuth } from '@/composables/auth.js';
    import md5 from 'md5'

    const userInfo = inject('userInfo')
    const isAuthenticated = inject('isAuthenticated')
    const showLoginModal = ref(false)

    const { logout} = useAuth(userInfo, isAuthenticated);
    
    const userAvatarUrl = computed(() => {
        const emailHash = md5(userInfo.value?.email.trim().toLowerCase() || Math.random().toString(36).substring(7));
        return `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
    });

    function resetLoginModal() {
        showLoginModal.value = false
    }

    function loginRegister() {
        showLoginModal.value = true
    }

    async function logoutSRAM() {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
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
