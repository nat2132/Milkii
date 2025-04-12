import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Calendar,
  MapPin,
  ArrowDownNarrowWide,
  Clock
} from 'lucide-react-native';

// Import the new components
import DatePicker from '../components/DatePicker';
import SortOptions, { SortOption } from '../components/SortOptions';

const { width } = Dimensions.get('window');

// Define the SaleItem interface
interface SaleItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  category: string;
  time: string;
  image: any; // Using any for image require
}

// Sample data
const salesData: SaleItem[] = [
  {
    id: '1',
    name: '5 mm Nails',
    quantity: '5 kg',
    price: '180.00',
    category: 'Nail',
    time: '1hr ago',
    image: require('../assets/images/icon.png')
  },
  {
    id: '2',
    name: '10 mm Nails',
    quantity: '2.0 kg',
    price: '150.00',
    category: 'Nail',
    time: '1hr ago',
    image: require('../assets/images/icon.png')
  },
  {
    id: '3',
    name: 'Red Paint',
    quantity: '2 units',
    price: '950.00',
    category: 'Paint',
    time: '1hr ago',
    image: require('../assets/images/icon.png')
  },
];

export default function SalesListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Sort options
  const sortOptions: SortOption[] = [
    { id: 'highest_price', label: 'Highest Price', icon: 'arrow-up' },
    { id: 'lowest_price', label: 'Lowest Price', icon: 'arrow-down' },
    { id: 'newest', label: 'Newest', icon: 'arrow-up' },
    { id: 'oldest', label: 'Oldest', icon: 'arrow-down' },
  ];
  
  // Category options
  const categoryOptions = [
    { id: 'all', label: 'All Categories' },
    { id: 'nail', label: 'Nail' },
    { id: 'paint', label: 'Paint' },
  ];
  
  const renderSaleItem = ({ item }: { item: SaleItem }) => (
    <View style={styles.saleItem}>
      <View style={styles.saleHeader}>
        <View style={styles.timeContainer}>
          <Clock size={13} color="#8E8E93" />
          <Text style={styles.saleTime}>{item.time}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.saleContent}>
        <Image source={item.image} style={styles.saleImage} />
        <View style={styles.saleDetails}>
          <Text style={styles.saleName}>{item.name}</Text>
          <Text style={styles.saleQuantity}>{item.quantity}</Text>
        </View>
        <Text style={styles.salePrice}>{item.price} birr</Text>
      </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Sales Record</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Sales..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Filter Options */}
      <View style={styles.filterOptions}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={15} color="#000" />
          <Text style={styles.filterButtonText}>Date</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowCategoryOptions(true)}
        >
          <MapPin size={15} color="#000" />
          <Text style={styles.filterButtonText}>Category</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowSortOptions(true)}
        >
          <ArrowDownNarrowWide size={15} color="#000" style={{marginRight: 5}} />
          <Text style={styles.filterButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>
      
      {/* Sales List */}
      <FlatList
        data={salesData}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
        style={styles.salesList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
      {/* Date Picker Modal */}
      <DatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      
      {/* Sort Options Modal */}
      <SortOptions
        visible={showSortOptions}
        onClose={() => setShowSortOptions(false)}
        onSelectOption={(option) => {
          console.log('Selected sort option:', option.id);
          // Implement sorting logic here
        }}
        options={sortOptions}
      />
      
      {/* Category Options Modal */}
      <SortOptions
        visible={showCategoryOptions}
        onClose={() => setShowCategoryOptions(false)}
        onSelectOption={(option: any) => {
          console.log('Selected category:', option.id);
          // Implement category filtering logic here
        }}
        options={categoryOptions as any}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter-Regular',
  },
  filterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 5,
  },
  salesList: {
    padding: 20,
  },
  saleItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleTime: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Inter-Regular',
  },
  saleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  saleDetails: {
    flex: 1,
  },
  saleName: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Inter-SemiBold',
  },
  saleQuantity: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular',
  },
  salePrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
