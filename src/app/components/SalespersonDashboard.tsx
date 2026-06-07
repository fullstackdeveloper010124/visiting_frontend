import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, Calendar, PhoneCall, TrendingUp, CheckCircle, XCircle, AlertCircle, Menu } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface SalespersonDashboardProps {
  onMenuClick?: () => void;
}

export function SalespersonDashboard({ onMenuClick }: SalespersonDashboardProps) {
  const leads = [
    { id: 1, company: 'Acme Corporation', contact: 'John Smith', email: 'john@acme.com', phone: '+1 555-0101', status: 'qualified', value: 25000, source: 'Website', addedDate: '2026-02-20' },
    { id: 2, company: 'Tech Solutions Inc', contact: 'Sarah Johnson', email: 'sarah@techsol.com', phone: '+1 555-0102', status: 'proposal', value: 18500, source: 'Referral', addedDate: '2026-02-18' },
    { id: 3, company: 'Global Enterprises', contact: 'Mike Davis', email: 'mike@global.com', phone: '+1 555-0103', status: 'negotiation', value: 32000, source: 'Cold Call', addedDate: '2026-02-15' },
    { id: 4, company: 'StartupHub Co', contact: 'Emily Brown', email: 'emily@startuphub.com', phone: '+1 555-0104', status: 'new', value: 8900, source: 'LinkedIn', addedDate: '2026-02-28' },
  ];

  const meetings = [
    { id: 1, lead: 'Acme Corporation', title: 'Product Demo', scheduledAt: '2026-03-01 10:00 AM', duration: 60, location: 'Virtual', outcome: null },
    { id: 2, lead: 'Tech Solutions Inc', title: 'Proposal Discussion', scheduledAt: '2026-03-02 2:00 PM', duration: 45, location: 'Client Office', outcome: null },
    { id: 3, lead: 'Design Studio', title: 'Follow-up Call', scheduledAt: '2026-02-25 11:00 AM', duration: 30, location: 'Phone', outcome: 'requires_info' },
    { id: 4, lead: 'Marketing Agency', title: 'Contract Signing', scheduledAt: '2026-02-24 3:00 PM', duration: 30, location: 'Our Office', outcome: 'landed' },
  ];

  const postmortems = [
    { id: 1, lead: 'Marketing Agency', outcome: 'landed', value: 12000, notes: 'Signed 12-month contract for business cards and letterheads', date: '2026-02-24' },
    { id: 2, lead: 'Finance Corp', outcome: 'no', value: 0, notes: 'Budget constraints, decided to use internal resources', date: '2026-02-22' },
    { id: 3, lead: 'Design Studio', outcome: 'requires_info', value: 0, notes: 'Need detailed pricing for bulk orders, follow-up scheduled', date: '2026-02-25' },
  ];

  const landedCount = postmortems.filter(p => p.outcome === 'landed').length + 3;
  const lostCount = postmortems.filter(p => p.outcome === 'no').length + 1;
  const requiresInfoCount = postmortems.filter(p => p.outcome === 'requires_info').length;

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Sales Pipeline</h1>
              <p className="text-sm text-muted-foreground">Manage leads and opportunities</p>
            </div>
          </div>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Leads"
            value={leads.length.toString()}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Landed"
            value={landedCount.toString()}
            icon={CheckCircle}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Lost"
            value={lostCount.toString()}
            icon={XCircle}
            iconColor="text-red-500"
          />
          <StatsCard
            title="Requires Info"
            value={requiresInfoCount.toString()}
            icon={AlertCircle}
            iconColor="text-yellow-500"
          />
        </div>

        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="postmortem">Postmortem</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Pipeline</CardTitle>
                <CardDescription>Track and manage your sales opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Est. Value</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.company}</TableCell>
                          <TableCell>{lead.contact}</TableCell>
                          <TableCell className="text-sm">
                            <div>{lead.email}</div>
                            <div className="text-muted-foreground">{lead.phone}</div>
                          </TableCell>
                          <TableCell>
                            {lead.status === 'new' && (
                              <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">New</Badge>
                            )}
                            {lead.status === 'qualified' && (
                              <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400">Qualified</Badge>
                            )}
                            {lead.status === 'proposal' && (
                              <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">Proposal</Badge>
                            )}
                            {lead.status === 'negotiation' && (
                              <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Negotiation</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold">${lead.value.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.source}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule
                              </Button>
                              <Button size="sm" variant="outline">View</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Schedule</CardTitle>
                <CardDescription>Upcoming and past meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="font-semibold">{meeting.title}</div>
                          <div className="text-sm text-muted-foreground">{meeting.lead}</div>
                        </div>
                        {meeting.outcome === null ? (
                          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            Scheduled
                          </Badge>
                        ) : meeting.outcome === 'landed' ? (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Landed
                          </Badge>
                        ) : meeting.outcome === 'no' ? (
                          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                            <XCircle className="h-3 w-3 mr-1" />
                            No
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Requires Info
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {meeting.scheduledAt}
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneCall className="h-4 w-4" />
                          {meeting.location}
                        </div>
                      </div>
                      {meeting.outcome === null && (
                        <div className="flex gap-2 pt-2 border-t border-border">
                          <Button size="sm" variant="outline" className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Landed
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <XCircle className="h-4 w-4 mr-2" />
                            No
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Requires Info
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postmortem" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Postmortem</CardTitle>
                <CardDescription>Track outcomes and follow-ups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {postmortems.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold">{item.lead}</div>
                          <div className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</div>
                        </div>
                        {item.outcome === 'landed' ? (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Landed - ${item.value.toLocaleString()}
                          </Badge>
                        ) : item.outcome === 'no' ? (
                          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                            <XCircle className="h-3 w-3 mr-1" />
                            Lost
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Requires Follow-up
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}