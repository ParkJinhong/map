/**
 * 접근성 관련 상수 및 레이블 포맷
 * TalkBack / VoiceOver 사용자를 위해 일관된 안내 문구 사용
 */

export const A11y = {
  hints: {
    doubleTapToActivate: '두 번 탭하면 실행합니다.',
    doubleTapToComplete: '두 번 탭하면 완료로 표시합니다.',
    doubleTapToDelete: '두 번 탭하면 삭제합니다.',
    doubleTapToEdit: '두 번 탭하면 수정 화면으로 이동합니다.',
    doubleTapToAdd: '두 번 탭하면 새 일정을 추가합니다.',
  },
} as const;

/**
 * 날짜를 스크린 리더가 읽기 좋은 형태로 포맷
 * 예: "2024년 2월 8일 금요일"
 */
export function formatDateForA11y(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${weekday}`;
}

/**
 * 시간 포맷 (오전/오후)
 * 예: "오후 3시 0분"
 */
export function formatTimeForA11y(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? '오전' : '오후';
  const h = hours % 12 || 12;
  if (minutes === 0) return `${ampm} ${h}시`;
  return `${ampm} ${h}시 ${minutes}분`;
}
