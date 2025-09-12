# Calculateur d'Investissement Immobilier - Bruz (35)

Application web interactive pour simuler l'investissement immobilier dans un appartement de 57m² à Bruz (35).

## 🏠 À propos du projet

Cette application permet d'analyser la rentabilité d'un investissement immobilier spécifique :
- **Bien** : Appartement 57m² à Bruz (35)
- **Prix** : 200 000 €
- **Type** : Investissement locatif

## ✨ Fonctionnalités

### 🧮 Calculateur interactif
- Simulation des mensualités de prêt
- Calcul du taux d'endettement (DTI)
- Vérification de conformité HCSF
- Analyse des flux de trésorerie locatifs
- Calcul du TRI nominal et réel sur 10 ans

### 📊 Visualisations
- Projections de valeur sur 10 ans
- Comparaison des scénarios (Base vs Optimiste)
- Graphiques interactifs avec Recharts

### 📥 Documents téléchargeables
- **Rapport PDF** : Analyse complète du marché local
- **Calculateur Excel** : Feuille de calcul interactive
- **Script Python** : Code source des calculs

## 🚀 Technologies utilisées

- **Frontend** : React 18, TypeScript
- **Styling** : Tailwind CSS
- **Graphiques** : Recharts
- **Build** : Vite
- **Déploiement** : GitHub Pages

## 🏗️ Installation et développement

```bash
# Cloner le projet
git clone <repo-url>
cd bruz-investment-calculator

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour la production
npm run build
```

## 📊 Paramètres de calcul

### Bien immobilier
- Prix : 200 000 €
- Surface : 57 m²
- Frais d'acquisition : 8%

### Financement
- Taux d'intérêt : 3,29%
- Durée : 25 ans
- Taux d'assurance : 0,15%

### Location
- Loyer médian : 15 €/m²/mois
- Charges : 30%
- Taux de vacance : 0%

### Projections
- **Scénario Base** : 2,5%/an
- **Scénario Optimiste** : 4,5%/an
- Inflation : 2%

## 📈 Résultats clés

### Financement (cas de base)
- Mensualité totale : ~833 €
- DTI : 37,9% (> seuil HCSF 35%)
- Dérogation HCSF requise

### Projections
- Valeur 5 ans : 226 282 €
- Valeur 10 ans : 256 017 €
- Cash-flow locatif : -2 816 €/an

### TRI 10 ans
- **Base** : 1,8% nominal / ~0% réel
- **Optimiste** : 6,5-6,9% nominal / 4,8% réel

## 🎯 Recommandations

1. **Négociation** : Viser un prix ≤ 187 400 € pour respecter DTI 35%
2. **Financement** : Solliciter plusieurs banques pour dérogation HCSF
3. **Stratégie** : Conservation ≥ 10 ans recommandée
4. **Location** : Cibler étudiants/jeunes actifs (Ker Lann)

## 📄 Sources

- MeilleursAgents Bruz (sept. 2025)
- SeLoger Bruz (juin 2025)
- Figaro Immobilier - loyers Bruz
- HCSF - règles 35% & 25 ans

## 🚀 Déploiement

L'application est automatiquement déployée sur GitHub Pages via GitHub Actions lors des commits sur la branche `main`.

**URL de production** : `https://[username].github.io/bruz-investment-calculator/`

## 📝 Licence

Ce projet est à des fins éducatives et d'analyse personnelle.