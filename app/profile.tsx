import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { useProgress } from '../src/contexts/ProgressContext';
import { COLORS, RADIUS, SHADOW } from '../src/constants/theme';
import { Achievement } from '../src/types';
import { confirmAction, showMessage } from '../src/utils/dialog';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, displayName, loading: authLoading } = useAuth();
  const { streak, xp, level, levelProgress, nextLevelXp, masteredIds, loading: progressLoading } = useProgress();

  if (authLoading || progressLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  const handleLogout = () => {
    confirmAction({
      title: 'Log Out',
      message: 'Are you sure you want to log out of LingoFlow?',
      confirmLabel: 'Log Out',
      onConfirm: async () => {
        try {
          await logout();
          router.replace('/login');
        } catch {
          showMessage('Log Out Failed', 'Please try again.');
        }
      },
    });
  };

  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'First Step',
      description: 'Completed your first expression',
      icon: 'walking',
      color: COLORS.accentIndigo,
      unlocked: xp >= 15,
    },
    {
      id: 2,
      title: 'Streak Starter',
      description: 'Maintained a consecutive study streak',
      icon: 'fire',
      color: COLORS.flame,
      unlocked: streak >= 1,
    },
    {
      id: 3,
      title: 'Vocabulary Builder',
      description: 'Mastered 10 or more expressions',
      icon: 'brain',
      color: COLORS.accentIdioms,
      unlocked: masteredIds.length >= 10,
    },
    {
      id: 4,
      title: 'Centurion Learner',
      description: 'Earned over 200 Total XP',
      icon: 'crown',
      color: '#F59E0B',
      unlocked: xp >= 200,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDeep} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── User Avatar Hero ──────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.name}>{displayName}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv. {level}</Text>
            </View>
          </View>
          <Text style={styles.email}>{user?.email || 'Guest User'}</Text>

          {/* ── Level Progress Bar ───────────────────── */}
          <View style={styles.levelProgressCard}>
            <View style={styles.levelProgressHeader}>
              <Text style={styles.levelProgressLabel}>Level {level} Progress</Text>
              <Text style={styles.levelProgressValue}>{xp} / {nextLevelXp} XP</Text>
            </View>
            <View style={styles.levelTrack}>
              <View style={[styles.levelFill, { width: `${levelProgress}%` as any }]} />
            </View>
          </View>
        </View>

        {/* ── Core Statistics Grid ───────────────────── */}
        <Text style={styles.sectionHeader}>STUDY STATISTICS</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={COLORS.flame} style={styles.statIcon} />
            <Text style={styles.statVal}>{streak}</Text>
            <Text style={styles.statLbl}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flash" size={24} color={COLORS.accentIndigo} style={styles.statIcon} />
            <Text style={styles.statVal}>{xp.toLocaleString()}</Text>
            <Text style={styles.statLbl}>Total XP</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-circle" size={24} color={COLORS.success} style={styles.statIcon} />
            <Text style={styles.statVal}>{masteredIds.length}</Text>
            <Text style={styles.statLbl}>Mastered</Text>
          </View>
        </View>

        {/* ── Achievements List ──────────────────────── */}
        <Text style={styles.sectionHeader}>ACHIEVEMENTS</Text>
        <View style={styles.achievementsList}>
          {achievements.map((item) => (
            <View
              key={item.id}
              style={[styles.achieveCard, !item.unlocked && styles.achieveCardLocked]}
            >
              <View
                style={[
                  styles.achieveIcon,
                  {
                    backgroundColor: item.unlocked ? item.color + '20' : COLORS.border,
                  },
                ]}
              >
                <FontAwesome5
                  name={item.icon}
                  size={16}
                  color={item.unlocked ? item.color : COLORS.textDim}
                />
              </View>
              <View style={styles.achieveTextGroup}>
                <Text
                  style={[
                    styles.achieveTitle,
                    !item.unlocked && styles.achieveTitleLocked,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.achieveDesc}>{item.description}</Text>
              </View>
              <Ionicons
                name={item.unlocked ? 'checkmark-circle' : 'lock-closed'}
                size={20}
                color={item.unlocked ? item.color : COLORS.textDim}
              />
            </View>
          ))}
        </View>

        {/* ── Sign Out Action ────────────────────────── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.75}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.pink} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgDeep,
  },
  safe: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    paddingTop: 16,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select(SHADOW.avatar),
  },
  avatarInitial: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '800',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  levelBadge: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  email: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 18,
  },
  levelProgressCard: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  levelProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelProgressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  levelProgressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accentPurple,
  },
  levelTrack: {
    height: 6,
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  levelFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    marginBottom: 6,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLbl: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  achievementsList: {
    gap: 8,
    marginBottom: 28,
  },
  achieveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  achieveCardLocked: {
    opacity: 0.6,
  },
  achieveIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achieveTextGroup: {
    flex: 1,
  },
  achieveTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  achieveTitleLocked: {
    color: COLORS.textSecondary,
  },
  achieveDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.pink + '40',
  },
  logoutText: {
    color: COLORS.pink,
    fontSize: 15,
    fontWeight: '700',
  },
});
