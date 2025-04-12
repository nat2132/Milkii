import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, Image } from "react-native";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Search, 
  Bell, 
  Package, 
  ShoppingBag, 
  Home as HomeIcon, 
  BarChart3, 
  Clock, 
  Phone,
  Bolt,
  TrendingUp,
} from "lucide-react-native";
import { LineChart } from "react-native-gifted-charts";
import { useInventoryStore } from "../stores/useInventoryStore";
import React from "react";

export default function Index() {
  const insets = useSafeAreaInsets();
  const lastTapRef = React.useRef<{ [key: string]: number }>({});
  
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
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
    },
    header: {
      padding: 16,
      paddingTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    hexagonContainer: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginHorizontal: 12,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    searchText: {
      marginLeft: 8,
      fontSize: 16,
      color: '#999',
      fontFamily: 'Inter-Regular',
    },
    welcomeSection: {
      padding: 16,
    },
    welcomeText: {
      fontSize: 20,
      color: '#000',
      fontFamily: 'Inter-Bold',
    },
    overviewText: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
      fontFamily: 'Inter-Regular',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    statCard: {
      width: '48%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    statTitle: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Inter-Regular',
    },
    statValue: {
      fontSize: 18,
      color: '#000',
      marginVertical: 4,
      fontFamily: 'Inter-Bold',
    },
    statChange: {
      fontSize: 10,
      color: '#4CAF50',
      flexDirection: 'row',
      alignItems: 'center',
      fontFamily: 'Inter-Regular',
    },
    statChangeYellow:{
      fontSize: 10,
      color: '#D87F02',
      flexDirection: 'row',
      alignItems: 'center',
      fontFamily: 'Inter-Regular',
    },
    quickStatusSection: {
      padding: 10
    },
    quickStatusTitle: {
      fontSize: 20,
      color: '#000',
      marginBottom: 16,
      marginLeft: 5,
      fontFamily: 'Inter-Bold',
    },
    quickStatusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    quickStatusItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    quickStatusIconContainer: {
      width: 30,
      height: 30,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    quickStatusContent: {
      flex: 1,
    },
    quickStatusLabel: {
      fontSize: 13,
      color: '#000',
      fontFamily: 'Inter-Medium',
    },
    quickStatusValue: {
      fontSize: 18,
      color: '#000',
      marginTop: 4,
      fontFamily: 'Inter-Bold',
    },
    quickStatusSubtext: {
      fontSize: 12,
      color: '#666',
      marginTop: 2,
      fontFamily: 'Inter-Regular',
    },
    dailyProfitSection: {
      padding: 16,
    },
    profitCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    profitCardValue: {
      fontSize: 20,
      color: '#000',
      fontFamily: 'Inter-Bold',
    },
    profitCardTitle: {
      fontSize: 13,
      color: '#666',
      marginTop: 4,
      fontFamily: 'Inter-Regular',
    },
    profitCardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    profitCardColumn:{
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    profitCardChange: {
      fontSize: 12,
      color: '#FF3B30',
      fontFamily: 'Inter-Medium',
    },
    positiveChange: {
      color: '#4CAF50',
    },
    chartContainer: {
      width: 100,
      height: 40,
    },
    recentActivitySection: {
      padding: 16,
      backgroundColor: '#fff',
      marginBottom: 16,
    },
    recentActivityTitle: {
      fontSize: 20,
      color: '#000',
      marginBottom: 16,
      fontFamily: 'Inter-Bold',
    },
    activityItem: {
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 28,
      backgroundColor: '#fff',
    },
    activityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    activityTime: {
      fontSize: 12,
      color: '#666',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 16,
    },
    activityTag: {
      fontSize: 12,
      color: '#000',
      backgroundColor: '#eee',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      fontFamily: 'Inter-Medium',
    },
    activityContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    activityImageContainer: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      overflow: 'hidden',
    },
    activityInitials: {
      fontSize: 16,
      color: '#000',
      fontFamily: 'Inter-Bold',
    },
    activityDetails: {
      flex: 1,
    },
    activityTitle: {
      fontSize: 16,
      color: '#000',
      fontFamily: 'Inter-SemiBold',
    },
    activitySubtitle: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
      fontFamily: 'Inter-Regular',
    },
    activityPrice: {
      fontSize: 16,
      color: '#000',
      fontFamily: 'Inter-SemiBold',
    },
    tabBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor:'#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: Math.max(insets.bottom, 8),
      paddingTop: 8,
    },
    tabItem: {
      alignItems: 'center',
    },
    tabLabel: {
      fontSize: 10,
      marginTop: 4,
      color: '#666',
      fontFamily: 'Inter-Medium',
    },
    activeTabLabel: {
      color: '#007AFF',
      fontFamily: 'Inter-SemiBold',
    },
    notificationButton: {
      padding: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.hexagonContainer}>
          <Bolt size={24} color="#333" fill="transparent" strokeWidth={1.5} onPress={() => router.push('/settings')}/>
        </View>
        <View style={styles.searchContainer}>
          <Search size={16} color="#999" />
          <Text style={styles.searchText}>Search for Inventory...</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={22} color="#333" onPress={() => router.push('/notifications')}/>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back, John!</Text>
          <Text style={styles.overviewText}>Here's your business overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Total Sales</Text>
                <BarChart3 size={18} color={ '#666'} />
              </View>
              <Text style={styles.statValue}>4,285.00 birr</Text>
              <Text style={styles.statChange}><TrendingUp size={12} color={ '#4CAF50'}/>+6.8% from last month</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Items Sold</Text>
                <ShoppingBag size={18} color={'#666'} />
              </View>
              <Text style={styles.statValue}>147</Text>
              <Text style={styles.statChange}><TrendingUp size={12} color={ '#4CAF50'}/>+6.8% from last month</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Total Profit</Text>
                <BarChart3 size={18} color={'#666'} />
              </View>
              <Text style={styles.statValue}>1,245.00 birr</Text>
              <Text style={styles.statChange}><TrendingUp size={12} color={ '#4CAF50'}/>+6.8% from last month</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Outstanding</Text>
                <Clock size={18} color={'#666'} />
              </View>
              <Text style={styles.statValue}>385.00 birr</Text>
              <Text style={styles.statChangeYellow}>5 pending payments</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.quickStatusSection}>
          <Text style={styles.quickStatusTitle}>Quick Status</Text>
          
          <View style={styles.quickStatusRow}>
            <View style={styles.quickStatusItem}>
              <View style={[styles.quickStatusIconContainer]}>
                <Package size={24} color="#0066FF" />
              </View>
              <View style={styles.quickStatusContent}>
                <Text style={styles.quickStatusLabel}>Total Stock</Text>
                <Text style={styles.quickStatusValue}>1,234</Text>
                <Text style={styles.quickStatusSubtext}>Items</Text>
              </View>
            </View>
            
            <View style={styles.quickStatusItem}>
              <View style={[styles.quickStatusIconContainer]}>
                <ShoppingBag size={24} color="#00A32A" />
              </View>
              <View style={styles.quickStatusContent}>
                <Text style={styles.quickStatusLabel}>Monthly Sales</Text>
                <Text style={styles.quickStatusValue}>456</Text>
                <Text style={styles.quickStatusSubtext}>Items Sold</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.dailyProfitSection}>
          <View style={styles.profitCard}>
          <View style={styles.profitCardRow}>
            <View style={styles.profitCardColumn}>
            <Text style={styles.profitCardValue}>10,254 birr</Text>
            <Text style={styles.profitCardTitle}>Today's Profit</Text>
            </View>            
            <View style={styles.profitCardColumn}>

              <View style={styles.chartContainer}>
                <LineChart
                  data={[
                    {value: 5},
                    {value: 8},
                    {value: 3},
                    {value: 6},
                    {value: 9},
                    {value: 4},
                    {value: 7},
                  ]}
                  width={150}
                  height={40}
                  color="#007AFF"
                  thickness={2}
                  startFillColor="rgba(0,122,255,0)"
                  endFillColor="rgba(0,122,255,0)"
                  initialSpacing={0}
                  endSpacing={5}
                  spacing={20}
                  hideAxesAndRules
                  hideYAxisText
                  yAxisColor="transparent"
                  xAxisColor="transparent"
                  dataPointsColor="#064e9c"
                  dataPointsRadius={4}
                  curved
                  showDataPointOnFocus
                  focusedDataPointRadius={7}
                  focusedDataPointColor="#064e9c"
                />
              </View>
              <Text style={styles.profitCardChange}>-1.5% than yesterday</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.profitCard}>
          <View style={styles.profitCardRow}>
          <View style={styles.profitCardColumn}>
            <Text style={styles.profitCardValue}>14 Items</Text>
            <Text style={styles.profitCardTitle}>Today's Item Sold</Text>
            </View>
            <View style={styles.profitCardColumn}>
              <View style={styles.chartContainer}>
                <LineChart
                  data={[
                    {value: 4},
                    {value: 7},
                    {value: 2},
                    {value: 8},
                    {value: 5},
                    {value: 9},
                    {value: 6},
                  ]}
                  width={150}
                  height={40}
                  color="#FF9500"
                  thickness={2}
                  startFillColor="rgba(255,149,0,0)"
                  endFillColor="rgba(255,149,0,0)"
                  initialSpacing={0}
                  endSpacing={0}
                  spacing={20}
                  hideAxesAndRules
                  hideYAxisText
                  yAxisColor="transparent"
                  xAxisColor="transparent"
                  dataPointsColor="#9c9906"
                  dataPointsRadius={3}
                  curved
                  showDataPointOnFocus
                  focusedDataPointRadius={4}
                  focusedDataPointColor="#9c9906"
                />
              </View>
              <Text style={[styles.profitCardChange, styles.positiveChange]}>+2.5% than yesterday</Text>
            </View>
            </View>
          </View>
        </View>
        
        <View style={styles.recentActivitySection}>
          <Text style={styles.recentActivityTitle}>Recent Activity</Text>
          
          {useInventoryStore((state) => state.recentActivity).length > 0 ? (
            useInventoryStore((state) => state.recentActivity).map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleTap(item)}
                style={styles.activityItem}
                accessibilityRole="button"
                accessibilityLabel={`View details for ${item.itemName}`}
              >
                <View style={styles.activityHeader}>
                  <View style={styles.activityTime}>
                    <Clock size={14} color={'#666'} style={{ marginRight: 4 }} />
                    <Text style={styles.timeText}>
                      {item.addedAt instanceof Date
                        ? item.addedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Invalid Date'}
                    </Text>
                  </View>
                  {item.itemCategory && (
                    <View style={styles.activityTag}>
                      <Text style={styles.categoryText}>{item.itemCategory}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityImageContainer}>
                    {item.imageUri ? (
                      <Image 
                        source={{ uri: item.imageUri }} 
                        style={{ width: 64, height: 64, borderRadius: 16 }}
                        accessibilityLabel={`${item.itemName} image`}
                      />
                    ) : (
                      <Text style={styles.activityInitials}></Text>
                    )}
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>{item.itemName || 'Unnamed Item'}</Text>
                    <Text style={styles.activitySubtitle}>{item.quantity || 0} {item.unit || 'unit'} added</Text>
                    <Text style={styles.activitySubtitle}>Purchased Price - {item.purchasedPrice != null ? item.purchasedPrice.toFixed(2) : 'N/A'} birr</Text>
                  </View>
                  {item.sellingPrice && (
                    <Text style={styles.activityPrice}>{item.sellingPrice.toFixed(2)} birr</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <>
              <View style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <View style={styles.activityTime}>
                    <Clock size={14} color={'#666'} style={{ marginRight: 4 }} />
                    <Text style={styles.timeText}>1hr ago</Text>
                  </View>
                  <View style={styles.activityTag}>
                    <Text style={styles.categoryText}>Nail</Text>
                  </View>
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityImageContainer}>
                    <Text style={styles.activityInitials}></Text>
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>5 mm Nails</Text>
                    <Text style={styles.activitySubtitle}>5.0 kg</Text>
                  </View>
                  <Text style={styles.activityPrice}>180.00 birr</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <View style={styles.activityTime}>
                    <Clock size={14} color={'#666'} style={{ marginRight: 4 }} />
                    <Text style={styles.timeText}>2hr ago</Text>
                  </View>
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityImageContainer}>
                    <Text style={styles.activityInitials}>JK</Text>
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>John Copper</Text>
                    <Text style={styles.activitySubtitle}>Debt Amount - 150.00 birr</Text>
                  </View>
                  <Phone size={20} color={'#666'} />
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <View style={styles.activityTime}>
                    <Clock size={14} color={'#666'} style={{ marginRight: 4 }} />
                    <Text style={styles.timeText}>3hr ago</Text>
                  </View>
                  <View style={styles.activityTag}>
                    <Text style={styles.categoryText}>Paint</Text>
                  </View>
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityImageContainer}>
                    <Image 
                      source={require('../assets/images/icon.png')} 
                      style={{ width: 64, height: 64, borderRadius: 16 }}
                      accessibilityLabel="Red Paint image"
                    />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>Red Paint</Text>
                    <Text style={styles.activitySubtitle}>2 units added</Text>
                    <Text style={styles.activitySubtitle}>Purchased Price - 950.00 birr</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
