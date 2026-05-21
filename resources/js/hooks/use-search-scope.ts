import { useState, useTransition, useEffect } from 'react';

export type SearchScope = 'all' | 'course' | 'exam' | 'question';

export function useSearchScope(initialQuery = '', initialScope: SearchScope = 'all') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [scope, setScope] = useState<SearchScope>(initialScope);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setDebouncedQuery(searchQuery);
      });
    }, 200); // Premium performance: 200ms debounce
    return () => clearTimeout(handler);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    scope,
    setScope,
    isPending,
  };
}
