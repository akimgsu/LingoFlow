import { Category, Expression } from '../types';
import { COLORS } from './theme';
import expressionsData from '../data/expressions.json';

const expressions = expressionsData as Expression[];

const categoryCounts = expressions.reduce<Record<string, number>>((acc, item) => {
  acc[item.category] = (acc[item.category] ?? 0) + 1;
  return acc;
}, {});

export const TOTAL_EXPRESSIONS = expressions.length;

const CATEGORY_META: Omit<Category, 'count'>[] = [
  {
    id: 'Daily Conversation',
    title: 'Daily Conversation',
    icon: 'comments',
    accent: COLORS.accentDaily,
  },
  {
    id: 'Questions & Inquiries',
    title: 'Questions & Inquiries',
    icon: 'question-circle',
    accent: COLORS.accentQuestions,
  },
  {
    id: 'Actions & Plans',
    title: 'Actions & Plans',
    icon: 'running',
    accent: COLORS.accentActions,
  },
  {
    id: 'Feelings & Mindset',
    title: 'Feelings & Mindset',
    icon: 'heart',
    accent: COLORS.accentFeelings,
  },
  {
    id: 'Opinions & Reactions',
    title: 'Opinions & Reactions',
    icon: 'comment-dots',
    accent: COLORS.accentOpinions,
  },
  {
    id: 'Idioms & Slang',
    title: 'Idioms & Slang',
    icon: 'bolt',
    accent: COLORS.accentIdioms,
  },
  {
    id: 'Social & Relationships',
    title: 'Social & Relationships',
    icon: 'user-friends',
    accent: COLORS.accentSocial,
  },
  {
    id: 'Work & Business',
    title: 'Work & Business',
    icon: 'briefcase',
    accent: COLORS.accentWork,
  },
  {
    id: 'Communication & Requests',
    title: 'Communication & Requests',
    icon: 'hands-helping',
    accent: COLORS.accentCommunication,
  },
  {
    id: 'Travel & Dining',
    title: 'Travel & Dining',
    icon: 'plane',
    accent: COLORS.accentTravel,
  },
];

export const CATEGORIES: Category[] = CATEGORY_META.map((cat) => ({
  ...cat,
  count: categoryCounts[cat.id] ?? 0,
}));
