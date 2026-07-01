import React, { useState, useRef, useEffect } from 'react';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useNavigate } from 'react-router-dom';
import { 
  Type, Palette, ShoppingCart, Upload, CheckCircle, Smartphone, Mail, Globe, MapPin,
  Linkedin, Instagram, Facebook, Twitter, Video, Image as ImageIcon,
  Shield, ArrowUp, ArrowDown, Eye, EyeOff, Loader2, Send
} from 'lucide-react';

interface CustomizePageProps {
  onMenuClick?: () => void;
  userRole?: string;
}

const productPresets = [
  { measurement: '8.5 x 11 (without watermark)', reams: '50 (500/ream)', inStock: '25000', ordered: '2500', balance: '22500', minQuantity: '1500', costPerReam: '250' },
  { measurement: '8.5 x 11 (with watermark)', reams: '25 (500/ream)', inStock: '12500', ordered: '500', balance: '12000', minQuantity: '1500', costPerReam: '350' },
  { measurement: '11 x 17 (without watermark)', reams: '50 (500/ream)', inStock: '25000', ordered: '2500', balance: '22500', minQuantity: '1500', costPerReam: '350' },
  { measurement: '11 x 17 (with watermark)', reams: '25 (500/ream)', inStock: '12500', ordered: '500', balance: '12000', minQuantity: '1500', costPerReam: '450' },
  { measurement: '12 x 18 (without watermark)', reams: '75 (500/ream)', inStock: '37500', ordered: '2500', balance: '35000', minQuantity: '2000', costPerReam: '350' },
  { measurement: '12 x 18 (with watermark)', reams: '25 (500/ream)', inStock: '12500', ordered: '500', balance: '12000', minQuantity: '1500', costPerReam: '450' },
  { measurement: '8.5 x 11 Ream of Paper', reams: '500 sheets/ream', inStock: '50', ordered: '5', balance: '45', minQuantity: '5', costPerReam: '225' },
  { measurement: '11 x 17 Ream of Paper', reams: '500 sheets/ream', inStock: '100', ordered: '10', balance: '90', minQuantity: '5', costPerReam: '325' },
  { measurement: '12 x 18 Ream of Paper', reams: '500 sheets/ream', inStock: '25', ordered: '8', balance: '17', minQuantity: '5', costPerReam: '375' },
];

