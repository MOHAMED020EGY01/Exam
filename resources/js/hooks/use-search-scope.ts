/**
 * use-search-scope.ts
 *
 * Purpose:
 * Hook managing query state, debouncing query values, and transitions of search scopes.
 *
 * Responsibilities:
 * - Hold current search query state and target scope state
 * - Trigger debounced transitions of search query queries
 *
 * Dependencies:
 * - React transition hooks
 */

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
