import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const SERVICE_ICONS = {
  'Electrician': '⚡',
  'Plumber': '🔧',
  'Painter': '🎨',
  'Carpenter': '🪚',
  'AC Technician': '❄️',
  'Welder': '🔥',
  'Mechanic': '🔩',
  'General Labor': '👷',
};

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/workers/services');
      setServices(response.data.services);
    } catch (error) {
      console.log('Error fetching services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Group services by category
  const categories = [...new Set(services.map(s => s.category))];

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6353f7" />
        <Text style={styles.loadingText}>Loading services...</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Assalam o Alaikum! 👋</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Koi bhi kaam</Text>
        <Text style={styles.bannerSubtitle}>Verified workers — seedha aapke ghar</Text>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>✓ Verified Workers</Text>
        </View>
      </View>

      {/* My Bookings button (moved down, away from the top of the screen) */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MyBookings')}
        style={styles.myBookingsBtn}
      >
        <Text style={styles.myBookingsText}>📋 My Bookings</Text>
      </TouchableOpacity>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Services</Text>

      {categories.map((category) => (
        <View key={category} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryIcon}>
              {SERVICE_ICONS[category] || '🔨'}
            </Text>
            <Text style={styles.categoryTitle}>{category}</Text>
          </View>

          {services
            .filter(s => s.category === category)
            .map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => navigation.navigate('BookService', { service })}
              >
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDesc}>{service.description}</Text>
                  <Text style={styles.serviceDuration}>
                    ⏱ {service.duration_minutes} minutes
                  </Text>
                </View>
                <View style={styles.servicePriceContainer}>
                  <Text style={styles.servicePrice}>
                    PKR {service.fixed_price}
                  </Text>
                  <View style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      ))}

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
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  logoutBtn: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#666',
    fontSize: 13,
  },
  banner: {
    backgroundColor: '#6353f7',
    margin: 16,
    borderRadius: 16,
    padding: 24,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    marginBottom: 16,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  myBookingsBtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6353f7',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  myBookingsText: {
    color: '#6353f7',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categorySection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 11,
    color: '#aaa',
  },
  servicePriceContainer: {
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6353f7',
    marginBottom: 8,
  },
  bookBtn: {
    backgroundColor: '#6353f7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 40,
  },
});