import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface DebtItem {
  name: string;
  quantity: number;
  price: number;
}

interface CustomerDebtCardProps {
  customerName: string;
  phoneNumber: string;
  debtItems: DebtItem[];
  isPaid: boolean;
  daysOverdue?: number;
  paymentDate?: string;
  onMarkAsPaid?: () => void;
  onMarkAsNotPaid?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
}

const CustomerDebtCard: React.FC<CustomerDebtCardProps> = ({
  customerName,
  phoneNumber,
  debtItems,
  isPaid,
  daysOverdue,
  paymentDate,
  onMarkAsPaid,
  onMarkAsNotPaid,
  onEdit,
  onDelete,
  onMore,
}) => {
  // Calculate total debt
  const totalDebt = debtItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      {/* Customer Info */}
      <View style={styles.customerInfoContainer}>
        <View style={styles.customerInfo}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={24} color="#000" />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.customerName}>{customerName}</Text>
            <View style={styles.phoneContainer}>
              <Feather name="phone" size={16} color="#888" />
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            </View>
          </View>
        </View>
        
        {/* Status Badge */}
        {isPaid ? (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>Paid</Text>
          </View>
        ) : daysOverdue ? (
          <View style={styles.overdueBadge}>
            <Text style={styles.overdueText}>{daysOverdue} days overdue</Text>
          </View>
        ) : null}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Debt Items */}
      <View style={styles.debtItemsContainer}>
        {debtItems.map((item, index) => (
          <View key={index} style={styles.debtItem}>
            <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
            <Text style={styles.itemPrice}>{item.price.toFixed(2)} birr</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Total Debt */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Debt</Text>
        <Text style={styles.totalAmount}>{totalDebt.toFixed(2)} birr</Text>
      </View>

      {/* Payment Date (only for paid items) */}
      {isPaid && paymentDate && (
        <>
          <View style={styles.divider} />
          <View style={styles.paymentDateContainer}>
            <Text style={styles.paymentDateLabel}>Payment Date</Text>
            <Text style={styles.paymentDate}>{paymentDate}</Text>
          </View>
        </>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Primary Action Button */}
        {isPaid ? (
          <TouchableOpacity 
            style={[styles.actionButton, styles.markAsNotPaidButton]} 
            onPress={onMarkAsNotPaid}
          >
            <Feather name="x-circle" size={20} color="#FFFFFF" />
            <Text style={styles.markAsNotPaidText}>Mark as not Paid</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.markAsPaidButton]} 
            onPress={onMarkAsPaid}
          >
            <Feather name="check-circle" size={20} color="#FFFFFF" />
            <Text style={styles.markAsPaidText}>Mark as Paid</Text>
          </TouchableOpacity>
        )}

        {/* More Button */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.moreButton]} 
          onPress={onMore}
        >
          <Feather name="chevron-up" size={20} color="#000000" />
          <Text style={styles.moreButtonText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Edit and Delete Buttons */}
      <View style={styles.secondaryActionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={onEdit}
        >
          <Feather name="edit-2" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={onDelete}
        >
          <Feather name="trash-2" size={20} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customerInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nameContainer: {
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 4,
  },
  paidBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
  },
  paidText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  overdueBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
  },
  overdueText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  debtItemsContainer: {
    marginBottom: 8,
  },
  debtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    color: '#333333',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  paymentDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentDateLabel: {
    fontSize: 16,
    color: '#333333',
  },
  paymentDate: {
    fontSize: 16,
    color: '#333333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  secondaryActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  markAsPaidButton: {
    backgroundColor: '#34C759',
    flex: 1,
    marginRight: 8,
  },
  markAsPaidText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  markAsNotPaidButton: {
    backgroundColor: '#FF9500',
    flex: 1,
    marginRight: 8,
  },
  markAsNotPaidText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  moreButton: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
  },
  moreButtonText: {
    color: '#000000',
    fontWeight: '500',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginRight: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default CustomerDebtCard;
