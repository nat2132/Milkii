import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { useInventoryStore } from '../stores/useInventoryStore';
import ProductDetailView from '../components/ProductDetailView';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const item = useInventoryStore((state) =>
    state.pendingStocks.concat(state.inventoryList).find((i) => i.id === itemId)
  );
  const deleteItem = useInventoryStore((state) => state.deleteItem);

  if (!item) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Product Details' }} />
        <View style={styles.centered}>
          <QRCode value={'Item not found'} size={200} />
        </View>
      </View>
    );
  }

  const handleEdit = () => {
    router.push({
      pathname: '/add-item',
      params: {
        mode: 'edit',
        itemId: item.id,
        itemName: item.itemName,
        itemCategory: item.itemCategory,
        quantity: item.quantity.toString(),
        unit: item.unit ?? '',
        itemPerPack: item.itemPerPack?.toString() ?? '',
        itemPerPackUnit: item.itemPerPackUnit ?? '',
        companyName: item.companyName,
        color: item.color ?? '',
        purchasedPrice: item.purchasedPrice.toString(),
        sellingPrice: item.sellingPrice.toString(),
        quality: item.quality ?? '',
        description: item.description,
        specifications: item.specifications,
        imageUri: item.imageUri ?? '',
      },
    });
  };

  const handleDelete = () => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteItem(item.id);
          router.back();
        },
      },
    ]);
  };

  // Placeholder function for saving QR code
  const handleSaveQr = () => {
    // TODO: Implement actual QR code saving logic (e.g., using react-native-view-shot)
    Alert.alert('Save QR', 'Save functionality not yet implemented.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: item.itemName }} />

      <ProductDetailView
        name={item.itemName}
        category={item.itemCategory}
        purchasedPrice={item.purchasedPrice}
        sellingPrice={item.sellingPrice}
        quantity={item.quantity}
        unit={item.unit}
        company={item.companyName}
        // Pass the correct array props
        colors={item.colors}
        specificationsList={item.specificationsList}
        // Pass props needed for dynamic labels and conditional display
        sellingQuantity={item.sellingQuantity}
        sellingUnit={item.sellingUnit}
        quantityPerPack={item.itemPerPack} // Pass itemPerPack as quantityPerPack
        itemPerPackUnit={item.itemPerPackUnit} // Pass itemPerPackUnit
        description={item.description}
        lastUpdated={item.addedAt.toLocaleString()}
        imageUrl={item.imageUri}
        onEdit={handleEdit}
        onDelete={handleDelete}
        // Pass QR data and save handler
        qrData={item.qrData}
        onSaveQr={handleSaveQr}
        // Ensure imageUri is correctly retrieved and displayed
        imageUrls={item.imageUris} // Pass the array of image URIs
      />

      {/* QR Code is now rendered inside ProductDetailView, remove from here */}
      {/* <View style={styles.qrContainer}>
        <QRCode value={item.qrData} size={200} />
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
