
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User as UserIcon, UserCircle, AtSign, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { api } from '@/lib/api';
import type { User } from '@/types';

export default function MyProfilePage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<Partial<User>>({
    name: '',
    username: '',
    email: '',
  });
  const [initialProfileData, setInitialProfileData] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem('mockUserId');
      if (userId) {
        try {
          const user = await api.fetchCurrentUser(userId);
          if (user) {
            setProfileData({ name: user.name, username: user.username, email: user.email, createdAt: user.createdAt, avatar: user.avatar });
            setInitialProfileData({ name: user.name, username: user.username, email: user.email, createdAt: user.createdAt, avatar: user.avatar });
          } else {
            toast({ variant: "destructive", title: "Error", description: "Could not load profile." });
          }
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "Failed to fetch profile data." });
        }
      }
      setIsLoading(false);
    };
    loadUserProfile();
  }, [toast]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const userId = localStorage.getItem('mockUserId');
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "User session not found." });
      setIsSaving(false);
      return;
    }

    const updates: Partial<Pick<User, 'name' | 'username' | 'email'>> = {};
    if (profileData.name !== initialProfileData.name) updates.name = profileData.name;
    if (profileData.username !== initialProfileData.username) updates.username = profileData.username;
    if (profileData.email !== initialProfileData.email) updates.email = profileData.email;


    if (Object.keys(updates).length === 0) {
        toast({ title: "No Changes", description: "Profile information is already up-to-date." });
        setIsSaving(false);
        return;
    }
    
    try {
      const updatedUser = await api.updateUserProfile(userId, updates);
      if (updatedUser) {
        setProfileData({ name: updatedUser.name, username: updatedUser.username, email: updatedUser.email, createdAt: updatedUser.createdAt, avatar: updatedUser.avatar });
        setInitialProfileData({ name: updatedUser.name, username: updatedUser.username, email: updatedUser.email, createdAt: updatedUser.createdAt, avatar: updatedUser.avatar });
        toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: "Could not update profile." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Error", description: error.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (!profileData.email) { // Check if any essential data is missing
    return <div className="p-6 text-center">Could not load profile data. Please try logging out and in again.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-headline flex items-center gap-2">
        <UserIcon className="h-8 w-8 text-primary" /> My Profile
      </h1>
      <Card className="max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View and update your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.avatar || `https://placehold.co/96x96.png?text=${profileData.name ? profileData.name[0] : 'U'}`} alt={profileData.name || 'User'} data-ai-hint="profile person" />
                <AvatarFallback className="text-3xl">{profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{initialProfileData.name}</h2>
                <p className="text-muted-foreground">{initialProfileData.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" name="name" value={profileData.name || ''} onChange={handleChange} className="pl-10" placeholder="Your full name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input id="username" name="username" value={profileData.username || ''} onChange={handleChange} className="pl-10" placeholder="Your username" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" name="email" type="email" value={profileData.email || ''} onChange={handleChange} className="pl-10" placeholder="your@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Member Since</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="createdAt" 
                  value={profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'} 
                  readOnly 
                  className="pl-10 bg-muted/50 cursor-default"
                />
              </div>
            </div>
            
            <Button type="submit" disabled={isSaving || isLoading || 
                (profileData.name === initialProfileData.name && 
                 profileData.username === initialProfileData.username &&
                 profileData.email === initialProfileData.email)
            }>
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
