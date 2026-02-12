import axios from '../helper';

export const ApiService = {
    // Homepage
    getBanners: async () => {
        try {
            const response = await axios.post("banner/fetch.php");
            return response.data;
        } catch (error) {
            console.error("Error fetching banners:", error);
            throw error;
        }
    },
    getHomeTabs: async () => {
        try {
            const response = await axios.post("homepage/fetch.php");
            return response.data;
        } catch (error) {
            console.error("Error fetching home tabs:", error);
            throw error;
        }
    },

    // Products
    searchProducts: async (query: string) => {
        try {
            const response = await axios.post("products/search.php", { query });
            // Hypothetical endpoint, adapt as needed based on actual API
            return response.data;
        } catch (error) {
            console.error("Error searching products:", error);
            throw error;
        }
    },

    // Auth (Examples, expand as needed)
    login: async (credentials: any) => {
        const response = await axios.post("auth/login.php", credentials);
        return response.data;
    },

    // Cart (if server-side cart exists)
    // addToCart: ...
};
