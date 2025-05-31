
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, DollarSign, Activity, Phone, Mail } from 'lucide-react';

const messageData = [
  { month: 'Jan', sms: 12500, email: 8900, whatsapp: 5600 },
  { month: 'Feb', sms: 15200, email: 9800, whatsapp: 6200 },
  { month: 'Mar', sms: 18900, email: 11200, whatsapp: 7800 },
  { month: 'Apr', sms: 16800, email: 10500, whatsapp: 7200 },
  { month: 'May', sms: 21300, email: 12800, whatsapp: 8900 },
  { month: 'Jun', sms: 24500, email: 14200, whatsapp: 9600 }
];

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 58000 },
  { month: 'Apr', revenue: 55000 },
  { month: 'May', revenue: 67000 },
  { month: 'Jun', revenue: 72000 }
];

const serviceUsage = [
  { name: 'SMS', value: 45, color: '#3b82f6' },
  { name: 'Email', value: 25, color: '#10b981' },
  { name: 'WhatsApp', value: 20, color: '#8b5cf6' },
  { name: 'Voice', value: 10, color: '#f59e0b' }
];

export function Analytics() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-700 bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Comprehensive analytics and insights into platform usage, performance metrics, and user engagement.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">2.4M</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">15.2K</p>
                <p className="text-sm text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$72K</p>
                <p className="text-sm text-green-600 mt-1">+15% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">98.5%</p>
                <p className="text-sm text-green-600 mt-1">+0.3% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              Message Volume by Service
            </CardTitle>
            <CardDescription>Monthly breakdown of messages sent across different services</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sms" fill="#3b82f6" name="SMS" />
                <Bar dataKey="email" fill="#10b981" name="Email" />
                <Bar dataKey="whatsapp" fill="#8b5cf6" name="WhatsApp" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue growth over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Service Usage Distribution
            </CardTitle>
            <CardDescription>Breakdown of service usage by percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={serviceUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceUsage.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <span className="text-sm font-medium">{service.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-indigo-600" />
              Service Performance Metrics
            </CardTitle>
            <CardDescription>Real-time performance indicators for all services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">SMS Delivery</span>
                  <Badge className="bg-green-500 text-white">Healthy</Badge>
                </div>
                <p className="text-2xl font-bold text-blue-600">99.2%</p>
                <p className="text-xs text-gray-600">Average delivery rate</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Email Delivery</span>
                  <Badge className="bg-green-500 text-white">Healthy</Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">97.8%</p>
                <p className="text-xs text-gray-600">Average delivery rate</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Voice Calls</span>
                  <Badge className="bg-yellow-500 text-white">Warning</Badge>
                </div>
                <p className="text-2xl font-bold text-purple-600">94.5%</p>
                <p className="text-xs text-gray-600">Connection success rate</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">USSD Sessions</span>
                  <Badge className="bg-green-500 text-white">Healthy</Badge>
                </div>
                <p className="text-2xl font-bold text-orange-600">98.9%</p>
                <p className="text-xs text-gray-600">Session completion rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
