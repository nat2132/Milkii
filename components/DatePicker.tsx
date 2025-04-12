import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions
} from 'react-native';
// Import Calendar component and types from the library
import { Calendar, DateData } from 'react-native-calendars';
// Keep icons if needed for other parts, though the calendar provides its own arrows
// import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Helper function to format Date object to 'YYYY-MM-DD' string
const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate?: Date;
  minDate?: Date; // Optional: Add minDate prop
  maxDate?: Date; // Optional: Add maxDate prop
}

const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  onClose,
  onSelectDate,
  selectedDate = new Date(), // Default to today if none provided
  minDate,
  maxDate,
}) => {
  // State to hold the date currently highlighted/selected *within* the modal
  const [currentSelectedDate, setCurrentSelectedDate] = useState(selectedDate);

  // Update internal state if the selectedDate prop changes while modal is open or when it opens
  useEffect(() => {
    if (visible) {
      setCurrentSelectedDate(selectedDate);
    }
  }, [visible, selectedDate]);

  // Handler for when a day is pressed in the calendar
  const handleDayPress = (day: DateData) => {
    // DateData.dateString is 'YYYY-MM-DD'. Convert it back to a Date object.
    // Be mindful of timezone differences if precision is critical.
    // new Date(string) can sometimes be off by a day depending on timezone.
    // A safer approach might involve parsing year, month, day and creating Date object.
    // For simplicity here, we use the dateString directly. Add T00:00:00 for consistency.
    const newSelectedDate = new Date(`${day.dateString}T00:00:00`);
    setCurrentSelectedDate(newSelectedDate);
  };

  // Handler for the final selection confirmation
  const handleConfirmSelection = () => {
    onSelectDate(currentSelectedDate); // Pass the internally selected date
    onClose(); // Close the modal
  };

  // Memoize markedDates object to prevent unnecessary re-renders
  const markedDates = useMemo(() => {
    const formattedDate = formatDateToString(currentSelectedDate);
    return {
      [formattedDate]: {
        selected: true,
        selectedColor: '#007AFF', // Match original selected style
        // disableTouchEvent: true, // Optionally disable touch event on selected day
        // selectedTextColor: '#ffffff', // Already default in most themes
      },
    };
  }, [currentSelectedDate]);

  // Memoize min/max date strings
  const minDateString = useMemo(() => minDate ? formatDateToString(minDate) : undefined, [minDate]);
  const maxDateString = useMemo(() => maxDate ? formatDateToString(maxDate) : undefined, [maxDate]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade" // Or "slide" or "none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose} // Close modal when tapping outside
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          {/* Prevent taps inside the content from closing the modal */}
          <Calendar
            // Set the initially visible month based on the current selection
            current={formatDateToString(currentSelectedDate)}
            // Handler for day press
            onDayPress={handleDayPress}
            // Mark the selected date
            markedDates={markedDates}
            // Optional: Set min/max selectable dates
            minDate={minDateString}
            maxDate={maxDateString}
            // Optional: Customize appearance
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#8E8E93', // Color for SUN, MON, etc.
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#007AFF',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#007AFF',
              selectedDotColor: '#ffffff',
              arrowColor: '#007AFF', // Color for month navigation arrows
              monthTextColor: '#000', // Color for month title
              indicatorColor: 'blue',
              textDayFontFamily: 'Inter-Regular',
              textMonthFontFamily: 'Inter-Bold',
              textDayHeaderFontFamily: 'Inter-Regular',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
              // ... other theme properties
            }}
            // Optional: Hide days of other months
            hideExtraDays={true}
            // Optional: Set first day of week (0 = Sunday, 1 = Monday)
            firstDay={0} // Sunday
            // Style the container if needed
             style={styles.calendarStyle}
          />

          <View style={styles.datePickerActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={handleConfirmSelection} // Use the confirm handler
            >
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
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
  // Renamed from datePickerContainer to modalContent for clarity
  modalContent: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20, // Padding top/bottom for content
    paddingHorizontal: 0, // Calendar often manages its own horizontal padding/margins
    alignItems: 'stretch', // Ensure children stretch horizontally
  },
  calendarStyle: {
     marginBottom: 10, // Add space between calendar and buttons
     // Add border radius if the calendar itself should be rounded inside the modal content
     // borderRadius: 8,
     // paddingHorizontal: 10, // Adjust if needed
  },
  // Removed monthSelector, weekDaysRow, calendarGrid, calendarDay, selectedDay,
  // calendarDayText, selectedDayText as they are handled by the library
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10, // Adjusted margin
    paddingHorizontal: 20, // Add horizontal padding back for buttons
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular', // Ensure you have these fonts linked
    color: '#000', // Default text color
  },
  selectButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter-Medium', // Ensure you have these fonts linked
  },
});

export default DatePicker;