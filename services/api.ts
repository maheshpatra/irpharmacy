import axios from '../helper';

export const ApiService = {
    // 1. Authentication
    requestOtp: async (mobile: string) => {
        const formData = new FormData();
        formData.append('mobile', mobile);
        const response = await axios.post("auth/request_otp.php", formData);
        return response.data;
    },
    verifyOtp: async (mobile: string, otp: string) => {
        const formData = new FormData();
        formData.append('mobile', mobile);
        formData.append('otp', otp);
        const response = await axios.post("auth/verify_otp.php", formData);
        return response.data;
    },

    // 2. Banners
    getBanners: async (position?: string) => {
        let url = "banner/fetch_banners.php";
        if (position) url += `?position=${position}`;
        const response = await axios.get(url);
        return response.data;
    },
    // Keeping for backward compatibility if needed, but fetch_banners.php seems to be the one
    getHomeTabs: async () => {
        // homepage/fetch.php is not in v2 docs, might be legacy. 
        // Leaving it as is or removing? 
        // User asked to update all api url. If this is not in doc, maybe it's removed?
        // But better safe than sorry, I will keep it but maybe it's not v2?
        // The prompt says "update poperly all api url", implies updating EXISTING ones to NEW ones.
        // If homepage/fetch.php is not in list, maybe it should be removed?
        // But I don't want to break the app if it's used.
        try {
            const response = await axios.post("homepage/fetch.php");
            return response.data;
        } catch (e) {
            console.warn("homepage/fetch.php is not in v2 docs");
            throw e;
        }
    },

    // 3. Prescriptions
    uploadPrescription: async (image: any, name: string, type: string) => {
        const formData = new FormData();
        // image should be file object or similar
        formData.append('image', image);
        formData.append('name', name);
        formData.append('type', type);

        const response = await axios.post("prescription/upload.php", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },
    getPrescriptions: async () => {
        const response = await axios.get("prescription/get_prescriptions.php");
        return response.data;
    },

    // 4. Medicine Search
    searchMedicines: async (pincode: string, dataItems: { id: string }[]) => {
        const medDetail = JSON.stringify({ pincode, data: dataItems });
        const formData = new FormData();
        formData.append('medDetail', medDetail);

        const response = await axios.post("medicine/search.php", formData);
        return response.data;
    },
    // Old searchProducts wrapper?
    searchProducts: async (query: string) => {
        // This function was used for text search. 
        // The new API medicine/search.php takes IDs, not query string.
        // So this old method is likely incompatible with the new API unless there's another endpoint.
        // I'll keep it pointing to old link or update if I knew how.
        // Assuming products/search.php might still be there or I should use medicine/search.php in a way I don't know?
        // Leaving it as is with a comment or matching existing code usage.
        const response = await axios.post("products/search.php", { query });
        return response.data;
    },

    // 5. Cart Management
    getCart: async (pincode: string) => {
        const formData = new FormData();
        formData.append('pincode', pincode);
        const response = await axios.post("cart/get_cart.php", formData);
        return response.data;
    },
    addToCart: async (medID: number, qty: number = 1, pharID?: number) => {
        const formData = new FormData();
        formData.append('medID', medID.toString());
        formData.append('qty', qty.toString());
        if (pharID) formData.append('pharID', pharID.toString());
        const response = await axios.post("cart/add_to_cart.php", formData);
        return response.data;
    },
    updateCart: async (medID: number, qty: number) => {
        const formData = new FormData();
        formData.append('medID', medID.toString());
        formData.append('qty', qty.toString());
        const response = await axios.post("cart/update_cart.php", formData);
        return response.data;
    },
    removeFromCart: async (medID: number) => {
        const formData = new FormData();
        formData.append('medID', medID.toString());
        const response = await axios.post("cart/remove_from_cart.php", formData);
        return response.data;
    },

    // 6. Orders
    createOrder: async (address: string, orderDetails: any[], pdata: any, amount?: number, paymentMethod?: string, discount?: number) => {
        const formData = new FormData();
        formData.append('address', address);
        formData.append('order_details', JSON.stringify(orderDetails));
        formData.append('pdata', JSON.stringify(pdata));
        if (amount) formData.append('amount', amount.toString());
        if (paymentMethod) formData.append('payment_method', paymentMethod);
        if (discount) formData.append('discount', discount.toString());

        const response = await axios.post("order/create_order.php", formData);
        return response.data;
    },
    getOrders: async () => {
        const response = await axios.get("order/get_orders.php");
        return response.data;
    },
    getOrderDetails: async (orderId?: string, id?: number) => {
        const formData = new FormData();
        if (orderId) formData.append('order_id', orderId);
        if (id) formData.append('id', id.toString());
        const response = await axios.post("order/get_order.php", formData);
        return response.data;
    },

    // 7. Address Management
    addAddress: async (pname: string, usermob: string, address: string) => {
        const formData = new FormData();
        formData.append('pname', pname);
        formData.append('usermob', usermob);
        formData.append('address', address);
        const response = await axios.post("address/add_address.php", formData);
        return response.data;
    },
    getAddresses: async () => {
        const response = await axios.get("address/get_address.php");
        return response.data;
    },
    updateAddress: async (id: number, pname: string, usermob: string, address: string) => {
        const formData = new FormData();
        formData.append('id', id.toString());
        formData.append('pname', pname);
        formData.append('usermob', usermob);
        formData.append('address', address);
        const response = await axios.post("address/update_address.php", formData);
        return response.data;
    },
    deleteAddress: async (id: number) => {
        const formData = new FormData();
        formData.append('id', id.toString());
        const response = await axios.post("address/delete_address.php", formData);
        return response.data;
    }
};
