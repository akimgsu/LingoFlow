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
  accent: string; // hex color
}
