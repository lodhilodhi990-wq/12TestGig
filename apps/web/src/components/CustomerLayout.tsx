'use client';
import React from 'react';
import UserLayout from './UserLayout';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <UserLayout>{children}</UserLayout>;
}
