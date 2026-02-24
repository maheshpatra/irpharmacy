import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Linking } from 'react-native';
import HeaderAB from '../components/HeaderAB';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';

export default function Terms() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <HeaderAB title={'Terms & Policies'} notification={false} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.lastUpdated}>Last updated: April 12, 2025</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy Policy</Text>
                    <Text style={styles.text}>
                        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                    </Text>
                    <Text style={styles.text}>
                        We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Collecting and Using Your Personal Data</Text>

                    <Text style={styles.subHeader}>Personal Data</Text>
                    <Text style={styles.text}>
                        While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                    </Text>
                    <View style={styles.list}>
                        <ListItem text="Email address" />
                        <ListItem text="First name and last name" />
                        <ListItem text="Phone number" />
                        <ListItem text="Address, State, Province, ZIP/Postal code, City" />
                        <ListItem text="Usage Data" />
                    </View>

                    <Text style={styles.subHeader}>Information Collected while Using the Application</Text>
                    <Text style={styles.text}>
                        While using Our Application, to provide features of Our Application, We may collect, with Your prior permission:
                    </Text>
                    <View style={styles.list}>
                        <ListItem text="Information regarding your location" />
                        <ListItem text="Pictures and other information from your Device's camera and photo library" />
                    </View>
                    <Text style={styles.text}>
                        We use this information to provide features of Our Service, to improve and customize Our Service. You can enable or disable access to this information at any time, through Your Device settings.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.text}>
                        If you have any questions about this Privacy Policy, You can contact us:
                    </Text>
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:official@irhealthcareservice.com')}>
                        <Text style={styles.link}>By email: official@irhealthcareservice.com</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('tel:9800424058')}>
                        <Text style={styles.link}>By phone: +91 9800424058</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const ListItem = ({ text }: { text: string }) => (
    <View style={styles.listItem}>
        <View style={styles.bullet} />
        <Text style={styles.itemText}>{text}</Text>
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
    lastUpdated: {
        fontFamily: 'novaregular',
        fontSize: 12,
        color: '#888',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    section: {
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
        color: '#333',
        marginBottom: 15,
    },
    subHeader: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
        marginTop: 10,
    },
    text: {
        fontFamily: 'novaregular',
        fontSize: responsiveFontSize(1.7),
        color: '#555',
        lineHeight: 22,
        marginBottom: 10,
    },
    list: {
        marginBottom: 10,
        paddingLeft: 5,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.primary,
        marginRight: 10,
    },
    itemText: {
        fontFamily: 'novaregular',
        fontSize: 14,
        color: '#555',
    },
    link: {
        fontFamily: 'novamedium',
        fontSize: 14,
        color: Colors.primary,
        marginBottom: 5,
    }
});
