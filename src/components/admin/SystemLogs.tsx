
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

const mockLogs = [
  {
    id: 1,
    timestamp: '2024-01-16 14:32:15',
    level: 'info',
    service: 'SMS Gateway',
    message: 'Message sent successfully to +254712345678',
    user: 'system',
    ip: '192.168.1.100'
  },
  {
    id: 2,
    timestamp: '2024-01-16 14:31:42',
    level: 'warning',
    service: 'Email Service',
    message: 'High delivery queue detected - 1200 emails pending',
    user: 'system',
    ip: '192.168.1.101'
  },
  {
    id: 3,
    timestamp: '2024-01-16 14:30:18',
    level: 'error',
    service: 'Voice Gateway',
    message: 'Failed to connect to voice provider API',
    user: 'admin@example.com',
    ip: '192.168.1.102'
  },
  {
    id: 4,
    timestamp: '2024-01-16 14:29:55',
    level: 'info',
    service: 'Authentication',
    message: 'User login successful',
    user: 'user@example.com',
    ip: '192.168.1.103'
  },
  {
    id: 5,
    timestamp: '2024-01-16 14:28:33',
    level: 'warning',
    service: 'Database',
    message: 'Slow query detected - execution time 2.5s',
    user: 'system',
    ip: '192.168.1.104'
  }
];

const auditLogs = [
  {
    id: 1,
    timestamp: '2024-01-16 14:25:10',
    action: 'user_created',
    resource: 'User Management',
    user: 'admin@example.com',
    details: 'Created new user account for john.doe@example.com',
    ip: '192.168.1.105'
  },
  {
    id: 2,
    timestamp: '2024-01-16 14:20:45',
    action: 'role_assigned',
    resource: 'User Management',
    user: 'admin@example.com',
    details: 'Assigned admin role to user jane.smith@example.com',
    ip: '192.168.1.105'
  },
  {
    id: 3,
    timestamp: '2024-01-16 14:15:22',
    action: 'config_updated',
    resource: 'System Settings',
    user: 'superadmin@example.com',
    details: 'Updated SMS gateway configuration',
    ip: '192.168.1.106'
  }
];

const securityLogs = [
  {
    id: 1,
    timestamp: '2024-01-16 14:35:00',
    event: 'failed_login',
    severity: 'medium',
    source: '192.168.1.200',
    details: 'Multiple failed login attempts for user admin@example.com',
    status: 'active'
  },
  {
    id: 2,
    timestamp: '2024-01-16 14:30:15',
    event: 'suspicious_activity',
    severity: 'high',
    source: '10.0.0.50',
    details: 'Unusual API request pattern detected',
    status: 'investigating'
  },
  {
    id: 3,
    timestamp: '2024-01-16 14:25:30',
    event: 'password_change',
    severity: 'low',
    source: '192.168.1.107',
    details: 'User password changed successfully',
    status: 'resolved'
  }
];

export function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedService, setSelectedService] = useState('all');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      case 'debug': return <Clock className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent">
          System Logs
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Monitor system activities, track security events, and analyze application logs for troubleshooting and auditing.
        </p>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Logs</p>
                <p className="text-3xl font-bold text-gray-900">45.2K</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Errors Today</p>
                <p className="text-3xl font-bold text-gray-900">23</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Warnings</p>
                <p className="text-3xl font-bold text-gray-900">156</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">98.2%</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system">System Logs</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="security">Security Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Application Logs
                  </CardTitle>
                  <CardDescription>System events, errors, and application activities</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search logs..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="sms">SMS Gateway</SelectItem>
                    <SelectItem value="email">Email Service</SelectItem>
                    <SelectItem value="voice">Voice Gateway</SelectItem>
                    <SelectItem value="auth">Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(log.level)}>
                          <div className="flex items-center gap-1">
                            {getLevelIcon(log.level)}
                            {log.level}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.service}</TableCell>
                      <TableCell className="max-w-md truncate">{log.message}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Audit Trail
              </CardTitle>
              <CardDescription>User actions and system changes for compliance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.resource}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="max-w-md truncate">{log.details}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Security Events
              </CardTitle>
              <CardDescription>Security incidents, threats, and authentication events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.event}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.source}</TableCell>
                      <TableCell className="max-w-md truncate">{log.details}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
