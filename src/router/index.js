import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BACKEND_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('@/views/Home.vue'),
    },
    {
      path: '/search',
      name: 'search-results',
      component: import('@/views/SearchResults.vue'),
      props: route => ({ query: route.query.q })
    },
    {
      path: '/product/:id',
      name: 'product-details',
      component: import('@/views/ProductDetails.vue'),
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: import('@/views/Register.vue'),
    },
    {
      path: '/account-data',
      name: 'account-data',
      component: import('@/views/AccountData.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/purchase-history',
      name: 'purchase-history',
      component: import('@/views/PurchaseHistory.vue'),
      meta: { requiresAuth: true },
    },
    
    // {
    //   path: '/forgot-password',
    //   name: 'forgot-password',
    //   component: ForgotPassword,
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;

