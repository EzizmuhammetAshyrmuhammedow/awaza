<template>
  <div class="h-screen w-screen flex items-center justify-center">
	  <div v-show="isHidden">
		  <h3 class="text-align-center">What is your role</h3>
		  <div class="flex flex-row items-center gap-5">
			  <Button variant="outlined" label="Customer" @click="isHidden = !isHidden"/>
			  <Button variant="outlined" label="Employee" @click="isHidden = !isHidden; isEmployee = !isEmployee"/>
			  <RouterLink to="/register_admin"><Button variant="outlined" label="Hotel Owner"/></RouterLink>
		  </div>

	  </div>
    <div v-show="!isHidden" class="card flex justify-center">
      <Toast class="z-100"/>

      <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
        <div class="flex flex-col gap-5">
          <FloatLabel variant="on">
            <InputText name="username" type="text" fluid v-model="authData.username" />
            <label for="username">User Name</label>
          </FloatLabel>
          <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error?.message }}</Message>

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

          <FloatLabel variant="on">
            <InputText name="password_confirm" type="password" fluid v-model="authData.password_confirm" />
            <label for="password_confirm">Confirm Password</label>
          </FloatLabel>
          <Message v-if="$form.password_confirm?.invalid || $form.password_confirm?.error?.message === 'Passwords do not match.'" severity="error" size="small" variant="simple">{{ $form.password_confirm.error?.message }}</Message>
        </div>
        <Button type="submit" severity="secondary" label="Submit" />
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Form } from '@primevue/forms';
import { reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast';
import { InputText, Message, Button, FloatLabel, Card } from 'primevue';
import Toast from 'primevue/toast';
import { useAuthStore } from '@/stores/auth';
import router from "@/router";

const isEmployee = ref<boolean>(false);

const toast = useToast();
const authStore = useAuthStore();

const isHidden = ref(true);

const authData = reactive({
	username: '',
	email: '',
	password: '',
	password_confirm: '',
});

const initialValues = reactive({ ...authData });

const resolver = ({ values }) => {
  const errors = {};

  if (!values.username) {
    errors.username = [{ message: 'Username is required.' }];
  }

  if (!values.email) {
    errors.email = [{ message: 'Email is required.' }];
  }

  if (!values.password) {
    errors.password = [{ message: 'Password is required.' }];
  }

  if (values.password !== values.password_confirm) {
    errors.password_confirm = [{ message: 'Passwords do not match.' }];
  }

  return { errors };
};

const onFormSubmit = async ({ valid }) => {
  if (valid) {
    try {
		if (isEmployee.value === true) {
			await authStore.register(authData.username, authData.email, authData.password, 'Employee');
		}

      toast.add({
        severity: 'success',
        summary: 'Registration successful.',
        life: 3000,
        onClose: () => {
          router.push('/'); // Redirect after the toast is closed
        }
      });

      // Clear form fields after successful registration
      Object.keys(authData).forEach(key => authData[key] = '');

    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Registration failed.',
        detail: error.message || 'An error occurred.',
        life: 3000
      });
    }
  } else {
    console.log('Form validation failed:', valid);
  }
};
</script>
