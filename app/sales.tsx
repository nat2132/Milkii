import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Bolt,
  Bell,
  ScanLine,
  CheckCircle,
  Clock,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define type for sales items
interface SalesItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  tag: string;
  image: any; // Use 'any' for now, or specify image source type if known
  time?: string; // Optional time for today's sales
}

// Sample nail image
const nailImage = require('../assets/images/icon.png');
const paintImage = require('../assets/images/icon.png');

// Placeholder data
const pendingSalesData: SalesItem[] = [
  {
    id: '1',
    name: '5 mm Nails',
    quantity: '5 kg',
    price: '180.00 birr',
    tag: 'Nail',
    image: nailImage,
  },
  {
    id: '2',
    name: '10 mm Nails',
    quantity: '2.0 kg',
    price: '150.00 birr',
    tag: 'Nail',
    image: nailImage,
  },
  {
    id: '3',
    name: 'Red Paint',
    quantity: '2 units',
    price: '950.00 birr',
    tag: 'Paint',
    image: paintImage,
  },
];

const todaySalesData: SalesItem[] = [
  {
    id: '4',
    name: '5 mm Nails',
    quantity: '5 kg',
    price: '180.00 birr',
    tag: 'Nail',
    time: '1hr ago',
    image: nailImage,
  },
  {
    id: '5',
    name: '10 mm Nails',
    quantity: '2.0 kg',
    price: '150.00 birr',
    tag: 'Nail',
    time: '1hr ago',
    image: nailImage,
  },
  {
    id: '6',
    name: 'Red Paint',
    quantity: '2 units',
    price: '950.00 birr',
    tag: 'Paint',
    time: '1hr ago',
    image: paintImage,
  },
];

interface SalesItemCardProps {
  item: SalesItem;
  showTime?: boolean;
}

const SalesItemCard: React.FC<SalesItemCardProps> = ({ item, showTime = false }) => {
  return (
    <View style={styles.card}>
      {showTime && (
        <View style={styles.timeContainer}>
          <Clock size={14} color="#666" />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
        </View>
        <View style={styles.priceContainer}>
        <View style={styles.tag}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
      </View>
    </View>
  );
};

export default function SalesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Calculate totals for pending sales
  const totalPendingItems = pendingSalesData.length;
  const totalPendingAmount = pendingSalesData.reduce((sum, item) => {
    const price = parseFloat(item.price.split(' ')[0]);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity>
          <Bolt size={28} color="#000" fill="transparent" strokeWidth={1.5} onPress={() => router.push('/settings')}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales</Text>
        <TouchableOpacity>
          <Bell size={24} color="#000" onPress={() => router.push('/notifications')}/>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Button */}
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push('./scanner')}>
          <ScanLine size={20} color="#fff" />
          <Text style={styles.scanButtonText}>Scan Item</Text>
        </TouchableOpacity>

        {/* Pending Sales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Sales</Text>
          {pendingSalesData.map((item) => (
            <SalesItemCard key={item.id} item={item} />
          ))}
          <View style={styles.totalsContainer}>
            <Text style={styles.totalLabel}>Total Items:</Text>
            <Text style={styles.totalValue}>{totalPendingItems} items</Text>
          </View>
          <View style={styles.totalsContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>{totalPendingAmount.toFixed(2)} birr</Text>
          </View>
          <TouchableOpacity style={styles.markSoldButton}>
            <CheckCircle size={20} color="#fff" />
            <Text style={styles.markSoldButtonText}>Mark as Sold</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Sales */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Sales</Text>
            <TouchableOpacity 
              style={styles.viewAllLink}
              onPress={() => router.push('./sales-list')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
          {todaySalesData.map((item) => (
            <SalesItemCard key={item.id} item={item} showTime={true} />
          ))}
        </View>

        {/* View All Sales Button */}
        <TouchableOpacity 
          style={styles.viewAllSalesButton}
          onPress={() => router.push('./sales-list')}
        >
          <ShoppingBag size={20} color="#FFFFFF" />
          <Text style={styles.viewAllSalesText}>View All Sales</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: '#fff', 
  },
  contentContainer: {
    padding: 16,
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 25,
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 12,
  },
  viewAllText: {
    color: '#007AFF',
    marginRight: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
    bottom: 3,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  markSoldButton: {
    backgroundColor: '#4CD964',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  markSoldButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewAllSalesButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  viewAllSalesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
