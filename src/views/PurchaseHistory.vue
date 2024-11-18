<template>
  <div class="purchase-history-container">
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
        <v-card-title class="headline">Histórico de Compras</v-card-title>
        <v-divider></v-divider>

        <v-row>
      
          <v-col cols="12" v-if="purchaseHistory.length === 0">
            <v-alert type="info" class="text-center">
              Você ainda não fez nenhuma compra.
            </v-alert>
          </v-col>

          <!-- Listagem das Compras -->
          <v-col cols="12" v-else v-for="(purchase, index) in purchaseHistory" :key="index">
            <v-card class="mb-4" outlined>
              <v-card-title>{{ purchase.product__name }}</v-card-title>
              <v-card-subtitle>
                {{ formatDate(purchase.purchase_date) }}
              </v-card-subtitle>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-img :src="purchase.product__image_link" alt="Imagem do produto {{ purchase.product__name }}" width="150" max-width="100%"></v-img>
                  </v-col>
                  <v-col cols="12" md="8">
                    <p><strong>Quantidade:</strong> {{ purchase.quantity }}</p>
                    <p><strong>Valor da Compra:</strong> {{ formatToBrCurrency(purchase.purchase_value) }}</p>
                    <p><strong>Método de Pagamento:</strong> {{ purchase.payment_method__method }}</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
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
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import CartDrawer from '@/components/CartDrawer.vue';
import { useUserStore } from '@/stores/userStore';
import { userPurchaseHistory } from '@/utils/rest';
import { formatToBrCurrency } from '@/utils/utils';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const sidebar = ref(false);
const cartDrawer = ref(false);

const snackbar = ref(false);
const snackbarMessage = ref('');

const purchaseHistory = ref([]);

const fetchPurchaseHistory = async () => {
  if (!userStore.user) {
    router.push({ name: 'login' });
    return;
  }
  try {
    const data = await userPurchaseHistory(userStore.user.email);
    purchaseHistory.value = data;
  } catch (error) {
    console.error('Erro ao obter histórico de compras:', error);
    snackbarMessage.value = 'Erro ao carregar histórico de compras.';
    snackbar.value = true;
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const toggleSidebar = () => {
  sidebar.value = !sidebar.value;
};

const openCart = () => {
  cartDrawer.value = true;
};

const handleSearch = (searchTerm) => {
  router.push({ name: 'search-results', query: { q: searchTerm } });
};

onMounted(() => {
  fetchPurchaseHistory();
});
</script>

<style scoped>
.purchase-history-container {
  background-color: #f3f1f0;
  min-height: 100vh;
}
.mt-5 {
  margin-top: 3rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
.text-center {
  text-align: center;
}
</style>
