import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import NewDebtEntryForm from '../components/NewDebtEntryForm';

export default function NewDebtScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <NewDebtEntryForm 
        onSave={(debtData) => {
          console.log('Debt data submitted:', debtData);
          // Here you would typically save the debt to your database
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
