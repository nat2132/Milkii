import React, { useState } from 'react';
import { View, Text as RNText, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Input } from './ui/input';
import { Text as UIText } from './ui/text';

interface DebtItem {
  id: string;
  name: string;
  quantity: number;
}

interface NewDebtEntryFormProps {
  onSave: (debtData: DebtData) => void;
  onCancel: () => void;
}

interface DebtData {
  customerName: string;
  phoneNumber: string;
  items: DebtItem[];
  paymentMethod: string;
  dueDate: string;
}

const NewDebtEntryForm: React.FC<NewDebtEntryFormProps> = ({ onSave, onCancel }) => {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<DebtData>({
    customerName: '',
    phoneNumber: '',
    items: [],
    paymentMethod: 'Cash',
    dueDate: '',
  });
  
  // State for new item being added
  const [newItemName, setNewItemName] = useState('');
  
  // Generate unique ID for items
  const generateId = () => `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Add a new item to the list
  const addItem = () => {
    if (newItemName.trim()) {
      const newItem: DebtItem = {
        id: generateId(),
        name: newItemName.trim(),
        quantity: 1,
      };
      
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      
      setNewItemName('');
    }
  };
  
  // Update item quantity
  const updateItemQuantity = (id: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  };
  
  // Edit item
  const editItem = (id: string) => {
    // This would typically open a modal or navigate to edit the item
    console.log('Edit item', id);
  };
  
  // Delete item
  const deleteItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };
  
  // Handle text input changes
  const handleInputChange = (field: keyof DebtData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        
        <RNText style={styles.headerTitle}>New Debt Entry</RNText>
        
        <TouchableOpacity onPress={onCancel}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Customer Name */}
          <View style={styles.formGroup}>
            <UIText style={styles.label}>Customer Name</UIText>
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Feather name="user" size={24} color="#000" />
              </View>
              <Input
                style={styles.inputWithIcon}
                placeholder="Enter name"
                value={formData.customerName}
                onChangeText={(value) => handleInputChange('customerName', value)}
              />
            </View>
          </View>
          
          {/* Phone Number */}
          <View style={styles.formGroup}>
            <UIText style={styles.label}>Phone Number</UIText>
            <Input
              style={styles.input}
              placeholder="+2519-123-456"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
            />
          </View>
          
          {/* Items Taken */}
          <View style={styles.formGroup}>
            <RNText style={styles.label}>Items Taken</RNText>
            <View style={styles.itemsContainer}>
              {/* List of items */}
              {formData.items.map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <RNText style={styles.itemName}>{item.name}</RNText>
                  
                  <View style={styles.itemActions}>
                    <Input
                      style={styles.quantityInput}
                      keyboardType="numeric"
                      value={String(item.quantity)}
                      onChangeText={(value) => {
                        const quantity = parseInt(value) || 1;
                        updateItemQuantity(item.id, quantity);
                      }}
                    />
                    
                    <TouchableOpacity 
                      style={styles.itemButton}
                      onPress={() => editItem(item.id)}
                    >
                      <Feather name="edit" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.itemButton}
                      onPress={() => deleteItem(item.id)}
                    >
                      <Feather name="trash-2" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              
              {/* Add new item button */}
              <TouchableOpacity 
                style={styles.addItemButton}
                onPress={() => router.push({
                  pathname: '/add-debt-item',
                  params: { customerName: formData.customerName }
                })}
              >
                <Feather name="plus" size={20} color="#000" />
                <RNText style={styles.addItemText}>Add Item</RNText>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Payment Method */}
          <View style={styles.formGroup}>
            <RNText style={styles.label}>Payment Method</RNText>
            <TouchableOpacity style={styles.dropdownButton}>
              <RNText style={styles.dropdownButtonText}>{formData.paymentMethod}</RNText>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
          </View>
          
          {/* Due Date */}
          <View style={styles.formGroup}>
            <UIText style={styles.label}>Due Date</UIText>
            <View style={styles.dateInputContainer}>
              <Input
                style={styles.dateInput}
                placeholder="mm/dd/yy"
                value={formData.dueDate}
                onChangeText={(value) => handleInputChange('dueDate', value)}
              />
              <TouchableOpacity style={styles.calendarButton}>
                <Feather name="calendar" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <UIText style={styles.cancelButtonText}>Cancel</UIText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSubmit}
              disabled={!formData.customerName || formData.items.length === 0}
            >
              <UIText style={styles.saveButtonText}>Save Debt Record</UIText>
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputWithIcon: {
    height: 48,
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 8,
  },
  itemsContainer: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemName: {
    fontSize: 16,
    color: '#000000',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    width: 50,
    height: 36,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    textAlign: 'center',
    marginRight: 8,
  },
  itemButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  addItemText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  dropdownButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    height: 48,
  },
  dateInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  calendarButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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

export default NewDebtEntryForm;
