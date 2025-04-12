import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import NewContactForm from '../components/NewContactForm';

export default function NewContactScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <NewContactForm 
        onSubmit={(contactData) => {
          console.log('Contact data submitted:', contactData);
          // Here you would typically save the contact to your database
          router.back();
        }}
        onCancel={() => {
          // Navigate back when canceled
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
