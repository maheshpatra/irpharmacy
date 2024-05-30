import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import HeaderAB from '../components/HeaderAB';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/Colors';
import { _retrieveData, _storeData } from "../local_storage";
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { path } from '../components/server';
import moment from 'moment';


const AccoutSettings = () => {

    const [name, setName] = useState('');
    const [dob, setDob] = useState(new Date());
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [pass, setPass] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [verification, setVerification] = useState(true)
    const [loading, setLoading] = useState(false);
    const handleSaveProfile = () => {
        // Implement save profile functionality here
        // For example: dispatch action to save profile details
        console.log('Save Profile pressed');
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios');
        setDob(currentDate);
    };

    const retrivedata = () => {
        _retrieveData("USER_DATA").then((userdata) => {
            // console.log(user_mobile);
            if (userdata !== 'error') {
                // console.log(userdata)
                setMobileNumber(userdata.mobile)
                setEmail(userdata.email)
                setName(userdata.username)

                setGender(userdata.gender)
                setPass(userdata.password)
                setAddress(userdata.address)



                if (userdata?.dob) {
                    //     console.log(userdata?.dob);
                    //     setDob(new Date(userdata?.dob))
                    //    const date

                }

                // console.log(userdata.dob);



            } else {
                setVerification(true);
            }

        });
    }

    useEffect(() => {
        retrivedata()
    }, [])


    const updateProfile = async () => {
        setLoading(true)
        let bodyContent = new FormData();
        bodyContent.append("case", "updateprofile");
        bodyContent.append("name", name);
        bodyContent.append("mobile", mobileNumber);
        bodyContent.append("email", email);
        bodyContent.append("password", pass);
        bodyContent.append("address", address);
        bodyContent.append("gender", gender);
        bodyContent.append("dob", moment(dob).format("DD-MM-YYYY"));
        console.log(dob)
        try {
            const req = await fetch(path + "updateprofile.php", {
                body: bodyContent,
                method: 'post'
            })
            const res = await req.json();
            setLoading(false)
            console.log(res)
            if (res.code == "sucess") {
                var data = new Object({ username: res.data.name, email: res.data.email, userid: res.data.id, profile: res.data.image, mobile: res.data.mobile, address: res.data.address, password: res.data.password, dob: res.data.dob, gender: res.data.gender })
                _storeData("USER_DATA", data)
                retrivedata()
            }

        } catch (err) {
            console.log(JSON.stringify(err, null, 2));
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fdfdfd' }}>
            <HeaderAB
                title={'Account Settings'} />
            <ScrollView style={styles.container}>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                {/* <TouchableOpacity style={styles.input} onPress={showDatepicker}>
                    <Text>Date of Birth: {moment(dob).format("DD-MM-YYYY")}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode="date"
                        display="default"

                        onChange={onChangeDate}
                    />
                )} */}

                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    editable={false}
                    onChangeText={(text) => setMobileNumber(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    multiline
                    numberOfLines={3}
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={pass}
                    onChangeText={(text) => setPass(text)}
                />
                <View style={styles.pickerContainer}>

                    <RNPickerSelect
                        value={gender}
                        placeholder={{ label: 'Select Gender', value: null }}
                        onValueChange={(value) => setGender(value)}
                        items={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Other', value: 'other' },
                        ]}
                        style={pickerSelectStyles}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
                    {loading ? <ActivityIndicator size={'small'} color={'#fff'} /> : <Text style={styles.saveButtonText}>Update Profile</Text>}

                </TouchableOpacity>
            </ScrollView>
        </View>

    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#000',
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#fdfdfd',

    },
});

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 20


    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        justifyContent: 'center',
        backgroundColor: '#fdfdfd'
    },
    pickerContainer: {
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8, padding: 2
    },
    pickerLabel: {
        marginBottom: 5,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: Colors.backgroundcolor,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AccoutSettings;
