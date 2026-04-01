import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or need help with your project? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email Us", detail: "support@imagerevivepro.com", desc: "We respond within 2 hours" },
              { icon: MessageCircle, title: "Live Chat", detail: "Available 9am-6pm EST", desc: "Instant help from our team" },
              { icon: MapPin, title: "Headquarters", detail: "San Francisco, CA", desc: "Global team, local support" },
            ].map((item, i) => (
              <div key={i} className="glass-card p-5">
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-display font-semibold text-sm">{item.title}</h3>
                <p className="text-sm font-medium">{item.detail}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            {submitted ? (
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">We'll get back to you within 2 hours during business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                    <Input placeholder="Your name" required className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                    <Input type="email" placeholder="your@email.com" required className="rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Subject</label>
                  <Input placeholder="How can we help?" required className="rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <Textarea placeholder="Tell us more about your project..." rows={5} required className="rounded-lg" />
                </div>
                <Button type="submit" className="w-full gradient-primary rounded-full border-0 hover:opacity-90">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
