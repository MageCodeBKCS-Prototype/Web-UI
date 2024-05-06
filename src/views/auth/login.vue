<script setup lang="ts">
// // import { AUTH_REQUEST } from "@/js/store/types/auth";
import { ref, computed } from "vue";
import { useAuthStore } from "@/api/stores";
import { SubmitEventPromise } from "vuetify"
import authThemeLight from "@/assets/images/auth/auth-v1-mask-light.png";

const authStore = useAuthStore();

const errorLogin = ref({
  isError: false,
  errorGeneralContent: "",
  errors: {
    email: "",
    password: ""
  }
})

const form = ref({
  email: "",
  password: "",
  // remember: false
})

const emailRules = [
  (e: string) => !!e || 'Email không được để trống',
  (e: string) => !/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i.test(e) || 'Định dạng email không hợp lệ'
]

const passwordRules = [
  (p: string) => !!p || 'Mật khẩu không được để trống'
]

const isPasswordVisible = ref(false);

async function login(submitEvent: SubmitEventPromise) {
  errorLogin.value.errorGeneralContent = "";
  errorLogin.value.errors.email = "";
  errorLogin.value.errors.password = "";

  const { valid } = await submitEvent;
  
  // if form is invalid
  if (!valid) {
    return;
  }

  return authStore
          .login(form.value.email, form.value.password)
          .catch(error => {

            console.log(error);
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
              errorLogin.value.errorGeneralContent = errorData.errors;
              return;
            }

            if (errorData.errors["email"]) {
              errorLogin.value.errors.email = errorData.errors["email"];
            }

            if (errorData.errors["password"]) {
              errorLogin.value.errors.password = errorData.errors["password"];
            }
          });
}

</script>

<template>
    <!-- <v-container fluid fill-height> -->
      <!-- <v-layout align-center justify-center> -->
        <!-- <v-flex xs12 sm8 md3> -->
        <!-- <div d-flex> -->
        <!-- <v-main>
          <v-card>
            <v-toolbar color="primary" :dark="true">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field prepend-icon="person" type="text" v-model="user.username" label="Username"></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  type="password"
                  v-model="user.password"
                  label="Password"
                ></v-text-field>
              </v-form>
               <v-alert type="error" v-if="errorLogin">
                  Username or password invalid
                </v-alert>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="primary" @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-main> -->
        <!-- </div> -->
        <!-- </v-flex> -->
      <!-- </v-layout> -->
    <!-- </v-container> -->

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
          Please sign-in to your account and start coding analyzer
        </p>
      </v-card-text>

      <v-card-text>
        <v-alert class="mb-2" type="error" v-show="errorLogin.errorGeneralContent !== ''">{{ errorLogin.errorGeneralContent }}</v-alert>
        <v-form @submit.prevent="login" validate-on="submit lazy">
          <v-row>
            <!-- email -->
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                :rules="emailRules"
                :error-messages="errorLogin.errors.email"
                required
              />
            </v-col>

            <!-- password -->
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                label="Password"
                placeholder="············"
                :rules="passwordRules"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />


              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <!-- Only implement if refresh token exist -->
                <!-- <v-checkbox
                  v-model="form.remember"
                  label="Remember me"
                /> -->

                <a
                  class="ms-2 mb-1"
                  href="javascript:void(0)"
                >
                  Forgot Password?
                </a>
              </div>

              <!-- login button -->
              <v-btn color="primary"
                block
                type="submit"
              >
                Login
            </v-btn>
            </v-col>

            <!-- create account -->
            <v-col
              cols="12"
              class="text-center text-base"
            >
              <span>New on our platform?</span>
              <router-link
                class="text-primary ms-2"
                to="/register"
              >
                Create an account
              </router-link>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

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