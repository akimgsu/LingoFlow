import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { useProgress } from '../src/contexts/ProgressContext';
import { CATEGORIES } from '../src/constants/categories';
import CategoryCard from '../src/components/CategoryCard';
import { COLORS, RADIUS, SHADOW } from '../src/constants/theme';

export default function HomeScreen() {
  const { user, loading: authLoading, displayName } = useAuth();
  const router = useRouter();
  const { streak, hearts, xp, level, loading: progressLoading } = useProgress();

  // Auth Guard
  if (authLoading || (user && progressLoading)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* ── Top Bar ──────────────────────────────────────── */}
      <View style={styles.topBar}>
        <View style={styles.branding}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>LF</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Hi, {displayName}</Text>
            <Text style={styles.subtitleText}>Ready to master English today?</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push('/profile')}
          activeOpacity={0.7}
          accessibilityLabel="Open Profile"
        >
          <Ionicons name="person-circle-outline" size={28} color={COLORS.accentPurple} />
        </TouchableOpacity>
      </View>

      {/* ── Stats Strip ──────────────────────────────────── */}
      <View style={styles.statsStrip}>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={20} color={COLORS.flame} />
          <View>
            <Text style={styles.statVal}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <Ionicons name="heart" size={20} color={COLORS.heart} />
          <View>
            <Text style={styles.statVal}>{hearts}</Text>
            <Text style={styles.statLabel}>Hearts</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <Ionicons name="flash" size={20} color={COLORS.accentIndigo} />
          <View>
            <Text style={styles.statVal}>{xp}</Text>
            <Text style={styles.statLabel}>XP (Lv.{level})</Text>
          </View>
        </View>
      </View>

      {/* ── Daily Challenge / Quick Start Banner ─────────── */}
      <TouchableOpacity
        style={styles.quickStartBanner}
        onPress={() => router.push({ pathname: '/study', params: { categoryId: 'Daily Conversation' } })}
        activeOpacity={0.85}
      >
        <View style={styles.bannerIconWrap}>
          <FontAwesome5 name="fire" size={20} color={COLORS.orange} />
        </View>
        <View style={styles.bannerTextWrap}>
          <Text style={styles.bannerTitle}>Daily Express Practice</Text>
          <Text style={styles.bannerSub}>
            {CATEGORIES.find((c) => c.id === 'Daily Conversation')?.count ?? 0} everyday conversation phrases
          </Text>
        </View>
        <View style={styles.bannerAction}>
          <Text style={styles.bannerActionText}>Start</Text>
          <Ionicons name="play" size={12} color={COLORS.white} />
        </View>
      </TouchableOpacity>

      {/* ── Section Title ─────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Topics & Categories</Text>
        <Text style={styles.sectionSub}>Select a category to practice flashcards</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <CategoryCard
            item={item}
            onPress={() => router.push({ pathname: '/study', params: { categoryId: item.id } })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    paddingBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 16,
    backgroundColor: COLORS.bgHeader,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsStrip: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  quickStartBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1238',
    marginHorizontal: 18,
    marginTop: 4,
    marginBottom: 16,
    padding: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    ...Platform.select(SHADOW.card),
  },
  bannerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  bannerActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
