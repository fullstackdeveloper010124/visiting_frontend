import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Package,
  Truck,
  FileText,
  DollarSign,
  Menu,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

interface WorkflowDiagramsProps {
  onMenuClick?: () => void;
}

export function WorkflowDiagrams({
  onMenuClick,
}: WorkflowDiagramsProps) {
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
              <h1 className="text-2xl font-semibold">
                System Workflows
              </h1>
              <p className="text-sm text-muted-foreground">
                Visual process diagrams and business flows
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Tabs defaultValue="order" className="space-y-4">
          <TabsList>
            <TabsTrigger value="order">
              Order Workflow
            </TabsTrigger>
            <TabsTrigger value="inventory">
              Inventory Workflow
            </TabsTrigger>
            <TabsTrigger value="sales">
              Sales Workflow
            </TabsTrigger>
            <TabsTrigger value="procurement">
              Procurement Workflow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Processing Workflow</CardTitle>
                <CardDescription>
                  End-to-end order fulfillment process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                        1
                      </div>
                      <div className="h-full w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold mb-2">
                        Customer Places Order
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        User browses products, customizes items,
                        and adds to cart. Cart shows tier-based
                        pricing. User proceeds to checkout.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          User Role
                        </Badge>
                        <Badge className="bg-blue-500 text-white">
                          Order Status: Draft
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                        2
                      </div>
                      <div className="h-full w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold mb-2">
                        Order Processor Reviews
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Order Processor reviews order details,
                        validates customization, checks
                        inventory availability, and confirms
                        order.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Order Processor Role
                        </Badge>
                        <Badge className="bg-yellow-500 text-white">
                          Order Status: Processing
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                        3
                      </div>
                      <div className="h-full w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold mb-2">
                        Inventory Reserved
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Inventory Admin reserves stock for the
                        order. Stock movement is logged in audit
                        trail.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Inventory Admin Role
                        </Badge>
                        <Badge className="bg-orange-500 text-white">
                          Stock Status: Reserved
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white">
                        4
                      </div>
                      <div className="h-full w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold mb-2">
                        Invoice Generated
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Accounting generates invoice based on
                        order details and tier pricing. Invoice
                        is sent to customer.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Accounting Role
                        </Badge>
                        <Badge className="bg-yellow-500 text-white">
                          Invoice Status: Sent
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                        5
                      </div>
                      <div className="h-full w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold mb-2">
                        Payment Confirmed
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Accounting confirms payment receipt.
                        Order status updated to "Ready for
                        Delivery".
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Accounting Role
                        </Badge>
                        <Badge className="bg-green-500 text-white">
                          Payment Status: Paid
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                        6
                      </div>
                      <div className="h-full w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold mb-2">
                        Delivery Assigned
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Order Processor assigns delivery to
                        Delivery Person. Schedule and route are
                        optimized.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Order Processor Role
                        </Badge>
                        <Badge className="bg-blue-500 text-white">
                          Delivery Status: Assigned
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Step 7 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
                        7
                      </div>
                      <div className="h-full w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold mb-2">
                        In Transit
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Delivery Person picks up order and marks
                        status as "In Transit". Customer
                        receives tracking notification.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Delivery Person Role
                        </Badge>
                        <Badge className="bg-orange-500 text-white">
                          Delivery Status: In Transit
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Step 8 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">
                        Delivered
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Delivery Person completes delivery,
                        uploads proof of delivery
                        (photo/signature), and marks as
                        delivered. Stock is released from
                        inventory.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Delivery Person Role
                        </Badge>
                        <Badge className="bg-green-500 text-white">
                          Order Complete
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Inventory Management Workflow
                </CardTitle>
                <CardDescription>
                  Stock tracking and replenishment process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">
                        1. Stock Monitoring
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Inventory Admin continuously monitors
                      stock levels. System alerts when items
                      reach reorder point.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-500/10 rounded">
                        <FileText className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold">
                        2. Purchase Order Creation
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Procurement creates purchase order with
                      selected vendor. Vendor pricing and MOQ
                      are verified.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500/10 rounded">
                        <Truck className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold">
                        3. Stock Receipt
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Inventory Admin receives stock, performs
                      quality check, and adds to inventory.
                      Movement is logged.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/10 rounded">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold">
                        4. Stock Available
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stock is now available for order
                      fulfillment. Real-time quantity updates
                      across all systems.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline Workflow</CardTitle>
                <CardDescription>
                  Lead to customer conversion process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-500">
                          New Lead
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Salesperson adds lead
                      </span>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-purple-500">
                          Qualified
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Initial meeting scheduled
                      </span>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-500">
                          Proposal
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Pricing and terms sent
                      </span>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-yellow-500">
                          Negotiation
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Contract discussions
                      </span>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-500">
                          Landed
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Contract signed → Finance Contracts
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Finance Contracts creates client contract,
                      sets up recurring orders, and tracks
                      contract expiry.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="procurement"
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  Vendor Onboarding & Procurement Workflow
                </CardTitle>
                <CardDescription>
                  Supplier management and product sourcing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      1. Vendor Evaluation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Procurement evaluates potential vendors
                      based on quality, pricing, lead times, and
                      reliability.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      2. Vendor Onboarding
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Procurement creates vendor profile with
                      contact info, payment terms, and initial
                      product catalog.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      3. Pricing Setup
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Procurement negotiates and enters vendor
                      pricing, MOQ, and lead times for each
                      product.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      4. Contract Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Finance Contracts creates vendor contract,
                      uploads documents, and sets expiry
                      tracking.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      5. Ongoing Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Procurement monitors vendor performance,
                      updates pricing, and manages vendor
                      relationships.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}