import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface InventoryItem {
  id: string;
  itemName: string;
  itemCategory: string;
  quantity: number;
  unit?: string;
  companyName: string;
  color?: string;
  purchasedPrice: number;
  sellingPrice: number;
  quality?: string;
  description: string;
  specifications: string;
  imageUri?: string;
  qrData: string; // JSON string of item details
  addedAt: Date;  // Timestamp when marked as added
  status: 'pending' | 'added';
}

interface InventoryContextType {
  pendingStocks: InventoryItem[];
  inventoryList: InventoryItem[];
  recentActivity: InventoryItem[];
  addPendingItem: (item: InventoryItem) => void;
  markItemAsAdded: (itemId: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [pendingStocks, setPendingStocks] = useState<InventoryItem[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<InventoryItem[]>([]);

  const addPendingItem = (item: InventoryItem) => {
    setPendingStocks(prev => [...prev, item]);
  };

  const markItemAsAdded = (itemId: string) => {
    setPendingStocks(prev => prev.filter(item => item.id !== itemId));

    const item = pendingStocks.find(i => i.id === itemId);
    if (!item) return;

    const addedItem: InventoryItem = { ...item, status: 'added', addedAt: new Date() };

    setInventoryList(prev => [...prev, addedItem]);

    const today = new Date().toDateString();
    setRecentActivity(prev => {
      const filtered = prev.filter(i => i.addedAt.toDateString() === today);
      return [...filtered, addedItem];
    });
  };

  return (
    <InventoryContext.Provider
      value={{
        pendingStocks,
        inventoryList,
        recentActivity,
        addPendingItem,
        markItemAsAdded,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};