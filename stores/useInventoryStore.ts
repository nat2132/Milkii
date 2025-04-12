import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

export interface InventoryItem {
  id: string;
  itemName: string;
  itemCategory: string;
  quantity: number;
  unit?: string;
  itemPerPack?: number; // Added field
  itemPerPackUnit?: string; // Added field
  companyName: string;
  color?: string; // legacy single color name
  colors?: {
    name: string;
    quantity: number;
    code: string; // hex color code
  }[];
  purchasedPrice: number;
  sellingPrice: number;
  quality?: string;
  description: string;
  specifications: string; // legacy concatenated specs
  specificationsList?: {
    title: string;
    description: string;
  }[];
  sellingQuantity?: number;
  sellingUnit?: string;
  howMuchInOneBox?: number;
  howMuchInOneBoxUnit?: string; // Added unit for 'how much in one box'
  imageUri?: string; // Main image URI (for backward compatibility)
  imageUris?: string[]; // Array of all image URIs
  mainImageIndex?: number; // Index of the main image in the imageUris array
  qrData: string; // JSON string of item details
  addedAt: Date;  // Timestamp when marked as added
  status: 'pending' | 'added';
}

interface InventoryState {
  pendingStocks: InventoryItem[];
  inventoryList: InventoryItem[];
  recentActivity: InventoryItem[];
  addPendingItem: (item: InventoryItem) => void;
  markItemAsAdded: (itemId: string) => void;
  loadInventoryList: () => Promise<void>;
  setInventoryList: (list: InventoryItem[]) => void;
  updateItem: (updatedItem: InventoryItem) => void;
  deleteItem: (itemId: string) => void;
}

const validateImageUris = async (imageUris: string[]): Promise<string[]> => {
  const validUris: string[] = [];

  for (const uri of imageUris) {
    try {
      await Image.prefetch(uri); // Check if the image can be loaded
      validUris.push(uri);
    } catch (error) {
      console.warn(`Invalid image URI: ${uri}`, error);
    }
  }

  return validUris;
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  pendingStocks: [],
  inventoryList: [],
  recentActivity: [],

  addPendingItem: async (item) => {
    const validImageUris = item.imageUris ? await validateImageUris(item.imageUris) : [];
    const newItem = { ...item, imageUris: validImageUris };

    set((state) => ({
      pendingStocks: [...state.pendingStocks, newItem],
    }));
  },

  markItemAsAdded: (itemId) => {
    const state = get();
    const item = state.pendingStocks.find((i) => i.id === itemId);
    if (!item) return;

    const addedItem: InventoryItem = {
      ...item,
      status: 'added',
      addedAt: new Date(),
    };

    const today = new Date().toDateString();

    const updatedInventoryList = [...state.inventoryList, addedItem];

    set({
      pendingStocks: state.pendingStocks.filter((i) => i.id !== itemId),
      inventoryList: updatedInventoryList,
      recentActivity: [
        ...state.recentActivity.filter(
          (i) => i.addedAt.toDateString() === today
        ),
        addedItem,
      ],
    });

    // Persist the updated inventory list
    AsyncStorage.setItem('inventoryList', JSON.stringify(updatedInventoryList)).catch((error) =>
      console.error('Failed to save inventory list:', error)
    );
  },

  setInventoryList: (list: InventoryItem[]) => {
    set({ inventoryList: list });
  },

  loadInventoryList: async () => {
    try {
      const saved = await AsyncStorage.getItem('inventoryList');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach((item: any) => {
          item.addedAt = new Date(item.addedAt);
        });
        get().setInventoryList(parsed);
      }
    } catch (error) {
      console.error('Failed to load inventory list:', error);
    }
  },

  updateItem: async (updatedItem) => {
    const validImageUris = updatedItem.imageUris ? await validateImageUris(updatedItem.imageUris) : [];
    const newItem = { ...updatedItem, imageUris: validImageUris };

    const state = get();
    const updateInList = (list: InventoryItem[]) =>
      list.map((item) => (item.id === newItem.id ? newItem : item));

    const updatedPending = updateInList(state.pendingStocks);
    const updatedInventory = updateInList(state.inventoryList);

    set({
      pendingStocks: updatedPending,
      inventoryList: updatedInventory,
    });

    AsyncStorage.setItem('inventoryList', JSON.stringify(updatedInventory)).catch((error) =>
      console.error('Failed to save updated inventory list:', error)
    );
  },

  deleteItem: (itemId: string) => {
    const state = get();
    const updatedPending = state.pendingStocks.filter((item) => item.id !== itemId);
    const updatedInventory = state.inventoryList.filter((item) => item.id !== itemId);

    set({
      pendingStocks: updatedPending,
      inventoryList: updatedInventory,
    });

    AsyncStorage.setItem('inventoryList', JSON.stringify(updatedInventory)).catch((error) =>
      console.error('Failed to save updated inventory list:', error)
    );
  },
}));
