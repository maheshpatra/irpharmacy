import { View, RefreshControl,Text, FlatList, StyleSheet,Image, Alert, ActivityIndicator, ToastAndroid } from 'react-native';
import Header from '../../components/Header';
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router,useFocusEffect } from 'expo-router';
import { _retrieveData,_removeData } from "../../local_storage";
import { useEffect, useState,useCallback } from 'react';
import { path } from '../../components/server';
import {  } from 'expo-router';
import Colors from '../../constants/Colors';
const prescription = () => {

  const [data, setData]=useState(null)
  const [loading, setLoading]=useState(false)
  const [prescription, setPrescription]=useState([])
  const [medichine, setMedichine]=useState([])

  useFocusEffect(
    useCallback(() => {
      getprescription()
      console.log('hello mii')
      return () => {
      }
    }, [data])
  )

  useEffect(() => {

    _retrieveData("USER_DATA").then((userdata) => {
      console.log(userdata);
      if (userdata && userdata !== 'error') {
       setData(userdata)
        
      } else {
       Alert.alert('Error','user not found!')
        
      }

    });
  }, [])

  const getprescription = async () => {
    setLoading(true)
    const fd = new FormData();
    fd.append("mobile", data?.mobile)
    fd.append("case", 'get_prescriptions')
    try {
      const req = await fetch(path + "prescription.php", {
        body: fd,
        method: 'post'
      })
      const res = await req.json();
      console.log(res)
      
      setPrescription(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(JSON.stringify(err, null, 2));
    }
  }

  useEffect(()=>{
    getprescription()
  },[data])



  return (
    <View style={styles.container}>
      <Header title={'Prescriptions'} />
      
        {prescription.length >0 ? <FlatList
          data={prescription}
          renderItem={({item,index}) =>

            
            <TouchableOpacity onPress={()=>
            {
              if(item.status=='confirm'){
                router.push({ pathname: `/prescriptiondetails`, params: { data:item.id }})
              }else{
                ToastAndroid.showWithGravityAndOffset(
                  'Your prescription is not perpared yet ! ',
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              }
           
            }} style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(30), borderBottomWidth:2,borderColor:'#ccc', flexDirection:'row',alignItems:'center'}}>
              {item.image && <Image style={{height:50,width:50,marginLeft:15}} source={{uri:item.image}} />}
              {!item.image &&<Image style={{height:50,width:50,marginLeft:15}} source={require('../../assets/images/homepage-con.png')} />}
              <View style={{marginLeft:10,height:'70%',justifyContent:'space-between'}}>
              <Text style={{fontFamily:'novabold',fontSize:responsiveScreenFontSize(2),color:'#333'}}>{item.name}</Text>
              <Text style={{fontFamily:'novaregular'}}>{item.date}</Text>
              <View style={{backgroundColor:'#e3f6da',width:responsiveScreenWidth(51),justifyContent:'center',alignItems:'center',height:responsiveScreenWidth(6),borderRadius:10}}>
              <Text style={{fontFamily:'novabold',}}>status {item.status}</Text>
              </View>
              
              </View>
            </TouchableOpacity>
          }
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={getprescription} />
          }
        />:
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontFamily:'novabold' ,fontSize:21,color:'#555'}}>No Prescription found ! </Text>
          </View>
        }
     
    </View>
  );
}

export default prescription
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});

