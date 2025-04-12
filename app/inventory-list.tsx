import React, { useState, useEffect, useMemo, useRef } from 'react'; // Import useRef
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Dimensions, // Keep Dimensions if used elsewhere, otherwise remove
    Platform // For potential platform-specific styles
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Search,
    Calendar,
    MapPin, // Keeping as per original code, though 'Tag' might be more conventional
    Clock,
    Filter // Changed from ArrowDownNarrowWide
} from 'lucide-react-native';
// Import types from store and components
import { useInventoryStore, InventoryItem } from '../stores/useInventoryStore'; // Adjust path if needed
import DatePicker from '../components/DatePicker'; // Ensure path is correct
import SortOptions, { SortOption } from '../components/SortOptions'; // Ensure path is correct, import SortOption

// Define simple local type for Category Options
interface CategoryOption {
    id: string;
    label: string;
}

// Define specific sort IDs (optional, but good for type safety)
type SortOptionId = 'highest_price' | 'lowest_price' | 'newest' | 'oldest';


export default function InventoryListScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const lastTapRef = useRef<{ [key: string]: number }>({}); // Add ref for tap tracking

    // State for UI controls
    const [searchQuery, setSearchQuery] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);

    // State for filtering/sorting criteria
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Allow null for no date filter
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null); // Use local CategoryOption type
    const [selectedSort, setSelectedSort] = useState<SortOption | null>(null); // Use imported SortOption type

    // --- Options Data ---
    // Use imported SortOption type, provide specific IDs
    const sortOptions: SortOption[] = [
        { id: 'highest_price' as SortOptionId, label: 'Highest Price', icon: 'arrow-up' },
        { id: 'lowest_price' as SortOptionId, label: 'Lowest Price', icon: 'arrow-down' },
        { id: 'newest' as SortOptionId, label: 'Newest', icon: 'arrow-up' }, // Sort by addedAt descending
        { id: 'oldest' as SortOptionId, label: 'Oldest', icon: 'arrow-down' }, // Sort by addedAt ascending
    ];

    // Example Category options - Fetch or define as needed
    // Use local CategoryOption type
    const categoryOptions: CategoryOption[] = [
        { id: 'all', label: 'All Categories' },
        { id: 'Nails', label: 'Nails' }, // Match category names in data
        { id: 'Paint', label: 'Paint' }, // Match category names in data
        // Add other categories from your data
    ];

    // --- Store Data ---
    // Assuming store provides data matching the updated InventoryItem interface
    const inventoryItems = useInventoryStore((state) => state.inventoryList);
    const loadInventoryList = useInventoryStore((state) => state.loadInventoryList);

    useEffect(() => {
        loadInventoryList();
        // Note: If loadInventoryList causes re-renders affecting state,
        // ensure it's stable or handle dependencies correctly.
    }, [loadInventoryList]); // Added dependency


    // --- Filtering and Sorting Logic ---
    const filteredAndSortedItems = useMemo(() => {
        let items = [...inventoryItems];

        // 1. Filter by Search Query (case-insensitive)
        if (searchQuery) {
            items = items.filter(item =>
                item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.itemCategory.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2. Filter by Date (comparing year, month, day)
        if (selectedDate) {
            items = items.filter(item => {
                const itemDate = item.addedAt; // addedAt is already a Date from the store
                // Ensure itemDate is valid before comparing
                if (!(itemDate instanceof Date) || isNaN(itemDate.getTime())) return false;
                return itemDate.getFullYear() === selectedDate.getFullYear() &&
                       itemDate.getMonth() === selectedDate.getMonth() &&
                       itemDate.getDate() === selectedDate.getDate();
            });
        }

        // 3. Filter by Category
        if (selectedCategory && selectedCategory.id !== 'all') {
            items = items.filter(item => item.itemCategory === selectedCategory.id);
        }

        // 4. Sort
        if (selectedSort) {
            items.sort((a, b) => {
                switch (selectedSort.id) {
                    case 'highest_price':
                        return b.purchasedPrice - a.purchasedPrice;
                    case 'lowest_price':
                        return a.purchasedPrice - b.purchasedPrice;
                    case 'newest':
                        // addedAt is already a Date from the store
                        // Add checks for invalid dates just in case
                        return (b.addedAt?.getTime() ?? 0) - (a.addedAt?.getTime() ?? 0);
                    case 'oldest':
                        return (a.addedAt?.getTime() ?? 0) - (b.addedAt?.getTime() ?? 0);
                    default:
                        return 0;
                }
            });
        }

        return items;
    }, [inventoryItems, searchQuery, selectedDate, selectedCategory, selectedSort]);


    // --- Rendering ---

    // Helper to format relative time (replace with a library like date-fns if needed)
    const formatRelativeTime = (date: Date): string => {
        const now = new Date();
        const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
        const diffMinutes = Math.round(diffSeconds / 60);
        const diffHours = Math.round(diffMinutes / 60);
        const diffDays = Math.round(diffHours / 24);

        if (diffSeconds < 60) return `${diffSeconds}s ago`;
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}hr ago`; // Match image
        if (diffDays === 1) return `Yesterday`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(); // Fallback for older dates
    };

    // --- Tap Handling ---
    const handleTap = (item: InventoryItem) => {
        const now = Date.now();
        const itemId = item?.id;
        if (!itemId) return; // Prevent errors if item or id is missing

        const lastTap = lastTapRef.current[itemId] || 0;
        if (now - lastTap < 300) { // 300ms threshold for double tap
          router.push(`/product-detail?itemId=${itemId}`);
        }
        lastTapRef.current[itemId] = now;
      };


    const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
        <TouchableOpacity
            style={styles.inventoryItem}
            onPress={() => handleTap(item)} // Call handleTap on press
            activeOpacity={0.8} // Optional: Adjust feedback opacity
        >
             {/* Time and Category Badge Row */}
             <View style={styles.topRow}>
                <View style={styles.timeContainer}>
                    <Clock size={14} color="#8E8E93" />
                    <Text style={styles.timeText}>{formatRelativeTime(item.addedAt)}</Text>
                </View>
                 {/* Category Badge - Adjusted style */}
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.itemCategory}</Text>
                </View>
            </View>

            {/* Main Content Row */}
            <View style={styles.itemContent}>
                <Image
                    // Choose source based on available data: prioritize imageUris, fallback to imageUri, then placeholder
                    source={
                        item.imageUris && item.imageUris.length > 0
                            ? { uri: item.imageUris[item.mainImageIndex ?? 0] } // Use main image or first from array
                            : item.imageUri // Fallback to legacy single URI
                            ? { uri: item.imageUri }
                            : require('../assets/images/icon.png') // Default placeholder
                    }
                    style={styles.itemImage}
                    resizeMode="cover" // 'cover' might look better than 'contain' for product images
                    accessibilityLabel={`${item.itemName} image`}
                />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.itemName}</Text>
                    {/* Formatted Quantity - Handle optional unit */}
                    <Text style={styles.itemQuantity}>
                        {`${item.quantity} ${item.unit || ''} added`}
                    </Text>
                    {/* Formatted Price */}
                    <Text style={styles.itemPrice}>
                        Purchased Price - {item.purchasedPrice.toFixed(2)} birr
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Inventory Record</Text>
                <View style={{ width: 24 }} /> {/* Spacer for centering title */}
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Search size={20} color="#8E8E93" style={styles.searchIcon}/>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for Inventory..."
                    placeholderTextColor="#8E8E93"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    clearButtonMode="while-editing" // iOS clear button
                />
            </View>

            {/* Filter Options */}
            <View style={styles.filterOptions}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowDatePicker(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Filter by date"
                >
                    <Calendar size={16} color="#555" />
                    <Text style={styles.filterButtonText}>Date</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowCategoryOptions(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Filter by category"
                >
                    {/* Using MapPin as per original code, consider 'Tag' if available/preferred */}
                    <MapPin size={16} color="#555" />
                    <Text style={styles.filterButtonText}>Category</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowSortOptions(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Sort items"
                >
                    {/* Changed Icon */}
                    <Filter size={16} color="#555" />
                    <Text style={styles.filterButtonText}>Sort</Text>
                </TouchableOpacity>
            </View>

            {/* Inventory List */}
            <FlatList
                data={filteredAndSortedItems} // Use the filtered/sorted data
                renderItem={renderInventoryItem}
                keyExtractor={(item) => item.id}
                style={styles.inventoryList}
                contentContainerStyle={styles.inventoryListContent}
                ListEmptyComponent={ // Show message when list is empty
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>No inventory items match your criteria.</Text>
                    </View>
                }
            />

            {/* --- Modals --- */}

            {/* Date Picker Modal */}
            {showDatePicker && ( // Conditionally render for performance
                <DatePicker
                    visible={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    onSelectDate={(date) => {
                        setSelectedDate(date);
                        setShowDatePicker(false); // Close after selection
                        console.log('Selected date:', date);
                    }}
                    selectedDate={selectedDate || new Date()} // Pass current date if null
                />
            )}

            {/* Sort Options Modal */}
            {showSortOptions && (
                <SortOptions // Use the generic SortOptions component
                    visible={showSortOptions}
                    onClose={() => setShowSortOptions(false)}
                    onSelectOption={(option) => {
                        // No need to assert type if options are correctly typed
                        setSelectedSort(option);
                        setShowSortOptions(false);
                        console.log('Selected sort option:', option.id);
                    }}
                    options={sortOptions} // Pass the specific sort options
                    // Removed invalid title prop
                />
            )}

            {/* Category Options Modal */}
            {showCategoryOptions && (
                 <SortOptions // Reuse SortOptions component
                    visible={showCategoryOptions}
                    onClose={() => setShowCategoryOptions(false)}
                    onSelectOption={(option) => {
                         // option is of type SortOption (imported), but we need CategoryOption
                         // Since CategoryOption is a subset of SortOption (without icon),
                         // we can directly use the relevant properties.
                         setSelectedCategory({ id: option.id, label: option.label });
                         setShowCategoryOptions(false);
                         console.log('Selected category:', option.id);
                    }}
                    options={categoryOptions} // Pass category options (compatible now as icon is optional)
                    // Removed invalid title prop
                />
            )}

        </View>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Slightly off-white background might be closer
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 18, // Slightly smaller
        fontFamily: 'Inter-Bold', // Use SemiBold or Bold
        flex: 1,
        textAlign: 'center',
        color: '#111', // Darker text
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // White background for search
        borderRadius: 25, // Pill shape
        marginHorizontal: 15,
        marginTop: 15, // Add margin top
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 5 : 4, // Adjust padding for height
        borderWidth: 1,
        borderColor: '#E0E0E0', // Lighter border color
    },
     searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#000',
        fontFamily: 'Inter-Regular',
        marginLeft: 5, // Use margin from icon instead
    },
    filterOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Keep space-between
        paddingHorizontal: 15, // Match search margin
        marginVertical: 15,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15, // Adjust padding
        paddingVertical: 8, // Adjust padding
        borderWidth: 1,
        borderColor: '#D0D0D0', // Slightly darker border than search
        borderRadius: 20, // Pill shape
        backgroundColor: '#FFFFFF', // White background
        // Removed flex: 1
        marginHorizontal: 4, // Add small horizontal margin between buttons
    },
    filterButtonText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium', // Use Medium
        marginLeft: 6, // Adjust spacing
        color: '#333', // Darker text
    },
    inventoryList: {
        flex: 1, // Ensure FlatList takes available space
    },
    inventoryListContent: {
        paddingHorizontal: 15, // Consistent padding
        paddingBottom: 20, // Padding at the bottom
    },
    inventoryItem: {
        backgroundColor: '#fff',
        borderRadius: 8, // Slightly less rounded corners
        padding: 15,
        marginBottom: 12, // Adjust spacing
        borderWidth: 1,
        borderColor: '#ECECEC', // Lighter border
        shadowColor: "#000", // Optional: Add subtle shadow like iOS cards
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.00,
        elevation: 1, // Android shadow
    },
     topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12, // Space below top row
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // Takes space on the left
    },
    timeText: {
        fontSize: 12, // Slightly smaller
        color: '#8E8E93',
        fontFamily: 'Inter-Regular',
        marginLeft: 4, // Adjust spacing
    },
    categoryBadge: {
        // Removed absolute positioning
        paddingHorizontal: 10,
        paddingVertical: 4, // Adjust padding
        backgroundColor: '#F0F0F0', // Light gray background
        borderRadius: 15, // Pill shape
    },
    categoryText: {
        fontSize: 11, // Smaller text
        color: '#444', // Darker gray
        fontFamily: 'Inter-Medium',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 55, // Slightly larger image
        height: 55, // Slightly larger image
        borderRadius: 6, // Match item border radius
        marginRight: 12, // Adjust spacing
        backgroundColor: '#F0F0F0', // Background while loading
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold', // SemiBold for name
        marginBottom: 4, // Adjust spacing
        color: '#111',
    },
    itemQuantity: {
        fontSize: 13,
        color: '#555', // Darker gray
        fontFamily: 'Inter-Regular',
        marginBottom: 4, // Adjust spacing
    },
    itemPrice: {
        fontSize: 13,
        color: '#555', // Darker gray
        fontFamily: 'Inter-Regular',
    },
     emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50, // Add some margin top
        paddingHorizontal: 20,
    },
    emptyListText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
});
