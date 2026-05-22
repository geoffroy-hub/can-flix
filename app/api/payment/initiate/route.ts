import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createFedaPayTransaction } from '@/lib/fedapay'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, customer_name, customer_email, customer_phone } = body

    if (!product_id || !customer_email || !customer_phone) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Récupérer le produit
    const supabaseAdmin = getSupabaseAdmin()
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', product_id)
      .eq('is_active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    }

    // Récupérer l'utilisateur connecté (si connecté)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const authHeader = request.headers.get('Authorization')
    
    let userId: string | null = null
    if (authHeader) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id || null
    }

    // Créer l'enregistrement de paiement en attente
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        product_id: product.id,
        amount: product.price,
        currency: 'XOF',
        status: 'pending',
        payment_method: 'fedapay',
        customer_name: customer_name || customer_email.split('@')[0],
        customer_email,
        customer_phone,
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment insert error:', paymentError)
      return NextResponse.json({ error: 'Erreur création paiement' }, { status: 500 })
    }

    // Créer la transaction FedaPay
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const [firstname, ...rest] = (customer_name || 'Client').split(' ')
    
    const fedaResult = await createFedaPayTransaction({
      amount: product.price,
      description: `Canflix - ${product.name}`,
      callback_url: `${baseUrl}/api/payment/callback?payment_id=${payment.id}`,
      customer: {
        firstname: firstname || 'Client',
        lastname: rest.join(' ') || '',
        email: customer_email,
        phone_number: {
          number: customer_phone,
          country: 'TG',
        },
      },
      metadata: {
        payment_id: payment.id,
        product_id: product.id,
      },
    })

    if (!fedaResult.success) {
      // Marquer le paiement comme échoué
      await supabaseAdmin.from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id)
      
      return NextResponse.json({ error: fedaResult.error }, { status: 500 })
    }

    // Sauvegarder la référence FedaPay
    await supabaseAdmin.from('payments')
      .update({
        provider_reference: String(fedaResult.transaction?.id),
        metadata: { fedapay_transaction_id: fedaResult.transaction?.id }
      })
      .eq('id', payment.id)

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      payment_url: fedaResult.payment_url,
      amount: product.price,
      product_name: product.name,
    })

  } catch (err) {
    console.error('Payment initiation error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
