import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ProductDetailCardProps {
  name: string;
  category?: string;
  price: number;
  discount?: number;
  vat?: number;
  quantity: number;
  company?: string;
  color?: string;
  totalPrice: number;
  description?: string;
  specifications?: { label: string; value: string }[];
  lastUpdated?: string;
  imageUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  name,
  category,
  price,
  discount = 0,
  vat = 0,
  quantity,
  company,
  color,
  totalPrice,
  description,
  specifications = [],
  lastUpdated,
  imageUrl,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={imageUrl ? { uri: imageUrl } : require('../assets/placeholder.png')} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
            <Feather name="edit-2" size={20} color="#0066FF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
            <Feather name="trash-2" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Product Header */}
      <View style={styles.header}>
        <Text style={styles.productName}>{name}</Text>
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
      </View>
      
      {/* Price Information */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Price/Unit:</Text>
          <Text style={styles.infoValue}>{price.toFixed(2)} birr</Text>
        </View>
        
        {discount > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Discount:</Text>
            <Text style={[styles.infoValue, styles.discountText]}>-{discount.toFixed(2)} birr</Text>
          </View>
        )}
        
        {vat > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>VAT (20%):</Text>
            <Text style={styles.infoValue}>{vat.toFixed(2)} birr</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantity:</Text>
          <Text style={styles.infoValue}>{quantity} piece{quantity !== 1 ? 's' : ''}</Text>
        </View>
        
        {company && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Company:</Text>
            <Text style={styles.infoValue}>{company}</Text>
          </View>
        )}
        
        {color && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Color:</Text>
            <View style={styles.colorContainer}>
              <View style={[styles.colorDot, { backgroundColor: color.toLowerCase() }]} />
              <Text style={styles.infoValue}>{color}</Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Total Price */}
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceLabel}>Total Price:</Text>
        <Text style={styles.totalPriceValue}>{totalPrice.toFixed(2)} birr</Text>
      </View>
      
      {/* Description */}
      {description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      )}
      
      {/* Specifications */}
      {specifications.length > 0 && (
        <View style={styles.specificationsContainer}>
          <Text style={styles.sectionTitle}>Specification</Text>
          <View style={styles.specsList}>
            {specifications.map((spec, index) => (
              <View key={index} style={styles.specItem}>
                <Feather name="circle" size={8} color="#333" style={styles.bulletPoint} />
                <Text style={styles.specText}>{spec.label}: {spec.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Last Updated */}
      {lastUpdated && (
        <View style={styles.lastUpdatedContainer}>
          <Feather name="clock" size={14} color="#888" />
          <Text style={styles.lastUpdatedText}>Last Updated: {lastUpdated}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#000000',
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  discountText: {
    color: '#FF3B30',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  totalPriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  descriptionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  specificationsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  specsList: {
    marginTop: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    marginRight: 8,
  },
  specText: {
    fontSize: 14,
    color: '#666666',
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 6,
  },
});

export default ProductDetailCard;
