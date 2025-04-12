import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Make sure @expo/vector-icons is installed
import QRCode from 'react-native-qrcode-svg'; // Make sure react-native-qrcode-svg and react-native-svg are installed
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';

// --- Interfaces reflecting the target design's data structure ---
interface ColorInfo {
  name: string;
  quantity: number; // Quantity specific to this color (e.g., 12 cans)
  code: string;     // Hex color code (e.g., '#34C759' for the green)
}

interface SpecificationEntry {
  title: string;      // e.g., "Base Type"
  description: string; // e.g., "Water-based"
}

interface ProductDetailViewProps {
  name: string;                  // "Green Paint"
  category?: string;              // "Paint"
  purchasedPrice: number;        // 900.00 (per can)
  sellingPrice: number;          // 950.00 (per can)
  quantity: number;              // 5 (number of packs)
  unit?: string;                  // "pack"
  company?: string;               // "Rodas Inc."
  quantityPerPack?: number;       // 12 (cans per pack)
  itemPerPackUnit?: string;       // Unit for items in a pack (e.g., "can")
  sellingQuantity?: number;       // Selling quantity
  sellingUnit?: string;           // Unit for selling (e.g., "can")
  colors?: ColorInfo[];
  description?: string;
  specificationsList?: SpecificationEntry[];
  lastUpdated?: string;           // "March 15, 2025 14:30"
  imageUrl?: string;              // URL for the top image (legacy support)
  imageUrls?: string[];           // URLs for all product images
  qrData?: string;                // Data for the QR code
  onEdit?: () => void;
  onDelete?: () => void;
  onSaveQr?: () => void;           // Action for the save button
}

