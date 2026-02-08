import { create } from 'zustand';
import type { CalendarEvent } from '../services/calendarService';

type CalendarStore = {
  /** 선택된 캘린더 ID (일정 추가 시 사용) */
  selectedCalendarId: string | null;
  setSelectedCalendarId: (id: string | null) => void;

  /** 조회 기간 기준일 (오늘 기준 ±N일 등) */
  rangeDays: number;
  setRangeDays: (days: number) => void;

  /** 캐시된 일정 목록 (선택적: 화면에서 React Query 등으로 관리해도 됨) */
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
};

export const useCalendarStore = create<CalendarStore>((set) => ({
  selectedCalendarId: null,
  setSelectedCalendarId: (id) => set({ selectedCalendarId: id }),
  rangeDays: 14,
  setRangeDays: (days) => set({ rangeDays: days }),
  events: [],
  setEvents: (events) => set({ events }),
}));
