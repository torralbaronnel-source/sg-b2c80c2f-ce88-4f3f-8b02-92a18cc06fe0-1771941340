import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AppLayout } from '@/components/Layout/AppLayout';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Users, 
  Calendar, 
  Clock,
  Send,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  client_name: string;
  event_date: string;
  status: string;
  vendor_count?: number;
  message_count?: number;
}

interface Message {
  id: string;
  platform: 'whatsapp' | 'slack' | 'email' | 'call';
  sender_name: string;
  sender_type: 'client' | 'vendor' | 'coordinator' | 'team';
  content: string;
  timestamp: string;
}

export default function CommunicationHub() {
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for development
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Johnson Wedding',
        client_name: 'Sarah & Mike Johnson',
        event_date: '2025-03-15',
        status: 'confirmed',
        vendor_count: 8,
        message_count: 47
      },
      {
        id: '2',
        title: 'TechCorp Gala',
        client_name: 'TechCorp Inc.',
        event_date: '2025-03-22',
        status: 'planning',
        vendor_count: 12,
        message_count: 23
      },
      {
        id: '3',
        title: 'Miller Anniversary',
        client_name: 'The Miller Family',
        event_date: '2025-04-10',
        status: 'in_progress',
        vendor_count: 6,
        message_count: 89
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        platform: 'whatsapp',
        sender_name: 'Sarah Johnson',
        sender_type: 'client',
        content: 'Hi! Just confirmed the flower arrangements with the florist. They look amazing! 🌸',
        timestamp: '2025-02-24T10:30:00Z'
      },
      {
        id: '2',
        platform: 'slack',
        sender_name: 'John Photographer',
        sender_type: 'vendor',
        content: 'Camera equipment is ready for Saturday. See you at 2pm for setup.',
        timestamp: '2025-02-24T09:15:00Z'
      },
      {
        id: '3',
        platform: 'email',
        sender_name: 'Catering Co.',
        sender_type: 'vendor',
        content: 'Final menu confirmed for 150 guests. Dietary restrictions noted.',
        timestamp: '2025-02-24T08:45:00Z'
      },
      {
        id: '4',
        platform: 'call',
        sender_name: 'Venue Manager',
        sender_type: 'vendor',
        content: 'Call lasted 12 minutes - discussed parking arrangements and setup timeline.',
        timestamp: '2025-02-24T07:30:00Z'
      }
    ];

    setEvents(mockEvents);
    setMessages(mockMessages);
    setSelectedEvent(mockEvents[0]);
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return '💬';
      case 'slack': return '🔗';
      case 'email': return '📧';
      case 'call': return '📞';
      default: return '💭';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout activeApp="communication">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Events Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Events
              </CardTitle>
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <div className="p-3 space-y-2">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedEvent?.id === event.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-slate-50 border-slate-200'
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-slate-900">{event.title}</h4>
                        <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{event.client_name}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(event.event_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.vendor_count}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {event.message_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Communication Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedEvent?.title || 'Select an Event'}
                  </h2>
                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                    Communication Hub
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="whatsapp" className="text-xs">💬</TabsTrigger>
                  <TabsTrigger value="slack" className="text-xs">🔗</TabsTrigger>
                  <TabsTrigger value="email" className="text-xs">📧</TabsTrigger>
                  <TabsTrigger value="call" className="text-xs">📞</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col h-[520px]">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender_type === 'coordinator' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            message.sender_type === 'coordinator' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {message.sender_name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className={`flex-1 max-w-[70%] ${
                          message.sender_type === 'coordinator' ? 'text-right' : ''
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-slate-900">
                              {message.sender_name}
                            </span>
                            <span className="text-xs text-slate-500">{getPlatformIcon(message.platform)}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className={`rounded-lg px-3 py-2 text-sm ${
                            message.sender_type === 'coordinator'
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t border-slate-200 p-4">
                  <div className="flex items-center space-x-3">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Events</p>
                <p className="text-2xl font-bold text-slate-900">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Messages</p>
                <p className="text-2xl font-bold text-slate-900">
                  {events.reduce((sum, event) => sum + (event.message_count || 0), 0)}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Vendors</p>
                <p className="text-2xl font-bold text-slate-900">
                  {events.reduce((sum, event) => sum + (event.vendor_count || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Response Rate</p>
                <p className="text-2xl font-bold text-slate-900">87%</p>
              </div>
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}