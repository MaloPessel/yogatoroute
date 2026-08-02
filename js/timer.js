/*!
 * timer.js — Moteur temporel de la séance.
 * État de session, construction de la timeline, horloge requestAnimationFrame
 * (rendu image par image), contrôles de lecture (pause / avance / recul) et
 * conclusion de l'exercice.
 */
  /* ---------- État de session ---------- */
  let sectionCourante = "respiration";
  let etat = "accueil";          // accueil | intro | exercice | conclusion | fin
  let timeline = [], bornes = [], dureeTotale = 0;
  let t0 = 0, rafId = null, idxPhaseAffiche = -1, compteAffiche = -1, restantAffiche = -1;
  let jetonLancement = 0;
  let voixActive = false;
  let curExo = null, prochain = null;
  let enPause = false, pauseElapsed = 0;   // contrôles multimédia

  /* ---------- Construction de la timeline ---------- */
  function construireTimeline(exo){
    let phases;
    if (exo.type === "souffle"){
      const dureeCycle = exo.cycle.reduce((s,p) => s + p.dur, 0);
      const nbCycles = Math.max(1, Math.round(exo.cible / dureeCycle));
      phases = [];
      for (let c = 0; c < nbCycles; c++) exo.cycle.forEach(p => phases.push(Object.assign({}, p)));
    } else {
      phases = exo.timeline.map(p => Object.assign({}, p));
    }
    let echelle = ECHELLE_MIN, temps = 0;
    phases.forEach(p => {
      p.debutEchelle = echelle;
      if      (p.type === "inspire")  p.finEchelle = ECHELLE_MAX;
      else if (p.type === "expire")   p.finEchelle = ECHELLE_MIN;
      else if (p.type === "maintien") p.finEchelle = ECHELLE_MAINTIEN;
      else if (p.type === "repos")    p.finEchelle = ECHELLE_MIN;
      else                            p.finEchelle = echelle; // pause : tient l'état courant
      p.debut = temps; temps += p.dur; echelle = p.finEchelle;
    });
    timeline = phases; dureeTotale = temps; bornes = phases.map(p => p.debut);
  }

  /* ---------- Rendu d'une image à l'instant `elapsed` (partagé boucle / saut) ---------- */
  function rendreFrame(elapsed){
    if (elapsed >= dureeTotale){
      placerBulle(timeline[timeline.length - 1].finEchelle);
      $("barre").style.transform = "scaleX(1)";
      $("compte").textContent = "";
      return true;                               // exercice terminé
    }
    let idx = 0;
    while (idx < timeline.length - 1 && elapsed >= bornes[idx + 1]) idx++;
    const phase = timeline[idx];
    const tIn = elapsed - phase.debut;

    if (idx !== idxPhaseAffiche){
      $("phase").textContent = tr(phase.label);
      $("sous-consigne").innerHTML = phase.sub ? tr(phase.sub) : "&nbsp;";
      idxPhaseAffiche = idx;
      majMime(phase);
      if (voixActive) jouerVoix(phase.type);     // repère vocal pile au changement de phase
    }
    const compte = Math.max(1, Math.ceil(phase.dur - tIn));
    if (compte !== compteAffiche){ $("compte").textContent = compte; compteAffiche = compte; }

    placerBulle(echelleDe(phase, tIn));
    $("barre").style.transform = "scaleX(" + (elapsed / dureeTotale) + ")";

    const restant = Math.max(0, Math.ceil(dureeTotale - elapsed));
    if (restant !== restantAffiche){
      $("temps-restant").textContent = restant > 0 ? tf("seance.restant", { t: fmt(restant) }) : t("seance.termine");
      restantAffiche = restant;
    }
    return false;
  }

  /* ---------- Boucle d'animation : une seule horloge rAF ---------- */
  function boucle(){
    if (enPause) return;
    const elapsed = (performance.now() - t0) / 1000;
    if (rendreFrame(elapsed)){ conclure(); return; }
    rafId = requestAnimationFrame(boucle);
  }

  /* ---------- Contrôles multimédia (reliés au minuteur) ---------- */
  function majBoutonPause(){
    const b = $("btn-pause"); if (!b) return;
    b.innerHTML = icon(enPause ? "play" : "pause", 22);
    b.setAttribute("aria-label", enPause ? t("ctrl.reprendre") : t("ctrl.pause"));
  }
  function basculerPause(){
    if (etat !== "exercice") return;
    if (!enPause){
      enPause = true;
      if (rafId){ cancelAnimationFrame(rafId); rafId = null; }
      pauseElapsed = (performance.now() - t0) / 1000;   // fige l'horloge
      try{ A.music.pause(); }catch(e){}
      arreterVoix(false);
      $("ecran-seance").classList.add("en-pause");       // fige halo + personnage
    } else {
      enPause = false;
      t0 = performance.now() - pauseElapsed * 1000;       // reprend là où on s'était arrêté
      try{ const p = A.music.play(); if (p && p.catch) p.catch(() => {}); }catch(e){}
      $("ecran-seance").classList.remove("en-pause");
      rafId = requestAnimationFrame(boucle);
    }
    majBoutonPause();
  }
  // Repositionne l'horloge à `target` secondes (fonctionne en lecture comme en pause)
  function sauterA(target){
    target = Math.max(0, Math.min(target, Math.max(0, dureeTotale - 0.05)));
    idxPhaseAffiche = -1; compteAffiche = -1; restantAffiche = -1;
    if (enPause){ pauseElapsed = target; rendreFrame(target); }   // repeint une image, sans reprendre
    else { t0 = performance.now() - target * 1000; }              // la boucle en cours prend le relais
  }
  function _elapsedCourant(){ return enPause ? pauseElapsed : (performance.now() - t0) / 1000; }
  function _idxCourant(elapsed){ let i = 0; while (i < timeline.length - 1 && elapsed >= bornes[i + 1]) i++; return i; }
  function phaseSuivante(){
    if (etat !== "exercice") return;
    const idx = _idxCourant(_elapsedCourant());
    if (idx >= timeline.length - 1){                 // dernière phase → on termine
      if (enPause){ enPause = false; $("ecran-seance").classList.remove("en-pause"); majBoutonPause(); }
      if (rafId){ cancelAnimationFrame(rafId); rafId = null; }
      conclure();
      return;
    }
    sauterA(bornes[idx + 1]);
  }
  function phasePrecedente(){
    if (etat !== "exercice") return;
    const elapsed = _elapsedCourant();
    const idx = _idxCourant(elapsed);
    const tIn = elapsed - bornes[idx];
    // Bien entamée (> 1,5 s) ou déjà 1re phase → on la reprend ; sinon on recule d'un mouvement
    sauterA(bornes[(tIn > 1.5 || idx === 0) ? idx : idx - 1]);
  }

  /* ---------- Conclusion (message outro + cloche) → écran Fin ---------- */
  function conclure(){
    cancelAnimationFrame(rafId); rafId = null;
    arreterVoix(false);
    if (fadeMusiqueRAF){ cancelAnimationFrame(fadeMusiqueRAF); fadeMusiqueRAF = null; }
    try{ A.music.pause(); }catch(e){}
    A.music.volume = MUSIQUE_VOL;
    etat = "conclusion";

    // Fin de l'exercice : on neutralise les contrôles
    enPause = false; majBoutonPause();
    $("controles").classList.add("inactif");
    $("ecran-seance").classList.remove("en-pause");

    const section = SECTIONS[sectionCourante];
    $("phase").textContent = tr(section.outro);
    $("sous-consigne").innerHTML = "&nbsp;";
    $("compte").textContent = "";
    $("temps-restant").textContent = t("seance.termine");

    jouerDing().then(() => {
      if (etat !== "conclusion") return;   // l'utilisateur a quitté pendant la conclusion
      etat = "fin";
      afficherFin();
      montrer("ecran-fin");
    });
  }
