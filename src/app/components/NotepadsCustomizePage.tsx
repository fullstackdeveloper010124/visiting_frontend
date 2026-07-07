import React, { useState, useRef } from 'react';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, ShoppingCart, Send, Loader2 } from 'lucide-react';

interface NotepadsCustomizePageProps {
  onMenuClick?: () => void;
}

const notepadPresets = [
  { measurement: '4.25 x 5.5 Notepad', pads: '100', inStock: '500', ordered: '50', balance: '450', minQuantity: '50', costPerPad: '2.50' },
  { measurement: '5.5 x 8.5 Notepad', pads: '100', inStock: '500', ordered: '50', balance: '450', minQuantity: '50', costPerPad: '3.50' },
  { measurement: '8.5 x 11 Notepad', pads: '50', inStock: '250', ordered: '25', balance: '225', minQuantity: '25', costPerPad: '5.00' },
];

export function NotepadsCustomizePage({ onMenuClick }: NotepadsCustomizePageProps) {
  const [measurement, setMeasurement] = useState(notepadPresets[0].measurement);
  const [pads, setPads] = useState(notepadPresets[0].pads);
  const [inStock, setInStock] = useState(notepadPresets[0].inStock);
  const [ordered, setOrdered] = useState(notepadPresets[0].ordered);
  const [balance, setBalance] = useState(notepadPresets[0].balance);
  const [minQuantity, setMinQuantity] = useState(notepadPresets[0].minQuantity);
  const [costPerPad, setCostPerPad] = useState(notepadPresets[0].costPerPad);
  
  const [uploadedNotepad, setUploadedNotepad] = useState<string | null>(null);
  const notepadInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  const [sendingApproval, setSendingApproval] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalSentEmail, setApprovalSentEmail] = useState('');
  const [testApprovalUrl, setTestApprovalUrl] = useState('');

  const handleSendForApproval = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Your session has expired. Please log in again.');
      navigate('/login');
      return;
    }

    setSendingApproval(true);
    try {
      const response = await fetch('/api/v1/customize-config/send-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          designType: 'notepad',
          designDetails: {
            measurement,
            pads,
            costPerPad,
            inStock,
            ordered,
            balance,
            minQuantity,
            uploadedNotepad
          }
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setApprovalSentEmail(resData.data.userEmail);
        setTestApprovalUrl(resData.approvalUrl || '');
        setApprovalModalOpen(true);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert(resData.error || 'Failed to send approval request.');
      }
    } catch (err) {
      console.error('Error sending for approval:', err);
      alert('Something went wrong. Please check if the backend server is running.');
    } finally {
      setSendingApproval(false);
    }
  };

  const handleMeasurementSelection = (value: string) => {
    setMeasurement(value);
    const preset = notepadPresets.find(p => p.measurement === value);
    if (preset) {
      setPads(preset.pads);
      setInStock(preset.inStock);
      setOrdered(preset.ordered);
      setBalance(preset.balance);
      setMinQuantity(preset.minQuantity);
      setCostPerPad(preset.costPerPad);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AppHeader onMenuClick={onMenuClick} />
      <main className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col lg:flex-row">
          <div className="flex-1 w-full lg:max-w-md xl:max-w-lg border-r border-border bg-background overflow-y-auto p-4 md:p-6 shadow-sm z-10">
            <div className="mb-6">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500">Notepads Studio</h1>
              <p className="text-sm text-muted-foreground mt-1">Configure details and upload your design.</p>
            </div>
            <div className="space-y-6 pb-20">
              <div className="space-y-4">
                <h3 className="font-semibold text-emerald-600 uppercase tracking-wider text-xs border-b pb-2">Notepad Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Upload Notepad Design</Label>
                    <input type="file" ref={notepadInputRef} className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setUploadedNotepad(URL.createObjectURL(e.target.files[0])); }} />
                    <Button variant="outline" className="w-full justify-start mt-1 text-xs border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" onClick={() => notepadInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> {uploadedNotepad ? "Change Design" : "Upload Design"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1.5 col-span-2">
                      <Label htmlFor="measurement">Notepad Measurement</Label>
                      <Select value={measurement} onValueChange={handleMeasurementSelection}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select measurement type" /></SelectTrigger>
                        <SelectContent>
                          {notepadPresets.map((preset) => (
                            <SelectItem key={preset.measurement} value={preset.measurement}>{preset.measurement}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-4 p-3 bg-muted/30 rounded-md border text-xs text-muted-foreground space-y-1">
                        <p className="font-semibold text-foreground">Name of the Book (Variable) - Pipeline Inspection with Company logo printed on the cover</p>
                        <ul className="list-disc pl-4 space-y-0.5 mt-2">
                          <li>25 NCR sets per Book (4 parts per set)</li>
                          <li>(No Carbon Required, 4 parts - Original, Accounting, Inventory, Customer)</li>
                          <li>Color or B/W print</li>
                          <li>Red Crash Numbers</li>
                          <li>Full size of the sheet - 9" x 11" (Stapled and Taped at the top)</li>
                          <li>Perforated for easy separation</li>
                          <li>Final Size - 8.5" x 11"</li>
                          <li>Wrap Around Cover</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-1.5"><Label htmlFor="pads">Number of Pads</Label><Input id="pads" value={pads} readOnly className="bg-muted/50 cursor-not-allowed" /></div>
                    <div className="space-y-1.5"><Label htmlFor="costPerPad">Cost Per Pad</Label><Input id="costPerPad" type="text" value={`$${costPerPad}`} readOnly className="bg-muted/50 cursor-not-allowed" /></div>
                    <div className="space-y-1.5"><Label htmlFor="inStock">Quantity in Stock</Label><Input id="inStock" type="number" value={inStock} readOnly className="bg-muted/50 cursor-not-allowed" /></div>
                    <div className="space-y-1.5"><Label htmlFor="ordered">Quantity Ordered</Label><Input id="ordered" type="number" value={ordered} readOnly className="bg-muted/50 cursor-not-allowed" /></div>
                    <div className="space-y-1.5"><Label htmlFor="balance">Quantity Balance</Label><Input id="balance" type="number" value={balance} readOnly className="bg-muted/50 cursor-not-allowed" /></div>
                    <div className="space-y-1.5"><Label htmlFor="minQuantity">Minimum Quantity</Label><Input id="minQuantity" type="number" value={minQuantity} readOnly className="bg-muted/50 cursor-not-allowed" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 lg:flex-[1.5] bg-muted/30 p-4 md:p-8 overflow-y-auto relative flex flex-col items-center">
            <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
               <div><h2 className="font-semibold text-lg flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-emerald-500"/> Print Preview</h2></div>
               <Button 
                 className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all border-0 text-white flex items-center" 
                 size="lg" 
                 onClick={handleSendForApproval}
                 disabled={sendingApproval}
               >
                 {sendingApproval ? (
                   <>
                     <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                   </>
                 ) : (
                   <>
                     <Send className="mr-2 h-5 w-5" /> Send For Approval
                   </>
                 )}
               </Button>
            </div>
            <div className="w-full max-w-md md:max-w-xl space-y-10 flex flex-col items-center pb-20">
              <div className="w-full space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Notepad View</span>
                <Card className="w-full aspect-[5.5/8.5] shadow-xl overflow-hidden rounded-sm border transition-all duration-300 relative bg-white flex items-center justify-center p-8 bg-no-repeat bg-center" style={{ backgroundImage: uploadedNotepad ? `url(${uploadedNotepad})` : 'none', backgroundSize: 'cover' }}>
                  {!uploadedNotepad && <div className="text-center text-muted-foreground"><Upload className="mx-auto h-8 w-8 mb-2 opacity-50" /><p>Upload a design to preview your notepad</p></div>}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* APPROVAL REQUEST SENT SUCCESS MODAL */}
      {approvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-background border border-border shadow-2xl overflow-hidden rounded-xl animate-in zoom-in-95 duration-200">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-blue-600"></div>
            <CardHeader className="text-center pt-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 mb-4 animate-bounce">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Approval Request Sent!</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                We have generated an approval request for your notepad design.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <div className="p-4 rounded-lg bg-muted/50 border border-border text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sent To Email:</span>
                  <span className="font-medium text-foreground">{approvalSentEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-amber-500 font-semibold flex items-center">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse mr-1.5"></span>
                    Pending Approval
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Please check your inbox at <span className="font-medium text-foreground">{approvalSentEmail}</span> to review and approve the design.
              </p>

              {/* Developer Testing Convenience Box */}
              {testApprovalUrl && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-left space-y-1.5">
                  <p className="font-bold text-blue-500">Developer Testing Help:</p>
                  <p className="text-muted-foreground">Since no SMTP server is configured, the email was printed to the files <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">server/email-log.txt</code> and <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">server/email-log.html</code>. You can copy the link below to open the approval page directly, or open the HTML log file in a web browser to view the email with the styled **Approve Design** button:</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={testApprovalUrl} 
                      className="w-full bg-muted border border-border text-foreground px-2 py-1 rounded text-[11px] font-mono outline-none"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-[11px] h-7 px-2 shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(testApprovalUrl);
                        alert('Approval URL copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border px-6 py-4 flex gap-3">
              {testApprovalUrl && (
                <Button 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium" 
                  onClick={() => {
                    setApprovalModalOpen(false);
                    window.open(testApprovalUrl, '_blank');
                  }}
                >
                  Go to Approval Page
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1 font-medium"
                onClick={() => setApprovalModalOpen(false)}
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
