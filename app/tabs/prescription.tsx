import { View, Text, FlatList, StyleSheet,Image } from 'react-native';
import Header from '../../components/Header';
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';

const prescription = () => {
  return (
    <View style={styles.container}>
      <Header title={'Prescriptions'} />
      <View>
        <FlatList
          data={['1', '2', '3']}
          renderItem={() =>

            <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(30), borderBottomWidth:2,borderColor:'#ccc', flexDirection:'row',alignItems:'center'}}>
              <Image style={{height:50,width:50,marginLeft:15}} source={require('../../assets/images/homepage-con.png')} />
              <View style={{marginLeft:10,height:'70%',justifyContent:'space-between'}}>
              <Text style={{fontWeight:'bold',fontSize:responsiveScreenFontSize(2),color:'#333'}}>{'Prescription (Dr sumit kumar)'}</Text>
              <Text>{'22 May 2024'}</Text>
              <View style={{backgroundColor:'#e3f6da',width:responsiveScreenWidth(42),justifyContent:'center',alignItems:'center',height:responsiveScreenWidth(6),borderRadius:10}}>
              <Text style={{}}>{'Digitalize - click to open'}</Text>
              </View>
              
              </View>
            </View>
          }
        />
      </View>
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

