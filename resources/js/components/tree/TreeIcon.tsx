import React from 'react';
import { 
  Folder, 
  FolderOpen, 
  Book, 
  BookOpen, 
  FileQuestion, 
  ChevronRight, 
  ChevronDown, 
  Boxes 
} from 'lucide-react';

interface TreeIconProps {
  type: 'root' | 'course' | 'exam' | 'question';
  expanded?: boolean;
  className?: string;
}

export const TreeIcon: React.FC<TreeIconProps> = ({ type, expanded, className }) => {
  switch (type) {
    case 'root':
      return <Boxes className={`w-4 h-4 text-primary ${className || ''}`} />;
    case 'course':
      return expanded ? (
        <BookOpen className={`w-4 h-4 text-indigo-500 dark:text-indigo-400 ${className || ''}`} />
      ) : (
        <Book className={`w-4 h-4 text-indigo-500 dark:text-indigo-400 ${className || ''}`} />
      );
    case 'exam':
      return expanded ? (
        <FolderOpen className={`w-4 h-4 text-amber-500 dark:text-amber-400 ${className || ''}`} />
      ) : (
        <Folder className={`w-4 h-4 text-amber-500 dark:text-amber-400 ${className || ''}`} />
      );
    case 'question':
      return <FileQuestion className={`w-4 h-4 text-emerald-500 dark:text-emerald-400 ${className || ''}`} />;
    default:
      return null;
  }
};

interface ChevronIconProps {
  expanded: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ expanded, onClick, className }) => {
  const Icon = expanded ? ChevronDown : ChevronRight;
  return (
    <Icon
      className={`w-3.5 h-3.5 text-muted-foreground/70 hover:text-foreground cursor-pointer transition-transform duration-200 ${className || ''}`}
      onClick={onClick}
    />
  );
};
