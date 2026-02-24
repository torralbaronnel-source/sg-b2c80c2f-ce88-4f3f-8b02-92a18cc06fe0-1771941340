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
import { whatsappService, type WhatsAppMessage, type WhatsAppConversation, type WhatsAppTemplate } from '@/services/whatsappService';

interface WhatsAppManagerViewProps {
  coordinatorId?: string;
}

export function WhatsAppManagerView({ coordinatorId }: WhatsAppManagerViewProps) {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<WhatsAppConversation | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    if (coordinatorId) {
      loadConversations();
    }
  }, [coordinatorId]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!coordinatorId) return;
    const { data } = await whatsappService.getConversations(coordinatorId);
    if (data) setConversations(data as unknown as WhatsAppConversation[]);
  };

  const loadMessages = async (communicationId: string) => {
    const { data } = await whatsappService.getMessages(communicationId);
    if (data) setMessages(data);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = (conv.vendor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (conv.last_message || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search chats..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredConversations.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-muted' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{(conv.vendor || 'V')[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="font-medium truncate">{conv.vendor || 'Unknown Vendor'}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.last_message || 'No messages'}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b bg-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{(selectedConversation.vendor || 'V')[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConversation.vendor}</h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_from_me ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${msg.is_from_me ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-white border rounded-tl-none'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-[10px] opacity-70 mt-1 block text-right">
                        {new Date(msg.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button size="icon"><MessageCircle className="h-4 w-4" /></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}