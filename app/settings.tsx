import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Settings state
  const [darkMode, setDarkMode] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  
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
        
        <Text style={[styles.headerTitle]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileIcon}>
              <Feather name="user" size={24} color="#000" />
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>John Doe</Text>
              <TouchableOpacity onPress={() => router.push('/edit-profile')}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Quick Access Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickAccessScrollContent}
          >
            <TouchableOpacity style={styles.quickAccessItem} onPress={() => router.push('/phonebook')}>
              <View style={[styles.quickAccessIcon, { backgroundColor: '#E3F2FD' }]}>
                <Feather name="phone" size={24} color="#2196F3" />
              </View>
              <Text style={styles.quickAccessText}>Phone Book</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessItem} onPress={() => router.push('/debts')}>
              <View style={[styles.quickAccessIcon, { backgroundColor: '#FFF8E1' }]}>
                <Feather name="book" size={24} color="#FFA000" />
              </View>
              <Text style={styles.quickAccessText}>Debt Book</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessItem} onPress={() => router.push('/summary')}>
              <View style={[styles.quickAccessIcon, { backgroundColor: '#E8F5E9' }]}>
                <Feather name="pie-chart" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickAccessText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAccessItem} onPress={() => router.push('/reports')}>
              <View style={[styles.quickAccessIcon, { backgroundColor: '#FDE2E2' }]}>
                <Feather name="file-text" size={24} color="#EF1212" />
              </View>
              <Text style={styles.quickAccessText}>Reports</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* Account Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <View style={styles.settingsListContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Feather name="lock" size={24} color="#000" />
                <Text style={styles.settingText}>Change Password</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#000" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/notifications')}>
              <View style={styles.settingLeft}>
                <Feather name="bell" size={24} color="#000" />
                <Text style={styles.settingText}>Notification Settings</Text>
              </View>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={notificationEnabled ? '#fff' : '#f4f3f4'}
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/language')}>
              <View style={styles.settingLeft}>
                <Feather name="globe" size={24} color="#000" />
                <Text style={styles.settingText}>Translation Settings</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Appearance Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingsListContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Feather name="moon" size={24} color="#000" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>
        
        {/* FAQs and Support */}
        <View style={styles.settingsListContainer}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="help-circle" size={24} color="#000" />
              <Text style={styles.settingText}>FAQs</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="headphones" size={24} color="#000" />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionLabel}>App Version</Text>
          <Text style={styles.versionNumber}>2.1.0</Text>
        </View>
        
        {/* Logout and Delete Account */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: '#000000',
    marginLeft: 16,
    textAlign: 'center',
    flex: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: '#000000',
    marginBottom: 4,
  },
  editProfileText: {
    fontSize: 13,
    color: '#2196F3',
  },
  sectionContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter-Bold",
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  quickAccessScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  quickAccessItem: {
    alignItems: 'center',
    width: 80,
    marginRight: 16,
  },
  quickAccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  settingsListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 16,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  versionLabel: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: '#666666',
    marginTop: 16,
  },
  versionNumber: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: '#666666',
  },
  actionButtonsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  deleteAccountText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: '#F44336',
  },
});
