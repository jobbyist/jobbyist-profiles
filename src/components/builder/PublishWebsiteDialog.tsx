import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Loader2 } from "lucide-react";

interface PublishWebsiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
  resumeData: {
    personalInfo: {
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
      title?: string;
      summary?: string;
    };
    experiences: Experience[];
    education: Education[];
    skills: string[];
    templateId: string;
  };
}

interface Experience {
  id: string;
  position: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  year?: string;
}

export const PublishWebsiteDialog = ({ 
  open, 
  onOpenChange, 
  resumeId,
  resumeData 
}: PublishWebsiteDialogProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"domain" | "publishing">("domain");
  const [domainName, setDomainName] = useState("");
  const [domainExtension, setDomainExtension] = useState(".me");
  const [isChecking, setIsChecking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);

  const checkDomainAvailability = async () => {
    if (!domainName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    setDomainAvailable(null);

    try {
      const fullDomain = `${domainName}${domainExtension}`;
      
      // Call Supabase function to check domain availability via Name.com API
      const { data, error } = await supabase.functions.invoke('check-domain', {
        body: { domain: fullDomain }
      });

      if (error) throw error;

      setDomainAvailable(data.available);
      
      if (data.available) {
        toast({
          title: "Domain Available!",
          description: `${fullDomain} is available for registration.`,
        });
      } else {
        toast({
          title: "Domain Unavailable",
          description: `${fullDomain} is already taken. Try another name.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check domain availability';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handlePublish = async () => {
    if (!domainAvailable) {
      toast({
        title: "Error",
        description: "Please check domain availability first",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);

    try {
      const fullDomain = `${domainName}${domainExtension}`;

      // Call Supabase function to register domain and publish website
      const { data, error } = await supabase.functions.invoke('publish-website', {
        body: {
          resumeId,
          domain: fullDomain,
          resumeData
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Your resume is now published at ${fullDomain}`,
      });

      // Update resume with published URL
      await supabase
        .from("resumes")
        .update({ 
          published_url: fullDomain,
          published_at: new Date().toISOString()
        })
        .eq("id", resumeId);

      onOpenChange(false);
      setStep("domain");
      setDomainName("");
      setDomainAvailable(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish website';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Publish Your Resume Website
          </DialogTitle>
          <DialogDescription>
            Register a domain and publish your resume as a professional website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Choose Your Domain</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="yourname"
                  value={domainName}
                  onChange={(e) => {
                    setDomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    setDomainAvailable(null);
                  }}
                  className="flex-1"
                />
                <RadioGroup
                  value={domainExtension}
                  onValueChange={(value) => {
                    setDomainExtension(value);
                    setDomainAvailable(null);
                  }}
                  className="flex gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value=".me" id="me" />
                    <Label htmlFor="me" className="cursor-pointer">.me</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value=".cv" id="cv" />
                    <Label htmlFor="cv" className="cursor-pointer">.cv</Label>
                  </div>
                </RadioGroup>
              </div>
              {domainName && (
                <p className="text-sm text-muted-foreground">
                  Your domain: <span className="font-semibold">{domainName}{domainExtension}</span>
                </p>
              )}
            </div>

            <Button 
              onClick={checkDomainAvailability} 
              disabled={isChecking || !domainName.trim()}
              variant="outline"
              className="w-full"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Availability"
              )}
            </Button>

            {domainAvailable !== null && (
              <div className={`p-4 rounded-lg ${domainAvailable ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                <p className={`text-sm font-medium ${domainAvailable ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                  {domainAvailable 
                    ? `✓ ${domainName}${domainExtension} is available!`
                    : `✗ ${domainName}${domainExtension} is taken. Try another name.`
                  }
                </p>
              </div>
            )}
          </div>

          {domainAvailable && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <h4 className="font-semibold">What's Included:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Domain registration for 1 year</li>
                  <li>• Professional resume website</li>
                  <li>• SSL certificate (HTTPS)</li>
                  <li>• Easy updates anytime</li>
                </ul>
              </div>

              <Button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Website"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
