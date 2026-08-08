import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Category } from '../types';
import { COLORS, RADIUS } from '../constants/theme';

interface Props {
  item: Category;
}

export default function CategoryCard({ item }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/study', params: { categoryId: item.id } })}
      activeOpacity={0.75}
    >
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: item.accent }]} />

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: item.accent + '20' }]}>
        <FontAwesome5 name={item.icon} size={20} color={item.accent} />
      </View>

      {/* Text */}
      <View style={styles.textGroup}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.count}>{item.count} expressions</Text>
      </View>

      {/* Arrow */}
      <View style={[styles.arrowWrap, { borderColor: item.accent + '55' }]}>
        <Ionicons name="arrow-forward" size={16} color={item.accent} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    paddingRight: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  accentBar: {
    width: 4,
    height: 36,
    borderRadius: 4,
    marginLeft: 14,
    marginRight: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textGroup: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  count: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  arrowWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
