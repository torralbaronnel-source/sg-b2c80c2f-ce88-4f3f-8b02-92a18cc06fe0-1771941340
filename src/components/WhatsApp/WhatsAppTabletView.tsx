import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Paperclip, Mic, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { whatsAppService, type WhatsAppConversation, type WhatsAppMessage, type WhatsAppTemplate } from '@/services/whatsappService';

interface WhatsAppTabletViewProps {
  eventId: string;
}

const WhatsAppTabletView: React.FC<WhatsAppTabletViewProps> = ({ eventId }) => {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<WhatsAppConversation | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
    loadTemplates();
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

  const loadTemplates = async () => {
    try {
      const data = await whatsAppService.getQuickReplyTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      await whatsAppService.sendMessage(
        selectedConversation.vendor.phone_number,
        messageInput.trim()
      );
      
      setMessageInput('');
      loadConversationHistory(selectedConversation.vendor.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const useTemplate = async (template: WhatsAppTemplate) => {
    if (!selectedConversation) return;

    try {
      await whatsAppService.sendMessage(
        selectedConversation.vendor.phone_number,
        template.content
      );
      
      loadConversationHistory(selectedConversation.vendor.id);
      setShowTemplates(false);
    } catch (error) {
      console.error('Error sending template:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">WhatsApp - Event Chat</h1>
              <p className="text-sm text-gray-500">REYES WEDDING • 350 guests</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r">
          <div className="p-3 border-b">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.vendor.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.vendor.id === conversation.vendor.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
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
                          {new Date(conversation.last_message.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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
                        <div className={`w-2 h-2 rounded-full ${
                          conversation.last_message.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {selectedConversation.vendor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedConversation.vendor.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.vendor.role} • {selectedConversation.vendor.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.direction === 'outbound'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between mt-1 text-xs ${
                          message.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {message.direction === 'outbound' && (
                            <span className="ml-2">
                              {message.status === 'delivered' ? '✓✓' : 
                               message.status === 'sent' ? '✓' : '⏳'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                {showTemplates && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Quick Reply Templates</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplates(false)}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {templates.map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          size="sm"
                          onClick={() => useTemplate(template)}
                          className="text-xs h-auto py-2 px-3"
                        >
                          {template.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplates(!showTemplates)}
                  >
                    📋
                  </Button>
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} className="bg-green-500 hover:bg-green-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTabletView;