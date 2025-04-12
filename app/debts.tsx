import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";

export default function DebtsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, overdue, paid
  
  // Mock data for debts
  const [debts] = useState([
    { 
      id: 1, 
      name: "John Copper", 
      amount: 1769.00,
      status: "overdue",
      daysOverdue: 6,
      timeAgo: "2hr ago",
      initials: "JC"
    },
    { 
      id: 2, 
      name: "John Smith", 
      amount: 1769.00,
      status: "paid",
      timeAgo: "2hr ago",
      initials: "JS"
    },
    { 
      id: 3, 
      name: "John Copper", 
      amount: 1769.00,
      status: "overdue",
      daysOverdue: 6,
      timeAgo: "2hr ago",
      initials: "JC"
    },
    { 
      id: 4, 
      name: "John Copper", 
      amount: 1769.00,
      status: "paid",
      timeAgo: "2hr ago",
      initials: "JC"
    },
  ]);
  
  // Filter debts based on active filter
  const filteredDebts = debts.filter(debt => {
    if (activeFilter === "all") return true;
    if (activeFilter === "overdue") return debt.status === "overdue";
    if (activeFilter === "paid") return debt.status === "paid";
    return true;
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Debt List</Text>
        
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/new-debt')}>
        <Plus size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name, job title or phone number"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === "all" && styles.filterTabActive]}
          onPress={() => setActiveFilter("all")}
        >
          <Feather name="filter" size={16} color={activeFilter === "all" ? "#fff" : "#000"} />
          <Text style={[styles.filterText, activeFilter === "all" && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === "overdue" && styles.filterTabActive]}
          onPress={() => setActiveFilter("overdue")}
        >
          <Feather name="clock" size={16} color={activeFilter === "overdue" ? "#fff" : "#000"} />
          <Text style={[styles.filterText, activeFilter === "overdue" && styles.filterTextActive]}>Overdue</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === "paid" && styles.filterTabActive]}
          onPress={() => setActiveFilter("paid")}
        >
          <Feather name="check-circle" size={16} color={activeFilter === "paid" ? "#fff" : "#000"} />
          <Text style={[styles.filterText, activeFilter === "paid" && styles.filterTextActive]}>Paid</Text>
        </TouchableOpacity>
      </View>
      
      {/* Debt List */}
      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.debtItem}>
            {/* Time Ago */}
            <View style={styles.timeContainer}>
              <Feather name="clock" size={14} color="#999" bottom={12} />
              <Text style={styles.timeText}>{item.timeAgo}</Text>
              
              {item.status === "overdue" ? (
                <View style={styles.overdueTag}>
                  <Text style={styles.overdueText}>{item.daysOverdue} days overdue</Text>
                </View>
              ) : (
                <View style={styles.paidTag}>
                  <Text style={styles.paidText}>Paid</Text>
                </View>
              )}
            </View>
            
            {/* Debt Info */}
            <View style={styles.debtInfoContainer}>
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>{item.initials}</Text>
              </View>
              
              <View style={styles.debtDetails}>
                <Text style={styles.debtName}>{item.name}</Text>
                <Text style={styles.debtAmount}>Debt Amount - {item.amount.toFixed(2)} birr</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  addButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  debtItem: {
    borderRadius: 16,
    marginBottom: 16,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    padding: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    flex: 1,
    bottom: 12,
  },
  overdueTag: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  overdueText: {
    fontSize: 12,
    color: '#FF9500',
  },
  paidTag: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paidText: {
    fontSize: 12,
    color: '#288C04',
  },
  debtInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialsContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  initialsText: {
    fontSize: 18,
    fontFamily: "Inter-Medium",
    color: '#333',
  },
  debtDetails: {
    marginLeft: 12,
    flex: 1,
  },
  debtName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: '#000',
    marginBottom: 4,
  },
  debtAmount: {
    fontSize: 14,
    color: '#666',
    fontFamily: "Inter-Medium"
  },
});
