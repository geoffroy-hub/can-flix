-- ============================================================
-- CANFLIX - DONNÉES INITIALES (SEED)
-- ============================================================
-- À exécuter après 01_schema.sql et 02_functions.sql

-- Produits exemples (1000 FCFA chacun comme demandé)
INSERT INTO public.products (name, description, type, price, file_name, is_active) VALUES
(
  'Formation TikTok Viral',
  'Maîtrisez l''algorithme TikTok, créez du contenu viral et passez de 0 à 100K abonnés. Guide complet 127 pages.',
  'pdf',
  1000,
  'formation-tiktok-viral.pdf',
  true
),
(
  'YouTube Growth Masterclass',
  'Créez une chaîne YouTube rentable avec des stratégies prouvées pour les vues, abonnés et revenus. 98 pages.',
  'pdf',
  1000,
  'youtube-growth-masterclass.pdf',
  true
),
(
  'Trading Masterclass',
  'Apprenez les stratégies de trading professionnelles pour Forex, Crypto et Actions avec gestion des risques. 215 pages.',
  'pdf',
  1000,
  'trading-masterclass.pdf',
  true
),
(
  'Netflix Premium APK',
  'Application Netflix Premium modifiée avec accès illimité, pas de publicités, téléchargement illimité.',
  'apk',
  1000,
  'netflix-premium.apk',
  true
),
(
  'Canal+ Premium APK',
  'Application Canal+ Premium avec toutes les chaînes, sports, séries et films. Multi-appareils.',
  'apk',
  1000,
  'canal-premium.apk',
  true
);

-- Admin par défaut (à changer après création du compte)
-- IMPORTANT: Créez d'abord votre compte via /register, puis exécutez:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'votre@email.com';

-- Vue utile pour l'admin: statistiques globales
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'user') AS total_users,
  (SELECT COUNT(*) FROM public.products WHERE is_active = true) AS active_products,
  (SELECT COUNT(*) FROM public.payments WHERE status = 'completed') AS completed_payments,
  (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'completed') AS total_revenue_fcfa,
  (SELECT COUNT(*) FROM public.purchases WHERE status = 'active') AS active_purchases,
  (SELECT COUNT(*) FROM public.download_logs WHERE downloaded_at > NOW() - INTERVAL '24 hours') AS downloads_today;

-- Vue pour admin: détail des paiements avec infos utilisateur et produit
CREATE OR REPLACE VIEW public.admin_payments_view AS
SELECT
  p.id,
  p.amount,
  p.currency,
  p.status,
  p.payment_method,
  p.customer_name,
  p.customer_email,
  p.customer_phone,
  p.provider_transaction_id,
  p.paid_at,
  p.created_at,
  pr.name AS product_name,
  pr.type AS product_type,
  u.username AS user_username
FROM public.payments p
LEFT JOIN public.products pr ON p.product_id = pr.id
LEFT JOIN public.profiles u ON p.user_id = u.id
ORDER BY p.created_at DESC;
