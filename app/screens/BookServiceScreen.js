import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import api from '../utils/api';

export default function BookServiceScreen({ navigation, route }) {
  const { service } = route.params;
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (address.trim().length < 5) {
      Alert.alert('Error', 'Please enter your full address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/bookings', {
        service_id: service.id,
        address: address.trim(),
        latitude: 33.5651,
        longitude: 73.0169,
        notes,
      });

      const { worker } = response.data;

      setLoading(false);

      Alert.alert(
        '🎉 Booking Confirmed!',
        `Worker: ${worker.name}\nTrade: ${worker.trade}\nLevel: ${worker.level}\nRating: ⭐ ${worker.rating || 'New'}\n\nWo jald hi aapke paas pohunchenge!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MyBookings')
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      const data = error.response?.data;

      if (data?.code === 'NO_WORKER_AVAILABLE') {
        // Nothing was booked - the server found no free worker for this trade.
        Alert.alert(
          'No worker available right now',
          `${data.message}\n\nAbhi koi ${service.category} free nahi hai. Thori der baad dobara try karein.`,
          [{ text: 'OK' }]
        );
      } else if (error.response?.status === 401) {
        Alert.alert('Session expired', 'Please log out and log in again.');
      } else {
        Alert.alert('Error', data?.message || 'Booking failed. Check your internet and try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner}>

        {/* Header */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Service Details */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceCategory}>{service.category}</Text>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDesc}>{service.description}</Text>
          <View style={styles.serviceFooter}>
            <Text style={styles.servicePrice}>PKR {service.fixed_price}</Text>
            <Text style={styles.serviceDuration}>⏱ {service.duration_minutes} min</Text>
          </View>
        </View>

        {/* Booking Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Booking Details</Text>

          <Text style={styles.label}>Your Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Ghar ka pura address likhein..."
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Koi khas baat batana chahte hain? Likhein..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />

          {/* Price Summary */}
          <View style={styles.priceSummary}>
            <Text style={styles.priceSummaryTitle}>Price Summary</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee</Text>
              <Text style={styles.priceValue}>PKR {service.fixed_price}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Platform Fee</Text>
              <Text style={styles.priceValue}>PKR 0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>PKR {service.fixed_price}</Text>
            </View>
            <Text style={styles.cashNote}>💵 Cash payment on completion</Text>
          </View>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={handleBooking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.bookBtnText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  inner: {
    padding: 16,
    paddingTop: 50,
  },
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: '#6353f7',
    fontSize: 16,
    fontWeight: '500',
  },
  serviceCard: {
    backgroundColor: '#6353f7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  serviceCategory: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  serviceName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 16,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  servicePrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  serviceDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
    textAlignVertical: 'top',
  },
  priceSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  priceSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    color: '#666',
    fontSize: 14,
  },
  priceValue: {
    color: '#333',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#1a1a2e',
    fontSize: 15,
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#6353f7',
    fontSize: 15,
  },
  cashNote: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  bookBtn: {
    backgroundColor: '#6353f7',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});