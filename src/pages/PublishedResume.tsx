import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PublishedResume = () => {
  const { domain } = useParams();
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadPublishedWebsite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  const loadPublishedWebsite = async () => {
    try {
      const { data, error } = await supabase
        .from("published_websites")
        .select("html_content")
        .eq("domain", domain)
        .single();

      if (error) throw error;

      if (data) {
        setHtmlContent(data.html_content);
      } else {
        setError("Website not found");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load website';
      console.error("Error loading website:", error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Website Not Found</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default PublishedResume;
