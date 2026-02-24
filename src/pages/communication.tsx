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
  Bell,
  Radio,
  Activity,
  Monitor,
  Wifi,
  WifiOff,
  AlertTriangle,
  ChevronRight,
  Square,
  Circle
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  client_name: string;
  event_date: string;
  status: 'setup' | 'live' | 'critical' | 'completed';
  vendor_count?: number;
  message_count?: number;
  emergency_contacts?: number;
  live_duration?: string;
}

interface Message {
  id: string;
  platform: 'whatsapp' | 'slack' | 'email' | 'call' | 'radio' | 'intercom';
  sender_name: string;
  sender_type: 'client' | 'vendor' | 'coordinator' | 'team' | 'supplier' | 'security' | 'transport' | 'production';
  content: string;
  timestamp: string;
  priority: 'normal' | 'urgent' | 'critical' | 'emergency';
  status?: 'sent' | 'delivered' | 'read' | 'responded' | 'escalated';
  duration?: number;
  channel?: string;
}

interface StakeholderGroup {
  id: string;
  name: string;
  type: 'client' | 'vendor' | 'staff' | 'supplier' | 'security' | 'transport' | 'production';
  icon: React.ReactNode;
  count: number;
  online: number;
  status: 'online' | 'offline' | 'busy' | 'issue' | 'critical';
  lastCheckIn?: string;
  responseTime?: string;
  signal?: string;
  battery?: string;
}

const stakeholderGroups: StakeholderGroup[] = [
  { id: '1', name: 'CLIENTS', type: 'client', icon: <Star className="h-4 w-4" />, count: 2, online: 2, status: 'online', lastCheckIn: '2m ago', responseTime: '<1m', signal: '5G', battery: '87%' },
  { id: '2', name: 'CATERING', type: 'vendor', icon: <Utensils className="h-4 w-4" />, count: 3, online: 3, status: 'online', lastCheckIn: '5m ago', responseTime: '<2m', signal: '4G', battery: '92%' },
  { id: '3', name: 'PHOTO/VIDEO', type: 'vendor', icon: <Camera className="h-4 w-4" />, count: 2, online: 1, status: 'critical', lastCheckIn: '15m ago', responseTime: '>10m', signal: '3G', battery: '45%' },
  { id: '4', name: 'VENUE', type: 'vendor', icon: <MapPin className="h-4 w-4" />, count: 1, online: 1, status: 'online', lastCheckIn: '1m ago', responseTime: '<1m', signal: 'WIFI', battery: '100%' },
  { id: '5', name: 'SECURITY', type: 'security', icon: <Shield className="h-4 w-4" />, count: 4, online: 4, status: 'online', lastCheckIn: '30s ago', responseTime: '<30s', signal: 'RADIO', battery: '78%' },
  { id: '6', name: 'TRANSPORT', type: 'transport', icon: <Truck className="h-4 w-4" />, count: 3, online: 2, status: 'issue', lastCheckIn: '8m ago', responseTime: '5m', signal: '4G', battery: '34%' },
  { id: '7', name: 'PRODUCTION', type: 'production', icon: <Zap className="h-4 w-4" />, count: 5, online: 5, status: 'online', lastCheckIn: '1m ago', responseTime: '<1m', signal: 'INTERCOM', battery: '91%' },
  { id: '8', name: 'STAFF', type: 'staff', icon: <Users className="h-4 w-4" />, count: 8, online: 6, status: 'busy', lastCheckIn: '3m ago', responseTime: '2m', signal: 'WIFI', battery: '67%' },
];

const quickTemplates = [
  { id: '1', name: 'EMERGENCY', template: '🚨 EMERGENCY: Immediate response required', priority: 'emergency' },
  { id: '2', name: 'URGENT', template: '🔴 URGENT: Location/Status update needed NOW', priority: 'urgent' },
  { id: '3', name: 'Timeline Alert', template: '⏰ TIMELINE: {time} deadline - confirm status', priority: 'critical' },
  { id: '4', name: 'Check In', template: '📡 CHECK IN: Report current status and location', priority: 'normal' },
  { id: '5', name: 'Issue Report', template: '⚠️ ISSUE: [team] - [problem] - [resolution needed]', priority: 'urgent' },
];

