import { View, Text,SafeAreaView,StyleSheet ,Pressable,Dimensions,Image, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { path } from '../components/server';
import { ActivityIndicator } from 'react-native-paper';
const width1 = Dimensions.get('window').width;
const height1 = Dimensions.get('window').height/15;

const start = () => {
  const router = useRouter();
  const [loading,setLoading] = useState(false)
  const [rank,setRank] = useState(false)
  const data = useLocalSearchParams()
  console.log(data)




  const verifyuser = async() => {
  
    setLoading(true)

    const fd = new FormData();
    fd.append("case", 'getverified')
    fd.append("poolid", data.poolid)
    fd.append("number", data.number)
    try {
      const req = await fetch(path + "rank.php", {
        body: fd,
        method: 'post'
      })
      let res = await req.json();
      console.log(res)
      setLoading(false)
      if(!res.error){
        setRank(false)
        // Alert.alert('Sucessfull',res.message,[
        //   {
        //     text: 'OK',
        //     onPress: () => router.push({ pathname: `/quesans`, params: { poolid:data.poolid } }),
        //     style: 'cancel',
        //   },
        // ])

        
      }else{
        setRank(true)
        // Alert.alert('Error',res.message)
        
      }

    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }

  };

  useEffect(()=>{

    verifyuser()

  },[])

  


  return (
    <SafeAreaView style = {styles.container}>
      <HeaderAB title={'Play Quiz'} />
      <Image  source={require('../assets/images/logo.png')} style={{height:150,width:150,alignSelf:'center'}} />
      <Text style={{marginTop:15,marginLeft:15,fontSize:16,fontWeight:'bold'}}>Rules : ~</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:59, marginHorizontal:15}}>
        <Text style={{color:'#000',fontSize:15}}>Title: Quizing Challenge Mobile Quiz Game

Objective:
The Trivia Challenge Mobile Quiz Game is designed to test players' knowledge across various categories in a fun and competitive environment. Players will answer a series of multiple-choice questions to earn points and climb the leaderboard.

Gameplay:

Registration and Profile:

Players must download the game from the app store and register to create a profile.
Users can customize their profiles with avatars or usernames.
Categories:

The game offers a variety of categories such as General Knowledge, Science, History, Sports, Entertainment, and more.
Players can choose their preferred category before starting a quiz.
Quiz Rounds:

Each quiz consists of a predetermined number of rounds, usually ranging from 5 to 10.
In each round, players are presented with a multiple-choice question related to the chosen category.
Time Limit:

Players have a limited time (e.g., 30 seconds) to answer each question.
The faster the response, the higher the score.
Scoring:

Correct answers earn players points based on their response time.
Incorrect answers result in no points for that particular question.
Power-ups:

Players can earn power-ups by answering a certain number of consecutive questions correctly.
Power-ups may include extra time, skip a question, or double points for a round.
Leaderboard:

The game features a real-time leaderboard showing the top players based on their total points.
Players can compete with friends or globally for the top spot.
Rewards:

Players can earn in-game currency or unlock new avatars and backgrounds as they accumulate points.
Daily challenges or achievements can provide additional rewards.
Lifelines:

Players may have a limited number of lifelines (e.g., ask the audience, eliminate two wrong answers) to use throughout the game.
Social Features:

Players can connect their accounts with social media to challenge friends.
Share achievements or high scores on social platforms.
Offline Mode:

Players can download quizzes for offline play, allowing them to enjoy the game without an internet connection.
Feedback and Improvements:

Players can provide feedback on questions or suggest new categories, enhancing the game's content over time.
Updates:

Regularly update the game with new questions, categories, and features to keep players engaged.
Monetization:

The game may include ads or offer in-app purchases for additional power-ups, avatars, or quiz packs.</Text>
      </ScrollView>
      <Pressable onPress={()=>!rank?router.replace({ pathname: `/quesans`, params: { poolid:data.poolid,model_id:data.model_id } }):router.replace({ pathname: `/rank`, params: { poolid:data.poolid } })} style={styles.buttonView}>
           {!loading? <Text style={styles.title}>{!rank?'Start':'Go to Result'}</Text>  :
           <ActivityIndicator color='#fff' size={'small'} />
           }        
        </Pressable>
    </SafeAreaView>
  )
}

export default start;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Colors.bglight
  },
  buttonView: {
    width:width1-20,
    alignSelf:'center',
    height: height1,
    marginVertical: 10,
    backgroundColor: Colors.backgroundcolor,
    padding: 5,
    borderRadius: 10,
    justifyContent:'center',
    alignItems:'center',
    bottom:0,
    position:'absolute'
  },
  title:{
    textAlign:'center',
    color:'white',
    fontWeight:'600',
    fontSize:20
  }
})