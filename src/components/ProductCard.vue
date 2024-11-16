<template>
    <v-card class="product-card" outlined>
      <router-link :to="{ name: 'product-details', params: { id: product.id } }">
        <v-img
          :src="product.image_link"
          height="220"
          :alt="product.name"
          lazy
          class="product-image"
        ></v-img>
      </router-link>
  
      <v-card-title>{{ product.name }}</v-card-title>
      <v-card-subtitle>{{ formatToBrCurrency(product.price) }}</v-card-subtitle>
  
      <v-card-actions>
        <v-btn
          variant="tonal"
          block
          color="green"
          @click="handleComprar"
          aria-label="Comprar {{ product.name }}"
        >
          Comprar
        </v-btn>
      </v-card-actions>
  
      <v-card-actions>
        <v-btn
          variant="tonal"
          color="orange"
          block
          append-icon="mdi-cart"
          @click="handleAdicionarAoCarrinho"
          :aria-label="'Adicionar ' + product.name + ' ao carrinho'"
        >
          Adicionar ao carrinho
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import { formatToBrCurrency } from '@/utils/utils.js';
  
  const props = defineProps({
    product: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['add-to-cart', 'comprar']);
  
  function handleAdicionarAoCarrinho() {
    emit('add-to-cart', props.product);
  }
  
  function handleComprar() {
    emit('comprar', props.product);
  }
  </script>
  
  <style scoped>
  .product-card {
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .product-image {
    border-radius: 8px;
    transition: transform 0.3s;
  }
  
  
  .product-image:hover {
    transform: scale(1.05);
  }
  </style>
  