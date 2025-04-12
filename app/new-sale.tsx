import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NewSaleForm from '../components/NewSaleForm';

// Import the SaleData interface directly
interface SaleData {
  itemName: string;
  pricePerUnit: number;
  quantity: number;
  unit: string;
  discount: number;
  color: string;
  vat: number;
  paymentMethod: string;
  totalPrice: number;
}

export default function NewSaleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scannedData = params.scannedData as string;

  // Handle form submission
  const handleSubmit = async (saleData: SaleData) => {
    try {
      // In a real app, you would send this data to your Django backend
      // Example API call:
      // const response = await fetch('https://your-api.com/sales/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...saleData,
      //     productId: scannedData,
      //     date: new Date().toISOString()
      //   }),
      // });
      
      // if (!response.ok) throw new Error('Failed to create sale');
      
      // Show success message
      Alert.alert(
        'Sale Completed',
        `Successfully added sale for ${saleData.itemName}`,
        [
          { 
            text: 'OK', 
            onPress: () => router.push('./sales')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating sale:', error);
      Alert.alert('Error', 'Failed to create sale. Please try again.');
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <NewSaleForm 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
        initialProductId={scannedData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
