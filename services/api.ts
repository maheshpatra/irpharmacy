import axios from '../helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PINCODE = '721434';

async function getStoredToken(): Promise<string | null> {
    try {
        const raw = await AsyncStorage.getItem('ACCESS_TOKEN');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return typeof parsed === 'string' ? parsed : null;
    } catch {
        return null;
    }
}

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

    getHomeTabs: async () => {
        try {
            const response = await axios.post("homepage/fetch.php");
            return response.data;
        } catch (e) {
            console.warn("homepage/fetch.php is not in v2 docs");
            throw e;
        }
    },

    // 3. Categories
    getCategories: async () => {
        const response = await axios.get("medicine/get_categories.php");
        return response.data;
    },

    // 4. Prescriptions
    uploadPrescription: async (image: any, name: string, type: string) => {
        const formData = new FormData();
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

    // 5. Medicine Search
    searchMedicines: async (query: string, pincode: string = DEFAULT_PINCODE, page: number = 1, limit: number = 20) => {
        const formData = new FormData();
        formData.append('query', query);
        formData.append('pincode', pincode);
        formData.append('page', page.toString());
        formData.append('limit', limit.toString());

        try {
            const response = await fetch("https://irhealthcareservice.com/app_api/v2/medicine/search.php", {
                method: "POST",
                body: formData,
                redirect: "follow"
            });
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch {
                return [];
            }
        } catch (error) {
            throw error;
        }
    },

    // Fetch featured medicines from the dedicated get_featured.php endpoint
    // The backend auto-creates the featured_medicines table and falls back
    // to newest in-stock medicines when no featured ones are configured.
    getFeaturedMedicines: async (pincode: string = DEFAULT_PINCODE, limit: number = 10) => {
        try {
            const response = await axios.get(
                `medicine/get_featured.php?pincode=${pincode}&limit=${limit}`
            );
            return response.data;
        } catch {
            return { status: 'error', data: [] };
        }
    },

    getMedicineById: async (id: number | string, pincode: string = DEFAULT_PINCODE) => {
        try {
            const token = await getStoredToken();
            const headers: Record<string, string> = { Accept: '*/*' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const url = `https://irhealthcareservice.com/app_api/v2/medicine/get_by_id.php?id=${id}&pincode=${pincode}`;
            const response = await fetch(url, { headers });
            const text = await response.text();
            return JSON.parse(text);
        } catch (error) {
            throw error;
        }
    },

    getMedicinesByCategory: async (category: string, page: number = 1, pincode: string = DEFAULT_PINCODE) => {
        try {
            const encodedCategory = encodeURIComponent(category);
            const response = await fetch(`https://irhealthcareservice.com/app_api/v2/medicine/get_by_category.php?category=${encodedCategory}&page=${page}&pincode=${pincode}`);
            return await response.json();
        } catch {
            return { status: 'error', data: [] };
        }
    },

    // 6. Cart Management
    // GET /cart/get_cart.php?pincode=721434 (Bearer token required)
    getCart: async (pincode: string = DEFAULT_PINCODE) => {
        const response = await axios.get(`cart/get_cart.php?pincode=${pincode}`);
        return response.data;
    },

    // POST /cart/add_to_cart.php  (requires: medID, qty, pincode)
    addToCart: async (medID: number, qty: number = 1, pincode: string = DEFAULT_PINCODE, pharID?: number) => {
        const formData = new FormData();
        formData.append('medID', medID.toString());
        formData.append('qty', qty.toString());
        formData.append('pincode', pincode);
        if (pharID) formData.append('pharID', pharID.toString());
        const response = await axios.post("cart/add_to_cart.php", formData);
        return response.data;
    },

    // POST /cart/update_cart.php  (requires: medID, qty)
    updateCart: async (medID: number, qty: number) => {
        const formData = new FormData();
        formData.append('medID', medID.toString());
        formData.append('qty', qty.toString());
        const response = await axios.post("cart/update_cart.php", formData);
        return response.data;
    },

    // POST /cart/remove_from_cart.php  (requires: medID)
    removeFromCart: async (medID: number) => {
        const formData = new FormData();
        formData.append('medID', medID.toString());
        const response = await axios.post("cart/remove_from_cart.php", formData);
        return response.data;
    },

    // 7. Orders
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

    // 8. Address Management
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
    },

    // 9. User Profile
    uploadPhoto: async (imageUri: string) => {
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('photo', { uri: imageUri, name: filename, type: type } as any);
        const response = await axios.post("user/upload_photo.php", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    getUser: async () => {
        const response = await axios.get("user/get_user.php");
        return response.data;
    },

    updateEmail: async (email: string) => {
        const params = new URLSearchParams();
        params.append('email', email);
        const response = await axios.post("user/update_email.php", params.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data;
    }
};
