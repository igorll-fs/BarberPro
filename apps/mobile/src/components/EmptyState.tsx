import React from 'react';
import { View, Text } from 'react-native';
import { colors, fontSize, spacing } from '../theme';

interface Props {
  icon?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = '📋', title, message, actionLabel, onAction }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl }}>
      <Text style={{ fontSize: 48, marginBottom: spacing.lg }}>{icon}</Text>
      {title ? (
        <Text style={{ fontSize: fontSize.xl, fontWeight: '600', color: colors.text, textAlign: 'center' }}>
          {title}
        </Text>
      ) : null}
      {message ? (
        <Text style={{ fontSize: fontSize.md, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm }}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Text style={{ fontSize: fontSize.md, color: colors.primary, marginTop: spacing.lg }} onPress={onAction}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}
