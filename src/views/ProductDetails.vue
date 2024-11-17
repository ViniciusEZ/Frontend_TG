<template>
  <div>

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
   
    <v-container class="product-details-container">

      <v-row>

        <v-col cols="12" md="6">
 
          <v-card class="image-container" outlined elevation="2">
            <v-img
              :src="product.image_link"
              :alt="product.name"
              max-width="100%"
              class="product-image"
            ></v-img>
          </v-card>
        </v-col>

  
        <v-col cols="12" md="6">
    
          <v-card class="info-container" outlined elevation="2">
            <v-card-title class="product-name">{{ product.name }}</v-card-title>
            <v-card-subtitle class="product-price">{{ formatToBrCurrency(product.price) }}</v-card-subtitle>
            <v-card-subtitle class="product-supplier">Fornecedora: {{ supplier }}</v-card-subtitle>

         
            <v-row class="actions-row">
              <v-col  cols="6" class="d-flex justify-center">
                <v-btn
                  color="green"
                  @click="handleComprar"
                  aria-label="Comprar {{ product.name }}"
                >
                  Comprar
                </v-btn>
              </v-col>
              <v-col cols="6" class="d-flex justify-center">
                <v-btn
                  color="orange"
                  @click="handleAdicionarAoCarrinho"
                  :aria-label="'Adicionar ' + product.name + ' ao carrinho'"
                >
                  <v-icon>mdi-cart</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>


      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="details-container" outlined elevation="2">
            <v-card-title>Detalhes Técnicos</v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-item v-for="(value, key) in details" :key="key">
                <v-list-item-content>
                  <v-list-item-title>{{ key }}: {{ value }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>


      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="d-flex mx-auto mt-4"
        aria-label="Carregando detalhes do produto"
      ></v-progress-circular>


      <v-alert
        v-if="error"
        type="error"
        dismissible
        class="mt-4"
      >
        {{ errorMessage }}
      </v-alert>
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
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import CartDrawer from '@/components/CartDrawer.vue';
import { formatToBrCurrency, handleError, alertComprar } from '@/utils/utils.js';
import { getProduct } from '@/utils/rest.js';
import { useCartStore } from '@/stores/cartStore';
import Sidebar from '@/components/Sidebar.vue';

const route = useRoute();
const cartStore = useCartStore();

const sidebar = ref(false);
const product = ref({});
const details = ref({});
const supplier = ref('');
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const snackbar = ref(false);
const snackbarMessage = ref('');
const cartDrawer = ref(false);

const productId = route.params.id;

function openCart() {
  cartDrawer.value = true;
}

function handleAdicionarAoCarrinho() {
  cartStore.addToCart(product.value);
  snackbarMessage.value = `${product.value.name} adicionado ao carrinho.`;
  snackbar.value = true;
}

const toggleSidebar = () => {
    sidebar.value = !sidebar.value;
  };

function handleComprar() {
  alertComprar(product.value);
}

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getProduct(productId);
    if (data.product && data.product.length > 0) {
      product.value = data.product[0];
      details.value = data.detail || {};
      supplier.value = data.supplier || 'Desconhecida';
    } else {
      throw new Error('Produto não encontrado.');
    }
  } catch (err) {
    handleError(
      err,
      'Erro ao carregar detalhes do produto.',
      (msg) => {
        errorMessage.value = msg;
      },
      () => {
        error.value = true;
      }
    );
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.product-details-container {
  padding: 20px;
}

.image-container,
.info-container,
.details-container {
  margin-bottom: 20px;
  padding: 20px;
}

.image-container,
.info-container,
.details-container {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-image {
  border-radius: 8px;
}

.product-name {
  font-size: 1.8rem;
  font-weight: bold;
}

.product-price {
  font-size: 1.6rem;
  color: #2e7d32;
  font-weight: bold;
}

.product-supplier {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 20px;
}

.actions-row {
  margin-top: 20px;
}

.actions-row .v-btn {
  width: 100%;
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>
