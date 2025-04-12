import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions
} from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export interface SortOption {
  id: string;
  label: string;
  icon?: 'arrow-up' | 'arrow-down'; // Made icon optional
}

interface SortOptionsProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (option: SortOption) => void;
  options: SortOption[]; // Options can now include items without icons
}

const SortOptions: React.FC<SortOptionsProps> = ({
  visible,
  onClose,
  onSelectOption,
  options
}) => {
  // Handle potentially undefined icon
  const renderIcon = (iconName?: 'arrow-up' | 'arrow-down') => {
    if (!iconName) return null; // Return null if no icon is provided

    switch(iconName) {
      case 'arrow-up':
        return <ArrowUp size={18} color="#000" style={styles.sortIcon} />;
      case 'arrow-down':
        return <ArrowDown size={18} color="#000" style={styles.sortIcon} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sortOptionsContainer}>
          {options.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.sortOption}
              onPress={() => {
                onSelectOption(option);
                onClose();
              }}
            >
              {renderIcon(option.icon)}
              <Text style={styles.sortOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortOptionsContainer: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  sortIcon: {
    marginRight: 10,
  },
  sortOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});

export default SortOptions;
