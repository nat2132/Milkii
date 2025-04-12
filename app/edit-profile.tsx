import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import ProfileForm from '../components/ProfileForm';

export default function EditProfileScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileForm 
        initialData={{
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+251912345678',
          imageUri: ''
        }}
        onSave={(profileData) => {
          console.log('Profile data submitted:', profileData);
          // Here you would typically save the profile data to your database
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
