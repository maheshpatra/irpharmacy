import { View, Text, StyleSheet } from 'react-native';

const prescription =()=> {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|prescription]</Text>
    </View>
  );
}

export default prescription
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

