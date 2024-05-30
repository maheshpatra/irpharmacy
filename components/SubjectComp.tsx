import { router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, ProgressBarAndroid, Image, Text, ActivityIndicator } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { path } from "./server";
import { getpercent } from "../utils";

const StateComp = ({ item }) => {
    const router = useRouter();
    const [sub, setSub] = useState([]);
    const [statedata, setstatedata] = useState([]);
    const [state, setstate] = useState(1);
    const [loading, setLoading] = useState(false);
    const [route, setRoute] = useState()
    const defaultIndex = 0;

    const getsubject = async (id) => {
        setLoading(true);
        let headersList = {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        };
        try {
            let response = await fetch(
                path + "subject.php?case=findbysub&id=" + id,
                {
                    method: "GET",
                    headers: headersList,
                }
            );
            let data = await response.json();
            setSub(data);
            setLoading(false);
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getsubject(item.state_id)
    }, [route])

    return (
        <View style={{ flex: 1 }}>
            {!loading ?<FlatList
                data={sub}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: `/zone`, params: { item:item.name } })}
                            style={{
                                width: "100%",
                                flexDirection: "row",
                                alignSelf: "center",
                                margin: 5,
                                backgroundColor: "#fff",
                                padding: 18,
                                elevation: 2,
                                borderRadius: 10,
                            }}
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={{ height: 120, width: 120, borderRadius: 15 }}
                            />
                            <View
                                style={{
                                    marginLeft: 10,
                                    justifyContent: "space-around",
                                    width: "50%",
                                }}
                            >
                                <Text
                                    style={{ color: "#555", fontWeight: "bold", fontSize: 18 }}
                                >
                                    {item.name}
                                </Text>
                                <ProgressBarAndroid
                                    styleAttr="Horizontal"
                                    color={Colors.backgroundcolor}
                                    indeterminate={false}
                                    progress={getpercent(100,20)}
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginTop: -10,
                                    }}
                                >
                                    <Text style={{ fontSize: 12 }}> Mega </Text>
                                    <Text style={{ fontSize: 12 }}> 10000 QC</Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        alignSelf: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Unlock Quest
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />:
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size={'large'} color={Colors.primary} /></View>
        }
        </View>
    );
};

export default StateComp;