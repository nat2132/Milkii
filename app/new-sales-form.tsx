import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { X as XIcon, Save, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Sample product image
const productImage = require('../assets/images/icon.png');

// Interface for product data
interface ProductData {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: any;
}

export default function NewSalesFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scannedData = params.scannedData as string;

  // State for form fields
  const [product, setProduct] = useState<ProductData | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulated product data fetch based on scanned QR code
  useEffect(() => {
    // In a real app, you would fetch product data from your API
    // using the scannedData (product ID from QR code)
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock product data - in a real app, this would come from your API
        const mockProduct: ProductData = {
          id: scannedData || '123456',
          name: '5 mm Nails',
          price: 180.00,
          category: 'Nail',
          stock: 100,
          image: productImage
        };
        
        setProduct(mockProduct);
        calculateTotal(mockProduct.price, parseInt(quantity));
      } catch (error) {
        console.error('Error fetching product:', error);
        Alert.alert('Error', 'Failed to load product information');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [scannedData]);

  // Calculate total price when quantity changes
  const calculateTotal = (price: number, qty: number) => {
    setTotalPrice(price * qty);
  };

  // Handle quantity change
  const handleQuantityChange = (value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setQuantity(value);
      if (product) {
        calculateTotal(product.price, numValue);
      }
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!product) return;
    
    const saleData = {
      productId: product.id,
      productName: product.name,
      quantity: parseInt(quantity),
      unitPrice: product.price,
      totalPrice: totalPrice,
      date: new Date().toISOString(),
    };
    
    // In a real app, you would send this data to your API
    console.log('Sale data:', saleData);
    
    // Show success message and navigate back to sales screen
    Alert.alert(
      'Sale Completed',
      `Successfully added sale for ${product.name}`,
      [
        { 
          text: 'OK', 
          onPress: () => router.push('./sales')
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <XIcon size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Sale</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading product information...</Text>
          </View>
        ) : product ? (
          <>
            {/* Product Information */}
            <View style={styles.productCard}>
              <Image source={product.image || productImage} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.productMeta}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{product.category}</Text>
                  </View>
                  <Text style={styles.productPrice}>{product.price.toFixed(2)} birr</Text>
                </View>
                <Text style={styles.stockInfo}>In stock: {product.stock} units</Text>
              </View>
            </View>
            
            {/* Form Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Product ID</Text>
              <TextInput
                style={styles.input}
                value={product.id}
                editable={false}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Unit Price</Text>
              <TextInput
                style={styles.input}
                value={`${product.price.toFixed(2)} birr`}
                editable={false}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Total Price</Text>
              <TextInput
                style={[styles.input, styles.totalPrice]}
                value={`${totalPrice.toFixed(2)} birr`}
                editable={false}
              />
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <ShoppingBag size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Complete Sale</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load product information</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => router.push('./scanner')}
            >
              <Text style={styles.retryButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  stockInfo: {
    fontSize: 14,
    color: '#666',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  totalPrice: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
