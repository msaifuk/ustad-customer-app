import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native';
import api from '../utils/api';

const STATUS_COLORS = {
  pending: '#f59e0b',
  accepted: '#3b82f6',
  on_the_way: '#8b5cf6',
  arrived: '#06b6d4',
  in_progress: '#f97316',
  completed: '#10b981',
  cancelled: '#ef4444',
};

const STATUS_LABELS = {
  pending: '⏳ Pending',
  accepted: '✅ Accepted',
  on_the_way: '🚗 On the way',
  arrived: '📍 Arrived',
  in_progress: '🔧 In Progress',
  completed: '✅ Completed',
  cancelled: '❌ Cancelled',
};

export default function MyBookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/customer');
      setBookings(response.data.bookings);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6353f7" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Koi booking nahi hai</Text>
          <Text style={styles.emptySubtitle}>
            Abhi pehli booking karein!
          </Text>
          <TouchableOpacity
            style={styles.bookNowBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.bookNowText}>Services Dekhein</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bookingsList}>
          {bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>

              <View style={styles.bookingHeader}>
                <Text style={styles.serviceName}>
                  {booking.service_name || 'Service'}
                </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: STATUS_COLORS[booking.status] + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: STATUS_COLORS[booking.status] }
                  ]}>
                    {STATUS_LABELS[booking.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <Text style={styles.detailText}>
                  📍 {booking.address}
                </Text>
                {booking.worker_name && (
                  <Text style={styles.detailText}>
                    👷 {booking.worker_name} — {booking.worker_level}
                  </Text>
                )}
                <Text style={styles.detailText}>
                  💰 PKR {booking.amount}
                </Text>
                <Text style={styles.detailText}>
                  🕐 {new Date(booking.created_at).toLocaleDateString('en-PK')}
                </Text>
              </View>

              {booking.status === 'completed' && (
                <TouchableOpacity
                  style={styles.rateBtn}
                  onPress={() => navigation.navigate('RateWorker', { booking })}
                >
                  <Text style={styles.rateBtnText}>⭐ Rate Worker</Text>
                </TouchableOpacity>
              )}

            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backText: {
    color: '#6353f7',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  bookNowBtn: {
    backgroundColor: '#6353f7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  bookNowText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bookingsList: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bookingDetails: {
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  rateBtn: {
    backgroundColor: '#fff9e6',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  rateBtnText: {
    color: '#f59e0b',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSpace: {
    height: 40,
  },
});