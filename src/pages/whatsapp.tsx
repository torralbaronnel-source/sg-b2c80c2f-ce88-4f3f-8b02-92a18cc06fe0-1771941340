import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WhatsAppTabletView from '@/components/WhatsApp/WhatsAppTabletView';
import WhatsAppManagerView from '@/components/WhatsApp/WhatsAppManagerView';
import { useIsMobile } from '@/hooks/use-mobile';

const WhatsAppPage = () => {
  const isMobile = useIsMobile();
  const [selectedEvent, setSelectedEvent] = useState('1'); // REYES WEDDING

  if (isMobile) {
    return <WhatsAppTabletView eventId={selectedEvent} />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-100 flex h-screen overflow-hidden">
        <WhatsAppManagerView coordinatorId="1" />
      </div>
    </ProtectedRoute>
  );
};

export default WhatsAppPage;