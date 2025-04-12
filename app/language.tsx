import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

interface Language {
  id: string;
  name: string;
}

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Available languages
  const languages: Language[] = [
    { id: 'en', name: 'English(US)' },
    { id: 'am', name: 'Amharic' },
    { id: 'ti', name: 'Tigrania' },
    { id: 'or', name: 'Oromo' },
  ];
  
  // Currently selected language
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Handle language selection
  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    // Save selected language to storage or context
    // Then navigate back
    router.back();
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
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Languages</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Selected Language Section */}
        <Text style={styles.sectionTitle}>Selected Language</Text>
        
        <View style={styles.languageCard}>
          <View style={styles.languageItem}>
            <View style={styles.flagContainer}>
              <Feather name="flag" size={24} color="#000" />
            </View>
            <Text style={styles.languageName}>{languages.find(lang => lang.id === selectedLanguage)?.name}</Text>
            <View style={styles.checkboxChecked}>
              <Feather name="check" size={20} color="#FFF" />
            </View>
          </View>
        </View>
        
        {/* All Languages Section */}
        <Text style={styles.sectionTitle}>All Languages</Text>
        
        {languages.map((language) => (
          <View key={language.id} style={styles.languageCard}>
            <TouchableOpacity 
              style={styles.languageItem} 
              onPress={() => handleLanguageSelect(language.id)}
            >
              <View style={styles.flagContainer}>
                <Feather name="flag" size={24} color="#000" />
              </View>
              <Text style={styles.languageName}>{language.name}</Text>
              {selectedLanguage === language.id ? (
                <View style={styles.checkboxChecked}>
                  <Feather name="check" size={20} color="#FFF" />
                </View>
              ) : (
                <View style={styles.checkboxUnchecked} />
              )}
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
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
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 16,
    textAlign: 'center',
    flex: 0.7,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 16,
  },
  languageCard: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
