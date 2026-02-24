import React, { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  MessageSquare,
  AlertTriangle,
  Search,
  Plus,
  Filter,
  ChevronRight,
  Activity,
  Bell,
  Zap,
  Eye,
  Settings,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'REYES-SANTOS WEDDING',
    clientName: 'Maria & Carlos Reyes-Santos',
    venue: 'Manila Hotel Grand Ballroom',
    date: '2026-02-24',
    time: '15:00 - 23:00',
    guestCount: 350,
    coordinator: 'Ana Rivera',
    status: 'live',
    vendorCount: 12,
    unreadMessages: 8,
    criticalIssues: 2
  },
  {
    id: '2',
    title: 'CORPORATE GALA 2026',
    clientName: 'TechVision Philippines',
    venue: 'Makati Shangri-La',
    date: '2026-02-25',
    time: '18:00 - 22:00',
    guestCount: 500,
    coordinator: 'Roberto Lim',
    status: 'setup',
    vendorCount: 8,
    unreadMessages: 3,
    criticalIssues: 0
  },
  {
    id: '3',
    title: 'DEBUT CELEBRATION',
    clientName: 'Isabella Martinez',
    venue: 'Villa Escudero Plantations',
    date: '2026-02-28',
    time: '17:00 - 23:00',
    guestCount: 200,
    coordinator: 'Sarah Wong',
    status: 'upcoming',
    vendorCount: 10,
    unreadMessages: 0,
    criticalIssues: 0
  },
  {
    id: '4',
    title: 'CORPORATE TEAM BUILDING',
    clientName: 'ABC Corporation',
    venue: 'Club Punta Fuego',
    date: '2026-02-26',
    time: '08:00 - 17:00',
    guestCount: 150,
    coordinator: 'Carlos Reyes',
    status: 'completed',
    vendorCount: 6,
    unreadMessages: 0,
    criticalIssues: 0
  },
  {
    id: '5',
    title: 'CHILDREN\'S BIRTHDAY PARTY',
    clientName: 'The Santos Family',
    venue: 'Sky Ranch Tagaytay',
    date: '2026-03-01',
    time: '14:00 - 18:00',
    guestCount: 80,
    coordinator: 'Ana Rivera',
    status: 'upcoming',
    vendorCount: 5,
    unreadMessages: 0,
    criticalIssues: 0
  }
];

const EventDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'setup':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <Activity className="h-3 w-3" />;
      case 'setup':
        return <Settings className="h-3 w-3" />;
      case 'upcoming':
        return <Calendar className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || event.status === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const liveEventCount = mockEvents.filter(event => event.status === 'live').length;
  const totalEvents = mockEvents.length;
  const totalGuests = mockEvents.reduce((sum, event) => sum + event.guestCount, 0);
  const totalUnreadMessages = mockEvents.reduce((sum, event) => sum + event.unreadMessages, 0);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
                  <p className="text-gray-600 mt-1">Manage your events and coordinate with teams</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-40 border border-gray-300">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="setup">Setup</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Live Events</p>
                      <p className="text-2xl font-bold text-red-600">{liveEventCount}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Activity className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Events</p>
                      <p className="text-2xl font-bold text-blue-600">{totalEvents}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Guests</p>
                      <p className="text-2xl font-bold text-green-600">{totalGuests.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                      <p className="text-2xl font-bold text-purple-600">{totalUnreadMessages}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900">{event.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{event.clientName}</p>
                      </div>
                      <Badge className={`${getStatusColor(event.status)} flex items-center gap-1`}>
                        {getStatusIcon(event.status)}
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {event.venue}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {event.date} • {event.time}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {event.guestCount} Guests • {event.vendorCount} Vendors
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        Coordinator: {event.coordinator}
                      </div>
                    </div>

                    {event.criticalIssues > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center text-red-800">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">{event.criticalIssues} Critical Issue{event.criticalIssues > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        {event.unreadMessages > 0 && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            {event.unreadMessages} Messages
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/dashboard?eventId=${event.id}`}>
                          <Button 
                            size="sm" 
                            className={event.status === 'live' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {event.status === 'live' ? 'Command Center' : 'View Event'}
                          </Button>
                        </Link>
                        <Link href={`/whatsapp?eventId=${event.id}`}>
                          <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">No events found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default EventDashboard;