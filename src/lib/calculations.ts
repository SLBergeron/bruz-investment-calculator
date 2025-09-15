// Calcul du paiement mensuel
export function mensualite(principal: number, tauxAnnuel: number, annees: number): number {
  const i = tauxAnnuel / 12;
  const n = annees * 12;
  return principal * i / (1 - Math.pow(1 + i, -n));
}

// Calcul du solde restant dû
export function soldeRestantDu(
  principal: number,
  tauxAnnuel: number,
  annees: number,
  moisPayes: number
): number {
  const i = tauxAnnuel / 12;
  const A = mensualite(principal, tauxAnnuel, annees);
  const k = moisPayes;
  return principal * Math.pow(1 + i, k) - A * (Math.pow(1 + i, k) - 1) / i;
}

// Calcul du TRI par méthode de bissection
export function calculTRIBissection(
  fluxTresorerie: number[],
  bas: number = -0.9,
  haut: number = 1.0,
  tolerance: number = 1e-7,
  maxIterations: number = 10000
): number | null {
  function van(taux: number): number {
    return fluxTresorerie.reduce((somme, flux, t) => somme + flux / Math.pow(1 + taux, t), 0);
  }

  let f_bas = van(bas);
  let f_haut = van(haut);
  let h = haut;
  let tentatives = 0;

  // Trouver un intervalle où la fonction change de signe
  while (f_bas * f_haut > 0 && tentatives < 50) {
    h += 1.0;
    f_haut = van(h);
    tentatives++;
  }

  if (f_bas * f_haut > 0) {
    return null; // Pas de solution trouvée
  }

  // Méthode de bissection
  for (let i = 0; i < maxIterations; i++) {
    const milieu = (bas + h) / 2;
    const f_milieu = van(milieu);

    if (Math.abs(f_milieu) < tolerance) {
      return milieu;
    }

    if (f_bas * f_milieu < 0) {
      h = milieu;
      f_haut = f_milieu;
    } else {
      bas = milieu;
      f_bas = f_milieu;
    }
  }

  return (bas + h) / 2;
}

// Calcul du TRI réel
export function triReel(triNominal: number, inflation: number): number {
  return (1 + triNominal) / (1 + inflation) - 1;
}

// Calcul du TRI sur 10 ans
export function calculTRI10Ans(
  pret: number,
  noi: number,
  croissance: number,
  coutVente: number,
  apportInitial: number,
  tauxPret: number,
  anneesPret: number,
  assuranceMensuelle: number,
  prixAchat: number,
  inflation: number = 0.02
): { triNominal: number | null; triReel: number | null } {
  const serviceDetteAnnuel = (mensualite(pret, tauxPret, anneesPret) + assuranceMensuelle) * 12;
  const solde120Mois = soldeRestantDu(pret, tauxPret, anneesPret, 120);
  const prixVente = prixAchat * Math.pow(1 + croissance, 10);
  const venteNette = prixVente * (1 - coutVente);
  const cashFinalNet = venteNette - solde120Mois;

  // Flux de trésorerie réalistes: investissement initial négatif, puis 9 années avec NOI - dette,
  // puis dernière année avec NOI - dette + vente nette
  const cashflowAnnuel = noi - serviceDetteAnnuel;
  const fluxTresorerie = [
    -apportInitial,
    ...Array(9).fill(cashflowAnnuel),
    cashflowAnnuel + cashFinalNet
  ];

  const triNom = calculTRIBissection(fluxTresorerie);
  const triReelCalc = triNom !== null ? triReel(triNom, inflation) : null;

  return {
    triNominal: triNom,
    triReel: triReelCalc
  };
}

// Calcul de la valeur future
export function valeurProjetee(valeurInitiale: number, tauxCroissance: number, annees: number): number {
  return valeurInitiale * Math.pow(1 + tauxCroissance, annees);
}

// Vérification conformité HCSF
export function verificationHCSF(dti: number): {
  conforme: boolean;
  message: string;
} {
  const seuilHCSF = 0.35; // 35%
  
  if (dti <= seuilHCSF) {
    return {
      conforme: true,
      message: "✓ Conforme aux critères HCSF"
    };
  } else {
    return {
      conforme: false,
      message: `⚠️ Attention: DTI de ${(dti * 100).toFixed(1)}% supérieur à 35% - Dérogation HCSF requise`
    };
  }
}