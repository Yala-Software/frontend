
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, CheckCircle, Loader2, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
];

const mockApis = ["YalaExchange API", "Partner API A", "Partner API B"];


export default function CurrencyConversionPage() {
  const [amount, setAmount] = useState<string>("1.00");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [selectedApi, setSelectedApi] = useState<string>(mockApis[0]);
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    setIsLoading(true);
    setConvertedAmount(null);
    setShowConfirmation(false);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid positive amount." });
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.getCurrencyConversion(numericAmount, fromCurrency, toCurrency, selectedApi);
      if (result.success && result.convertedAmount !== undefined) {
        setConvertedAmount(result.convertedAmount.toFixed(2));
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000); 
        
        toast({
          title: "Conversion Successful",
          description: `${numericAmount.toFixed(2)} ${fromCurrency} is approximately ${result.convertedAmount.toFixed(2)} ${toCurrency}. (Using ${selectedApi}, Rate: ${result.rate || 'N/A'})`,
        });
      } else {
        toast({ variant: "destructive", title: "Conversion Failed", description: result.message || "Could not convert currency." });
      }
    } catch (error) {
        console.error("Conversion error:", error);
        toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred during conversion." });
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-headline flex items-center gap-2">
          <Repeat className="h-8 w-8 text-primary" /> Currency Converter
        </h1>
      
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          {/* CardTitle can be empty or have a generic title */}
          <CardDescription>Convert currencies using your preferred API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter amount"
                className="text-lg p-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromCurrency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="fromCurrency" className="text-lg p-3 h-auto">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-center my-4">
            <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="toCurrency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="toCurrency" className="text-lg p-3 h-auto">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="api">API Provider</Label>
              <Select value={selectedApi} onValueChange={setSelectedApi}>
                <SelectTrigger id="api" className="text-lg p-3 h-auto">
                  <SelectValue placeholder="Select API" />
                </SelectTrigger>
                <SelectContent>
                  {mockApis.map(api => <SelectItem key={api} value={api}>{api}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleConvert} disabled={isLoading} className="w-full text-lg py-6 mt-8">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Repeat className="mr-2 h-5 w-5" />
            )}
            Convert
          </Button>

          {convertedAmount && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-primary/10 rounded-lg text-center"
            >
              <p className="text-2xl font-semibold text-primary">
                {parseFloat(amount).toFixed(2)} {fromCurrency} = {convertedAmount} {toCurrency}
              </p>
              <p className="text-sm text-muted-foreground">Using {selectedApi}</p>
            </motion.div>
          )}
          {showConfirmation && !isLoading && (
             <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center text-green-600 mt-4"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Conversion successful!</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
      </div>
    </motion.div>
  );
}
