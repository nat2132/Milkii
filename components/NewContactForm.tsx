import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface NewContactFormProps {
  onSubmit: (contactData: ContactData) => void;
  onCancel: () => void;
}

interface ContactData {
  name: string;
  phoneNumber: string;
  workType: string;
  company: string;
}

const NewContactForm: React.FC<NewContactFormProps> = ({ onSubmit, onCancel }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<ContactData>({
    name: '',
    phoneNumber: '',
    workType: '',
    company: '',
  });

  const handleInputChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <View style={styles.header}>
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </Button>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Label>New Contact</Label>
        </View>
        <Button variant="ghost" size="icon" onPress={onCancel}>
          <Feather name="x" size={24} color="#000" />
        </Button>
      </View>

      <View style={{ padding: 16, flex: 1 }}>
        <View style={styles.formGroup}>
          <Label>Name</Label>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Feather name="user" size={24} color="#000" />
            </View>
            <Input
              placeholder="Enter name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Label>Phone Number</Label>
          <Input
            placeholder="+2519-123-456"
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Label>Work Type</Label>
          <Input
            placeholder="Enter work type"
            value={formData.workType}
            onChangeText={(value) => handleInputChange('workType', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Label>Company</Label>
          <Input
            placeholder="Enter Company Name"
            value={formData.company}
            onChangeText={(value) => handleInputChange('company', value)}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 'auto', marginBottom: 24 }}>
          <Button variant="outline" style={{ flex: 1 }} onPress={onCancel}>
            Cancel
          </Button>
          <Button
            style={{ flex: 1 }}
            onPress={handleSubmit}
            disabled={!formData.name || !formData.phoneNumber}
          >
            Add Contact
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  formGroup: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    height: 48,
    paddingLeft: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewContactForm;
