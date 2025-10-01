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
    const { domain } = await req.json();
    
    if (!domain) {
      throw new Error('Domain is required');
    }

    // Name.com API credentials
    const NAMECOM_API_KEY = Deno.env.get('NAMECOM_API_KEY') || '4841da18ed841dbd4708bb4052a054428172e583';
    const NAMECOM_USERNAME = Deno.env.get('NAMECOM_USERNAME') || 'mykeynotyours-test';
    const NAMECOM_API_URL = 'https://api.dev.name.com';

    // Basic auth for Name.com API
    const auth = btoa(`${NAMECOM_USERNAME}:${NAMECOM_API_KEY}`);

    console.log('Checking domain availability:', domain);

    // Check domain availability using Name.com API
    const response = await fetch(`${NAMECOM_API_URL}/v4/domains:checkAvailability`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domainNames: [domain]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Name.com API error:', errorText);
      throw new Error(`Name.com API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Name.com API response:', data);

    // Check if domain is available
    const domainResult = data.results ? data.results[0] : null;
    const available = domainResult && domainResult.purchasable === true;

    return new Response(
      JSON.stringify({ 
        available,
        domain,
        price: domainResult?.purchasePrice || null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error checking domain:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
