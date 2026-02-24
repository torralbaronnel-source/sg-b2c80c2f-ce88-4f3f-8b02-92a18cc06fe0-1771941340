import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/Layout/AppLayout';
import { 
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  return (
    <AppLayout activeApp="dashboard">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Orchestrix</h1>
        <p className="text-slate-600">Your complete event management command center</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Active Events</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-xs text-green-600 mt-1">+2 this week</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Vendors</p>
                <p className="text-2xl font-bold text-slate-900">48</p>
                <p className="text-xs text-green-600 mt-1">+5 new</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Messages Today</p>
                <p className="text-2xl font-bold text-slate-900">127</p>
                <p className="text-xs text-slate-600 mt-1">Last hour: 15</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900">94%</p>
                <p className="text-xs text-green-600 mt-1">+3% this month</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Communication Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Unified messaging across WhatsApp, Slack, Email, and Calls</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">47 messages today</Badge>
              <Button variant="outline" size="sm">Open →</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Event Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Manage events, timelines, and vendor schedules</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">3 events this week</Badge>
              <Button variant="outline" size="sm">Open →</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Vendor Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Coordinate with vendors, track performance, and manage contracts</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">48 active vendors</Badge>
              <Button variant="outline" size="sm">Open →</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2 text-orange-600" />
              Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Digital contracts, signatures, and document management</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">12 pending</Badge>
              <Button variant="outline" size="sm">Open →</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Insights, metrics, and performance analytics</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">View reports</Badge>
              <Button variant="outline" size="sm">Open →</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Budget & Finance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">Track expenses, manage budgets, and process payments</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">$45,230 total</Badge>
              <Button variant="outline" size="sm">Open →</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Clock className="h-5 w-5 mr-2 text-slate-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">New message from Sarah Johnson about Johnson Wedding</p>
                <p className="text-xs text-slate-500">2 minutes ago • WhatsApp</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">Catering Co. confirmed menu for TechCorp Gala</p>
                <p className="text-xs text-slate-500">15 minutes ago • Email</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">Venue contract signed for Miller Anniversary</p>
                <p className="text-xs text-slate-500">1 hour ago • Contracts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">New vendor added: Premium Photography</p>
                <p className="text-xs text-slate-500">2 hours ago • Vendors</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}