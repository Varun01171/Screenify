import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): [UseApiState<T>, (...args: any[]) => Promise<void>, () => void] {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      // Enhanced error handling for different scenarios
      const isDev = process.env.NODE_ENV === 'development';
      
      if (isDev) {
        // In development, be more forgiving with connection errors
        if (errorMessage.includes('Cannot connect') || 
            errorMessage.includes('Failed to fetch') ||
            errorMessage.includes('timeout') ||
            errorMessage.includes('Database service') ||
            errorMessage.includes('PostgreSQL')) {
          console.warn(`API Error (${errorMessage}), continuing with mock data in development`);
          setState(prev => ({ ...prev, loading: false, error: null }));
          return;
        }
      }
      
      // Only show error in production or for non-connection issues
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(errorMessage);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return [state, execute, reset];
}

// Specialized hook for paginated data
export function usePaginatedApi<T = any>(
  apiFunction: (params: any) => Promise<{ data: T[]; total: number; page: number; limit: number }>,
  initialParams: any = {}
) {
  const [params, setParams] = useState(initialParams);
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    hasMore: false,
  });

  const [{ data, loading, error }, execute] = useApi(apiFunction, {
    onSuccess: (result) => {
      if (result && typeof result === 'object') {
        if (Array.isArray(result.data)) {
          if (params.page === 1) {
            setAllData(result.data);
          } else {
            setAllData(prev => [...prev, ...result.data]);
          }
          setPagination({
            total: result.total || result.data.length,
            page: result.page || 1,
            limit: result.limit || result.data.length,
            hasMore: result.data.length === (result.limit || result.data.length) && 
                     (result.page || 1) * (result.limit || result.data.length) < (result.total || result.data.length),
          });
        } else if (Array.isArray(result)) {
          // Handle direct array response
          if (params.page === 1) {
            setAllData(result);
          } else {
            setAllData(prev => [...prev, ...result]);
          }
          setPagination({
            total: result.length,
            page: 1,
            limit: result.length,
            hasMore: false,
          });
        }
      }
    },
    onError: (errorMessage) => {
      // In development, don't show errors for backend connection issues
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev && errorMessage.includes('Cannot connect to backend')) {
        console.warn('Backend not available, operating in mock mode');
        return;
      }
    }
  });

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      const nextParams = { ...params, page: pagination.page + 1 };
      setParams(nextParams);
      execute(nextParams);
    }
  }, [params, pagination.hasMore, pagination.page, loading, execute]);

  const refresh = useCallback(() => {
    const refreshParams = { ...params, page: 1 };
    setParams(refreshParams);
    setAllData([]);
    execute(refreshParams);
  }, [params, execute]);

  const updateParams = useCallback((newParams: any) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    setParams(updatedParams);
    setAllData([]);
    execute(updatedParams);
  }, [params, execute]);

  useEffect(() => {
    execute(params);
  }, []);

  return {
    data: allData,
    loading,
    error,
    pagination,
    loadMore,
    refresh,
    updateParams,
  };
}