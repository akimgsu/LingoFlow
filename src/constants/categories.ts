import { Category } from '../types';
import { COLORS } from './theme';

export const CATEGORIES: Category[] = [
  {
    id: 'Daily & Casual',
    title: 'Daily & Casual',
    icon: 'comments',
    count: 88,
    accent: COLORS.accentDaily,
  },
  {
    id: 'Idioms & Slang',
    title: 'Idioms & Slang',
    icon: 'bolt',
    count: 51,
    accent: COLORS.accentIdioms,
  },
  {
    id: 'Feelings & Mindset',
    title: 'Feelings & Mindset',
    icon: 'heart',
    count: 43,
    accent: COLORS.accentFeelings,
  },
  {
    id: 'Work & Business',
    title: 'Work & Business',
    icon: 'briefcase',
    count: 34,
    accent: COLORS.accentWork,
  },
  {
    id: 'Dining & Cafe',
    title: 'Dining & Cafe',
    icon: 'utensils',
    count: 22,
    accent: COLORS.accentDining,
  },
  {
    id: 'Travel & Commute',
    title: 'Travel & Commute',
    icon: 'plane',
    count: 8,
    accent: COLORS.accentTravel,
  },
];
