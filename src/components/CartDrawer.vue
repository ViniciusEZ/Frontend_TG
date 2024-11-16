<template>
    <v-navigation-drawer
        v-model="drawer"
        location="right"
        temporary
        width="400"
        @click:outside="handleOutsideClick"
    >
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="text-h6">Produtos</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            
            <v-list-item v-for="item in paginatedCartItems" :key="item.product.id">
                <v-card outlined class="mb-2 product-image-container">
                    <v-row no-gutters align="center">
                        <v-col cols="4">
                            <router-link :to="{ name: 'product-details', params: { id: item.product.id } }">
                                <v-img 
                                    :src="item.product.image_link" 
                                    height="80" 
                                    :alt="item.product.name"
                                    class="product-image"
                                ></v-img>
                            </router-link>
                        </v-col>
                        <v-col cols="8">
                            <v-card-title>{{ item.product.name }}</v-card-title>
                            
                            
                            <v-row align="center" class="mt-2">
                                <v-col class="d-flex justify-center">
                                    <span>Quantidade: {{ item.quantity }}</span>
                                </v-col>
                                <v-col>
                                    <v-card-subtitle class="d-flex justify-center">
                                        <strong>Total: {{ formatToBrCurrency(item.product.price * item.quantity) }}</strong>
                                    </v-card-subtitle>
                                </v-col>
                                <v-col class="d-flex justify-center">
                                    <v-btn 
                                        small 
                                        color="red" 
                                        @click="removeFromCart(item)"
                                        class="mx-2"
                                        aria-label="Remover {{ item.product.name }}"
                                    >
                                        Remover
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
            </v-list-item>

             <!-- Paginação -->
            <v-list-item v-if="totalPages > 1">
                <v-list-item-content>
                <v-pagination
                    v-model="currentPage"
                    :length="totalPages"
                    :total-visible="5"
                    circle
                    color="primary"
                    aria-label="Navegação de Paginação"
                ></v-pagination>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list-item align-center>
                <v-list-item-content>
                    <v-list-item-title class="text-right font-weight-bold">
                        Total: {{ formatToBrCurrency(totalValue) }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
                <v-btn 
                    color="primary" 
                    block 
                    @click="checkout"
                    :disabled="cartItems.length === 0"
                >
                    Finalizar Compra
                </v-btn>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
    import { computed, ref, watch } from 'vue';
    import { useCartStore } from '@/stores/cartStore';
    import { formatToBrCurrency, handleError } from '@/utils/utils.js'; 

    const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
    });

    const emit = defineEmits(['update:modelValue', 'snackbar-message', 'show-snackbar']);

    const cartStore = useCartStore();

    const cartItems = computed(() => cartStore.cartItems);
    const totalValue = computed(() => cartStore.totalValue);

    const drawer = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
    });

  
    const currentPage = ref(1);
    const itemsPerPage = 5;

 
    const totalPages = computed(() => {
        return Math.ceil(cartItems.value.length / itemsPerPage);
    });

   
    const paginatedCartItems = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return cartItems.value.slice(start, end);
    });

   
    watch(cartItems, (newItems) => {
        const newTotalPages = Math.ceil(newItems.length / itemsPerPage);
        if (currentPage.value > newTotalPages) {
            currentPage.value = newTotalPages || 1;
        }

        if (paginatedCartItems.value.length === 0 && currentPage.value > 0) {
            currentPage.value -= 1;
        }
    
    });


    function removeFromCart(item) {
        cartStore.removeFromCart(item.product);
        if (item.quantity === 1) {
            emit('snackbar-message', `${item.product.name} removido do carrinho.`);
        } else {
            emit('snackbar-message', `${item.product.name} atualizado no carrinho.`);
        }
        emit('show-snackbar', true);
    }

    function checkout() {
    try {
        cartStore.checkout();
        emit('snackbar-message', 'Compra finalizada com sucesso!');
        emit('show-snackbar', true);
        emit('update:modelValue', false); 
    } catch (error) {
        handleError(error, 'Erro ao finalizar a compra.', emit('snackbar-message'), emit('show-snackbar'));
    }
    }

    function handleOutsideClick() {
        emit('update:modelValue', false);
    }
</script>

<style scoped>
.product-image-container {
    padding: 15px;
    margin-bottom: 10px;
}

.product-image {
    transition: transform 0.3s;
}
.product-image:hover {
    transform: scale(1.05);
  }
</style>
