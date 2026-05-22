import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { checkFedaPayTransaction, verifyFedaPayWebhook } from '@/lib/fedapay'

// Callback après retour depuis FedaPay
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('payment_id')
  const fedapayId = searchParams.get('id') // ID transaction FedaPay

  if (!paymentId) {
    return NextResponse.redirect(new URL('/dashboard?payment=error', request.url))
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()
    
    // Récupérer le paiement
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*, products(*)')
      .eq('id', paymentId)
      .single()

    if (!payment) {
      return NextResponse.redirect(new URL('/dashboard?payment=error', request.url))
    }

    // Vérifier le statut chez FedaPay
    const transactionId = fedapayId || payment.provider_reference
    if (transactionId) {
      const check = await checkFedaPayTransaction(transactionId)
      
      if (check.success && check.status === 'approved') {
        // Confirmer le paiement et accorder l'accès
        await supabaseAdmin.rpc('confirm_payment_and_grant_access', {
          p_payment_id: paymentId,
          p_provider_transaction_id: transactionId,
        })
        
        return NextResponse.redirect(new URL(`/dashboard?payment=success&product=${encodeURIComponent(payment.products?.name || '')}`, request.url))
      } else if (check.status === 'declined' || check.status === 'canceled') {
        await supabaseAdmin.from('payments').update({ status: 'failed' }).eq('id', paymentId)
        return NextResponse.redirect(new URL('/dashboard?payment=failed', request.url))
      }
    }

    return NextResponse.redirect(new URL('/dashboard?payment=pending', request.url))
  } catch (err) {
    console.error('Payment callback error:', err)
    return NextResponse.redirect(new URL('/dashboard?payment=error', request.url))
  }
}

// Webhook FedaPay (notifications automatiques)
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('X-FedaPay-Signature') || ''
    
    // Vérifier la signature (en production)
    if (process.env.NODE_ENV === 'production' && !verifyFedaPayWebhook(body, signature)) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 })
    }

    const event = JSON.parse(body)
    const supabaseAdmin = getSupabaseAdmin()

    if (event.name === 'transaction.approved') {
      const transaction = event.entity
      
      // Trouver le paiement via la référence
      const { data: payment } = await supabaseAdmin
        .from('payments')
        .select('id, user_id, product_id')
        .eq('provider_reference', String(transaction.id))
        .single()

      if (payment) {
        await supabaseAdmin.rpc('confirm_payment_and_grant_access', {
          p_payment_id: payment.id,
          p_provider_transaction_id: String(transaction.id),
        })
      }
    } else if (event.name === 'transaction.declined' || event.name === 'transaction.canceled') {
      const transaction = event.entity
      await supabaseAdmin
        .from('payments')
        .update({ status: 'failed' })
        .eq('provider_reference', String(transaction.id))
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
