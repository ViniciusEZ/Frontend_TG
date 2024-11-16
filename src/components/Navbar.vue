<template>
    <v-app-bar :elevation="2" height="90">
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click="$emit('toggle-sidebar')"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title
        @click="router.push({name: 'home'})" style="cursor: pointer;">
        Asteri
        </v-app-bar-title>
        
        <v-text-field 
        v-model="searchTerm"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            variant="solo"
            hide-details
            @keyup.enter="handleSearch"
            @click:append="handleSearch"
            clearable
            height="50"
            :aria-label="'Pesquisar produtos'"
            @input="$emit('search', $event)"
        ></v-text-field>
        <v-spacer></v-spacer>
        <template v-slot:append>
            <v-btn aria-label="Conta" icon @click="$emit('account')">
                <v-icon>mdi-account</v-icon>
            </v-btn>
            <v-btn 
                icon
                @click="$emit('open-cart')" 
                aria-label="Carrinho"
            >
                <template v-if="itemCount > 0">
                    <v-badge
                        color="red"
                        :content="itemCount"
                        overlap
                        bordered
                    >
                        <v-icon>mdi-cart</v-icon>
                    </v-badge>
                </template>
                <template v-else>
                    <v-icon>mdi-cart</v-icon>
                </template>
            </v-btn>
        </template>
    </v-app-bar>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import { useCartStore } from '@/stores/cartStore';
    import { useRouter } from 'vue-router';

    const cartStore = useCartStore();
    const itemCount = computed(() => cartStore.itemCount);
    const searchTerm = ref('');
    const router = useRouter();

    const handleSearch = () => {
        const trimmedTerm = searchTerm.value.trim();
        if (trimmedTerm) {
            router.push({ name: 'search-results', query: { q: trimmedTerm } });
        }
        else {
            router.push({name: 'home'})
        }
    };

    const handleClear = () => {
    searchTerm.value = '';
    };
</script>

<style scoped>
.ml-4 {
    margin-left: 16px;
}
</style>