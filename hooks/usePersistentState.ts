import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

export function usePersistentState<T,>(key: string, initialState: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storageValue = window.localStorage.getItem(key);
      return storageValue ? JSON.parse(storageValue) : initialState;
    } catch (error) {
      console.error(error);
      return initialState;
    }
  });

  const setPersistentState = useCallback((value: SetStateAction<T>) => {
    setState(prevState => {
      const newValue = typeof value === 'function' 
        ? (value as (prevState: T) => T)(prevState) 
        : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(error);
      }
      return newValue;
    });
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
            setState(JSON.parse(event.newValue));
        } catch (error) {
            console.error(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [state, setPersistentState];
}