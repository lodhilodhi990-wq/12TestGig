'use client';
import React from 'react';
import UserLayout from './UserLayout';

export default function EarnerLayout({ children }: { children: React.ReactNode }) {
  return <UserLayout>{children}</UserLayout>;
}
