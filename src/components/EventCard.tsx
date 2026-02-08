import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AccessibleButton } from './AccessibleButton';
import { formatDateForA11y, formatTimeForA11y, A11y } from '../constants/accessibility';
import type { CalendarEvent } from '../services/calendarService';

type EventCardProps = {
  event: CalendarEvent;
  index: number;
  total: number;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function EventCard({ event, index, total, onPress, onEdit, onDelete }: EventCardProps) {
  const { theme } = useTheme();
  const dateLabel = formatDateForA11y(event.startDate);
  const timeLabel = event.allDay
    ? '종일'
    : `${formatTimeForA11y(event.startDate)} - ${formatTimeForA11y(event.endDate)}`;

  const summaryLabel = `${event.title}, ${dateLabel}, ${timeLabel}. ${total}개 중 ${index + 1}번째 일정.`;

  return (
    <View
      style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      accessibilityRole="summary"
      accessibilityLabel={summaryLabel}
    >
      <TouchableOpacity
        onPress={onPress}
        style={styles.content}
        accessible
        accessibilityRole="button"
        accessibilityLabel={summaryLabel}
        accessibilityHint={A11y.hints.doubleTapToEdit}
      >
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
          {dateLabel} · {timeLabel}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <AccessibleButton
          label="수정"
          hint={A11y.hints.doubleTapToEdit}
          onPress={onEdit}
          variant="secondary"
          style={styles.actionBtn}
        />
        <AccessibleButton
          label="삭제"
          hint={A11y.hints.doubleTapToDelete}
          onPress={onDelete}
          variant="danger"
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
