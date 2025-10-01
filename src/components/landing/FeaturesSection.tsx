import { Sparkles, FileText, Globe, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Get intelligent suggestions for your resume content tailored to your experience and industry."
  },
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Choose from beautifully designed, ATS-friendly resume templates that get noticed."
  },
  {
    icon: Download,
    title: "PDF Export",
    description: "Download your resume as a high-quality PDF ready to send to employers."
  },
  {
    icon: Globe,
    title: "Personal Website",
    description: "Publish your resume as a professional website with your own .cv domain."
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you create the perfect resume and stand out from the crowd.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
