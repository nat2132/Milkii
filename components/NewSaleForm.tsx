import React, { useState, useEffect } from 'react';
import { View, Text as RNText, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from './ui/input';
import { Text as UIText } from './ui/text';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NewSaleFormProps {
  onSubmit: (saleData: SaleData) => void;
  onCancel: () => void;
  initialProductId?: string;
}

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

const NewSaleForm: React.FC<NewSaleFormProps> = ({ onSubmit, onCancel, initialProductId }) => {
  const router = useRouter();
  
  // Available units
  const units = ['kg', 'g', 'L', 'mL', 'piece', 'box', 'pack'];
  
  // Available colors
  const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 'Other'];
  
  // Available payment methods
  const paymentMethods = ['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Money'];
  
  // Form state
  const [formData, setFormData] = useState<SaleData>({
    itemName: '',
    pricePerUnit: 0,
    quantity: 0,
    unit: 'kg',
    discount: 0,
    color: '',
    vat: 15, // Default VAT rate
    paymentMethod: '',
    totalPrice: 0
  });

  // Fetch product details if initialProductId is provided
  useEffect(() => {
    if (initialProductId) {
      // In a real app, you would fetch product details from your Django backend
      // Example:
      // const fetchProductDetails = async () => {
      //   try {
      //     const response = await fetch(`https://your-api.com/products/${initialProductId}`);
      //     if (response.ok) {
      //       const product = await response.json();
      //       setFormData(prev => ({
      //         ...prev,
      //         itemName: product.name,
      //         pricePerUnit: product.price,
      //         // Set other fields as needed
      //       }));
      //     }
      //   } catch (error) {
      //     console.error('Error fetching product details:', error);
      //   }
      // };
      // fetchProductDetails();

      // For now, just set a placeholder name with the scanned ID
      setFormData(prev => ({
        ...prev,
        itemName: `Product (ID: ${initialProductId})`,
      }));
    }
  }, [initialProductId]);
  
  // Unit dropdown state
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  
  // Color dropdown state
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  
  // Payment method dropdown state
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  
  // Calculate total price whenever relevant fields change
  useEffect(() => {
    const subtotal = formData.pricePerUnit * formData.quantity;
    const discountAmount = formData.discount || 0;
    const vatAmount = subtotal * (formData.vat / 100);
    const total = subtotal - discountAmount + vatAmount;
    
    setFormData(prev => ({
      ...prev,
      totalPrice: parseFloat(total.toFixed(2))
    }));
  }, [formData.pricePerUnit, formData.quantity, formData.discount, formData.vat]);
  
  // Handle text input changes
  const handleInputChange = (field: keyof SaleData, value: string) => {
    let parsedValue: string | number = value;
    
    // Parse numeric fields
    if (['pricePerUnit', 'quantity', 'discount', 'vat'].includes(field)) {
      parsedValue = value === '' ? 0 : parseFloat(value);
      
      // Ensure non-negative values
      if (parsedValue < 0) parsedValue = 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };
  
  // Handle unit selection
  const handleUnitSelect = (unit: string) => {
    setFormData(prev => ({
      ...prev,
      unit
    }));
    setShowUnitDropdown(false);
  };
  
  // Handle color selection
  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
    setShowColorDropdown(false);
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
    setShowPaymentMethodDropdown(false);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    onSubmit(formData);
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
        
        <RNText style={styles.headerTitle}>New Sale</RNText>
        
        <TouchableOpacity onPress={onCancel}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.formContainer}>
        {/* Item Name */}
        <View style={styles.formGroup}>
          <UIText style={styles.label}>Item Name</UIText>
          <Input
            style={styles.input}
            placeholder="Enter item name"
            value={formData.itemName}
            onChangeText={(value) => handleInputChange('itemName', value)}
          />
        </View>
        
        {/* Price per Unit */}
        <View style={styles.formGroup}>
          <UIText style={styles.label}>Price per Unit</UIText>
          <Input
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={formData.pricePerUnit === 0 ? '' : formData.pricePerUnit.toString()}
            onChangeText={(value) => handleInputChange('pricePerUnit', value)}
          />
        </View>
        
        {/* Quantity and Unit */}
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <UIText style={styles.label}>Quantity</UIText>
            <Input
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={formData.quantity === 0 ? '' : formData.quantity.toString()}
              onChangeText={(value) => handleInputChange('quantity', value)}
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <UIText style={styles.label}>Unit</UIText>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowUnitDropdown(!showUnitDropdown)}
            >
              <RNText style={styles.dropdownButtonText}>{formData.unit}</RNText>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            
            {showUnitDropdown && (
              <View style={styles.dropdown}>
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={styles.dropdownItem}
                    onPress={() => handleUnitSelect(unit)}
                  >
                    <RNText style={styles.dropdownItemText}>{unit}</RNText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        
        {/* Discount */}
        <View style={styles.formGroup}>
          <UIText style={styles.label}>Discount (Birr)</UIText>
          <Input
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={formData.discount === 0 ? '' : formData.discount.toString()}
            onChangeText={(value) => handleInputChange('discount', value)}
          />
        </View>
        
        {/* Color */}
        <View style={styles.formGroup}>
          <UIText style={styles.label}>Color</UIText>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowColorDropdown(!showColorDropdown)}
          >
            <RNText style={styles.dropdownButtonText}>
              {formData.color || 'Select color'}
            </RNText>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          
          {showColorDropdown && (
            <View style={styles.dropdown}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={styles.dropdownItem}
                  onPress={() => handleColorSelect(color)}
                >
                  <RNText style={styles.dropdownItemText}>{color}</RNText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {/* VAT */}
        <View style={styles.formGroup}>
          <UIText style={styles.label}>VAT</UIText>
          <Input
            style={styles.input}
            placeholder="15"
            keyboardType="numeric"
            value={formData.vat.toString()}
            onChangeText={(value) => handleInputChange('vat', value)}
          />
        </View>
        
        {/* Payment Method */}
        <View style={styles.formGroup}>
          <UIText style={styles.label}>Payment Method</UIText>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
          >
            <RNText style={styles.dropdownButtonText}>
              {formData.paymentMethod || 'Select payment Method'}
            </RNText>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          
          {showPaymentMethodDropdown && (
            <View style={styles.dropdown}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method}
                  style={styles.dropdownItem}
                  onPress={() => handlePaymentMethodSelect(method)}
                >
                  <RNText style={styles.dropdownItemText}>{method}</RNText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {/* Total Price */}
        <View style={styles.totalPriceContainer}>
          <RNText style={styles.totalPriceLabel}>Total Price (Birr)</RNText>
          <View style={styles.totalPriceValueContainer}>
            <RNText style={styles.totalPriceValue}>{formData.totalPrice.toFixed(2)}</RNText>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <RNText style={styles.cancelButtonText}>Cancel</RNText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleSubmit}
            disabled={!formData.itemName || formData.quantity <= 0 || formData.pricePerUnit <= 0}
          >
            <RNText style={styles.addButtonText}>Add Item</RNText>
          </TouchableOpacity>
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
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  dropdownButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  totalPriceContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  totalPriceValueContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  addButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default NewSaleForm;
