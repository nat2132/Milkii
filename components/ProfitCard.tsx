import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'; // Import date-fns functions

// --- Mock Data (Keep as is) ---
const weeklyData = [
    {
      week: 0, // Represents the current week
      profit: [ { day: "Sun", value: 4200 }, { day: "Mon", value: 6800 }, { day: "Tue", value: 10200 }, { day: "Wed", value: 5400 }, { day: "Thu", value: 8600 }, { day: "Fri", value: 4900 }, { day: "Sat", value: 6000 }, ],
      expense: [ { day: "Sun", value: 2100 }, { day: "Mon", value: 3400 }, { day: "Tue", value: 5100 }, { day: "Wed", value: 2700 }, { day: "Thu", value: 4300 }, { day: "Fri", value: 2450 }, { day: "Sat", value: 3000 }, ],
      totalProfit: 12566.0, totalExpense: 6250.0,
    },
    {
        week: 1, // Represents next week
        profit: [ { day: "Sun", value: 5200 }, { day: "Mon", value: 7800 }, { day: "Tue", value: 9200 }, { day: "Wed", value: 6400 }, { day: "Thu", value: 7600 }, { day: "Fri", value: 5900 }, { day: "Sat", value: 7000 }, ],
        expense: [ { day: "Sun", value: 2600 }, { day: "Mon", value: 3900 }, { day: "Tue", value: 4600 }, { day: "Wed", value: 3200 }, { day: "Thu", value: 3800 }, { day: "Fri", value: 2950 }, { day: "Sat", value: 3500 }, ],
        totalProfit: 14500.0, totalExpense: 7250.0,
    },
    {
        week: -1, // Represents previous week
        profit: [ { day: "Sun", value: 3200 }, { day: "Mon", value: 5800 }, { day: "Tue", value: 8200 }, { day: "Wed", value: 4400 }, { day: "Thu", value: 7600 }, { day: "Fri", value: 3900 }, { day: "Sat", value: 5000 }, ],
        expense: [ { day: "Sun", value: 1600 }, { day: "Mon", value: 2900 }, { day: "Tue", value: 4100 }, { day: "Wed", value: 2200 }, { day: "Thu", value: 3800 }, { day: "Fri", value: 1950 }, { day: "Sat", value: 2500 }, ],
        totalProfit: 10500.0, totalExpense: 5250.0,
    },
];
// --- End Mock Data ---


