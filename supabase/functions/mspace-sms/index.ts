
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SMSRequest {
  recipients: string[]
  message: string
  sender_id?: string
  campaign_id?: string
  scheduled_time?: string
}

interface MspaceApiResponse {
  status: number
  message: string
  data?: any
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
      case 'send_sms':
        return await sendSMS(data as SMSRequest, mspaceApiKey, mspaceUserId, supabase)
      case 'check_balance':
        return await checkBalance(mspaceApiKey, mspaceUserId)
      case 'get_delivery_reports':
        return await getDeliveryReports(data.message_ids, mspaceApiKey, mspaceUserId, supabase)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Mspace API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function sendSMS(request: SMSRequest, apiKey: string, userId: string, supabase: any): Promise<Response> {
  const { recipients, message, sender_id = 'SENDER', campaign_id, scheduled_time } = request

  // Get authenticated user
  const authHeader = Deno.env.get('AUTHORIZATION')
  const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''))
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Calculate cost (Mspace pricing)
  const smsCount = Math.ceil(message.length / 160)
  const costPerSMS = 0.80 // KES per SMS as per Mspace pricing
  const totalCost = recipients.length * smsCount * costPerSMS

  // Check user credits
  const { data: credits } = await supabase
    .from('user_credits')
    .select('credits_remaining')
    .eq('user_id', user.id)
    .single()

  if (!credits || credits.credits_remaining < totalCost) {
    throw new Error('Insufficient credits')
  }

  const results = []
  let successCount = 0
  let failedCount = 0
  
  for (const recipient of recipients) {
    try {
      // Send SMS via Mspace API according to their documentation
      const response = await fetch('https://api.mspace.co.ke/sms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userId,
          password: apiKey,
          mobile: recipient,
          msg: message,
          senderid: sender_id,
          msgtype: 0, // Normal SMS
          duplicatecheck: 1,
          scheduletime: scheduled_time || '',
        })
      })

      const result: MspaceApiResponse = await response.json()
      
      if (result.status === 1701 || result.status === 1702) {
        // Success statuses according to Mspace API docs
        successCount++
        
        // Store message in history
        await supabase
          .from('message_history')
          .insert({
            type: 'sms',
            sender: sender_id,
            recipient: recipient,
            content: message,
            status: 'sent',
            provider: 'mspace',
            provider_message_id: result.data?.msgid || `mspace_${Date.now()}`,
            sent_at: new Date().toISOString(),
            user_id: user.id
          })

        // Update campaign recipient if campaign_id provided
        if (campaign_id) {
          await supabase
            .from('campaign_recipients')
            .upsert({
              campaign_id,
              recipient_type: 'phone',
              recipient_value: recipient,
              status: 'sent',
              sent_at: new Date().toISOString(),
              provider_message_id: result.data?.msgid
            })
        }

        results.push({ 
          recipient, 
          success: true, 
          message_id: result.data?.msgid,
          status: result.status,
          message: result.message
        })
      } else {
        // Failed according to Mspace API response codes
        failedCount++
        results.push({ 
          recipient, 
          success: false, 
          error: result.message,
          status: result.status
        })
      }
    } catch (error) {
      console.error(`SMS send error for ${recipient}:`, error)
      failedCount++
      results.push({ recipient, success: false, error: error.message })
    }
  }

  // Deduct credits for successful sends only
  const actualCost = successCount * smsCount * costPerSMS

  if (actualCost > 0) {
    await supabase
      .from('user_credits')
      .update({
        credits_remaining: credits.credits_remaining - actualCost,
        credits_used: supabase.raw(`credits_used + ${actualCost}`)
      })
      .eq('user_id', user.id)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `SMS sending completed`,
      data: {
        results,
        cost: actualCost,
        sent_count: successCount,
        failed_count: failedCount,
        message_ids: results.filter(r => r.success).map(r => r.message_id)
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function checkBalance(apiKey: string, userId: string): Promise<Response> {
  try {
    const response = await fetch('https://api.mspace.co.ke/balance/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userId,
        password: apiKey
      })
    })

    const result: MspaceApiResponse = await response.json()
    
    if (result.status === 1701) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            currency: 'KES',
            balance: result.data?.balance || '0.00'
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(result.message || 'Failed to check balance')
    }
  } catch (error) {
    console.error('Balance check error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getDeliveryReports(messageIds: string[], apiKey: string, userId: string, supabase: any): Promise<Response> {
  const reports = []
  
  for (const messageId of messageIds) {
    try {
      const response = await fetch('https://api.mspace.co.ke/reports/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userId,
          password: apiKey,
          msgid: messageId
        })
      })

      const result: MspaceApiResponse = await response.json()
      
      if (result.status === 1701) {
        const deliveryStatus = result.data?.status || 'pending'
        
        // Update message status in database
        await supabase
          .from('message_history')
          .update({
            status: deliveryStatus,
            delivered_at: deliveryStatus === 'delivered' ? new Date().toISOString() : null,
            failed_at: deliveryStatus === 'failed' ? new Date().toISOString() : null
          })
          .eq('provider_message_id', messageId)

        // Update campaign recipient status
        await supabase
          .from('campaign_recipients')
          .update({
            status: deliveryStatus,
            delivered_at: deliveryStatus === 'delivered' ? new Date().toISOString() : null,
            failed_at: deliveryStatus === 'failed' ? new Date().toISOString() : null
          })
          .eq('provider_message_id', messageId)

        reports.push({
          message_id: messageId,
          status: deliveryStatus,
          delivered_at: result.data?.delivered_at,
          failed_reason: result.data?.failed_reason
        })
      }
    } catch (error) {
      console.error(`Delivery report error for ${messageId}:`, error)
    }
  }

  return new Response(
    JSON.stringify({ success: true, reports }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
