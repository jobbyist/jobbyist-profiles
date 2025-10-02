import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "@/components/builder/PersonalInfoForm";
import { ExperienceForm, Experience } from "@/components/builder/ExperienceForm";
import { EducationForm, Education } from "@/components/builder/EducationForm";
import { SkillsForm } from "@/components/builder/SkillsForm";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { Download, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Builder = () => {
  const { toast } = useToast();
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

  const updatePersonalInfo = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAIAssist = async (experienceId: string) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    if (!experience) return;

    toast({
      title: "AI Assist Coming Soon",
      description: "AI-powered content suggestions will be available shortly!",
    });
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button onClick={exportToPDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Section */}
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

          {/* Preview Section */}
          <div>
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
              <ResumePreview
                templateId={templateId}
                personalInfo={personalInfo}
                experiences={experiences}
                education={education}
                skills={skills}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
