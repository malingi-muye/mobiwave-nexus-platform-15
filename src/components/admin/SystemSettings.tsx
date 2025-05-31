
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Mail, 
  MessageSquare, 
  Shield, 
  Database,
  Bell,
  Save,
  RefreshCw,
  Key,
  Globe,
  Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SystemSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    sms: {
      provider: 'mspace',
      apiKey: '****-****-****-****',
      sender: 'MOBIWAVE',
      deliveryReports: true,
      rateLimiting: true,
      maxPerMinute: 100
    },
    email: {
      provider: 'smtp',
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      username: 'noreply@mobiwave.com',
      fromName: 'Mobiwave',
      encryption: 'tls'
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      loginAttempts: 5,
      ipWhitelist: true
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'info',
      backupFrequency: 'daily',
      timezone: 'UTC'
    }
  });

  const handleSave = (section: string) => {
    toast({
      title: "Settings Updated",
      description: `${section} settings have been saved successfully.`,
    });
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-slate-700 bg-clip-text text-transparent">
          System Settings
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Configure system-wide settings, integrations, security policies, and operational parameters.
        </p>
      </div>

      <Tabs defaultValue="sms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sms">SMS Settings</TabsTrigger>
          <TabsTrigger value="email">Email Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="sms" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                SMS Gateway Configuration
              </CardTitle>
              <CardDescription>Configure SMS provider settings and delivery options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sms-provider">SMS Provider</Label>
                  <Select 
                    value={settings.sms.provider} 
                    onValueChange={(value) => updateSetting('sms', 'provider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mspace">Mspace Kenya</SelectItem>
                      <SelectItem value="africastalking">Africa's Talking</SelectItem>
                      <SelectItem value="twilio">Twilio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-sender">Default Sender ID</Label>
                  <Input 
                    id="sms-sender"
                    value={settings.sms.sender}
                    onChange={(e) => updateSetting('sms', 'sender', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-api-key">API Key</Label>
                  <Input 
                    id="sms-api-key"
                    type="password"
                    value={settings.sms.apiKey}
                    onChange={(e) => updateSetting('sms', 'apiKey', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (per minute)</Label>
                  <Input 
                    id="rate-limit"
                    type="number"
                    value={settings.sms.maxPerMinute}
                    onChange={(e) => updateSetting('sms', 'maxPerMinute', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="delivery-reports">Delivery Reports</Label>
                    <p className="text-sm text-gray-600">Enable delivery status tracking</p>
                  </div>
                  <Switch 
                    id="delivery-reports"
                    checked={settings.sms.deliveryReports}
                    onCheckedChange={(checked) => updateSetting('sms', 'deliveryReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rate-limiting">Rate Limiting</Label>
                    <p className="text-sm text-gray-600">Enforce API rate limits</p>
                  </div>
                  <Switch 
                    id="rate-limiting"
                    checked={settings.sms.rateLimiting}
                    onCheckedChange={(checked) => updateSetting('sms', 'rateLimiting', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('SMS')} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save SMS Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Email Service Configuration
              </CardTitle>
              <CardDescription>Configure SMTP settings and email delivery options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email-provider">Email Provider</Label>
                  <Select 
                    value={settings.email.provider}
                    onValueChange={(value) => updateSetting('email', 'provider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input 
                    id="smtp-host"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input 
                    id="smtp-port"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encryption">Encryption</Label>
                  <Select 
                    value={settings.email.encryption}
                    onValueChange={(value) => updateSetting('email', 'encryption', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-username">Username</Label>
                  <Input 
                    id="email-username"
                    value={settings.email.username}
                    onChange={(e) => updateSetting('email', 'username', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input 
                    id="from-name"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('Email')} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Security Configuration
              </CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-length">Minimum Password Length</Label>
                  <Input 
                    id="password-length"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-attempts">Max Login Attempts</Label>
                  <Input 
                    id="login-attempts"
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Force 2FA for all admin users</p>
                  </div>
                  <Switch 
                    id="two-factor"
                    checked={settings.security.twoFactorRequired}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorRequired', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                    <p className="text-sm text-gray-600">Restrict admin access to specific IPs</p>
                  </div>
                  <Switch 
                    id="ip-whitelist"
                    checked={settings.security.ipWhitelist}
                    onCheckedChange={(checked) => updateSetting('security', 'ipWhitelist', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('Security')} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-600" />
                System Configuration
              </CardTitle>
              <CardDescription>Configure system-wide operational settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="log-level">Log Level</Label>
                  <Select 
                    value={settings.system.logLevel}
                    onValueChange={(value) => updateSetting('system', 'logLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select 
                    value={settings.system.backupFrequency}
                    onValueChange={(value) => updateSetting('system', 'backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">System Timezone</Label>
                  <Select 
                    value={settings.system.timezone}
                    onValueChange={(value) => updateSetting('system', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Temporarily disable user access</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.system.maintenanceMode && (
                      <Badge className="bg-yellow-100 text-yellow-800">Active</Badge>
                    )}
                    <Switch 
                      id="maintenance-mode"
                      checked={settings.system.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('system', 'maintenanceMode', checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <p className="text-sm text-gray-600">Enable detailed error logging</p>
                  </div>
                  <Switch 
                    id="debug-mode"
                    checked={settings.system.debugMode}
                    onCheckedChange={(checked) => updateSetting('system', 'debugMode', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('System')} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
