import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  Users, 
  TrendingUp,
  Phone,
  Mail,
  Clock,
  CheckCircle
} from 'lucide-react';
import { whatsAppService, type WhatsAppConversation, type WhatsAppMessage } from '@/services/whatsappService';

interface WhatsAppManagerViewProps {
  eventId: string;
}

const WhatsAppManagerView: React.FC<WhatsAppManagerViewProps> = ({ eventId }) => {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<WhatsAppConversation | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('conversations');

  useEffect(() => {
    loadConversations();
  }, [eventId]);

  useEffect(() => {
    if (selectedConversation) {
      loadConversationHistory(selectedConversation.vendor.id);
    }
  }, [selectedConversation, eventId]);

  const loadConversations = async () => {
    try {
      const data = await whatsAppService.getConversations(eventId);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversationHistory = async (vendorId: string) => {
    try {
      const data = await whatsAppService.getConversationHistory(vendorId, eventId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadConversations();
      return;
    }

    try {
      const data = await whatsAppService.searchConversations(eventId, searchQuery);
      setConversations(data);
    } catch (error) {
      console.error('Error searching conversations:', error);
    }
  };

  const exportConversation = async () => {
    if (!selectedConversation) return;

    try {
      const csvData = await whatsAppService.exportConversationHistory(
        selectedConversation.vendor.id,
        eventId
      );
      
      // Create and download CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whatsapp-${selectedConversation.vendor.name.replace(/\s+/g, '-')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting conversation:', error);
    }
  };

  const totalMessages = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  const activeVendors = conversations.filter(conv => conv.last_message.status === 'delivered').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Communication Hub</h1>
            <p className="text-gray-600">REYES WEDDING • Manager View • Full Event Communication</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={exportConversation} disabled={!selectedConversation}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-bold">{conversations.length}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread Messages</p>
                  <p className="text-2xl font-bold">{totalMessages}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Vendors</p>
                  <p className="text-2xl font-bold">{activeVendors}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold">
                    {conversations.length > 0 ? Math.round((activeVendors / conversations.length) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">All Conversations</h3>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <Input
                placeholder="Search vendors or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-3">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.vendor.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedConversation?.vendor.id === conversation.vendor.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {conversation.vendor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {conversation.vendor.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(conversation.last_message.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-600 truncate">
                              {conversation.last_message.content}
                            </p>
                            {conversation.unread_count > 0 && (
                              <Badge variant="destructive" className="ml-2 px-2 py-0 text-xs">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {conversation.vendor.role}
                            </Badge>
                            <Badge 
                              variant={conversation.last_message.direction === 'inbound' ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              {conversation.last_message.direction}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Details */}
        <div className="col-span-2">
          {selectedConversation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {selectedConversation.vendor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedConversation.vendor.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.vendor.role} • {selectedConversation.vendor.company}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Phone className="w-3 h-3 mr-1" />
                          {selectedConversation.vendor.phone_number}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Mail className="w-3 h-3 mr-1" />
                          contact@vendor.com
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Assign Staff
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportConversation}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="messages">Message History</TabsTrigger>
                    <TabsTrigger value="details">Contact Details</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="messages" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-md px-4 py-2 rounded-lg ${
                              message.direction === 'outbound'
                                ? 'bg-blue-500 text-white ml-auto'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">
                                  {message.direction === 'outbound' ? 'Coordinator' : selectedConversation.vendor.name}
                                </span>
                                <span className={`text-xs ${
                                  message.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {new Date(message.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {message.message_type}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                  <span className={`text-xs ${
                                    message.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    {message.status}
                                  </span>
                                  {message.direction === 'outbound' && (
                                    <span>
                                      {message.status === 'delivered' ? '✓✓' : 
                                       message.status === 'sent' ? '✓' : '⏳'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Vendor Name</p>
                          <p className="font-medium">{selectedConversation.vendor.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Company/Type</p>
                          <p className="font-medium">{selectedConversation.vendor.company}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Role</p>
                          <p className="font-medium">{selectedConversation.vendor.role}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone Number</p>
                          <p className="font-medium">{selectedConversation.vendor.phone_number}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Quick Actions</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
                            <p className="text-sm text-gray-600">Total Messages</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {messages.filter(m => m.direction === 'inbound').length}
                            </p>
                            <p className="text-sm text-gray-600">Messages Received</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">
                              {messages.filter(m => m.direction === 'outbound').length}
                            </p>
                            <p className="text-sm text-gray-600">Messages Sent</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Response Time Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Average Response Time</span>
                            <span className="text-sm font-medium">2.5 minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">First Response Today</span>
                            <span className="text-sm font-medium">8:30 AM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Last Response</span>
                            <span className="text-sm font-medium">3:45 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversation Selected</h3>
                <p className="text-gray-600">Choose a conversation from the left to view full details and analytics</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppManagerView;