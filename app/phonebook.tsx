import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Phone,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react-native';

interface Contact {
  id: string;
  name: string;
  company: string;
  initials: string;
}

export default function PhoneBookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  
  // Mock data for contacts
  const contacts: { [key: string]: Contact[] } = {
    'A': [
      { id: '1', name: 'Alex Brown', company: 'Tech solutions Inc.', initials: 'AB' },
      { id: '2', name: 'Anna King', company: 'Digital Marketing Co.', initials: 'AK' },
    ],
    'B': [
      { id: '3', name: 'Ben Parker', company: 'Supply Chain Ltd.', initials: 'BP' },
    ],
  };
  
  const handleMorePress = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDropdown(true);
  };
  
  const handleEditContact = () => {
    // Handle edit contact action
    console.log('Edit contact:', selectedContact?.name);
    setShowDropdown(false);
  };
  
  const handleDeleteContact = () => {
    // Handle delete contact action
    console.log('Delete contact:', selectedContact?.name);
    setShowDropdown(false);
  };
  
  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );
  
  const renderContactItem = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <View style={styles.initialsCircle}>
        <Text style={styles.initialsText}>{item.initials}</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactCompany}>{item.company}</Text>
      </View>
      
      <TouchableOpacity style={styles.callButton}>
        <Phone size={20} color="#007AFF" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.moreButton} onPress={() => {
        setSelectedContact(item);
        setShowDropdown(true);
      }}>
        <MoreVertical size={20} color="#8E8E93" />
      </TouchableOpacity>
    </View>
  );
  
  // Convert contacts object to sections array for SectionList
  const sections = Object.keys(contacts).map(key => ({
    title: key,
    data: contacts[key],
  }));
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/new-contact')}>
          <Plus size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name, job title or phone number"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Contacts List */}
      <FlatList
        data={[
          { title: 'A', data: contacts['A'] },
          { title: 'B', data: contacts['B'] },
        ]}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.data.map(contact => (
              <View key={contact.id}>
                {renderContactItem({ item: contact })}
              </View>
            ))}
          </View>
        )}
        keyExtractor={item => item.title}
      />
      
      {/* Dropdown */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleEditContact}>
              <Edit size={20} color="#007AFF" />
              <Text style={styles.dropdownItemText}>Edit</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.dropdownItem} onPress={handleDeleteContact}>
              <Trash2 size={20} color="#FF3B30" />
              <Text style={[styles.dropdownItemText, { color: '#FF3B30' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter-Regular',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  initialsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  initialsText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginBottom: 4,
  },
  contactCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  callButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 10,
  },
});
