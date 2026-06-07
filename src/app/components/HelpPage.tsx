import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Search, Book, MessageCircle, FileText } from 'lucide-react';

interface HelpPageProps {
  onMenuClick?: () => void;
}

export function HelpPage({ onMenuClick }: HelpPageProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <AppHeader onMenuClick={onMenuClick} />
      <main className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto p-6 md:p-8">
        <div className="space-y-8">
          <div className="text-center space-y-4 py-12 bg-muted/30 rounded-2xl border border-border">
            <h1 className="text-4xl font-bold tracking-tight">How can we help you?</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Browse our knowledge base or get in touch with support.</p>
            <div className="relative max-w-lg mx-auto mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="pl-10 h-12 text-base rounded-full bg-background" placeholder="Search for documentation, guides, or FAQs..." />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group hover:shadow-md">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Documentation</CardTitle>
                <CardDescription className="text-base mt-2">Detailed guides and references for the system.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group hover:shadow-md">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Community Forum</CardTitle>
                <CardDescription className="text-base mt-2">Join the vibrant community to discuss best practices.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group hover:shadow-md">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Support Tickets</CardTitle>
                <CardDescription className="text-base mt-2">Submit a ticket if you need direct assistance from our tech support team.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {q: "How do I update my profile?", a: "Navigate to Edit Profile in the sidebar to update your personal details."},
                {q: "Where can I track my inventory?", a: "The My Inventory tab shows real-time status of your materials."},
                {q: "How to reset my password?", a: "Go to Settings > Security and click Update Password."},
                {q: "Is two-factor auth supported?", a: "Yes, you can enable 2FA from the Security panel in Settings."}
              ].map((faq, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                    <CardDescription>{faq.a}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
