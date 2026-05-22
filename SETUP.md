# 🎬 Canflix — Guide d'installation complet

## Ce qui a été ajouté

| Fonctionnalité | Description |
|---|---|
| 🗄️ Base de données Supabase | Produits, paiements, achats, téléchargements |
| 💳 Paiement FedaPay | Mobile Money Togo (Flooz, Moov, Wave) |
| 📥 Téléchargement sécurisé | URLs signées, limite 5 téléch./achat |
| 🛡️ Admin caché | `Ctrl + Shift + K` → panneau admin |
| 👤 Auth Supabase | Inscription/connexion via Supabase Auth |

---

## 1. Créer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com) → **New Project**
2. Dans **SQL Editor**, exécutez dans l'ordre :
   - `backend/sql/01_schema.sql`
   - `backend/sql/02_functions.sql`
   - `backend/sql/03_seed.sql`

---

## 2. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplissez `.env.local` avec vos vraies clés :
- **Supabase** : `Settings > API` dans votre projet
- **FedaPay** : [app.fedapay.com/settings/api](https://app.fedapay.com/settings/api)

---

## 3. Installer et lancer

```bash
npm install
npm run dev
```

---

## 4. Créer votre compte Admin

1. Inscrivez-vous sur `/register`
2. Dans Supabase SQL Editor :
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'votre@email.com';
```
3. Appuyez sur **Ctrl + Shift + K** pour accéder au panneau admin

---

## 5. Ajouter des produits (via Admin)

1. Connectez-vous avec votre compte admin
2. Appuyez sur `Ctrl + Shift + K`
3. Cliquez sur **"Ajouter Produit"**
4. Uploadez vos fichiers PDF ou APK

---

## 6. FedaPay — Configuration paiement Togo

### Mode sandbox (test)
Les clés `pk_sandbox_...` et `sk_sandbox_...` permettent de tester sans vrai argent.

### Modes de paiement disponibles
- 📱 **Togocom / Flooz** (T-Money)
- 📱 **Moov Money**
- 🌊 **Wave**

### Webhook (production)
Configurez l'URL webhook dans FedaPay :
```
https://votre-domaine.com/api/payment/callback
```

---

## Structure des fichiers

```
canflix-nextjs/
├── backend/
│   └── sql/
│       ├── 01_schema.sql      # Tables + RLS
│       ├── 02_functions.sql   # Fonctions + triggers
│       └── 03_seed.sql        # Données initiales
├── app/
│   ├── admin/page.tsx         # 🛡️ Panneau admin (Ctrl+Shift+K)
│   ├── dashboard/page.tsx     # Tableau de bord utilisateur
│   ├── api/
│   │   ├── payment/
│   │   │   ├── initiate/      # Créer transaction FedaPay
│   │   │   └── callback/      # Retour après paiement
│   │   ├── download/          # Téléchargement sécurisé
│   │   └── admin/             # APIs admin
│   └── components/
│       └── AdminShortcut.tsx  # Ctrl+Shift+K
├── lib/
│   ├── supabase.ts            # Client Supabase
│   └── fedapay.ts             # Intégration FedaPay
└── .env.local.example         # Variables à configurer
```

---

## Prix

Chaque produit est à **1 000 FCFA** (configurable dans la base de données).
