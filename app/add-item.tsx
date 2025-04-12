import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import AddNewItemForm from '../components/AddNewItemForm';
import { useInventoryStore, InventoryItem } from '../stores/useInventoryStore';
import { v4 as uuidv4 } from 'uuid';

const validateImageUri = async (uri: string): Promise<boolean> => {
  try {
    await Image.prefetch(uri); // Check if the image can be loaded
    return true;
  } catch {
    return false;
  }
};

const validateImageUris = async (uris: string[]): Promise<string[]> => {
  const validUris: string[] = [];
  for (const uri of uris) {
    if (await validateImageUri(uri)) {
      validUris.push(uri);
    }
  }
  return validUris;
};

export default function AddItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const addPendingItem = useInventoryStore((state) => state.addPendingItem);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const getItemById = (id: string): InventoryItem | undefined => {
    const state = useInventoryStore.getState();
    return state.inventoryList.find(i => i.id === id) || state.pendingStocks.find(i => i.id === id);
  };
  const isEditMode = params.mode === 'edit';

  const normalizeParam = (param: unknown): string | undefined => {
    if (Array.isArray(param)) {
      return param[0] ?? undefined;
    }
    if (typeof param === 'string') {
      return param;
    }
    return undefined;
  };

  const itemId = normalizeParam(params.itemId);
  const itemToEdit = itemId ? getItemById(itemId) : undefined;

  const initialValues = isEditMode && itemToEdit
    ? {
        ...itemToEdit,
        quantity: itemToEdit.quantity,
        purchasedPrice: itemToEdit.purchasedPrice,
        sellingPrice: itemToEdit.sellingPrice,
        sellingQuantity: itemToEdit.sellingQuantity,
        howMuchInOneBox: itemToEdit.howMuchInOneBox,
        itemPerPack: itemToEdit.itemPerPack,
      }
    : undefined;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <AddNewItemForm
        initialValues={initialValues}
        formTitle={isEditMode ? 'Edit an item' : 'Add New Item'}
        onSubmit={async (formDataFromComponent) => {
          const colorsData = formDataFromComponent.colors as { name: string; quantity: number; code: string; }[] | undefined;
          const specsData = formDataFromComponent.specificationsList as { title: string; description: string; }[] | undefined;
          const validImageUris = formDataFromComponent.imageUris
            ? await validateImageUris(formDataFromComponent.imageUris)
            : [];

          if (isEditMode && itemToEdit) {
            const updatedItem: InventoryItem = {
              ...itemToEdit,
              ...formDataFromComponent,
              id: itemToEdit.id,
              colors: colorsData,
              specificationsList: specsData,
              color: undefined,
              specifications: '',
              qrData: JSON.stringify({
                id: itemToEdit.id,
                ...formDataFromComponent,
                colors: colorsData,
                specificationsList: specsData,
              }),
              addedAt: new Date(),
              status: itemToEdit.status,
              imageUris: validImageUris,
            };
            updateItem(updatedItem);
          } else {
            const id = uuidv4();
            const qrDataContent = {
              id,
              ...formDataFromComponent,
              colors: colorsData,
              specificationsList: specsData,
            };
            const qrData = JSON.stringify(qrDataContent);

            const newItem: InventoryItem = {
              id,
              itemName: formDataFromComponent.itemName ?? '',
              itemCategory: formDataFromComponent.itemCategory ?? '',
              quantity: formDataFromComponent.quantity ?? 0,
              unit: formDataFromComponent.unit,
              itemPerPack: formDataFromComponent.itemPerPack,
              itemPerPackUnit: formDataFromComponent.itemPerPackUnit,
              companyName: formDataFromComponent.companyName ?? '',
              purchasedPrice: formDataFromComponent.purchasedPrice ?? 0,
              sellingPrice: formDataFromComponent.sellingPrice ?? 0,
              quality: formDataFromComponent.quality,
              description: formDataFromComponent.description ?? '',
              imageUri: formDataFromComponent.imageUri,
              sellingQuantity: formDataFromComponent.sellingQuantity,
              sellingUnit: formDataFromComponent.sellingUnit,
              howMuchInOneBox: formDataFromComponent.howMuchInOneBox,
              colors: colorsData,
              specificationsList: specsData,
              color: undefined,
              specifications: '',
              qrData,
              addedAt: new Date(),
              status: 'pending',
              imageUris: validImageUris,
            };
            addPendingItem(newItem);
          }
          router.back();
        }}
        onCancel={() => {
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
