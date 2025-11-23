import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const DetailScreen = ({ route }) => {
  const { shelter } = route.params;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const openYouTube = () => {
    if (shelter.youtubeUrl) {
      Linking.openURL(shelter.youtubeUrl);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {shelter.images && shelter.images.length > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {shelter.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: `http://localhost:5000${image.url}` }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>이미지 없음</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{shelter.name}</Text>

        <View style={styles.priceSection}>
          <Text style={styles.price}>{formatPrice(shelter.price)}</Text>
          <View
            style={[
              styles.statusBadge,
              shelter.status === 'available'
                ? styles.statusAvailable
                : styles.statusReserved,
            ]}
          >
            <Text style={styles.statusText}>
              {shelter.status === 'available' ? '이용 가능' : '예약됨'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>위치</Text>
          <Text style={styles.sectionText}>
            {shelter.location.address}
          </Text>
          <Text style={styles.sectionText}>
            {shelter.location.city}, {shelter.location.province}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>설명</Text>
          <Text style={styles.sectionText}>{shelter.description}</Text>
        </View>

        {shelter.size && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>크기</Text>
            <Text style={styles.sectionText}>{shelter.size}</Text>
          </View>
        )}

        {shelter.capacity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>수용 인원</Text>
            <Text style={styles.sectionText}>{shelter.capacity}명</Text>
          </View>
        )}

        {shelter.features && shelter.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>편의시설/특징</Text>
            <View style={styles.featuresList}>
              {shelter.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {shelter.youtubeUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YouTube</Text>
            <TouchableOpacity
              style={styles.youtubeButton}
              onPress={openYouTube}
            >
              <Text style={styles.youtubeButtonText}>YouTube에서 보기</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추가 정보</Text>
          <Text style={styles.infoText}>조회수: {shelter.views}</Text>
          {shelter.rating > 0 && (
            <Text style={styles.infoText}>평점: {shelter.rating}/5</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageScroll: {
    height: 300,
  },
  image: {
    width: width,
    height: 300,
  },
  noImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#757575',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: '#4caf50',
  },
  statusReserved: {
    backgroundColor: '#9e9e9e',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresList: {
    marginTop: 5,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  featureBullet: {
    fontSize: 16,
    color: '#2e7d32',
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  youtubeButton: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  youtubeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default DetailScreen;
