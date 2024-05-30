import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ProgressBarAndroid,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import Colors from "../constants/Colors";
import { ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { path } from "../components/server";
import { _retrieveData } from "../local_storage";
import { getpercent } from "../utils";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import moment from "moment";

const width1 = Dimensions.get("window").width;

const Leaderboard = () => {
  const [number, setNumber] = useState();
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [mypooldata, setpooldata] = useState([]);

  const [upcomingPools, setUpcomingPools] = useState([]);
  const [livePools, setLivePools] = useState([]);
  const [completedPools, setCompletedPools] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const Tab = createMaterialTopTabNavigator();

  let interval: any;

  const onRefresh = () => {
    setRefreshing(true);
    getMypool(number);
  };

  useEffect(() => {
    _retrieveData("USER_DATA").then((userdata) => {
      if (userdata && userdata !== "error") {
        setNumber(userdata.mobile);
        getMypool(userdata.mobile);
      } else {
      }
    });
  }, []);

  const getMypool = async (user) => {
    setloading(true);
    let response = await fetch(path + "pool.php?case=getbyuser&user=" + user);
    let res = await response.json();
    setpooldata(res);
    setRefreshing(false);
    setloading(false);
  };

  const [poolstatus, setPool] = useState("");

  // useEffect(() => {
  //   setPool("Live Contest");
  // }, []);

  useEffect(() => {
    if (mypooldata.length > 0) {
      // Get the current date and timer
      const currentDate = new Date();

      // Define arrays for upcoming, live, and completed pools
      let upcomingPools = [];
      let livePools = [];
      let completedPools = [];

      // Iterate through the pools array
      mypooldata.forEach((pool) => {
        // Create a new Date object for the start date
        const startDate = moment(
          pool.start_date,
          "M/D/YYYY, h:mm:ss A"
        ).toDate();

        // Create a new Date object for the end date
        const endDate = moment(pool.end_date, "M/D/YYYY, h:mm:ss A").toDate();

        // Compare with the current date
        if (endDate < currentDate) {
          completedPools.push(pool);
        } else if (startDate > currentDate) {
          upcomingPools.push(pool);
        } else {
          livePools.push(pool);
        }
      });

      setUpcomingPools(upcomingPools?.reverse());
      setLivePools(livePools?.reverse());
      setCompletedPools(completedPools?.reverse());

      // return () => clearInterval(interval);
      // console.log(completedPools);
    }
  }, [mypooldata]);

  // useEffect(() => {
  //   if (mypooldata.length > 0) {
  //     interval = setInterval(() => {
  //       // Get the current date and time
  //       const currentDate = new Date();

  //       mypooldata.forEach(async (pool) => {
  //         // Create a new Date object for the start date
  //         const startDate = moment(
  //           pool.start_date,
  //           "M/D/YYYY, h:mm:ss A"
  //         ).toDate();

  //         const endDate = moment(pool.end_date, "M/D/YYYY, h:mm:ss A").toDate();

  //         // console.log("startDate", startDate);
  //         // console.log("endDate", endDate);

  //         if (
  //           startDate.getTime() === currentDate.getTime() ||
  //           endDate.getTime() === currentDate.getTime()
  //         ) {
  //           console.log("matched");

  //           getMypool(number);
  //         }
  //       });
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [mypooldata]);

  const Upcoming = () => {
    return (
      <View style={styles.container}>
        {upcomingPools.length > 0 ? (
          <FlatList
            data={upcomingPools}
            contentContainerStyle={{
              borderBottomWidth: 1,
              borderColor: "#ddd",
              paddingBottom: 10,
              marginBottom: 10,
              padding: 10,
              width: "95%",
              alignSelf: "center",
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Not Live", "Your Quiz is Not Live yet!")
                }
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignSelf: "center",
                  margin: 5,
                  backgroundColor: "#fff",
                  padding: 18,
                  elevation: 5,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 15,
                    backgroundColor: Colors.bglight,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: Colors.backgroundcolor,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 22,
                    }}
                  >
                    {"Entry Fee\n" + item.entry_fee}
                  </Text>
                </View>
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
                    {item.sub_id}
                  </Text>
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    color={Colors.backgroundcolor}
                    indeterminate={false}
                    progress={getpercent(
                      item.total_seats,
                      item.available_seats
                    )}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: -10,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {" "}
                      {item.total_seats - item.available_seats} seat left{" "}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {" "}
                      Total {item.total_seats}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      alignSelf: "center",
                      fontWeight: "bold",
                      backgroundColor: Colors.backgroundcolor,
                      color: "#fff",
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      borderRadius: 15,
                    }}
                  >
                    {" "}
                    Get Ready
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              No Pools Found
            </Text>
          </View>
        )}
      </View>
    );
  };

  const LiveContest = () => {
    return (
      <View style={styles.container}>
        {livePools.length > 0 ? (
          <FlatList
            data={livePools}
            contentContainerStyle={{
              borderBottomWidth: 1,
              borderColor: "#ddd",
              paddingBottom: 10,
              marginBottom: 10,
              padding: 10,
              width: "95%",
              alignSelf: "center",
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: `/start`,
                    params: {
                      poolid: item.id,
                      number: number,
                      model_id: item.model_id,
                    },
                  })
                }
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignSelf: "center",
                  margin: 5,
                  backgroundColor: "#fff",
                  padding: 18,
                  elevation: 5,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 15,
                    backgroundColor: Colors.bglight,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: Colors.backgroundcolor,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 22,
                    }}
                  >
                    {"Entry Fee\n" + item.entry_fee}
                  </Text>
                </View>
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
                    {item.sub_id}
                  </Text>
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    color={Colors.backgroundcolor}
                    indeterminate={false}
                    progress={getpercent(
                      item.total_seats,
                      item.available_seats
                    )}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: -10,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {" "}
                      {item.total_seats - item.available_seats} seat left{" "}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {" "}
                      Total {item.total_seats}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      alignSelf: "center",
                      fontWeight: "bold",
                      backgroundColor: Colors.backgroundcolor,
                      color: "#fff",
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      borderRadius: 15,
                    }}
                  >
                    {" "}
                    Play Quiz
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              No Pools Found
            </Text>
          </View>
        )}
      </View>
    );
  };

  const Completed = () => {
    return (
      <View style={styles.container}>
        {completedPools.length > 0 ? (
          <FlatList
            data={completedPools}
            contentContainerStyle={{
              borderBottomWidth: 1,
              borderColor: "#ddd",
              paddingBottom: 10,
              marginBottom: 10,
              padding: 10,
              width: "95%",
              alignSelf: "center",
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  // console.log(item)
                  router.push({
                    pathname: `/rank`,
                    params: { poolid: item.id },
                  })
                }
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignSelf: "center",
                  margin: 5,
                  backgroundColor: "#fff",
                  padding: 18,
                  elevation: 5,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 15,
                    backgroundColor: Colors.bglight,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: Colors.backgroundcolor,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 22,
                    }}
                  >
                    {"Entry Fee\n" + item.entry_fee}
                  </Text>
                </View>
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
                    {item.sub_id}
                  </Text>
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    color={Colors.backgroundcolor}
                    indeterminate={false}
                    progress={getpercent(
                      item.total_seats,
                      item.available_seats
                    )}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: -10,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {" "}
                      {item.total_seats - item.available_seats} seat left{" "}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {" "}
                      Total {item.total_seats}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      alignSelf: "center",
                      fontWeight: "bold",
                      backgroundColor: Colors.backgroundcolor,
                      color: "#fff",
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      borderRadius: 15,
                    }}
                  >
                    {" "}
                    Go to Result
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              No Pools Found
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (!number) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View style={{ borderColor: '#ccc', borderBottomWidth: 2, flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center', height: 40, alignItems: 'center' }}>
        {
          statustabs.map((item) =>
            <TouchableOpacity
              onPress={() => {
                setPool(item)
              }}
              style={{ height: 40, justifyContent: 'center', paddingLeft: 20, paddingRight: 20, borderBottomWidth: poolstatus == item ? 2 : 0, borderColor: Colors.backgroundcolor }}>
              <Text style={{ color: poolstatus == item ? Colors.backgroundcolor : '#999' }}>{item}</Text>
            </TouchableOpacity>
          )
        }
      </View> */}

      {!loading ? (
        mypooldata.length > 0 ? (
          <Tab.Navigator
            initialRouteName="Live Contest"
            screenOptions={() => ({
              tabBarStyle: {
                marginVertical: 8,
                backgroundColor: "transparent",
                borderRadius: 10,
                elevation: 0,
                marginHorizontal: (width1 * 4) / 100,
              },
              tabBarLabelStyle: {
                fontSize: 14,
                color: Colors.backgroundcolor,
                textTransform: "capitalize",
              },
              tabBarIndicatorStyle: {
                width: (width1 * 25) / 100,
                backgroundColor: Colors.backgroundcolor,
                borderRadius: 10,
                marginHorizontal: (width1 * 2) / 100,
              },
            })}
          >
            <Tab.Screen name="Upcomming" component={Upcoming} />
            <Tab.Screen name="Live Contest" component={LiveContest} />
            <Tab.Screen name="Completed" component={Completed} />
          </Tab.Navigator>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              No Pools Found !
            </Text>
          </View>
        )
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={Colors.backgroundcolor} size={"large"} />
        </View>
      )}
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bglight,
  },
  buttonView: {
    width: width1 - 20,
    height: 150,
    marginVertical: 10,
    elevation: 5,
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textTransform: "capitalize",
  },

  subView: {
    backgroundColor: "#b3b3b3",
    padding: 5,
    borderRadius: 5,
  },
  ripple: {
    color: Colors.light.background,
  },
});
