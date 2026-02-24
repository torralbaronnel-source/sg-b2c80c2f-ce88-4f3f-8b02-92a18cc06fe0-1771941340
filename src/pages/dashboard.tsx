import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Home,
  Star,
  Utensils,
  Camera,
  MapPin,
  Shield,
  Truck,
  Zap,
  AlertCircle,
  CheckCircle,
  Activity,
  Monitor,
  Target,
  Bell,
  Radio,
  Wifi,
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
  venue: string;
  guest_count: number;
  start_time: string;
  end_time: string;
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
  criticalAlerts?: number;
  pendingTasks?: number;
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
}

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  responsible: string;
  priority: 'normal' | 'urgent' | 'critical';
}

const stakeholderGroups: StakeholderGroup[] = [
  { id: '1', name: 'CLIENTS', type: 'client', icon: <Star className="h-4 w-4" />, count: 2, online: 2, status: 'online', lastCheckIn: '2m ago', responseTime: '<1m', signal: '5G', battery: '87%', criticalAlerts: 0, pendingTasks: 1 },
  { id: '2', name: 'CATERING', type: 'vendor', icon: <Utensils className="h-4 w-4" />, count: 3, online: 3, status: 'online', lastCheckIn: '5m ago', responseTime: '<2m', signal: '4G', battery: '92%', criticalAlerts: 0, pendingTasks: 0 },
  { id: '3', name: 'PHOTO/VIDEO', type: 'vendor', icon: <Camera className="h-4 w-4" />, count: 2, online: 1, status: 'critical', lastCheckIn: '15m ago', responseTime: '>10m', signal: '3G', battery: '45%', criticalAlerts: 1, pendingTasks: 3 },
  { id: '4', name: 'VENUE', type: 'vendor', icon: <MapPin className="h-4 w-4" />, count: 1, online: 1, status: 'online', lastCheckIn: '1m ago', responseTime: '<1m', signal: 'WIFI', battery: '100%', criticalAlerts: 0, pendingTasks: 0 },
  { id: '5', name: 'SECURITY', type: 'security', icon: <Shield className="h-4 w-4" />, count: 4, online: 4, status: 'online', lastCheckIn: '30s ago', responseTime: '<30s', signal: 'RADIO', battery: '78%', criticalAlerts: 0, pendingTasks: 0 },
  { id: '6', name: 'TRANSPORT', type: 'transport', icon: <Truck className="h-4 w-4" />, count: 3, online: 2, status: 'issue', lastCheckIn: '8m ago', responseTime: '5m', signal: '4G', battery: '34%', criticalAlerts: 1, pendingTasks: 2 },
  { id: '7', name: 'PRODUCTION', type: 'production', icon: <Zap className="h-4 w-4" />, count: 5, online: 5, status: 'online', lastCheckIn: '1m ago', responseTime: '<1m', signal: 'INTERCOM', battery: '91%', criticalAlerts: 0, pendingTasks: 0 },
  { id: '8', name: 'STAFF', type: 'staff', icon: <Users className="h-4 w-4" />, count: 8, online: 6, status: 'busy', lastCheckIn: '3m ago', responseTime: '2m', signal: 'WIFI', battery: '67%', criticalAlerts: 0, pendingTasks: 4 },
];

