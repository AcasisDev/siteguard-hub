import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { record } = await req.json()
    const email = record.email
    const userId = record.id

    console.log(`Processing role assignment for user: ${email}`)

    // Determine role based on email pattern
    let role = 'viewer' // default role
    
    if (email.includes('admin@demo.com') || email.includes('superadmin@demo.com')) {
      role = 'super_admin'
    } else if (email.includes('admin@')) {
      role = 'admin'
    } else if (email.includes('editor@')) {
      role = 'editor'
    }

    // Update the user's role
    const { error } = await supabaseAdmin
      .from('user_roles')
      .update({ role })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating user role:', error)
      throw error
    }

    console.log(`Successfully assigned role ${role} to user ${email}`)

    return new Response(
      JSON.stringify({ success: true, role }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in assign-demo-roles function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})