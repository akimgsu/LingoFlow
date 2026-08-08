import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, Platform, StatusBar,
} from 'react-native';
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
      router.replace('/login');
    }
  };

  const achievements = [
    { id: 1, title: 'Early Bird',   icon: 'sun',      color: '#FB923C', bg: '#FB923C20' },
    { id: 2, title: '7 Day Streak', icon: 'fire',     color: '#F472B6', bg: '#F472B620' },
    { id: 3, title: 'Fast Learner', icon: 'bolt',     color: '#818CF8', bg: '#818CF820' },
  ];

  const displayName = user?.email ? user.email.split('@')[0] : 'Learner';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user?.email || 'Guest'}</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={26} color="#FB923C" style={styles.statIcon} />
            <Text style={styles.statVal}>{streak}</Text>
            <Text style={styles.statLbl}>Day Streak</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMid]}>
            <Ionicons name="flash" size={26} color="#818CF8" style={styles.statIcon} />
            <Text style={styles.statVal}>{xp.toLocaleString()}</Text>
            <Text style={styles.statLbl}>Total XP</Text>
          </View>
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
        {achievements.map(item => (
          <View key={item.id} style={styles.achieveCard}>
            <View style={[styles.achieveIcon, { backgroundColor: item.bg }]}>
              <FontAwesome5 name={item.icon} size={18} color={item.color} />
            </View>
            <Text style={styles.achieveTitle}>{item.title}</Text>
            <Ionicons name="checkmark-circle" size={20} color={item.color} />
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color="#F472B6" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A12' },
  scroll: { paddingHorizontal: 22, paddingBottom: 48, paddingTop: 24 },

  hero: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#6D28D9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: '#6D28D9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  avatarInitial: { color: '#fff', fontSize: 32, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '700', color: '#F1F5F9', marginBottom: 4, letterSpacing: -0.5 },
  email: { fontSize: 14, color: '#4B5563', fontWeight: '500' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 36 },
  statCard: {
    flex: 1,
    backgroundColor: '#13131F',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1E30',
  },
  statCardMid: {},
  statIcon: { marginBottom: 8 },
  statVal: { fontSize: 24, fontWeight: '800', color: '#F1F5F9', marginBottom: 4 },
  statLbl: { fontSize: 12, color: '#4B5563', fontWeight: '600', letterSpacing: 0.5 },

  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#4B5563',
    letterSpacing: 1.5, marginBottom: 14,
  },
  achieveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131F',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E1E30',
  },
  achieveIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  achieveTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#E2E8F0' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    backgroundColor: '#13131F',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#F472B640',
  },
  logoutText: { color: '#F472B6', fontSize: 15, fontWeight: '600' },
});
