import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ProductDetailView from './ProductDetailView';

const ProductDetailViewExample = () => {
  // Sample data for the green paint product
  const greenPaintData = {
    name: 'Green Paint',
    category: 'Paint',
    purchasedPrice: 900.00,
    sellingPrice: 950.00,
    quantity: 1,
    unit: 'gallon',
    company: 'Rodas Inc.',
    color: 'Green',
    description: 'A high-quality eco-friendly green paint designed for interior and exterior applications. Provides a smooth, durable finish with excellent coverage and long-lasting color vibrancy. Ideal for home, office, and commercial spaces.',
    specifications: [
      { label: 'Base Type', value: 'Water-based' },
      { label: 'Drying Time', value: 'Touch dry in 1-2 hours, full cure in 24 hours' },
      { label: 'Durability', value: 'Resistant to stains, moisture, and UV rays' },
      { label: 'Packaging', value: 'Available in 1L, 5L, and 10L containers' },
    ],
    lastUpdated: 'March 15, 2025 14:30',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZW4lMjBwYWludHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    onEdit: () => console.log('Edit button pressed'),
    onDelete: () => console.log('Delete button pressed'),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProductDetailView {...greenPaintData} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});

export default ProductDetailViewExample;
