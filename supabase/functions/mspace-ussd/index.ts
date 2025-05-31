
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface USSDRequest {
  recipients: string[]
  message: string
  service_code?: string
  session_id?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const mspaceApiKey = Deno.env.get('MSPACE_API_KEY')
    const mspaceUserId = Deno.env.get('MSPACE_USER_ID')
    
    if (!mspaceApiKey || !mspaceUserId) {
      throw new Error('MSPACE_API_KEY and MSPACE_USER_ID not configured')
    }

    const { action, ...data } = await req.json()

    switch (action) {
      case 'send_ussd':
        return await sendUSSD(data as USSDRequest, mspaceApiKey, mspaceUserId, supabase)
      case 'get_sessions':
        return await getUSSDSessions(mspaceApiKey, mspaceUserId, supabase)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Mspace USSD API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function sendUSSD(request: USSDRequest, apiKey: string, userId: string, supabase: any): Promise<Response> {
  const { recipients, message, service_code } = request

  const results = []
  let successCount = 0
  let failedCount = 0
  
  for (const recipient of recipients) {
    try {
      const response = await fetch('https://api.mspace.co.ke/ussd/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userId,
          password: apiKey,
          mobile: recipient,
          msg: message,
          servicecode: service_code || '*144#',
        })
      })

      const result = await response.json()
      
      if (result.status === 1701) {
        successCount++
        results.push({ 
          recipient, 
          success: true, 
          session_id: result.data?.sessionid,
          message: result.message
        })
      } else {
        failedCount++
        results.push({ 
          recipient, 
          success: false, 
          error: result.message
        })
      }
    } catch (error) {
      console.error(`USSD send error for ${recipient}:`, error)
      failedCount++
      results.push({ recipient, success: false, error: error.message })
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `USSD sending completed`,
      data: {
        results,
        sent_count: successCount,
        failed_count: failedCount
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getUSSDSessions(apiKey: string, userId: string, supabase: any): Promise<Response> {
  try {
    const response = await fetch('https://api.mspace.co.ke/ussd/sessions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userId,
        password: apiKey
      })
    })

    const result = await response.json()
    
    return new Response(
      JSON.stringify({
        success: true,
        sessions: result.data?.sessions || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('USSD sessions error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
