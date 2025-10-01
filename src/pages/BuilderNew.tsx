import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonalInfoForm } from "@/components/builder/PersonalInfoForm";
import { ExperienceForm, Experience } from "@/components/builder/ExperienceForm";
import { EducationForm, Education } from "@/components/builder/EducationForm";
import { SkillsForm } from "@/components/builder/SkillsForm";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { PublishWebsiteDialog } from "@/components/builder/PublishWebsiteDialog";
import { Download, Home, Save, CheckCircle, ChevronDown } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Builder = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("Untitled Resume");
  const [templateId, setTemplateId] = useState("modern");
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: ""
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id && user) {
      loadResume();
    } else if (user) {
      setLoading(false);
    }
  }, [id, user]);

  const loadResume = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setTitle(data.title);
      setTemplateId(data.template_id);
      setPersonalInfo(data.personal_info as any);
      setExperiences((data.experiences as unknown) as Experience[]);
      setEducation((data.education as unknown) as Education[]);
      setSkills(data.skills);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load resume",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!user || !id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("resumes")
        .update({
          title,
          template_id: templateId,
          personal_info: personalInfo as any,
          experiences: experiences as any,
          education: education as any,
          skills
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your resume has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAIAssist = async (experienceId: string) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    if (!experience) return;

    try {
      toast({
        title: "Generating...",
        description: "AI is creating professional content for you.",
      });

      const { data, error } = await supabase.functions.invoke('ai-assist', {
        body: {
          type: 'experience',
          data: {
            position: experience.position,
            company: experience.company,
            description: experience.description
          }
        }
      });

      if (error) throw error;

      setExperiences(experiences.map(exp =>
        exp.id === experienceId
          ? { ...exp, description: data.content }
          : exp
      ));

      toast({
        title: "Success!",
        description: "AI content has been generated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate AI content",
        variant: "destructive"
      });
    }
  };

  const exportToPDF = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your resume.",
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${personalInfo.fullName || "resume"}.pdf`);

      toast({
        title: "Success!",
        description: "Your resume has been downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePublishWebsite = () => {
    setShowPublishDialog(true);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                <Label htmlFor="resume-title">Title:</Label>
                <Input
                  id="resume-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-48"
                />
              </div>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={saveResume} disabled={saving} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finish
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportToPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download as a PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePublishWebsite}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Publish as a website
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6 sticky top-24">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <PersonalInfoForm data={personalInfo} onChange={updatePersonalInfo} />
                </TabsContent>

                <TabsContent value="experience" className="mt-6">
                  <ExperienceForm 
                    experiences={experiences} 
                    onChange={setExperiences}
                    onAIAssist={handleAIAssist}
                  />
                </TabsContent>

                <TabsContent value="education" className="mt-6">
                  <EducationForm education={education} onChange={setEducation} />
                </TabsContent>

                <TabsContent value="skills" className="mt-6">
                  <SkillsForm skills={skills} onChange={setSkills} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div>
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
              <ResumePreview
                personalInfo={personalInfo}
                experiences={experiences}
                education={education}
                skills={skills}
              />
            </div>
          </div>
        </div>
      </div>

      <PublishWebsiteDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        resumeId={id || ""}
        resumeData={{
          personalInfo,
          experiences,
          education,
          skills,
          templateId
        }}
      />
    </div>
  );
};

export default Builder;
