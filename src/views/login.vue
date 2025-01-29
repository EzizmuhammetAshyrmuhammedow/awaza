<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <div class="card flex justify-center">
      <Toast @close="onToastClose"/>

      <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
        <div class="flex flex-col gap-5">
          <FloatLabel variant="on">
            <InputText name="email" type="email" fluid v-model="authData.email" />
            <label for="email">Email</label>
          </FloatLabel>
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>

          <FloatLabel variant="on">
            <InputText name="password" type="password" fluid v-model="authData.password" />
            <label for="password">Password</label>
          </FloatLabel>
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.password.error?.message }}</Message>
        </div>
        <Button type="submit" severity="secondary" label="Submit" />
      </Form>
    </div>
  </div>
</template>

<script setup>
import { Form } from '@primevue/forms';
import { reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { InputText, Message, Button, FloatLabel } from 'primevue';
import Toast from 'primevue/toast';
import { useAuthStore } from '@/stores/auth'; // Adjust path as necessary
import router from "@/router/index";

const toast = useToast();
const authStore = useAuthStore();

const authData = reactive({
  email: '',
  password: '',
});

const initialValues = reactive({
  email: '',
  password: '',
});

const resolver = ({ values }) => {
  const errors = {};

  if (!values.email) {
    errors.email = [{ message: 'Email is required.' }];
  }
  if (!values.password) {
    errors.password = [{ message: 'Password is required.' }];
  }

  return {
    errors,
  };
};

const onFormSubmit = async ({ valid }) => {
  if (valid) {
    try {
      await authStore.login(authData.email, authData.password); // Call the login method from the store

      toast.add({
        severity: 'success',
        summary: 'Login successful.',
        life: 3000,
        closable: true,
      });

      setTimeout(() => {
        router.push('/'); // Redirect after a successful login
      }, 3000);
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Login failed.',
        detail: error.message,
        life: 3000,
        closable: true,
      });
    }
  }
};

const onToastClose = () => {
  console.log('Toast closed');
};
</script>
