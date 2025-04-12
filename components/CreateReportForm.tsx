import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ChevronLeft, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

type ReportType = 'priceIncrease' | 'priceDecrease' | 'itemDeform';

interface CreateReportFormProps {
  onSubmit: (data: {
    type: ReportType;
    itemName: string;
    price?: string;
    defectedCount?: string;
    priceChange: string;
  }) => void;
}

const CreateReportForm: React.FC<CreateReportFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const [reportType, setReportType] = useState<ReportType>('priceIncrease');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [defectedCount, setDefectedCount] = useState('');
  const [priceChange, setPriceChange] = useState('');

  useEffect(() => {
    if (reportType === 'priceIncrease') {
      setPriceChange('+25 birr');
    } else if (reportType === 'priceDecrease') {
      setPriceChange('-25 birr');
    } else {
      setPriceChange('+25 birr');
    }
  }, [reportType]);

  const handleSubmit = () => {
    onSubmit({
      type: reportType,
      itemName,
      price: reportType !== 'itemDeform' ? itemPrice : undefined,
      defectedCount: reportType === 'itemDeform' ? defectedCount : undefined,
      priceChange,
    });
  };

  const getPriceChangeLabel = () => {
    if (reportType === 'priceIncrease') return 'Price Increased:';
    if (reportType === 'priceDecrease') return 'Price Decreased:';
    return 'Non-Defective Items:';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </Button>
        <Label style={styles.headerTitle}>Create Report</Label>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Label style={styles.sectionTitle}>Select issue type:</Label>

        {/* Price Increase Option */}
        <Button
          variant="outline"
          style={[
            styles.optionCard,
            reportType === 'priceIncrease' && styles.optionCardSelected,
          ]}
          onPress={() => setReportType('priceIncrease')}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconContainer, styles.increaseIconBg]}>
              <TrendingUp size={24} color="#FF6B00" />
            </View>
            <Label style={styles.optionText}>Price Increase</Label>
          </View>
          <View
            style={[
              styles.radioButton,
              reportType === 'priceIncrease' && styles.radioButtonSelected,
            ]}
          >
            {reportType === 'priceIncrease' && <View style={styles.radioInner} />}
          </View>
        </Button>

        {/* Price Decrease Option */}
        <Button
          variant="outline"
          style={[
            styles.optionCard,
            reportType === 'priceDecrease' && styles.optionCardSelected,
          ]}
          onPress={() => setReportType('priceDecrease')}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconContainer, styles.decreaseIconBg]}>
              <TrendingDown size={24} color="#FF6B00" />
            </View>
            <Label style={styles.optionText}>Price Decrease</Label>
          </View>
          <View
            style={[
              styles.radioButton,
              reportType === 'priceDecrease' && styles.radioButtonSelected,
            ]}
          >
            {reportType === 'priceDecrease' && <View style={styles.radioInner} />}
          </View>
        </Button>

        {/* Item Deform Option */}
        <Button
          variant="outline"
          style={[
            styles.optionCard,
            reportType === 'itemDeform' && styles.optionCardSelected,
          ]}
          onPress={() => setReportType('itemDeform')}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconContainer, styles.deformIconBg]}>
              <AlertTriangle size={24} color="#FF6B00" />
            </View>
            <Label style={styles.optionText}>Item Deform</Label>
          </View>
          <View
            style={[
              styles.radioButton,
              reportType === 'itemDeform' && styles.radioButtonSelected,
            ]}
          >
            {reportType === 'itemDeform' && <View style={styles.radioInner} />}
          </View>
        </Button>

        <Label style={styles.inputLabel}>Item Name</Label>
        <Input
          value={itemName}
          onChangeText={setItemName}
          placeholder="Enter item name"
        />

        {reportType !== 'itemDeform' ? (
          <>
            <Label style={styles.inputLabel}>Item Price</Label>
            <Input
              value={itemPrice}
              onChangeText={setItemPrice}
              placeholder="Enter item price"
              keyboardType="numeric"
            />
          </>
        ) : (
          <>
            <Label style={styles.inputLabel}>Number of Item Defected</Label>
            <Input
              value={defectedCount}
              onChangeText={setDefectedCount}
              placeholder="Enter number of defected items"
              keyboardType="numeric"
            />
          </>
        )}

        <View style={styles.priceChangeContainer}>
          <Label style={styles.priceChangeLabel}>{getPriceChangeLabel()}</Label>
          <Label
            style={[
              styles.priceChangeValue,
              reportType === 'priceDecrease' ? styles.priceDecreaseText : styles.priceIncreaseText,
            ]}
          >
            {priceChange}
          </Label>
        </View>

        <Button style={styles.submitButton} onPress={handleSubmit}>
          Submit Report
        </Button>
      </View>

      <View style={styles.divider} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: '#007AFF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
  },
  increaseIconBg: {},
  decreaseIconBg: {},
  deformIconBg: {},
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  inputLabel: {
    fontSize: 16,
    color: '#696974',
    marginTop: 16,
    marginBottom: 8,
  },
  priceChangeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 16,
  },
  priceChangeLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  priceChangeValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceIncreaseText: {
    color: '#4CD964',
  },
  priceDecreaseText: {
    color: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginTop: 24,
  },
});

export default CreateReportForm;