interface ProfitCardProps {
  currentWeek: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

// --- Constants (Keep as is from previous version) ---
const PROFIT_COLOR = "#2563EB";
const EXPENSE_COLOR = "#EF4444";
const MUTED_TEXT_COLOR = "#6B7280";
const CARD_BACKGROUND = "#FFFFFF";
const MUTED_BACKGROUND = "#F3F4F6";
const ACTIVE_TOGGLE_BACKGROUND = "#FFFFFF";
const BORDER_COLOR = "#E5E7EB";
const CHART_HEIGHT = 180;
const AXIS_LABEL_COLOR = "#9CA3AF";
const GRID_COLOR = "#E5E7EB";


// --- Helper Function for Date Range (Keep as is) ---
const getWeekDateRange = (weekOffset: number): string => {
  const today = new Date();
  const targetWeek = addWeeks(today, weekOffset);
  const start = startOfWeek(targetWeek, { weekStartsOn: 0 });
  const end = endOfWeek(targetWeek, { weekStartsOn: 0 });
  const formatString = 'MMM d';
  return `${format(start, formatString)} - ${format(end, formatString)}`;
};
// --- End Helper Function ---


export default function ProfitCard({ currentWeek, onPrevWeek, onNextWeek }: ProfitCardProps) {
  const [view, setView] = useState<"profit" | "expense">("profit");

  const weekData = useMemo(() => {
      return weeklyData.find((data) => data.week === currentWeek) || weeklyData.find(d => d.week === 0) || weeklyData[0];
  }, [currentWeek]);

  // Prepare chart data based on the selected view - Apply axis label style here
  const chartData = useMemo(() => {
    const data = view === "profit" ? weekData.profit : weekData.expense;
    const color = view === "profit" ? PROFIT_COLOR : EXPENSE_COLOR;
    // NOTE: We reference styles.xAxisLabel directly here. Make sure styles object is stable or add it to dependency array if needed.
    return data.map(item => ({
      value: item.value,
      label: item.day,
      frontColor: color,
      labelTextStyle: styles.xAxisLabel, // Apply style directly
    }));
  }, [view, weekData]); // Removed styles from deps assuming it's static

  const total = view === "profit" ? weekData.totalProfit : weekData.totalExpense;
  const yAxisMaxValue = 12000;
  const dateRange = useMemo(() => getWeekDateRange(currentWeek), [currentWeek]);

  return (
    <View style={styles.card}>
      {/* Card Header (Keep as is) */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.dateText}>{dateRange}</Text>
          <Text style={styles.cardTitle}>Total {view === "profit" ? "Profit" : "Expense"}</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>In a Week</Text>
        </View>
      </View>

      {/* Card Content (Keep as is) */}
      <View style={styles.cardContent}>
        <Text style={styles.totalValue}>{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} birr</Text>

        {/* Chart Area */}
        <View style={styles.chartContainer}>
          {chartData.length > 0 && (
             <BarChart
                data={chartData}
                // --- ADJUST BAR WIDTH AND SPACING ---
                barWidth={15} // << Smaller bars
                spacing={18}  // << More space between bars
                // ------------------------------------
                height={CHART_HEIGHT}
                barBorderRadius={4}
                // --- X Axis ---
                xAxisThickness={0}
                // --- Y Axis ---
                yAxisThickness={0}
                yAxisTextStyle={styles.yAxisLabel}
                yAxisLabelTexts={['0', '3000', '6000', '9000', '12000']}
                noOfSections={4}
                maxValue={yAxisMaxValue}
                yAxisLabelWidth={35}
                yAxisSide="left"
                // --- Grid ---
                rulesType="dotted"
                rulesColor={GRID_COLOR}
                dashGap={3}
                dashWidth={1}
                // --- Animation ---
                isAnimated
                animationDuration={1200}
                // --- Prevent Overflow ---
                disableScroll
             />
          )}
        </View>

        {/* Controls (Keep as is) */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={onPrevWeek} style={styles.navButtonOuterContainer}>
             <View style={styles.iconButton}>
                <ChevronLeft size={20} color={MUTED_TEXT_COLOR} strokeWidth={2} />
             </View>
             <Text style={styles.navText}>Prev week</Text>
          </TouchableOpacity>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleItem, view === 'profit' ? styles.toggleItemActive : styles.toggleItemInactive]}
              onPress={() => setView('profit')}
            >
              <Text style={[styles.toggleText, view === 'profit' ? styles.toggleTextActive : styles.toggleTextInactive]}>Profit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleItem, view === 'expense' ? styles.toggleItemActive : styles.toggleItemInactive]}
              onPress={() => setView('expense')}
            >
              <Text style={[styles.toggleText, view === 'expense' ? styles.toggleTextActive : styles.toggleTextInactive]}>Expense</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onNextWeek} style={styles.navButtonOuterContainer}>
            <View style={styles.iconButton}>
               <ChevronRight size={20} color={MUTED_TEXT_COLOR} strokeWidth={2} />
            </View>
             <Text style={styles.navText}>Next week</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- Styles (Keep exactly as they were in the previous correct version) ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 12, // Slightly more rounded corners
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    width: '100%',
    // Shadow to match image (optional, adjust values)
    shadowColor: "#444", // Darker shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Softer shadow
    shadowRadius: 5,
    elevation: 3, // Elevation for Android
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to top
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    // Removed bottom border to match image
  },
  dateText: {
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
    fontFamily: "Inter-Medium",
    marginBottom: 4, // Space between date and title
  },
  cardTitle: {
    fontSize: 20, // Slightly larger title
    fontFamily: "Inter-SemiBold", // Bolder title
    color: '#111827', // Darker title color
  },
  headerBadge: {
    // Match image badge style
    backgroundColor: CARD_BACKGROUND, // White background
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16, // Pill shape
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginTop: 2, // Align slightly lower with date
  },
  headerBadgeText: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
    fontFamily: "Inter-Regular",
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16, // Consistent padding
    paddingTop: 8, // Less top padding after removing header border
  },
  totalValue: {
    fontSize: 30, // Match image size
    fontFamily: "Inter-Bold",
    color: '#111827', // Darker text
    marginBottom: 20, // More space before chart
  },
  chartContainer: {
    height: CHART_HEIGHT + 30, // Add more space for labels below
    width: '100%',
    marginBottom: 25, // More space after chart
    paddingRight: 5, // Padding to prevent right overflow
    paddingLeft: 0, // Reduce left padding for Y axis labels
  },
  xAxisLabel: {
    color: AXIS_LABEL_COLOR, // Use specific axis label color
    fontSize: 12,
    paddingTop: 5, // Add space above label if needed
  },
  yAxisLabel: {
    color: AXIS_LABEL_COLOR, // Use specific axis label color
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute items evenly
    alignItems: 'center', // Align vertically
    marginTop: 10,
    paddingHorizontal: 5, // Slight horizontal padding for overall controls
  },
  navButtonOuterContainer: {
    alignItems: 'center', // Center icon and text vertically
  },
  iconButton: {
    width: 36, // Slightly larger icon button
    height: 36,
    borderRadius: 18, // Fully round
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CARD_BACKGROUND, // Ensure white background
  },
  navText: {
    fontSize: 12, // Smaller text below icon
    color: MUTED_TEXT_COLOR,
    marginTop: 6, // Space between icon and text
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: MUTED_BACKGROUND, // Overall background for the toggle area
    borderRadius: 8, // Rounded corners for the group
    overflow: 'hidden', // Clip children
    borderWidth: 1,        // Add border to the group itself if needed
    borderColor: BORDER_COLOR, // Match border color
    marginHorizontal: 10, // Add some space around the toggle
    flexShrink: 1, // Allow toggle to shrink if needed
  },
  toggleItem: {
    paddingVertical: 9, // Adjust vertical padding
    paddingHorizontal: 20, // Adjust horizontal padding
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1, // Allow items to grow equally
  },
  toggleItemActive: {
    backgroundColor: ACTIVE_TOGGLE_BACKGROUND, // White background when active
     borderRadius: 7, // Slightly inner radius for active item 'bubble' effect
     margin: 1, // Small margin to create separation
  },
  toggleItemInactive: {
    backgroundColor: MUTED_BACKGROUND, // Grey background when inactive
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500', // Medium weight
    textAlign: 'center',
  },
  toggleTextActive: {
    color: '#111827', // Dark text when active
  },
  toggleTextInactive: {
    color: MUTED_TEXT_COLOR, // Muted text when inactive
  },
});