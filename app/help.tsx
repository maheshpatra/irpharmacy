// HelpScreen.js

import React,{useState} from 'react';
import { View, Text, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import HeaderAB from '../components/HeaderAB';

const help = () => {

    const [faqItems, setFaqItems] = useState([
        { question: 'How do I reset my password?', answer: 'Navigate to the profile screen and find the "Reset Password" option.' },
        { question: 'How can I contact support?', answer: 'You can contact our support team at support@example.com.' },
        // Add more FAQ items as needed
      ]);

      const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFaqItem = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return (
    <View style={styles.container}>
        <HeaderAB title={'Help'}/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Help and Instructions</Text>

        <Text style={styles.sectionTitle}>Getting Started</Text>
        <Text style={styles.content}>
          Welcome to our app! To get started, follow these steps:
          1. Create an account or log in.
          2. Explore the main features of the app.
          {/* Add more getting started instructions as needed */}
        </Text>

        <Text style={styles.sectionTitle}>Navigating the App</Text>
        <Text style={styles.content}>
          Use the navigation bar at the bottom to switch between screens.
          {/* Add more navigation instructions as needed */}
        </Text>

        <Text style={styles.sectionTitle}>FAQs</Text>
        {faqItems.map((faq, index) => (
          <TouchableOpacity key={index} onPress={() => toggleFaqItem(index)}>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              {expandedIndex === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.content}>
          If you have any questions or issues, feel free to contact our support team at support@example.com.
          {/* Add more contact information or instructions as needed */}
        </Text>

        <Text style={styles.sectionTitle}>Legal & Privacy</Text>
        <Text style={styles.content}>
          Read our Terms of Service and Privacy Policy on our website: www.example.com/legal.
          {/* Add more legal and privacy information as needed */}
        </Text>

        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.content}>
          Learn more about our company and mission on our website: www.example.com/about-us.
          {/* Add more information about your company as needed */}
        </Text>

        {/* Add more sections and content as needed */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    
  },
  scrollContainer: {
    flexGrow: 1,
    padding:16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
  },
  faqItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqAnswer: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default help;
