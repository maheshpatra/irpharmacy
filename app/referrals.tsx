import React, { useEffect } from 'react';
import { View,FlatList, StyleSheet, Share, Text, Dimensions, Image, ScrollView, Pressable, ToastAndroid, TouchableOpacity } from 'react-native'

import { Divider } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';

import PagerView from "react-native-pager-view";
import {
    Entypo,
    FontAwesome,
    MaterialIcons,
    Feather
} from '@expo/vector-icons';
import HeaderAB from '../components/HeaderAB';
import Colors from '../constants/Colors';
import { _retrieveData } from '../local_storage';
import { path } from '../components/server';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ts = Dimensions.get('window').width / 100;


const dsh = (Dimensions.get('window').height / 100);
const dsw = (Dimensions.get('window').width / 100);
//const ts = Dimensions.get('window').width / 100;
//fontSize
const fontu = Dimensions.get('window').width / 100;
const fonts = Dimensions.get('window').height / 100;






export default function Refer({ navigation }) {

    const [code, setCode] = React.useState('');
    const [selectedTab, setSelctedTab] = React.useState(0);
    const [refer, setRefer] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const pagerRef = React.useRef(null);
    async function share() {
        await Share.share({
            message: `Download the Quizing app, use this code "${code}" and get ₹50 welcome bonus. https://play.google.com/store/apps/details?id=com.irpharmacy`
        })
    }

    const getreferhistory = async (mob) =>{
        setLoading(true)
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }

        let bodyContent = new FormData();
        bodyContent.append("case", "refer_history");
        bodyContent.append("mobile", mob);

        let response = await fetch(path + "wallet.php", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });
        setLoading(false)
        let data = await response.json();
        console.log(data);
        if (data.success) {
           setRefer(data.data)
        }else{
            alert('no transaction found');
        }

    }

    const copyToClipboard = (code) => {
        Clipboard.setString(code);
        ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
    };
   

    useEffect(()=>{
       _retrieveData('ReferCode').then((rcode) => {
        if (rcode !== 'error') {
            setCode(rcode.refer_code)
        }})
        _retrieveData("USER_DATA").then((userdata) => {
            if (userdata !== 'error') {
                getreferhistory(userdata.mobile)
            }})
    },[])

    

    

    return (
        <View style={styles.container}>
            <HeaderAB title={'Invite & Earn'} />
            <Divider style={{ backgroundColor: '#E5E5E5', }} />
            <View style={{ width: '80%', height: 45, backgroundColor: '#d6d6ff', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 10, alignSelf: 'center', borderRadius: 15 }}>
                <TouchableOpacity onPress={() => {
                    pagerRef?.current?.setPage(0);
                    setSelctedTab(0);
                }} style={{ justifyContent: 'center', alignItems: 'center', width: '50%', backgroundColor: selectedTab === 0 ? Colors.backgroundcolor : '#d6d6ff', height: 45, borderRadius: 15 }}>
                    <Text style={{ color: selectedTab === 0 ? '#fff' : '#000', fontWeight: selectedTab === 0 ? 'bold' : 'normal', fontSize: 16 }} >Referral
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    pagerRef?.current?.setPage(1);
                    setSelctedTab(1);
                }} style={{ justifyContent: 'center', alignItems: 'center', width: '50%', backgroundColor: selectedTab === 1 ? Colors.backgroundcolor : '#d6d6ff', height: 45, borderRadius: 15 }}>
                    <Text style={{ color: selectedTab === 1 ? '#fff' : '#000', fontWeight: selectedTab === 1 ? 'bold' : 'normal', fontSize: 16 }} >History</Text>
                </TouchableOpacity>

            </View>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(event) => {
                    setSelctedTab(event?.nativeEvent?.position);
                }}
            >
                <View key="1" style={{ flex: 1 }}><ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#fff' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: ts * 80, width: '100%' }}>
                        <Image
                            resizeMode='contain'
                            style={{ width: '70%', height: ts * 75, marginTop: ts * 2, marginLeft: ts * 2, backgroundColor: '#fff' }}
                            source={require('../assets/images/refer.jpg')}
                        />
                    </View>


                    <View style={{ backgroundColor: '#fff' }}>
                        <Text style={{ fontFamily: 'roboto_light', fontWeight: 'bold', fontSize: ts * 5, width: '60%', alignSelf: 'center', textAlign: 'center' }}>Sharing the app</Text>
                        <Text style={{ fontFamily: 'poppins_medium', fontFamily: 'poppins_medium', fontSize: ts * 3.5, width: '80%', alignSelf: 'center', textAlign: 'center', color: '#555', marginTop: ts * 2.5, }}>1 share: + 25 points for each.</Text>
                        <Text style={{ fontFamily: 'poppins_medium', fontFamily: 'poppins_medium', fontSize: ts * 3.5, width: '80%', alignSelf: 'center', textAlign: 'center', color: '#555', marginTop: ts * 2.5, }}>2 shares: + 50 points for each. </Text>
                        <Text style={{ fontFamily: 'poppins_medium', fontFamily: 'poppins_medium', fontSize: ts * 3.5, width: '80%', alignSelf: 'center', textAlign: 'center', color: '#555', marginTop: ts * 2.5, }}>3 shares: + 75 points for each. </Text>
                        <Text style={{ fontFamily: 'poppins_medium', fontFamily: 'poppins_medium', fontSize: ts * 3.5, width: '80%', alignSelf: 'center', textAlign: 'center', color: '#555', marginTop: ts * 2.5, }}>More than 3 Shares : + 100 for each. </Text>
    



                    </View>
                    <Pressable style={{ backgroundColor: Colors.bglight, borderColor: Colors.backgroundcolor, borderWidth: 1, width: '80%', height: ts * 15, alignItems: 'center', justifyContent: 'center', marginTop: ts * 2, marginLeft: ts * 10, marginRight: ts * 10, alignSelf: 'center', borderRadius: ts * 3, flexDirection: 'row', justifyContent: 'center' }} onPress={() => { }}>
                        <Text style={{ alignSelf: 'center', fontFamily: 'poppins_medium', fontFamily: 'poppins_medium', fontSize: ts * 4.5, width: '60%', alignSelf: 'center', textAlign: 'center', color: Colors.backgroundcolor }}>{code}</Text>
                        <View style={{
                            position: 'absolute'
                            , right: ts * 2,
                            borderLeftWidth: 2
                            , borderLeftColor: Colors.backgroundcolor, paddingLeft: ts * 2
                        }}>
                            <Feather style={{
                                alignSelf: 'center',
                            }}
                                name="copy"
                                size={22}
                                color="#fff"
                                onPress={() => copyToClipboard(code)}
                            />
                        </View>

                    </Pressable>

                    <Pressable
                        style={{
                            backgroundColor: Colors.backgroundcolor,
                            width: '75%',
                            height: ts * 13,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: ts * 5,
                            marginLeft: ts * 10,
                            marginRight: ts * 10,
                            alignSelf: 'center',
                            borderRadius: ts * 3,
                            flexDirection: 'row'
                        }}
                        onPress={share}
                    >
                        <Text style={{ fontFamily: 'poppins_medium', fontFamily: 'poppins_medium', fontSize: ts * 5, width: '60%', alignSelf: 'center', textAlign: 'center', color: '#fff' }}>
                            Invite Now
                        </Text>
                    </Pressable>

                    <View style={{ backgroundColor: 'white', marginTop: ts * 3 }}>
                        <Text style={{
                            marginLeft: fonts * 2,
                            paddingTop: fonts,
                            fontSize: fontu * 4.5,
                            fontFamily: 'novaBold'
                        }}>Refer And Earn !</Text>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: dsw * 6,
                            alignItems: 'center',
                            marginBottom: dsw * 2
                        }}>
                            <View style={{
                                backgroundColor: Colors.bglight,
                                height: dsw * 13,
                                width: dsw * 13,
                                borderRadius: dsw * 10,
                                marginLeft: fonts * 2,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FontAwesome style={{
                                    alignSelf: 'center',
                                }}
                                    name="share-alt" size={ts * 6} color="#bcb3c9" />
                            </View>
                            <View style={{ width: '68%', marginLeft: fonts * 1.5 }}>
                                <Text style={{ fontSize: fontu * 3.6, color: '#4f4f4f', fontFamily: 'poppins_medium' }}>Invite your friend to install the app with the link.</Text>


                            </View>
                        </View>
                        <View style={{ width: 2, height: dsh * 4, backgroundColor: '#ccc', marginLeft: '10%' }} />
                        <View style={{
                            flexDirection: 'row',
                            marginTop: dsw * 2,
                            alignItems: 'center',
                            marginBottom: dsw * 2
                        }}>
                            <View style={{
                                backgroundColor: Colors.bglight,
                                height: dsw * 13,
                                width: dsw * 13,
                                borderRadius: dsw * 10,
                                marginLeft: fonts * 2,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Entypo style={{
                                    alignSelf: 'center',
                                }}
                                    name="lab-flask" size={ts * 6} color="#bcb3c9" />
                            </View>
                            <View style={{ width: '68%', marginLeft: fonts * 1.5 }}>

                                <Text style={{ fontSize: fontu * 3.6, color: '#4f4f4f', fontFamily: 'poppins_medium' }}>After Your friend Signup you will get the points</Text>


                            </View>
                        </View>
                        <View style={{ width: 2, height: dsh * 4, backgroundColor: '#ccc', marginLeft: '10%' }} />

                        <View style={{
                            flexDirection: 'row',
                            marginTop: dsw * 2,
                            alignItems: 'center',
                            marginBottom: dsw * 2
                        }}>
                            <View style={{
                                backgroundColor: Colors.bglight,
                                height: dsw * 13,
                                width: dsw * 13,
                                borderRadius: dsw * 10,
                                marginLeft: fonts * 2,
                                justifyContent: 'center'
                            }}>
                                <MaterialIcons style={{
                                    alignSelf: 'center',
                                }}
                                    name="attach-email" size={28} color="#bcb3c9" />
                            </View>
                            <View style={{ width: '68%', marginLeft: fonts * 1.5 }}>

                                <Text style={{ fontSize: fontu * 3.6, color: '#4f4f4f', fontFamily: 'poppins_medium' }}>You get ₹50 once the Paymet completed by your friend</Text>


                            </View>
                        </View>


                    </View>

                </ScrollView>
                </View>
                <View style={{ backgroundColor: '#fff' }} key="2">
                    <FlatList
                        data={refer}

                        ListHeaderComponent={() =>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                <Text style={{ width: '35%', textAlign: 'center', fontWeight: 'bold', color: '#000', fontSize: 15 }}>Name</Text>
                                <Text style={{ width: '30%', textAlign: 'center', fontWeight: 'bold', color: '#000', fontSize: 15 }}>Number</Text>
                                
                                <Text style={{ width: '30%', textAlign: 'center', fontWeight: 'bold', color: '#000', fontSize: 15 }}>Points</Text>


                            </View>
                        }
                        renderItem={({ item }) =>

                            <View style={{
                                width: '94%', alignSelf: 'center', flexDirection: 'row', borderRadius: 10, elevation: 10,
                                alignItems: 'center', backgroundColor: '#fff', margin: 5, padding: 15,justifyContent:'space-between',height:80,marginTop:5
                            }}><Text style={{ fontSize: 12, color: '#fff',  textAlign: 'center',position:'absolute',right:0,top:0,backgroundColor:Colors.backgroundcolor,paddingTop:5,padding:5,borderTopRightRadius:8,borderBottomLeftRadius:8 }}>{'complete'}</Text>
                                <Text style={{ fontSize: 17, color: Colors.backgroundcolor, width: '38%', textAlign: 'center' }}>{item.refer_name}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 17, color: Colors.backgroundcolor, width: '20%', textAlign: 'center' }}>{item.referral_id}</Text>
                                <Text style={{ fontSize: 18, color: Colors.backgroundcolor, width: '25%', textAlign: 'center' }}>{'50'}</Text>
                            </View>
                        }
                    />
                </View>

            </PagerView>






        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    pagerView: {
        flex: 1,
        backgroundColor: Colors.bglight
    },


});
