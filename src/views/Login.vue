<template>
   <SimpleNavbar />
    <div class="login-container">
  
      <v-container class="d-flex justify-center align-center fill-height">
        <v-card class="pa-6" max-width="700" width="450">
          <v-card-title class="headline text-center">Login</v-card-title>
          <v-card-text>
            <v-form ref="loginForm" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                :rules="[rules.required, rules.email]"
                prepend-inner-icon="mdi-email"
              ></v-text-field>
  
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                required
                :rules="[rules.required]"
                prepend-inner-icon="mdi-lock"
              ></v-text-field>
  
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
                block
                class="mt-4"
                style="height: 40px;"
              >
                Entrar
              </v-btn>
            </v-form>
            <v-divider class="my-4"></v-divider>
            <v-btn
              text
              color="primary"
              class="mt-6"
              block
              @click="goToForgotPassword"
              style="height: 40px;"
            >
              Esqueci minha senha
            </v-btn>
  
            
  
            <v-btn
              text
              color="primary"
              block
               class="mt-3"
              @click="goToRegister"
              style="height: 40px;"
            >
              Criar conta
            </v-btn>
          </v-card-text>
  
          <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            top
            timeout="3000"
          >
            {{ snackbarMessage }}
            <template v-slot:action="{ attrs }">
              <v-btn text v-bind="attrs" @click="snackbar = false">
                Fechar
              </v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  import SimpleNavbar from '@/components/SimpleNavbar.vue';
  
  const router = useRouter();
  const userStore = useUserStore();
  
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const snackbar = ref(false);
  const snackbarMessage = ref('');
  const snackbarColor = ref('error');
  
  const loginForm = ref(null);
  
  const rules = {
    required: value => !!value || 'Campo obrigatório.',
    email: value => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value) || 'E-mail inválido.';
    },
  };
  
  const handleLogin = async () => {
    if (!loginForm.value.validate()) {
      return;
    }
    console.log(email.value, password.value)
    loading.value = true;
    try {
      await userStore.login({ email: email.value, password: password.value });
      snackbarMessage.value = 'Login realizado com sucesso!';
      snackbarColor.value = 'success';
      snackbar.value = true;
      router.push({ name: 'home' });
    } catch (error) {
      snackbarMessage.value = 'Falha no login. Verifique suas credenciais.';
      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      loading.value = false;
    }
  };
  
  const goToForgotPassword = () => {
    router.push({ name: 'forgot-password' });
  };
  
  const goToRegister = () => {
    router.push({ name: 'register' });
  };
  </script>
  
  <style scoped>
  .login-container {
    background-color: #f3f1f0;
    min-height: 100vh;
  }
  
  .fill-height {
    min-height: calc(100vh - 64px);
  }
  
  .text-center {
    text-align: center;
  }
  </style>
  