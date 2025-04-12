import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'; // Import date-fns functions

// --- Mock Data (Keep as is) ---
const weeklyItemsData = [
  {
    week: 0, data: [ { day: "Sun", value: 55 }, { day: "Mon", value: 65 }, { day: "Tue", value: 35 }, { day: "Wed", value: 40 }, { day: "Thu", value: 45 }, { day: "Fri", value: 35 }, { day: "Sat", value: 10 }, ], totalItems: 40,
  }, {
    week: 1, data: [ { day: "Sun", value: 60 }, { day: "Mon", value: 70 }, { day: "Tue", value: 40 }, { day: "Wed", value: 45 }, { day: "Thu", value: 50 }, { day: "Fri", value: 40 }, { day: "Sat", value: 15 }, ], totalItems: 48,
  }, {
    week: -1, data: [ { day: "Sun", value: 50 }, { day: "Mon", value: 60 }, { day: "Tue", value: 30 }, { day: "Wed", value: 35 }, { day: "Thu", value: 40 }, { day: "Fri", value: 30 }, { day: "Sat", value: 5 }, ], totalItems: 35,
  },
];
// --- End Mock Data ---

interface ItemsCardProps {
  currentWeek: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

// --- Constants (Aligned with ProfitCard/SalesCard styling) ---
const ITEM_COLOR = "#F59E0B"; // Amber
const MUTED_TEXT_COLOR = "#6B7280"; // Adjusted grey text
const CARD_BACKGROUND = "#FFFFFF";
// const MUTED_BACKGROUND = "#F3F4F6"; // Not used directly here, but kept for context
const BORDER_COLOR = "#E5E7EB"; // Border color for buttons/badge
const CHART_HEIGHT = 180; // Consistent chart height
const AXIS_LABEL_COLOR = "#9CA3AF"; // Lighter grey for axis labels
const GRID_COLOR = "#E5E7EB"; // Color for grid lines

// --- Helper Function for Date Range (Same as other cards) ---
const getWeekDateRange = (weekOffset: number): string => {
  const today = new Date();
  const targetWeek = addWeeks(today, weekOffset);
  const start = startOfWeek(targetWeek, { weekStartsOn: 0 });
  const end = endOfWeek(targetWeek, { weekStartsOn: 0 });
  const formatString = 'MMM d';
  return `${format(start, formatString)} - ${format(end, formatString)}`;
};
// --- End Helper Function ---


export default function ItemsCard({ currentWeek, onPrevWeek, onNextWeek }: ItemsCardProps) {

  const weekData = useMemo(() => {
    return weeklyItemsData.find((data) => data.week === currentWeek) || weeklyItemsData.find(d => d.week === 0) || weeklyItemsData[0];
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

  const totalItems = weekData.totalItems;
  const yAxisMaxValue = 100; // Match the original Y-axis domain
  const dateRange = useMemo(() => getWeekDateRange(currentWeek), [currentWeek]);

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
         {/* Date Range and Title */}
         <View>
          <Text style={styles.dateText}>{dateRange}</Text>
          <Text style={styles.cardTitle}>Total Sold Items</Text>
        </View>
        {/* Badge */}
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>In a Week</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Text style={styles.totalValue}>{totalItems} Items</Text>

        {/* Chart Area - Added paddingRight */}
        <View style={styles.chartContainer}>
          {chartData.length > 0 && (
            <LineChart
              data={chartData}
              height={CHART_HEIGHT}
              curved // Smooth line like type="natural"
              // --- Line Styling ---
              color={ITEM_COLOR}
              thickness={2} // strokeWidth={2}
              // --- Data Points ---
              hideDataPoints // Equivalent to dot={false}
              focusEnabled // Keep focus effect
              showStripOnFocus
              stripHeight={CHART_HEIGHT}
              stripColor={ITEM_COLOR}
              stripOpacity={0.1}
              focusedDataPointColor={ITEM_COLOR}
              focusedDataPointRadius={6}
              dataPointLabelShiftY={-10}
              dataPointLabelShiftX={0}
              // --- X Axis ---
              xAxisThickness={0} // axisLine={false}
            //   xAxisLabelTextStyle={styles.xAxisLabel} // Applied in data map
              // --- Y Axis ---
              yAxisThickness={0} // axisLine={false}
              yAxisTextStyle={styles.yAxisLabel}
              yAxisLabelTexts={['0', '25', '50', '75', '100']} // Manual labels for ticks
              noOfSections={4} // Corresponds to the 4 intervals (0-25, 25-50, etc.)
              maxValue={yAxisMaxValue} // domain={[0, 100]}
              yAxisLabelWidth={35} // Consistent width
              yAxisSide="left"
              // --- Grid ---
              rulesType="dotted" // Dotted grid lines
              rulesColor={GRID_COLOR}
              dashGap={3}
              dashWidth={1}
              // --- Animation ---
              isAnimated
              animationDuration={1200} // Adjust speed
              // --- Prevent Overflow / Adjust Spacing ---
              disableScroll // Keep this true
              spacing={42}      // << Explicit spacing between points
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

          {/* Spacer */}
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

// --- Styles (Aligned with ProfitCard/SalesCard styles) ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 12, // Match other cards
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
    fontFamily: "Inter-Regular",
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
    fontFamily: "Inter-Regular"
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