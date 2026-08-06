import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProgress } from '../src/contexts/ProgressContext';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', title: 'Daily Greetings', icon: 'comments', count: 20, color: '#58CC02', bgColor: '#E5F9D5' },
  { id: '2', title: 'At the Restaurant', icon: 'utensils', count: 15, color: '#FF9600', bgColor: '#FFF0D9' },
  { id: '3', title: 'Travel & Airport', icon: 'plane', count: 30, color: '#1CB0F6', bgColor: '#DDF4FF' },
  { id: '4', title: 'Business Talk', icon: 'briefcase', count: 25, color: '#CE82FF', bgColor: '#F6E5FF' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { streak, hearts } = useProgress();

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => router.push({ pathname: '/study', params: { categoryId: item.id } })}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.bgColor, borderColor: item.color }]}>
        <FontAwesome5 name={item.icon} size={28} color={item.color} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categoryCount}>{item.count} Expressions</Text>
      </View>
      <View style={styles.playButton}>
        <Text style={styles.playButtonText}>START</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Gamified Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.statBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>{streak}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.heartEmoji}>❤️</Text>
            <Text style={styles.heartCount}>{hearts}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>Ready for a lesson?</Text>
        
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={renderCategory}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
    marginBottom: 20,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 20,
    marginRight: 4,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9600',
  },
  heartEmoji: {
    fontSize: 18,
    marginRight: 4,
  },
  heartCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4B4B',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1CB0F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3C3C3C',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 40,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 6, // Chunky 3D effect
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  cardInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#AFAFAF',
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: '#58CC02',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderColor: '#46A302',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  }
});
