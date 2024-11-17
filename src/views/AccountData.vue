<template>
    <div class="account-data-container">
      <Navbar 
        @toggle-sidebar="toggleSidebar" 
        @open-cart="openCart" 
        @search="handleSearch"
      />
  

      <Sidebar v-model="sidebar" />
  

      <CartDrawer 
        v-model="cartDrawer" 
        @snackbar-message="snackbarMessage = $event" 
        @show-snackbar="snackbar = $event" 
      />
        <v-container></v-container>
        <v-container></v-container>
        <v-container></v-container>
      <v-container class="mt-5">
        <v-card class="pa-4">
          <v-card-title class="headline">Dados da Conta</v-card-title>
          <v-divider></v-divider>
  
          <v-row>

            <v-col cols="12" md="6">
              <v-form>
                <v-text-field
                  v-model="userData.name"
                  label="Nome Completo"
                  readonly
                  prepend-inner-icon="mdi-account"
                ></v-text-field>
  
                <v-text-field
                  v-model="userData.email"
                  label="Email"
                  readonly
                  prepend-inner-icon="mdi-email"
                ></v-text-field>
  
                <v-text-field
                  v-model="userData.phone"
                  label="Telefone"
                  readonly
                  prepend-inner-icon="mdi-phone"
                ></v-text-field>
  
                <v-text-field
                  v-model="userData.cpf"
                  label="CPF"
                  readonly
                  prepend-inner-icon="mdi-card-account-details"
                ></v-text-field>
              </v-form>
            </v-col>
  

            <v-col cols="12" md="6">
              <h3>Endereços</h3>
              <v-divider class="mb-4"></v-divider>
              <div v-for="(address, index) in userData.addresses" :key="index" class="mb-4">
                <v-card outlined>
                  <v-card-text>
                    <p><strong>CEP:</strong> {{ address.cep }}</p>
                    <p><strong>Logradouro:</strong> {{ address.logradouro }}</p>
                    <p><strong>Número:</strong> {{ address.numero }}</p>
                    <p><strong>Complemento:</strong> {{ address.complemento }}</p>
                    <p><strong>Bairro:</strong> {{ address.bairro }}</p>
                    <p><strong>Cidade:</strong> {{ address.cidade }}</p>
                    <p><strong>Estado:</strong> {{ address.uf }}</p>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-container>

      <v-snackbar v-model="snackbar" timeout="3000" top right>
        {{ snackbarMessage }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">
            Fechar
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import CartDrawer from '@/components/CartDrawer.vue';
  import { useUserStore } from '@/stores/userStore';
  import { getUser } from '@/utils/rest';
  import { useRouter } from 'vue-router';
  
  const userStore = useUserStore();
  const router = useRouter();

  const sidebar = ref(false);
  const cartDrawer = ref(false);
  

  const snackbar = ref(false);
  const snackbarMessage = ref('');
  
  const userData = ref({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    addresses: [],
  });
  

  const fetchUserData = async () => {
    if (!userStore.user) {

      router.push({ name: 'login' });
      return;
    }
    try {
      const data = await getUser(userStore.user.email);
      userData.value = data;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      snackbarMessage.value = 'Erro ao carregar dados da conta.';
      snackbar.value = true;
    }
  };

  const handleSearch = (searchTerm) => {
    router.push({ name: 'search-results', query: { q: searchTerm } });
  };
  
  const toggleSidebar = () => {
    sidebar.value = !sidebar.value;
  };
  
  const openCart = () => {
    cartDrawer.value = true;
  };

  onMounted(() => {
    fetchUserData();
  });
  </script>
  
  <style scoped>
  .account-data-container {
    background-color: #f3f1f0;
    min-height: 100vh;
  }
  </style>
  