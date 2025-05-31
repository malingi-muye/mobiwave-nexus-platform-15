
import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, History, Settings } from 'lucide-react';
import { useMspaceUSSD } from '@/hooks/useMspaceUSSD';
import { useToast } from '@/hooks/use-toast';

export function USSDService() {
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [serviceCode, setServiceCode] = useState('');
  
  const { sendUSSD, getUSSDSessions } = useMspaceUSSD();
  const { toast } = useToast();

  const handleSendUSSD = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recipientList = recipients.split(',').map(r => r.trim()).filter(Boolean);
    
    if (recipientList.length === 0 || !message) {
      toast({
        title: "Validation Error",
        description: "Please provide recipients and message",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendUSSD.mutateAsync({
        recipients: recipientList,
        message,
        service_code: serviceCode || undefined,
      });

      toast({
        title: "USSD Sent",
        description: `USSD sent to ${recipientList.length} recipient(s)`,
      });

      setRecipients('');
      setMessage('');
      setServiceCode('');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send USSD",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">USSD Service</h1>
            <p className="text-gray-600">Send USSD messages and manage interactive sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send USSD Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Send USSD
              </CardTitle>
              <CardDescription>
                Send USSD messages to mobile numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendUSSD} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients (comma-separated)</Label>
                  <Input
                    id="recipients"
                    placeholder="254700000000, 254711111111"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceCode">Service Code (optional)</Label>
                  <Input
                    id="serviceCode"
                    placeholder="*144#"
                    value={serviceCode}
                    onChange={(e) => setServiceCode(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your USSD message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={sendUSSD.isPending}
                  className="w-full"
                >
                  {sendUSSD.isPending ? 'Sending...' : 'Send USSD'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* USSD Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Monitor active USSD sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getUSSDSessions.data?.length > 0 ? (
                <div className="space-y-3">
                  {getUSSDSessions.data.map((session: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{session.phone_number}</span>
                        <Badge variant="outline">{session.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{session.last_message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active USSD sessions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Messages Sent</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold">{getUSSDSessions.data?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Service Codes</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
