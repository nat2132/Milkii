import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import CustomerDebtCard from './CustomerDebtCard';

const CustomerDebtCardExample = () => {
  // Sample data for John Smith's debt
  const debtItems = [
    { name: 'Nails', quantity: 2, price: 500.00 },
    { name: 'Paint', quantity: 2, price: 1249.00 },
    { name: 'Screw', quantity: 2, price: 20.00 },
  ];

  // State to toggle between paid and unpaid
  const [isPaid, setIsPaid] = useState(false);

  const handleMarkAsPaid = () => {
    setIsPaid(true);
  };

  const handleMarkAsNotPaid = () => {
    setIsPaid(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Unpaid Example */}
        <CustomerDebtCard
          customerName="John Smith"
          phoneNumber="+(251) 9-123-456"
          debtItems={debtItems}
          isPaid={isPaid}
          daysOverdue={isPaid ? undefined : 6}
          paymentDate={isPaid ? "Jan 15, 2025" : undefined}
          onMarkAsPaid={handleMarkAsPaid}
          onMarkAsNotPaid={handleMarkAsNotPaid}
          onEdit={() => console.log('Edit pressed')}
          onDelete={() => console.log('Delete pressed')}
          onMore={() => console.log('More pressed')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    padding: 16,
  },
});

export default CustomerDebtCardExample;
