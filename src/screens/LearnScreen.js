import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Color accent per table for variety
const TABLE_ACCENTS = {
  2:  '#6C63FF',
  3:  '#22D3A5',
  4:  '#FF9F43',
  5:  '#FF5C7A',
  6:  '#4ECDC4',
  7:  '#A29BFE',
  8:  '#FD79A8',
  9:  '#FDCB6E',
  10: '#6C63FF',
  11: '#00CEC9',
  12: '#E17055',
  13: '#74B9FF',
  14: '#55EFC4',
  15: '#FAB1A0',
  16: '#81ECEC',
  17: '#DFE6E9',
  18: '#B2BEC3',
  19: '#636E72',
  20: '#FFD700',
};

function TableCard({ tableNum, onClose }) {
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);
  const accent = TABLE_ACCENTS[tableNum] || colors.primary;

  return (
    <View style={[styles.tableCard, { borderColor: accent + '33' }]}>
      {/* Header */}
      <View style={[styles.tableCardHeader, { backgroundColor: accent + '18' }]}>
        <View style={styles.tableCardHeaderLeft}>
          <View style={[styles.tableNumBadge, { backgroundColor: accent }]}>
            <Text style={styles.tableNumBadgeText}>{tableNum}</Text>
          </View>
          <Text style={styles.tableCardTitle}>Table of {tableNum}</Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>
      </View>

      {/* Rows */}
      <View style={styles.tableRowsContainer}>
        {rows.map((n) => (
          <View key={n} style={[styles.tableRow, n % 2 === 0 && styles.tableRowAlt]}>
            <Text style={[styles.tableRowA, { color: accent }]}>{tableNum}</Text>
            <Text style={styles.tableRowOp}>×</Text>
            <Text style={styles.tableRowB}>{n}</Text>
            <Text style={styles.tableRowEq}>=</Text>
            <Text style={[styles.tableRowResult, { color: colors.text }]}>
              {tableNum * n}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function LearnScreen({ onBack }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openTable = (num) => {
    setSelectedTable(num);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };

  const closeTable = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      setSelectedTable(null);
    });
  };

  const tables = Array.from({ length: 19 }, (_, i) => i + 2); // 2 to 20

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.screenTitle}>Learn Tables</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Tap any table to expand it</Text>

      {/* Table Grid */}
      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {tables.map((num) => {
            const accent = TABLE_ACCENTS[num] || colors.primary;
            const isSelected = selectedTable === num;
            return (
              <Pressable
                key={num}
                style={({ pressed }) => [
                  styles.gridCell,
                  { borderColor: accent + '44' },
                  isSelected && { borderColor: accent, backgroundColor: accent + '22' },
                  pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] },
                ]}
                onPress={() => isSelected ? closeTable() : openTable(num)}
              >
                <Text style={[styles.gridCellNum, { color: accent }]}>{num}</Text>
                <Text style={styles.gridCellLabel}>table</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Expanded Table Card */}
        {selectedTable !== null && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <TableCard
              tableNum={selectedTable}
              onClose={closeTable}
            />
          </Animated.View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CELL_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 4) / 5;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
    width: 60,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '400',
  },
  gridContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellNum: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  gridCellLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  // Table Card
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  tableCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  tableCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tableNumBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableNumBadgeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  tableCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tableRowsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  tableRowAlt: {
    backgroundColor: colors.surfaceAlt + '44',
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
  },
  tableRowA: {
    fontSize: 18,
    fontWeight: '800',
    width: 28,
    textAlign: 'right',
    letterSpacing: -0.5,
  },
  tableRowOp: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textMuted,
    width: 16,
    textAlign: 'center',
  },
  tableRowB: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 24,
  },
  tableRowEq: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textMuted,
    width: 16,
    textAlign: 'center',
  },
  tableRowResult: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
    letterSpacing: -0.8,
  },
});