import { useEffect, useState } from "react";

export function useDebounce<T>(valor: T, delay: number = 350): T {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timeout);
  }, [valor, delay]);

  return debounced;
}
