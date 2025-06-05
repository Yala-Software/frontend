
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { api } from '@/lib/api';

const mockApis = ["YalaExchange API", "Partner API A", "Partner API B"];

export default function TransferPage() {
  const [fromAccount, setFromAccount] = useState("checking-usd-main");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [selectedApi, setSelectedApi] = useState<string>(mockApis[0]);
  const [conversionPreview, setConversionPreview] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);


  // Dummy account options - in a real app, these would come from an API
  const userAccounts = [
    { value: "checking-usd-main", label: "Checking (**** 1234) - $5,250.75 USD", currency: "USD" },
    { value: "savings-usd-high", label: "Savings (**** 5678) - $15,820.00 USD", currency: "USD" },
    { value: "checking-eur-secondary", label: "Euro Account (**** 3456) - €2,100.50 EUR", currency: "EUR" },
  ];

  useEffect(() => {
    const calculatePreview = async () => {
      const numericAmount = parseFloat(amount);
      const sourceAccountDetails = userAccounts.find(acc => acc.value === fromAccount);

      if (!sourceAccountDetails || !currency || !selectedApi || isNaN(numericAmount) || numericAmount <= 0) {
        setConversionPreview(null);
        return;
      }

      const fromCurrencyPreview = sourceAccountDetails.currency;
      const toCurrencyPreview = currency; // This is the currency of the transfer

      if (fromCurrencyPreview === toCurrencyPreview) {
        setConversionPreview(`No conversion needed. Transferring ${numericAmount.toFixed(2)} ${fromCurrencyPreview}.`);
        setIsPreviewLoading(false);
        return;
      }

      setIsPreviewLoading(true);
      try {
        const result = await api.getCurrencyConversion(numericAmount, fromCurrencyPreview, toCurrencyPreview, selectedApi);
        if (result.success && result.convertedAmount !== undefined && result.rate !== undefined) {
          setConversionPreview(`${numericAmount.toFixed(2)} ${fromCurrencyPreview} ≈ ${result.convertedAmount.toFixed(2)} ${toCurrencyPreview} (Rate: ${result.rate.toFixed(4)})`);
        } else {
          setConversionPreview(result.message || "Preview unavailable for these currencies/amount.");
        }
      } catch (error) {
        console.error("Preview conversion error:", error);
        setConversionPreview("Error fetching preview.");
      } finally {
        setIsPreviewLoading(false);
      }
    };

    if (amount && fromAccount && currency && selectedApi) {
      const debounceTimer = setTimeout(() => {
          calculatePreview();
      }, 500); 
      return () => clearTimeout(debounceTimer);
    } else {
      setConversionPreview(null);
      setIsPreviewLoading(false);
    }
  }, [amount, fromAccount, currency, selectedApi, userAccounts]);


  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid positive amount." });
      setIsProcessing(false);
      return;
    }
    if (!toAccount.trim()) {
      toast({ variant: "destructive", title: "Invalid Recipient", description: "Please enter a recipient account or email." });
      setIsProcessing(false);
      return;
    }

    const userId = localStorage.getItem('mockUserId');
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "User session not found. Please log in again." });
      setIsProcessing(false);
      return;
    }

    try {
      const result = await api.performTransfer(userId, {
        fromAccount: userAccounts.find(acc => acc.value === fromAccount)?.label || fromAccount,
        toAccount,
        amount: numericAmount,
        currency,
        notes,
      });

      if (result.success) {
        toast({ title: "Transfer Successful", description: result.message });
        // Reset form
        setToAccount("");
        setAmount(""); // Also clears preview due to useEffect dependency
        setNotes("");
      } else {
        toast({ variant: "destructive", title: "Transfer Failed", description: result.message });
      }
    } catch (error) {
      console.error("Transfer error:", error);
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred during the transfer." });
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
          <CardDescription>Securely transfer funds between accounts or to other users. Real-time conversion preview available.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Select value={fromAccount} onValueChange={(value) => {
                setFromAccount(value);
                // If the new fromAccount currency is different from current transfer currency, update transfer currency
                const selectedAcc = userAccounts.find(acc => acc.value === value);
                if (selectedAcc && selectedAcc.currency !== currency) {
                  // setCurrency(selectedAcc.currency); // Or keep currency and let preview handle it. Let's keep it for now.
                }
              }}>
                <SelectTrigger id="fromAccount">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {userAccounts.map(acc => (
                    <SelectItem key={acc.value} value={acc.value}>
                      {acc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account/Recipient Email</Label>
              <Input 
                id="toAccount" 
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="Enter account number or email" 
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Transfer Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                     <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="apiProvider">API Provider for Preview</Label>
                <Select value={selectedApi} onValueChange={setSelectedApi}>
                    <SelectTrigger id="apiProvider">
                        <SelectValue placeholder="Select API" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockApis.map(api => <SelectItem key={api} value={api}>{api}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            { (amount || conversionPreview) && ( // Show preview box if amount is entered or there's a preview message
                <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-3 bg-muted/50 rounded-lg"
                >
                <p className="text-sm font-medium text-foreground">Conversion Preview:</p>
                {isPreviewLoading ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                    </div>
                ) : conversionPreview ? (
                    <p className="text-sm text-primary">{conversionPreview}</p>
                ) : (
                    <p className="text-sm text-muted-foreground">Enter amount and ensure currencies differ for a preview.</p>
                )}
                {selectedApi && !isPreviewLoading && conversionPreview && <p className="text-xs text-muted-foreground mt-1">Using {selectedApi}</p>}
                </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
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
              Review & Transfer
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

