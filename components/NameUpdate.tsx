import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const NameUpdate = ({ visible, onClose, onUpdate }: { visible: boolean; onClose: () => void; onUpdate: (name: string) => void }) => {
  const [username, setUsername] = useState('');

  const handleUpdate = () => {
    if (username.trim()) {
      onUpdate(username);
      setUsername('');
      onClose();
    } else {
      alert('Please enter a valid name.');
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.container}>
            <View style={styles.popup}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Update Name</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Enter your full name</Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. John Doe"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.cancelButton} activeOpacity={0.8}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdate} style={styles.updateButton} activeOpacity={0.8}>
                  <Text style={styles.updateText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'novabold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontFamily: 'novamedium', // Ensure font exists or fallback
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
    fontFamily: 'novaregular',
    backgroundColor: '#F9F9F9',
    color: '#333',
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  updateButton: {
    flex: 1,
    backgroundColor: Colors.primary || '#90AA51', // Fallback
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: Colors.primary || '#90AA51',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelText: {
    color: '#666',
    fontFamily: 'novabold',
    fontSize: 16,
  },
  updateText: {
    color: '#fff',
    fontFamily: 'novabold',
    fontSize: 16,
  },
});

export default NameUpdate;
