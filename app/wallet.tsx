import React, { useEffect } from 'react';
import { View, Text, Dimensions, Pressable, TextInput, StyleSheet, Alert, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';

// import { Button, Actionsheet, useDisclose, Icon, Box, Center, NativeBaseProvider, Progress } from "native-base";
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import HeaderAB from '../components/HeaderAB';
import Colors from '../constants/Colors';
import { path } from '../components/server';
import { _retrieveData } from '../local_storage';


const ts = Dimensions.get('window').width / 100;
const tsh = Dimensions.get('window').height / 100;
const Wallet = ({ navigation }) => {
    const [balance, setBalance] = React.useState(0)
    const [email, setEmail] = React.useState('')
    const [mobile, setMobile] = React.useState('')
    const [point, setuserpoint] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [amount, setAmount] = React.useState(0)
    const [amodal, setAmodal] = React.useState(false)
    const [withdraw, setWithdraw] = React.useState(false)

    const [transaction, setTransaction] = React.useState([])

    const closeAlert = () => {
        setAmodal(false);
    };

    const gettransaction = async (mob) => {
        setLoading(true)
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }

        let bodyContent = new FormData();
        bodyContent.append("case", "history");
        bodyContent.append("mobile", mob);

        let response = await fetch(path + "wallet.php", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        let data = await response.json();
        console.log(data);
        if (data.success) {
            setTransaction(data.data)
        } else {
            alert('no transaction found');
        }

    }


    const depositwalet = async (mob) => {
        setLoading(true)
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }

        let bodyContent = new FormData();
        bodyContent.append("case", "deposit");
        bodyContent.append("mobile", mob);
        bodyContent.append("amount", amount);

        let response = await fetch(path + "wallet.php", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        let data = await response.json();
        console.log(data);
        if (data.success) {
            setLoading(false)
            setAmodal(false)
            setAmount('')
            getwallet(mobile)
            gettransaction(mobile)
        } else {
            setLoading(false)
        }
    }
    const Withdrawwallet = async (mob,bala) => {
        console.log(point);
        
        // check level wise withdraw limit
        if(point === 'Platinum' && bala > 5000) {
            Alert.alert('Limit', 'Withdraw not allowed')
            return;
        }
       else if (point === 'Gold' && bala > 2500) {
            Alert.alert('Limit', 'Withdraw not allowed')
            return;
        } else if (point === 'Silver' && bala > 1000) {
            Alert.alert('Limit', 'Withdraw not allowed')
            return;
        }
        else if (point === 'Bronze' && bala > 100) {
            Alert.alert('Limit', 'Withdraw not allowed')
            return;
        }else if (point === '') {
            Alert.alert('Limit', 'Withdraw not allowed')
            return;
        }
        else if (bala > balance) {
            alert('invalid amount!')
            setLoading(false)
            return;
        }

        setLoading(true)
        

        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }

        let bodyContent = new FormData();
        bodyContent.append("case", "withdraw");
        bodyContent.append("mobile", mob);
        bodyContent.append("amount", bala);

        let response = await fetch(path + "wallet.php", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        let data = await response.json();
        console.log(data);
        if (data.success) {
            setLoading(false)
            setAmodal(false)
            setAmount('')
            getwallet(mobile)
            gettransaction(mobile)
        } else {
            setLoading(false)
        }
    }

    const getwallet = async (mob) => {
        setLoading(true)
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }

        let bodyContent = new FormData();
        bodyContent.append("case", "wallet_balance");
        bodyContent.append("mobile", mob);

        let response = await fetch(path + "wallet.php", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        let data = await response.json();
        console.log(data);
        if (data.code == "sucess") {
            setLoading(false)
            setBalance(data.data.balance)
        } else {
            setLoading(false)
        }
    }

    const getlevel = async (mob) => {
        setLoading(true)


        let bodyContent = new FormData();
        bodyContent.append("case", "point");
        bodyContent.append("id", mob);

        let response = await fetch(path + "wallet.php", {
            method: "POST",
            body: bodyContent
        });
        setLoading(false)
        let data = await response.json();
        // console.log(data.data.point);
        if (!data.error) {
            const point_ = Number(data.data.point);
            console.log(point_);

            if (point_ > 4999) {
                setuserpoint('Platinum')
            } else if (point_ > 2499) {
                setuserpoint('Gold')
            } else if (point_ > 999) {
                setuserpoint('Silver')
            } else if (point_ > 100) {
                setuserpoint('Broze')
            }

        }

    }

    useEffect(() => {
        _retrieveData("USER_DATA").then((userdata) => {
            // console.log(user_mobile);
            if (userdata !== 'error') {
                setMobile(userdata.mobile)
                getwallet(userdata.mobile)
                gettransaction(userdata.mobile)
                getlevel(userdata.mobile)
            }
        })
    }, [])

    // const {
    //     isOpen,
    //     onOpen,
    //     onClose
    // } = useDisclose();
    return (

        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderAB title={'Wallet'} />

            <View style={{ backgroundColor: Colors.backgroundcolor, marginHorizontal: ts * 5, borderRadius: 10, height: ts * 35, marginTop: 20 }}>
                <Text style={{ alignSelf: 'flex-start', marginTop: ts * 2, fontSize: ts * 5, marginLeft: ts * 4, fontWeight: 'bold', color: '#fff' }}> {point} </Text>
                {
                    loading ? <ActivityIndicator size={'small'} color={'#fff'} /> :
                        <Text style={{ fontSize: ts * 8, fontWeight: 'bold', color: '#fff', marginTop: ts * 3, marginLeft: ts * 6 }}>₹ {balance}</Text>

                }
                {transaction.length > 0 &&<View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: ts * 3 }}>
                    <Ionicons name={transaction[0].type == 'debit' ?"chevron-down":"chevron-up"} size={ts * 5} color={transaction[0].type == 'debit' ? 'red':'#77d96f'} />
                    <Text style={{ fontSize: ts * 2.5, fontWeight: 'bold', color:transaction[0].type == 'debit' ? 'red':'#77d96f' }}>₹{ transaction[0].amount + ' '+ (transaction[0].type == 'debit' ? 'debit on ':'added on ')+ transaction[0].date} </Text>
                </View>}

                <Octicons onPress={() => {
                    Alert.alert('Minimum Withdrawal Limit', 'Bronze : Withdraw 100 Coins.\nSilver : Withdraw 1000 Coins. \nGold : Withdraw 2500 Coins. \nPlatinum : Withdraw 2501 to 5000 Coins.')
                }} name="info" size={ts * 5} color="#555" style={{ position: 'absolute', right: ts * 5, padding: 5, backgroundColor: '#f4f4f4', borderBottomLeftRadius: 5, borderBottomRightRadius: 10 }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: ts * 5, height: ts * 20, }}>
                <Pressable onPress={() => {
                    setAmodal(true)
                    setWithdraw(true)
                }} style={{ width: ts * 43, backgroundColor: '#22BDFF', marginLeft: ts * 5, borderRadius: 10, flexDirection: 'row' }}>
                    <Ionicons name="chevron-up" size={ts * 9.5} color={'#22BDFF'} style={{ backgroundColor: '#fff', alignSelf: 'center', marginLeft: ts * 4, borderRadius: 5 }} />
                    <Text style={{ fontSize: ts * 3.6, fontWeight: 'bold', color: '#fff', alignSelf: 'center', marginLeft: ts * 2 }}>Withdraw</Text>
                </Pressable>
                <Pressable onPress={() => {
                    setAmodal(true)
                    setWithdraw(false)
                }} style={{ width: ts * 43, backgroundColor: Colors.backgroundcolor, marginRight: ts * 5, borderRadius: 10, flexDirection: 'row' }}>
                    <Ionicons name="add" size={ts * 9.5} color={Colors.backgroundcolor} style={{ backgroundColor: '#fff', alignSelf: 'center', marginLeft: ts * 4, borderRadius: 5 }} />
                    <Text style={{ fontSize: ts * 3.6, fontWeight: 'bold', color: '#fff', alignSelf: 'center', marginLeft: ts * 2 }}>Deposit</Text>
                </Pressable>



            </View>
            <View>

                <Text style={{ marginLeft: ts * 5, marginTop: ts * 2, fontWeight: 'bold' }}>Recent Transtion</Text>

                {transaction.length > 0 && <FlatList
                    style={{ marginBottom: 40 }}
                    data={transaction}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', marginTop: ts * 3, marginHorizontal: ts * 5, backgroundColor: item.type == 'credit' ? '#ceebd9' : '#e3b9b8', elevation: 4, padding: ts * 4, borderRadius: 5, marginBottom: ts * 1.5 }}>
                            <Ionicons name="add" size={ts * 9.5} color="#fff" style={{ backgroundColor: '#22BDFF', borderRadius: 5, elevation: 5 }} />
                            <View>
                                <Text style={{ fontWeight: 'bold', marginLeft: ts * 2 }}>{item.desc}</Text>
                                <Text style={{ fontWeight: 'bold', marginLeft: ts * 2, color: item.type == 'debit' ? 'red' : 'green' }}>{item.type}</Text>
                            </View>
                            <View style={{ position: 'absolute', right: ts * 5, alignSelf: 'center' }}>
                                <Text style={{ fontWeight: 'bold', marginLeft: ts * 2, color: item.type == 'debit' ? 'red' : 'green' }}>{(item.type == 'debit' ? '- ' : '+ ') + item.amount}</Text>
                            </View>

                        </View>
                    )} />}
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={amodal}
                onRequestClose={closeAlert}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        <Text style={styles.messageText}>{'Enter an amount'}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholderTextColor={'#ccc'}
                                placeholder="Amount"
                                keyboardType='numeric'
                                style={styles.inputfild}
                                value={amount}
                                onChangeText={(text) => setAmount(text)}
                            />

                        </View>
                        <TouchableOpacity
                            onPress={() => !withdraw ? depositwalet(mobile) : Withdrawwallet(mobile,amount)}
                            style={{
                                height: 50,
                                width: "90%",
                                backgroundColor: Colors.backgroundcolor,
                                alignItems: "center",
                                justifyContent: "center",
                                alignSelf: "center",
                                marginTop: 30,
                                borderRadius: 8,
                            }}

                        >
                            {/* <Link href={"/home"} > */}
                            {loading ?
                                <ActivityIndicator color={'#fff'} size={'small'} />
                                :
                                <Text
                                    style={{ fontWeight: "bold", fontSize: 20, color: 'white' }}
                                >
                                    {!withdraw ? 'Add' : 'Withdraw'}
                                </Text>

                            }
                        </TouchableOpacity>

                    </View>
                </View>

            </Modal>

            {/* <NativeBaseProvider>
                <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
                    <Actionsheet.Content>


                        <View style={{ height: tsh * 60, width: '100%' }}>
                            <Text style={{ alignSelf: 'center', color: '#999', fontSize: ts * 4.8, fontWeight: 'bold', marginTop: ts * 3 }}>How much you Want to Add</Text>





                            <View>

                                <TextInput
                                    style={{ marginHorizontal: ts * 5, backgroundColor: '#ddd', height: tsh * 7, borderRadius: ts * 5, textAlign: 'center', fontSize: ts * 4, fontFamily: 'novaBold', padding: ts * 2, marginTop: ts * 5 }}
                                    onChangeText={onChangeNumber}
                                    value={number}
                                    placeholder="Enter amount"
                                    keyboardType="numeric"

                                />
                                <Pressable onPress={() => {
                                    // addbal(number)
                                    onClose()
                                    navigation.navigate('Payment' ,{item:number})
                                }} style={{ height: ts * 15, backgroundColor: 'tomato', marginHorizontal: ts * 5, alignItems: 'center', marginVertical: ts * 5, justifyContent: 'center', borderRadius: ts * 5, elevation: 5 }}>
                                    <Text style={{ fontSize: ts * 5, fontWeight: 'bold', color: '#fff' }}>Continue</Text>
                                </Pressable>
                            </View>





                        </View>






                    </Actionsheet.Content>
                </Actionsheet>
            </NativeBaseProvider> */}

        </View>
    )




}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',

    }, inputfild: {
        paddingLeft: 16,
        height: 50,
        borderColor: "#ccc",
        width: "90%",
        color: Colors.backgroundcolor,
        fontWeight: 'bold'

    },

    priceview: { backgroundColor: '#ddd', flexDirection: 'column', width: '30%', borderRadius: 10, justifyContent: 'center', marginLeft: ts * 2.5, },
    pricetext: { fontFamily: 'novaBold', alignSelf: 'center', color: 'tomato', fontSize: ts * 5 },
    iconstyle: {
        position: 'absolute', right: ts * 5

    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: Colors.backgroundcolor,
        elevation: 20
    },
    messageText: {
        fontSize: 19,
        marginBottom: 10
    },
    inputContainer: {
        backgroundColor: Colors.sec,
        borderRadius: 12,
        borderWidth: 1.5,
        height: 50,
        borderColor: "#ccc",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20
    },
})
export default Wallet;