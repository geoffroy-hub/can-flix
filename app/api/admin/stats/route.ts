import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return null

  const supabaseAdmin = getSupabaseAdmin()
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin' ? user : null
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const supabaseAdmin = getSupabaseAdmin()

  const [statsResult, paymentsResult, usersResult] = await Promise.all([
    supabaseAdmin.from('admin_stats').select('*').single(),
    supabaseAdmin.from('admin_payments_view').select('*').limit(20),
    supabaseAdmin.from('profiles').select('id, username, email, role, created_at').order('created_at', { ascending: false }).limit(20),
  ])

  return NextResponse.json({
    stats: statsResult.data,
    recent_payments: paymentsResult.data,
    recent_users: usersResult.data,
  })
}
