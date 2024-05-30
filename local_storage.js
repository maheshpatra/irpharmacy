import AsyncStorage from '@react-native-async-storage/async-storage';

export async function _storeData(key, value) {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue);
        return "saved";
    } catch (error) {
        return "error";
    }
}

export async function _retrieveData(key) {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;


    } catch (error) {
        return "error"
    }
}

export async function _removeData(key) {
    try {
        await AsyncStorage.removeItem(key);
        return "removed";

    } catch (err) {
        return "error"
    }
}

