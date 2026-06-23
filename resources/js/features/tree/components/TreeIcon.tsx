/**
 * TreeIcon.tsx
 *
 * Purpose:
 * Provides consistent icons for different node types in the tree explorer.
 *
 * Responsibilities:
 * - Render TreeIcon for node types (root, course, exam, question)
 * - Render ChevronIcon for expand/collapse toggle
 * - Switch between icons based on expanded state
 *
 * Dependencies:
 * - Lucide icons
 *
 * Notes:
 * - Moved from components/tree to features/tree for feature-based organization
 */

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
        <BookOpen className={`w-4 h-4 icon-indigo-dark ${className || ''}`} />
      ) : (
        <Book className={`w-4 h-4 icon-indigo-dark ${className || ''}`} />
      );
    case 'exam':
      return expanded ? (
        <FolderOpen className={`w-4 h-4 icon-amber-dark ${className || ''}`} />
      ) : (
        <Folder className={`w-4 h-4 icon-amber-dark ${className || ''}`} />
      );
    case 'question':
      return <FileQuestion className={`w-4 h-4 icon-emerald-dark ${className || ''}`} />;
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
