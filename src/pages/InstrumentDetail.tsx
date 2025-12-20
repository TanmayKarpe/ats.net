import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { instruments as staticInstruments } from '@/data/instruments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, ChevronDown, Mail, Phone, Info } from 'lucide-react';
import { buildGmailUrl } from '@/lib/email';

export default function InstrumentDetailPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(true);
  
  // Booking form state
  const [userCategory, setUserCategory] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [purpose, setPurpose] = useState('');
  const [sampleDetails, setSampleDetails] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [row, setRow] = useState<any | null>(null);
  const { code } = useParams();

  const imageByName = useMemo(() => {
    const map = new Map<string, string | undefined>();
    staticInstruments.forEach((it) => {
      if (it.name) map.set(it.name.toLowerCase(), it.image);
      if (it.id) map.set(it.id.toLowerCase(), it.image);
    });
    return map;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!code) {
        setError('Instrument not found');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('instruments')
          .select('*')
          .eq('code', code)
          .maybeSingle();
        if (error) throw error;
        if (!cancelled) setRow(data || null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load instrument');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true };
  }, [code]);

  if (loading) return <div className="container py-12 text-muted-foreground">Loading…</div>;
  
  if (error || !row) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Instrument Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "The instrument you're looking for could not be found in our database."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/instruments">
              <Button variant="outline">Browse Instruments</Button>
            </Link>
            <Link to="/contact">
              <Button>Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from Supabase row
  const name: string = row?.name || String(code);
  const manufacturer: string = row?.make || row?.manufacturer || '';
  const modelNumber: string = row?.model || '';
  const overview: string = row?.description || '';
  const contactName: string = row?.contact_name || '';
  const contactEmail: string = row?.contact_email || row?.coordinator_email || 'ats@nmu.ac.in';
  const contactPhone: string = row?.contact_phone || '';
  const priceInternal = row?.price_internal || null;
  const priceExternal = row?.price_external || null;
  const priceIndustry = row?.price_industry || null;
  const image = imageByName.get((name || code || '').toLowerCase());
  
  // Parse applications (array or text)
  let applications: string[] = [];
  if (row?.applications) {
    if (Array.isArray(row.applications)) {
      applications = row.applications;
    } else if (typeof row.applications === 'string') {
      applications = row.applications.split('\n').filter(Boolean);
    }
  } else if (row?.metadata?.applications && Array.isArray(row.metadata.applications)) {
    applications = row.metadata.applications;
  }

  // Parse sample requirements
  let sampleRequirements: string = '';
  if (row?.sample_requirements) {
    if (typeof row.sample_requirements === 'string') {
      sampleRequirements = row.sample_requirements;
    } else if (Array.isArray(row.sample_requirements)) {
      sampleRequirements = row.sample_requirements.join('. ');
    }
  } else if (row?.sample) {
    sampleRequirements = typeof row.sample === 'string' ? row.sample : '';
  }

  // Parse technical specs as key-value pairs
  let technicalSpecs: Record<string, string> = {};
  if (row?.specifications) {
    if (typeof row.specifications === 'object' && !Array.isArray(row.specifications)) {
      technicalSpecs = row.specifications;
    } else if (typeof row.specifications === 'string') {
      // Try to parse structured specs from text
      const lines = row.specifications.split('\n').filter(Boolean);
      lines.forEach((line: string) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          technicalSpecs[key] = value;
        }
      });
    }
  }
  
  // Always include manufacturer and model in specs
  if (manufacturer) technicalSpecs['Manufacturer'] = manufacturer;
  if (modelNumber) technicalSpecs['Model'] = modelNumber;

  // Category-specific guidelines
  const categoryGuidelines: Record<string, string[]> = {
    'KBCNMU (Internal Users)': [
      'Request must be submitted through the department',
      'Signed approval from Guide / HoD required',
      'Clear purpose of analysis must be stated'
    ],
    'External Academic Institutions': [
      'Official institutional request required',
      'Signed by supervisor or authorized authority',
      'Sample details must be clearly specified'
    ],
    'Industry / Corporate': [
      'Official request on company letterhead required',
      'Authorized signatory mandatory',
      'Scope of analysis must be clearly defined'
    ]
  };

  // Reset form fields when category changes
  const handleCategoryChange = (value: string) => {
    setUserCategory(value);
    setFullName('');
    setUserEmail('');
    setUserPhone('');
    setInstitution('');
    setPurpose('');
    setSampleDetails('');
    setBookingError(null);
  };

  const handleBooking = () => {
    setBookingError(null);
    
    // Validation
    if (!userCategory) return setBookingError('Please select your user category');
    if (!fullName.trim()) return setBookingError('Full name is required');
    if (!userEmail.trim()) return setBookingError('Email is required');
    if (!userPhone.trim()) return setBookingError('Phone number is required');
    if (!institution.trim()) return setBookingError('Institution / Company name is required');
    if (!purpose.trim()) return setBookingError('Purpose of analysis is required');
    if (!sampleDetails.trim()) return setBookingError('Sample details are required');
    
    const coordinatorEmail = 'bhushan.food@gmail.com'; // ATS Coordinator
    const subject = `Booking Request – ${userCategory} – ${name}`;
    
    const body = `Request Category:
${userCategory}

Instrument Requested:
${name}

Requester Details:
Name: ${fullName}
Institution / Company: ${institution}
Email: ${userEmail}
Phone: ${userPhone}

Purpose of Analysis:
${purpose}

Sample Details:
${sampleDetails}

Mandatory Documents to be Attached:
- Official request letter as per category
- Authorized signature
- Any supporting documents

---
This request was generated through the ATS website.`;
    
    // Generate mailto link with both recipient and CC
    const gmailUrl = buildGmailUrl({
      to: contactEmail,
      cc: coordinatorEmail,
      subject,
      body,
    });
    setIsBookingOpen(false);
    
    // Reset form after submission
    setUserCategory('');
    setFullName('');
    setUserEmail('');
    setUserPhone('');
    setInstitution('');
    setPurpose('');
    setSampleDetails('');
    
    window.open(gmailUrl, '_blank', 'noopener');
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link to="/instruments" className="text-sm text-muted-foreground hover:text-foreground underline">
          ← Back to instruments
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* LEFT COLUMN: Image & Core Info */}
        <div className="space-y-6">
          {/* Instrument Image */}
          <div className="rounded-lg overflow-hidden bg-muted">
            {image ? (
              <img src={image} alt={name} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Instrument Name */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{name}</h1>
            {manufacturer && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Manufacturer:</span> {manufacturer}
              </p>
            )}
            {modelNumber && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Model:</span> {modelNumber}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Stacked Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-xl font-bold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {overview || 'Details available on request.'}
            </p>
          </section>

          {/* Applications */}
          <section>
            <h2 className="text-xl font-bold mb-3">Applications</h2>
            {applications.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {applications.map((app, i) => (
                  <li key={i}>{app}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Details available on request.</p>
            )}
          </section>

          {/* Sample Requirements */}
          <section>
            <h2 className="text-xl font-bold mb-3">Sample Requirements</h2>
            <p className="text-muted-foreground leading-relaxed">
              {sampleRequirements || 'Details available on request.'}
            </p>
          </section>

          {/* Technical Specifications (Collapsible, Expanded by Default) */}
          <section>
            <Collapsible open={specsOpen} onOpenChange={setSpecsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full group">
                <h2 className="text-xl font-bold">Technical Specifications</h2>
                <ChevronDown className={`h-5 w-5 transition-transform ${specsOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                {Object.keys(technicalSpecs).length > 0 ? (
                  <div className="border rounded-lg divide-y">
                    {Object.entries(technicalSpecs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[140px_1fr] gap-4 p-3">
                        <span className="font-medium text-sm">{key}</span>
                        <span className="text-sm text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Details available on request.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </section>

          {/* Pricing (3 Equal Cards) */}
          <section>
            <h2 className="text-xl font-bold mb-3">Pricing</h2>
            <p className="text-sm text-muted-foreground mb-4">Indicative rates (subject to change)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    KBCNMU Students / Faculty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {priceInternal || 'Contact for details'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Other Academic Institutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {priceExternal || 'Contact for details'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Industry / Corporate (GST incl.)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {priceIndustry || 'Contact for details'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact / Booking */}
          <section>
            <h2 className="text-xl font-bold mb-3">Contact / Booking</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {contactName && (
                    <div>
                      <p className="text-sm font-medium">Contact Person</p>
                      <p className="text-muted-foreground">{contactName}</p>
                    </div>
                  )}
                  {contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={buildGmailUrl({
                          to: contactEmail,
                          cc: 'bhushan.food@gmail.com',
                          subject: `Instrument Contact – ${name}`,
                          body: ''
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  )}
                  {contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${contactPhone}`} className="text-primary hover:underline">
                        {contactPhone}
                      </a>
                    </div>
                  )}
                  <div className="pt-2">
                    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">Book this instrument</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Book {name}</DialogTitle>
                          <DialogDescription>
                            Select your category and provide required details. A Gmail draft will be generated.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* User Category Selection (MANDATORY) */}
                          <div>
                            <Label htmlFor="userCategory" className="text-base font-semibold">
                              User Category <span className="text-destructive">*</span>
                            </Label>
                            <Select value={userCategory} onValueChange={handleCategoryChange}>
                              <SelectTrigger id="userCategory" className="mt-2">
                                <SelectValue placeholder="Select your category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="KBCNMU (Internal Users)">KBCNMU (Internal Users)</SelectItem>
                                <SelectItem value="External Academic Institutions">External Academic Institutions</SelectItem>
                                <SelectItem value="Industry / Corporate">Industry / Corporate</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Category-Specific Guidelines */}
                          {userCategory && categoryGuidelines[userCategory] && (
                            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                              <div className="flex items-start gap-2">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                  <h4 className="font-semibold text-blue-900 mb-2">Mandatory Requirements</h4>
                                  <ul className="space-y-1 text-sm text-blue-800">
                                    {categoryGuidelines[userCategory].map((guideline, i) => (
                                      <li key={i} className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>{guideline}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Booking Form Fields (disabled until category selected) */}
                          <div className={!userCategory ? 'opacity-50 pointer-events-none' : ''}>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                                <Input
                                  id="fullName"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  placeholder="Your full name"
                                  disabled={!userCategory}
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="userEmail">Email <span className="text-destructive">*</span></Label>
                                  <Input
                                    id="userEmail"
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    disabled={!userCategory}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="userPhone">Phone <span className="text-destructive">*</span></Label>
                                  <Input
                                    id="userPhone"
                                    type="tel"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    placeholder="+91 XXXXXXXXXX"
                                    disabled={!userCategory}
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="institution">
                                  Institution / Company Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="institution"
                                  value={institution}
                                  onChange={(e) => setInstitution(e.target.value)}
                                  placeholder="e.g., KBCNMU or ABC Research Institute"
                                  disabled={!userCategory}
                                  required
                                />
                              </div>

                              <div>
                                <Label htmlFor="instrumentName">Instrument Name</Label>
                                <Input
                                  id="instrumentName"
                                  value={name}
                                  readOnly
                                  disabled
                                  className="bg-muted"
                                />
                              </div>

                              <div>
                                <Label htmlFor="purpose">
                                  Purpose of Analysis <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                  id="purpose"
                                  value={purpose}
                                  onChange={(e) => setPurpose(e.target.value)}
                                  placeholder="Clearly describe the purpose and expected outcomes"
                                  rows={3}
                                  disabled={!userCategory}
                                  required
                                />
                              </div>

                              <div>
                                <Label htmlFor="sampleDetails">
                                  Sample Details <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                  id="sampleDetails"
                                  value={sampleDetails}
                                  onChange={(e) => setSampleDetails(e.target.value)}
                                  placeholder="Sample type, quantity, preparation method, etc."
                                  rows={3}
                                  disabled={!userCategory}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {bookingError && (
                            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                              <p className="text-sm text-destructive font-medium">{bookingError}</p>
                            </div>
                          )}
                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                          </DialogClose>
                          <Button 
                            onClick={handleBooking}
                            disabled={!userCategory}
                          >
                            Generate Email Draft
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
