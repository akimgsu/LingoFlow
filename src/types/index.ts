// Central type definitions for LingoFlow

export interface Expression {
  id: string;
  english: string;
  korean: string;
  category: string;
}

export interface Category {
  id: string;
  title: string;
  icon: string;   // FontAwesome5 icon name
  count: number;
  accent: string; // Hex color for theme accent
}

export interface Achievement {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface StudySessionStats {
  totalStudied: number;
  masteredCount: number;
  reviewCount: number;
  xpEarned: number;
}
