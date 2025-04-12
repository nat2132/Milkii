import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define interfaces for type safety
interface Notification {
  id: number;
  section: string;
  type: string;
  title: string;
  message: string;
  time: string;
  action: string;
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Mock data for notifications
  const notifications: Notification[] = [
    // Today's notifications
    {
      id: 1,
      section: "Today",
      type: "low_stock",
      title: "Low Stock Alert",
      message: "Stock \"Nails\" is running low on stock (5 items remaining)",
      time: "1 hour ago",
      action: "Restock"
    },
    {
      id: 2,
      section: "Today",
      type: "payment",
      title: "Pending Payments",
      message: "Customer Sarah Smith has an overdue payment of $720.00 (5 days late)",
      time: "1 hour ago",
      action: "Contact"
    },
    // Yesterday's notifications
    {
      id: 3,
      section: "Yesterday",
      type: "low_stock",
      title: "Low Stock Alert",
      message: "Stock \"Paint\" is running low on stock (3 items remaining)",
      time: "1 hour ago",
      action: "Restock"
    },
    {
      id: 4,
      section: "Yesterday",
      type: "payment",
      title: "Pending Payments",
      message: "Customer Sarah Smith has an overdue payment of $720.00 (6 days late)",
      time: "1 hour ago",
      action: "Contact"
    }
  ];
  
  // Group notifications by section
  const sections = [...new Set(notifications.map(item => item.section))];
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <Feather name="alert-triangle" size={24} color="#E53935" />;
      case "payment":
        return <Feather name="clock" size={24} color="#FFC107" />;
      default:
        return <Feather name="bell" size={24} color="#2196F3" />;
    }
  };
  
  // Get notification background color based on type
  const getNotificationBackground = (type: string) => {
    switch (type) {
      case "low_stock":
        return styles.lowStockItem;
      case "payment":
        return styles.paymentItem;
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification</Text>
        
        <TouchableOpacity>
          <Text style={styles.markAllText}>Mark as all read</Text>
        </TouchableOpacity>
      </View>
      
      {/* Notifications List */}
      <ScrollView style={styles.scrollView}>
        {sections.map(section => (
          <View key={section}>
            {/* Section Header */}
            <Text style={styles.sectionTitle}>{section}</Text>
            
            {/* Section Items */}
            {notifications
              .filter(item => item.section === section)
              .map(notification => (
                <View 
                  key={notification.id} 
                  style={[styles.notificationItem, getNotificationBackground(notification.type)]}
                >
                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  
                  {/* Content */}
                  <View style={styles.contentContainer}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <View style={styles.notificationFooter}>
                      <Text style={styles.timeText}>{notification.time}</Text>
                      <TouchableOpacity>
                        <Text style={styles.actionText}>{notification.action}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  markAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  lowStockItem: {
    backgroundColor: '#FFEBEE',
  },
  paymentItem: {
    backgroundColor: '#FFFDE7',
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666666',
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});
