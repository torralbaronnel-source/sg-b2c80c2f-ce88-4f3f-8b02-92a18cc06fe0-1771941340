import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
  Circle,
  XCircle
} from "lucide-react";

const CommunicationPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [messageContent, setMessageContent] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Mock data initialization
    setAnalytics({
      totalMessages: 1248,
      responseRate: 94,
      totalVendors: 42,
      avgResponseTime: 8
    });

    setPlatforms([
      { id: "1", name: "WhatsApp", icon: MessageSquare, connected: true, count: 12 },
      { id: "2", name: "Slack", icon: MessageSquare, connected: true, count: 5 },
      { id: "3", name: "Email", icon: Mail, connected: true, count: 28 },
      { id: "4", name: "Radio", icon: Radio, connected: false, count: 0 }
    ]);

    setTeamMembers([
      { id: "1", name: "Ana Rivera", status: "Active", isOnline: true, avatar: "" },
      { id: "2", name: "Alex Chen", status: "On-site", isOnline: true, avatar: "" },
      { id: "3", name: "Maria Santos", status: "Offline", isOnline: false, avatar: "" }
    ]);

    setMessages([
      { id: "1", sender: "Alex Chen", time: "2 mins ago", content: "Main ballroom setup is 80% complete. Need florist to check stage decor.", platform: "WhatsApp", isUrgent: false },
      { id: "2", sender: "Maria Santos", time: "5 mins ago", content: "Catering team has arrived at the service entrance.", platform: "Slack", isUrgent: false },
      { id: "3", sender: "Security Lead", time: "10 mins ago", content: "Loading dock clearance required for VIP transport.", platform: "Radio", isUrgent: true }
    ]);
  }, []);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Communications Hub</h1>
                  <p className="text-gray-600 mt-1">Centralized messaging across all platforms</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    All Systems Online
                  </Badge>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Messages</p>
                        <p className="text-2xl font-bold text-blue-600">{analytics?.totalMessages.toLocaleString() || "0"}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Response Rate</p>
                        <p className="text-2xl font-bold text-green-600">{analytics?.responseRate || "0"}%</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vendors</p>
                        <p className="text-2xl font-bold text-purple-600">{analytics?.totalVendors || "0"}</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Response</p>
                        <p className="text-2xl font-bold text-orange-600">{analytics?.avgResponseTime || "0"}m</p>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-2 space-y-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                      Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No messages yet</p>
                            <p className="text-sm text-gray-400">Start connecting your communication platforms</p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={message.avatar} />
                                <AvatarFallback>
                                  {message.sender.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">{message.sender}</span>
                                  <span className="text-xs text-gray-500">{message.time}</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge className="text-xs">{message.platform}</Badge>
                                  {message.isUrgent && (
                                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Quick Compose</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="slack">Slack</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="radio">Radio</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="intercom">Intercom</SelectItem>
                      </SelectContent>
                    </Select>

                    <Textarea
                      placeholder="Type your message here..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      className="border-gray-300 min-h-[100px]"
                    />

                    <div className="flex items-center space-x-3">
                      <Button
                        variant={isUrgent ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsUrgent(!isUrgent)}
                        className={isUrgent ? "bg-red-600 hover:bg-red-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Urgent
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Platform Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platforms.map((platform) => (
                        <div key={platform.id} className="flex items-center justify-between p-2">
                          <div className="flex items-center space-x-2">
                            <platform.icon className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {platform.connected ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-600">Connected</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-xs text-red-600">Disconnected</span>
                              </>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {platform.count}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                              {member.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.status}</div>
                          </div>
                          {member.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default CommunicationPage;