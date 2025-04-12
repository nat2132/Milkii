import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Stack, router } from 'expo-router';
// Removed useSafeAreaInsets as 'insets' variable was not used
// If you plan to use it for dynamic padding, uncomment it.
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bolt, Bell, Plus, CheckCircle, ChevronRight, Clock, ShoppingBag } from 'lucide-react-native';
import { useInventoryStore } from '../stores/useInventoryStore'; // Assuming path is correct

export default function InventoryScreen() {
  // const insets = useSafeAreaInsets(); // Uncomment if needed for padding
  const pendingStocks = useInventoryStore((state) => state.pendingStocks);
  const recentActivity = useInventoryStore((state) => state.recentActivity);
  const markItemAsAdded = useInventoryStore((state) => state.markItemAsAdded);
  // Consider adding a batch action in the store:
  // const markAllPendingAsAdded = useInventoryStore((state) => state.markAllPendingAsAdded);

  const lastTapRef = useRef<{ [key: string]: number }>({});

  const handleTap = (item: any) => {
    const now = Date.now();
    // Ensure item and item.id exist before accessing
    const itemId = item?.id;
    if (!itemId) return; // Prevent errors if item or id is missing

    const lastTap = lastTapRef.current[itemId] || 0;
    if (now - lastTap < 300) { // 300ms threshold for double tap
      router.push(`/product-detail?itemId=${itemId}`);
    }
    lastTapRef.current[itemId] = now;
  };

  // Calculate totals only if pendingStocks exist to avoid unnecessary computation
  const totalItems = pendingStocks.length; // Count the number of pending stock items (cards)
  const totalExpense = pendingStocks.reduce((sum, item) => sum + (item.quantity || 0) * (item.purchasedPrice || 0), 0);
  const totalEstimatedProfit = pendingStocks.reduce(
    (sum, item) => sum + (item.quantity || 0) * ((item.sellingPrice || 0) - (item.purchasedPrice || 0)),
    0
  );


  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/settings')} accessibilityRole="button" accessibilityLabel="Open Settings">
            <Bolt size={28} color="#000" strokeWidth={1.5}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')} accessibilityRole="button" accessibilityLabel="Open Notifications">
            <Bell size={24} color="#000"/>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Add New Item Button */}
        <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-item')}
            accessibilityRole="button"
            accessibilityLabel="Add New Item"
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add New Item</Text>
        </TouchableOpacity>

        {/* Pending Stocks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Stocks</Text>

          {pendingStocks.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Image
                source={require('../assets/images/emptyshoppingcart.png')} // Ensure path is correct
                style={styles.emptyStateImage}
                resizeMode="contain"
                accessibilityLabel="Empty shopping cart"
              />
              <Text style={styles.emptyStateText}>
                No pending stocks
              </Text>
            </View>
          ) : (
            <>
              {/* Map over pending stocks */}
              {pendingStocks.map((item) => (
                <TouchableOpacity
                  key={item.id} // Ensure item.id is unique
                  onPress={() => handleTap(item)}
                  style={styles.stockItem}
                  accessibilityRole="button"
                  accessibilityLabel={`View details for ${item.itemName}`}
                >
                  <View style={styles.stockItemContent}>
                    <Image
                      source={item.imageUri ? { uri: item.imageUri } : require('../assets/images/icon.png')} // Ensure placeholder path is correct
                      style={styles.stockImage}
                      onError={(e) => console.log(`Failed to load image for item ${item.id}:`, e.nativeEvent.error)} // Optional: Add error handling
                      accessibilityLabel={item.imageUri ? `${item.itemName} image` : "Default item image"}
                    />
                    <View style={styles.stockDetails}>
                      <Text style={styles.stockName}>{item.itemName || 'Unnamed Item'}</Text>
                      <Text style={styles.stockQuantity}>{item.quantity || 0} {item.unit || 'unit'} added</Text>
                      <Text style={styles.stockPrice}>Purchased Price - {item.purchasedPrice != null ? item.purchasedPrice.toFixed(2) : 'N/A'} birr</Text>
                    </View>
                  </View>
                  {item.itemCategory && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.itemCategory}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              {/* Totals Container - Correctly placed */}
              <View style={styles.totalsContainer}>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Total Items:</Text>
                  <Text style={styles.totalValue}>{totalItems} items</Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Total Purchase Cost:</Text>
                  <Text style={styles.totalValue}>{totalExpense.toFixed(2)} birr</Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Total Estimated Profit:</Text>
                  <Text style={styles.totalValue}>{totalEstimatedProfit.toFixed(2)} birr</Text>
                </View>
              </View>

              {/* Mark as Added Button - Correctly placed */}
              <TouchableOpacity
                style={styles.markAsAddedButton}
                onPress={() => {
                  // Consider using a single store action like markAllPendingAsAdded()
                  pendingStocks.forEach((item) => item.id && markItemAsAdded(item.id));
                }}
                accessibilityRole="button"
                accessibilityLabel="Mark all pending items as added"
              >
                <CheckCircle size={20} color="#fff" />
                <Text style={styles.markAsAddedText}>Mark as Added</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Today's Added Stocks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Added Stocks</Text>
            {recentActivity.length > 0 && ( // Show "View All" only if there's activity
               <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('./inventory-list')} accessibilityRole="link" accessibilityLabel="View all added stocks">
                 <Text style={styles.viewAllText}>View All</Text>
                 <ChevronRight size={16} color="#007AFF" />
               </TouchableOpacity>
            )}
          </View>

          {/* Check if recentActivity exists and has items */}
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((item) => (
              <TouchableOpacity
                key={item.id} // Ensure item.id is unique
                onPress={() => handleTap(item)}
                style={styles.addedStockItem}
                accessibilityRole="button"
                accessibilityLabel={`View details for recently added ${item.itemName}`}
              >
                <View style={styles.timeContainer}>
                  <Clock size={12} color="#8E8E93" />
                  <Text style={styles.timeText}>
                    {/* Ensure addedAt is a Date object */}
                    {item.addedAt instanceof Date
                      ? item.addedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Invalid Date'}
                  </Text>
                </View>
                <View style={styles.addedStockContent}>
                  <Image
                    source={item.imageUri ? { uri: item.imageUri } : require('../assets/images/icon.png')} // Ensure placeholder path is correct
                    style={styles.stockImage}
                    onError={(e) => console.log(`Failed to load image for recent item ${item.id}:`, e.nativeEvent.error)} // Optional: Add error handling
                    accessibilityLabel={item.imageUri ? `${item.itemName} image` : "Default item image"}
                  />
                  <View style={styles.stockDetails}>
                    <Text style={styles.stockName}>{item.itemName || 'Unnamed Item'}</Text>
                    <Text style={styles.stockQuantity}>{item.quantity || 0} {item.unit || 'unit'} added</Text>
                    <Text style={styles.stockPrice}>Purchased Price - {item.purchasedPrice != null ? item.purchasedPrice.toFixed(2) : 'N/A'} birr</Text>
                  </View>
                </View>
                {item.itemCategory && (
                   <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.itemCategory}</Text>
                   </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyStateText}>No stocks added today yet.</Text> // Added empty state for recent activity
          )}

          {/* View All Stocks Button (Consider if this is redundant with "View All" link above) */}
          <TouchableOpacity
            style={styles.viewAllStocksButton}
            onPress={() => router.push('./inventory-list')}
            accessibilityRole="button"
            accessibilityLabel="View all stocks in inventory"
          >
            <ShoppingBag size={20} color="#FFFFFF" />
            <Text style={styles.viewAllStocksText}>View All Stocks</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles remain largely the same, with minor additions ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1, // Optional: Add a separator
    borderBottomColor: '#E5E5EA', // Optional: Separator color
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold', // Ensure font is loaded
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 24, // Consider if this top margin is needed after header
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium', // Ensure font is loaded
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Adjusted from 20 for title below
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold', // Ensure font is loaded
    marginBottom: 10, // Adjusted from 20
    flexShrink: 1, // Allow title to shrink if View All button is long
    marginRight: 10, // Add space between title and button
  },
  // Added styles for empty state
  emptyStateContainer: {
      alignItems: 'center',
      marginVertical: 30, // Increased margin
      paddingHorizontal: 20,
  },
  emptyStateImage: {
      width: 120, // Adjusted size
      height: 120, // Adjusted size
      marginBottom: 15,
  },
  emptyStateText: {
      fontSize: 16,
      color: '#888',
      textAlign: 'center', // Center text
      fontFamily: 'Inter-Regular', // Ensure font is loaded
  },
  stockItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  stockItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#F0F0F0', // Add a background color for loading/fallback
  },
  stockDetails: {
    flex: 1,
  },
  stockName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold', // Ensure font is loaded
    marginBottom: 3,
  },
  stockQuantity: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular', // Ensure font is loaded
    marginBottom: 3,
  },
  stockPrice: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular', // Ensure font is loaded
  },
  categoryBadge: {
    position: 'absolute',
    top: 10, // Adjusted slightly
    right: 10, // Adjusted slightly
    paddingHorizontal: 8, // Adjusted slightly
    paddingVertical: 4, // Adjusted slightly
    backgroundColor: '#F0F0F0', // Slightly different background
    borderRadius: 12, // More rounded
  },
  categoryText: {
    fontSize: 11, // Slightly smaller
    color: '#333', // Darker text
    fontFamily: 'Inter-Medium', // Ensure font is loaded
  },
  totalsContainer: {
    marginVertical: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Increased spacing
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular', // Ensure font is loaded
    color: '#555', // Slightly darker label
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold', // Ensure font is loaded
    textAlign: 'right',
  },
  markAsAddedButton: {
    backgroundColor: '#34C759',
    borderRadius: 8, // Consistent rounding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // Adjusted padding
    marginTop: 15, // Add top margin
  },
  markAsAddedText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium', // Ensure font is loaded
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // Removed bottom positioning, alignment handled by flexbox in sectionHeader
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'Inter-Medium', // Ensure font is loaded
    marginRight: 3, // Reduced margin
  },
  addedStockItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Adjusted spacing
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4, // Increased spacing
    color: '#8E8E93',
    fontFamily: 'Inter-Regular', // Ensure font is loaded
  },
  addedStockContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllStocksButton: {
    backgroundColor: '#000',
    borderRadius: 8, // Consistent rounding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // Adjusted padding
    marginTop: 10, // Adjusted spacing
    marginBottom: 24, // Consistent bottom margin
  },
  // Removed buttonIcon style as lucide icons are used directly
  viewAllStocksText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium', // Ensure font is loaded
    marginLeft: 8,
  },
});
