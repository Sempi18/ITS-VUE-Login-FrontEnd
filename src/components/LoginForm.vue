<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

const router = useRouter()
const authStore = useAuthStore()

const schema = Yup.object({
  username: Yup.string().required('User Required '),
  password: Yup.string().required('Password Required')
})

const handleSubmit = async (
  values: { username: string; password: string },
  { setErrors }: { setErrors: (errors: Record<string, any>) => void }
) => {
  try {
    await authStore.login(values.username, values.password)
    router.push('/')
  } catch (error) {
    setErrors({ apiError: error.message || 'Unknown error' })
  }
}
</script>

<template>
  <div class="app-container">
    <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <header>
        <h1>Login</h1>
      </header>

      <div class="input-bx">
        <Field
          name="username"
          type="text"
          :class="{ 'is-invalid': errors.username || errors.apiError }"
          placeholder="User"
          required
        />
        <ion-icon class="icon" name="person-circle"></ion-icon>
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>

      <div class="input-bx">
        <Field
          name="password"
          type="password"
          :class="{ 'is-invalid': errors.password || errors.apiError }"
          placeholder="Password"
          required
        />
        <ion-icon class="icon" name="lock-closed"></ion-icon>
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>

      <div class="remember-forgot">
        <label><input type="checkbox" name="remember" />Remember</label>
        <a href="#">Forgot your password</a>
      </div>

      <button type="submit" class="admin-btn">
        <span v-show="isSubmitting" class="loader"></span>
        <p v-show="!isSubmitting">Log In</p>
      </button>

      <div v-if="errors.apiError" class="error-alert">{{ errors.apiError }}</div>
    </Form>
  </div>
</template>

<style scoped>
.app-container {
  padding: 40px;
  width: 100%;
  max-width: 400px;
  margin: auto;
  background: linear-gradient(145deg, #6a11cb, #2575fc);
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.app-container:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

header {
  text-align: center;
  margin-bottom: 20px;
}

header h1 {
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.input-bx {
  position: relative;
  width: 100%;
  height: 50px;
  margin: 25px 0;
}

.input-bx input {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  outline: none;
  border-radius: 25px;
  color: white;
  padding: 18px 18px;
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.input-bx input.is-invalid {
  background: rgba(255, 0, 0, 0.2);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
}

.input-bx input:focus {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
}

.input-bx input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.input-bx .icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.8em;
  color: rgba(255, 255, 255, 0.7);
}

.invalid-feedback {
  margin-top: 1px;
  font-weight: 300;
  color: red;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  font-size: 1.2em;
  margin: 20px 0;
}

.remember-forgot label input {
  accent-color: #fff;
  margin-right: 10px;
}

.remember-forgot a {
  color: #fff;
  padding-left: 10px;
  margin-right: 10px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.remember-forgot a:hover {
  color: #ffb74d;
}

.admin-btn {
  background-color: #03a9f4;
  color: white;
  padding: 15px;
  width: 100%;
  border: none;
  border-radius: 25px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 1.3em;
  font-weight: 700;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.admin-btn:hover {
  background-color: #0288d1;
  transform: translateY(-5px);
}

.loader {
  margin: auto 0;
  width: 24px;
  height: 24px;
  border: 4px solid white;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-alert {
  margin: 20px 0 0;
  padding: 10px;
  background: rgba(255, 0, 0, 0.2);
  border-radius: 10px;
  color: red;
  font-weight: 500;
  text-align: center;
  transition: opacity 0.3s ease;
}

.error-alert::before {
  content: '⚠️ ';
}
</style>