export function CustomizePage({ onMenuClick, userRole }: CustomizePageProps) {
  // Current user custom card design details state
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [tagline, setTagline] = useState('Innovation Delivered');
  const [personName, setPersonName] = useState('John Doe');
  const [jobTitle, setJobTitle] = useState('Chief Creative Officer');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('john.doe@acme.com');
  const [website, setWebsite] = useState('www.acmecorp.com');
  const [address1, setAddress1] = useState('123 Innovation Drive');
  const [address2, setAddress2] = useState('Suite 100');
  const [address3, setAddress3] = useState('Silicon Valley, CA 94025');

  // Dynamic social media manager visible configuration state
  const [socialLinks, setSocialLinks] = useState([
    { id: 'linkedin', name: 'LinkedIn', visible: true, placeholder: 'linkedin.com/in/johndoe', value: 'linkedin.com/in/johndoe' },
    { id: 'instagram', name: 'Instagram', visible: true, placeholder: '@acmecorp', value: '@acmecorp' },
    { id: 'facebook', name: 'Facebook', visible: true, placeholder: 'facebook.com/acmecorp', value: 'facebook.com/acmecorp' },
    { id: 'twitter', name: 'X (Twitter)', visible: true, placeholder: '@acmecorp', value: '@acmecorp' },
    { id: 'tiktok', name: 'TikTok', visible: true, placeholder: '@acmecorp', value: '@acmecorp' }
  ]);

  // Admin Defaults state (separate from user's current card customizations)
  const [adminCompanyName, setAdminCompanyName] = useState('Acme Corporation');
  const [adminTagline, setAdminTagline] = useState('Innovation Delivered');
  const [adminPersonName, setAdminPersonName] = useState('John Doe');
  const [adminJobTitle, setAdminJobTitle] = useState('Chief Creative Officer');
  const [adminPhone, setAdminPhone] = useState('+1 (555) 123-4567');
  const [adminEmail, setAdminEmail] = useState('john.doe@acme.com');
  const [adminWebsite, setAdminWebsite] = useState('www.acmecorp.com');
  const [adminAddress1, setAdminAddress1] = useState('123 Innovation Drive');
  const [adminAddress2, setAdminAddress2] = useState('Suite 100');
  const [adminAddress3, setAdminAddress3] = useState('Silicon Valley, CA 94025');

  // Admin Product configuration defaults
  const [adminFinishedSize, setAdminFinishedSize] = useState('3.5" x 2"');
  const [adminColorOptions, setAdminColorOptions] = useState('Full Color Front & Back');
  const [adminPrintConfig, setAdminPrintConfig] = useState('Standard');
  const [adminSheetSize, setAdminSheetSize] = useState('8.5" x 11"');
  const [adminCardsPerSheet, setAdminCardsPerSheet] = useState('10');
  
  // Admin Checkout settings
  const [adminPaymentMethods, setAdminPaymentMethods] = useState<string[]>(['paypal', 'credit_card', 'cod', 'bank_transfer']);
  const [adminDeliveryOptions, setAdminDeliveryOptions] = useState<string[]>(['shipping', 'pickup']);
  
  // Design state
  const [primaryColor, setPrimaryColor] = useState('#10b981'); // Emerald Green
  const [secondaryColor, setSecondaryColor] = useState('#ffffff'); // White
  const [textColor, setTextColor] = useState('#1e293b'); // Dark Slate
  const [fontFamily, setFontFamily] = useState('inter');
  
  // Image states
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [frontBackground, setFrontBackground] = useState<string | null>(null);
  const [backBackground, setBackBackground] = useState<string | null>(null);

  // Product Configuration state
  const [measurement, setMeasurement] = useState(productPresets[0].measurement);
  const [reams, setReams] = useState(productPresets[0].reams);
  const [inStock, setInStock] = useState(productPresets[0].inStock);
  const [ordered, setOrdered] = useState(productPresets[0].ordered);
  const [balance, setBalance] = useState(productPresets[0].balance);
  const [minQuantity, setMinQuantity] = useState(productPresets[0].minQuantity);
  const [costPerReam, setCostPerReam] = useState(productPresets[0].costPerReam);
  
  // Card details state
  const [finishedSize, setFinishedSize] = useState('3.5" x 2"');
  const [colorOptions, setColorOptions] = useState('Full Color Front & Back');
  const [printConfig, setPrintConfig] = useState('Standard');
  const [sheetSize, setSheetSize] = useState('8.5" x 11"');
  const [cardsPerSheet, setCardsPerSheet] = useState('10');
  const [pricingOption, setPricingOption] = useState('100 cards - $350.00');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const frontBgInputRef = useRef<HTMLInputElement>(null);
  const backBgInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [savingAdminConfig, setSavingAdminConfig] = useState(false);
  const [sendingApproval, setSendingApproval] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalSentEmail, setApprovalSentEmail] = useState('');
  const [testApprovalUrl, setTestApprovalUrl] = useState('');

  // Fetch Admin custom configurations on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/v1/customize-config');
        const resData = await response.json();
        if (response.ok && resData.success) {
          const config = resData.data;

          // Apply saved defaults to current design fields
          setCompanyName(config.companyName || 'Acme Corporation');
          setTagline(config.tagline || 'Innovation Delivered');
          setPersonName(config.personName || 'John Doe');
          setJobTitle(config.jobTitle || 'Chief Creative Officer');
          setPhone(config.phone || '+1 (555) 123-4567');
          setEmail(config.email || 'john.doe@acme.com');
          setWebsite(config.website || 'www.acmecorp.com');
          setAddress1(config.address1 || '123 Innovation Drive');
          setAddress2(config.address2 || 'Suite 100');
          setAddress3(config.address3 || 'Silicon Valley, CA 94025');

          setFinishedSize(config.finishedSize || '3.5" x 2"');
          setColorOptions(config.colorOptions || 'Full Color Front & Back');
          setPrintConfig(config.printConfig || 'Standard');
          setSheetSize(config.sheetSize || '8.5" x 11"');
          setCardsPerSheet(config.cardsPerSheet || '10');

          // Prepopulate Admin config inputs
          setAdminCompanyName(config.companyName || 'Acme Corporation');
          setAdminTagline(config.tagline || 'Innovation Delivered');
          setAdminPersonName(config.personName || 'John Doe');
          setAdminJobTitle(config.jobTitle || 'Chief Creative Officer');
          setAdminPhone(config.phone || '+1 (555) 123-4567');
          setAdminEmail(config.email || 'john.doe@acme.com');
          setAdminWebsite(config.website || 'www.acmecorp.com');
          setAdminAddress1(config.address1 || '123 Innovation Drive');
          setAdminAddress2(config.address2 || 'Suite 100');
          setAdminAddress3(config.address3 || 'Silicon Valley, CA 94025');

          setAdminFinishedSize(config.finishedSize || '3.5" x 2"');
          setAdminColorOptions(config.colorOptions || 'Full Color Front & Back');
          setAdminPrintConfig(config.printConfig || 'Standard');
          setAdminSheetSize(config.sheetSize || '8.5" x 11"');
          setAdminCardsPerSheet(config.cardsPerSheet || '10');

          // Sync social links visible & order. Keep typed values from default placeholder if value undefined
          if (config.socialLinks) {
            setSocialLinks(config.socialLinks.map((link: any) => {
              const match = socialLinks.find(s => s.id === link.id);
              return {
                ...link,
                value: match ? match.value : link.placeholder
              };
            }));
          }

          if (config.checkoutSettings) {
            setAdminPaymentMethods(config.checkoutSettings.paymentMethods || ['paypal', 'credit_card', 'cod', 'bank_transfer']);
            setAdminDeliveryOptions(config.checkoutSettings.deliveryOptions || ['shipping', 'pickup']);
          }
        }
      } catch (err) {
        console.error('Failed to load card studio config defaults:', err);
      }
    };
    loadConfig();
  }, []);

  const handleMeasurementSelection = (value: string) => {
    setMeasurement(value);
    const preset = productPresets.find(p => p.measurement === value);
    if (preset) {
      setReams(preset.reams);
      setInStock(preset.inStock);
      setOrdered(preset.ordered);
      setBalance(preset.balance);
      setMinQuantity(preset.minQuantity);
      setCostPerReam(preset.costPerReam);
    }
  };

  const handleAction = (action: string) => {
    alert(`${action} successful!`);
    if (action === 'Added to cart') {
      navigate('/orders');
    }
  };

  const handleSendForApproval = async () => {
    setSendingApproval(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/customize-config/send-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          designDetails: {
            companyName,
            tagline,
            personName,
            jobTitle,
            phone,
            email,
            website,
            address1,
            address2,
            address3,
            primaryColor,
            secondaryColor,
            textColor,
            fontFamily,
            finishedSize,
            colorOptions,
            printConfig,
            sheetSize,
            cardsPerSheet,
            socialLinks,
            pricingOption
          }
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setApprovalSentEmail(resData.data.userEmail);
        setTestApprovalUrl(resData.approvalUrl || '');
        setApprovalModalOpen(true);
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

  const getFontFamily = () => {
    switch(fontFamily) {
      case 'serif': return 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
      case 'mono': return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
      default: return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    }
  };

  const handleSocialValueChange = (id: string, val: string) => {
    setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, value: val } : s));
  };

  const handleToggleVisibility = (id: string) => {
    setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSocialLinks(prev => {
      const arr = [...prev];
      const temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
      return arr;
    });
  };

  const handleMoveDown = (index: number) => {
    setSocialLinks(prev => {
      if (index === prev.length - 1) return prev;
      const arr = [...prev];
      const temp = arr[index];
      arr[index] = arr[index + 1];
      arr[index + 1] = temp;
      return arr;
    });
  };

  const handleSaveAdminConfig = async () => {
    setSavingAdminConfig(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/customize-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          personName: adminPersonName,
          jobTitle: adminJobTitle,
          phone: adminPhone,
          email: adminEmail,
          website: adminWebsite,
          address1: adminAddress1,
          address2: adminAddress2,
          address3: adminAddress3,
          companyName: adminCompanyName,
          tagline: adminTagline,
          finishedSize: adminFinishedSize,
          colorOptions: adminColorOptions,
          printConfig: adminPrintConfig,
          sheetSize: adminSheetSize,
          cardsPerSheet: adminCardsPerSheet,
          socialLinks: socialLinks.map(({ id, name, visible, placeholder }) => ({ id, name, visible, placeholder })),
          checkoutSettings: {
            paymentMethods: adminPaymentMethods,
            deliveryOptions: adminDeliveryOptions
          }
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Admin default configuration saved successfully!');
        // Update user card values to reflect updated defaults
        setCompanyName(adminCompanyName);
        setTagline(adminTagline);
        setPersonName(adminPersonName);
        setJobTitle(adminJobTitle);
        setPhone(adminPhone);
        setEmail(adminEmail);
        setWebsite(adminWebsite);
        setAddress1(adminAddress1);
        setAddress2(adminAddress2);
        setAddress3(adminAddress3);
        setFinishedSize(adminFinishedSize);
        setColorOptions(adminColorOptions);
        setPrintConfig(adminPrintConfig);
        setSheetSize(adminSheetSize);
        setCardsPerSheet(adminCardsPerSheet);
      } else {
        alert(data.error || 'Failed to save admin configuration.');
      }
    } catch (err) {
      console.error('Error saving config:', err);
      alert('Error connecting to backend database.');
    } finally {
      setSavingAdminConfig(false);
    }
  };

  const getSocialIcon = (id: string) => {
    switch (id) {
      case 'linkedin': return Linkedin;
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'tiktok': return Video;
      default: return Globe;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AppHeader onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col lg:flex-row">
          
          {/* LEFT PANEL: Editor */}
          <div className="flex-1 w-full lg:max-w-md xl:max-w-lg border-r border-border bg-background overflow-y-auto p-4 md:p-6 shadow-sm z-10">
            <div className="mb-6">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500">Card Studio</h1>
              <p className="text-sm text-muted-foreground mt-1">Edit details, upload custom backgrounds, and watch the live preview.</p>
            </div>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className={`grid w-full mb-6 h-auto p-1 bg-muted/50 rounded-lg ${userRole === 'super_user' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <TabsTrigger value="content" className="gap-2 rounded-md py-2 data-[state=active]:shadow-sm">
                  <Type className="h-4 w-4" /> Content & Images
                </TabsTrigger>
                <TabsTrigger value="style" className="gap-2 rounded-md py-2 data-[state=active]:shadow-sm">
                  <Palette className="h-4 w-4" /> Style
                </TabsTrigger>
                {userRole === 'super_user' && (
                  <TabsTrigger value="admin" className="gap-2 rounded-md py-2 data-[state=active]:shadow-sm text-yellow-600 dark:text-yellow-500">
                    <Shield className="h-4 w-4" /> Admin Controls
                  </TabsTrigger>
                )}
              </TabsList>

              {/* CONTENT SUMMARY TAB */}
              <TabsContent value="content" className="space-y-6 pb-20">
                <div className="space-y-4">
                  <h3 className="font-semibold text-emerald-600 uppercase tracking-wider text-xs border-b pb-2">Front Side Details</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Front Background</Label>
                      <input 
                        type="file" ref={backBgInputRef} className="hidden" accept="image/*"
                        onChange={(e) => { if (e.target.files?.[0]) setBackBackground(URL.createObjectURL(e.target.files[0])); }}
                      />
                      <Button variant="outline" className="w-full justify-start mt-1 text-xs border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100" onClick={() => backBgInputRef.current?.click()}>
                        <ImageIcon className="mr-2 h-4 w-4" /> {backBackground ? "Change Front BG" : "Upload Front BG"}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="personName">Full Name</Label>
                        <Input id="personName" value={personName} onChange={e => setPersonName(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                    </div>

                    {/* Social links visible filtered based on Admin config */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed">
                      {socialLinks.filter(s => s.visible).map((link) => (
                        <div key={link.id} className="space-y-1.5">
                          <Label htmlFor={link.id}>{link.name}</Label>
                          <Input 
                            id={link.id} 
                            placeholder={link.placeholder}
                            value={link.value || ''} 
                            onChange={e => handleSocialValueChange(link.id, e.target.value)} 
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed">
                      <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 pt-2">
                       <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Physical Addresses</Label>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="address1">Address 1</Label>
                      <Input id="address1" value={address1} onChange={e => setAddress1(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="address2">Address 2</Label>
                      <Input id="address2" value={address2} onChange={e => setAddress2(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="address3">Address 3</Label>
                      <Input id="address3" value={address3} onChange={e => setAddress3(e.target.value)} />
                    </div>
                  </div>

                  <h3 className="font-semibold text-emerald-600 uppercase tracking-wider text-xs border-b pb-2 mt-8">Back Side Identity</h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Upload Logo</Label>
                        <input 
                          type="file" ref={fileInputRef} className="hidden" accept="image/*"
                          onChange={(e) => { if (e.target.files?.[0]) setUploadedLogo(URL.createObjectURL(e.target.files[0])); }}
                        />
                        <Button variant="outline" className="w-full justify-start mt-1 text-xs" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="mr-2 h-4 w-4" /> {uploadedLogo ? "Change Logo" : "Upload Logo"}
                        </Button>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Full Back Background</Label>
                        <input 
                          type="file" ref={frontBgInputRef} className="hidden" accept="image/*"
                          onChange={(e) => { if (e.target.files?.[0]) setFrontBackground(URL.createObjectURL(e.target.files[0])); }}
                        />
                        <Button variant="outline" className="w-full justify-start mt-1 text-xs border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" onClick={() => frontBgInputRef.current?.click()}>
                          <ImageIcon className="mr-2 h-4 w-4" /> {frontBackground ? "Change Back BG" : "Upload Back BG"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <Label htmlFor="companyName">Company Name (Overlay)</Label>
                      <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="tagline">Tagline (Overlay)</Label>
                      <Input id="tagline" value={tagline} onChange={e => setTagline(e.target.value)} />
                    </div>
                  </div>

                  <h3 className="font-semibold text-emerald-600 uppercase tracking-wider text-xs border-b pb-2 mt-8">Product Configuration</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="finishedSize">Finished Size</Label>
                        <Input id="finishedSize" value={finishedSize} onChange={e => setFinishedSize(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="colorOptions">Color Options</Label>
                        <Input id="colorOptions" value={colorOptions} onChange={e => setColorOptions(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="printConfig">Print Configuration</Label>
                        <Input id="printConfig" value={printConfig} onChange={e => setPrintConfig(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="sheetSize">Sheet Size</Label>
                        <Input id="sheetSize" value={sheetSize} onChange={e => setSheetSize(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cardsPerSheet">Cards Per Sheet</Label>
                        <Input id="cardsPerSheet" type="number" value={cardsPerSheet} onChange={e => setCardsPerSheet(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="inStockTop">Quantity in Stock</Label>
                        <Input id="inStockTop" type="number" value={inStock} readOnly className="bg-muted/50 cursor-not-allowed" />
                      </div>
                      
                      <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="pricingOption">Description short box (Price)</Label>
                        <Select value={pricingOption} onValueChange={setPricingOption}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select quantity and price" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100 cards - $350.00">100 cards - $350.00</SelectItem>
                            <SelectItem value="250 cards - $325.00">250 cards - $325.00</SelectItem>
                            <SelectItem value="500 cards - $250.00">500 cards - $250.00</SelectItem>
                            <SelectItem value="1000 cards - $225.00">1000 cards - $225.00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* STYLE TAB */}
              <TabsContent value="style" className="space-y-6 pb-20">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Font Theme</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                       <Button variant={fontFamily === 'sans' ? 'default' : 'outline'} size="sm" onClick={() => setFontFamily('sans')} className="font-sans">Modern</Button>
                       <Button variant={fontFamily === 'serif' ? 'default' : 'outline'} size="sm" onClick={() => setFontFamily('serif')} className="font-serif">Classic</Button>
                       <Button variant={fontFamily === 'mono' ? 'default' : 'outline'} size="sm" onClick={() => setFontFamily('mono')} className="font-mono">Tech</Button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Brand Colors (Only works if no BG uploaded)</Label>
                    <div className="flex items-center gap-4">
                      <div className="space-y-1.5 w-full">
                        <Label htmlFor="c-primary" className="text-xs">Primary Accent</Label>
                        <div className="flex gap-2">
                          <Input id="c-primary" type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-12 h-10 p-1" />
                          <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="flex-1 uppercase font-mono text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5 w-full">
                        <Label htmlFor="c-secondary" className="text-xs">Background</Label>
                        <div className="flex gap-2">
                          <Input id="c-secondary" type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-12 h-10 p-1" />
                          <Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="flex-1 uppercase font-mono text-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 w-full pt-2">
                        <Label htmlFor="c-text" className="text-xs">Text Color</Label>
                        <div className="flex gap-2 w-1/2 pr-2">
                          <Input id="c-text" type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-12 h-10 p-1" />
                          <Input value={textColor} onChange={e => setTextColor(e.target.value)} className="flex-1 uppercase font-mono text-sm" />
                        </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ADMIN DEFAULTS TAB */}
              {userRole === 'super_user' && (
                <TabsContent value="admin" className="space-y-6 pb-20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 text-sm flex items-center">
                        <Shield className="h-4 w-4 mr-2" /> Design System Defaults
                      </h3>
                      <Button 
                        size="sm" 
                        onClick={handleSaveAdminConfig} 
                        disabled={savingAdminConfig}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        {savingAdminConfig ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Save Defaults'}
                      </Button>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Front Side Details</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Full Name</Label>
                          <Input value={adminPersonName} onChange={e => setAdminPersonName(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Job Title</Label>
                          <Input value={adminJobTitle} onChange={e => setAdminJobTitle(e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Phone</Label>
                          <Input value={adminPhone} onChange={e => setAdminPhone(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Email</Label>
                          <Input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Website</Label>
                        <Input value={adminWebsite} onChange={e => setAdminWebsite(e.target.value)} />
                      </div>
                      <div className="space-y-1 pt-1">
                        <Label className="text-xs">Address Line 1</Label>
                        <Input value={adminAddress1} onChange={e => setAdminAddress1(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Address Line 2</Label>
                        <Input value={adminAddress2} onChange={e => setAdminAddress2(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Address Line 3</Label>
                        <Input value={adminAddress3} onChange={e => setAdminAddress3(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Back Side Details</Label>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Company Name</Label>
                        <Input value={adminCompanyName} onChange={e => setAdminCompanyName(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Tagline</Label>
                        <Input value={adminTagline} onChange={e => setAdminTagline(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Product Configuration</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Finished Size</Label>
                          <Input value={adminFinishedSize} onChange={e => setAdminFinishedSize(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Color Options</Label>
                          <Input value={adminColorOptions} onChange={e => setAdminColorOptions(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Print Config</Label>
                          <Input value={adminPrintConfig} onChange={e => setAdminPrintConfig(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Sheet Size</Label>
                          <Input value={adminSheetSize} onChange={e => setAdminSheetSize(e.target.value)} />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <Label className="text-xs">Cards Per Sheet</Label>
                          <Input type="number" value={adminCardsPerSheet} onChange={e => setAdminCardsPerSheet(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Social Links Visibility & Reordering</Label>
                      <div className="space-y-2 border rounded-md p-3 bg-muted/30">
                        {socialLinks.map((link, idx) => (
                          <div key={link.id} className="flex items-center justify-between border-b last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-muted-foreground w-4">{idx + 1}.</span>
                              <span className="text-sm font-medium">{link.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Show/Hide visibility controls */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-8 w-8 p-0 ${link.visible ? 'text-emerald-600' : 'text-slate-400'}`}
                                onClick={() => handleToggleVisibility(link.id)}
                                title={link.visible ? 'Visible (Click to Hide)' : 'Hidden (Click to Show)'}
                              >
                                {link.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>

                              {/* Up arrow to reorder */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleMoveUp(idx)}
                                disabled={idx === 0}
                                title="Move Up"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>

                              {/* Down arrow to reorder */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleMoveDown(idx)}
                                disabled={idx === socialLinks.length - 1}
                                title="Move Down"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Checkout Configuration</Label>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Available Payment Methods</Label>
                        <div className="flex flex-wrap gap-4">
                          {['paypal', 'credit_card', 'cod', 'bank_transfer'].map(method => (
                            <label key={method} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={adminPaymentMethods.includes(method)}
                                onChange={(e) => {
                                  if (e.target.checked) setAdminPaymentMethods([...adminPaymentMethods, method]);
                                  else setAdminPaymentMethods(adminPaymentMethods.filter(m => m !== method));
                                }}
                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                              />
                              <span className="text-foreground">{method === 'paypal' ? 'PayPal' : method === 'credit_card' ? 'Credit Card' : method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label className="text-sm font-medium">Available Delivery Options</Label>
                        <div className="flex flex-wrap gap-4">
                          {['shipping', 'pickup'].map(option => (
                            <label key={option} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={adminDeliveryOptions.includes(option)}
                                onChange={(e) => {
                                  if (e.target.checked) setAdminDeliveryOptions([...adminDeliveryOptions, option]);
                                  else setAdminDeliveryOptions(adminDeliveryOptions.filter(o => o !== option));
                                }}
                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                              />
                              <span className="text-foreground">{option === 'shipping' ? 'Shipping (Delivery)' : 'Store Pickup'}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* RIGHT PANEL: Live Preview & Checkout */}
          <div className="flex-1 lg:flex-[1.5] bg-muted/30 p-4 md:p-8 overflow-y-auto relative flex flex-col items-center">
            
            <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
               <div>
                  <h2 className="font-semibold text-lg flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-emerald-500"/> Print Preview</h2>
               </div>
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

            {/* CARDS CONTAINER */}
            <div className="w-full max-w-2xl space-y-10 flex flex-col items-center pb-20">
              
              {/* FRONT OF CARD */}
              <div className="w-full space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Front Side</span>
                <Card className="w-full aspect-[3.5/2] shadow-xl overflow-hidden rounded-md border transition-all duration-300 relative bg-no-repeat bg-center"
                      style={{ 
                        backgroundColor: backBackground ? 'transparent' : secondaryColor,
                        backgroundImage: backBackground ? `url(${backBackground})` : 'none',
                        backgroundSize: 'cover',
                        fontFamily: getFontFamily(), 
                        color: textColor,
                        borderColor: backBackground ? 'transparent' : 'rgba(0,0,0,0.05)'
                      }}>
                  
                  {/* Left accent strip (only if no custom background) */}
                  {!backBackground && (
                    <div className="absolute top-0 bottom-0 left-0 w-3 md:w-4" style={{ backgroundColor: primaryColor }}></div>
                  )}

                  {/* Backdrop Wrapper to Ensure Readability over Backgrounds */}
                  <div className={`h-full flex flex-col justify-center pl-10 pr-8 py-6 ${backBackground ? 'bg-white/80 backdrop-blur-[2px]' : ''}`}>
                    
                    {/* Top Section: Person details */}
                    <div className="mb-6 border-b pb-4" style={{ borderBottomColor: `${textColor}20` }}>
                      <h3 className="text-2xl md:text-3xl font-bold leading-none mb-1">{personName || 'Your Name'}</h3>
                      <p className="text-sm font-medium opacity-80 tracking-widest" style={{ color: primaryColor }}>{jobTitle || 'Your Title'}</p>
                    </div>

                    {/* Bottom Section: Contact details */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs md:text-sm font-medium">
                      {phone && (
                        <div className="flex items-center gap-2">
                           <Smartphone className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                           <span className="opacity-90 truncate">{phone}</span>
                        </div>
                      )}
                      {email && (
                        <div className="flex items-center gap-2">
                           <Mail className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                           <span className="opacity-90 truncate">{email}</span>
                        </div>
                      )}
                      
                      {/* Social links visible filtered based on Admin config, rendered in Custom order */}
                      {socialLinks
                        .filter(link => link.visible && link.value)
                        .map(link => {
                          const IconComponent = getSocialIcon(link.id);
                          return (
                            <div key={link.id} className="flex items-center gap-2">
                               <IconComponent className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                               <span className="opacity-90 truncate">{link.value}</span>
                            </div>
                          );
                        })
                      }

                      {website && (
                        <div className="flex items-center gap-2">
                           <Globe className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                           <span className="opacity-90 truncate">{website}</span>
                        </div>
                      )}
                      
                      {(address1 || address2 || address3) && (
                        <div className="flex items-start gap-2 col-span-2 mt-1">
                           <MapPin className="h-4 w-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                           <div className="flex flex-col opacity-90 leading-tight">
                             {address1 && <span>{address1}</span>}
                             {address2 && <span>{address2}</span>}
                             {address3 && <span>{address3}</span>}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* BACK OF CARD */}
              <div className="w-full space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Back Side</span>
                <Card className="w-full aspect-[3.5/2] shadow-xl overflow-hidden rounded-md border-0 transition-all duration-300 relative group flex items-center justify-center p-8 bg-no-repeat bg-center"
                      style={{ 
                        backgroundColor: frontBackground ? 'transparent' : primaryColor, 
                        backgroundImage: frontBackground ? `url(${frontBackground})` : 'none',
                        backgroundSize: 'cover',
                        fontFamily: getFontFamily() 
                      }}>
                  
                  {/* Pattern overlay (only visible if no custom bg) */}
                  {!frontBackground && (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
                  )}
                  
                  {/* Overlay Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {uploadedLogo && (
                       <img src={uploadedLogo} alt="Logo" className="h-16 object-contain mb-4 filter drop-shadow-md" />
                    )}
                    {(companyName || tagline) && (
                      <div className="p-3 bg-black/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm mt-2">
                        {companyName && <h2 className="text-3xl md:text-3xl font-bold tracking-tight mb-0.5" style={{ color: secondaryColor }}>{companyName}</h2>}
                        {tagline && <p className="text-xs md:text-sm tracking-widest opacity-90 font-medium" style={{ color: secondaryColor }}>{tagline}</p>}
                      </div>
                    )}
                  </div>
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
                We have generated an approval request for your card design.
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