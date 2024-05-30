import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import HeaderAB from "../components/HeaderAB";
import { path } from "../components/server";
import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

const Test = () => {
  console.log("Test");
  const [examdata, setExamdata] = useState([])
  const [examname, setExam] = useState('')
  const [loading, setloading] = useState(false)
  const exam = useLocalSearchParams()
  const getseries = async (id) =>{
      console.log(id)
      setloading(true)
      let bodyContent = new FormData();
      bodyContent.append("case", "get_series_by_id");
      bodyContent.append("id", id);
     
      let response = await fetch(path+"series.php", {
        method: "POST",
        body: bodyContent
      });
  
      let data = await response.json();
      setloading(false)
      console.log(data);
      if (!data.error) {
        setExamdata(data.data)
      }
    
  }

  useEffect(()=>{
  getseries(exam.examid)
  setExam(exam.examname)
  },[exam])

  return (
    <SafeAreaView style={styles.container}>
      <HeaderAB title={'Tests'} notification={true} />

      <View style={{width:'93%',alignSelf:'center',backgroundColor:Colors.backgroundcolor,height:150,marginTop:20,borderRadius:10}}>
<View style={{flexDirection:'row',width:'100%',justifyContent:'center',marginTop:15}}>
  <Text style={[styles.title, { marginRight: 5, }]}>Exam :</Text>
  <Text style={[styles.title, { marginLeft: 5 }]}>{examname}</Text>
</View>
<View style={{flexDirection:'row',width:'100%',justifyContent:'center',marginTop:15}}>
  <Text style={[styles.title, { marginRight: 5, }]}>Paper :</Text>
  <Text style={[styles.title, { marginLeft: 5 }]}>Tier 1</Text>
</View>
<View style={{flexDirection:'row',width:'100%',justifyContent:'center',marginTop:15}}>
  <Text style={[styles.title, { marginRight: 5, }]}>Subject :</Text>
  <Text style={[styles.title, { marginLeft: 5 }]}>G S</Text>
</View>
      </View>
      {!loading?examdata.length > 0 ?<FlatList
      data={examdata}
      style={{width:'95%'}}
      renderItem={({item,index})=>
        <View style={[styles.buttonView, {  }]}>
        <View style={styles.subView2}>
          <Text style={[styles.title, { marginLeft: 5 }]}>{item.name}</Text>
         
            <Pressable onPress={()=>router.push({ pathname: `/quesansexam`, params: { examid:item.id,model_id:item.model_id } })} style={styles.startButton}>
              <Text style={styles.title}>Start</Text>
            </Pressable>
          
        </View>
      </View>
      }

     />: <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
     <Text style={{fontWeight:'bold',fontSize:19}}>No Series found</Text>
      </View> :
     
     <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
     <ActivityIndicator size={'large'} color={Colors.backgroundcolor} />
      </View>
     }
      
    </SafeAreaView>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  buttonView: {
    width: "95%",
    marginVertical: 10,
    elevation: 5,
    backgroundColor: "#2f95dc",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
  },
  subView2: {
    // backgroundColor:'#1a1a1a',
    borderRadius: 5,
    margin: 5,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  startButton: {
    width: "30%",
    height: 40,
    padding: 5,
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  ripple: {
    color: Colors.light.background,
  },
});
