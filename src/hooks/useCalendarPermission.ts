import { useState, useEffect, useCallback } from 'react';
import {
  requestCalendarPermissions,
  getCalendarPermissionStatus,
} from '../services/calendarService';

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export function useCalendarPermission() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    const s = await getCalendarPermissionStatus();
    setStatus(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const request = useCallback(async () => {
    setLoading(true);
    const granted = await requestCalendarPermissions();
    const s = await getCalendarPermissionStatus();
    setStatus(s);
    setLoading(false);
    return granted;
  }, []);

  return {
    status,
    granted: status === 'granted',
    loading,
    request,
    refetch: check,
  };
}
