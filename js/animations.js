/*!
 * animations.js — Animation visuelle de la séance.
 * Échelle de la "bulle" de respiration (easing organique) et synchronisation du
 * personnage articulé "mime" (SVG coudes/genoux) avec le mouvement de la phase.
 */
  /* ---------- Échelles de la bulle (animation organique) ---------- */
  const ECHELLE_MIN = 0.68, ECHELLE_MAX = 1, ECHELLE_MAINTIEN = 0.9;
  const SETTLE = 1.1; // secondes de transition douce vers un maintien / repos
  const easeInOut = x => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

  function echelleDe(phase, tIn){
    if (phase.type === "inspire" || phase.type === "expire"){
      return phase.debutEchelle + (phase.finEchelle - phase.debutEchelle) * easeInOut(tIn / phase.dur);
    }
    const settle = Math.min(SETTLE, phase.dur);
    if (settle > 0 && tIn < settle){
      return phase.debutEchelle + (phase.finEchelle - phase.debutEchelle) * easeInOut(tIn / settle);
    }
    return phase.finEchelle;
  }
  function placerBulle(echelle){ $("cercle").style.transform = "scale(" + echelle + ")"; }

  /* Met le personnage « mime » en phase avec le mouvement courant (en rythme) */
  function majMime(phase){
    if (!curExo || !curExo.mime) return;
    const fig = $("bonhomme");
    fig.style.setProperty("--mime-dur", (phase.dur || 4) + "s");
    fig.setAttribute("class", "bonhomme-anim mv-" + (phase.mime || "idle"));
  }
