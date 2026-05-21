import React from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../ui/dropdown-menu';

export type SearchScope = 'all' | 'course' | 'exam' | 'question';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scope: SearchScope;
  setScope: (scope: SearchScope) => void;
  isPending: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  scope,
  setScope,
  isPending,
}) => {
  const scopeLabels: Record<SearchScope, string> = {
    all: 'All',
    course: 'Courses',
    exam: 'Exams',
    question: 'Questions',
  };

  return (
    <div className="relative w-full flex items-center group">
      {/* Search Icon Left */}
      <div className="absolute left-3 flex items-center pointer-events-none select-none">
        {isPending ? (
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
        )}
      </div>

      {/* Main Input Field */}
      <Input
        type="search"
        placeholder={
          scope === 'all'
            ? "Search courses, exams, questions..."
            : scope === 'course'
            ? "Search course titles..."
            : scope === 'exam'
            ? "Search exams..."
            : "Search questions..."
        }
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-24 h-9 text-sm bg-background border border-border rounded-lg hover:border-border/80 hover:bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-xs"
      />

      {/* Embedded Dropdown Select Right */}
      <div className="absolute right-1 select-none">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-md bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/90 transition-all cursor-pointer"
            >
              <span>{scopeLabels[scope]}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-popover rounded-lg border border-border shadow-md">
            <DropdownMenuRadioGroup value={scope} onValueChange={(val) => setScope(val as SearchScope)}>
              <DropdownMenuRadioItem value="all" className="text-xs py-1.5 cursor-pointer">
                All
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="course" className="text-xs py-1.5 cursor-pointer">
                Courses
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="exam" className="text-xs py-1.5 cursor-pointer">
                Exams
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="question" className="text-xs py-1.5 cursor-pointer">
                Questions
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
