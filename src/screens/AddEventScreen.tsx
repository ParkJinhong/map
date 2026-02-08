import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AccessibleButton } from '../components/AccessibleButton';
import { useCalendars } from '../hooks/useCalendarEvents';
import { createEvent } from '../services/calendarService';
import { useCalendarStore } from '../stores/calendarStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEvent'>;

export function AddEventScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [saving, setSaving] = useState(false);

  const { calendars, loading: calendarsLoading } = useCalendars();
  const selectedCalendarId = useCalendarStore((s) => s.selectedCalendarId);
  const calendarId = selectedCalendarId ?? calendars[0]?.id ?? null;

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('제목을 입력해 주세요.');
      return;
    }
    if (!calendarId) {
      Alert.alert('캘린더를 선택할 수 없습니다. 권한을 확인해 주세요.');
      return;
    }
    setSaving(true);
    try {
      const id = await createEvent(calendarId, {
        title: title.trim(),
        startDate,
        endDate,
        notes: notes.trim() || undefined,
      });
      if (id) {
        navigation.goBack();
      } else {
        Alert.alert('일정 추가에 실패했습니다.');
      }
    } catch (e) {
      Alert.alert('오류', e instanceof Error ? e.message : '일정 추가에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>제목</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="일정 제목"
        placeholderTextColor={theme.colors.textSecondary}
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        accessible
        accessibilityLabel="일정 제목 입력"
        accessibilityHint="제목을 입력합니다."
      />
      <Text style={[styles.label, { color: theme.colors.text }]}>메모 (선택)</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="메모"
        placeholderTextColor={theme.colors.textSecondary}
        style={[styles.input, styles.inputMulti, { color: theme.colors.text, borderColor: theme.colors.border }]}
        multiline
        accessible
        accessibilityLabel="메모 입력"
        accessibilityHint="선택 사항입니다."
      />
      <View style={styles.actions}>
        <AccessibleButton
          label="저장"
          hint="두 번 탭하면 일정을 저장합니다."
          onPress={handleSave}
          disabled={saving}
        />
        <AccessibleButton
          label="취소"
          hint="두 번 탭하면 이전 화면으로 돌아갑니다."
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    minHeight: 44,
  },
  inputMulti: {
    minHeight: 80,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
});
