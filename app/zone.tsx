import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  ProgressBarAndroid,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Checkbox, TextInput } from "react-native-paper";
import { Link, router } from "expo-router";
import HeaderAB from "../components/HeaderAB";
import { path } from "../components/server";
import { useLocalSearchParams } from "expo-router"
import { getpercent } from "../utils";

const Zone = () => {
  console.log("Zone");
  const sub = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [livePools, setLivePools] = useState([])

  const zone = ["Zone 1", "Zone 2", "Zone 3", "Zone 4"];
  const getpools = async () => {
    setLoading(true)
    let response = await fetch(
      path + "pool.php?case=getbysub&sub_id="+sub.item
      
    );

    let res = await response.json();
    console.log(res)
    setLoading(false)
    if(!res.error){
      setData(res.data)
    }
    else{
      alert('No pool Found');
    }
  };

  useEffect(() => {
    getpools();
    console.log(sub.item)
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // Get the current date and time
      const currentDate = new Date();

      // Define arrays for upcoming, live, and completed pools
      
      let livePools = [];
      let upcomingPools = [];
      // Iterate through the pools array
      data.forEach(pool => {
        // Extracting components of the start date string
        const [startDateString, startTimeString] = pool.start_date.split(', ');
        const [startMonth, startDay, startYear] = startDateString.split('/');
        const [startTime, startAMPM] = startTimeString.split(' ');
        const [startHour, startMinute, startSecond] = startTime.split(':');

        // Create a new Date object for the start date
        const startDate = new Date(startYear, startMonth - 1, startDay, startAMPM === 'PM' ? parseInt(startHour, 10) + 12 : parseInt(startHour, 10), parseInt(startMinute, 10), parseInt(startSecond, 10));

        // Extracting components of the end date string
        const [endDateString, endTimeString] = pool.end_date.split(', ');
        const [endMonth, endDay, endYear] = endDateString.split('/');
        const [endTime, endAMPM] = endTimeString.split(' ');
        const [endHour, endMinute, endSecond] = endTime.split(':');

        // Create a new Date object for the end date
        const endDate = new Date(endYear, endMonth - 1, endDay, endAMPM === 'PM' ? parseInt(endHour, 10) + 12 : parseInt(endHour, 10), parseInt(endMinute, 10), parseInt(endSecond, 10));

        // Compare with the current date
        if (endDate < currentDate) {
          
        } else if (startDate > currentDate) {
          upcomingPools.push(pool);
        } else {
          livePools.push(pool);
        }
      });


      
      setLivePools(upcomingPools)
    }
  }, [data])


  return (
    <View style={styles.container}>
      <HeaderAB title={"Quiz Zone"} />

      {!loading?livePools.length > 0 ?<FlatList
        data={livePools}
        renderItem={({ item,index }) => (
          <View>
            <Text style={[styles.title, { color: "#4863A0" }]}>{"Zone "+(index+1)}</Text>
            {/* <Link asChild href={"../rankingdetails"}> */}
              <Pressable onPress={()=>router.push({pathname: `/rankingdetails`, params: item })} style={styles.buttonView}>
                <View style={[styles.subView, { marginRight: 10 }]}>
                  <Text style={styles.title}>Prize Pool</Text>
                  <Text style={styles.title}>Entry</Text>
                </View>
                <View style={[styles.subView, { marginVertical: 10 }]}>
                  <Text style={styles.title}>{'10000' } QC</Text>
                  <View
                    style={{
                      backgroundColor: "#257EB8",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Text style={[styles.title, { fontSize: 16 }]}>{item.entry_fee} QC</Text>
                  </View>
                </View>
                <ProgressBarAndroid
                  styleAttr="Horizontal"
                  color={"#fff"}
                  indeterminate={false}
                  progress={getpercent(item.total_seats,item.available_seats)}
                />
                <View
                  style={[
                    styles.subView,
                    { marginRight: 10, marginVertical: 10 },
                  ]}
                >
                  <Text style={styles.title2}>100 Spots</Text>
                  <Text style={styles.title2}>100 left</Text>
                </View>
                <View
                  style={[
                    styles.subView,
                    { marginRight: 10, marginVertical: 10 },
                  ]}
                >
                  <Text style={styles.title3}>1st 5000 QC</Text>
                  <Text style={styles.title3}>winner upto 20</Text>
                </View>
              </Pressable>
            {/* </Link> */}
          </View>
        )}
      />:<View style={{justifyContent:'center',alignItems:'center',flex:1}}>
      <Text style={{fontWeight:'bold',fontSize:20}}>No Pool Found !</Text>
    </View>:
      <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
        <ActivityIndicator color={Colors.backgroundcolor} size={'large'}/>
      </View>
      }
    </View>
  );
};

export default Zone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bglight,
  },
  buttonView: {
    width: "90%",
    marginVertical: 10,
    elevation: 5,
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  title2: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  title3: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  subView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ripple: {
    color: Colors.light.background,
  },
});
