<template>
    <v-app-bar
      app
      color="blue-grey-darken-4"
      dark
      height="80"
      class="d-flex align-center"
    >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon
          @click="emitToggleSidebar"
          aria-label="Abrir menu lateral"
          class="mr-4"
        ></v-app-bar-nav-icon>
  
        <v-app-bar-title
          @click="goHome"
          class="cursor-pointer"
          aria-label="Página inicial"
        >
          Asteri
        </v-app-bar-title>
      </div>
  
      <div class="d-flex justify-center flex-grow-1">
        <v-text-field
          v-model="searchTerm"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          variant="solo"
          hide-details
          @keyup.enter="handleSearch"
          @click:append="handleSearch"
          clearable
          class="mx-4"
          max-width="400px"
          aria-label="Pesquisar produtos"
          @input="onInput"
        ></v-text-field>
      </div>
  
      <div class="d-flex align-center">
        <template v-if="isAuthenticated">
          <v-btn
          size="small"
            text
            @click="goToAccountData"
            aria-label="Dados da Conta"
          >
            <v-icon left>mdi-account</v-icon>
            Dados da Conta
          </v-btn>
  
          <v-btn
          size="small"
            text
            @click="goToPurchaseHistory"
            aria-label="Histórico de Compras"
          
          >
            <v-icon left>mdi-history</v-icon>
            Histórico de Compras
          </v-btn>
  
          <v-btn
          size="small"
            text
            @click="logout"
            aria-label="Sair"
           
          >
            <v-icon left>mdi-logout</v-icon>
            Sair
          </v-btn>
        </template>
        <template v-else>

          <v-btn
            text
            size="small"
            @click="goToLogin"
            aria-label="Entrar"
          >
            <v-icon left>mdi-account</v-icon>
            Entrar
          </v-btn>
  
          <v-btn
            text
            size="small"
            @click="goToRegister"
            aria-label="Criar conta"
          >
            Criar Conta
          </v-btn>
        </template>

        <v-btn
          icon
          @click="emitOpenCart"
          aria-label="Carrinho"
        >
          <template v-if="itemCount > 0">
            <v-badge
              color="red"
              :content="itemCount"
              overlap
              bordered
            >
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </template>
          <template v-else>
            <v-icon>mdi-cart</v-icon>
          </template>
        </v-btn>
      </div>
    </v-app-bar>
  </template>
  
<script setup>
  import { computed, ref } from 'vue';
  import { useCartStore } from '@/stores/cartStore';
  import { useUserStore } from '@/stores/userStore';
  import { useRouter } from 'vue-router';
  
  // Define os emits do componente
  const emit = defineEmits(['search', 'toggle-sidebar', 'open-cart']);
  
  const cartStore = useCartStore();
  const userStore = useUserStore();
  const router = useRouter();
  
  const itemCount = computed(() => cartStore.itemCount);
  const searchTerm = ref('');
  
  const isAuthenticated = computed(() => userStore.isAuthenticated);
  const userName = computed(() => userStore.user?.name || '');
  
  const userMenu = ref(false); 
  
  const searchTimeout = ref(null);
  
  const onInput = () => {
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value);
    }
    searchTimeout.value = setTimeout(() => {
      emit('search', searchTerm.value);
    }, 300);
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.value.trim();
    if (trimmedTerm) {
      router.push({ name: 'search-results', query: { q: trimmedTerm } });
    } else {
      router.push({ name: 'home' });
    }
  };
  
  // Função para navegar para a página inicial
  const goHome = () => {
    router.push({ name: 'home' });
  };
  
  // Funções para navegação a partir das opções de usuário
  const goToAccountData = () => {
    router.push({ name: 'account-data' });
  };
  
  const goToPurchaseHistory = () => {
    router.push({ name: 'purchase-history' });
  };
  
  const logout = () => {
    userStore.logout();
    router.push({ name: 'home' });
  };
  
  // Funções para navegar para login e cadastro
  const goToLogin = () => {
    router.push({ name: 'login' });
  };
  
  const goToRegister = () => {
    router.push({ name: 'register' });
  };
  
  // Funções para emitir eventos para o componente pai
  const emitToggleSidebar = () => {
    emit('toggle-sidebar');
  };
  
  const emitOpenCart = () => {
    emit('open-cart');
  };
</script>
  
<style scoped>
 .center-section {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    max-width: 500px;
  }

  .cursor-pointer {
    cursor: pointer;
  }
  
  .ml-4 {
    margin-left: 16px;
  }
  
  .mx-2 {
    margin-left: 8px;
    margin-right: 8px;
  }
  
  .mr-4 {
    margin-right: 16px;
  }
  
  .mr-6 {
    margin-right: 24px;
  }

  @media (max-width: 600px) {
    .v-app-bar-title {
      font-size: 1.2rem;
    }
  
    .v-text-field {
      max-width: 150px;
    }
  
    .d-flex.align-center > v-btn {
      padding: 0 8px;
      font-size: 0.9rem;
    }
  }
</style>
  