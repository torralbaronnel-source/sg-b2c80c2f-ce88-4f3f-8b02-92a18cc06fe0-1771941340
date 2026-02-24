import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Search, Phone, Video, MoreVertical, Download, Filter, Archive, Star, Clock, CheckCircle } from 'lucide-react';
import { whatsAppService, type WhatsAppConversation, type WhatsAppMessage, type WhatsAppTemplate } from '@/services/whatsappService';

interface WhatsAppManagerViewProps {
  coordinatorId: string;
}

export const WhatsAppManagerView: React.FC<WhatsAppManagerViewProps> = ({ coordinatorId }) => {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<WhatsAppConversation | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    loadConversations();
    loadTemplates();
  }, [coordinatorId]);

  useEffect(() => {
    if (selectedConversation) {
      loadConversationHistory(selectedConversation.vendor.id);
    }
  }, [selectedConversation, coordinatorId]);

  const loadConversations = async () => {
    try {
      const data = await whatsAppService.getConversations(coordinatorId);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversationHistory = async (vendorId: string) => {
    try {
      const data = await whatsAppService.getConversationHistory(vendorId, coordinatorId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await whatsAppService.getQuickReplyTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const exportConversationLog = async () => {
    if (!selectedConversation) return;
    
    try {
      const logData = {
        vendor: selectedConversation.vendor,
        messages: messages,
        exported_at: new Date().toISOString(),
        event_id: coordinatorId
      };
      
      const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whatsapp-log-${selectedConversation.vendor.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting conversation log:', error);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.last_message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || conv.last_message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const unreadCount = conversations.reduce((acc, conv) => acc + conv.unread_count, 0);
  const urgentCount = conversations.filter(conv => 
    conv.last_message.priority && (conv.last_message.priority === 'critical' || conv.last_message.priority === 'urgent')
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">WhatsApp Business Manager</h1>
              <p className="text-sm text-gray-500">REYES WEDDING • Event Communications Hub</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="px-3 py-1">
                {unreadCount} Unread
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-800">
                {urgentCount} Urgent
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen pt-16">
        {/* Sidebar - Conversations List */}
        <div className="w-96 bg-white border-r flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.vendor.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedConversation?.vendor.id === conversation.vendor.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                        {conversation.vendor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">
                          {conversation.vendor.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.last_message.timestamp).toLocaleDateString('en-PH')}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            conversation.last_message.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-600 truncate">
                          {conversation.last_message.content}
                        </p>
                        {conversation.unread_count > 0 && (
                          <Badge variant="destructive" className="ml-2 px-2 py-0 text-xs min-w-[20px]">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {conversation.vendor.role}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${
                          conversation.last_message.priority === 'critical' ? 'border-red-200 text-red-600' :
                          conversation.last_message.priority === 'urgent' ? 'border-orange-200 text-orange-600' :
                          conversation.last_message.priority ? 'border-gray-200' : 'border-gray-200'
                        }`}>
                          {conversation.last_message.priority || 'normal'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                        {selectedConversation.vendor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{selectedConversation.vendor.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.vendor.role} • {selectedConversation.vendor.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportConversationLog}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages and Tools */}
              <div className="flex-1 flex">
                {/* Messages */}
                <div className="flex-1 bg-gray-50">
                  <ScrollArea className="h-full p-6">
                    <div className="space-y-4 max-w-4xl mx-auto">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-3 rounded-lg ${
                              message.direction === 'outbound'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-900 border'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <div className={`flex items-center justify-between mt-2 text-xs ${
                              message.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <span>
                                {new Date(message.timestamp).toLocaleString('en-PH', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <div className="flex items-center space-x-1">
                                {message.direction === 'outbound' && (
                                  <>
                                    {message.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                                    {message.status === 'read' && <CheckCircle className="w-3 h-3" />}
                                    {message.status === 'sent' && <Clock className="w-3 h-3" />}
                                  </>
                                )}
                                {message.metadata?.message_type === 'voice' && (
                                  <Badge variant="outline" className="text-xs">
                                    🎵 {message.metadata.voice_duration}s
                                  </Badge>
                                )}
                                {message.metadata?.message_type === 'image' && (
                                  <Badge variant="outline" className="text-xs">
                                    📷 Image
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Side Panel - Quick Actions */}
                <div className="w-80 bg-white border-l p-4">
                  <Tabs defaultValue="templates" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                      <TabsTrigger value="info">Vendor Info</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="templates" className="space-y-2 mt-4">
                      <h4 className="font-medium text-sm mb-3">Quick Reply Templates</h4>
                      <div className="space-y-2">
                        {templates.map((template) => (
                          <Button
                            key={template.id}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs h-auto py-2 px-3"
                          >
                            <span className="font-medium">{template.name}</span>
                            <div className="text-gray-400 mt-1">{template.content.substring(0, 50)}...</div>
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="info" className="space-y-3 mt-4">
                      <h4 className="font-medium text-sm mb-3">Vendor Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Company:</span>
                          <span>{selectedConversation.vendor.company}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Role:</span>
                          <span>{selectedConversation.vendor.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone:</span>
                          <span>{selectedConversation.vendor.phone_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span>{selectedConversation.vendor.email}</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes" className="space-y-3 mt-4">
                      <h4 className="font-medium text-sm mb-3">Conversation Notes</h4>
                      <textarea
                        className="w-full h-32 p-3 border rounded-lg text-sm resize-none"
                        placeholder="Add notes about this conversation..."
                      />
                      <Button size="sm" className="w-full">
                        Save Notes
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp Business Manager</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select a conversation to view and manage messages. Use the search and filters to quickly find specific conversations.
                </p>
                <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Delivered
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Sent
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};