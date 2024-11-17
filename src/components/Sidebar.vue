<template>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      @click:outside="handleOutsideClick"
      aria-label="Menu Lateral"
    >
      <v-list dense>
        <v-list-item @click="navigateTo('home')">
          <v-list-item-title>Página Inicial</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('search-results')">
          <v-list-item-title>Pesquisar Produtos</v-list-item-title>
        </v-list-item>
  
        <v-divider></v-divider>
  
        <template v-if="isAuthenticated">
          <v-list-item @click="navigateTo('account-data')">
            <v-list-item-title>Dados da Conta</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigateTo('purchase-history')">
            <v-list-item-title>Histórico de Compras</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item @click="navigateTo('login')">
            <v-list-item-title>Entrar</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigateTo('register')">
            <v-list-item-title>Criar Conta</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
</template>
  
<script setup>
  import { computed } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue']);

  const drawer = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const userStore = useUserStore();
  
  const isAuthenticated = computed(() => userStore.isAuthenticated);
  

  const navigateTo = (routeName) => {
    emit('update:modelValue', false); 
    router.push({ name: routeName });
  };
  

  import { useRouter } from 'vue-router';
  const router = useRouter();
  
  
  const logout = () => {
    userStore.logout();
    emit('update:modelValue', false);
    router.push({ name: 'login' });
  };

  const handleOutsideClick = () => {
    emit('update:modelValue', false);
  };
</script>
