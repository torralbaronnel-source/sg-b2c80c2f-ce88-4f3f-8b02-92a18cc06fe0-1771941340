import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Send, 
  Phone, 
  MessageSquare, 
  Clock, 
  Check, 
  CheckCheck,
  Paperclip,
  Mic,
  MoreVertical,
  Filter,
  Download,
  Star,
  Archive
} from 'lucide-react';
import { whatsAppService, WhatsAppConversation, WhatsAppTemplate } from '@/services/whatsappService';

interface WhatsAppTabletViewProps {
  eventId: string;
  onConversationSelect?: (conversation: WhatsAppConversation) => void;
}

export default function WhatsAppTabletView({ eventId, onConversationSelect }: WhatsAppTabletViewProps) {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadConversations();
    loadTemplates();
  }, [eventId]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await whatsAppService.getConversations(eventId);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadConversations();
      return;
    }

    try {
      const results = await whatsAppService.searchConversations(eventId, searchQuery);
      setConversations(results);
    } catch (error) {
      console.error('Error searching conversations:', error);
    }
  };

  const handleTemplateApply = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      setNewMessage(template.content);
      setSelectedTemplate('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="h-3 w-3 text-slate-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-slate-400" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default: return <Clock className="h-3 w-3 text-slate-500" />;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    switch (filterStatus) {
      case 'unread': return conv.unread_count > 0;
      case 'today': 
        return new Date(conv.last_message.timestamp).toDateString() === new Date().toDateString();
      case 'urgent':
        return conv.last_message.content.toLowerCase().includes('urgent') || 
               conv.last_message.content.toLowerCase().includes('emergency');
      default: return true;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="h-8 w-8 text-slate-500 animate-pulse mx-auto mb-2" />
          <p className="text-slate-500">Loading WhatsApp conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <span>WhatsApp Business</span>
              <Badge className="bg-green-900 text-green-100">PHILIPPINES</Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-slate-700">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700">
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search vendors, messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Reply Templates */}
      {templates.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="flex-1 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Quick reply templates..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-slate-400">{template.content.substring(0, 50)}...</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleTemplateApply}
                disabled={!selectedTemplate}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation List */}
      <Card className="flex-1 bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white">
            CONVERSATIONS ({filteredConversations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.vendor.id}
                    onClick={() => onConversationSelect?.(conversation)}
                    className="p-4 hover:bg-slate-800/50 cursor-pointer border-b border-slate-800 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-green-600 text-white">
                          {conversation.vendor.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <div className="font-bold text-white">
                              {conversation.vendor.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {conversation.vendor.company} • {conversation.vendor.role}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono text-slate-500">
                              {formatTime(conversation.last_message.timestamp)}
                            </div>
                            <div className="flex items-center justify-end mt-1">
                              {getStatusIcon(conversation.last_message.status)}
                              {conversation.unread_count > 0 && (
                                <Badge className="ml-1 bg-green-600 text-white text-xs px-1.5 py-0">
                                  {conversation.unread_count}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-300 truncate">
                            {conversation.last_message.direction === 'inbound' && 'You: '}
                            {conversation.last_message.content}
                          </p>
                          <div className="flex items-center space-x-1 ml-2">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Phone className="h-3 w-3 text-slate-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Star className="h-3 w-3 text-slate-500" />
                            </Button>
                          </div>
                        </div>
                        
                        {conversation.event_name && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                              {conversation.event_name}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}