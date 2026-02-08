import { useState, useEffect, useCallback } from 'react';
import {
  getEventsInRange,
  getCalendars,
  type CalendarEvent,
} from '../services/calendarService';
import { useCalendarStore } from '../stores/calendarStore';

const defaultRangeDays = 14;

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rangeDays = useCalendarStore((s) => s.rangeDays);
  const selectedCalendarId = useCalendarStore((s) => s.selectedCalendarId);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setDate(end.getDate() + (rangeDays || defaultRangeDays));
      end.setHours(23, 59, 59, 999);

      const calendarIds = selectedCalendarId ? [selectedCalendarId] : undefined;
      const list = await getEventsInRange(start, end, calendarIds);
      setEvents(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : '일정을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [rangeDays, selectedCalendarId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

export function useCalendars() {
  const [calendars, setCalendars] = useState<Awaited<ReturnType<typeof getCalendars>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCalendars().then((list) => {
      if (!cancelled) setCalendars(list);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { calendars, loading };
}
