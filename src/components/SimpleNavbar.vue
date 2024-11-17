<!-- src/components/SimpleNavbar.vue -->
<template>
    <v-app-bar
      app
      color="blue-grey-darken-4"
      dark
      height="80"
      class="d-flex align-center justify-between"
    >
      <v-app-bar-title
        @click="goHome"
        class="cursor-pointer"
        aria-label="Página inicial"
      >
        Asteri
      </v-app-bar-title>
  
      <!-- Botões de Navegação -->
      <div class="d-flex align-center">
        <v-btn
          text
          size="small"
          @click="goToLogin"
          aria-label="Entrar"
        >
          <v-icon left>mdi-login</v-icon>
          Entrar
        </v-btn>
  
        <v-btn
          text
          size="small"
          @click="goToRegister"
          aria-label="Criar conta"
        >
          <v-icon left>mdi-account</v-icon>
          Criar Conta
        </v-btn>
      </div>
    </v-app-bar>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // Função para navegar para a Home
  const goHome = () => {
    router.push({ name: 'home' });
  };
  
  // Função para navegar para a página de Login
  const goToLogin = () => {
    router.push({ name: 'login' });
  };
  
  // Função para navegar para a página de Registro
  const goToRegister = () => {
    router.push({ name: 'register' });
  };
  </script>
  
  <style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
  .mx-2 {
    margin-left: 8px;
    margin-right: 8px;
  }
  </style>
  