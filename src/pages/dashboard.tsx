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
  Circle,
  Volume2
} from 'lucide-react';

// Tablet-optimized interfaces
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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'online' | 'offline' | 'busy' | 'emergency';
  lastSeen: string;
  battery: number;
  location: string;
  tasks: number;
}

interface Message {
  id: string;
  platform: 'whatsapp' | 'slack' | 'email' | 'call' | 'radio' | 'intercom';
  sender: string;
  department: string;
  content: string;
  time: string;
  priority: 'normal' | 'urgent' | 'critical' | 'emergency';
  status: 'sent' | 'delivered' | 'read' | 'responded';
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  department: string;
  status: 'pending' | 'in-progress' | 'completed' | 'critical';
  time: string;
  priority: 'normal' | 'urgent' | 'critical';
}

// Sample data optimized for tablet viewing
const selectedEvent: Event = {
  id: '1',
  title: 'REYES-SANTOS WEDDING',
  client_name: 'Maria & Carlos Reyes-Santos',
  event_date: '2026-03-15',
  status: 'live',
  venue: 'Manila Hotel Grand Ballroom',
  guest_count: 350,
  start_time: '15:00',
  end_time: '23:00'
};

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Chef Miguel', role: 'Head Chef', department: 'Catering', status: 'online', lastSeen: '1m ago', battery: 92, location: 'Kitchen', tasks: 2 },
  { id: '2', name: 'Anna Photography', role: 'Lead Photographer', department: 'Photo/Video', status: 'emergency', lastSeen: '5m ago', battery: 45, location: 'Main Hall', tasks: 5 },
  { id: '3', name: 'Security Chief Ramos', role: 'Head of Security', department: 'Security', status: 'online', lastSeen: '30s ago', battery: 78, location: 'Main Entrance', tasks: 0 },
  { id: '4', name: 'Transport Lead', role: 'Fleet Manager', department: 'Transport', status: 'busy', lastSeen: '3m ago', battery: 34, location: 'Parking Area', tasks: 3 },
  { id: '5', name: 'Production Director', role: 'AV Director', department: 'Production', status: 'online', lastSeen: '1m ago', battery: 91, location: 'Control Room', tasks: 1 },
  { id: '6', name: 'Venue Manager', role: 'Operations Manager', department: 'Venue', status: 'online', lastSeen: '2m ago', battery: 100, location: 'Front Desk', tasks: 0 }
];

const messages: Message[] = [
  {
    id: '1',
    platform: 'radio',
    sender: 'Security Chief Ramos',
    department: 'Security',
    content: 'EMERGENCY: Unauthorized vehicle attempting main entrance - dispatch team immediately',
    time: '14:30',
    priority: 'emergency',
    status: 'responded'
  },
  {
    id: '2',
    platform: 'intercom',
    sender: 'Production Director',
    department: 'Production',
    content: 'Sound system check complete - all microphones and speakers operational',
    time: '14:25',
    priority: 'normal',
    status: 'read'
  },
  {
    id: '3',
    platform: 'whatsapp',
    sender: 'Transport Lead',
    department: 'Transport',
    content: 'Shuttle #3 engine overheating - sending backup vehicle, 15min delay expected',
    time: '14:20',
    priority: 'urgent',
    status: 'read'
  },
  {
    id: '4',
    platform: 'call',
    sender: 'Venue Manager',
    department: 'Venue',
    content: 'Parking at capacity - opened overflow lot, additional security deployed',
    time: '14:15',
    priority: 'critical',
    status: 'responded'
  },
  {
    id: '5',
    platform: 'slack',
    sender: 'Chef Miguel',
    department: 'Catering',
    content: 'All 350 meals prepared and ready for service - dietary restrictions confirmed',
    time: '14:10',
    priority: 'normal',
    status: 'read'
  }
];

const tasks: Task[] = [
  { id: '1', title: 'Emergency gate security', assignee: 'Security Team', department: 'Security', status: 'critical', time: '14:30', priority: 'critical' },
  { id: '2', title: 'Replace shuttle #3', assignee: 'Transport Lead', department: 'Transport', status: 'in-progress', time: '14:20', priority: 'urgent' },
  { id: '3', title: 'Guest arrival coordination', assignee: 'Transport Team', department: 'Transport', status: 'in-progress', time: '14:00', priority: 'critical' },
  { id: '4', title: 'Final sound check', assignee: 'Production', department: 'Production', status: 'completed', time: '13:45', priority: 'normal' }
];

