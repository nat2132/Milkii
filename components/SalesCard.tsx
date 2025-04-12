import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts"; // Use LineChart for area effect
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'; // Import date-fns functions

// --- Mock Data (Keep as is) ---
const weeklySalesData = [
  {
    week: 0, data: [ { day: "Sun", value: 7200 }, { day: "Mon", value: 8800 }, { day: "Tue", value: 9200 }, { day: "Wed", value: 10400 }, { day: "Thu", value: 9600 }, { day: "Fri", value: 6900 }, { day: "Sat", value: 5000 }, ], totalSales: 22566.0,
  }, {
    week: 1, data: [ { day: "Sun", value: 8200 }, { day: "Mon", value: 9800 }, { day: "Tue", value: 10200 }, { day: "Wed", value: 11400 }, { day: "Thu", value: 10600 }, { day: "Fri", value: 7900 }, { day: "Sat", value: 6000 }, ], totalSales: 25600.0,
  }, {
    week: -1, data: [ { day: "Sun", value: 6200 }, { day: "Mon", value: 7800 }, { day: "Tue", value: 8200 }, { day: "Wed", value: 9400 }, { day: "Thu", value: 8600 }, { day: "Fri", value: 5900 }, { day: "Sat", value: 4000 }, ], totalSales: 19500.0,
  },
];
// --- End Mock Data ---

interface SalesCardProps {
  currentWeek: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

// --- Constants (Aligned with ProfitCard styling) ---
const SALES_COLOR = "#10B981"; // Emerald green
const MUTED_TEXT_COLOR = "#6B7280"; // Adjusted grey text
const CARD_BACKGROUND = "#FFFFFF";
const MUTED_BACKGROUND = "#F3F4F6"; // Light gray for badge bg (if needed, currently white)
const BORDER_COLOR = "#E5E7EB"; // Border color for buttons/badge
const CHART_HEIGHT = 180; // Consistent chart height
const AXIS_LABEL_COLOR = "#9CA3AF"; // Lighter grey for axis labels
const GRID_COLOR = "#E5E7EB"; // Color for grid lines

// --- Helper Function for Date Range (Same as ProfitCard) ---
const getWeekDateRange = (weekOffset: number): string => {
  const today = new Date();
  const targetWeek = addWeeks(today, weekOffset);
  const start = startOfWeek(targetWeek, { weekStartsOn: 0 });
  const end = endOfWeek(targetWeek, { weekStartsOn: 0 });
  const formatString = 'MMM d';
  return `${format(start, formatString)} - ${format(end, formatString)}`;
};
// --- End Helper Function ---

export default function SalesCard({ currentWeek, onPrevWeek, onNextWeek }: SalesCardProps) {

  const weekData = useMemo(() => {
    return weeklySalesData.find((data) => data.week === currentWeek) || weeklySalesData.find(d => d.week === 0) || weeklySalesData[0];
  }, [currentWeek]);

  // Prepare chart data - Apply axis label style directly
  const chartData = useMemo(() => {
    // NOTE: We reference styles.xAxisLabel directly here.
    return weekData.data.map(item => ({
      value: item.value,
      label: item.day,
      labelTextStyle: styles.xAxisLabel, // Apply style directly
    }));
  }, [weekData]); // Removed styles from deps assuming it's static

  const totalSales = weekData.totalSales;
  const yAxisMaxValue = 12000;
  const dateRange = useMemo(() => getWeekDateRange(currentWeek), [currentWeek]);


  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
         {/* Date Range and Title */}
         <View>
          <Text style={styles.dateText}>{dateRange}</Text>
          <Text style={styles.cardTitle}>Total Sales</Text>
        </View>
        {/* Badge */}
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>In a Week</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
         {/* Use toLocaleString with options for .00 format */}
        <Text style={styles.totalValue}>{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} birr</Text>

        {/* Chart Area - Added paddingRight */}
        <View style={styles.chartContainer}>
        {chartData.length > 0 && (
            <LineChart
              areaChart
              curved
              data={chartData}
              height={CHART_HEIGHT}
              // --- Line & Area Styling ---
              color={SALES_COLOR}
              thickness={2}
              startFillColor={SALES_COLOR}
              endFillColor={SALES_COLOR}
              startOpacity={0.2}
              endOpacity={0.2}
              // --- X Axis ---
              xAxisThickness={0}
              // --- Y Axis ---
              yAxisThickness={0}
              yAxisTextStyle={styles.yAxisLabel}
              yAxisLabelTexts={['0', '3000', '6000', '9000', '12000']}
              noOfSections={4}
              maxValue={yAxisMaxValue}
              yAxisLabelWidth={35} // Keep reasonable
              yAxisSide="left"
              // --- Grid ---
              rulesType="dotted"
              rulesColor={GRID_COLOR}
              dashGap={3}
              dashWidth={1}
              // --- Data Points ---
              hideDataPoints
              // --- Animation ---
              isAnimated
              animationDuration={1200}
              // --- Prevent Overflow / Adjust Spacing ---
              disableScroll // Keep this true
              // --- Explicitly set spacing between points ---
              spacing={42} // << TRY ADDING/ADJUSTING THIS VALUE (e.g., 35, 40, 45)
              // --- Keep initial/end spacing small ---
              initialSpacing={5} // << Keep small (or 0)
              endSpacing={5}     // << Keep small (or 0)
              // ------------------------------------------
            />
          )}
        </View>

        {/* Controls - Use ProfitCard structure */}
        <View style={styles.controlsContainer}>
           {/* Prev Week Button Group */}
          <TouchableOpacity onPress={onPrevWeek} style={styles.navButtonOuterContainer}>
             <View style={styles.iconButton}>
                <ChevronLeft size={20} color={MUTED_TEXT_COLOR} strokeWidth={2} />
             </View>
             <Text style={styles.navText}>Prev week</Text>
          </TouchableOpacity>

          {/* Spacer needed as there's no toggle */}
          <View style={{ flex: 1 }} />

          {/* Next Week Button Group */}
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

// --- Styles (Aligned with ProfitCard styles) ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 12, // Match ProfitCard
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    width: '100%',
    shadowColor: "#444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to top
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    // No bottom border
  },
  dateText: { // Added Date Style
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
    fontFamily: "Inter-Medium",
    marginBottom: 4,
  },
  cardTitle: { // Updated Title Style
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: '#111827',
  },
  headerBadge: { // Updated Badge Style
    backgroundColor: CARD_BACKGROUND,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginTop: 2,
  },
  headerBadgeText: { // Updated Badge Text Style
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
    fontFamily: "Inter-Regular",
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  totalValue: { // Updated Total Value Style
    fontSize: 30,
    fontFamily: "Inter-Bold",
    color: '#111827',
    marginBottom: 20,
  },
  chartContainer: { // Updated Chart Container
    height: CHART_HEIGHT + 30, // Space for labels
    width: '100%',
    marginBottom: 25,
  },
  xAxisLabel: { // Added X Axis Label specific style
    color: AXIS_LABEL_COLOR,
    fontSize: 12,
    paddingTop: 5,
  },
  yAxisLabel: { // Added Y Axis Label specific style
    color: AXIS_LABEL_COLOR,
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  controlsContainer: { // Updated Controls Container
    flexDirection: 'row',
    justifyContent: 'space-between', // Keep space-between
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5, // Slight padding for controls area
  },
  // --- Use Nav Button Structure from ProfitCard ---
  navButtonOuterContainer: {
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CARD_BACKGROUND,
  },
  navText: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
    marginTop: 6,
  },
   // --- End Nav Button Structure ---
});