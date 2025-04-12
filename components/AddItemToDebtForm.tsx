import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  type Option,
} from './ui/select';

interface AddItemToDebtFormProps {
  customerName: string;
  onSave: (itemData: DebtItemData) => void;
  onCancel: () => void;
}

interface DebtItemData {
  name: string;
  quantity: number;
  unit: Option;
  discount: number;
  color: string;
  vat: string;
  pricePerUnit: number;
  totalPrice: number;
}

const AddItemToDebtForm: React.FC<AddItemToDebtFormProps> = ({
  customerName,
  onSave,
  onCancel,
}) => {
  const router = useRouter();

  const unitOptions: Option[] = [
    { value: 'kg', label: 'kg' },
    { value: 'g', label: 'g' },
    { value: 'L', label: 'L' },
    { value: 'mL', label: 'mL' },
    { value: 'piece', label: 'piece' },
    { value: 'box', label: 'box' },
    { value: 'pack', label: 'pack' },
  ];

  const [formData, setFormData] = useState<DebtItemData>({
    name: '',
    quantity: 1,
    unit: unitOptions[0],
    discount: 0,
    color: 'Green',
    vat: '15%',
    pricePerUnit: 0,
    totalPrice: 0,
  });

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.quantity, formData.pricePerUnit, formData.discount, formData.vat]);

  const calculateTotalPrice = () => {
    const subtotal = formData.quantity * formData.pricePerUnit;
    const discountAmount = formData.discount || 0;
    const vatRate = parseFloat(formData.vat) / 100 || 0;

    const afterDiscount = subtotal - discountAmount;
    const withVat = afterDiscount * (1 + vatRate);

    setFormData(prev => ({
      ...prev,
      totalPrice: Math.round(withVat * 100) / 100,
    }));
  };

  const handleInputChange = (field: keyof DebtItemData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuantityChange = (increment: number) => {
    const newQuantity = Math.max(1, formData.quantity + increment);
    handleInputChange('quantity', newQuantity);
  };

  const handleSelect = (field: keyof DebtItemData, option: Option) => {
    setFormData(prev => ({ ...prev, [field]: option }));
  };

  const handleSubmit = () => {
    onSave(formData);
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
          <Label>New Debt Entry</Label>
        </View>
        <Button variant="ghost" size="icon" onPress={onCancel}>
          <Feather name="x" size={24} color="#000" />
        </Button>
      </View>

      <ScrollView style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={24} color="#000" />
          </View>
          <Label>{customerName}</Label>
        </View>

        <View style={styles.formGroup}>
          <Label>Item Name</Label>
          <Input
            placeholder="Enter item name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Label>Quantity</Label>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Button variant="outline" size="icon" onPress={() => handleQuantityChange(-1)}>
                <Feather name="minus" size={20} color="#000" />
              </Button>
              <Input
                keyboardType="numeric"
                value={formData.quantity.toString()}
                onChangeText={(value) => {
                  const quantity = parseInt(value) || 1;
                  handleInputChange('quantity', quantity);
                }}
                style={{ flex: 1, textAlign: 'center' }}
              />
              <Button variant="outline" size="icon" onPress={() => handleQuantityChange(1)}>
                <Feather name="plus" size={20} color="#000" />
              </Button>
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Label>Unit</Label>
            <Select
              value={formData.unit}
              onValueChange={(option) => handleSelect('unit', option)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value} label={unit.label}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Label>Discount (Birr)</Label>
          <Input
            placeholder="0.00"
            keyboardType="numeric"
            value={formData.discount.toString()}
            onChangeText={(value) => {
              const discount = parseFloat(value) || 0;
              handleInputChange('discount', discount);
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Label>Color</Label>
          <Input
            placeholder="Green"
            value={formData.color}
            onChangeText={(value) => handleInputChange('color', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Label>VAT</Label>
          <Input
            placeholder="15%"
            value={formData.vat}
            onChangeText={(value) => handleInputChange('vat', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Label>Price per Unit</Label>
          <Input
            placeholder="0.00"
            keyboardType="numeric"
            value={formData.pricePerUnit.toString()}
            onChangeText={(value) => {
              const price = parseFloat(value) || 0;
              handleInputChange('pricePerUnit', price);
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Label>Total Price (Birr)</Label>
          <View style={styles.totalPriceContainer}>
            <Label>{formData.totalPrice.toFixed(2)}</Label>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 48 }}>
          <Button variant="outline" style={{ flex: 1 }} onPress={onCancel}>
            Cancel
          </Button>
          <Button
            style={{ flex: 1 }}
            onPress={handleSubmit}
            disabled={!formData.name || formData.pricePerUnit <= 0}
          >
            Save Entry
          </Button>
        </View>
      </ScrollView>
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
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  totalPriceContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
});

export default AddItemToDebtForm;