export default function UnifiedEventDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');

  // Safe time formatting function to prevent hydration errors
  const formatTime = (time: string) => {
    return time; // Already in 24-hour format, no parsing needed
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

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-slate-500';
      case 'busy': return 'text-yellow-500';
      case 'emergency': return 'text-red-500';
      default: return 'text-slate-500';
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

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Catering': return <Utensils className="h-4 w-4" />;
      case 'Photo/Video': return <Camera className="h-4 w-4" />;
      case 'Security': return <Shield className="h-4 w-4" />;
      case 'Transport': return <Truck className="h-4 w-4" />;
      case 'Production': return <Zap className="h-4 w-4" />;
      case 'Venue': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const emergencyCount = messages.filter(m => m.priority === 'emergency').length;
  const criticalCount = messages.filter(m => m.priority === 'critical').length;
  const onlineTeams = teamMembers.filter(t => t.status === 'online').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Tablet-Optimized Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Volume2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-mono tracking-wider">ORCHESTRIX</h1>
                  <div className="flex items-center space-x-2">
                    <Badge className="text-sm bg-red-900 text-red-100 border-red-700">
                      LIVE COMMAND CENTER
                    </Badge>
                    <Badge variant="outline" className="text-sm text-slate-400 border-slate-700">
                      {selectedEvent.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-xl font-mono font-bold text-white">{selectedEvent.title}</div>
                <div className="text-sm text-slate-400">{selectedEvent.venue} • {selectedEvent.guest_count} GUESTS</div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">ALL DEPARTMENTS</SelectItem>
                    <SelectItem value="catering">CATERING</SelectItem>
                    <SelectItem value="photo-video">PHOTO/VIDEO</SelectItem>
                    <SelectItem value="security">SECURITY</SelectItem>
                    <SelectItem value="transport">TRANSPORT</SelectItem>
                    <SelectItem value="production">PRODUCTION</SelectItem>
                    <SelectItem value="venue">VENUE</SelectItem>
                  </SelectContent>
                </Select>
                {emergencyCount > 0 && (
                  <Button variant="outline" size="sm" className="bg-red-900/30 border-red-800 text-red-400 hover:bg-red-900/50">
                    <Bell className="h-4 w-4 mr-2 animate-pulse" />
                    {emergencyCount} EMERGENCY
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Critical Alert Bar - Tablet Optimized */}
      {emergencyCount > 0 && (
        <div className="bg-red-950/70 border-b border-red-900/50 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />
              <span className="text-red-400 font-bold">
                {emergencyCount} EMERGENCY ALERTS • {criticalCount} CRITICAL ISSUES
              </span>
            </div>
            <Button variant="outline" size="sm" className="border-red-800 text-red-400 hover:bg-red-900/30">
              VIEW ALL
            </Button>
          </div>
        </div>
      )}

      {/* Tablet-Optimized Main Content */}
      <div className="container mx-auto px-4 py-4">
        {/* Status Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/95 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">EMERGENCY</div>
                  <div className="text-2xl font-bold text-red-500 animate-pulse">{emergencyCount}</div>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/95 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">ONLINE TEAMS</div>
                  <div className="text-2xl font-bold text-green-500">{onlineTeams}/{teamMembers.length}</div>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/95 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">ACTIVE TASKS</div>
                  <div className="text-2xl font-bold text-yellow-500">{tasks.filter(t => t.status !== 'completed').length}</div>
                </div>
                <Target className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/95 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">EVENT TIME</div>
                  <div className="text-2xl font-bold text-white">{selectedEvent.start_time} - {selectedEvent.end_time}</div>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid - Tablet Optimized */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="text-sm">OVERVIEW</TabsTrigger>
            <TabsTrigger value="teams" className="text-sm">TEAMS</TabsTrigger>
            <TabsTrigger value="messages" className="text-sm">MESSAGES</TabsTrigger>
            <TabsTrigger value="tasks" className="text-sm">TASKS</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Messages */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-white">RECENT COMMUNICATIONS</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {messages.slice(0, 6).map((message) => (
                        <div key={message.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getPlatformIcon(message.platform)}</span>
                              <div>
                                <div className="font-bold text-white">{message.sender}</div>
                                <div className="text-xs text-slate-400">{message.department}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-mono text-white">{formatTime(message.time)}</div>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)} mx-auto`}></div>
                            </div>
                          </div>
                          <div className="text-sm text-slate-300">{message.content}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Team Status */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-white">TEAM STATUS</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div key={member.id} className={`p-3 rounded-lg border ${
                          member.status === 'emergency' 
                            ? 'bg-red-950/50 border-red-900/50 animate-pulse'
                            : 'bg-slate-800/50 border-slate-700/50'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${getTeamStatusColor(member.status)} animate-pulse`}></div>
                              <div>
                                <div className="font-bold text-white">{member.name}</div>
                                <div className="text-xs text-slate-400">{member.role}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs font-bold ${getTeamStatusColor(member.status)}`}>
                                {member.status.toUpperCase()}
                              </div>
                              <div className="text-xs text-slate-500">{member.lastSeen}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                            <div>
                              <span className="text-slate-500">📍</span> {member.location}
                            </div>
                            <div>
                              <span className="text-slate-500">🔋</span> {member.battery}%
                            </div>
                            <div>
                              <span className="text-slate-500">📋</span> {member.tasks} tasks
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <Card className="bg-slate-900/95 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-white">ALL TEAM MEMBERS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className={`bg-slate-800/50 border ${
                      member.status === 'emergency' 
                        ? 'border-red-900/50 animate-pulse'
                        : 'border-slate-700/50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-4 h-4 rounded-full ${getTeamStatusColor(member.status)} animate-pulse`}></div>
                          <div className="flex-1">
                            <div className="font-bold text-white">{member.name}</div>
                            <div className="text-sm text-slate-400">{member.role}</div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Department:</span>
                            <div className="flex items-center space-x-1">
                              {getDepartmentIcon(member.department)}
                              <span className="text-white">{member.department}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Status:</span>
                            <span className={`font-bold ${getTeamStatusColor(member.status)}`}>
                              {member.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Location:</span>
                            <span className="text-white">{member.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Battery:</span>
                            <span className={member.battery < 50 ? 'text-red-400' : 'text-green-400'}>
                              {member.battery}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Tasks:</span>
                            <span className="text-white">{member.tasks}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="bg-slate-900/95 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-white">ALL MESSAGES</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Message Input */}
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Send message to all teams..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                      />
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages List */}
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <div key={message.id} className={`p-4 rounded-lg border ${
                          message.priority === 'emergency' 
                            ? 'bg-red-950/50 border-red-900/50 animate-pulse'
                            : message.priority === 'critical'
                            ? 'bg-orange-950/50 border-orange-900/50'
                            : 'bg-slate-800/50 border-slate-700/50'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getPlatformIcon(message.platform)}</span>
                              <div>
                                <div className="font-bold text-white">{message.sender}</div>
                                <div className="text-sm text-slate-400">{message.department} • {message.platform.toUpperCase()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-mono text-white">{formatTime(message.time)}</div>
                              <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                                {message.priority.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-slate-200">{message.content}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="bg-slate-900/95 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-white">ACTIVE TASKS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className={`p-4 rounded-lg border ${
                      task.status === 'critical' 
                        ? 'bg-red-950/50 border-red-900/50 animate-pulse'
                        : task.status === 'in-progress'
                        ? 'bg-yellow-950/50 border-yellow-900/50'
                        : task.status === 'completed'
                        ? 'bg-green-950/50 border-green-900/50'
                        : 'bg-slate-800/50 border-slate-700/50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getDepartmentIcon(task.department)}
                          <div>
                            <div className="font-bold text-white">{task.title}</div>
                            <div className="text-sm text-slate-400">{task.assignee} • {task.department}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono text-white">{formatTime(task.time)}</div>
                          <Badge className={`text-xs ${
                            task.status === 'critical' ? 'bg-red-600' :
                            task.status === 'in-progress' ? 'bg-yellow-600' :
                            task.status === 'completed' ? 'bg-green-600' :
                            'bg-slate-600'
                          }`}>
                            {task.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}