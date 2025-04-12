import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  TrendingUp,
  Package,
  Wallet,
  Clock,
} from 'lucide-react-native';

export default function SummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Current date
  const currentDate = 'Today, March 15, 2025';
  
  // Mock data for summary
  const summaryData = {
    totalSales: '4,285.00',
    salesChangePercent: 12.5,
    itemsSold: '147',
    itemsChangePercent: 8.2,
    totalProfit: '1,245.00',
    profitChangePercent: 15.3,
    outstanding: '385.00',
    pendingPayments: 4,
    
    // Financial summary
    discounts: '215.00',
    expenses: '3000',
    netProfit: '2,785',
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales Summary</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date */}
        <Text style={styles.dateText}>{currentDate}</Text>
        
        {/* Summary Cards */}
        <View style={styles.cardsContainer}>
          {/* Total Sales Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Total Sales</Text>
              <TrendingUp size={20} color="#000" style={styles.cardIcon} />
            </View>
            <Text style={styles.cardValue}>{summaryData.totalSales} birr</Text>
            <View style={styles.changeContainer}>
              <Text style={styles.changeArrow}>↑</Text>
              <Text style={styles.changeText}>
                {summaryData.salesChangePercent}% from yesterday
              </Text>
            </View>
          </View>
          
          {/* Items Sold Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Items Sold</Text>
              <Package size={20} color="#000" style={styles.cardIcon} />
            </View>
            <Text style={styles.cardValue}>{summaryData.itemsSold}</Text>
            <View style={styles.changeContainer}>
              <Text style={styles.changeArrow}>↑</Text>
              <Text style={styles.changeText}>
                {summaryData.itemsChangePercent}% from yesterday
              </Text>
            </View>
          </View>
          
          {/* Total Profit Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Total Profit</Text>
              <Wallet size={20} color="#000" style={styles.cardIcon} />
            </View>
            <Text style={styles.cardValue}>{summaryData.totalProfit} birr</Text>
            <View style={styles.changeContainer}>
              <Text style={styles.changeArrow}>↑</Text>
              <Text style={styles.changeText}>
                {summaryData.profitChangePercent}% from yesterday
              </Text>
            </View>
          </View>
          
          {/* Outstanding Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Outstanding</Text>
              <Clock size={20} color="#000" style={styles.cardIcon} />
            </View>
            <Text style={styles.cardValue}>{summaryData.outstanding} birr</Text>
            <Text style={styles.pendingText}>
              {summaryData.pendingPayments} pending payments
            </Text>
          </View>
        </View>
        
        {/* Financial Summary */}
        <View style={styles.financialContainer}>
          <Text style={styles.financialTitle}>Financial Summary</Text>
          
          {/* Total Sales Row */}
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Sales</Text>
            <Text style={styles.financialValue}>{summaryData.totalSales} birr</Text>
          </View>
          
          {/* Discounts Row */}
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Discounts</Text>
            <Text style={styles.financialValueNegative}>-{summaryData.discounts} birr</Text>
          </View>
          
          {/* Total Profit Row */}
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Profit</Text>
            <Text style={styles.financialValue}>{summaryData.expenses} birr</Text>
          </View>
          
          <View style={styles.divider} />
          
          {/* Net Profit Row */}
          <View style={styles.financialRow}>
            <Text style={styles.netProfitLabel}>Net Profit</Text>
            <Text style={styles.netProfitValue}>{summaryData.netProfit} birr</Text>
          </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Inter-Medium',
  },
  cardIcon: {
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 19,
    fontFamily: 'Inter-Bold',
    marginBottom: 5,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeArrow: {
    color: '#34C759',
    fontSize: 12,
    marginRight: 2,
    fontFamily: 'Inter-Medium',
  },
  changeText: {
    color: '#34C759',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  pendingText: {
    color: '#FF9500',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  financialContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  financialTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  financialLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular',
  },
  financialValue: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter-Medium',
  },
  financialValueNegative: {
    fontSize: 16,
    color: '#FF3B30',
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 15,
  },
  netProfitLabel: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter-Bold',
  },
  netProfitValue: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter-Bold',
  },
});
