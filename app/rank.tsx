import { View, Text, FlatList, Alert,RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import Colors from '../constants/Colors'
import { path } from '../components/server'
import { _retrieveData } from '../local_storage'
import { ActivityIndicator } from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router'

const Rank = () => {
  const [loading,setLoading] = useState(false)
  const [data,setdata] = useState([])
  const [user,setuser] = useState(null)
  const poolid = useLocalSearchParams()
  const [refreshing, setRefreshing] = useState(false);
    const rankt = [
        {
            "rank": 1,
            "name": "John Doe",
            "score": 95
          },
          {
            "rank": 2,
            "name": "Jane Smith",
            "score": 90
          },
          {
            "rank": 3,
            "name": "Bob Johnson",
            "score": 85
          },
          {
            "rank": 4,
            "name": "Alice Brown",
            "score": 80
          },
          {
            "rank": 5,
            "name": "Chris Davis",
            "score": 75
          }
    ]
    useEffect(()=>{
      fetchResult()
    },[])

    const onRefresh = () => {
      setRefreshing(true);
      fetchResult();
    };
    // console.log(poolid)

    useEffect(() => {

      _retrieveData("USER_DATA").then((userdata) => {
        console.log(userdata);
        if (userdata && userdata !== 'error') {
          setuser(userdata.mobile)
        }else{

        }
  
  
      });
    }, [])

    const fetchResult = async () => {
      setLoading(true)
      try {
        const req = await fetch(path + "rank.php?case=fetchrankbypool&pool_id="+poolid.poolid)
        let res = await req.json();
        console.log(res)
        setLoading(false)
        setRefreshing(false);
        if(!res.error){
          setdata(res.data)
          console.log(res.data)
        }else{
          Alert.alert('Error',res.message)
        }
  
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
      }
  
  
    }

    function convertToBiometric(num) {
      return String(num).split("").reverse().map((e, i) => i >= 4 ? "*" : e).reverse().join("");
 }

  return (
    <View style={{flex:1}}>
        <HeaderAB title={'Result/Rank'} notification={true} />
        {!loading?data.length > 0 ?
        <FlatList
        data={data}

        ListHeaderComponent={()=>
        <View style={{flexDirection:'row',alignSelf:'center',marginTop:10}}>
            <Text style={{width:'30%',textAlign:'center',fontWeight:'bold',color:'#000',fontSize:15}}>RANK</Text>
            <Text style={{width:'35%',textAlign:'center',fontWeight:'bold',color:'#000',fontSize:15}}>User</Text>
            <Text style={{width:'30%',textAlign:'center',fontWeight:'bold',color:'#000',fontSize:15}}>Score</Text>
         

        </View>
        }
        renderItem={({item,index})=>
        
        item.number==user?<View style={{width:'94%',alignSelf:'center',flexDirection:'row',borderRadius:10,elevation:10,
        alignItems:'center',backgroundColor:Colors.backgroundcolor,margin:5,padding:15}}>
         <Text style={{fontSize:20,color:'#fff'}}>#</Text>
         <Text style={{fontSize:20,color:'#fff',width:'20%',textAlign:'center'}}>{index+1}</Text>
         <Text style={{fontSize:20,color:'#fff',width:'50%',textAlign:'center'}}>{item.number}</Text>
         <Text style={{fontSize:20,color:'#fff',width:'25%',textAlign:'center'}}>{item.result}</Text>
        </View>:
        <View style={{width:'94%',alignSelf:'center',flexDirection:'row',borderRadius:10,elevation:10,
        alignItems:'center',backgroundColor:'#fff',margin:5,padding:15}}>
         <Text style={{fontSize:20,color:Colors.backgroundcolor}}>#</Text>
         <Text style={{fontSize:20,color:Colors.backgroundcolor,width:'20%',textAlign:'center'}}>{index+1}</Text>
         <Text numberOfLines={1} style={{fontSize:20,color:Colors.backgroundcolor,width:'50%',textAlign:'center'}}>{convertToBiometric(item.number)}</Text>
         <Text style={{fontSize:20,color:Colors.backgroundcolor,width:'25%',textAlign:'center'}}>{item.result}</Text>
        </View>
        
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
        />:
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text>Result not publish Yet !</Text>
        </View>
        :
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator color={Colors.backgroundcolor} size={'large'} /> 
        </View>
        }
      
    </View>
  )
}
export default Rank