import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, TextInput, ScrollView
} from 'react-native';
import api from '../utils/api';

export default function RateWorkerScreen({ navigation, route }) {
  const { booking } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await api.post('/ratings', {
        booking_id: booking.id,
        rating,
        review,
      });

      Alert.alert(
        '⭐ Shukriya!',
        'Aapka review submit ho gaya!',
        [{ text: 'OK', onPress: () => navigation.navigate('MyBookings') }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Rate Your Worker</Text>

        {/* Worker Info */}
        <View style={styles.workerCard}>
          <View style={styles.workerAvatar}>
            <Text style={styles.workerAvatarText}>👷</Text>
          </View>
          <View>
            <Text style={styles.workerName}>{booking.worker_name}</Text>
            <Text style={styles.workerLevel}>{booking.worker_level}</Text>
            <Text style={styles.workerService}>{booking.service_name}</Text>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Rating dein:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Text style={[
                  styles.star,
                  { color: star <= rating ? '#f59e0b' : '#ddd' }
                ]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 0 && 'Star select karein'}
            {rating === 1 && '😞 Bahut Bura'}
            {rating === 2 && '😐 Theek Nahi'}
            {rating === 3 && '🙂 Theek Hai'}
            {rating === 4 && '😊 Acha Tha'}
            {rating === 5 && '🤩 Zabardast!'}
          </Text>
        </View>

        {/* Review */}
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewLabel}>
            Review likhein (Optional):
          </Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Worker ke baare mein kuch likhein..."
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading || rating === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Rating</Text>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  inner: {
    padding: 20,
    paddingTop: 50,
  },
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: '#6353f7',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 24,
  },
  workerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0eeff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerAvatarText: {
    fontSize: 28,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  workerLevel: {
    fontSize: 13,
    color: '#6353f7',
    fontWeight: '500',
  },
  workerService: {
    fontSize: 13,
    color: '#888',
  },
  ratingContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  star: {
    fontSize: 48,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  reviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  submitBtn: {
    backgroundColor: '#6353f7',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});