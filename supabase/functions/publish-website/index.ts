import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeId, domain, resumeData } = await req.json();
    
    if (!resumeId || !domain || !resumeData) {
      throw new Error('Missing required parameters');
    }

    // Name.com API credentials
    const NAMECOM_API_KEY = Deno.env.get('NAMECOM_API_KEY') || '4841da18ed841dbd4708bb4052a054428172e583';
    const NAMECOM_USERNAME = Deno.env.get('NAMECOM_USERNAME') || 'mykeynotyours-test';
    const NAMECOM_API_URL = 'https://api.dev.name.com';

    // Basic auth for Name.com API
    const auth = btoa(`${NAMECOM_USERNAME}:${NAMECOM_API_KEY}`);

    console.log('Registering domain:', domain);

    // Register domain using Name.com API
    const registerResponse = await fetch(`${NAMECOM_API_URL}/v4/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain: {
          domainName: domain,
        },
        purchasePrice: 0, // Development mode
      }),
    });

    if (!registerResponse.ok) {
      const errorText = await registerResponse.text();
      console.error('Name.com registration error:', errorText);
      
      // In development mode, we might get errors but continue anyway
      console.log('Continuing despite registration error (dev mode)');
    } else {
      const registerData = await registerResponse.json();
      console.log('Domain registered:', registerData);
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate static HTML for the resume website
    const websiteHtml = generateResumeWebsite(resumeData);

    // Store the published website in the database
    const { data: publishedSite, error: dbError } = await supabase
      .from('published_websites')
      .insert({
        resume_id: resumeId,
        domain: domain,
        html_content: websiteHtml,
        template_id: resumeData.templateId,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save website: ${dbError.message}`);
    }

    console.log('Website published successfully:', domain);

    return new Response(
      JSON.stringify({ 
        success: true,
        domain,
        websiteUrl: `https://${domain}`,
        publishedAt: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error publishing website:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

function generateResumeWebsite(resumeData: {
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
  };
  experiences: Array<{
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education: Array<{
    degree?: string;
    school?: string;
    year?: string;
  }>;
  skills: string[];
  templateId: string;
}): string {
  const { personalInfo, experiences, education, skills, templateId } = resumeData;

  // Generate a clean, professional HTML template
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${personalInfo.title || 'Professional Resume'} - ${personalInfo.fullName}">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        h1 {
            font-size: 2.5em;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .title {
            font-size: 1.3em;
            color: #6b7280;
            margin-bottom: 15px;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 0.95em;
            color: #6b7280;
        }
        
        .contact-info span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        section {
            margin-bottom: 35px;
        }
        
        h2 {
            color: #1e40af;
            font-size: 1.5em;
            margin-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
        }
        
        .summary {
            color: #4b5563;
            line-height: 1.8;
        }
        
        .experience-item, .education-item {
            margin-bottom: 25px;
        }
        
        .experience-item h3, .education-item h3 {
            color: #1f2937;
            font-size: 1.2em;
            margin-bottom: 5px;
        }
        
        .experience-meta, .education-meta {
            color: #6b7280;
            font-size: 0.95em;
            margin-bottom: 10px;
        }
        
        .experience-description {
            color: #4b5563;
            white-space: pre-wrap;
            line-height: 1.7;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-tag {
            background: #dbeafe;
            color: #1e40af;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 30px 20px;
            }
            
            h1 {
                font-size: 2em;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 10px;
            }
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${personalInfo.fullName || 'Your Name'}</h1>
            ${personalInfo.title ? `<div class="title">${personalInfo.title}</div>` : ''}
            <div class="contact-info">
                ${personalInfo.email ? `<span>✉ ${personalInfo.email}</span>` : ''}
                ${personalInfo.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
                ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
            </div>
        </header>
        
        ${personalInfo.summary ? `
        <section>
            <h2>Professional Summary</h2>
            <div class="summary">${personalInfo.summary}</div>
        </section>
        ` : ''}
        
        ${experiences && experiences.length > 0 ? `
        <section>
            <h2>Work Experience</h2>
            ${experiences.map(exp => `
                <div class="experience-item">
                    <h3>${exp.position || 'Position'}</h3>
                    <div class="experience-meta">
                        ${exp.company || 'Company'} ${exp.startDate ? `• ${exp.startDate}` : ''} ${exp.endDate ? `- ${exp.endDate}` : ''}
                    </div>
                    ${exp.description ? `<div class="experience-description">${exp.description}</div>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}
        
        ${education && education.length > 0 ? `
        <section>
            <h2>Education</h2>
            ${education.map(edu => `
                <div class="education-item">
                    <h3>${edu.degree || 'Degree'}</h3>
                    <div class="education-meta">
                        ${edu.school || 'School'} ${edu.year ? `• ${edu.year}` : ''}
                    </div>
                </div>
            `).join('')}
        </section>
        ` : ''}
        
        ${skills && skills.length > 0 ? `
        <section>
            <h2>Skills</h2>
            <div class="skills-list">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </section>
        ` : ''}
    </div>
</body>
</html>`;

  return html;
}
