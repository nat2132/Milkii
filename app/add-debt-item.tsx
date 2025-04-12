import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import AddItemToDebtForm from '../components/AddItemToDebtForm';

export default function AddDebtItemScreen() {
  const router = useRouter();
  const { customerName } = useLocalSearchParams<{ customerName: string }>();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <AddItemToDebtForm 
        customerName={customerName || 'Customer'}
        onSave={(itemData) => {
          console.log('Item data submitted:', itemData);
          // Here you would typically pass the item back to the previous screen
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