const messages: Message[] = [
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

const timelineEvents: TimelineEvent[] = [
  { id: '1', time: '2:30 PM', title: 'VENUE LOCKDOWN', status: 'completed', responsible: 'SECURITY', priority: 'critical' },
  { id: '2', time: '2:45 PM', title: 'SECURITY DEPLOYED', status: 'completed', responsible: 'SECURITY', priority: 'critical' },
  { id: '3', time: '3:00 PM', title: 'GUEST ARRIVAL', status: 'in-progress', responsible: 'TRANSPORT', priority: 'critical' },
  { id: '4', time: '4:00 PM', title: 'MAIN PROGRAM', status: 'upcoming', responsible: 'PRODUCTION', priority: 'critical' },
  { id: '5', time: '6:00 PM', title: 'DINNER SERVICE', status: 'upcoming', responsible: 'CATERING', priority: 'normal' },
];

export default function UnifiedEventDashboard() {
  const [selectedEvent] = useState<Event>({
    id: '1',
    title: 'JOHNSON WEDDING',
    client_name: 'Sarah & Mike Johnson',
    event_date: '2025-03-15',
    status: 'live',
    venue: 'Grand Ballroom',
    guest_count: 250,
    start_time: '3:00 PM',
    end_time: '11:00 PM'
  });

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('all');

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

  const getTimelineStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-yellow-500';
      case 'upcoming': return 'text-blue-500';
      case 'delayed': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const urgentMessages = messages.filter(m => m.priority === 'emergency' || m.priority === 'critical');
  const criticalStakeholders = stakeholderGroups.filter(s => s.status === 'critical' || s.criticalAlerts > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Command Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-3">
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
                    <Badge variant="outline" className="text-xs text-slate-400 border-slate-700">
                      {selectedEvent.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Status */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-white">{selectedEvent.title}</div>
                <div className="text-xs text-slate-400">{selectedEvent.client_name} • {selectedEvent.venue} • {selectedEvent.guest_count} GUESTS</div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Scan operations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <Select value={selectedStakeholder} onValueChange={setSelectedStakeholder}>
                  <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
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
                <Button variant="outline" size="sm" className="bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50">
                  <Bell className="h-4 w-4 mr-2 animate-pulse" />
                  ALERTS {urgentMessages.length}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Critical Alerts Bar */}
        {(urgentMessages.length > 0 || criticalStakeholders.length > 0) && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
                <span className="text-red-400 font-bold text-sm">
                  {urgentMessages.length} URGENT MESSAGES • {criticalStakeholders.length} CRITICAL ISSUES
                </span>
              </div>
              <Button variant="outline" size="sm" className="border-red-800 text-red-400 hover:bg-red-900/30">
                VIEW ALL
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Team Status Monitor */}
          <div className="lg:col-span-1">
            <Card className="h-[580px] bg-slate-900/95 border-slate-800">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                  <Monitor className="h-4 w-4 mr-2 text-green-500" />
                  TEAM STATUS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[520px]">
                  <div className="p-3 space-y-2">
                    {stakeholderGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`p-3 rounded border cursor-pointer transition-all ${
                          group.status === 'critical' || group.criticalAlerts > 0
                            ? 'bg-red-950/50 border-red-900/50 animate-pulse'
                            : group.status === 'issue'
                            ? 'bg-orange-950/50 border-orange-900/50'
                            : group.status === 'online'
                            ? 'bg-slate-800/50 border-slate-700/50'
                            : 'bg-slate-900/50 border-slate-700/50'
                        } hover:bg-slate-800`}
                        onClick={() => setSelectedStakeholder(group.type)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStakeholderStatusColor(group.status)} animate-pulse`}></div>
                            {group.icon}
                            <h4 className="font-bold text-xs text-white uppercase tracking-wider">{group.name}</h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            {group.criticalAlerts > 0 && (
                              <Badge className="text-xs bg-red-600 text-white animate-pulse">
                                !{group.criticalAlerts}
                              </Badge>
                            )}
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

                        {group.pendingTasks > 0 && (
                          <div className="mt-2 text-xs text-yellow-400">
                            {group.pendingTasks} PENDING ACTIONS
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Command Center */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Communications Console */}
              <Card className="h-[380px] bg-slate-900/95 border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-lg font-bold text-white font-mono">COMMUNICATIONS</h2>
                      <div className="flex items-center space-x-2">
                        <Badge className="text-xs bg-red-900 text-red-100 border-red-700 animate-pulse">
                          {messages.filter(m => m.priority === 'emergency').length} EMERGENCY
                        </Badge>
                        <Badge className="text-xs bg-orange-900 text-orange-100 border-orange-700">
                          {messages.filter(m => m.priority === 'critical').length} CRITICAL
                        </Badge>
                        <Badge className="text-xs bg-yellow-900 text-yellow-100 border-yellow-700">
                          {messages.filter(m => m.priority === 'urgent').length} URGENT
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
                  <div className="flex flex-col h-[260px]">
                    <ScrollArea className="flex-1 p-3 bg-slate-950/50">
                      <div className="space-y-2">
                        {messages.slice(0, 6).map((message) => (
                          <div
                            key={message.id}
                            className={`flex items-start space-x-3 p-2 rounded border ${
                              message.sender_type === 'coordinator' ? 'flex-row-reverse space-x-reverse bg-slate-800/30' : 'bg-slate-900/30'
                            } border-slate-800`}
                          >
                            <div className="flex-shrink-0">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
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
                                  <span className="text-xs font-bold text-white">{message.sender_name}</span>
                                  <span className="text-xs text-slate-400">{getPlatformIcon(message.platform)}</span>
                                  {message.priority !== 'normal' && (
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`}></div>
                                  )}
                                </div>
                                <span className="text-xs font-mono text-slate-500">
                                  {new Date(message.timestamp).getHours().toString().padStart(2, '0')}:{new Date(message.timestamp).getMinutes().toString().padStart(2, '0')}
                                </span>
                              </div>
                              <div className={`text-xs rounded-lg px-2 py-1 ${
                                message.sender_type === 'coordinator'
                                  ? 'bg-green-900/30 border border-green-700/50 text-green-100'
                                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-100'
                              }`}>
                                {message.content.length > 80 ? message.content.substring(0, 80) + '...' : message.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Command Input */}
                    <div className="border-t border-slate-800 p-3 bg-slate-900/95">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50"
                        >
                          <AlertCircle className="h-3 w-3" />
                        </Button>
                        <Input
                          placeholder="TRANSMISSION: (Use @ for urgent, # for critical, 🚨 for emergency)"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-xs"
                        />
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Send className="h-3 w-3 mr-1" />
                          SEND
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Timeline */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-800">
                  <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Target className="h-4 w-4 mr-2 text-orange-500" />
                    EVENT TIMELINE
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-3">
                    <div className="space-y-3">
                      {timelineEvents.map((event, index) => (
                        <div key={event.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              event.status === 'completed' 
                                ? 'bg-green-900/50 border border-green-700 text-green-400'
                                : event.status === 'in-progress'
                                ? 'bg-yellow-900/50 border border-yellow-700 text-yellow-400 animate-pulse'
                                : 'bg-slate-800/50 border border-slate-700 text-slate-500'
                            }`}>
                              {event.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono text-white">{event.time}</span>
                                <span className={`text-xs font-bold ${getTimelineStatusColor(event.status)}`}>
                                  {event.status.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500">{event.responsible}</span>
                            </div>
                            <div className="text-xs text-slate-300">{event.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Operations Status Panel */}
          <div className="lg:col-span-1">
            {/* Live Status Panel */}
            <Card className="h-[580px] bg-slate-900/95 border-slate-800">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500 animate-pulse" />
                  OPERATIONS STATUS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-950/50 border border-red-900/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-red-400">EMERGENCY</span>
                    </div>
                    <span className="text-xl font-bold text-red-500 animate-pulse">{urgentMessages.filter(m => m.priority === 'emergency').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-950/50 border border-orange-900/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-orange-400">CRITICAL</span>
                    </div>
                    <span className="text-xl font-bold text-orange-500">{urgentMessages.filter(m => m.priority === 'critical').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-950/50 border border-yellow-900/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-bold text-yellow-400">URGENT</span>
                    </div>
                    <span className="text-xl font-bold text-yellow-500">{urgentMessages.filter(m => m.priority === 'urgent').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-950/50 border border-green-900/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-bold text-green-400">ONLINE TEAMS</span>
                    </div>
                    <span className="text-xl font-bold text-green-500">
                      {stakeholderGroups.reduce((sum, team) => sum + team.online, 0)}/{stakeholderGroups.reduce((sum, team) => sum + team.count, 0)}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                    <div className="text-sm font-bold text-white mb-3">EVENT DETAILS</div>
                    <div className="space-y-2 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>VENUE:</span>
                        <span className="text-slate-300">{selectedEvent.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GUESTS:</span>
                        <span className="text-slate-300">{selectedEvent.guest_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>START:</span>
                        <span className="text-slate-300">{selectedEvent.start_time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>END:</span>
                        <span className="text-slate-300">{selectedEvent.end_time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50">
                      <Bell className="h-4 w-4 mr-2 animate-pulse" />
                      BROADCAST EMERGENCY
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      STATUS CHECK ALL
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                      <Users className="h-4 w-4 mr-2" />
                      TEAM ROSTER
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