import axios from "axios";
const envBaseUrl = import.meta.env.BACKEND_URL;
const baseUrl = envBaseUrl ? envBaseUrl : 'http://localhost:8000';


async function getProducts(page = 1, sortOption = 'default') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('sort', sortOption);

    return axios.get(
        `${baseUrl}/products/get-products`, { params }
    ).then((response) => {
        return response.data;
    }).catch(e => {
        console.error(e);
    });
}


async function getSearchedProducts(searchTerm, page = 1, sortOption = 'default', filters = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('sort', sortOption);

    if (filters.selectedSuppliers && filters.selectedSuppliers.length > 0) {
        filters.selectedSuppliers.forEach(supplier => {
            params.append('suppliers', supplier);
        });
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        params.append('min_price', filters.minPrice);
        params.append('max_price', filters.maxPrice);
    }

    return axios.get(
        `${baseUrl}/products/search/${encodeURIComponent(searchTerm)}`, { params }
    ).then((response) => {
        return response.data;
    }).catch(e => {
        console.error(e);
    });
}

async function getProduct(productId) {
    return axios.get(
        `${baseUrl}/products/product/${productId}`
    ).then((response) => {
        return response.data
    }).catch(e => {});
}

async function getUser(userEmail) {
    return axios.post(
        `${baseUrl}/user/get-user`, 
        {
            userEmail
        }
    ).then(response => {
        return response.data
    }).catch(e => {})
}

async function userPurchaseHistory(userEmail) {
    return axios.post(
        `${baseUrl}/user/purchase-history`, 
        {
            userEmail
        }
    ).then(response => {
        return response.data
    }).catch(e => {})
}

export {
    baseUrl,
    getProducts,
    getSearchedProducts,
    getProduct,
    getUser,
    userPurchaseHistory
}