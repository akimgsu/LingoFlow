import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProgress } from '../src/contexts/ProgressContext';
import { CATEGORIES } from '../src/constants/categories';
import CategoryCard from '../src/components/CategoryCard';
import { COLORS, RADIUS } from '../src/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { streak, hearts } = useProgress();

  const ListHeader = () => (
    <>
      {/* ── Dark header panel ─────────────────────── */}
      <View style={styles.headerArea}>
        {/* Top row: logo + stats + avatar */}
        <View style={styles.topRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>LF</Text>
          </View>
          <Text style={styles.appName}>LingoFlow</Text>

          <View style={styles.topRight}>
            <View style={styles.statPill}>
              <Ionicons name="flame" size={14} color={COLORS.orange} />
              <Text style={styles.statPillText}>{streak}</Text>
            </View>
            <View style={[styles.statPill, { marginLeft: 8 }]}>
              <Ionicons name="heart" size={14} color={COLORS.pink} />
              <Text style={styles.statPillText}>{hearts}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              activeOpacity={0.8}
              style={styles.avatarBtn}
            >
              <Ionicons name="person" size={15} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero */}
        <Text style={styles.heroTitle}>Lingo Expressions</Text>
        <Text style={styles.heroSub}>Pick a category and start speaking like a native.</Text>
      </View>

      {/* ── Section label ───────────────────────── */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>CATEGORIES</Text>
        <Text style={styles.sectionCount}>{CATEGORIES.length} topics</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={CATEGORIES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CategoryCard item={item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgDeep },

  /* Header */
  headerArea: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.bgHeader,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.violet,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    letterSpacing: -0.3,
  },
  topRight: { flexDirection: 'row', alignItems: 'center' },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E30',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  statPillText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  avatarBtn: {
    marginLeft: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.violet,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.violetLight,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -1.2,
    lineHeight: 44,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '400',
    lineHeight: 22,
  },

  /* Section */
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: 1.5,
  },
  sectionCount: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  listContent: { paddingBottom: 40 },
});
