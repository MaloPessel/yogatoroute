/*!
 * audio.js — Moteur audio complet.
 * Cloche (ding), musique d'ambiance dynamique par section (avec repli mémorisé),
 * repères vocaux (inspire / bloque / expire) + ducking, et déverrouillage mobile
 * (iOS/Android) réalisé dans le geste utilisateur.
 * Chemins : les fichiers sont résolus relativement au DOCUMENT (index.html, à la
 * racine) — "assets/…" reste donc valide bien que ce script vive dans js/.
 */
  /* ============================================================
     AUDIO (chaîne complète conservée de l'app d'origine)
     ============================================================ */
  const A = {
    ding:    new Audio("assets/ding.mp3"),
    music:   new Audio("assets/music.mp3"),
    inspire: new Audio("assets/inspire.mp3"),  // repère vocal « inspirez »
    bloque:  new Audio("assets/bloque.mp3"),   // repère vocal « bloquez » (rétention)
    expire:  new Audio("assets/expire.mp3")    // repère vocal « expirez »
  };
  [A.ding, A.music, A.inspire, A.bloque, A.expire].forEach(el => { el.preload = "auto"; });
  A.music.loop  = true;
  A.ding.volume = 0.7;

  const MUSIQUE_VOL = 0.35, MUSIQUE_VOL_DUCK = 0.15;
  A.music.volume = MUSIQUE_VOL;
  const VOIX = { inspire: A.inspire, pause: A.bloque, expire: A.expire };

  /* --- Musique dynamique : une bande-son par section, avec repli automatique ---
     Section 1 (respiration) = music.mp3, section 2 (étirement) = music2.mp3,
     section 3 (récupération) = music3.mp3. Si un fichier est absent/illisible,
     l'app se rabat proprement sur music.mp3 (repli mémorisé, aucune régression). --- */
  const MUSIQUE_SRC = {
    respiration:  "assets/music.mp3",    // section 1 — piste d'origine
    etirement:    "assets/music2.mp3",   // section 2
    recuperation: "assets/music3.mp3"    // section 3
  };
  const MUSIQUE_REPLI = "assets/music.mp3";   // piste par défaut, toujours présente
  const _musiqueKO = {};                      // pistes absentes déjà repérées (repli mémorisé)
  function _memeSrc(url){ return A.music.src.endsWith(url) || (A.music.currentSrc || "").endsWith(url); }
  function _jouerSrc(url){
    try{
      if (!_memeSrc(url)) A.music.src = url;
      A.music.currentTime = 0; A.music.volume = MUSIQUE_VOL;
      const p = A.music.play(); if (p && p.catch) p.catch(() => {});
    }catch(e){}
  }
  // Charge et joue la piste de la section ; si le fichier est absent/illisible → repli music.mp3.
  function demarrerMusique(section){
    const primaire = (!_musiqueKO[section] && MUSIQUE_SRC[section]) || MUSIQUE_REPLI;
    A.music.dataset.repli = (primaire === MUSIQUE_REPLI) ? "1" : "0";
    A.music.onerror = () => {
      if (A.music.dataset.repli === "1") return;   // le repli a lui-même échoué : silence
      _musiqueKO[section] = true;                  // on ne réessaiera plus cette piste (moins de bruit)
      A.music.dataset.repli = "1";
      _jouerSrc(MUSIQUE_REPLI);
    };
    _jouerSrc(primaire);
  }

  const DUREE_INTRO = 5;   // durée totale de l'intro, en secondes
  const DING_DUREE  = 2;   // durée de assets/ding.mp3, en secondes
  const attendre = ms => new Promise(r => setTimeout(r, ms));

  // Joue le « ding » et résout à la fin du son (repli minuté si l'audio est bloqué).
  function jouerDing(){
    return new Promise(resolve => {
      let fait = false;
      const fin = () => { if (fait) return; fait = true; clearTimeout(repli); A.ding.removeEventListener("ended", fin); resolve(); };
      A.ding.addEventListener("ended", fin, { once:true });
      const repli = setTimeout(fin, DING_DUREE * 1000 + 400);
      try {
        A.ding.pause(); A.ding.currentTime = 0;
        const p = A.ding.play(); if (p && p.catch) p.catch(() => {});
      } catch(e){}
    });
  }
  function stopAudio(){
    arreterVoix(false);
    if (fadeMusiqueRAF){ cancelAnimationFrame(fadeMusiqueRAF); fadeMusiqueRAF = null; }
    try{ A.ding.pause(); A.ding.currentTime = 0; }catch(e){}
    try{ A.music.pause(); A.music.currentTime = 0; }catch(e){}
    A.music.volume = MUSIQUE_VOL;
  }

  // Ducking : la musique s'efface en douceur le temps d'un repère vocal, puis remonte.
  let fadeMusiqueRAF = null;
  function fondreMusique(cible, duree){
    if (fadeMusiqueRAF){ cancelAnimationFrame(fadeMusiqueRAF); fadeMusiqueRAF = null; }
    duree = duree || 180;
    const depart = A.music.volume, tf = performance.now();
    const pas = () => {
      const k = Math.min(1, (performance.now() - tf) / duree);
      A.music.volume = depart + (cible - depart) * k;
      fadeMusiqueRAF = k < 1 ? requestAnimationFrame(pas) : null;
    };
    pas();
  }
  let voixCourante = null;
  function arreterVoix(restaurerMusique){
    if (voixCourante){
      voixCourante.el.removeEventListener("ended", voixCourante.onEnded);
      try{ voixCourante.el.pause(); voixCourante.el.currentTime = 0; }catch(e){}
      voixCourante = null;
    }
    if (restaurerMusique) fondreMusique(MUSIQUE_VOL);
  }
  function jouerVoix(type){
    const el = VOIX[type];
    if (!el) return;                  // maintien / repos : pas de repère vocal
    arreterVoix(false);
    fondreMusique(MUSIQUE_VOL_DUCK);
    const onEnded = () => arreterVoix(true);
    voixCourante = { el, onEnded };
    el.addEventListener("ended", onEnded);
    try{
      el.currentTime = 0;
      const p = el.play(); if (p && p.catch) p.catch(() => arreterVoix(true));
    }catch(e){ arreterVoix(true); }
  }
  // Déverrouille TOUS les sons via le geste utilisateur (clic sur une carte).
  let audioDeverrouille = false;
  function deverrouillerAudio(){
    if (audioDeverrouille) return;
    audioDeverrouille = true;
    [A.ding, A.music, A.inspire, A.bloque, A.expire].forEach(el => {
      try{
        el.muted = true;
        const p = el.play();
        const relacher = () => { try{ el.pause(); el.currentTime = 0; }catch(e){} el.muted = false; };
        if (p && p.then) p.then(relacher).catch(() => { el.muted = false; });
        else relacher();
      }catch(e){ el.muted = false; }
    });
  }
