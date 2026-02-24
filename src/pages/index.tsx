import React, { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Plus,
  ChevronRight,
  Bell,
  AlertCircle,
  Zap,
  Eye,
  Settings,
  Radio,
  Volume2
} from 'lucide-react';

// Sample events data
const events = [
  {
    id: '1',
    title: 'REYES-SANTOS WEDDING',
    client_name: 'Maria & Carlos Reyes-Santos',
    event_date: '2026-03-15',
    venue: 'Manila Hotel Grand Ballroom',
    guest_count: 350,
    status: 'live',
    start_time: '15:00',
    end_time: '23:00',
    priority: 'high',
    coordinator: 'Ana Rivera'
  },
  {
    id: '2',
    title: 'CORPORATE GALA 2026',
    client_name: 'TechCorp Philippines',
    event_date: '2026-03-20',
    venue: 'SMX Convention Center',
    guest_count: 500,
    status: 'setup',
    start_time: '18:00',
    end_time: '01:00',
    priority: 'high',
    coordinator: 'Miguel Santos'
  },
  {
    id: '3',
    title: 'CHEN-BAUTISTA WEDDING',
    client_name: 'Sarah Chen & Marco Bautista',
    event_date: '2026-03-25',
    venue: 'Shangri-La Boracay',
    guest_count: 200,
    status: 'upcoming',
    start_time: '16:00',
    end_time: '22:00',
    priority: 'medium',
    coordinator: 'Liza Fernandez'
  },
  {
    id: '4',
    title: 'COMPANY ANNIVERSARY',
    client_name: 'MegaBank Philippines',
    event_date: '2026-03-10',
    venue: 'Makati Shangri-La',
    guest_count: 300,
    status: 'completed',
    start_time: '19:00',
    end_time: '00:00',
    priority: 'medium',
    coordinator: 'Carlos dela Cruz'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'live': return 'bg-red-900 text-red-100 border-red-700';
    case 'setup': return 'bg-amber-900 text-amber-100 border-amber-700';
    case 'upcoming': return 'bg-blue-900 text-blue-100 border-blue-700';
    case 'completed': return 'bg-slate-800 text-slate-100 border-slate-700';
    default: return 'bg-slate-800 text-slate-100 border-slate-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'live': return <Zap className="h-4 w-4 animate-pulse" />;
    case 'setup': return <Settings className="h-4 w-4" />;
    case 'upcoming': return <Calendar className="h-4 w-4" />;
    case 'completed': return <Eye className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-slate-500';
  }
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || event.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const liveEvents = events.filter(e => e.status === 'live').length;
  const setupEvents = events.filter(e => e.status === 'setup').length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalGuests = events.reduce((sum, e) => sum + e.guest_count, 0);

  return (
    <AppLayout activeApp="dashboard">
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Header */}
        <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50 shadow-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Volume2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white font-mono tracking-wider">ORCHESTRIX</h1>
                    <div className="text-sm text-slate-400">Event Management Hub</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
                <Link href="/whatsapp">
                  <Button variant="outline" size="sm" className="bg-green-600/20 border-green-600/50 text-green-400 hover:bg-green-600/30">
                    <Radio className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="bg-slate-900/95 border-b border-slate-800">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-500">{liveEvents}</div>
                <div className="text-sm text-slate-400">LIVE EVENTS</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-500">{setupEvents}</div>
                <div className="text-sm text-slate-400">IN SETUP</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-500">{upcomingEvents}</div>
                <div className="text-sm text-slate-400">UPCOMING</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{totalGuests.toLocaleString()}</div>
                <div className="text-sm text-slate-400">TOTAL GUESTS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search events by name, client, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">ALL STATUS</SelectItem>
                <SelectItem value="live">LIVE</SelectItem>
                <SelectItem value="setup">SETUP</SelectItem>
                <SelectItem value="upcoming">UPCOMING</SelectItem>
                <SelectItem value="completed">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">ALL PRIORITY</SelectItem>
                <SelectItem value="high">HIGH</SelectItem>
                <SelectItem value="medium">MEDIUM</SelectItem>
                <SelectItem value="low">LOW</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Critical Alert for Live Events */}
          {liveEvents > 0 && (
            <div className="bg-red-950/70 border border-red-900/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />
                <div>
                  <div className="text-red-400 font-bold">
                    {liveEvents} LIVE EVENT{liveEvents > 1 ? 'S' : ''} IN PROGRESS
                  </div>
                  <div className="text-red-300 text-sm">
                    Click "Open Command Center" to manage live event coordination
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className={`bg-slate-900/95 border-slate-800 hover:bg-slate-800/95 transition-all ${
                event.status === 'live' ? 'ring-2 ring-red-600/50 animate-pulse' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-white mb-1">
                        {event.title}
                      </CardTitle>
                      <div className="text-sm text-slate-400">{event.client_name}</div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(event.status)}
                          <span>{event.status.toUpperCase()}</span>
                        </div>
                      </Badge>
                      <div className={`text-xs font-bold ${getPriorityColor(event.priority)}`}>
                        {event.priority.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Date:</span>
                      <span className="text-white">{event.event_date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Time:</span>
                      <span className="text-white">{event.start_time} - {event.end_time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Venue:</span>
                      <span className="text-white text-right">{event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Guests:</span>
                      <span className="text-white">{event.guest_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Coordinator:</span>
                      <span className="text-white">{event.coordinator}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-3">
                    <Button 
                      className={`flex-1 ${
                        event.status === 'live' 
                          ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                      onClick={() => {
                        if (event.status === 'live') {
                          window.location.href = `/dashboard?eventId=${event.id}`;
                        }
                      }}
                      disabled={event.status !== 'live'}
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {event.status === 'live' ? 'Open Command Center' : 'Event Not Live'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
              <p className="text-slate-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}