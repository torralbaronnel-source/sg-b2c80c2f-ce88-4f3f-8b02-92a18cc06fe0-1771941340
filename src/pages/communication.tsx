import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Filter,
  AlertCircle,
  CheckCircle,
  Truck,
  Shield,
  Camera,
  Music,
  Utensils,
  MapPin,
  User,
  Star,
  Zap,
  Target,
  Bell
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
  sender_type: 'client' | 'vendor' | 'coordinator' | 'team' | 'supplier' | 'security' | 'transport' | 'production';
  content: string;
  timestamp: string;
  priority: 'normal' | 'urgent' | 'critical';
  status?: 'sent' | 'delivered' | 'read' | 'responded';
}

interface StakeholderGroup {
  id: string;
  name: string;
  type: 'client' | 'vendor' | 'staff' | 'supplier' | 'security' | 'transport' | 'production';
  icon: React.ReactNode;
  count: number;
  status: 'online' | 'offline' | 'busy' | 'issue';
  lastMessage?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

const stakeholderGroups: StakeholderGroup[] = [
  { id: '1', name: 'Clients', type: 'client', icon: <Star className="h-4 w-4" />, count: 2, status: 'online', urgency: 'high', lastMessage: 'Confirmed final guest count' },
  { id: '2', name: 'Catering', type: 'vendor', icon: <Utensils className="h-4 w-4" />, count: 3, status: 'online', urgency: 'critical', lastMessage: 'Setup starting at 2pm' },
  { id: '3', name: 'Photography/Video', type: 'vendor', icon: <Camera className="h-4 w-4" />, count: 2, status: 'offline', urgency: 'medium', lastMessage: 'Equipment checked yesterday' },
  { id: '4', name: 'Venue', type: 'vendor', icon: <MapPin className="h-4 w-4" />, count: 1, status: 'online', urgency: 'critical', lastMessage: 'Parking reserved for 15 cars' },
  { id: '5', name: 'Security', type: 'security', icon: <Shield className="h-4 w-4" />, count: 4, status: 'online', urgency: 'high', lastMessage: 'Team assembled at entrance' },
  { id: '6', name: 'Transport', type: 'transport', icon: <Truck className="h-4 w-4" />, count: 3, status: 'busy', urgency: 'high', lastMessage: '2 vehicles en route' },
  { id: '7', name: 'Production Crew', type: 'production', icon: <Zap className="h-4 w-4" />, count: 5, status: 'online', urgency: 'critical', lastMessage: 'Sound check in progress' },
  { id: '8', name: 'Internal Staff', type: 'staff', icon: <Users className="h-4 w-4" />, count: 8, status: 'online', urgency: 'medium', lastMessage: 'Briefing at 3pm' },
];

const quickTemplates = [
  { id: '1', name: 'URGENT: Location Update', template: '🚨 URGENT: Location update needed. Current location?' },
  { id: '2', name: 'Status Check', template: 'Quick status check - ETA?' },
  { id: '3', name: 'Timeline Alert', template: '⏰ Timeline alert: {time} deadline approaching' },
  { id: '4', name: 'Issue Resolution', template: '⚠️ Issue detected - please confirm resolution' },
  { id: '5', name: 'Ready Confirmation', template: '✅ Ready for next phase?' },
];

export default function CommunicationHub() {
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showTemplates, setShowTemplates] = useState(false);

