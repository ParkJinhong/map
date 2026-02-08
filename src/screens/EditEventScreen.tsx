import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AccessibleButton } from '../components/AccessibleButton';
import { updateEvent, deleteEvent } from '../services/calendarService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EditEvent'>;

export function EditEventScreen({ route, navigation }: Props) {
  const { eventId, calendarId, title: initialTitle, notes: initialNotes } = route.params;
  const { theme } = useTheme();
  const [title, setTitle] = useState(initialTitle ?? '');
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('제목을 입력해 주세요.');
      return;
    }
    setLoading(true);
    try {
      const ok = await updateEvent(calendarId, eventId, {
        title: title.trim(),
        notes: notes.trim() || undefined,
      });
      if (ok) navigation.goBack();
      else Alert.alert('수정에 실패했습니다.');
    } catch (e) {
      Alert.alert('오류', e instanceof Error ? e.message : '수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '일정 삭제',
      '이 일정을 삭제할까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const ok = await deleteEvent(calendarId, eventId);
            if (ok) navigation.goBack();
          },
        },
      ]
    );
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
        accessibilityLabel="일정 제목 수정"
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
        accessibilityLabel="메모 수정"
      />
      <View style={styles.actions}>
        <AccessibleButton
          label="저장"
          hint="두 번 탭하면 수정 내용을 저장합니다."
          onPress={handleSave}
          disabled={loading}
        />
        <AccessibleButton
          label="삭제"
          hint="두 번 탭하면 이 일정을 삭제합니다."
          onPress={handleDelete}
          variant="danger"
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
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
});
