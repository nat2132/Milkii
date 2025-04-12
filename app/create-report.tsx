import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CreateReportForm from '../components/CreateReportForm';

export default function CreateReportScreen() {
  const insets = useSafeAreaInsets();

  const handleSubmitReport = (data: any) => {
    console.log('Report submitted:', data);
    // Here you would typically save the report to your backend
    // and then navigate back to the reports screen
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <CreateReportForm onSubmit={handleSubmitReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