const productionCommands = [
  'BROADCAST: All teams check in NOW',
  'LOCKDOWN: Access control activated',
  'EVACUATE: Emergency protocol initiated',
  'STANDBY: All teams on standby',
  'CLEAR: Venue cleared for next phase'
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
  const [showCommands, setShowCommands] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock data for development
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'JOHNSON WEDDING',
        client_name: 'Sarah & Mike Johnson',
        event_date: '2025-03-15',
        status: 'live',
        vendor_count: 28,
        message_count: 147,
        emergency_contacts: 2,
        live_duration: '2h 34m'
      },
      {
        id: '2',
        title: 'TECHCORP GALA',
        client_name: 'TechCorp Inc.',
        event_date: '2025-03-22',
        status: 'setup',
        vendor_count: 15,
        message_count: 89,
        emergency_contacts: 3,
        live_duration: '--'
      },
      {
        id: '3',
        title: 'MILLER ANNIVERSARY',
        client_name: 'The Miller Family',
        event_date: '2025-04-10',
        status: 'completed',
        vendor_count: 12,
        message_count: 234,
        emergency_contacts: 1,
        live_duration: '6h 12m'
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        platform: 'radio',
        sender_name: 'SECURITY CHIEF',
        sender_type: 'security',
        content: '🚨 EMERGENCY: Gate breach detected - 3 unauthorized vehicles attempting entry',
        timestamp: '2025-02-24T10:30:00Z',
        priority: 'emergency',
        status: 'escalated'
      },
      {
        id: '2',
        platform: 'intercom',
        sender_name: 'PRODUCTION LEAD',
        sender_type: 'production',
        content: '🔴 SOUND CHECK COMPLETE - All systems operational. Ready for main program.',
        timestamp: '2025-02-24T10:25:00Z',
        priority: 'urgent',
        status: 'read'
      },
      {
        id: '3',
        platform: 'whatsapp',
        sender_name: 'TRANSPORT COORDINATOR',
        sender_type: 'transport',
        content: '⚠️ SHUTTLE #3 ENGINE OVERHEAT - Rerouting to backup vehicle. 15min delay.',
        timestamp: '2025-02-24T10:20:00Z',
        priority: 'urgent',
        status: 'responded'
      },
      {
        id: '4',
        platform: 'slack',
        sender_name: 'CATERING DIRECTOR',
        sender_type: 'vendor',
        content: '✅ ALL 250 MEALS SERVED - Dietary restrictions honored. Cleanup phase initiated.',
        timestamp: '2025-02-24T10:15:00Z',
        priority: 'normal',
        status: 'read'
      },
      {
        id: '5',
        platform: 'call',
        sender_name: 'VENUE MANAGER',
        sender_type: 'vendor',
        content: '📞 CALL (4:23): PARKING FULL - Emergency overflow lot opened. Additional security deployed.',
        timestamp: '2025-02-24T10:10:00Z',
        priority: 'critical',
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
      case 'radio': return '📡';
      case 'intercom': return '🔊';
      default: return '💭';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-900 text-red-100 border-red-700';
      case 'setup': return 'bg-amber-900 text-amber-100 border-amber-700';
      case 'critical': return 'bg-red-950 text-red-100 border-red-800';
      case 'completed': return 'bg-slate-800 text-slate-100 border-slate-700';
      default: return 'bg-slate-800 text-slate-100 border-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-600 animate-pulse';
      case 'critical': return 'bg-orange-600';
      case 'urgent': return 'bg-yellow-600';
      case 'normal': return 'bg-slate-600';
      default: return 'bg-slate-600';
    }
  };

  const getStakeholderStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-slate-500';
      case 'busy': return 'text-yellow-500';
      case 'issue': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-red-900 bg-red-950/50';
      case 'high': return 'border-orange-900 bg-orange-950/50';
      case 'medium': return 'border-yellow-900 bg-yellow-950/50';
      case 'low': return 'border-green-900 bg-green-950/50';
      default: return 'border-slate-700 bg-slate-900/50';
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

  const handleCommandSelect = (command: string) => {
    setNewMessage(command);
    setShowCommands(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-950 text-slate-100 production-grid">
        {/* Command Header */}
        <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50 shadow-xl">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Mission Control */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Radio className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white font-mono tracking-wider">ORCHESTRIX</h1>
                    <div className="flex items-center space-x-2">
                      <Badge className="text-xs bg-red-900 text-red-100 border-red-700">
                        LIVE COMMAND CENTER
                      </Badge>
                      {selectedEvent && (
                        <Badge variant="outline" className="text-xs text-slate-400 border-slate-700">
                          {selectedEvent.status.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Status */}
              <div className="flex items-center space-x-6">
                {selectedEvent && (
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-white">{selectedEvent.title}</div>
                    <div className="text-xs text-slate-400">{selectedEvent.client_name} • LIVE {selectedEvent.live_duration}</div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="Scan comms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-48 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">ALL PRIORITY</SelectItem>
                      <SelectItem value="emergency">🚨 EMERGENCY</SelectItem>
                      <SelectItem value="critical">🔴 CRITICAL</SelectItem>
                      <SelectItem value="urgent">🟠 URGENT</SelectItem>
                      <SelectItem value="normal">⚪ NORMAL</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50">
                    <Bell className="h-4 w-4 mr-2 animate-pulse" />
                    ALERTS
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Team Status Monitor */}
            <div className="lg:col-span-1">
              <Card className="h-[640px] bg-slate-900/95 border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-800">
                  <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Monitor className="h-4 w-4 mr-2 text-green-500" />
                    TEAM STATUS
                  </CardTitle>
                  <Select value={selectedStakeholder} onValueChange={setSelectedStakeholder}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">ALL TEAMS</SelectItem>
                      {stakeholderGroups.map(group => (
                        <SelectItem key={group.id} value={group.type}>
                          <div className="flex items-center space-x-2">
                            {group.icon}
                            <span>{group.name} ({group.online}/{group.count})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[580px]">
                    <div className="p-3 space-y-2">
                      {stakeholderGroups.map((group) => (
                        <div
                          key={group.id}
                          className={`p-3 rounded border cursor-pointer transition-all ${
                            selectedStakeholder === group.type
                              ? 'bg-slate-800 border-green-700 shadow-lg'
                              : 'hover:bg-slate-800/50 border-slate-700'
                          } ${getUrgencyColor(group.status)}`}
                          onClick={() => setSelectedStakeholder(group.type)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${getStakeholderStatusColor(group.status)} animate-pulse`}></div>
                              {group.icon}
                              <h4 className="font-bold text-xs text-white uppercase tracking-wider">{group.name}</h4>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Wifi className="h-3 w-3 text-green-500" />
                              <span className="text-xs font-mono text-green-400">{group.online}/{group.count}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                            <div>
                              <span className="text-slate-500">LAST:</span> {group.lastCheckIn}
                            </div>
                            <div>
                              <span className="text-slate-500">RESP:</span> {group.responseTime}
                            </div>
                            <div>
                              <span className="text-slate-500">SIGNAL:</span> {group.signal}
                            </div>
                            <div>
                              <span className="text-slate-500">POWER:</span> {group.battery}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Communications Console */}
            <div className="lg:col-span-3">
              <Card className="h-[640px] bg-slate-900/95 border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-lg font-bold text-white font-mono">COMMUNICATIONS</h2>
                      <div className="flex items-center space-x-2">
                        <Badge className="text-xs bg-red-900 text-red-100 border-red-700 animate-pulse">
                          {filteredMessages.filter(m => m.priority === 'emergency').length} EMERGENCY
                        </Badge>
                        <Badge className="text-xs bg-orange-900 text-orange-100 border-orange-700">
                          {filteredMessages.filter(m => m.priority === 'critical').length} CRITICAL
                        </Badge>
                        <Badge className="text-xs bg-yellow-900 text-yellow-100 border-yellow-700">
                          {filteredMessages.filter(m => m.priority === 'urgent').length} URGENT
                        </Badge>
                      </div>
                    </div>
                    <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  </div>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-6 bg-slate-800 border-slate-700">
                      <TabsTrigger value="all" className="text-xs text-slate-400">ALL</TabsTrigger>
                      <TabsTrigger value="whatsapp" className="text-xs">💬</TabsTrigger>
                      <TabsTrigger value="slack" className="text-xs">🔗</TabsTrigger>
                      <TabsTrigger value="email" className="text-xs">📧</TabsTrigger>
                      <TabsTrigger value="call" className="text-xs">📞</TabsTrigger>
                      <TabsTrigger value="radio" className="text-xs">📡</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col h-[520px]">
                    {/* Messages Feed */}
                    <ScrollArea className="flex-1 p-4 bg-slate-950/50">
                      <div className="space-y-3">
                        {filteredMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex items-start space-x-3 p-2 rounded border ${
                              message.sender_type === 'coordinator' ? 'flex-row-reverse space-x-reverse bg-slate-800/30' : 'bg-slate-900/30'
                            } border-slate-800`}
                          >
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                message.sender_type === 'coordinator' 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-slate-700 text-slate-300'
                              }`}>
                                {message.sender_name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className={`flex-1 ${message.sender_type === 'coordinator' ? 'text-right' : ''}`}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-bold text-white">{message.sender_name}</span>
                                  <span className="text-xs text-slate-400">{getPlatformIcon(message.platform)}</span>
                                  {message.priority !== 'normal' && (
                                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(message.priority)}`}></div>
                                  )}
                                  {message.status && (
                                    <div className="flex items-center">
                                      {message.status === 'escalated' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                      {message.status === 'responded' && <CheckCircle className="h-3 w-3 text-green-500" />}
                                      {message.status === 'read' && <CheckCircle className="h-3 w-3 text-slate-500" />}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs font-mono text-slate-500">
                                  {new Date(message.timestamp).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                              <div className={`rounded-lg px-3 py-2 text-sm font-mono ${
                                message.sender_type === 'coordinator'
                                  ? 'bg-green-900/30 border border-green-700/50 text-green-100'
                                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-100'
                              }`}>
                                {message.content}
                                {message.duration && (
                                  <div className="text-xs text-slate-400 mt-1">Duration: {message.duration}min</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Command Input */}
                    <div className="border-t border-slate-800 p-4 bg-slate-900/95">
                      {showTemplates && (
                        <div className="mb-3 p-2 bg-slate-800/50 rounded border border-slate-700">
                          <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">QUICK TEMPLATES:</div>
                          <div className="space-y-1">
                            {quickTemplates.map((template) => (
                              <div
                                key={template.id}
                                className="text-xs p-2 bg-slate-900/50 rounded border border-slate-700 hover:bg-slate-800 cursor-pointer"
                                onClick={() => handleTemplateSelect(template.template)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-bold text-white">{template.name}</span>
                                    <div className="text-slate-400 truncate">{template.template}</div>
                                  </div>
                                  <ChevronRight className="h-3 w-3 text-slate-500" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {showCommands && (
                        <div className="mb-3 p-2 bg-red-900/20 rounded border border-red-800/50">
                          <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">PRODUCTION COMMANDS:</div>
                          <div className="space-y-1">
                            {productionCommands.map((command, index) => (
                              <div
                                key={index}
                                className="text-xs p-2 bg-slate-900/50 rounded border border-slate-700 hover:bg-red-900/20 cursor-pointer"
                                onClick={() => handleCommandSelect(command)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="text-red-300 font-mono">{command}</div>
                                  <ChevronRight className="h-3 w-3 text-red-500" />
                                </div>
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
                          className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCommands(!showCommands)}
                          className="bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="TRANSMISSION: (Use @ for urgent, # for critical, 🚨 for emergency)"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono"
                        />
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Send className="h-4 w-4 mr-2" />
                          SEND
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mission Status */}
            <div className="lg:col-span-1">
              {/* Active Operations */}
              <Card className="mb-4 bg-slate-900/95 border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-800">
                  <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Target className="h-4 w-4 mr-2 text-orange-500" />
                    ACTIVE OPERATIONS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[200px]">
                    <div className="p-3 space-y-2">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`p-3 rounded border cursor-pointer transition-all ${
                            selectedEvent?.id === event.id
                              ? 'bg-slate-800 border-orange-700 shadow-lg'
                              : 'hover:bg-slate-800/50 border-slate-700'
                          }`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-xs text-white uppercase tracking-wider">{event.title}</h4>
                            <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{event.client_name}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                            <div>TEAMS: {event.vendor_count}</div>
                            <div>COMMS: {event.message_count}</div>
                            {event.emergency_contacts && (
                              <div>EMERGENCY: {event.emergency_contacts}</div>
                            )}
                            <div>DURATION: {event.live_duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Live Status Panel */}
              <Card className="h-[400px] bg-slate-900/95 border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-800">
                  <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500 animate-pulse" />
                    LIVE STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-950/50 border border-red-900/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-red-400">EMERGENCY</span>
                      </div>
                      <span className="text-xl font-bold text-red-500 animate-pulse">1</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-950/50 border border-orange-900/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-orange-400">CRITICAL</span>
                      </div>
                      <span className="text-xl font-bold text-orange-500">3</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-950/50 border border-yellow-900/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-bold text-yellow-400">URGENT</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-500">5</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-950/50 border border-green-900/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-bold text-green-400">ONLINE TEAMS</span>
                      </div>
                      <span className="text-xl font-bold text-green-500">23/28</span>
                    </div>

                    <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                      <div className="text-sm font-bold text-white mb-3">MISSION TIMELINE</div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-slate-400">VENUE LOCKDOWN - 2:30pm</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-slate-400">SECURITY DEPLOYED - 2:45pm</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-yellow-400 font-mono">GUEST ARRIVAL - 3:00pm (NOW)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Circle className="h-3 w-3 text-slate-600" />
                          <span className="text-xs text-slate-500">MAIN PROGRAM - 4:00pm</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-3">
                      <Button variant="outline" size="sm" className="w-full bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50">
                        <Bell className="h-4 w-4 mr-2 animate-pulse" />
                        BROADCAST ALERT
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}