"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/types";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const predefinedUsersData: User[] = [
  { id: "user1", name: "Alice Wonderland", email: "alice@example.com", avatar: "https://placehold.co/100x100.png?text=A" },
  { id: "user2", name: "Bob The Builder", email: "bob@example.com", avatar: "https://placehold.co/100x100.png?text=B" },
];

export function PredefinedUsers() {
  const { login } = useAuth();
  const { toast } = useToast();

  const handlePredefinedLogin = (user: User) => {
    login(user);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.name}!`,
    });
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-headline">Quick Access</CardTitle>
        </div>
        <CardDescription>Login with a predefined user.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {predefinedUsersData.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile person" />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handlePredefinedLogin(user)} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Login as {user.name.split(" ")[0]}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
