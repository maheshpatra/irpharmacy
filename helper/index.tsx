import Axios from "axios";

export const AbortRequest = new AbortController();

const instance = Axios.create({
    headers: {
        "Accept": "*/*",
    },
    withCredentials: true,
    baseURL: "https://dipantan.live/irpharmacy",
    timeout: 5000,
    signal: AbortRequest.signal
});

// const axios = setupCache(instance, {
//   // use react native AsyncStorage as storage
//   storage: buildStorage({
//     set: async (key, value) => {
//       const data = JSON.stringify(value);
//       AsyncStorage.setItem(key, data);
//     },
//     async find(key) {
//       const data = await AsyncStorage.getItem(key);
//       if (data) {
//         return JSON.parse(data);
//       }
//       return undefined;
//     },
//     remove: async (key) => {
//       AsyncStorage.removeItem(key);
//     },
//   }),
// });

instance.interceptors.request.use(config => {
    config.timeout = 5000; // Wait for 5 seconds before timing out
    return config;
});

instance.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);

export default instance;