import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Dimensions,
  Alert, BackHandler
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { path } from "../components/server";
import { _retrieveData } from "../local_storage";
const width1 = Dimensions.get("window").width;
const height1 = Dimensions.get("window").height / 15;
const QuesAns = () => {

  // const questions = [
  //   { 
  //     id: 1,
  //     question: 'What is the capital of France?',
  //     options: ['London', 'Paris', 'Berlin', 'Madrid'],
  //     correctAnswer: 'Paris'
  //   },
  //   {
  //     id: 2,
  //     question: 'Which planet is known as the Red Planet?',
  //     options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
  //     correctAnswer: 'Mars'
  //   },
  //   {
  //     id: 3,
  //     question: 'Who painted the Mona Lisa?',
  //     options: ['Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Michelangelo'],
  //     correctAnswer: 'Leonardo da Vinci'
  //   },
  //   {
  //     id: 4,
  //     question: 'What is the largest mammal in the world?',
  //     options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
  //     correctAnswer: 'Blue Whale'
  //   },
  //   {
  //     id: 5,
  //     question: 'Who wrote "To Kill a Mockingbird"?',
  //     options: ['Harper Lee', 'Mark Twain', 'F. Scott Fitzgerald', 'Ernest Hemingway'],
  //     correctAnswer: 'Harper Lee'
  //   },
  //   {
  //     id: 6,
  //     question: 'What is the chemical symbol for water?',
  //     options: ['H2O', 'CO2', 'O2', 'H2SO4'],
  //     correctAnswer: 'H2O'
  //   },
  //   {
  //     id: 7,
  //     question: 'Which country is famous for its tulips?',
  //     options: ['Italy', 'Netherlands', 'France', 'Germany'],
  //     correctAnswer: 'Netherlands'
  //   },
  //   {
  //     id: 8,
  //     question: 'What is the largest organ in the human body?',
  //     options: ['Heart', 'Skin', 'Liver', 'Brain'],
  //     correctAnswer: 'Skin'
  //   },
  //   {
  //     id: 9,
  //     question: 'Who invented the telephone?',
  //     options: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Albert Einstein'],
  //     correctAnswer: 'Alexander Graham Bell'
  //   },
  //   {
  //     id: 10,
  //     question: 'What is the national flower of Japan?',
  //     options: ['Rose', 'Tulip', 'Cherry Blossom', 'Lily'],
  //     correctAnswer: 'Cherry Blossom'
  //   },
  //   {
  //     id: 11,
  //     question: 'Which gas do plants use to make food?',
  //     options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Helium'],
  //     correctAnswer: 'Carbon Dioxide'
  //   },
  //   {
  //     id: 12,
  //     question: 'Who discovered penicillin?',
  //     options: ['Marie Curie', 'Alexander Fleming', 'Louis Pasteur', 'Albert Einstein'],
  //     correctAnswer: 'Alexander Fleming'
  //   },
  //   {
  //     id: 13,
  //     question: 'What is the tallest mountain in the world?',
  //     options: ['Mount Kilimanjaro', 'Mount Everest', 'Mount Fuji', 'Mount McKinley'],
  //     correctAnswer: 'Mount Everest'
  //   },
  //   {
  //     id: 14,
  //     question: 'What is the currency of Brazil?',
  //     options: ['Euro', 'Peso', 'Real', 'Yen'],
  //     correctAnswer: 'Real'
  //   },
  //   {
  //     id: 15,
  //     question: 'What is the main ingredient in guacamole?',
  //     options: ['Tomato', 'Avocado', 'Onion', 'Cilantro'],
  //     correctAnswer: 'Avocado'
  //   },
  //   {
  //     id: 16,
  //     question: 'What is the hardest natural substance on Earth?',
  //     options: ['Gold', 'Diamond', 'Platinum', 'Silver'],
  //     correctAnswer: 'Diamond'
  //   },
  //   {
  //     id: 17,
  //     question: 'Which planet is known as the "Morning Star"?',
  //     options: ['Mercury', 'Venus', 'Mars', 'Saturn'],
  //     correctAnswer: 'Venus'
  //   },
  //   {
  //     id: 18,
  //     question: 'What is the chemical symbol for gold?',
  //     options: ['Ag', 'Au', 'Fe', 'Cu'],
  //     correctAnswer: 'Au'
  //   },
  //   { 
  //     id: 19,
  //     question: 'What is the largest ocean on Earth?',
  //     options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
  //     correctAnswer: 'Pacific Ocean'
  //   },
  //   {
  //     id: 20,
  //     question: 'What is the diameter of Earth?',
  //     options: ['12,742 kilometers', '10,000 kilometers', '15,000 kilometers', '8,000 kilometers'],
  //     correctAnswer: '12,742 kilometers'
  //   },
  // ];



  const [timer, setTimer] = useState(0); // Initial timer value in seconds (20 minutes and 3 seconds)
  const [selectedOption, setSelectedOption] = useState(null) // Track the selected option
  const [review, setreView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [questionNumber, setquestionNumber] = useState();
  const [questionindex, setquestionindex] = useState(0);
  const poolid = useLocalSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestion] = useState([]);
  const [userAnswers, setUserAnswers] = useState(new Array(questions.length).fill(''));
  // const [userAnswers, setUserAnswers] = useState(new Array(quizData.length).fill(''));
  const correct = [2, 0, 3, 1, 2, 2, 9, 2, 2, 2, 2, 1, 0, 3, 1, 1, 1, 1, 2, 3]
  const handleAnswer = (option, index) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleNextQuestion = (time) => {
    console.log(questions.length,currentQuestion)
    if( questions.length == (currentQuestion+1) ){
      calculateScore()
      // router.replace('/rank')
    }else{
      setCurrentQuestion(currentQuestion + 1);
    setTimer(time)
      
    }
  };

  useEffect(() => {

    _retrieveData("USER_DATA").then((userdata) => {
      console.log(userdata);
      if (userdata && userdata !== 'error') {
        setUser(userdata.mobile)
        getQuestion()
      }

    });
  }, [])
  // console.log(poolid)

  const getQuestion = async() =>{
    setLoading(true)
    
    try {
      const req = await fetch(path + "question.php?case=get_question_by_subject_id&id="+poolid.model_id)
      let res = await req.json();
      console.log(res)
      setLoading(false)
      if(!res.error){
        setTimer(res.data[0].time)
        setQuestion(res.data)
      }else{
        Alert.alert('Question Error',res.message)
      }
   } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }
  

  }



  const handlePreviousQuestion = () => {
    if(currentQuestion==0){
      Alert.alert('Question','First Question');
     return;
    }
    setCurrentQuestion(currentQuestion - 1);
  };
  const calculateScore = async() => {
    let score = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        score += 1; // Each correct answer gives 2 points
      }
    });
    setreView(true)
    const fd = new FormData();
    fd.append("case", 'scoreupdate')
    fd.append("poolid", poolid.poolid)
    fd.append("score", score)
    fd.append("user_ans", userAnswers)
    fd.append("mobile", user)
    try {
      const req = await fetch(path + "rank.php", {
        body: fd,
        method: 'post'
      })
      let res = await req.json();
      console.log(res)
      setLoading(false)
      if(!res.error){
        Alert.alert('Sucessfull',res.message,[
          {
            text: 'Ok',
            onPress: () => router.replace({ pathname: `/rank`, params: { poolid:poolid.poolid } }),
            style: 'cancel',
          },
        ])
        
      }else{
        Alert.alert('Error',res.message)
        router.replace('/rank')
      }

    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }

     





    // alert(`Your score is: ${score}/${questions.length * 2}`);
  };

  const renderOptions = (options) => {
    return options.map((option, index) => (
      <Pressable
        style={{ backgroundColor: userAnswers[currentQuestion] === option ? Colors.primary :null, height: 50, width: '85%', borderRadius: 10, borderWidth: 1.8, alignItems: 'center', borderColor: '#fff', alignSelf: 'center', marginBottom: 20, justifyContent: 'center' }}
        onPress={() => handleAnswer(option,index) }
      >
        <Text style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#fff",
          textAlign: "center",
        }}>{option}</Text>
      </Pressable>
    ));
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          handleNextQuestion()
          // setTimer(150)
          // Perform any action when the timer reaches 0 (if needed)
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000); // Update timer every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [timer]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")} : ${seconds
      .toString()
      .padStart(2, "0")}`;
  };





  useEffect(() => {
    const backAction = () => {
      console.log(userAnswers)
      Alert.alert('Hold on!', 'Are you sure you want to Exit this Quiz?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => router.back() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      {questions.length > 0 && <View style={styles.topRight}>
        <MaterialCommunityIcons
          size={25}
          name="timer-outline"
          color={"white"}
          style={{ marginRight: 5 }}
        />
        <Text style={[styles.smalltitle, { fontSize: 20, fontWeight: 'bold' }]}>{formatTime(timer)}</Text>
      </View>}
      {/* {review &&<View style={styles.topLeft}>
       
        <Text style={[styles.smalltitle, { fontSize: 20, fontWeight: 'bold' }]}>Review Answars</Text>
      </View>} */}
    {questions.length > 0 &&<Text style={styles.smalltitle}>Question {currentQuestion+1} out of {questions.length}</Text>}
      {questions.length > 0 &&<Text style={styles.bigtitle}>
      {questions[currentQuestion].question}
      </Text>}
      {questions.length > 0 && renderOptions(questions[currentQuestion].options)}



      {/* {currentQuestion >= 0 && currentQuestion !== questions.length && <Pressable style={styles.prevBut}
        onPress={handlePreviousQuestion}
      >
        <AntDesign name="arrowleft" size={24} color={'white'} />
        <Text style={[styles.anstitle, { color: 'white', marginLeft: 5 }]}>Previous</Text>

      </Pressable>} */}



      {questions.length > 0 && userAnswers[currentQuestion] !== null && currentQuestion !== questions.length-1 &&<Pressable style={styles.continueButton}
        onPress={()=>handleNextQuestion(questions[currentQuestion].time)}
      >
        <Text style={[styles.anstitle, { color: 'white', marginRight: 5 }]}>{currentQuestion === questions.length - 1 ? "Finish" : "Next"}</Text>
        <AntDesign name="arrowright" size={24} color={'white'} />
      </Pressable>}
      {questions.length > 0 && currentQuestion == questions.length-1 &&  <Pressable style={styles.submitbtn}
        onPress={() => {
          // router.replace('/rank')
          console.log(userAnswers)
          
          calculateScore()
        }}
      >
        <Text style={[styles.anstitle, { color: 'white', marginRight: 5 }]}>Submit</Text>

      </Pressable>}

    </SafeAreaView>
  );
};

export default QuesAns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundcolor,
  },
  smalltitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "white",
    textAlign: "center",
  },
  bigtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginVertical: 30,
    marginHorizontal: 10,
  },
  buttonView: {
    width: width1 - 40,
    height: height1,
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  anstitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2f95dc",
    textAlign: "center",
  },
  topRight: {
    position: "absolute",
    top: 0,
    right: 0,
    alignSelf: "flex-start",
    paddingTop: 50,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    // marginRight:5
  },
  topLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    alignSelf: "flex-start",
    paddingTop: 50,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    // marginRight:5
  },
  continueButton: {
    position: "absolute",

    bottom: 15,
    right: 20,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: 'row',

  },
  prevBut: {
    position: "absolute",

    bottom: 15,
    left: 20,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: 'row',

  },
  submitbtn: {
    position: "absolute",

    bottom: 15,
    backgroundColor: Colors.primary, paddingHorizontal: 20,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: 'row',

  },
});
