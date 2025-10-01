import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let prompt = '';
    let systemPrompt = 'You are an expert career advisor and resume writer. Generate professional, ATS-friendly content.';

    if (type === 'experience') {
      systemPrompt = 'You are an expert career advisor. Generate professional, achievement-focused bullet points for a job experience. Focus on quantifiable results and action verbs. Return 3-5 bullet points.';
      prompt = `Generate professional bullet points for this role:
Position: ${data.position}
Company: ${data.company}
Current description: ${data.description || 'None provided'}

Generate 3-5 achievement-focused bullet points that:
- Start with strong action verbs
- Include quantifiable results when possible
- Are ATS-friendly
- Highlight key responsibilities and achievements`;
    } else if (type === 'summary') {
      systemPrompt = 'You are an expert career advisor. Generate a compelling professional summary that highlights key strengths and career objectives.';
      prompt = `Generate a professional summary for:
Name: ${data.fullName}
Title: ${data.title}
Experience highlights: ${data.experienceHighlights || 'Various professional experiences'}

Generate a 2-3 sentence professional summary that is:
- Compelling and professional
- Highlights key strengths
- ATS-friendly
- Forward-looking`;
    }

    console.log('Calling Lovable AI with prompt:', prompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const generatedContent = aiData.choices[0].message.content;

    console.log('AI generated content:', generatedContent);

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-assist function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});