<script lang="ts" setup>
import { AxiosError } from "axios";
import { ref } from "vue";
import { useUserStore } from "@/api/stores"
import { SubmitEventPromise } from "vuetify";

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

const userStore = useUserStore();
const errorUpdate = ref({
  errorGeneralContent: "",
  errors: {
    oldPassword: "",
    password: "",
    passwordConfirmation: ""
  }
});

const updateSuccess = ref(false);

const passwordRules = [
  (u: string) => !!u || 'Mật khẩu không được để trống',
]

async function changePassword(submitEvent: SubmitEventPromise) {
  updateSuccess.value = false;
  errorUpdate.value.errorGeneralContent = "";
  errorUpdate.value.errors.oldPassword = "";
  errorUpdate.value.errors.password = "";
  errorUpdate.value.errors.passwordConfirmation = "";

  const { valid } = await submitEvent;
  // if form is invalid
  if (!valid) {
    return;
  }

  try {
    await userStore.changePassword(currentPassword.value, newPassword.value, confirmPassword.value);
    updateSuccess.value = true;
    
  } catch (error) {      
      if (!(error instanceof AxiosError)) {
        if (error instanceof Error) {
          errorUpdate.value.errorGeneralContent = error.message;
        }
        return;
      }

      if (!error.response || !error.response.data) {
        errorUpdate.value.errorGeneralContent = error.message;
        return;
      }

      const errorData = error.response.data;
      if (!errorData) {
        return;
      }

      if (errorData.message) {
        errorUpdate.value.errorGeneralContent = errorData.message;
      }

      if (!errorData.errors) {
        return;
      }

      if (typeof errorData.errors === "string") {
        // console.log("Error string");
        errorUpdate.value.errorGeneralContent = errorData.errors;
        return;
      }

      if (errorData.errors["old_password"]) {
        errorUpdate.value.errors.oldPassword = errorData.errors["old_password"];
      }

      if (errorData.errors["password"]) {
        errorUpdate.value.errors.password = errorData.errors["password"];
      }

      if (errorData.errors["password_confirmation"]) {
        errorUpdate.value.errors.passwordConfirmation = errorData.errors["password_confirmation"];
      }
    // }
  }
}

function resetForm() {
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
}

</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm @submit.prevent="changePassword" validate-on="submit lazy">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-alert type="error" v-show="errorUpdate.errorGeneralContent !== ''">{{ errorUpdate.errorGeneralContent }}</v-alert>
                <v-alert type="success" v-show="updateSuccess">Cập nhật thông tin thành công</v-alert>
              </v-col>
            </v-row>
          </v-card-text>

          <VCardText>
            <!-- 👉 Current Password -->
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 current password -->
                <VTextField
                  v-model="currentPassword"
                  :rules="passwordRules"
                  :error-messages="errorUpdate.errors.oldPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                  autocomplete="on"
                  label="Current Password"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 new password -->
                <VTextField
                  v-model="newPassword"
                  :rules="passwordRules"
                  :error-messages="errorUpdate.errors.password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                  label="New Password"
                  autocomplete="on"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="confirmPassword"
                  :rules="passwordRules"
                  :error-messages="errorUpdate.errors.passwordConfirmation"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                  autocomplete="on"
                  label="Confirm New Password"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              Password Requirements:
            </p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon
                    size="7"
                    icon="ri-checkbox-blank-circle-fill"
                    class="me-3"
                  />
                </div>
                <span class="font-weight-medium">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn color="primary" type="submit">Save changes</VBtn>

            <VBtn
              class="ml-4"
              type="reset"
              color="secondary"
              variant="outlined"
              @click="resetForm"
            >
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
