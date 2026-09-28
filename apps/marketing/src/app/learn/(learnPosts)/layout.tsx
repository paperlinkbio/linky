import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Linky',
    default: 'Learn | Linky',
  },
};

export default function LearnPostLayout({ children }: { children: ReactNode }) {
  return children;
}
