import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

/**
 * Simple Logo Component - No dependencies needed!
 * Pure React Native with Text and View
 */

export default function Logo({ size = 100, style }) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Text style={[styles.symbol, { fontSize: size * 0.5 }]}>×</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  symbol: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: -2,
  },
});

/**
 * CUSTOMIZATION EXAMPLES:
 * 
 * Change color:
 *   backgroundColor: colors.accent,
 * 
 * Use emoji instead:
 *   <Text>🔢</Text>
 * 
 * Use text:
 *   <Text style={{...}}>M</Text>
 */
