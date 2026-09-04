import { Category } from '../types';
import { COLORS } from './theme';

export const CATEGORIES: Category[] = [
  {
    id: 'Daily Conversation',
    title: 'Daily Conversation',
    icon: 'comments',
    count: 449,
    accent: COLORS.accentDaily,
  },
  {
    id: 'Actions & Habits',
    title: 'Actions & Habits',
    icon: 'running',
    count: 102,
    accent: COLORS.accentActions,
  },
  {
    id: 'Feelings & Mindset',
    title: 'Feelings & Mindset',
    icon: 'heart',
    count: 132,
    accent: COLORS.accentFeelings,
  },
  {
    id: 'Time & Plans',
    title: 'Time & Plans',
    icon: 'clock',
    count: 74,
    accent: COLORS.accentTime,
  },
  {
    id: 'Idioms & Slang',
    title: 'Idioms & Slang',
    icon: 'bolt',
    count: 90,
    accent: COLORS.accentIdioms,
  },
  {
    id: 'Social & Relationships',
    title: 'Social & Relationships',
    icon: 'user-friends',
    count: 74,
    accent: COLORS.accentSocial,
  },
  {
    id: 'Opinions & Reactions',
    title: 'Opinions & Reactions',
    icon: 'comment-dots',
    count: 102,
    accent: COLORS.accentOpinions,
  },
  {
    id: 'Work & Business',
    title: 'Work & Business',
    icon: 'briefcase',
    count: 65,
    accent: COLORS.accentWork,
  },
  {
    id: 'Dining & Cafe',
    title: 'Dining & Cafe',
    icon: 'utensils',
    count: 70,
    accent: COLORS.accentDining,
  },
  {
    id: 'Requests & Politeness',
    title: 'Requests & Politeness',
    icon: 'hands-helping',
    count: 59,
    accent: COLORS.accentRequests,
  },
  {
    id: 'Travel & Commute',
    title: 'Travel & Commute',
    icon: 'plane',
    count: 68,
    accent: COLORS.accentTravel,
  },
  {
    id: 'Communication',
    title: 'Communication',
    icon: 'phone-alt',
    count: 41,
    accent: COLORS.accentCommunication,
  },
];
