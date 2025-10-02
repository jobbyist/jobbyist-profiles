import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, User, Briefcase, GraduationCap } from "lucide-react";

const Examples = () => {
  const sampleResumes = [
    {
      id: 1,
      name: "Michael Chigbu",
      title: "Senior Software Engineer",
      description: "Full-stack developer with 8+ years of experience in building scalable web applications",
      url: "https://michaelchigbu.cv",
      icon: User,
      template: "Modern"
    },
    {
      id: 2,
      name: "Sarah Anderson",
      title: "Product Manager",
      description: "Strategic product leader with expertise in SaaS platforms and agile methodologies",
      icon: Briefcase,
      template: "Classic"
    },
    {
      id: 3,
      name: "James Chen",
      title: "Data Scientist",
      description: "ML engineer specializing in predictive analytics and natural language processing",
      icon: GraduationCap,
      template: "Minimal"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <span className="text-xl font-bold">Jobbyist Profiles</span>
            </Link>
            
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Resume <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">Examples</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore professionally crafted resumes built with our platform. Get inspired by real examples.
            </p>
          </div>

          {/* Featured Resume - Embedded */}
          <div className="mb-16 animate-fade-in">
            <Card className="overflow-hidden border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Featured Resume</CardTitle>
                    <CardDescription>Live example of a published resume website</CardDescription>
                  </div>
                  <a 
                    href="https://michaelchigbu.cv" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" size="sm">
                      Open in New Tab
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[600px] rounded-lg overflow-hidden border border-border bg-background">
                  <iframe 
                    src="https://michaelchigbu.cv" 
                    className="w-full h-full"
                    title="Michael Chigbu Resume"
                    sandbox="allow-same-origin allow-scripts allow-popups"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Resume Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {sampleResumes.map((resume, index) => {
              const Icon = resume.icon;
              return (
                <Card 
                  key={resume.id} 
                  className="hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{resume.name}</CardTitle>
                    <CardDescription>{resume.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {resume.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {resume.template} Template
                      </span>
                      {resume.url && (
                        <a 
                          href={resume.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            View
                            <ExternalLink className="ml-2 w-3 h-3" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center animate-fade-in">
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl">Ready to Build Your Resume?</CardTitle>
                <CardDescription className="text-base">
                  Create your own professional resume in minutes with AI-powered assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/auth">
                  <Button size="lg" className="shadow-elegant hover:shadow-glow transition-all duration-300">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-subtle py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent" />
              <span className="font-semibold">Jobbyist Profiles</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Jobbyist Profiles. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Examples;
