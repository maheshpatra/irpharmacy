import React, { useState } from 'react'
import Modal from 'react-native-modal';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { _removeData } from '../../local_storage'
import Colors from '../../constants/Colors';
import { router } from 'expo-router';
const Sidebar = ({ setshow, show, }) => {
    const data =
        [
            {
                name: 'Profile',
                icon: 'Feather',
                iconname: 'user',
                navigate: '/accountsettings'
            },
            {
                name: 'Referral',
                icon: 'AntDesign',
                iconname: 'sharealt',
                navigate: '/referrals'
            }, {
                name: 'Wallet',
                icon: 'AntDesign',
                iconname: 'wallet',
                navigate: '/wallet'
            }, {
                name: 'Settings',
                icon: 'AntDesign',
                iconname: 'setting',
                navigate: '/settings'
            }, {
                name: 'Help',
                icon: 'AntDesign',
                iconname: 'message1',
                navigate: '/help'
            }
        ]



    return (
        <Modal

            isVisible={show}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            backdropOpacity={0}

            style={{ margin: 0, marginTop: 59, flexDirection: 'row', flex: 1 }}

            onBackButtonPress={() => setshow(false)}

        >
            <View style={{ width: '100%', height: '100%', flexDirection: 'row', }}>
                <View style={{
                    width: '70%', backgroundColor: '#fff', paddingTop: 10,
                }}>
                    <Image source={require('../../assets/images/logo.png')} style={{ height: 80, width: 80, alignSelf: 'center', marginBottom: 20 }} />
                    {/* custom side dwawer */}
                    {data.map((item) =>

                        <TouchableOpacity onPress={() => {
                            setshow(false)
                            router.push(item.navigate)
                        }} style={{ flexDirection: 'row', alignItems: 'center', height: 50, width: '90%', alignSelf: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
                            {item.icon == "Feather" && <Feather name={item.iconname} color={Colors.backgroundcolor} size={20} />}
                            {item.icon == "Ionicons" && <Ionicons name={item.iconname} color={Colors.backgroundcolor} size={20} />}
                            {item.icon == "AntDesign" && <AntDesign name={item.iconname} color={Colors.backgroundcolor} size={20} />}
                            <Text style={{ fontWeight: 'bold', marginLeft: 10, fontFamily: 'Nunito-Medium', color: '#555', fontSize: 16 }}>{item.name}</Text>
                        </TouchableOpacity>

                    )}

                    <TouchableOpacity
                        onPress={() => {
                            _removeData('USER_DATA')
                                .then(v => {

                                    if (v === "removed") {
                                        console.log(v)
                                        router.push('/')
                                    }
                                })
                                .catch(err => alert('Failed To Logout'));
                            
                            }}

                        style={{ flexDirection: 'row', alignItems: 'center', height: 50, width: '90%', alignSelf: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
                        <Feather name="log-out" color={Colors.backgroundcolor} size={24} />
                        <Text style={{ fontWeight: '800', marginLeft: 10, fontFamily: 'Nunito-Medium', color: '#555', fontSize: 16 }}>Logout</Text>
                    </TouchableOpacity>







                </View>

                <TouchableOpacity onPress={() => {
                    setshow(false)

                }} style={{ width: '200%', backgroundColor: '#000', opacity: .5 }}>

                </TouchableOpacity>


            </View>

        </Modal>
    )
}

export default Sidebar