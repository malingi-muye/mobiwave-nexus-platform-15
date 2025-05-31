
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Database, 
  Play, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const mockTables = [
  { name: 'users', rows: 15234, size: '2.3 MB', status: 'healthy' },
  { name: 'campaigns', rows: 8567, size: '5.7 MB', status: 'healthy' },
  { name: 'message_history', rows: 245678, size: '156.8 MB', status: 'healthy' },
  { name: 'user_roles', rows: 23456, size: '1.2 MB', status: 'warning' },
  { name: 'audit_logs', rows: 567890, size: '89.4 MB', status: 'healthy' }
];

const mockBackups = [
  { id: 1, name: 'daily_backup_2024_01_15', size: '245.6 MB', created: '2024-01-15 03:00:00', status: 'completed' },
  { id: 2, name: 'weekly_backup_2024_01_14', size: '244.2 MB', created: '2024-01-14 03:00:00', status: 'completed' },
  { id: 3, name: 'monthly_backup_2024_01_01', size: '235.8 MB', created: '2024-01-01 03:00:00', status: 'completed' },
  { id: 4, name: 'backup_in_progress', size: '0 MB', created: '2024-01-16 03:00:00', status: 'running' }
];

export function DatabaseAdmin() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeQuery = async () => {
    if (!sqlQuery.trim()) return;
    
    setIsExecuting(true);
    // Simulate query execution
    setTimeout(() => {
      setQueryResult({
        rows: [
          { id: 1, email: 'admin@example.com', status: 'active' },
          { id: 2, email: 'user@example.com', status: 'active' }
        ],
        executionTime: '0.045s',
        rowsAffected: 2
      });
      setIsExecuting(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'running':
        return <Clock className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-green-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
          Database Administration
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Manage database operations, execute queries, monitor performance, and handle backups and maintenance tasks.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="query">Query Editor</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Tables</p>
                    <p className="text-3xl font-bold text-gray-900">{mockTables.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Database Size</p>
                    <p className="text-3xl font-bold text-gray-900">255.4 MB</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <Database className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Connections</p>
                    <p className="text-3xl font-bold text-gray-900">23</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <RefreshCw className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Database Tables
              </CardTitle>
              <CardDescription>Overview of all database tables and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTables.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>{table.rows.toLocaleString()}</TableCell>
                      <TableCell>{table.size}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(table.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(table.status)}
                            {table.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-600" />
                SQL Query Editor
              </CardTitle>
              <CardDescription>Execute SQL queries against the database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your SQL query here..."
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="min-h-[200px] font-mono"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={executeQuery} 
                  disabled={isExecuting || !sqlQuery.trim()}
                  className="flex items-center gap-2"
                >
                  {isExecuting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Execute Query
                </Button>
                <Button variant="outline" onClick={() => setSqlQuery('')}>
                  Clear
                </Button>
              </div>
              
              {queryResult && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Query Results</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Execution time: {queryResult.executionTime} | Rows affected: {queryResult.rowsAffected}
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {queryResult.rows.map((row: any) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-600" />
                    Database Backups
                  </CardTitle>
                  <CardDescription>Manage database backups and restoration</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Create Backup
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Backup Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBackups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.name}</TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>{backup.created}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(backup.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(backup.status)}
                            {backup.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  Database Optimization
                </CardTitle>
                <CardDescription>Optimize database performance and clean up data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Optimize Tables
                </Button>
                <Button className="w-full" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Rebuild Indexes
                </Button>
                <Button className="w-full" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Clean Old Logs
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  System Health
                </CardTitle>
                <CardDescription>Monitor database health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">62%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Disk Usage</span>
                  <span className="text-sm font-medium">34%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Connections</span>
                  <span className="text-sm font-medium">23/100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
