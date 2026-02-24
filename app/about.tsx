import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image } from 'react-native';
import HeaderAB from '../components/HeaderAB';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';

export default function About() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <HeaderAB title={'About Us'} notification={false} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.logoContainer}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Company Information</Text>
                    <Text style={styles.text}>
                        IR Pharmacy is a new and dynamic entrant in the pharmaceutical and healthcare sector, dedicated to bringing high-quality products and services to our customers. Though we are at the beginning of our journey, our vision is to become a trusted name in the industry, building on the foundation of innovation, excellence, and customer satisfaction.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>What We Offer</Text>
                    <Text style={styles.text}>At IR Pharmacy, we offer a wide range of products, including:</Text>
                    <View style={styles.bulletList}>
                        <BulletItem text="Pharmaceuticals: Essential medications and prescriptions." />
                        <BulletItem text="Medical Devices: Advanced medical equipment and tools." />
                        <BulletItem text="Personal Care: Products for everyday health and wellness." />
                        <BulletItem text="Baby Care: Trusted products for the well-being of your little ones." />
                        <BulletItem text="Health Food and Drinks: Nutritional supplements and health beverages." />
                        <BulletItem text="Sexual Wellness: Discreet and reliable products for sexual health." />
                        <BulletItem text="Ayurvedic, Herbal, and Natural Products: Holistic and natural remedies for various health needs." />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>How We Are Different</Text>
                    <Text style={styles.text}>Our integrated expertise in pharmaceutical & technology:</Text>
                    <View style={styles.bulletList}>
                        <BulletItem text="Strong Delivery System: Fast and reliable delivery to ensure you get what you need when you need it." />
                        <BulletItem text="Rigorous Focus on Regulatory Policies: Adherence to all relevant regulations to ensure the safety and efficacy of our products." />
                        <BulletItem text="Customer-Focused Approach: A commitment to providing the best possible experience for our customers." />
                        <BulletItem text="One-Stop Shop: A comprehensive range of products to meet daily and emergency needs." />
                        <BulletItem text="Privacy and Security: Ensuring the confidentiality and security of our customers' information." />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.copyright}>Copyright © 2026 IR Pharmacy.</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const BulletItem = ({ text }: { text: string }) => (
    <View style={styles.bulletItem}>
        <View style={styles.bulletDot} />
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    card: {
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
    sectionTitle: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2),
        color: Colors.primary,
        marginBottom: 10,
    },
    text: {
        fontFamily: 'novaregular',
        fontSize: responsiveFontSize(1.8),
        color: '#444',
        lineHeight: 24,
        marginBottom: 10,
    },
    bulletList: {
        marginTop: 5,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginTop: 8,
        marginRight: 10,
    },
    bulletText: {
        flex: 1,
        fontFamily: 'novaregular',
        fontSize: responsiveFontSize(1.7),
        color: '#555',
        lineHeight: 22,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    copyright: {
        fontFamily: 'novaregular',
        fontSize: 12,
        color: '#888',
    }
});
