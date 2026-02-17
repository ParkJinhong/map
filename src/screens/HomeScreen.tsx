import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useCalendarPermission } from '../hooks/useCalendarPermission';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { EventCard } from '../components/EventCard';
import { AccessibleButton } from '../components/AccessibleButton';
import { deleteEvent } from '../services/calendarService';
import type { CalendarEvent } from '../services/calendarService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { granted, loading: permLoading, request } = useCalendarPermission();
  const { events, loading: eventsLoading, error, refetch } = useCalendarEvents();

  useEffect(() => {
    if (!granted && !permLoading) {
      request();
    }
  }, [granted, permLoading, request]);

  const handleAdd = () => navigation.navigate('AddEvent');
  const handleEdit = (event: CalendarEvent) =>
    navigation.navigate('EditEvent', {
      eventId: event.id,
      calendarId: event.calendarId ?? '',
      title: event.title,
      notes: event.notes ?? '',
    });
  const handleEventPress = (event: CalendarEvent) => handleEdit(event);

  if (!granted && !permLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          캘린더 접근 권한이 필요합니다. 일정을 조회·추가·수정하려면 권한을 허용해 주세요.
        </Text>
        <AccessibleButton
          label="캘린더 권한 허용"
          hint="두 번 탭하면 설정으로 이동합니다."
          onPress={() => request()}
        />
      </View>
    );
  }

  if (permLoading || eventsLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          일정을 불러오는 중…
        </Text>
      </View>
    );
  }

  const listLabel = `일정 목록, ${events.length}개`;

  const handleDelete = (item: CalendarEvent) => {
    const calId = item.calendarId ?? '';
    if (!calId) return;
    Alert.alert(
      '일정 삭제',
      `"${item.title}" 일정을 삭제할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const ok = await deleteEvent(calId, item.id);
            if (ok) refetch();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          accessibilityRole="header"
          accessibilityLabel="이지 캘린더, 오늘과 예정된 일정"
        >
          이지 캘린더
        </Text>
        <AccessibleButton
          label="일정 추가"
          hint="두 번 탭하면 새 일정을 추가합니다."
          onPress={handleAdd}
          style={styles.addBtn}
        />
      </View>
      {error ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      ) : null}
      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item.calendarId ?? 'unknown'}-${item.id}-${index}`}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.colors.textSecondary }]}>
            일정이 없습니다. 일정 추가 버튼으로 새 일정을 만들어 보세요.
          </Text>
        }
        accessibilityLabel={listLabel}
        accessibilityRole="list"
        renderItem={({ item, index }) => (
          <EventCard
            event={item}
            index={index}
            total={events.length}
            onPress={() => handleEventPress(item)}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
  },
  addBtn: {
    minWidth: 100,
  },
  message: {
    fontSize: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 7,
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    fontSize: 8,
  },
});
