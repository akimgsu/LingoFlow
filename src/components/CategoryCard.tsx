import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

interface Props {
  item: Category;
  onPress: () => void;
}

export default function CategoryCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Study ${item.title}, ${item.count} expressions`}
    >
      {/* Left Accent Bar */}
      <View style={[styles.accentBar, { backgroundColor: item.accent }]} />

      {/* Icon Capsule */}
      <View style={[styles.iconWrap, { backgroundColor: item.accent + '20' }]}>
        <FontAwesome5 name={item.icon} size={18} color={item.accent} />
      </View>

      {/* Title & Expressions count */}
      <View style={styles.textGroup}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.count}>
          {item.count} expressions
        </Text>
      </View>

      {/* Action Arrow */}
      <View style={[styles.arrowWrap, { borderColor: item.accent + '40', backgroundColor: item.accent + '10' }]}>
        <Ionicons name="chevron-forward" size={16} color={item.accent} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select(SHADOW.card),
  },
  accentBar: {
    width: 4,
    height: 38,
    borderRadius: RADIUS.xs,
    marginLeft: 12,
    marginRight: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  count: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  arrowWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
