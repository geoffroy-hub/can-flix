-- ============================================================
-- CANFLIX - FONCTIONS ET TRIGGERS
-- ============================================================

-- Trigger: créer profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger: mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- Fonction: confirmer paiement et créer achat
CREATE OR REPLACE FUNCTION public.confirm_payment_and_grant_access(
  p_payment_id UUID,
  p_provider_transaction_id TEXT
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_payment public.payments;
  v_purchase_id UUID;
BEGIN
  -- Récupérer le paiement
  SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Paiement introuvable');
  END IF;
  
  -- Marquer le paiement comme complété
  UPDATE public.payments SET
    status = 'completed',
    provider_transaction_id = p_provider_transaction_id,
    paid_at = NOW()
  WHERE id = p_payment_id;
  
  -- Créer ou mettre à jour l'accès
  INSERT INTO public.purchases (user_id, product_id, payment_id, status)
  VALUES (v_payment.user_id, v_payment.product_id, p_payment_id, 'active')
  ON CONFLICT (user_id, product_id) DO UPDATE SET
    status = 'active',
    payment_id = p_payment_id,
    download_count = 0;
  
  -- Incrémenter le compteur de téléchargements du produit
  UPDATE public.products SET download_count = download_count + 1
  WHERE id = v_payment.product_id;
  
  RETURN jsonb_build_object('success', true, 'purchase_created', true);
END;
$$;

-- Fonction: vérifier et enregistrer un téléchargement
CREATE OR REPLACE FUNCTION public.record_download(
  p_user_id UUID,
  p_product_id UUID,
  p_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_purchase public.purchases;
BEGIN
  -- Vérifier l'accès
  SELECT * INTO v_purchase
  FROM public.purchases
  WHERE user_id = p_user_id
    AND product_id = p_product_id
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > NOW());
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Accès non autorisé');
  END IF;
  
  -- Vérifier limite de téléchargements
  IF v_purchase.download_count >= v_purchase.max_downloads THEN
    RETURN jsonb_build_object('success', false, 'error', 'Limite de téléchargements atteinte');
  END IF;
  
  -- Incrémenter le compteur
  UPDATE public.purchases
  SET download_count = download_count + 1
  WHERE id = v_purchase.id;
  
  -- Logger le téléchargement
  INSERT INTO public.download_logs (user_id, product_id, purchase_id, ip_address, user_agent)
  VALUES (p_user_id, p_product_id, v_purchase.id, p_ip, p_user_agent);
  
  RETURN jsonb_build_object('success', true, 'downloads_remaining', v_purchase.max_downloads - v_purchase.download_count - 1);
END;
$$;

-- ============================================================
-- STORAGE BUCKET (exécuter dans Supabase Storage Settings ou SQL)
-- ============================================================

-- Créer le bucket pour les fichiers produits (privé)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  false, -- PRIVÉ - pas d'accès public direct
  104857600, -- 100MB max par fichier
  ARRAY['application/pdf', 'application/vnd.android.package-archive', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Politique storage: seuls les utilisateurs authentifiés avec achat peuvent télécharger
-- (L'accès se fait via API signée, pas directement)
CREATE POLICY "Authenticated users can upload (admin only)"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Accès en lecture via URLs signées générées côté serveur
CREATE POLICY "Admin can read product files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'products' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
