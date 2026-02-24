import React, { useState } from 'react';
import WhatsAppTabletView from '@/components/WhatsApp/WhatsAppTabletView';
import WhatsAppManagerView from '@/components/WhatsApp/WhatsAppManagerView';
import { useIsMobile } from '@/hooks/use-mobile';

const WhatsAppPage = () => {
  const isMobile = useIsMobile();
  const [selectedEvent, setSelectedEvent] = useState('1'); // REYES WEDDING

  if (isMobile) {
    return <WhatsAppTabletView eventId={selectedEvent} />;
  }

  return <WhatsAppManagerView eventId={selectedEvent} />;
};

export default WhatsAppPage;