import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const cartItems = ref([]);

    const loadCart = () => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            try {
                cartItems.value = JSON.parse(storedCart);
            } catch (error) {
                console.error('Erro ao carregar o carrinho do localStorage:', error);
                cartItems.value = [];
            }
        }
    };

    loadCart();

    const itemCount = computed(() => {
        return cartItems.value.reduce((total, item) => total + item.quantity, 0);
    });

    const totalValue = computed(() => {
        return cartItems.value.reduce((total, item) => total + item.product.price * item.quantity, 0);
    });

    const addToCart = (product) => {
        const existingItem = cartItems.value.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.value.push({ product, quantity: 1 });
        }
    };

    
    const removeFromCart = (product) => {
        const existingItemIndex = cartItems.value.findIndex(item => item.product.id === product.id);
        if (existingItemIndex !== -1) {
            if (cartItems.value[existingItemIndex].quantity > 1) {
                cartItems.value[existingItemIndex].quantity--;
            } else {
                cartItems.value.splice(existingItemIndex, 1);
            }
        }
    };

    const removeItemCompletely = (product) => {
        const existingItemIndex = cartItems.value.findIndex(item => item.product.id === product.id);
        if (existingItemIndex !== -1) {
            cartItems.value.splice(existingItemIndex, 1);
        }
    };

 
    const checkout = () => {
        cartItems.value = [];
        alert('Compra finalizada com sucesso!');
    };

    
    watch(cartItems, (newCart) => {
        localStorage.setItem('cartItems', JSON.stringify(newCart));
    }, { deep: true });

    return {
        cartItems,
        itemCount,
        totalValue,
        addToCart,
        removeFromCart,
        removeItemCompletely,
        checkout
    };
});