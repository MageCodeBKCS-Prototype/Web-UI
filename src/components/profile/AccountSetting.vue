<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore, useUserStore } from "@/api/stores"
import { storeToRefs } from "pinia";
import { SubmitEventPromise } from "vuetify";
import { AxiosError } from "axios";

const userStore = useUserStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const accountData = {
  username: user.value.username,
  email: user.value.email,
}

const errorUpdate = ref({
  errorGeneralContent: "",
  errors: {
    username: "",
  }
})

const updateSuccess = ref(false);

const usernameRules = [
  (u: string) => !!u || 'Tên người dùng không được để trống',
  (u: string) => u.length < 50 || 'Tên người dùng không dài quá 50 ký tự'
]

const accountDataLocal = ref(structuredClone(accountData))

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

async function update(submitEvent: SubmitEventPromise) {
  updateSuccess.value = false;
  errorUpdate.value.errorGeneralContent = "";
  errorUpdate.value.errors.username = "";

  const { valid } = await submitEvent;
  // if form is invalid
  if (!valid) {
    return;
  }

  try {
    await userStore.update(accountDataLocal.value.username);
    updateSuccess.value = true;
    accountData.username = user.value;
    
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

      if (errorData.errors["username"]) {
        errorUpdate.value.errors.username = errorData.errors["username"];
      }
    // }
  }
}

</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card title="Account Details">
        <v-card-text>
          <v-alert class="mb-2" type="error" v-show="errorUpdate.errorGeneralContent !== ''">{{ errorUpdate.errorGeneralContent }}</v-alert>
          <v-alert class="mb-2" type="success" v-show="updateSuccess">Cập nhật thông tin thành công</v-alert>

          <!-- 👉 Form -->
          <v-form class="mt-6" @submit.prevent="update" validate-on="submit lazy">
            <v-row>
              <!-- 👉 Username -->
              <v-col
                md="6"
                cols="12"
              >
                <v-text-field
                  v-model="accountDataLocal.username"
                  placeholder="John Doe"
                  label="Username"
                  :rules="usernameRules"
                  :error-messages="errorUpdate.errors.username"
                />
              </v-col>

              <!-- 👉 Email -->
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="accountDataLocal.email"
                  label="E-mail"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  readonly
                />
              </v-col>

              <!-- 👉 Form Actions -->
              <v-col
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <v-btn color="primary" type="submit">Save changes</v-btn>

                <v-btn
                  class="ml-4"
                  color="secondary"
                  variant="outlined"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
