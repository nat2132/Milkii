import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Bolt } from 'lucide-react-native';
import ProfitCard from '../components/ProfitCard'; 
import SalesCard from '../components/SalesCard';   
import ItemsCard from '../components/ItemsCard';   

export default function AnalyticsScreen() {  
  // Shared state for the current week, managed by the parent
  const [currentWeek, setCurrentWeek] = useState(0);

  const insets = useSafeAreaInsets();

    // Handlers to change the week - passed down to all cards
    const handlePrevWeek = () => {
      // You might add logic here to check bounds based on your actual data range
      setCurrentWeek(prev => prev - 1);
      console.log("Navigating to Previous Week:", currentWeek - 1);
    };
  
    const handleNextWeek = () => {
      // You might add logic here to check bounds based on your actual data range
      setCurrentWeek(prev => prev + 1);
      console.log("Navigating to Next Week:", currentWeek + 1);
    };

  // Mock data for top and low selling items
  const topSellingItems = [
    { id: 1, name: 'Milk', price: '2,843 birr' },
    { id: 2, name: 'Milk', price: '2,843 birr' },
    { id: 3, name: 'Milk', price: '2,843 birr' },
    { id: 4, name: 'Milk', price: '2,843 birr' },
    { id: 5, name: 'Milk', price: '2,843 birr' },
  ];

  const lowSellingItems = [
    { id: 1, name: 'Milk', price: '43 birr' },
    { id: 2, name: 'Milk', price: '248 birr' },
    { id: 3, name: 'Milk', price: '0 birr' },
    { id: 4, name: 'Milk', price: '0 birr' },
    { id: 5, name: 'Milk', price: '205 birr' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Bolt size={28} color="#000" fill="transparent" strokeWidth={1.5} onPress={() => router.push('/settings')}/>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Bell size={24} color="#000" onPress={() => router.push('/notifications')}/>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

      <SafeAreaView style={styles.container}>
      {/* Optional: Configure status bar style */}
      <StatusBar barStyle="dark-content" />

      {/* ScrollView is important as content will likely exceed screen height */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profit/Expense Card */}
        <View style={styles.cardContainer}>
          <ProfitCard
            currentWeek={currentWeek}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
        </View>
        
        {/* Sales Card */}
        <View style={styles.cardContainer}>
          <SalesCard
            currentWeek={currentWeek}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
        </View>

        {/* Items Sold Card */}
        <View style={styles.cardContainer}>
          <ItemsCard
            currentWeek={currentWeek}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
        </View>

      </ScrollView>
    </SafeAreaView>

        {/* Top 5 Selling Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.itemsSectionTitle}>Top 5 Selling Items</Text>
          
          {topSellingItems.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemImageContainer}>
                <View style={styles.itemImage}>
                  <Text style={styles.itemImageText}>M</Text>
                </View>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>MILK milk milk</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
        </View>
        
        {/* Low Selling Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.itemsSectionTitle}>Low Selling Items</Text>
          
          {lowSellingItems.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemImageContainer}>
                <View style={styles.itemImage}>
                  <Text style={styles.itemImageText}>M</Text>
                </View>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>MILK milk milk</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  expandButton: {
    padding: 5,
  },
  sectionValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 5,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 5,
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dayButton: {
    padding: 5,
  },
  dayLabels: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  itemsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemsSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemImageContainer: {
    marginRight: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  itemSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  scrollContent: {
    paddingVertical: 20, // Add padding at the top and bottom of the scroll area
    paddingHorizontal: 15, // Add horizontal padding for the cards
    alignItems: 'center', // Center items if they don't take full width (though cards are set to 100%)
  },
  cardContainer: {
    width: '100%', // Make each card container take the full width within the padding
    marginBottom: 20, // Add space between the cards
  },
});
