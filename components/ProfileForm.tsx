import React, { useState } from 'react';
import { View, Text as RNText, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Input } from './ui/input';
import { Text as UIText } from './ui/text';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface ProfileFormProps {
  initialData?: ProfileData;
  onSave: (profileData: ProfileData) => void;
  onCancel: () => void;
}

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  imageUri?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  initialData = { fullName: '', email: '', phoneNumber: '', imageUri: '' },
  onSave, 
  onCancel 
}) => {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<ProfileData>(initialData);
  
  // Handle text input changes
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle image selection
  const handleSelectImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          imageUri: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    onSave(formData);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        
        <RNText style={styles.headerTitle}>Profile</RNText>
        
        <TouchableOpacity onPress={onCancel}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        <View style={styles.formContainer}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <TouchableOpacity 
              style={styles.imagePlaceholder}
              onPress={handleSelectImage}
            >
              {formData.imageUri ? (
                <Image 
                  source={{ uri: formData.imageUri }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.placeholderContent}>
                  <Feather name="image" size={40} color="#888" />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSelectImage}>
              <RNText style={styles.addImageText}>Add an Image</RNText>
            </TouchableOpacity>
          </View>
          
          {/* Full Name */}
          <View style={styles.formGroup}>
            <UIText style={styles.label}>Full Name</UIText>
            <Input
              style={styles.input}
              placeholder="Enter your name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
            />
          </View>
          
          {/* Email */}
          <View style={styles.formGroup}>
            <UIText style={styles.label}>Email</UIText>
            <Input
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
          </View>
          
          {/* Phone Number */}
          <View style={styles.formGroup}>
            <UIText style={styles.label}>Phone Number</UIText>
            <Input
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
            />
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <RNText style={styles.cancelButtonText}>Cancel</RNText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSubmit}
            >
              <RNText style={styles.saveButtonText}>Save Changes</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  addImageText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  saveButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default ProfileForm;