  // Mock data for development
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Johnson Wedding',
        client_name: 'Sarah & Mike Johnson',
        event_date: '2025-03-15',
        status: 'confirmed',
        vendor_count: 28,
        message_count: 147
      },
      {
        id: '2',
        title: 'TechCorp Gala',
        client_name: 'TechCorp Inc.',
        event_date: '2025-03-22',
        status: 'planning',
        vendor_count: 15,
        message_count: 89
      },
      {
        id: '3',
        title: 'Miller Anniversary',
        client_name: 'The Miller Family',
        event_date: '2025-04-10',
        status: 'in_progress',
        vendor_count: 12,
        message_count: 234
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        platform: 'whatsapp',
        sender_name: 'Sarah Johnson',
        sender_type: 'client',
        content: '🚨 URGENT: Just arrived at venue - where should I park the family cars?',
        timestamp: '2025-02-24T10:30:00Z',
        priority: 'urgent',
        status: 'responded'
      },
      {
        id: '2',
        platform: 'slack',
        sender_name: 'John (Photography Lead)',
        sender_type: 'vendor',
        content: 'Camera equipment is ready. Setup starting at 2pm. All good!',
        timestamp: '2025-02-24T09:15:00Z',
        priority: 'normal',
        status: 'read'
      },
      {
        id: '3',
        platform: 'call',
        sender_name: 'Maria (Security Team)',
        sender_type: 'security',
        content: '🔴 CRITICAL: Guest list mismatch - 5 unauthorized people attempting entry',
        timestamp: '2025-02-24T08:45:00Z',
        priority: 'critical',
        status: 'responded'
      },
      {
        id: '4',
        platform: 'whatsapp',
        sender_name: 'Catering Manager',
        sender_type: 'vendor',
        content: 'All 150 meals confirmed. Dietary restrictions noted. Setup at 3pm.',
        timestamp: '2025-02-24T08:30:00Z',
        priority: 'normal',
        status: 'read'
      },
      {
        id: '5',
        platform: 'email',
        sender_name: 'Transport Coordinator',
        sender_type: 'transport',
        content: '⚠️ DELAY: One shuttle stuck in traffic. ETA +20 minutes.',
        timestamp: '2025-02-24T07:45:00Z',
        priority: 'urgent',
        status: 'responded'
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'urgent': return 'bg-orange-500';
      case 'normal': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStakeholderStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'busy': return 'bg-yellow-500';
      case 'issue': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 border-red-200 bg-red-50';
      case 'high': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'medium': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'low': return 'text-green-600 border-green-200 bg-green-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const filteredMessages = messages.filter(message => {
    const stakeholderMatch = selectedStakeholder === 'all' || message.sender_type === selectedStakeholder;
    const priorityMatch = priorityFilter === 'all' || message.priority === priorityFilter;
    return stakeholderMatch && priorityMatch;
  });

  const handleTemplateSelect = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">Orchestrix</h1>
              </div>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                Communication Hub
              </Badge>
              {selectedEvent && (
                <Badge variant="outline" className="ml-2">
                  {selectedEvent.title}
                </Badge>
              )}
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">🔴 Critical</SelectItem>
                  <SelectItem value="urgent">🟠 Urgent</SelectItem>
                  <SelectItem value="normal">⚪ Normal</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Stakeholder Groups Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[600px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Stakeholder Groups
                </CardTitle>
                <Select value={selectedStakeholder} onValueChange={setSelectedStakeholder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups ({stakeholderGroups.length})</SelectItem>
                    {stakeholderGroups.map(group => (
                      <SelectItem key={group.id} value={group.type}>
                        <div className="flex items-center space-x-2">
                          {group.icon}
                          <span>{group.name} ({group.count})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-3 space-y-2">
                    {stakeholderGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedStakeholder === group.type
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'hover:bg-slate-50 border-slate-200'
                        } ${getUrgencyColor(group.urgency)}`}
                        onClick={() => setSelectedStakeholder(group.type)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStakeholderStatusColor(group.status)}`}></div>
                            {group.icon}
                            <h4 className="font-medium text-sm text-slate-900">{group.name}</h4>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {group.count}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 mb-1 truncate">{group.lastMessage}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`text-xs ${getUrgencyColor(group.urgency)}`}>
                            {group.urgency}
                          </Badge>
                          <span className="text-xs text-slate-500">{group.status}</span>
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
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedEvent?.title || 'Communication Hub'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-800">
                      {filteredMessages.filter(m => m.priority === 'critical').length} Critical
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                      {filteredMessages.filter(m => m.priority === 'urgent').length} Urgent
                    </Badge>
                  </div>
                </div>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all" className="text-xs">All ({filteredMessages.length})</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="text-xs">💬 WhatsApp</TabsTrigger>
                    <TabsTrigger value="slack" className="text-xs">🔗 Slack</TabsTrigger>
                    <TabsTrigger value="email" className="text-xs">📧 Email</TabsTrigger>
                    <TabsTrigger value="call" className="text-xs">📞 Calls</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[480px]">
                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {filteredMessages.map((message) => (
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
                              {message.priority !== 'normal' && (
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`}></div>
                              )}
                              {message.status && (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              )}
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

                  {/* Message Input with Templates */}
                  <div className="border-t border-slate-200 p-4">
                    {showTemplates && (
                      <div className="mb-3 p-2 bg-slate-50 rounded-lg border">
                        <div className="text-xs font-medium text-slate-700 mb-2">Quick Templates:</div>
                        <div className="space-y-1">
                          {quickTemplates.map((template) => (
                            <div
                              key={template.id}
                              className="text-xs p-2 bg-white rounded border hover:bg-blue-50 cursor-pointer"
                              onClick={() => handleTemplateSelect(template.template)}
                            >
                              <div className="font-medium">{template.name}</div>
                              <div className="text-slate-500 truncate">{template.template}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplates(!showTemplates)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message... (Use @ for urgent, # for critical)"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events & Stats Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Events */}
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Active Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[200px]">
                  <div className="p-3 space-y-2">
                    {events.map((event) => (
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

            {/* Real-time Status */}
            <Card className="h-[340px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Live Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Critical Issues</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">1</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Urgent Messages</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">2</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Online Stakeholders</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">6/8</span>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">Event Day Timeline</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs">Setup Complete - 2:30pm</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">Guest Arrival - 3:00pm</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">Main Event - 4:00pm</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button variant="outline" size="sm" className="w-full">
                      <Bell className="h-4 w-4 mr-2" />
                      Broadcast Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}