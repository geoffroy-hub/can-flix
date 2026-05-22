import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('product_id')
  const authHeader = request.headers.get('Authorization')

  if (!productId || !authHeader) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Vérifier l'utilisateur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Enregistrer le téléchargement et vérifier l'accès
    const { data: result, error: rpcError } = await supabaseAdmin.rpc('record_download', {
      p_user_id: user.id,
      p_product_id: productId,
      p_ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      p_user_agent: request.headers.get('user-agent') || null,
    })

    if (rpcError || !result?.success) {
      return NextResponse.json(
        { error: result?.error || 'Accès refusé' },
        { status: 403 }
      )
    }

    // Récupérer le produit pour le chemin du fichier
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('file_path, file_name, type')
      .eq('id', productId)
      .single()

    if (!product?.file_path) {
      return NextResponse.json({ error: 'Fichier non disponible' }, { status: 404 })
    }

    // Générer une URL signée temporaire (expire dans 60 secondes)
    const { data: signedUrl, error: signedError } = await supabaseAdmin.storage
      .from('products')
      .createSignedUrl(product.file_path, 60, {
        download: product.file_name || true,
      })

    if (signedError || !signedUrl) {
      console.error('Signed URL error:', signedError)
      return NextResponse.json({ error: 'Erreur génération lien' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      download_url: signedUrl.signedUrl,
      file_name: product.file_name,
      downloads_remaining: result.downloads_remaining,
      expires_in: 60,
    })

  } catch (err) {
    console.error('Download error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
