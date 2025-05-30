
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Try to fetch from the new users table first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userData) {
        setProfile(userData);
        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
      } else if (userError && userError.code === 'PGRST116') {
        // User not found in users table, try profiles table as fallback
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          if (profileData.first_name && profileData.last_name) {
            setFirstName(profileData.first_name);
            setLastName(profileData.last_name);
          } else if (profileData.full_name) {
            const parts = profileData.full_name.split(' ');
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(' ') || "");
          }
        } else {
          console.error('Error fetching profile:', profileError);
        }
      } else {
        console.error('Error fetching user:', userError);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      // Update in users table
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        });

      if (userError) {
        console.error('User update error:', userError);
      }

      // Also update profiles table for backwards compatibility
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      fetchProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
              {firstName && lastName 
                ? getInitials(firstName, lastName)
                : user?.email?.charAt(0).toUpperCase() || "U"
              }
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">
              {firstName && lastName 
                ? `${firstName} ${lastName}`
                : profile?.full_name || "No name set"
              }
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              {user?.email}
            </div>
          </div>
        </div>

        <form onSubmit={updateProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isUpdating}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
