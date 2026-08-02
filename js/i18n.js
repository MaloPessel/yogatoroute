/*!
 * i18n.js — Bilingue français / anglais (chargé juste après utils.js, AVANT data.js).
 *   T(fr,en)   : fabrique un texte bilingue → utilisé dans data.js, au plus près du contenu.
 *   tr(valeur) : résout un texte bilingue dans la langue courante (repli : français).
 *   t(cle)     : libellés d'interface (dictionnaire UI ci-dessous).
 *   tf(cle,v)  : idem avec substitution de variables « {nom} ».
 *   Bascule    : choisirLangue() / appliquerLangue() — met à jour le DOM statique
 *                (attributs data-i18n*) puis rafraîchit l'écran courant.
 *   La langue choisie est mémorisée dans localStorage (clé "yogatoroute:langue").
 */
  const LANGUES = ["fr", "en"];
  const LANGUE_DEFAUT = "fr";
  const STOCKAGE_LANGUE = "yogatoroute:langue";

  /* Repères vocaux (inspire / bloque / expire) : enregistrements en français uniquement.
     Ajouter "en" ici le jour où les voix anglaises existent dans assets/. */
  const VOIX_LANGUES = ["fr"];

  /* Langue de départ : choix mémorisé, sinon langue du navigateur, sinon français. */
  let LANGUE = (function(){
    let memo = null;
    try{ memo = localStorage.getItem(STOCKAGE_LANGUE); }catch(e){}
    if (LANGUES.includes(memo)) return memo;
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("fr") ? "fr" : (nav ? "en" : LANGUE_DEFAUT);
  })();

  /* ---------- Textes de contenu (data.js) ---------- */
  const T  = (fr, en) => ({ fr, en });
  const tr = v => (v && typeof v === "object") ? (v[LANGUE] || v.fr) : v;

  /* ---------- Dictionnaire d'interface ---------- */
  const UI = {
    fr: {
      "doc.titre":        "Yogatoroute — Votre aire de récupération sur l'autoroute",
      "doc.description":  "Quelques minutes de respiration, d'étirement ou de récupération guidée sur l'aire de repos avant de reprendre la route : moins de stress, plus d'attention au volant.",

      "header.accueilAria": "Retour à l'accueil",
      "header.badge":       "Mode pause",
      "header.langueAria":  "Choisir la langue",
      "header.frAria":      "Afficher l'application en français",
      "header.enAria":      "Afficher l'application en anglais",

      "accueil.titre":     "Vous êtes garé·e ?<br>Offrez-vous <em>une vraie pause</em>.",
      "accueil.intro":     "Respiration, étirement ou récupération express : quelques minutes guidées avant de reprendre la route. Moins de stress, plus d'attention au volant.",
      "accueil.ongletsAria": "Type de pause",
      "accueil.question":  "De quoi avez-vous besoin là, maintenant ?",
      "accueil.noteSecu":  "À pratiquer uniquement à l'arrêt, moteur coupé, sur une aire de repos.",
      "accueil.copyright": "© 2026 La team Jardins Secrets (NathandMalo). Tous droits réservés.",

      "onglet.respiration":  "Respiration",
      "onglet.etirement":    "Étirement",
      "onglet.recuperation": "Récup' rapide",

      "seance.preparez":     "Préparez-vous…",
      "seance.retour":       "Retour à l'accueil",
      "seance.retourAria":   "Retour à l'accueil (quitte la séance)",
      "seance.progression":  "Progression",
      "seance.restant":      "Encore {t}",
      "seance.termine":      "Terminé",

      "ctrl.precedent": "Mouvement précédent",
      "ctrl.suivant":   "Mouvement suivant",
      "ctrl.pause":     "Mettre en pause",
      "ctrl.reprendre": "Reprendre",

      "fin.titre":         "Bien joué. Bonne route !",
      "fin.recapAria":     "Récapitulatif de la séance",
      "fin.duree":         "durée",
      "fin.respirations":  "respirations",
      "fin.mouvements":    "mouvements",
      "fin.enchainer":     "Enchaîner avec",
      "fin.refaire":       "Refaire",
      "fin.autre":         "Faire un autre exercice"
    },
    en: {
      "doc.titre":        "Yogatoroute — Your recovery stop on the motorway",
      "doc.description":  "A few minutes of guided breathing, stretching or recovery at the rest area before you drive on: less stress, more focus at the wheel.",

      "header.accueilAria": "Back to home",
      "header.badge":       "Break mode",
      "header.langueAria":  "Choose language",
      "header.frAria":      "Show the app in French",
      "header.enAria":      "Show the app in English",

      "accueil.titre":     "Parked up?<br>Treat yourself to <em>a real break</em>.",
      "accueil.intro":     "Breathing, stretching or a quick reset: a few guided minutes before you drive on. Less stress, more focus at the wheel.",
      "accueil.ongletsAria": "Type of break",
      "accueil.question":  "What do you need right now?",
      "accueil.noteSecu":  "Only practise while parked, engine off, at a rest area.",
      "accueil.copyright": "© 2026 The Jardins Secrets team (NathandMalo). All rights reserved.",

      "onglet.respiration":  "Breathing",
      "onglet.etirement":    "Stretching",
      "onglet.recuperation": "Quick reset",

      "seance.preparez":     "Get ready…",
      "seance.retour":       "Back to home",
      "seance.retourAria":   "Back to home (ends the session)",
      "seance.progression":  "Progress",
      "seance.restant":      "{t} left",
      "seance.termine":      "Done",

      "ctrl.precedent": "Previous move",
      "ctrl.suivant":   "Next move",
      "ctrl.pause":     "Pause",
      "ctrl.reprendre": "Resume",

      "fin.titre":         "Well done. Safe travels!",
      "fin.recapAria":     "Session summary",
      "fin.duree":         "duration",
      "fin.respirations":  "breaths",
      "fin.mouvements":    "moves",
      "fin.enchainer":     "Follow up with",
      "fin.refaire":       "Do it again",
      "fin.autre":         "Try another exercise"
    }
  };

  function t(cle){
    const dico = UI[LANGUE] || UI[LANGUE_DEFAUT];
    return (cle in dico) ? dico[cle] : (UI[LANGUE_DEFAUT][cle] || cle);
  }
  function tf(cle, vars){
    return t(cle).replace(/\{(\w+)\}/g, (m, k) => (k in vars) ? vars[k] : m);
  }

  /* ---------- Bascule de langue ---------- */
  function choisirLangue(langue){
    if (!LANGUES.includes(langue) || langue === LANGUE) return;
    LANGUE = langue;
    try{ localStorage.setItem(STOCKAGE_LANGUE, langue); }catch(e){}
    appliquerLangue();
  }
  function majBoutonLangue(){
    document.querySelectorAll(".lang-opt").forEach(b => {
      const actif = b.dataset.langue === LANGUE;
      b.classList.toggle("actif", actif);
      b.setAttribute("aria-pressed", actif ? "true" : "false");
    });
  }

  /* Applique la langue : document, DOM statique (data-i18n*), puis écran courant. */
  function appliquerLangue(){
    document.documentElement.lang = LANGUE;
    document.title = t("doc.titre");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("doc.description"));

    document.querySelectorAll("[data-i18n]").forEach(el      => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML   = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });

    majBoutonLangue();
    rafraichirEcrans();
  }

  /* Retraduit ce qui est peint par JS, selon l'écran / l'étape en cours. */
  function rafraichirEcrans(){
    rendreListe(sectionCourante);
    voixActive = (sectionCourante === "respiration") && VOIX_LANGUES.includes(LANGUE);
    majBoutonPause();

    if (curExo){
      $("seance-titre").textContent     = tr(curExo.titre);
      $("seance-sous-titre").textContent = tr(curExo.sousTitre);
    }
    const section = SECTIONS[sectionCourante];
    if (etat === "intro"){
      $("phase").textContent = t("seance.preparez");
      $("sous-consigne").textContent = tr(section.intro);
      $("temps-restant").textContent = tf("seance.restant", { t: fmt(dureeTotale) });
    } else if (etat === "exercice"){
      idxPhaseAffiche = -1; compteAffiche = -1; restantAffiche = -1;   // force le repaint des libellés
      rendreFrame(_elapsedCourant());
    } else if (etat === "conclusion"){
      $("phase").textContent = tr(section.outro);
      $("temps-restant").textContent = t("seance.termine");
    } else {
      // Accueil / fin : la séance est hors écran — on remet ses zones aria-live au neutre
      // pour ne pas y laisser traîner du texte dans l'ancienne langue.
      $("sous-consigne").innerHTML = "&nbsp;";
      $("temps-restant").textContent = "";
      if (etat === "fin") afficherFin();
    }
  }
