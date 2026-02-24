import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import UnifiedEventDashboard from './dashboard';

export default function Home() {
  return (
    <AppLayout activeApp="dashboard">
      <UnifiedEventDashboard />
    </AppLayout>
  );
}