"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function FBIComplaintPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending complaint (replace with your API logic)
    setTimeout(() => {
      toast.success("Your complaint has been submitted!");
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setContactEmail("");
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-8">
      <div className="max-w-xl mx-auto py-10 px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-primary mb-2">FBI Complaint Center</h1>
        <p className="text-muted-foreground mb-8">
          If you have any complaints, concerns, or wish to report suspicious activity, please fill out the form below. Our team will review and respond as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl shadow-lg p-6 border border-border">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground mb-1">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-card/50 text-foreground border-border placeholder-muted-foreground"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              Your Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card/50 text-foreground border-border placeholder-muted-foreground"
              placeholder="you@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-card/50 text-foreground border-border placeholder-muted-foreground"
              placeholder="Complaint subject"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-card/50 text-foreground border-border placeholder-muted-foreground"
              placeholder="Describe your complaint or issue in detail..."
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg shadow-lg shadow-primary/25 hover:opacity-90 transition disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </form>
      </div>
    </div>
  );
}