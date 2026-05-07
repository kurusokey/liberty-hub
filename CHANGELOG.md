# Changelog

Toutes les modifications notables de Liberty Hub sont documentées ici.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [Unreleased]

## [1.2.0] — 2026-05-07

### Ajouté
- **PWA host-aware** : metadata dynamique via `generateMetadata` + `headers()` selon le host.
- Manifest dédié `dca-manifest.json` pour le sous-domaine `dca.sampapaya.com` (nom "DCA Sampapaya", short_name "DCA").
- Icônes PNG dédiées DCA (192/512/180) avec design barres ascendantes ambrées.
- Apple Web App title "DCA" sur le sous-domaine.

## [1.1.0] — 2026-05-06

### Ajouté
- Domaine `dca.sampapaya.com` (custom domain + SSL Vercel).
- `proxy.ts` : rewrite host-based `dca.sampapaya.com/*` → `/dca/*` (routing transparent).

### Note
Liberty Hub continue d'exister à `liberty-hub.vercel.app/` mais est privé/dev. Le sous-domaine `dca.sampapaya.com` est l'URL publique officielle du dashboard DCA.

## [1.0.0] — Initial release

### Ajouté
- Dashboard agrégé multi-investissements : Liberty Risk + Gold + Trade + PEA + Immo.
- Composants : RiskCard, GoldCard, TradeCard, PeaCard, ImmoCard, TotalBanner.
- Page `/dca` : suivi détaillé du DCA hebdomadaire (BTC + Or).
- API `/api/market` (prix temps réel) et `/api/risk` (état du bot).
- Stack : Next.js 16 + TypeScript + Tailwind + Supabase (lecture seule via service_role).
- Connexion lecture aux tables Supabase `lr_settings`, `lr_trades`, `lg_settings`, `lg_trades`.
