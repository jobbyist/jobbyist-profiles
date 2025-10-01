import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, LogOut, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resume {
  id: string;
  title: string;
  template_id: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadResumes();
    }
  }, [user]);

  const loadResumes = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("id, title, template_id, created_at, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load resumes",
        variant: "destructive"
      });
    } finally {
      setLoadingResumes(false);
    }
  };

  const createNewResume = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user?.id,
          title: "Untitled Resume",
          template_id: "modern",
          personal_info: {},
          experiences: [],
          education: [],
          skills: []
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "New resume created",
      });

      navigate(`/builder/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteResume = async (id: string) => {
    try {
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Resume deleted",
      });

      loadResumes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading || loadingResumes) {
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
      <header className="border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">My Resumes</h1>
            <Button onClick={signOut} variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-elegant transition-all border-2 border-dashed"
            onClick={createNewResume}
          >
            <Plus className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Create New Resume</h3>
            <p className="text-sm text-muted-foreground text-center">
              Start building a new professional resume
            </p>
          </Card>

          {resumes.map((resume) => (
            <Card key={resume.id} className="p-6 hover:shadow-elegant transition-all">
              <div className="flex items-start justify-between mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteResume(resume.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <h3 className="text-lg font-semibold mb-2">{resume.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: {new Date(resume.updated_at).toLocaleDateString()}
              </p>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => navigate(`/builder/${resume.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
