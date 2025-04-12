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
  ChevronLeft,
  Plus,
  Package,
  Paintbrush,
  AlertTriangle,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CreateReportForm from '../components/CreateReportForm';

// Define types for report items
interface PriceChangeItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  change: string;
  isIncrease?: boolean;
}

interface DamagedItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

const ReportItemCard: React.FC<{ 
  item: PriceChangeItem,
  color: string 
}> = ({ item, color }) => {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemIconContainer}>
        {item.icon}
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={[styles.itemChange, { color }]}>{item.change}</Text>
    </View>
  );
};

const DamagedItemCard: React.FC<{ 
  item: DamagedItem 
}> = ({ item }) => {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemIconContainer}>
        {item.icon}
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={[styles.itemDamage, { color: '#FF9500' }]}>{item.count} Damaged</Text>
    </View>
  );
};

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentDate = "Jan 31, 2025";
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  // Handle report submission
  const handleSubmitReport = (data: any) => {
    console.log('Report submitted:', data);
    // Here you would typically save the report to your backend
    setShowCreateForm(false); // Hide the form after submission
  };

  // Price increases data
  const priceIncreases: PriceChangeItem[] = [
    {
      id: '1',
      name: 'Nails',
      icon: <Package size={24} color="#666" />,
      change: '+15.00 birr',
      isIncrease: true,
    },
    {
      id: '2',
      name: 'Paint',
      icon: <Paintbrush size={24} color="#666" />,
      change: '+5.00 birr',
      isIncrease: true,
    },
  ];

  // Price decreases data
  const priceDecreases: PriceChangeItem[] = [
    {
      id: '1',
      name: 'Brush',
      icon: <Paintbrush size={24} color="#666" />,
      change: '-$20.00',
      isIncrease: false,
    },
  ];

  // Damaged items data
  const damagedItems: DamagedItem[] = [
    {
      id: '1',
      name: 'Connector',
      icon: <AlertTriangle size={24} color="#FF9500" />,
      count: 3,
    },
  ];

  // If showing create form, render it directly
  if (showCreateForm) {
    return (
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <CreateReportForm 
          onSubmit={handleSubmitReport} 
        />
      </View>
    );
  }

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#000" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity onPress={() => setShowCreateForm(true)}>
          <Plus size={28} color="#007AFF" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Display */}
        <Text style={styles.dateText}>{currentDate}</Text>
        
        {/* Price Increases Section */}
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>Price Increases</Text>
            <Text style={styles.itemCount}>+15 items</Text>
          </View>
          
          {priceIncreases.map((item) => (
            <ReportItemCard 
              key={item.id} 
              item={item} 
              color="#4CD964" // Green color for increases
            />
          ))}
        </View>
        
        {/* Price Decreases Section */}
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>Price Decreases</Text>
            <Text style={[styles.itemCount, styles.decreaseCount]}>-8 items</Text>
          </View>
          
          {priceDecreases.map((item) => (
            <ReportItemCard 
              key={item.id} 
              item={item} 
              color="#FF3B30" // Red color for decreases
            />
          ))}
        </View>
        
        {/* Deformed Items Section */}
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>Deformed Items</Text>
            <Text style={[styles.itemCount, styles.warningCount]}>3 items</Text>
          </View>
          
          {damagedItems.map((item) => (
            <DamagedItemCard 
              key={item.id} 
              item={item}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: '#ffffff', 
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  dateText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginVertical: 15,
    fontFamily: 'Inter-Regular',
  },
  reportCard: {
    borderRadius: 20,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  itemCount: {
    fontSize: 14,
    color: '#4CD964', // Green for increases
    fontFamily: 'Inter-Medium',
  },
  decreaseCount: {
    color: '#FF3B30', // Red for decreases
  },
  warningCount: {
    color: '#FF9500', // Orange for warnings
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  itemChange: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  itemDamage: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});
