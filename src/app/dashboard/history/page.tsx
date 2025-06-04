
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Loader2 } from "lucide-react";
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  date: string;
  type: string;
  from?: string; // Optional for types like Deposit/Transfer
  to?: string;   // Optional for types like Deposit/Transfer
  amountFrom?: string; // For conversions
  amountTo?: string;   // For conversions
  toAccount?: string; // For transfers
  amount?: string; // For transfers/deposits
  source?: string; // For deposits
  status: string;
}

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem('mockUserId');
      if (!userId) {
        toast({ variant: "destructive", title: "Error", description: "User session not found. Please log in again." });
        setIsLoading(false);
        return;
      }
      try {
        const fetchedHistory = await api.fetchTransactionHistory(userId);
        setTransactions(fetchedHistory);
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load transaction history." });
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading transaction history...</p>
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
        <History className="h-8 w-8 text-primary" /> Transaction History
      </h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View your recent account activity.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 && !isLoading ? (
            <p>No transaction history found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.date}</TableCell>
                    <TableCell>{txn.type}</TableCell>
                    <TableCell>
                      {txn.type === "Conversion" ? `Converted ${txn.amountFrom} ${txn.from} to ${txn.amountTo} ${txn.to}` : 
                       txn.type === "Transfer" ? `Transferred to ${txn.toAccount}` : 
                       txn.type === "Deposit" ? `Deposited from ${txn.source}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {txn.type === "Conversion" ? `${txn.amountTo} ${txn.to}` : txn.amount}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={txn.status === "Completed" ? "default" : txn.status === "Pending" ? "secondary" : "destructive"}>
                        {txn.status}
                      </Badge>
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
