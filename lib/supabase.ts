import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client admin (côté serveur uniquement - utilise la service role key)
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export type Product = {
  id: string
  name: string
  description: string
  type: 'pdf' | 'apk' | 'app' | 'course'
  price: number
  file_path?: string
  file_name?: string
  file_size?: number
  thumbnail_url?: string
  is_active: boolean
  download_count: number
  created_at: string
}

export type Purchase = {
  id: string
  user_id: string
  product_id: string
  payment_id: string
  status: 'active' | 'expired' | 'revoked'
  download_count: number
  max_downloads: number
  expires_at?: string
  created_at: string
  product?: Product
}

export type Payment = {
  id: string
  user_id: string
  product_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  provider_transaction_id?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  paid_at?: string
  created_at: string
}
