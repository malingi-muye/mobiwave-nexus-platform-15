
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VoiceCallRequest {
  recipients: string[]
  voice_file_url?: string
  text_to_speech?: string
  voice_id?: string
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
      case 'make_call':
        return await makeVoiceCall(data as VoiceCallRequest, mspaceApiKey, mspaceUserId, supabase)
      case 'get_call_history':
        return await getCallHistory(mspaceApiKey, mspaceUserId, supabase)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Mspace Voice API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function makeVoiceCall(request: VoiceCallRequest, apiKey: string, userId: string, supabase: any): Promise<Response> {
  const { recipients, voice_file_url, text_to_speech } = request

  const results = []
  let successCount = 0
  let failedCount = 0
  let totalCost = 0
  
  for (const recipient of recipients) {
    try {
      const response = await fetch('https://api.mspace.co.ke/voice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userId,
          password: apiKey,
          mobile: recipient,
          voice_file: voice_file_url,
          tts_message: text_to_speech,
        })
      })

      const result = await response.json()
      
      if (result.status === 1701) {
        successCount++
        totalCost += result.data?.cost || 2.0
        results.push({ 
          recipient, 
          success: true, 
          call_id: result.data?.callid,
          cost: result.data?.cost || 2.0,
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
      console.error(`Voice call error for ${recipient}:`, error)
      failedCount++
      results.push({ recipient, success: false, error: error.message })
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Voice calls completed`,
      data: {
        results,
        call_ids: results.filter(r => r.success).map(r => r.call_id),
        cost: totalCost,
        sent_count: successCount,
        failed_count: failedCount
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getCallHistory(apiKey: string, userId: string, supabase: any): Promise<Response> {
  try {
    const response = await fetch('https://api.mspace.co.ke/voice/history/', {
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
        calls: result.data?.calls || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Voice call history error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
