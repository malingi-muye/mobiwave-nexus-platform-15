
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AirtimeRequest {
  phone_number: string
  amount: number
  network: 'safaricom' | 'airtel' | 'telkom'
  reference?: string
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
      case 'send_airtime':
        return await sendAirtime(data as AirtimeRequest, mspaceApiKey, mspaceUserId, supabase)
      case 'get_history':
        return await getAirtimeHistory(mspaceApiKey, mspaceUserId, supabase)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Mspace Airtime API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function sendAirtime(request: AirtimeRequest, apiKey: string, userId: string, supabase: any): Promise<Response> {
  const { phone_number, amount, network, reference } = request

  try {
    // Get authenticated user
    const authHeader = Deno.env.get('AUTHORIZATION')
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''))
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Check user credits (airtime typically costs the amount being sent plus fees)
    const totalCost = amount * 1.05 // 5% service fee
    const { data: credits } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', user.id)
      .single()

    if (!credits || credits.credits_remaining < totalCost) {
      throw new Error('Insufficient credits')
    }

    const response = await fetch('https://api.mspace.co.ke/airtime/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userId,
        password: apiKey,
        mobile: phone_number,
        amount: amount,
        network: network,
        reference: reference || 'Airtime top-up'
      })
    })

    const result = await response.json()
    
    if (result.status === 1701) {
      // Deduct credits for successful transaction
      await supabase
        .from('user_credits')
        .update({
          credits_remaining: credits.credits_remaining - totalCost,
          credits_used: supabase.raw(`credits_used + ${totalCost}`)
        })
        .eq('user_id', user.id)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Airtime sent successfully',
          data: {
            transaction_id: result.data?.transactionid,
            status: 'completed',
            amount: amount,
            phone_number: phone_number,
            network: network,
            cost: totalCost
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(result.message || 'Failed to send airtime')
    }
  } catch (error) {
    console.error('Airtime send error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getAirtimeHistory(apiKey: string, userId: string, supabase: any): Promise<Response> {
  try {
    const response = await fetch('https://api.mspace.co.ke/airtime/history/', {
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
        transactions: result.data?.transactions || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Airtime history error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
