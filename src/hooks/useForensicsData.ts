import { useCallback, useEffect, useState } from 'react';
import { getForensicsData } from '../lib/analyzer';
import type { RawReceipt, ForensicsDataset } from '../types/receipt';

export interface ForensicsDataState {
  data: ForensicsDataset | null;
  isLoading: boolean;
  error: string | null;
}

export function useForensicsData() {
  const [state, setState] = useState<ForensicsDataState>({
    data: null,
    isLoading: true,
    error: null
  });

  const load = useCallback((raw?: RawReceipt[]) => {
    setState(current => ({ ...current, isLoading: true, error: null }));
    return getForensicsData(raw)
      .then(data => {
        setState({ data, isLoading: false, error: null });
        return data;
      })
      .catch(() => {
        setState(current => ({
          ...current,
          isLoading: false,
          error: 'The forensic dataset could not be loaded. Please refresh and try again.'
        }));
        return null;
      });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, load };
}
