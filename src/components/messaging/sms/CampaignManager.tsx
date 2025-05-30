
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCampaigns, useCreateCampaign, useUpdateCampaign } from "@/hooks/useCampaigns";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, MessageSquare, Send, Edit3, Trash2, Play, Pause, BarChart3 } from "lucide-react";

export function CampaignManager() {
  const { data: campaigns, isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const { toast } = useToast();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'sms' as 'sms' | 'email' | 'whatsapp',
    content: '',
    subject: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCampaign) {
        const campaign = campaigns?.find(c => c.id === editingCampaign);
        if (campaign) {
          await updateCampaign.mutateAsync({
            id: editingCampaign,
            ...formData,
          });
          toast({
            title: "Campaign Updated",
            description: "Your campaign has been successfully updated.",
          });
        }
      } else {
        await createCampaign.mutateAsync(formData);
        toast({
          title: "Campaign Created",
          description: "Your campaign has been successfully created.",
        });
      }

      // Reset form
      setFormData({ name: '', type: 'sms', content: '', subject: '' });
      setShowCreateForm(false);
      setEditingCampaign(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (campaign: any) => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        type: campaign.type || 'sms',
        content: campaign.content || '',
        subject: campaign.subject || '',
      });
      setEditingCampaign(campaign.id);
      setShowCreateForm(true);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      sms: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      whatsapp: 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Campaign Manager</h2>
          <p className="text-gray-600">Create and manage your messaging campaigns</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </CardTitle>
            <CardDescription>
              {editingCampaign ? 'Update your campaign details' : 'Set up a new messaging campaign'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter campaign name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'sms' | 'email' | 'whatsapp') => 
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.type === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Enter email subject"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your message content"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createCampaign.isPending || updateCampaign.isPending}
                >
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCampaign(null);
                    setFormData({ name: '', type: 'sms', content: '', subject: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <div className="flex gap-2">
                    {getTypeBadge(campaign.type)}
                    {getStatusBadge(campaign.status)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(campaign)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 line-clamp-3">
                {campaign.content}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Recipients</div>
                  <div className="font-semibold">{campaign.recipient_count || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500">Sent</div>
                  <div className="font-semibold">{campaign.sent_count || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500">Delivered</div>
                  <div className="font-semibold text-green-600">{campaign.delivered_count || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500">Failed</div>
                  <div className="font-semibold text-red-600">{campaign.failed_count || 0}</div>
                </div>
              </div>

              <div className="flex gap-2">
                {campaign.status === 'draft' && (
                  <Button size="sm" className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                )}
                {campaign.status === 'active' && (
                  <Button size="sm" variant="outline" className="flex-1">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-4">Create your first campaign to start sending messages</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
