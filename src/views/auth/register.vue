<script setup lang="ts">
// // import { AUTH_REQUEST } from "@/js/store/types/auth";
import { ref } from "vue";
import { useAuthStore } from "@/api/stores";
import { SubmitEventPromise } from "vuetify"
import authThemeLight from "@/assets/images/auth/auth-v1-mask-light.png";

const authStore = useAuthStore();

const errorRegister = ref({
  isError: false,
  errorGeneralContent: "",
  errors: {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }
})

const registerSuccess = ref(false);

const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  // privacyPolicies: false,
})

const usernameRules = [
  (u: string) => !!u || 'Tên người dùng không được để trống',
  (u: string) => u.length < 50 || 'Tên người dùng không dài quá 50 ký tự'
]

const emailRules = [
  (e: string) => !!e || 'Email không được để trống',
  (e: string) => !/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i.test(e) || 'Định dạng email không hợp lệ'
]

const passwordRules = [
  (p: string) => !!p || 'Mật khẩu không được để trống'
]

const confirmPasswordRules = [
  (p: string) => !!p || 'Mật khẩu xác nhận không được để trống'
]

const isPasswordVisible = ref(false);

async function register(submitEvent: SubmitEventPromise) {
  registerSuccess.value = false;
  errorRegister.value.errorGeneralContent = "";
  errorRegister.value.errors.username = "";
  errorRegister.value.errors.email = "";
  errorRegister.value.errors.password = "";
  errorRegister.value.errors.confirmPassword = "";

  const { valid } = await submitEvent;
  
  // if form is invalid
  if (!valid) {
    return;
  }

  try {
    await authStore.register(form.value.username, form.value.email, form.value.password, form.value.confirmPassword);
    registerSuccess.value = true;
    
  } catch (error) {
    // if (error instanceof Error) {
    //   errorRegister.value.errorGeneralContent = error.message;
    // } else {
      if (!error.response || !error.response.data) {
        errorLogin.value.errorGeneralContent = error.message;
        return;
      }

      const errorData = error.response.data;
      if (!errorData.errors) {
        return;
      }

      if (typeof errorData.errors === "string") {
        // console.log("Error string");
        errorRegister.value.errorGeneralContent = errorData.errors;
        return;
      }

      if (errorData.errors["username"]) {
        errorRegister.value.errors.username = errorData.errors["username"];
      }

      if (errorData.errors["email"]) {
        errorRegister.value.errors.email = errorData.errors["email"];
      }

      if (errorData.errors["password"]) {
        errorRegister.value.errors.password = errorData.errors["password"];
      }

      if (errorData.errors["password_confirmation"]) {
        errorRegister.value.errors.confirmPassword = errorData.errors["password_confirmation"];
      }
    // }
  }
}

</script>

<template>
  <div class="auth-wrapper auth-bg d-flex align-center justify-center pa-4">
    <v-card
      elevation="16"
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <v-card-item class="justify-center">
        <!-- <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template> -->

        <v-card-title class="font-weight-semibold text-2xl text-uppercase">
          MageCode
        </v-card-title>
      </v-card-item>

      <v-card-text class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Welcome to MageCode! 👋🏻
        </h5>
        <p class="mb-0">
          Create new account and start your coding analyzer
        </p>
      </v-card-text>

      <v-card-text>
        <v-alert class="mb-2" type="error" v-show="errorRegister.errorGeneralContent !== ''">{{ errorRegister.errorGeneralContent }}</v-alert>
        <v-alert class="mb-2" type="success" v-show="registerSuccess">
          Register new account successfully! Go to 
          <router-link
            class="text-primary ms-2"
            to="/login"
          >Log in</router-link>
          page to login to new account.
        </v-alert>
        <v-form @submit.prevent="register" validate-on="submit lazy">
          <v-row>
            <!-- username -->
            <v-col cols="12">
              <v-text-field
                v-model="form.username"
                label="Username"
                placeholder="John Doe"
                :rules="usernameRules"
                :error-messages="errorRegister.errors.username"
              />
            </v-col>

            <!-- email -->
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="example@gmail.com"
                :rules="emailRules"
                :error-messages="errorRegister.errors.email"
              />
            </v-col>

            <!-- password -->
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                label="Password"
                placeholder="············"
                :rules="passwordRules"
                :error-messages="errorRegister.errors.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </v-col>

            <!-- confirm password -->
            <v-col cols="12">
              <v-text-field
                v-model="form.confirmPassword"
                label="Confirm Password"
                placeholder="············"
                :rules="confirmPasswordRules"
                :error-messages="errorRegister.errors.confirmPassword"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </v-col>

              <!-- policy -->
              <!-- <div class="d-flex align-center mt-1 mb-4">
                <v-checkbox
                  id="privacy-policy"
                  v-model="form.privacyPolicies"
                  inline
                />
                <v-label
                  for="privacy-policy"
                  style="opacity: 1;"
                >
                  <span class="me-1">I agree to</span>
                  <a
                    href="javascript:void(0)"
                    class="text-primary"
                  >privacy policy & terms</a>
                </v-label>
              </div> -->

              <!-- login button -->
            <v-col>
              <v-btn color="primary"
                block
                type="submit"
              >
                Sign up
              </v-btn>
            </v-col>

            <!-- create account -->
            <v-col
              cols="12"
              class="text-center text-base"
            >
              <span>Already have an account?</span>
              <router-link
                class="text-primary ms-2"
                to="/login"
              >
                Log in instead
              </router-link>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- <v-img
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <v-img
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    /> -->

    <!-- bg img -->
    <v-img
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeLight"
    />
  </div>

</template>

<style lang="scss">
@use "@/assets/scss/auth.scss"
</style>