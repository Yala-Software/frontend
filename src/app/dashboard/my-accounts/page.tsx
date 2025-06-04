
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Loader2 } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: string;
  currency: string;
  type: "Checking" | "Savings" | "Credit Card" | "Investment";
}

export default function MyAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem('mockUserId');
      if (!userId) {
        toast({ variant: "destructive", title: "Error", description: "User session not found. Please log in again." });
        setIsLoading(false);
        // Potentially redirect to login, handled by layout
        return;
      }
      try {
        const fetchedAccounts = await api.fetchMyAccounts(userId);
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load accounts data." });
      } finally {
        setIsLoading(false);
      }
    };
    loadAccounts();
  }, [toast]);

  const getTotalBalance = (currency: string) => {
    return accounts
      .filter(acc => acc.currency === currency && acc.type !== 'Credit Card')
      .reduce((sum, acc) => sum + parseFloat(acc.balance.replace(/,/g, '')), 0)
      .toFixed(2);
  };

  const totalUSDBalance = getTotalBalance("USD");
  const totalEURBalance = getTotalBalance("EUR");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading accounts...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-headline flex items-center gap-2">
        <Wallet className="h-8 w-8 text-primary" /> My Accounts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>USD Balance</CardTitle>
            <CardDescription>Total across your USD accounts (excluding credit cards).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">${totalUSDBalance}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>EUR Balance</CardTitle>
            <CardDescription>Total across all your EUR accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">€{totalEURBalance}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Overview of your active accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 && !isLoading ? (
            <p>No accounts found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.accountNumber}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          account.type === "Credit Card" ? "destructive" : 
                          account.type === "Investment" ? "secondary" : "default"
                        }
                        className="capitalize"
                      >
                        {account.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${parseFloat(account.balance.replace(/,/g, '')) < 0 ? 'text-destructive' : ''}`}>
                      {account.currency === "USD" ? "$" : "€"}
                      {account.balance} {account.currency}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
