/*!
 * app.js — Interface & orchestration (point d'entrée, chargé en dernier).
 * Navigation entre écrans, thème par section, rendu des cartes, lancement d'un
 * exercice, écran de fin (récap + enchaînement), raccourcis clavier et amorçage.
 */
  /* ---------- Navigation & thème ---------- */
  function montrer(id){
    document.querySelectorAll(".ecran").forEach(e => e.classList.remove("actif"));
    const el = $(id); el.classList.add("actif"); el.scrollTop = 0;
  }
  function appliquerTheme(sectionId){
    $app.setAttribute("data-section", sectionId);
    const pale = getComputedStyle($app).getPropertyValue("--accent-pale").trim();
    document.querySelector('meta[name="theme-color"]').setAttribute("content", pale);
  }
  function choisirSection(sectionId){
    sectionCourante = sectionId;
    appliquerTheme(sectionId);
    document.querySelectorAll(".onglet").forEach(o =>
      o.setAttribute("aria-selected", o.dataset.section === sectionId ? "true" : "false"));
    rendreListe(sectionId);
  }
  function rendreListe(sectionId){
    $("liste-exos").innerHTML = SECTIONS[sectionId].exos.map((e, i) =>
      '<button class="carte-exo" style="animation-delay:' + (i*0.05) + 's" onclick="lancerExo(\'' + sectionId + '\',\'' + e.cle + '\')">' +
        '<span class="pastille">' + icon(e.icon, 22) + '</span>' +
        '<span class="texte"><span class="titre-exo">' + e.titre + '</span><span class="meta">' + e.meta + '</span></span>' +
        '<span class="tag">' + e.tag + '</span>' +
      '</button>').join("");
  }

  /* Historique navigateur : on marque l'entrée en séance (history.pushState) pour que le
     geste « retour » natif du mobile (ou la flèche Précédent) ramène à l'accueil via popstate. */
  let sessionHistorique = false;
  function marquerSession(){
    if (!sessionHistorique){ history.pushState({ yoga: "seance" }, ""); sessionHistorique = true; }
  }
  function allerAccueil(){
    arreterTout();                 // stoppe la musique + les compteurs (rAF)
    choisirSection(sectionCourante);
    montrer("ecran-accueil");
    if (sessionHistorique){        // retour « in-app » : on retire l'entrée poussée (historique cohérent)
      sessionHistorique = false;
      history.back();              // déclenche popstate, déjà neutralisé par le flag remis à false
    }
  }

  /* ---------- Lancement d'un exercice ---------- */
  async function lancerExo(sectionId, cle){
    arreterTout();
    deverrouillerAudio();                        // déverrouille l'audio DANS le geste utilisateur
    marquerSession();                            // marque l'entrée en séance dans l'historique (retour mobile)
    const jeton = jetonLancement;
    sectionCourante = sectionId;
    voixActive = (sectionId === "respiration");  // repères vocaux réservés à la Respiration
    appliquerTheme(sectionId);

    const section = SECTIONS[sectionId];
    const exo = section.exos.find(e => e.cle === cle);
    curExo = exo;
    construireTimeline(exo);

    // En-tête de séance
    $("seance-titre").textContent = exo.titre;
    $("seance-sous-titre").textContent = exo.sousTitre;
    $("exo-icone").innerHTML = icon(exo.icon, 20);

    // Personnage « mime » : affiché pour les exos concernés (Étirements + Récup' exercice 3)
    $("scene").classList.toggle("avec-mime", !!exo.mime);
    $("bonhomme").setAttribute("class", "bonhomme-anim");   // posture neutre pendant l'intro

    // Contrôles : réinitialisés et désactivés pendant l'intro
    enPause = false; majBoutonPause();
    $("ecran-seance").classList.remove("en-pause");
    $("controles").classList.add("inactif");

    // --- Phase d'introduction (message AU-DESSUS de la bulle, puis tintement de cloche) ---
    etat = "intro";
    montrer("ecran-seance");
    $("phase").textContent = "Préparez-vous…";
    $("sous-consigne").textContent = section.intro;   // le petit texte d'intro : hors de la bulle, au-dessus
    $("compte").textContent = "";
    $("barre").style.transform = "scaleX(0)";
    $("temps-restant").textContent = "Encore " + fmt(dureeTotale);
    placerBulle(ECHELLE_MIN);

    const abandonne = () => jeton !== jetonLancement || etat !== "intro";
    await attendre(Math.max(0, (DUREE_INTRO - DING_DUREE) * 1000));
    if (abandonne()) return;
    await jouerDing();                           // la cloche sonne, l'exercice démarre à la fin du son
    if (abandonne()) return;

    // Musique d'ambiance : piste propre à la section (repli automatique)
    demarrerMusique(sectionId);

    idxPhaseAffiche = -1; compteAffiche = -1; restantAffiche = -1;
    etat = "exercice";
    enPause = false; majBoutonPause();
    $("controles").classList.remove("inactif");  // contrôles actifs pendant l'exercice
    t0 = performance.now();
    rafId = requestAnimationFrame(boucle);
  }

  function afficherFin(){
    const section = SECTIONS[sectionCourante];
    // Récapitulatif : nombre de respirations (souffle) ou de mouvements (séquence)
    let countVal, countLabel;
    if (curExo.type === "souffle"){ countVal = timeline.filter(p => p.type === "inspire").length; countLabel = "respirations"; }
    else { countVal = timeline.filter(p => p.type !== "repos").length; countLabel = "mouvements"; }
    $("recap-dur").textContent = fmt(dureeTotale);
    $("recap-count").textContent = countVal;
    $("recap-count-lab").textContent = countLabel;
    $("fin-texte").textContent = section.finTexte;

    // Enchaînement : exercice suggéré (rotation entre sections)
    const nx = NEXT[sectionCourante];
    const nxExo = SECTIONS[nx.section].exos.find(e => e.cle === nx.key);
    const t = TEINTE[nx.section];
    prochain = { section: nx.section, key: nx.key };
    const past = $("next-pastille");
    past.style.background = t.pale; past.style.color = t.fort;
    past.innerHTML = icon(nxExo.icon, 20);
    $("next-nom").textContent = nxExo.titre;
    $("next-meta").textContent = nxExo.meta;
    $("next-arrow").style.color = t.fort;
  }

  function goNext(){ if (prochain) lancerExo(prochain.section, prochain.key); }
  function refaire(){ if (curExo) lancerExo(sectionCourante, curExo.cle); }

  /* ---------- Arrêt / nettoyage ---------- */
  function arreterTout(){
    jetonLancement++;              // invalide tout lancement encore en attente du ding
    if (rafId){ cancelAnimationFrame(rafId); rafId = null; }
    stopAudio();
    enPause = false; majBoutonPause();
    const se = $("ecran-seance"); if (se) se.classList.remove("en-pause");
    const ctr = $("controles"); if (ctr) ctr.classList.add("inactif");
    const sc = $("scene"); if (sc) sc.classList.remove("avec-mime");
    etat = "accueil";
  }

  document.addEventListener("keydown", e => {
    if (!$("ecran-seance").classList.contains("actif")) return;
    // Retour en arrière (quitte la séance, arrête musique + compteurs) : Échap ou Retour arrière
    if (e.key === "Escape" || e.key === "Backspace"){ e.preventDefault(); allerAccueil(); return; }
    if (etat === "exercice"){                        // raccourcis des contrôles multimédia
      if (e.key === " " || e.code === "Space"){ e.preventDefault(); basculerPause(); }
      else if (e.key === "ArrowRight"){ e.preventDefault(); phaseSuivante(); }
      else if (e.key === "ArrowLeft"){ e.preventDefault(); phasePrecedente(); }
    }
  });

  // Geste « retour » natif du mobile / flèche Précédent du navigateur → retour à l'accueil.
  window.addEventListener("popstate", () => {
    if (sessionHistorique){        // on quittait une séance : le navigateur a déjà retiré l'entrée
      sessionHistorique = false;   // (mis à false AVANT allerAccueil pour ne pas re-déclencher history.back)
      allerAccueil();              // → arreterTout() : coupe musique + compteurs
    }
  });

  /* ---------- Amorçage ---------- */
  hydrateIcones();                 // remplit les icônes statiques (aucun réseau)
  choisirSection("respiration");
