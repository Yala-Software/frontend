"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function TransferPage() {
  const [fromAccount, setFromAccount] = useState("1");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const userAccounts = [
    {
      id: 1,
      label: "Checking (**** 1234) - $5,250.75 USD",
      currency: "USD",
    },
    {
      id: 2,
      label: "Savings (**** 5678) - $15,820.00 USD",
      currency: "USD",
    },
    {
      id: 3,
      label: "Euro Account (**** 3456) - €2,100.50 EUR",
      currency: "EUR",
    },
  ];

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
      });
      setIsProcessing(false);
      return;
    }

    if (!toAccount.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Recipient",
        description: "Please enter a recipient account ID.",
      });
      setIsProcessing(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "User token not found.",
      });
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          source_account_id: parseInt(fromAccount),
          destination_account_id: parseInt(toAccount),
          amount: numericAmount,
          description: notes,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.detail || "Transfer failed");
      }

      toast({ title: "Transfer Successful", description: "The transfer was completed." });
      setToAccount("");
      setAmount("");
      setNotes("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Unexpected error during transfer.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-headline flex items-center gap-2">
        <ArrowRightLeft className="h-8 w-8 text-primary" /> Transfer Funds
      </h1>
      <Card className="max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Make a Transfer</CardTitle>
          <CardDescription>
            Securely transfer funds between accounts or to other users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Select
                value={fromAccount}
                onValueChange={(value) => setFromAccount(value)}
              >
                <SelectTrigger id="fromAccount">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {userAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>
                      {acc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account ID</Label>
              <Input
                id="toAccount"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="Enter account ID"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment for..."
              />
            </div>

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ArrowRightLeft className="mr-2 h-5 w-5" />
              )}
              Transfer
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
