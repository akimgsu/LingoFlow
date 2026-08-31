import { Category } from '../types';
import { COLORS } from './theme';

export const CATEGORIES: Category[] = [
  {
    id: 'Daily Conversation',
    title: 'Daily Conversation',
    icon: 'comments',
    count: 440,
    accent: COLORS.accentDaily,
  },
  {
    id: 'Actions & Habits',
    title: 'Actions & Habits',
    icon: 'running',
    count: 89,
    accent: COLORS.accentActions,
  },
  {
    id: 'Feelings & Mindset',
    title: 'Feelings & Mindset',
    icon: 'heart',
    count: 84,
    accent: COLORS.accentFeelings,
  },
  {
    id: 'Time & Plans',
    title: 'Time & Plans',
    icon: 'clock',
    count: 67,
    accent: COLORS.accentTime,
  },
  {
    id: 'Idioms & Slang',
    title: 'Idioms & Slang',
    icon: 'bolt',
    count: 81,
    accent: COLORS.accentIdioms,
  },
  {
    id: 'Social & Relationships',
    title: 'Social & Relationships',
    icon: 'user-friends',
    count: 60,
    accent: COLORS.accentSocial,
  },
  {
    id: 'Opinions & Reactions',
    title: 'Opinions & Reactions',
    icon: 'comment-dots',
    count: 68,
    accent: COLORS.accentOpinions,
  },
  {
    id: 'Work & Business',
    title: 'Work & Business',
    icon: 'briefcase',
    count: 50,
    accent: COLORS.accentWork,
  },
  {
    id: 'Dining & Cafe',
    title: 'Dining & Cafe',
    icon: 'utensils',
    count: 63,
    accent: COLORS.accentDining,
  },
  {
    id: 'Requests & Politeness',
    title: 'Requests & Politeness',
    icon: 'hands-helping',
    count: 51,
    accent: COLORS.accentRequests,
  },
  {
    id: 'Travel & Commute',
    title: 'Travel & Commute',
    icon: 'plane',
    count: 47,
    accent: COLORS.accentTravel,
  },
  {
    id: 'Communication',
    title: 'Communication',
    icon: 'phone-alt',
    count: 32,
    accent: COLORS.accentCommunication,
  },
];
