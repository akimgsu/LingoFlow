import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Platform, Modal,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStudyCard } from '../src/hooks/useStudyCard';
import FlashCard from '../src/components/FlashCard';
import { COLORS, RADIUS, SHADOW } from '../src/constants/theme';
import allExpressions from '../src/data/expressions.json';

export default function StudyScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Filter expressions by selected category
  const filteredExpressions = categoryId
    ? allExpressions.filter((e) => e.category === categoryId)
    : allExpressions;
  const list = filteredExpressions.length > 0 ? filteredExpressions : allExpressions;

  const {
    currentExpression,
    currentIndex,
    totalCount,
    progressPercentage,
    isFlipped,
    isQuizMode,
    isAutoReviewing,
    isFirst,
    isLast,
    sessionStats,
    frontAnimStyle,
    backAnimStyle,
    flipCard,
    toggleQuizMode,
    goNext,
    goPrev,
    goForward,
    playAudio,
    startAutoReview,
    stopAutoReview,
    resetSession,
  } = useStudyCard(list);

  const handleNextAction = (mastered: boolean) => {
    if (isAutoReviewing) return;
    const result = goNext(mastered);
    if (result === 'done') {
      setShowCompletionModal(true);
    }
  };

  const handleReview = async () => {
    if (isAutoReviewing) {
      stopAutoReview();
      return;
    }
    const result = await startAutoReview();
    if (result === 'done') {
      setShowCompletionModal(true);
    }
  };

  const handleClose = () => {
    stopAutoReview();
    router.back();
  };

  const handleRestart = () => {
    setShowCompletionModal(false);
    resetSession();
  };

  const handleFinish = () => {
    setShowCompletionModal(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDeep} />
      <View style={styles.container}>

        {/* ── Top Header: Close & Progress ──────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
            accessibilityLabel="Close study session"
          >
            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` as any }]} />
          </View>

          <Text style={styles.progressCounter}>
            {currentIndex + 1}/{totalCount}
          </Text>
        </View>

        {/* ── Category & Mode Pill ─────────────────────── */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.quizToggle,
              isQuizMode && styles.quizToggleActive,
              isAutoReviewing && styles.quizToggleDisabled,
            ]}
            onPress={toggleQuizMode}
            activeOpacity={0.8}
            disabled={isAutoReviewing}
          >
            <Ionicons
              name={isAutoReviewing ? 'play-circle' : isQuizMode ? 'sparkles' : 'bulb-outline'}
              size={14}
              color={
                isAutoReviewing
                  ? COLORS.pink
                  : isQuizMode
                    ? COLORS.accentPurple
                    : COLORS.textSecondary
              }
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.quizToggleText,
                isQuizMode && styles.quizToggleTextActive,
                isAutoReviewing && styles.quizToggleTextAuto,
              ]}
            >
              {isAutoReviewing
                ? 'Auto Review · EN ×2 → KO'
                : isQuizMode
                  ? 'Quiz Mode · 한국어 먼저'
                  : 'Standard · English First'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── FlashCard ─────────────────────────────────── */}
        <FlashCard
          frontText={isQuizMode ? currentExpression.korean : currentExpression.english}
          backText={isQuizMode ? currentExpression.english : currentExpression.korean}
          frontLabel={isQuizMode ? 'KO' : 'EN'}
          backLabel={isQuizMode ? 'EN' : 'KO'}
          isFlipped={isFlipped}
          showAudioOnFront={!isQuizMode}
          showAudioOnBack={isQuizMode}
          frontAnimStyle={frontAnimStyle}
          backAnimStyle={backAnimStyle}
          onFlip={flipCard}
          onAudio={playAudio}
        />

        {/* ── Navigation & Decision Controls ───────────── */}
        <View style={styles.navRow}>
          {/* Previous Card */}
          <TouchableOpacity
            style={[styles.navBtn, (isFirst || isAutoReviewing) && styles.navBtnDisabled]}
            onPress={goPrev}
            activeOpacity={isFirst || isAutoReviewing ? 1 : 0.7}
            disabled={isFirst || isAutoReviewing}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={isFirst || isAutoReviewing ? COLORS.border : COLORS.accentIndigo}
            />
          </TouchableOpacity>

          {/* Decision Buttons */}
          <View style={styles.actionsGroup}>
            <TouchableOpacity
              style={[styles.reviewBtn, isAutoReviewing && styles.reviewBtnActive]}
              onPress={handleReview}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isAutoReviewing ? 'stop' : 'play'}
                size={16}
                color={COLORS.pink}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.reviewBtnText}>
                {isAutoReviewing ? 'Stop' : 'Review'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.masteredBtn, isAutoReviewing && styles.masteredBtnDisabled]}
              onPress={() => handleNextAction(true)}
              activeOpacity={0.8}
              disabled={isAutoReviewing}
            >
              <Ionicons name="checkmark-sharp" size={18} color={COLORS.white} style={{ marginRight: 6 }} />
              <Text style={styles.masteredBtnText}>Mastered</Text>
            </TouchableOpacity>
          </View>

          {/* Forward Card */}
          <TouchableOpacity
            style={[styles.navBtn, (isLast || isAutoReviewing) && styles.navBtnDisabled]}
            onPress={goForward}
            activeOpacity={isLast || isAutoReviewing ? 1 : 0.7}
            disabled={isLast || isAutoReviewing}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isLast || isAutoReviewing ? COLORS.border : COLORS.accentIndigo}
            />
          </TouchableOpacity>
        </View>

        {/* ── Session Completion Modal ─────────────────── */}
        <Modal
          visible={showCompletionModal}
          transparent
          animationType="fade"
          onRequestClose={handleFinish}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.trophyWrap}>
                <FontAwesome5 name="trophy" size={36} color="#F59E0B" />
              </View>

              <Text style={styles.modalHeading}>Session Completed! </Text>
              <Text style={styles.modalSub}>
                Great job practicing {totalCount} expressions!
              </Text>

              {/* Stats Summary */}
              <View style={styles.modalStatsRow}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatNum}>{sessionStats.masteredCount}</Text>
                  <Text style={styles.modalStatLbl}>Mastered</Text>
                </View>
                <View style={styles.modalStatDivider} />
                <View style={styles.modalStatItem}>
                  <Text style={[styles.modalStatNum, { color: COLORS.pink }]}>{sessionStats.reviewCount}</Text>
                  <Text style={styles.modalStatLbl}>Review</Text>
                </View>
                <View style={styles.modalStatDivider} />
                <View style={styles.modalStatItem}>
                  <Text style={[styles.modalStatNum, { color: COLORS.accentIndigo }]}>+{sessionStats.xpEarned}</Text>
                  <Text style={styles.modalStatLbl}>XP Gained</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  onPress={handleRestart}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalSecondaryText}>Study Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={handleFinish}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalPrimaryText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: COLORS.bgDeep,
    paddingTop: Platform.OS === 'android' ? 24 : 10,
    paddingBottom: 24,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    gap: 12,
  },
  closeBtn: {
    padding: 4,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  progressCounter: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },

  /* Mode row */
  modeRow: {
    marginBottom: 16,
  },
  quizToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
  },
  quizToggleActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#1E1438',
  },
  quizToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  quizToggleTextActive: {
    color: COLORS.accentPurple,
    fontWeight: '700',
  },
  quizToggleDisabled: {
    borderColor: COLORS.pink + '50',
    backgroundColor: COLORS.bgCard,
  },
  quizToggleTextAuto: {
    color: COLORS.pink,
    fontWeight: '700',
  },

  /* Navigation & Action buttons */
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginTop: 'auto',
  },
  navBtn: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnDisabled: {
    borderColor: COLORS.border,
    opacity: 0.35,
  },
  actionsGroup: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  reviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.pink + '50',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
  },
  reviewBtnActive: {
    backgroundColor: COLORS.pink + '18',
    borderColor: COLORS.pink,
  },
  reviewBtnText: {
    color: COLORS.pink,
    fontSize: 14,
    fontWeight: '700',
  },
  masteredBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    ...Platform.select(SHADOW.button),
  },
  masteredBtnDisabled: {
    opacity: 0.4,
  },
  masteredBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },

  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    ...Platform.select(SHADOW.card),
  },
  trophyWrap: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: '#F59E0B20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalStatsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalStatNum: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  modalStatLbl: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  modalStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalSecondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgDeep,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalSecondaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  modalPrimaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...Platform.select(SHADOW.button),
  },
  modalPrimaryText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
