import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import SearchResults from '@/views/SearchResults.vue';
import ProductDetails from '@/views/ProductDetails.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/search',
      name: 'search-results',
      component: SearchResults,
      props: route => ({ query: route.query.q })
    },
    {
      path: '/product/:id',
      name: 'product-details',
      component: ProductDetails,
      props: true
    }
  ],
});

export default router;

