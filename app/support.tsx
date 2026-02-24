import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image, StatusBar } from 'react-native';
import HeaderAB from '../components/HeaderAB';
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function Support() {
    const handleCall = () => {
        Linking.openURL('tel:9800424058');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:official@irhealthcareservice.com');
    };

    const handleWhatsApp = () => {
        Linking.openURL('https://wa.me/+919800424058');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <HeaderAB title={'Help & Support'} notification={false} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.headerSection}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.title}>How can we help you?</Text>
                    <Text style={styles.subtitle}>Our team is available to assist you with any questions or issues.</Text>
                </View>

                <View style={styles.contactCard}>
                    <Text style={styles.cardTitle}>Contact Us</Text>

                    <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="call" size={24} color="#1E88E5" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Phone Support</Text>
                            <Text style={styles.contactValue}>+91 9800424058</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.contactItem} onPress={handleWhatsApp}>
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="logo-whatsapp" size={24} color="#43A047" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>WhatsApp</Text>
                            <Text style={styles.contactValue}>Chat with us</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="mail" size={24} color="#FB8C00" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Email Support</Text>
                            <Text style={styles.contactValue}>official@irhealthcareservice.com</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                <View style={styles.addressCard}>
                    <Text style={styles.cardTitle}>Visit Us</Text>
                    <View style={styles.addressItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="location" size={24} color="#8E24AA" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Corporate Office</Text>
                            <Text style={styles.contactValue}>Bhagwanpur, Purba Medinipur, West Bengal - 721601</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Operating Hours</Text>
                    <Text style={styles.infoText}>Monday - Saturday: 9:00 AM - 8:00 PM</Text>
                    <Text style={styles.infoText}>Sunday: Closed</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 15,
    },
    title: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2.5),
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'novaregular',
        fontSize: responsiveFontSize(1.8),
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    contactCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardTitle: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2),
        color: '#333',
        marginBottom: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontFamily: 'novabold',
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    contactValue: {
        fontFamily: 'novaregular',
        fontSize: 13,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 15,
        marginLeft: 60,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    infoText: {
        fontFamily: 'novaregular',
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    }
});
