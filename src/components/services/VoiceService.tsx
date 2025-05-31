
import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Phone, Mic, History, Upload } from 'lucide-react';
import { useMspaceVoice } from '@/hooks/useMspaceVoice';
import { useToast } from '@/hooks/use-toast';

export function VoiceService() {
  const [recipients, setRecipients] = useState('');
  const [textToSpeech, setTextToSpeech] = useState('');
  const [voiceFileUrl, setVoiceFileUrl] = useState('');
  const [voiceType, setVoiceType] = useState('tts');
  
  const { makeVoiceCall, getCallHistory } = useMspaceVoice();
  const { toast } = useToast();

  const handleMakeCall = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recipientList = recipients.split(',').map(r => r.trim()).filter(Boolean);
    
    if (recipientList.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide recipients",
        variant: "destructive",
      });
      return;
    }

    if (voiceType === 'tts' && !textToSpeech) {
      toast({
        title: "Validation Error",
        description: "Please provide text for text-to-speech",
        variant: "destructive",
      });
      return;
    }

    if (voiceType === 'file' && !voiceFileUrl) {
      toast({
        title: "Validation Error",
        description: "Please provide voice file URL",
        variant: "destructive",
      });
      return;
    }

    try {
      await makeVoiceCall.mutateAsync({
        recipients: recipientList,
        text_to_speech: voiceType === 'tts' ? textToSpeech : undefined,
        voice_file_url: voiceType === 'file' ? voiceFileUrl : undefined,
      });

      toast({
        title: "Voice Call Initiated",
        description: `Voice call sent to ${recipientList.length} recipient(s)`,
      });

      setRecipients('');
      setTextToSpeech('');
      setVoiceFileUrl('');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to make voice call",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voice Service</h1>
            <p className="text-gray-600">Make voice calls with text-to-speech or audio files</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Make Voice Call Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Make Voice Call
              </CardTitle>
              <CardDescription>
                Send voice messages to mobile numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMakeCall} className="space-y-4">
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
                  <Label htmlFor="voiceType">Voice Type</Label>
                  <Select value={voiceType} onValueChange={setVoiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tts">Text-to-Speech</SelectItem>
                      <SelectItem value="file">Audio File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {voiceType === 'tts' && (
                  <div className="space-y-2">
                    <Label htmlFor="textToSpeech">Text to Speech</Label>
                    <Textarea
                      id="textToSpeech"
                      placeholder="Enter the text to be converted to speech"
                      value={textToSpeech}
                      onChange={(e) => setTextToSpeech(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                {voiceType === 'file' && (
                  <div className="space-y-2">
                    <Label htmlFor="voiceFile">Voice File URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="voiceFile"
                        placeholder="https://example.com/audio.mp3"
                        value={voiceFileUrl}
                        onChange={(e) => setVoiceFileUrl(e.target.value)}
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={makeVoiceCall.isPending}
                  className="w-full"
                >
                  {makeVoiceCall.isPending ? 'Calling...' : 'Make Voice Call'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Call History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Call History
              </CardTitle>
              <CardDescription>
                Recent voice call history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getCallHistory.data?.length > 0 ? (
                <div className="space-y-3">
                  {getCallHistory.data.map((call: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{call.recipient}</span>
                        <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                          {call.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Duration: {call.duration || 'N/A'}</p>
                        <p>Cost: KES {call.cost || '0'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No call history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
