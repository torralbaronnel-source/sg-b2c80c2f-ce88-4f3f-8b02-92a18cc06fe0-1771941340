import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Radio,
  Battery,
  Wifi,
  WifiOff,
  Phone,
  Mail,
  Activity,
  User,
  ArrowLeft,
  Settings,
  Bell,
  Zap,
  Eye,
  Info
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useEventHub } from "@/contexts/EventContext";
import { communicationService } from "@/services/communicationService";

const UnifiedEventDashboard = () => {
  const router = useRouter();
  const [eventId, setEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { activeEvent } = useEventHub();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (router.isReady) {
      const { eventId: eventIdParam } = router.query;
      if (eventIdParam && typeof eventIdParam === 'string') {
        setEventId(eventIdParam);
      }
      setIsLoading(false);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
          const statsData = await communicationService.getCommunicationStats(user.id, activeEvent?.id);
          setStats(statsData);
          
          const conversationsData = await communicationService.getConversations(user.id, activeEvent?.id);
          setRecentActivity(Array.isArray(conversationsData) ? conversationsData.slice(0, 5) : []);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [user, activeEvent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  // Show event selection page if no event ID is provided
  if (!eventId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">ORCHESTRIX</CardTitle>
            <p className="text-slate-400">Event Command Center</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-900/20 border-blue-800">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Select an event from the main dashboard to access its Live Command Center.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Event List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock event data - in real implementation, fetch from database
  const event = {
    id: eventId,
    title: 'REYES-SANTOS WEDDING',
    clientName: 'Maria & Carlos Reyes-Santos',
    venue: 'Manila Hotel Grand Ballroom',
    date: '2026-03-15',
    time: '15:00 - 23:00',
    guestCount: 350,
    coordinator: 'Ana Rivera',
    status: 'live' as const,
    startTime: new Date('2026-03-15T15:00:00+08:00'),
    currentPhase: 'Main Ceremony',
    totalPhases: 3,
    vendorTeams: [
      {
        id: '1',
        name: 'Photography',
        lead: 'Alex Chen',
        status: 'online' as const,
        battery: 85,
        signal: 'strong' as const,
        lastUpdate: '2 mins ago',
        avatar: ''
      },
      {
        id: '2',
        name: 'Catering',
        lead: 'Maria Santos',
        status: 'online' as const,
        battery: 92,
        signal: 'strong' as const,
        lastUpdate: '1 min ago',
        avatar: ''
      },
      {
        id: '3',
        name: 'Sound & Lights',
        lead: 'Juan dela Cruz',
        status: 'offline' as const,
        battery: 45,
        signal: 'weak' as const,
        lastUpdate: '15 mins ago',
        avatar: ''
      },
      {
        id: '4',
        name: 'Florist',
        lead: 'Liza Fernandez',
        status: 'online' as const,
        battery: 78,
        signal: 'medium' as const,
        lastUpdate: '5 mins ago',
        avatar: ''
      },
      {
        id: '5',
        name: 'Transportation',
        lead: 'Roberto Lim',
        status: 'online' as const,
        battery: 90,
        signal: 'strong' as const,
        lastUpdate: '3 mins ago',
        avatar: ''
      },
      {
        id: '6',
        name: 'Security',
        lead: 'Carlos Reyes',
        status: 'online' as const,
        battery: 88,
        signal: 'strong' as const,
        lastUpdate: '1 min ago',
        avatar: ''
      },
      {
        id: '7',
        name: 'Makeup & Hair',
        lead: 'Sarah Wong',
        status: 'online' as const,
        battery: 73,
        signal: 'medium' as const,
        lastUpdate: '8 mins ago',
        avatar: ''
      },
      {
        id: '8',
        name: 'Event Planning',
        lead: 'Ana Rivera',
        status: 'online' as const,
        battery: 95,
        signal: 'strong' as const,
        lastUpdate: 'Just now',
        avatar: ''
      }
    ],
    communications: [
      {
        id: '1',
        platform: 'WhatsApp',
        unread: 3,
        critical: 1,
        platformIcon: MessageSquare
      },
      {
        id: '2',
        platform: 'Slack',
        unread: 5,
        critical: 0,
        platformIcon: MessageSquare
      },
      {
        id: '3',
        platform: 'Email',
        unread: 12,
        critical: 2,
        platformIcon: Mail
      },
      {
        id: '4',
        platform: 'Radio',
        unread: 0,
        critical: 0,
        platformIcon: Radio
      },
      {
        id: '5',
        platform: 'Phone',
        unread: 2,
        critical: 1,
        platformIcon: Phone
      },
      {
        id: '6',
        platform: 'Intercom',
        unread: 1,
        critical: 0,
        platformIcon: MessageSquare
      }
    ],
    timeline: [
      { time: '06:00', phase: 'Vendor Arrival', status: 'completed', description: 'All vendors on-site' },
      { time: '09:00', phase: 'Venue Setup', status: 'completed', description: 'Decorations and lighting complete' },
      { time: '12:00', phase: 'Rehearsal', status: 'completed', description: 'Ceremony rehearsal finished' },
      { time: '14:00', phase: 'Guest Arrival', status: 'in-progress', description: 'Guests being seated' },
      { time: '15:00', phase: 'Main Ceremony', status: 'upcoming', description: 'Wedding ceremony begins' },
      { time: '17:00', phase: 'Cocktail Reception', status: 'upcoming', description: 'Networking and refreshments' },
      { time: '19:00', phase: 'Dinner Reception', status: 'upcoming', description: 'Main reception program' },
      { time: '23:00', phase: 'Event Wrap-up', status: 'upcoming', description: 'Guest departure and cleanup' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-900 text-green-100 border-green-700';
      case 'in-progress': return 'bg-blue-900 text-blue-100 border-blue-700';
      case 'upcoming': return 'bg-slate-800 text-slate-100 border-slate-700';
      default: return 'bg-slate-800 text-slate-100 border-slate-700';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'strong': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'medium': return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'weak': return <WifiOff className="h-4 w-4 text-red-500" />;
      default: return <WifiOff className="h-4 w-4 text-slate-500" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const emergencyCount = event.communications.reduce((sum, comm) => sum + comm.critical, 0);
  const totalUnread = event.communications.reduce((sum, comm) => sum + comm.unread, 0);
  const onlineTeams = event.vendorTeams.filter(team => team.status === 'online').length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Header */}
        <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/')}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Button>
                <div className="h-8 w-px bg-slate-700"></div>
                <div>
                  <h1 className="text-xl font-bold text-white">{event.title}</h1>
                  <p className="text-sm text-slate-400">{event.clientName} • {event.venue}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-600 text-white animate-pulse">
                  LIVE EVENT
                </Badge>
                <div className="text-sm text-slate-400">
                  {new Date().toLocaleString('en-US', { 
                    timeZone: 'Asia/Manila',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} PHT
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Emergency Alert Bar */}
        {emergencyCount > 0 && (
          <Alert className="bg-red-950/90 border-red-900 rounded-none">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-300">
              {emergencyCount} CRITICAL MESSAGE{emergencyCount > 1 ? 'S' : ''} REQUIRE IMMEDIATE ATTENTION
            </AlertDescription>
          </Alert>
        )}

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Main Content Area - 8 columns */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Event Status Overview */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Event Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{onlineTeams}/8</div>
                      <div className="text-sm text-slate-400">Teams Online</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{emergencyCount}</div>
                      <div className="text-sm text-slate-400">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{totalUnread}</div>
                      <div className="text-sm text-slate-400">Unread Messages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{event.guestCount}</div>
                      <div className="text-sm text-slate-400">Guests Expected</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Event Progress</span>
                      <span className="text-white">Phase {event.currentPhase.includes('Main') ? '2' : '1'} of {event.totalPhases}</span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Event Timeline */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-500" />
                    Event Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {event.timeline.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`w-3 h-3 rounded-full mt-1 ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                            'bg-slate-600'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white">{item.phase}</span>
                              <span className="text-sm text-slate-400">{item.time}</span>
                            </div>
                            <p className="text-sm text-slate-400">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Vendor Teams Status */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-500" />
                    Vendor Teams ({onlineTeams}/8 Online)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.vendorTeams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={team.avatar} />
                            <AvatarFallback className="bg-slate-700 text-slate-300 text-sm">
                              {team.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-white">{team.name}</div>
                            <div className="text-sm text-slate-400">{team.lead} • {team.lastUpdate}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSignalIcon(team.signal)}
                          <div className={`text-sm font-medium ${getBatteryColor(team.battery)}`}>
                            {team.battery}%
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            team.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 4 columns */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Communications Hub */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-yellow-500" />
                    Communications Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {event.communications.map((comm) => (
                      <Link key={comm.id} href="/whatsapp">
                        <div className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <comm.platformIcon className="h-4 w-4 text-slate-400" />
                            {comm.critical > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {comm.critical}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm font-medium text-white">{comm.platform}</div>
                          {comm.unread > 0 && (
                            <div className="text-xs text-blue-400">{comm.unread} unread</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-orange-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Broadcast
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
                    <Bell className="h-4 w-4 mr-2" />
                    All-Staff Announcement
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
                    <Settings className="h-4 w-4 mr-2" />
                    Timeline Adjustment
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
                    <Eye className="h-4 w-4 mr-2" />
                    Event Inspector
                  </Button>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card className="bg-slate-900/95 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date</span>
                    <span className="text-white">{event.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time</span>
                    <span className="text-white">{event.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Venue</span>
                    <span className="text-white text-right">{event.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coordinator</span>
                    <span className="text-white">{event.coordinator}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UnifiedEventDashboard;