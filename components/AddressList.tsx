import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';


const AddressList = ({ visible, onClose, addresses, onSelect, loading }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.addressItem} onPress={() => onSelect(item)}>
      <Text style={styles.recipient}>{item.pname}</Text>
      <Text style={styles.phone}>Phone: {item.usermob}</Text>
      <Text style={styles.address}>
        {item.address}
      </Text>

    </TouchableOpacity>
  );


  useEffect(() => {

  }, [])

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Address</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>
          {loading ?
            <ActivityIndicator size={'small'} color={'green'} />
            :
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No addresses found.</Text>
              }
            />
          }
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'novabold',
  },
  closeButton: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'novabold',
    color: 'green',
  },
  listContainer: {
    paddingBottom: 10,
  },
  addressItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  recipient: {
    fontSize: 16,
    fontFamily: 'novabold',
  },
  phone: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'novaregular',
    marginVertical: 3,
  },
  address: {
    fontSize: 14,
    color: '#333',
    marginVertical: 3,
    fontFamily: 'novaregular'
  },
  addressType: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
    fontFamily: 'novaregular'
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});

export default AddressList;
