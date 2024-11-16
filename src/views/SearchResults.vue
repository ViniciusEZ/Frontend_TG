<template>

    
    <Navbar @open-cart="openCart" />

    <CartDrawer 
      v-model="cartDrawer" 
      @snackbar-message="snackbarMessage = $event" 
      @show-snackbar="snackbar = $event" 
    />
    <v-container></v-container>
    <v-container></v-container>

    <div style="background: #f3f1f0; height: 100%;">
      <v-container class="main-container">
        <v-row>
           
          <v-col style="margin-top: 80px" cols="12" md="3">
            <v-card class="pa-4">
              
              <v-autocomplete
                variant="outlined"
                label="Filtro"
                clearable
                :items="filterOptions"
                v-model="selectedFilter"
              ></v-autocomplete>

              <h3 class="mt-4">Fornecedores</h3>
              <v-chip-group
                v-model="selectedSuppliers"
                multiple
                active-class="primary--text"
              >
                <v-chip
                  v-for="supplier in suppliers"
                  :key="supplier"
                  :value="supplier"
                  class="ma-2"
                  outlined
                >
                  {{ supplier }}
                </v-chip>
              </v-chip-group>

              <div class="mt-4" v-if="priceMax > priceMin">
                <h3>Faixa de Preço</h3>
                <v-range-slider
                  v-model="selectedPriceRange"
                  :min="priceMin"
                  :max="priceMax"
                  :step="1"
                  label="Preço"
                  thumb-label
                  class="mt-2"
                  @change="currentPage = 1"
                  :aria-label="'Faixa de preço selecionada'"
                ></v-range-slider>
                <div class="d-flex justify-space-between">
                  <span>{{ formatToBrCurrency(selectedPriceRange[0]) }}</span>
                  <span>{{ formatToBrCurrency(selectedPriceRange[1]) }}</span>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">

            <h1 class="text-center my-4">
              Resultados da pesquisa para "{{ searchTerm }}"
            </h1>

            <v-row>
              <v-col
                v-for="product in products"
                :key="product.id"
                cols="12"
                sm="6"
                md="4"
              >
                <ProductCard
                  :product="product"
                  @add-to-cart="addToCart"
                  @comprar="comprar"
                />
              </v-col>
            </v-row>

            <v-pagination
              v-model="currentPage"
              :length="pageCount"
              :total-visible="5"
              color="primary"
              class="mt-4"
            ></v-pagination>

            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
              class="d-flex mx-auto mt-4"
              aria-label="Carregando produtos"
            >
            </v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-snackbar v-model="snackbar" timeout="3000" top right>
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import Navbar from '@/components/Navbar.vue';
import CartDrawer from '@/components/CartDrawer.vue';
import ProductCard from '@/components/ProductCard.vue';
import { getSearchedProducts } from '@/utils/rest';
import { sortProducts, handleError, alertComprar, formatToBrCurrency } from '@/utils/utils.js'; // Importação das funções

const cartStore = useCartStore();
const route = useRoute();

const filterOptions = ['Mais vendidos', 'Preço decrescente', 'Preço crescente'];
const products = ref([]);
const suppliers = ref([]);
const selectedFilter = ref(null);
const selectedSuppliers = ref([]);
const itemsPerPage = 12;
const currentPage = ref(1);
const loading = ref(false);
const snackbar = ref(false);
const pageCount = ref(0);
const snackbarMessage = ref('');
const cartDrawer = ref(false);
const searchTerm = ref(route.query.q || '');
const priceMin = ref(0);
const priceMax = ref(0);
const selectedPriceRange = ref([0, 0]);
const totalProducts = ref(0);




const fetchSearchedProducts = async () => {
    loading.value = true;
    try {
        const filters = {
            selectedSuppliers: selectedSuppliers.value,
            minPrice: selectedPriceRange.value[0],
            maxPrice: selectedPriceRange.value[1],
        };
        const data = await getSearchedProducts(
            searchTerm.value,
            currentPage.value,
            selectedFilter.value || 'default',
            filters
        );

        products.value = data.results.products;
        totalProducts.value = data.count;
        pageCount.value = Math.ceil(totalProducts.value / itemsPerPage);
        suppliers.value = data.results.suppliers;

        priceMin.value = data.results.static_min;
        priceMax.value = data.results.static_max;

        if (selectedPriceRange.value[0] === 0 && selectedPriceRange.value[1] === 0) {
            selectedPriceRange.value = [priceMin.value, priceMax.value];
        }

    } catch (error) {
        console.error('Erro ao carregar produtos pesquisados:', error);
    } finally {
        loading.value = false;
    }
};

const addToCart = (product) => {
  cartStore.addToCart(product);
  snackbarMessage.value = `${product.name} adicionado ao carrinho.`;
  snackbar.value = true;
};

const comprar = (product) => {
  alertComprar(product);
};

const openCart = () => {
  cartDrawer.value = true;
};

const onPriceRangeChange = () => {
  currentPage.value = 1;
  console.log('Slider alterado:', selectedPriceRange.value);
};

watch(
  () => route.query.q,
  (newQuery) => {
    searchTerm.value = newQuery;
    console.log('Novo termo de pesquisa:', searchTerm.value);
    fetchSearchedProducts();
  }
);

watch([searchTerm, currentPage], ([newSearchTerm, newPage]) => {
    fetchSearchedProducts(newSearchTerm, newPage);
});

watch([searchTerm, currentPage, selectedFilter, selectedSuppliers, selectedPriceRange], () => {
    fetchSearchedProducts();
});

watch([searchTerm, currentPage, selectedFilter], () => {
    fetchSearchedProducts();
});

// Lifecycle Hook
onMounted(() => {
  fetchSearchedProducts();
});
</script>

<style scoped>
.main-container {
  width: 100%;
  margin-top: 20px;
}
.text-center {
  text-align: center;
}
.my-4 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
.d-flex {
  display: flex;
}
.justify-space-between {
  justify-content: space-between;
}
.pa-4 {
  padding: 1rem;
}
</style>
