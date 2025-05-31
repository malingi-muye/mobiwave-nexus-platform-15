
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Database,
  Cloud,
  RefreshCw
} from 'lucide-react';

// Mock real-time data
const generateMetricData = () => {
  const now = new Date();
  return Array.from({ length: 20 }, (_, i) => {
    const time = new Date(now.getTime() - (19 - i) * 60000);
    return {
      time: time.toLocaleTimeString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 1000,
      responseTime: Math.random() * 500 + 100
    };
  });
};

const serviceStatus = [
  { name: 'SMS Gateway', status: 'healthy', uptime: '99.98%', responseTime: '45ms', instances: 3 },
  { name: 'Email Service', status: 'healthy', uptime: '99.95%', responseTime: '120ms', instances: 2 },
  { name: 'Voice Gateway', status: 'warning', uptime: '98.52%', responseTime: '280ms', instances: 2 },
  { name: 'WhatsApp API', status: 'healthy', uptime: '99.92%', responseTime: '89ms', instances: 1 },
  { name: 'Database', status: 'healthy', uptime: '99.99%', responseTime: '12ms', instances: 1 },
  { name: 'Authentication', status: 'healthy', uptime: '99.97%', responseTime: '55ms', instances: 2 }
];

const alerts = [
  { id: 1, severity: 'high', service: 'Voice Gateway', message: 'High latency detected - 280ms avg response time', time: '2 min ago' },
  { id: 2, severity: 'medium', service: 'Email Service', message: 'Queue backlog increasing - 1,200 pending emails', time: '5 min ago' },
  { id: 3, severity: 'low', service: 'SMS Gateway', message: 'Memory usage at 75%', time: '12 min ago' }
];

export function Monitoring() {
  const [metrics, setMetrics] = useState(generateMetricData());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics(prev => {
        const newMetrics = [...prev.slice(1)];
        const now = new Date();
        newMetrics.push({
          time: now.toLocaleTimeString(),
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          disk: Math.random() * 100,
          network: Math.random() * 1000,
          responseTime: Math.random() * 500 + 100
        });
        return newMetrics;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'offline': return <Server className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const currentCpu = metrics[metrics.length - 1]?.cpu || 0;
  const currentMemory = metrics[metrics.length - 1]?.memory || 0;
  const currentDisk = metrics[metrics.length - 1]?.disk || 0;

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-orange-900 via-red-800 to-pink-700 bg-clip-text text-transparent">
              System Monitoring
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Real-time monitoring of system performance, service health, and infrastructure metrics.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">{isLive ? 'Live' : 'Paused'}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? 'Pause' : 'Resume'}
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">CPU Usage</p>
                <p className="text-3xl font-bold text-gray-900">{currentCpu.toFixed(1)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${currentCpu}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Memory Usage</p>
                <p className="text-3xl font-bold text-gray-900">{currentMemory.toFixed(1)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${currentMemory}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Disk Usage</p>
                <p className="text-3xl font-bold text-gray-900">{currentDisk.toFixed(1)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${currentDisk}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Services</p>
                <p className="text-3xl font-bold text-gray-900">6/6</p>
                <p className="text-sm text-green-600 mt-1">All services healthy</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <Server className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              System Performance
            </CardTitle>
            <CardDescription>Real-time CPU, Memory, and Disk usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} name="Memory %" />
                <Line type="monotone" dataKey="disk" stroke="#8b5cf6" strokeWidth={2} name="Disk %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Response Time
            </CardTitle>
            <CardDescription>Average API response time in milliseconds</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(0)}ms`, 'Response Time']} />
                <Area type="monotone" dataKey="responseTime" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-green-600" />
            Service Status
          </CardTitle>
          <CardDescription>Current health and performance of all services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceStatus.map((service) => (
              <div key={service.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{service.name}</h4>
                  <Badge className={getStatusColor(service.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(service.status)}
                      {service.status}
                    </div>
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response:</span>
                    <span className="font-medium">{service.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instances:</span>
                    <span className="font-medium">{service.instances}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Active Alerts
          </CardTitle>
          <CardDescription>Current system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="font-medium">{alert.service}</span>
                  </div>
                  <span className="text-sm text-gray-600">{alert.time}</span>
                </div>
                <p className="mt-2 text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
