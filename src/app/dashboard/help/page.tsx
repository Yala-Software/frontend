"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I convert currency?",
      answer: "Navigate to the 'Currency Conversion' section from the sidebar. Enter the amount, select the 'From' and 'To' currencies, choose an API provider, and click 'Convert'."
    },
    {
      question: "How can I see my transaction history?",
      answer: "Go to the 'Transaction History' section from the sidebar. You'll see a list of your recent transactions."
    },
    {
      question: "Is it safe to use Yala Exchange?",
      answer: "We prioritize your security. All data is handled with care. (Note: This is a demo application, do not use real financial information)."
    },
    {
      question: "How do I update my profile?",
      answer: "Visit the 'My Profile' section. Currently, profile editing is a feature coming soon."
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline flex items-center gap-2">
        <HelpCircle className="h-8 w-8 text-primary" /> Help & Support
      </h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about Yala Exchange.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-lg hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>If you need further assistance, please reach out.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>For support, please email us at: <a href="mailto:support@yala.exchange" className="text-primary hover:underline">support@yala.exchange</a> (This is a dummy email).</p>
        </CardContent>
      </Card>
    </div>
  );
}
