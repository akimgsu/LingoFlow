import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { useAuth } from '../src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useProgress } from '../src/contexts/ProgressContext';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { streak, xp } = useProgress();
  const router = useRouter();

  const handleLogout = async () => {
    if (user?.email) {
      await auth.signOut();
    } else {
      // Guest mode logout handling
      router.replace('/login');
    }
  };

  const achievements = [
    { id: 1, title: 'Early Bird', icon: 'sun', color: '#FF9600', bgColor: '#FFF0D9' },
    { id: 2, title: '7 Day Streak', icon: 'fire', color: '#FF4B4B', bgColor: '#FFE5E5' },
    { id: 3, title: 'Fast Learner', icon: 'bolt', color: '#1CB0F6', bgColor: '#DDF4FF' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color="#FFF" />
          </View>
          <Text style={styles.nameText}>{user?.email ? user.email.split('@')[0] : 'Guest Learner'}</Text>
          <Text style={styles.joinedText}>Joined August 2026</Text>
        </View>

        {/* Gamified Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { borderColor: '#E5E5E5' }]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#E5E5E5' }]}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={styles.statValue}>{xp.toLocaleString()}</Text>

            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((item) => (
            <View key={item.id} style={styles.achievementCard}>
              <View style={[styles.achievementIcon, { backgroundColor: item.bgColor }]}>
                <FontAwesome5 name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.achievementTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* Settings / Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutBtnText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1CB0F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E5E5E5',
    marginBottom: 15,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3C3C3C',
    marginBottom: 5,
  },
  joinedText: {
    fontSize: 14,
    color: '#AFAFAF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderBottomWidth: 6,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3C3C3C',
  },
  statLabel: {
    fontSize: 13,
    color: '#AFAFAF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  section: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3C3C3C',
    marginBottom: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C3C3C',
  },
  logoutBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 6,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutBtnText: {
    color: '#FF4B4B',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  }
});
