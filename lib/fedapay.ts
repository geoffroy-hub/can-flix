// FedaPay - Solution de paiement pour l'Afrique de l'Ouest (Togo, etc.)
// Documentation: https://docs.fedapay.com

const FEDAPAY_SECRET_KEY = process.env.FEDAPAY_SECRET_KEY!
const FEDAPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY!
const FEDAPAY_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.fedapay.com/v1'
  : 'https://sandbox-api.fedapay.com/v1'

export interface FedaPayTransactionInput {
  amount: number         // en FCFA
  description: string
  callback_url: string   // URL de retour après paiement
  customer: {
    firstname: string
    lastname?: string
    email: string
    phone_number?: {
      number: string
      country: string    // 'TG' pour Togo
    }
  }
  currency?: { iso: string } // défaut: XOF
  metadata?: Record<string, string>
}

export interface FedaPayTransaction {
  id: number
  reference: string
  amount: number
  description: string
  status: string
  payment_url?: string
  created_at: string
}

// Créer une transaction FedaPay
export async function createFedaPayTransaction(input: FedaPayTransactionInput): Promise<{
  success: boolean
  transaction?: FedaPayTransaction
  payment_url?: string
  error?: string
}> {
  try {
    const payload = {
      description: input.description,
      amount: input.amount,
      currency: input.currency || { iso: 'XOF' },
      callback_url: input.callback_url,
      customer: input.customer,
      metadata: input.metadata || {},
    }

    const response = await fetch(`${FEDAPAY_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || 'Erreur FedaPay' }
    }

    const transaction = data.v1 || data

    // Obtenir l'URL de paiement
    const tokenResponse = await fetch(`${FEDAPAY_API_URL}/transactions/${transaction.id}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const tokenData = await tokenResponse.json()
    const paymentUrl = tokenData.url || `https://checkout.fedapay.com/?token=${tokenData.token}`

    return {
      success: true,
      transaction,
      payment_url: paymentUrl,
    }
  } catch (err) {
    console.error('FedaPay error:', err)
    return { success: false, error: 'Erreur de connexion au service de paiement' }
  }
}

// Vérifier le statut d'une transaction
export async function checkFedaPayTransaction(transactionId: string): Promise<{
  success: boolean
  status?: string
  transaction?: FedaPayTransaction
  error?: string
}> {
  try {
    const response = await fetch(`${FEDAPAY_API_URL}/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${FEDAPAY_SECRET_KEY}`,
      },
    })

    const data = await response.json()
    if (!response.ok) return { success: false, error: data.message }

    const transaction = data.v1 || data
    return { success: true, status: transaction.status, transaction }
  } catch (err) {
    return { success: false, error: 'Erreur de vérification' }
  }
}

// Vérifier le webhook FedaPay
export function verifyFedaPayWebhook(payload: string, signature: string): boolean {
  const crypto = require('crypto')
  const secret = process.env.FEDAPAY_WEBHOOK_SECRET || ''
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return expected === signature
}

export { FEDAPAY_PUBLIC_KEY }
