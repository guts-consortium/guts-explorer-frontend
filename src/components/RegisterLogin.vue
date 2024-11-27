<template>
    <v-card>
        <v-card-title><v-icon>mdi-login</v-icon> Login / Register</v-card-title>
        <v-card-text class="text-left">
            <v-skeleton-loader
            :loading="awaitingResponse"
            type="paragraph"
            >
            <span v-if="!showResponseRegistered && !showResponseInvited">
                <h3>Login is required to enable basket checkout</h3>
                <br>
                <p>
                    If you are not yet registered as part of the GUTS collaboration,
                    <a @click="showRegister = true" class="register-link">register now</a>
                    with your institutional email address.
                </p>
                <v-form ref="emailForm" >
                    <v-text-field
                        v-if="showRegister"
                        v-model="registerEmail"
                        label="Email"
                        type="email"
                        :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                        required
                        style="padding-top: 1em;"
                    ></v-text-field>
                </v-form>
            </span>
            </v-skeleton-loader>
            <span v-if="showResponseRegistered">
                <h3>Already registered</h3>
                <p>
                    A user with the submitted email address is already registered.
                    Please log in with this account to continue checking out your basket.
                </p>

            </span>
            <span v-if="showResponseInvited">
                <h3>Registration submitted</h3>
                <p>
                    Please check your inbox for the confirmation email. After
                    confirming your registration, you can log in with the same
                    email address and continue checking out your basket.
                </p>

            </span>

        </v-card-text>
        <v-card-actions>
            <v-btn v-if="!showResponseInvited" @click="closeDialog"><v-icon>mdi-cancel</v-icon> Cancel</v-btn>
            <v-btn v-if="showRegister && !showResponseInvited && !showResponseRegistered" type="submit" @click="registerUser"><v-icon>mdi-account-plus</v-icon> Register</v-btn>
            <v-btn v-if="!showRegister || showResponseRegistered"  @click="loginSRAM"><v-icon>mdi-login</v-icon> Log in</v-btn>
            <v-btn v-if="showResponseInvited" @click="closeDialog"><v-icon>mdi-check-circle-outline</v-icon> OK</v-btn>
        </v-card-actions>
    </v-card>

</template>

<script setup>
    import { inject, ref } from 'vue'
    import { useAuth } from '@/composables/auth.js';

    const userInfo = inject('userInfo')
    const isAuthenticated = inject('isAuthenticated')
    const showRegister = ref(false)
    const registerEmail = ref(null)
    const showResponseRegistered = ref(false)
    const showResponseInvited = ref(false)
    const emailForm = ref(null)
    const awaitingResponse = ref(false)

    const { login, logout, checkInviteUser, inviteUser, checkUser, deleteUser} = useAuth(userInfo, isAuthenticated);
    const emit = defineEmits(['close-dialog']);

    const closeDialog = () => {
        console.log("Pressed cancel button")
        // Tell parent to close the dialog that contains this component
        emit('close-dialog');
        showRegister.value = false
        registerEmail.value = null
    };

    async function registerUser() {
        const form = emailForm.value;
        if (!form) return;
        const isValid = await form.validate();
        if (!isValid) {
            return;
        }
        awaitingResponse.value = true;
        var inviteResponse = await checkInviteUser(registerEmail.value)
        awaitingResponse.value = false;
        console.log(`inviteResponse: ${inviteResponse}`)

        if (inviteResponse == "registered") {
            showResponseRegistered.value = true;
        } else if (inviteResponse == "invited") {
            showResponseInvited.value = true;
        } else if (inviteResponse === "error") {
            console.error("Error occurred during user check or invitation.");
        }
    }

    async function loginSRAM() {
        try {
            console.log("Calling the new login function now, should redirect to backend: api/login")
            emit('close-dialog');
            await login();
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

</script>

<style scoped>

 .register-link {
    color: #ff00fb;
    text-decoration: underline;
    cursor: pointer;
 }

</style>