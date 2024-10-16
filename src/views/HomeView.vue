<script setup lang="ts">
import { onMounted } from 'vue'
import type { User } from '../models/UserModel'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'
import { useSessionStore } from '../stores/sessionStore'

const authStore = useAuthStore()
const userStore = useUserStore()
const sessionStore = useSessionStore()

const currentUser: User | null | undefined = authStore.auth.user

onMounted(() => {
  userStore.getAll()
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="app-container">
    <div class="top-actions">
      <button class="logout-button" @click="handleLogout">Logout</button>
      <button v-if="currentUser?.isAdmin" class="admin-btn">+ Add User</button>
    </div>

    <header>
      <h1>Welcome</h1>
    </header>

    <div class="info-columns">
      <section class="user-info">
        <h2>User Information</h2>
        <p><strong>Name:</strong> {{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
        <p><strong>Role:</strong> {{ currentUser?.isAdmin ? 'Admin' : 'User' }}</p>
      </section>

      <section class="session-info">
        <h2>Session Details</h2>
        <p><strong>JWT Payload:</strong> {{ sessionStore.data?.payload }}</p>
        <p><strong>JWT Created:</strong> {{ sessionStore.data?.created.toLocaleTimeString() }}</p>
        <p><strong>JWT Expires:</strong> {{ sessionStore.data?.expires.toLocaleTimeString() }}</p>
        <p><strong>JWT Renew:</strong> {{ sessionStore.data?.refresh.toLocaleTimeString() }}</p>
      </section>
    </div>

    <!-- Gestión de usuarios -->
    <section v-if="currentUser?.isAdmin" class="admin-actions">
      <h2>User Management</h2>
      <ul>
        <li v-for="user in userStore.users" :key="user.id">
          {{ user.firstName }} {{ user.lastName }} -
          <span>{{ user.isAdmin ? '[Admin]' : '[User]' }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background: linear-gradient(145deg, #6a11cb, #2575fc);
  color: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.app-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
}

.top-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

header {
  text-align: center;
  margin-bottom: 15px;
}

header h1 {
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 1.5px;
}

.info-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

section {
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
}

section:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ffeb3b;
}

p {
  font-size: 0.9rem;
  margin: 4px 0;
}

ul {
  padding: 0;
  list-style: none;
}

.admin-actions {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
}

ul li {
  margin: 10px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 0.9rem;
}

ul li span {
  color: #03a9f4;
  font-weight: 600;
}

.admin-btn {
  background-color: #03a9f4;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.admin-btn:hover {
  background-color: #0288d1;
  transform: translateY(-3px);
}

.logout-button {
  background-color: #d32f2f;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.logout-button:hover {
  background-color: #b71c1c;
  transform: translateY(-3px);
}
</style>
