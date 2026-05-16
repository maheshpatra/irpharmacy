import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, ActivityIndicator, StatusBar, ToastAndroid, Modal, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import { useStore } from '../store/useStore';
import { _retrieveData } from '../local_storage';
import { showAlert } from '../components/CustomAlert';
import axios from '../helper';
import RazorpayCheckout from 'react-native-razorpay';
import { WebView } from 'react-native-webview';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CheckoutItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    discount?: number;
    gst?: number;
    status?: string;
}

export default function Checkout() {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const { cart, user, clearCart, addresses, selectedAddress, setSelectedAddress, fetchAddresses: storeFetchAddresses } = useStore();

    // ── State ────────────────────────────────────────────────────────────────
    const [items, setItems] = useState<CheckoutItem[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const [address, setAddress] = useState<string>('');
    const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
    const [pdata, setPdata] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'rpay' | 'payu'>('cod');
    const [payuWebViewVisible, setPayuWebViewVisible] = useState(false);
    const [payuHtml, setPayuHtml] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [isPrescriptionFlow, setIsPrescriptionFlow] = useState(false);
    const [addressList, setAddressList] = useState<any[]>([]);
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [newAddress, setNewAddress] = useState({ pname: '', usermob: '', address: '' });
    const [patientDetails, setPatientDetails] = useState({ p_name: '', age: '', gender: 'Male' });

    // ── Load data ─────────────────────────────────────────────────────────────
    useEffect(() => {
        // Try prescription (MED) flow first
        _retrieveData('MED').then((mdata) => {
            if (mdata && mdata !== 'error' && mdata.medicine) {
                // Prescription flow
                setIsPrescriptionFlow(true);
                const mapped: CheckoutItem[] = mdata.medicine.map((m: any) => ({
                    id: String(m.id),
                    name: m.name,
                    price: Number(m.price ?? 0),
                    image: m.image || '',
                    quantity: Number(m.qty ?? 1),
                    discount: Number(m.discount ?? 0),
                    gst: Number(m.gst ?? 0),
                    status: m.status,
                }));
                setItems(mapped);
                
                // Map prescription pdata to our local state
                if (mdata.pdata) {
                    const pd = mdata.pdata;
                    setPatientDetails({
                        p_name: pd.name || pd.p_name || '',
                        age: String(pd.age || ''),
                        gender: pd.gender || 'Male'
                    });
                    setPdata(pd);
                }
                
                setPrescriptionId(mdata.pid ?? null);
                if (mdata.address?.address) setAddress(mdata.address.address);
            } else {
                // Cart flow — use Zustand store
                setIsPrescriptionFlow(false);
                const mapped: CheckoutItem[] = cart.map((c) => ({
                    id: c.id,
                    name: c.name,
                    price: parseFloat(String(c.price).replace(/[^0-9.]/g, '')) || 0,
                    image: c.image || '',
                    quantity: c.quantity,
                    discount: 0,
                    gst: 0,
                    status: 'available',
                }));
                setItems(mapped);
                
                // For cart flow, default patient info from user profile
                if (user) {
                    const initialPatient = { p_name: user.name || user.username || '', age: '', gender: 'Male' };
                    setPatientDetails(initialPatient);
                    setPdata({ ...initialPatient, address: address });
                }
            }
        });

        // Load user data
        _retrieveData('USER_DATA').then((udata) => {
            if (udata && udata !== 'error') {
                setUserData(udata);
                // Fetch addresses from store (which syncs with server)
                storeFetchAddresses();
                fetchAddresses();
                if (!isPrescriptionFlow && !patientDetails.p_name) {
                    setPatientDetails(prev => ({ ...prev, p_name: udata.name || udata.username || '' }));
                }
            } else if (user) {
                setUserData(user);
                storeFetchAddresses();
                fetchAddresses();
            }
        });

        // Address from params (passed by prescriptiondetails)
        if (params.address) {
            setAddress(String(params.address));
        }

        // Use selected address from store if available
        if (selectedAddress) {
            setAddress(selectedAddress.details);
        }
    }, []);

    // Sync pdata whenever address or patientDetails change
    useEffect(() => {
        setPdata({
            ...patientDetails,
            p_name: patientDetails.p_name, // Backend expects p_name
            address: address
        });
    }, [patientDetails, address]);

    const fetchAddresses = async () => {
        try {
            const { data: res } = await axios.get('address/get_address.php');
            if (res.status === 'success' && Array.isArray(res.data)) {
                setAddressList(res.data);
                // If no address set yet, use the first saved address
                if (!address && !selectedAddress && res.data.length > 0) {
                    setAddress(res.data[0].address);
                }
            }
        } catch (error) {
            console.log('Fetch addresses error', error);
            // Fallback to store addresses
            if (!address && addresses.length > 0) {
                setAddress(addresses[0].details);
            }
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.pname || !newAddress.usermob || !newAddress.address) {
            ToastAndroid.show('Please fill all address fields', ToastAndroid.SHORT);
            return;
        }
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('pname', newAddress.pname);
            fd.append('usermob', newAddress.usermob);
            fd.append('address', newAddress.address);

            const { data: res } = await axios.post('address/add_address.php', fd);
            if (res.status === 'success') {
                ToastAndroid.show('Address added', ToastAndroid.SHORT);
                setAddressModalVisible(false);
                setNewAddress({ pname: '', usermob: '', address: '' });
                fetchAddresses();
                setAddress(res.data.address);
            } else {
                ToastAndroid.show(res.message || 'Failed to add address', ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show('Error adding address', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    // ── Calculations ─────────────────────────────────────────────────────────
    const getItemTotal = () =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const getTotalDiscount = () =>
        items.reduce((sum, item) => {
            const disc = (item.price * (item.discount ?? 0) / 100) * item.quantity;
            return sum + disc;
        }, 0);

    const getTotalGst = () =>
        items.reduce((sum, item) => {
            const afterDisc = item.price - item.price * (item.discount ?? 0) / 100;
            return sum + afterDisc * (item.gst ?? 0) / 100 * item.quantity;
        }, 0);

    const getFinal = () => getItemTotal() - getTotalDiscount() + getTotalGst();

    // ── Quantity update ───────────────────────────────────────────────────────
    const updateQty = (id: string, delta: number) => {
        setItems(prev => prev
            .map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
            .filter(i => i.quantity > 0)
        );
    };

    // ── Place order ───────────────────────────────────────────────────────────
    const buildFormData = (paymentInfo?: any) => {
        const fd = new FormData();
        fd.append('address', address ?? '');
        fd.append('order_details', JSON.stringify(items.map(i => ({
            medID: i.id, // Backend expects medID
            qty: i.quantity,
            price: i.price,
            name: i.name,
            discount: i.discount || 0,
            gst: i.gst || 0,
            totalAmount: (i.price * i.quantity).toFixed(2)
        }))));
        
        // Ensure pdata is a JSON object with correct keys for orderdetails.php
        const finalPdata = {
            p_name: patientDetails.p_name,
            age: patientDetails.age,
            gender: patientDetails.gender,
            address: address
        };
        fd.append('pdata', JSON.stringify(finalPdata));
        
        fd.append('amount', getFinal().toFixed(2));
        fd.append('discount', getTotalDiscount().toFixed(2));
        fd.append('mobile', userData?.mobile ?? '');
        fd.append('name', userData?.name ?? userData?.username ?? '');
        fd.append('prescription_id', prescriptionId ?? '');
        fd.append('pharId', '12');
        if (paymentInfo?.razorpay_payment_id) {
            fd.append('payment_method', 'Online');
            fd.append('onlinepayid', paymentInfo.razorpay_payment_id);
            fd.append('payment_id', paymentInfo.razorpay_payment_id);
        } else if (paymentInfo?.payu_payment_id) {
            fd.append('payment_method', 'Online');
            fd.append('onlinepayid', paymentInfo.payu_payment_id);
            fd.append('payment_id', paymentInfo.payu_payment_id);
        } else {
            fd.append('payment_method', 'COD');
        }
        return fd;
    };

    const submitOrder = async (fd: FormData) => {
        try {
            const { data: res } = await axios.post('order/create_order.php', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.status === 'success' || !res.error) {
                // Clear the cart after successful order
                clearCart();
                const orderId = res.data?.order_id || res.order_id;
                router.replace({ pathname: '/orderconfirm', params: { total: getFinal().toFixed(2), order_id: orderId } });
            } else {
                showAlert({ type: 'error', title: 'Order Failed', message: res.message || 'Failed to place order.' });
            }
        } catch (error: any) {
            console.log('Order error:', error.response?.data || error.message);
            showAlert({ type: 'error', title: 'Order Failed', message: error.response?.data?.message || 'Something went wrong.' });
        }
    };

    const handleRazorpay = async () => {
        const amount = getFinal();
        if (amount <= 0) return;
        const options = {
            description: 'Order Payment',
            image: 'https://www.irhealthcareservice.com/assets/images/logo/websitelogo.png',
            currency: 'INR',
            key: 'rzp_live_gCiUxU1aEWHn6Z',
            amount: Math.round(amount * 100),
            name: 'IR Pharmacy',
            prefill: {
                email: userData?.email || '',
                contact: userData?.mobile || '',
                name: userData?.name || 'Customer',
            },
            theme: { color: Colors.primary },
        };
        try {
            const paymentData = await RazorpayCheckout.open(options);
            setLoading(true);
            await submitOrder(buildFormData(paymentData));
        } catch {
            showAlert({ type: 'error', title: 'Payment Failed', message: 'Payment was cancelled or failed.' });
        } finally {
            setLoading(false);
        }
    };

    // ── PayU Money ─────────────────────────────────────────────────────────
    const handlePayU = async () => {
        const amount = getFinal();
        if (amount <= 0) return;

        const txnid = 'IR' + Date.now();
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('txnid', txnid);
            fd.append('amount', amount.toFixed(2));
            fd.append('productinfo', 'IR Pharmacy Order');
            fd.append('firstname', userData?.name || 'Customer');
            fd.append('email', userData?.email || 'customer@irpharmacy.com');
            fd.append('phone', userData?.mobile || '');

            const { data: res } = await axios.post('order/payu_hash.php', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status !== 'success' || !res.data?.hash) {
                showAlert({ type: 'error', title: 'Payment Error', message: 'Could not initiate payment.' });
                return;
            }

            const d = res.data;
            // Build auto-submit HTML form for PayU
            const html = `
<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body onload="document.getElementById('payuForm').submit();">
<p style="text-align:center;padding:40px;font-family:sans-serif;color:#666;">Redirecting to PayU...</p>
<form id="payuForm" method="POST" action="https://secure.payu.in/_payment">
  <input type="hidden" name="key" value="${d.key}" />
  <input type="hidden" name="txnid" value="${d.txnid}" />
  <input type="hidden" name="amount" value="${d.amount}" />
  <input type="hidden" name="productinfo" value="${d.productinfo}" />
  <input type="hidden" name="firstname" value="${d.firstname}" />
  <input type="hidden" name="email" value="${d.email}" />
  <input type="hidden" name="phone" value="${d.phone}" />
  <input type="hidden" name="surl" value="${d.surl}" />
  <input type="hidden" name="furl" value="${d.furl}" />
  <input type="hidden" name="hash" value="${d.hash}" />
  <input type="hidden" name="service_provider" value="payu_paisa" />
</form>
</body></html>`;

            setPayuHtml(html);
            setPayuWebViewVisible(true);
        } catch (err: any) {
            showAlert({ type: 'error', title: 'Payment Error', message: err?.message || 'Could not start PayU payment.' });
        } finally {
            setLoading(false);
        }
    };

    const onPayUNavigation = async (navState: any) => {
        const url = navState.url || '';
        if (url.includes('payu_success')) {
            setPayuWebViewVisible(false);
            setLoading(true);
            try {
                await submitOrder(buildFormData({ payu_payment_id: 'PayU_' + Date.now() }));
            } catch { } finally { setLoading(false); }
        } else if (url.includes('payu_failure')) {
            setPayuWebViewVisible(false);
            showAlert({ type: 'error', title: 'Payment Failed', message: 'Payment was cancelled or failed.' });
        }
    };

    const handlePlaceOrder = async () => {
        if (!items.length) {
            showAlert({ type: 'warning', title: 'Empty Cart', message: 'Add at least one item before ordering.' });
            return;
        }
        if (paymentMethod === 'rpay') return handleRazorpay();
        if (paymentMethod === 'payu') return handlePayU();

        setLoading(true);
        try {
            await submitOrder(buildFormData());
        } catch (err: any) {
            ToastAndroid.show(err?.message || 'Order Failed', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    };

    // ── UI ────────────────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 15) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 180 }}>

                {/* ── Step: Delivery Address ─────────────────────────────── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepNum}>1</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <TouchableOpacity onPress={() => setAddressModalVisible(true)} style={{ marginLeft: 'auto' }}>
                            <Text style={{ color: Colors.primary, fontFamily: 'novabold' }}>Change</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setAddressModalVisible(true)} activeOpacity={0.7}>
                        <View style={styles.addressCard}>
                            <View style={styles.addressIconWrap}>
                                <Ionicons name="location" size={20} color={Colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                {selectedAddress ? (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <View style={{ backgroundColor: Colors.primary + '18', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                                                <Text style={{ fontFamily: 'novabold', fontSize: 11, color: Colors.primary }}>
                                                    {selectedAddress.label || 'Home'}
                                                </Text>
                                            </View>
                                            {selectedAddress.pname ? (
                                                <Text style={{ fontFamily: 'novaregular', fontSize: 12, color: '#999', marginLeft: 8 }}>
                                                    {selectedAddress.pname}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <Text style={styles.addressText} numberOfLines={3}>{address || selectedAddress.details}</Text>
                                    </>
                                ) : address ? (
                                    <Text style={styles.addressText} numberOfLines={3}>{address}</Text>
                                ) : (
                                    <Text style={styles.addressPlaceholder}>Tap to select delivery address</Text>
                                )}
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                    </TouchableOpacity>
                    {!address && !selectedAddress && (
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/location_selection', params: { source: 'checkout' } } as any)}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginTop: 8, backgroundColor: '#f0f9f4', borderRadius: 12 }}
                        >
                            <Ionicons name="map-outline" size={18} color={Colors.primary} />
                            <Text style={{ fontFamily: 'novabold', fontSize: 14, color: Colors.primary, marginLeft: 8 }}>Pick from Map</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Step: Patient Details ─────────────────────────────── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepNum}>2</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Patient Information</Text>
                    </View>
                    
                    <View style={styles.patientCard}>
                        <Text style={styles.inputLabel}>Patient Name</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={18} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.patientInput}
                                placeholder="Enter full name"
                                placeholderTextColor="#999"
                                value={patientDetails.p_name}
                                onChangeText={(text) => setPatientDetails({ ...patientDetails, p_name: text })}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 12 }}>
                                <Text style={styles.inputLabel}>Age</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="calendar-outline" size={18} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.patientInput}
                                        placeholder="Yrs"
                                        placeholderTextColor="#999"
                                        keyboardType="number-pad"
                                        value={patientDetails.age}
                                        onChangeText={(text) => setPatientDetails({ ...patientDetails, age: text })}
                                    />
                                </View>
                            </View>

                            <View style={{ flex: 1.5 }}>
                                <Text style={styles.inputLabel}>Gender</Text>
                                <View style={styles.genderContainer}>
                                    {['Male', 'Female'].map((g) => (
                                        <TouchableOpacity
                                            key={g}
                                            activeOpacity={0.7}
                                            onPress={() => setPatientDetails({ ...patientDetails, gender: g })}
                                            style={[styles.genderBtn, patientDetails.gender === g && styles.genderBtnActive]}
                                        >
                                            <Ionicons 
                                                name={g === 'Male' ? 'male' : 'female'} 
                                                size={16} 
                                                color={patientDetails.gender === g ? '#fff' : '#666'} 
                                                style={{ marginRight: 6 }} 
                                            />
                                            <Text style={[styles.genderText, patientDetails.gender === g && styles.genderTextActive]}>{g}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ── Step: Order Items ──────────────────────────────────── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepNum}>3</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Order Items ({items.length})</Text>
                    </View>

                    {items.map((item) => {
                        const discAmt = item.price * (item.discount ?? 0) / 100;
                        const afterDisc = item.price - discAmt;
                        const gstAmt = afterDisc * (item.gst ?? 0) / 100;
                        const lineTotal = (afterDisc + gstAmt) * item.quantity;
                        const isAvail = !isPrescriptionFlow || item.status === 'available';

                        return (
                            <View key={item.id} style={[styles.itemCard, !isAvail && styles.itemCardUnavail]}>
                                <View style={styles.itemImageWrap}>
                                    <Image
                                        source={item.image ? { uri: item.image } : require('../assets/images/noprevew.png')}
                                        style={styles.itemImage}
                                        resizeMode="contain"
                                    />
                                    {!isAvail && (
                                        <View style={styles.unavailBadge}>
                                            <Text style={styles.unavailText}>N/A</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.itemBody}>
                                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>

                                    {isAvail ? (
                                        <>
                                            <View style={styles.priceRow}>
                                                <Text style={styles.itemPrice}>₹{lineTotal.toFixed(2)}</Text>
                                                {(item.discount ?? 0) > 0 && (
                                                    <View style={styles.discBadge}>
                                                        <Text style={styles.discText}>{item.discount}% OFF</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.itemUnit}>
                                                ₹{item.price.toFixed(2)} per unit
                                                {(item.gst ?? 0) > 0 ? `  •  GST ${item.gst}%` : ''}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={styles.unavailLabel}>Not Available</Text>
                                    )}

                                    {/* Qty stepper */}
                                    <View style={styles.qtyRow}>
                                        <TouchableOpacity
                                            style={[styles.qtyBtn, !isAvail && { opacity: 0.4 }]}
                                            onPress={() => isAvail && updateQty(item.id, -1)}
                                            disabled={!isAvail}
                                        >
                                            <Ionicons name="remove" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                        <Text style={styles.qtyText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={[styles.qtyBtn, !isAvail && { opacity: 0.4 }]}
                                            onPress={() => isAvail && updateQty(item.id, 1)}
                                            disabled={!isAvail}
                                        >
                                            <Ionicons name="add" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* ── Step: Bill Summary ─────────────────────────────────── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepNum}>4</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Bill Summary</Text>
                    </View>
                    <View style={styles.billCard}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>₹{getItemTotal().toFixed(2)}</Text>
                        </View>
                        {getTotalDiscount() > 0 && (
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Discount</Text>
                                <Text style={[styles.billValue, { color: '#2E7D32' }]}>- ₹{getTotalDiscount().toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery Fee</Text>
                            <View style={styles.freePill}>
                                <Text style={styles.freeText}>FREE</Text>
                            </View>
                        </View>
                        {getTotalGst() > 0 && (
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>GST</Text>
                                <Text style={styles.billValue}>₹{getTotalGst().toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={styles.divider} />
                        <View style={styles.billRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>₹{getFinal().toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Step: Payment Method ──────────────────────────────── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepNum}>5</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>

                    {[
                        { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: 'cash-outline' as const },
                        { id: 'payu', label: 'PayU Money', sub: 'UPI, Cards, Net Banking via PayU', icon: 'wallet-outline' as const },
                        { id: 'rpay', label: 'Razorpay', sub: 'Secure payment via Razorpay', icon: 'card-outline' as const },
                    ].map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[styles.paymentCard, paymentMethod === method.id && styles.paymentCardActive]}
                            onPress={() => setPaymentMethod(method.id as 'cod' | 'rpay' | 'payu')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.paymentIconWrap, paymentMethod === method.id && { backgroundColor: Colors.primary + '22' }]}>
                                <Ionicons name={method.icon} size={22} color={paymentMethod === method.id ? Colors.primary : '#999'} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.paymentLabel, paymentMethod === method.id && { color: Colors.primary }]}>
                                    {method.label}
                                </Text>
                                <Text style={styles.paymentSub}>{method.sub}</Text>
                            </View>
                            <View style={[styles.radioOuter, paymentMethod === method.id && { borderColor: Colors.primary }]}>
                                {paymentMethod === method.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Safe delivery notice */}
                <View style={styles.safeRow}>
                    <MaterialCommunityIcons name="shield-check" size={18} color="#2E7D32" />
                    <Text style={styles.safeText}>100% Secure & Genuine Medicines</Text>
                </View>

            </ScrollView>

            {/* Address Selection & Addition Modal */}
            <Modal
                visible={addressModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setAddressModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Address</Text>
                            <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 16 }}>
                            {addressList.length > 0 && (
                                <>
                                    <Text style={styles.subTitle}>Saved Addresses</Text>
                                    {addressList.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.addressItem, address === item.address && styles.addressItemActive]}
                                            onPress={() => {
                                                setAddress(item.address);
                                                setAddressModalVisible(false);
                                            }}
                                        >
                                            <Ionicons
                                                name={address === item.address ? "radio-button-on" : "radio-button-off"}
                                                size={20}
                                                color={address === item.address ? Colors.primary : "#999"}
                                            />
                                            <View style={{ marginLeft: 12, flex: 1 }}>
                                                <Text style={styles.addressNameText}>{item.pname}</Text>
                                                <Text style={styles.addressDetailText}>{item.address}</Text>
                                                <Text style={styles.addressPhoneText}>{item.usermob}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    <View style={styles.divider} />
                                </>
                            )}

                            <Text style={styles.subTitle}>Add New Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Recipient Name"
                                value={newAddress.pname}
                                onChangeText={(text) => setNewAddress({ ...newAddress, pname: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                                value={newAddress.usermob}
                                onChangeText={(text) => setNewAddress({ ...newAddress, usermob: text })}
                            />
                            <TextInput
                                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                placeholder="Complete Address"
                                multiline
                                value={newAddress.address}
                                onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
                            />
                            <TouchableOpacity
                                style={styles.saveAddressBtn}
                                onPress={handleAddAddress}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveAddressText}>Save and Use Address</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* PayU WebView Modal */}
            <Modal
                visible={payuWebViewVisible}
                animationType="slide"
                onRequestClose={() => setPayuWebViewVisible(false)}
            >
                <View style={{ flex: 1, paddingTop: insets.top }}>
                    <View style={styles.payuHeader}>
                        <TouchableOpacity onPress={() => setPayuWebViewVisible(false)} style={styles.backBtn}>
                            <Ionicons name="close" size={22} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>PayU Payment</Text>
                        <View style={{ width: 36 }} />
                    </View>
                    {payuHtml ? (
                        <WebView
                            source={{ html: payuHtml }}
                            onNavigationStateChange={onPayUNavigation}
                            javaScriptEnabled
                            domStorageEnabled
                            startInLoadingState
                            renderLoading={() => (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                    <Text style={{ marginTop: 12, fontFamily: 'novaregular', color: '#666' }}>Loading payment page...</Text>
                                </View>
                            )}
                        />
                    ) : null}
                </View>
            </Modal>

            {/* ── Bottom CTA ─────────────────────────────────────────────── */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <View style={styles.footerTop}>
                    <Text style={styles.footerLabel}>Total Payable</Text>
                    <Text style={styles.footerAmount}>₹{getFinal().toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    disabled={loading || items.length === 0}
                    activeOpacity={0.88}
                    style={{ borderRadius: 16, overflow: 'hidden' }}
                >
                    <LinearGradient
                        colors={items.length === 0 ? ['#ccc', '#bbb'] : [Colors.primary, '#5DA34A']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.ctaBtn}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Text style={styles.ctaText}>
                                    {paymentMethod === 'rpay' ? 'Pay Now' : 'Place Order'}
                                </Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 14,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    backBtn: {
        width: 36, height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'novabold',
        fontSize: 18,
        color: '#1A1A2E',
    },

    scroll: { flex: 1 },

    // Section
    section: { marginTop: 16, marginHorizontal: 16 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepBadge: {
        width: 26, height: 26,
        borderRadius: 13,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    stepNum: { fontFamily: 'novabold', fontSize: 13, color: '#fff' },
    sectionTitle: { fontFamily: 'novabold', fontSize: 16, color: '#1A1A2E' },

    // Address
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'flex-start',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    addressIconWrap: {
        width: 36, height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary + '18',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addressText: { fontFamily: 'novaregular', fontSize: 14, color: '#444', lineHeight: 22 },
    addressPlaceholder: { fontFamily: 'novaregular', fontSize: 14, color: '#bbb' },

    // Item card
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    itemCardUnavail: { opacity: 0.6 },
    itemImageWrap: {
        width: 70, height: 70,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        position: 'relative',
    },
    itemImage: { width: 56, height: 56 },
    unavailBadge: {
        position: 'absolute', top: 0, right: 0,
        backgroundColor: '#E53935',
        borderRadius: 6,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    unavailText: { fontFamily: 'novabold', fontSize: 9, color: '#fff' },
    itemBody: { flex: 1 },
    itemName: { fontFamily: 'novabold', fontSize: 14, color: '#1A1A2E', marginBottom: 4 },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
    itemPrice: { fontFamily: 'novabold', fontSize: 15, color: Colors.primary },
    discBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 6, paddingVertical: 2,
        borderRadius: 6, marginLeft: 8,
    },
    discText: { fontFamily: 'novabold', fontSize: 10, color: '#2E7D32' },
    itemUnit: { fontFamily: 'novaregular', fontSize: 11, color: '#999', marginBottom: 8 },
    unavailLabel: { fontFamily: 'novabold', fontSize: 13, color: '#E53935', marginBottom: 8 },

    // Qty stepper
    qtyRow: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: {
        width: 28, height: 28,
        borderRadius: 14,
        backgroundColor: '#F0F7F0',
        borderWidth: 1,
        borderColor: Colors.primary + '55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        fontFamily: 'novabold', fontSize: 15,
        color: '#1A1A2E',
        paddingHorizontal: 12, minWidth: 32, textAlign: 'center',
    },

    // Bill
    billCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    billLabel: { fontFamily: 'novaregular', fontSize: 14, color: '#666' },
    billValue: { fontFamily: 'novabold', fontSize: 14, color: '#333' },
    freePill: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10, paddingVertical: 3,
        borderRadius: 10,
    },
    freeText: { fontFamily: 'novabold', fontSize: 11, color: '#2E7D32', letterSpacing: 0.5 },
    divider: { borderTopWidth: 1, borderTopColor: '#F0F0F0', marginBottom: 12 },
    totalLabel: { fontFamily: 'novabold', fontSize: 17, color: '#1A1A2E' },
    totalValue: { fontFamily: 'novabold', fontSize: 20, color: Colors.primary },

    // Payment
    paymentCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#EFEFEF',
        elevation: 1,
    },
    paymentCardActive: {
        borderColor: Colors.primary,
        backgroundColor: '#F6FFF8',
    },
    paymentIconWrap: {
        width: 42, height: 42,
        borderRadius: 21,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentLabel: { fontFamily: 'novabold', fontSize: 14, color: '#333', marginBottom: 2 },
    paymentSub: { fontFamily: 'novaregular', fontSize: 12, color: '#999' },
    radioOuter: {
        width: 20, height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10, height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
    },

    // Safe
    safeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    safeText: { fontFamily: 'novaregular', fontSize: 13, color: '#555', marginLeft: 6 },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 14,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
    },
    footerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    footerLabel: { fontFamily: 'novaregular', fontSize: 14, color: '#888' },
    footerAmount: { fontFamily: 'novabold', fontSize: 22, color: '#1A1A2E' },
    ctaBtn: {
        height: 52,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaText: { fontFamily: 'novabold', fontSize: 17, color: '#fff' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontFamily: 'novabold',
        fontSize: 18,
        color: '#1A1A2E',
    },
    subTitle: {
        fontFamily: 'novabold',
        fontSize: 14,
        color: '#666',
        marginTop: 16,
        marginBottom: 12,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        marginBottom: 12,
    },
    addressItemActive: {
        borderColor: Colors.primary,
        backgroundColor: '#F6FFF8',
    },
    addressNameText: {
        fontFamily: 'novabold',
        fontSize: 15,
        color: '#333',
    },
    addressDetailText: {
        fontFamily: 'novaregular',
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    addressPhoneText: {
        fontFamily: 'novaregular',
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 12,
        padding: 14,
        fontFamily: 'novaregular',
        fontSize: 14,
        color: '#333',
        marginBottom: 12,
    },
    saveAddressBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 32,
    },
    saveAddressText: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#fff',
    },
    inputLabel: {
        fontFamily: 'novabold',
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 6,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    inputIcon: {
        marginRight: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    patientCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    patientInput: {
        flex: 1,
        paddingVertical: 12,
        fontFamily: 'novaregular',
        fontSize: 15,
        color: '#1C1C1E',
    },
    genderContainer: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    genderBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    genderBtnActive: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    genderText: {
        fontFamily: 'novaregular',
        fontSize: 14,
        color: '#666',
    },
    genderTextActive: {
        color: '#fff',
        fontFamily: 'novabold',
    },
    payuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
});
