import * as Calendar from 'expo-calendar';

export type CalendarEvent = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  location?: string;
  notes?: string;
  calendarId?: string;
};

/**
 * 캘린더 권한 요청
 */
export async function requestCalendarPermissions(): Promise<boolean> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
}

/**
 * 캘린더 권한 상태 조회
 */
export async function getCalendarPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  const { status } = await Calendar.getCalendarPermissionsAsync();
  return status;
}

/**
 * 사용 가능한 캘린더 목록 조회
 */
export async function getCalendars(): Promise<Calendar.Calendar[]> {
  const granted = await requestCalendarPermissions();
  if (!granted) return [];
  return Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
}

/**
 * 기간 내 일정 조회
 */
export async function getEventsInRange(
  startDate: Date,
  endDate: Date,
  calendarIds?: string[]
): Promise<CalendarEvent[]> {
  const granted = await requestCalendarPermissions();
  if (!granted) return [];

  const ids = calendarIds?.length
    ? calendarIds
    : (await getCalendars()).map((c) => c.id);

  const events = await Calendar.getEventsAsync(ids, startDate, endDate);

  return events.map((e) => ({
    id: e.id ?? '',
    title: e.title ?? '',
    startDate: new Date(e.startDate),
    endDate: new Date(e.endDate),
    allDay: e.allDay ?? false,
    location: e.location,
    notes: e.notes ?? undefined,
    calendarId: e.calendarId,
  }));
}

/**
 * 일정 추가
 */
export async function createEvent(
  calendarId: string,
  event: {
    title: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
    notes?: string;
    location?: string;
  }
): Promise<string | null> {
  const granted = await requestCalendarPermissions();
  if (!granted) return null;

  const id = await Calendar.createEventAsync(calendarId, {
    title: event.title,
    startDate: event.startDate.getTime(),
    endDate: event.endDate.getTime(),
    allDay: event.allDay ?? false,
    notes: event.notes,
    location: event.location,
  });
  return id ?? null;
}

/**
 * 일정 수정
 */
export async function updateEvent(
  calendarId: string,
  eventId: string,
  updates: {
    title?: string;
    startDate?: Date;
    endDate?: Date;
    allDay?: boolean;
    notes?: string;
    location?: string;
  }
): Promise<boolean> {
  const granted = await requestCalendarPermissions();
  if (!granted) return false;

  await Calendar.updateEventAsync(eventId, {
    calendarId,
    title: updates.title,
    startDate: updates.startDate?.getTime(),
    endDate: updates.endDate?.getTime(),
    allDay: updates.allDay,
    notes: updates.notes,
    location: updates.location,
  });
  return true;
}

/**
 * 일정 삭제
 */
export async function deleteEvent(
  calendarId: string,
  eventId: string
): Promise<boolean> {
  const granted = await requestCalendarPermissions();
  if (!granted) return false;

  await Calendar.deleteEventAsync(eventId, { calendarId });
  return true;
}
