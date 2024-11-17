<template>
    <Navbar 
        @open-cart="openCart" 
        @toggle-sidebar="toggleSidebar"
    />

    <Sidebar v-model="sidebar" />
 
    <CartDrawer 
        v-model="cartDrawer" 
        @snackbar-message="snackbarMessage = $event" 
        @show-snackbar="snackbar = $event" 
    />
    <v-container></v-container>
    <v-container></v-container>
    <div style="background: #f3f1f0;">
        <v-container class="main-container">
            <v-autocomplete 
                variant="outlined" 
                label="Filtro" 
                clearable 
                width="250"
                :items="filterOptions" 
                v-model="selectedFilter"
            ></v-autocomplete>
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
                aria-label="Carregando produtos">
            </v-progress-circular>
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
    import { getProducts } from '@/utils/rest';
    import { useCartStore } from '@/stores/cartStore';
    import Navbar from '@/components/Navbar.vue'; 
    import CartDrawer from '@/components/CartDrawer.vue'; 
    import ProductCard from '@/components/ProductCard.vue'; 
    import { sortProducts, alertComprar } from '@/utils/utils.js'; 
    import Sidebar from '@/components/Sidebar.vue'; 

    const cartStore = useCartStore();
    const sidebar = ref(false);     
    const filterOptions = ['Mais vendidos', 'Preço decrescente', 'Preço crescente'];
    const products = ref([]);
    const itemsPerPage = 12;
    const totalProducts = ref(0);
    const currentPage = ref(1);
    const loading = ref(false);
    const selectedFilter = ref(null);
    const snackbar = ref(false);
    const snackbarMessage = ref('');
    const cartDrawer = ref(false); 
    const pageCount = ref(0);

    

    const fetchProducts = async () => {
        loading.value = true;
        try {
            const data = await getProducts(currentPage.value, selectedFilter.value || 'default');
            products.value = data.results;
            totalProducts.value = data.count;
            pageCount.value = Math.ceil(totalProducts.value / itemsPerPage);
        } catch (e) {
            console.error('Erro ao carregar produtos:', e);
        } finally {
            loading.value = false;
        }
    };

    const toggleSidebar = () => {
        sidebar.value = !sidebar.value;
    };

    const filteredProducts = computed(() => {
        let tempProducts = sortProducts(products.value, selectedFilter.value);
        return tempProducts;
    });

    const addToCart = (product) => {
        cartStore.addToCart(product);
        snackbarMessage.value = `${product.name} adicionado ao carrinho.`;
        snackbar.value = true;
    };

    const comprar = (product) => {
        alertComprar(product);
    };

    function openCart() {
        cartDrawer.value = true;
    }

    watch(currentPage, (newPage) => {
        fetchProducts(newPage);
    });

    watch([currentPage, selectedFilter], () => {
        fetchProducts();
    });
    onMounted(async () => {
        fetchProducts(currentPage.value);
    });


</script>

<style scoped>
.main-container {
    width: 50%; 
    margin-top: 20px;
}
.product-image-container {
    padding: 15px;
    margin-bottom: 10px;
}
</style>