// --- Component Implementation ---
const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  name,
  category,
  purchasedPrice,
  sellingPrice,
  quantity,
  unit = '',
  company,
  quantityPerPack,
  itemPerPackUnit = 'piece', // Default to 'piece' if not provided
  sellingQuantity = 1, // Default to 1 if not provided
  sellingUnit = 'unit', // Default to 'unit' if not provided
  colors = [],
  imageUrls = [],
  description,
  specificationsList = [],
  lastUpdated,
  imageUrl,
  qrData,
  onEdit,
  onDelete,
  onSaveQr,
}) => {
  // Provide default no-op functions if not supplied
  const handleEdit = onEdit || (() => {});
  const handleDelete = onDelete || (() => {});

  // Calculated Profit - Matches image logic (Per Can)
  const estimatedProfit = sellingPrice - purchasedPrice;

  // Removed primaryColor logic, will map all colors below

  // Get all image URLs or use the legacy imageUrl
  const resolvedImageUrls = imageUrls || (imageUrl ? [imageUrl] : []);
  // Placeholder image if none provided
  const displayImage = resolvedImageUrls.length > 0 ? { uri: resolvedImageUrls[0] } : require('../assets/images/icon.png');
  
  // State to track the currently displayed image index
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Add a ref for the horizontal scroll view
  const horizontalScrollViewRef = React.useRef<ScrollView>(null);

  // Add a ref for capturing the QR code
  const qrCodeRef = React.createRef<ViewShot>();

  // Update the save QR code function
  const handleSaveQr = async () => {
    if (!qrCodeRef.current) return;

    try {
      const uri = await qrCodeRef.current?.capture?.();
      if (!uri) {
        throw new Error('Failed to capture QR code.');
      }
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Please grant permission to save images.');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('QR Codes', asset, false);

      Alert.alert('Success', 'QR code saved to your phone.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save QR code. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Image Gallery */}
      <View style={styles.imageContainer}>
        {/* Horizontal Scrollable Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const width = event.nativeEvent.layoutMeasurement.width;
            if (width > 0) {
              const currentIndex = Math.round(contentOffsetX / width);
              if (currentIndex >= 0 && currentIndex < resolvedImageUrls.length) {
                setCurrentImageIndex(currentIndex);
              }
            }
          }}
          scrollEventThrottle={16}
          ref={horizontalScrollViewRef}
        >
          {resolvedImageUrls.length > 0 ? (
            resolvedImageUrls.map((url, index) => (
              <View key={`image-container-${index}`} style={styles.imageWrapper}>
                <Image
                  key={`image-${index}`}
                  source={{ uri: url }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ))
          ) : (
            <View style={styles.imageWrapper}>
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
        </ScrollView>
        
        {/* Image Indicators */}
        {resolvedImageUrls.length > 1 && (
          <View style={styles.imageIndicators}>
            {resolvedImageUrls.map((_, index) => (
              <TouchableOpacity 
                key={`indicator-${index}`} 
                style={[styles.imageIndicator, currentImageIndex === index && styles.activeImageIndicator]}
                onPress={() => {
                  setCurrentImageIndex(index);
                  // Scroll to the selected image
                  if (horizontalScrollViewRef.current) {
                    horizontalScrollViewRef.current.scrollTo({
                      x: index * Dimensions.get('window').width,
                      animated: true
                    });
                  }
                }}
              />
            ))}
          </View>
        )}

        {/* Action Buttons Overlay */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.circleButton} onPress={handleEdit}>
            <Feather name="edit-2" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleButtonDelete} onPress={handleDelete}>
            <Feather name="trash-2" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Below Image */}
      <View style={styles.contentContainer}>
        {/* Product Name and Category */}
        <View style={styles.headerRow}>
          <Text style={styles.productName}>{name}</Text>
          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Prices (Per Can) */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{`Purchase Price per ${sellingQuantity} ${sellingUnit}:`}</Text>
          <Text style={styles.infoValue}>{purchasedPrice.toFixed(2)} birr</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{`Selling Price per ${sellingQuantity} ${sellingUnit}:`}</Text>
          <Text style={styles.infoValue}>{sellingPrice.toFixed(2)} birr</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{`Estimated Profit per ${sellingQuantity} ${sellingUnit}:`}</Text>
          <Text style={styles.infoValue}>{estimatedProfit.toFixed(2)} birr</Text>
        </View>

        <View style={styles.divider} />

        {/* Details */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantity:</Text>
          <Text style={styles.infoValue}>{quantity} {unit}</Text>
        </View>
        {company && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Company:</Text>
            <Text style={styles.infoValue}>{company}</Text>
          </View>
        )}
        {unit === 'pack' && quantityPerPack !== undefined && ( // Show only if unit is 'pack' AND quantityPerPack is provided
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quantity Per Pack:</Text>
            <Text style={styles.infoValue}>{quantityPerPack} {itemPerPackUnit}</Text>
          </View>
        )}

        {/* Display All Colors Info */}
        {colors.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Colors</Text>
            {colors.map((color, index) => {
              const colorQuantity = typeof color.quantity === 'number' 
                ? color.quantity 
                : parseInt(color.quantity as string, 10) || 0;

              return (
                <View key={`color-${index}`} style={styles.colorInfoRow}>
                  <View style={styles.colorValueContainer}>
                    <View style={[styles.colorDot, { backgroundColor: color.code }]} />
                    <Text style={styles.colorInfoText}>
                      {color.name} (Qty: {colorQuantity})
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {(company || (unit === 'pack' && quantityPerPack !== undefined) || colors.length > 0) && <View style={styles.divider} />}

        {/* Description */}
        {description && (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </>
        )}

        {/* Specifications */}
        {specificationsList.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, description ? { marginTop: 16 } : {}]}>Specification</Text>
            {specificationsList.map((spec, idx) => (
              <View key={idx} style={styles.specItem}>
                <Text style={styles.specBullet}>•</Text>
                <Text style={styles.specText}>
                  {spec.title}{spec.description ? `: ${spec.description}` : ''}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* QR Code */}
        {qrData && (
          <>
            <Text style={[styles.sectionTitle, specificationsList.length > 0 ? { marginTop: 20 } : {}]}>Qr Code</Text>
            <View style={styles.qrContainer}>
              <ViewShot ref={qrCodeRef} options={{ format: 'png', quality: 1.0 }}>
                <QRCode value={qrData} size={150} />
              </ViewShot>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveQr}>
              <Feather name="download" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <View style={styles.lastUpdatedContainer}>
            <Feather name="clock" size={14} color="#888" />
            <Text style={styles.lastUpdatedText}>Last Updated: {lastUpdated}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // Image gallery styles
  thumbnailsContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    height: 60,
    paddingHorizontal: 10,
  },
  thumbnailsContent: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
    padding: 8, // Larger touch target
  },
  activeImageIndicator: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
  },
  imageWrapper: {
    width: Dimensions.get('window').width,
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: -32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    alignItems: 'center',
    height: 64,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  circleButtonDelete: {
    width: 60,
    height: 60,
    borderRadius: 32,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  contentContainer: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#18181B',
    flexShrink: 1,
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52525B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E7',
    marginVertical: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
    marginRight: 8,
    flexShrink: 1,
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#18181B',
    textAlign: 'right',
    flexShrink: 0,
    marginLeft: 10,
  },
  colorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: '#696974',
  },
  colorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorInfoText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#18181B',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#18181B',
    marginBottom: 8,
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#52525B',
    lineHeight: 22,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  specItem: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  specBullet: {
    fontSize: 16,
    color: '#71717A',
    marginRight: 8,
    lineHeight: 22,
    width: 12,
  },
  specText: {
    fontSize: 15,
    color: '#52525B',
    flex: 1,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#18181B',
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 160,
    marginBottom: 18,
    marginTop: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 0,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  lastUpdatedText: {
    fontSize: 13,
    color: '#71717A',
    marginLeft: 8,
    fontWeight: '400',
  },
  quantityText: {
    fontSize: 14,
    color: '#52525B',
    fontWeight: '500',
  },
});

export default ProductDetailView;
