/*!
 * data.js — Contenu de l'application (données pures, aucune logique).
 *   SECTIONS : 3 sections (respiration / etirement / recuperation), leurs exercices,
 *              phases (libellés, durées, type, mouvement "mime"), textes intro/outro/fin.
 *   NEXT     : rotation d'enchaînement inter-sections (écran de fin).
 *   TEINTE   : couleurs pâle/foncée par section (carte "Enchaîner avec").
 */
/* ============================================================
   DONNÉES : 3 sections, chacune avec sa couleur et ses exercices
   (textes intégralement conservés de l'application d'origine)
   - "souffle"   → cycle de respiration répété pour remplir la durée cible
   - "sequence"  → suite d'étapes jouée une seule fois
   Types de phase : inspire | expire | pause | maintien | repos
   ============================================================ */
  const SECTIONS = {
    respiration: {
      nom: "Respiration",
      intro: "La respiration va commencer au tintement de la cloche, fermez les yeux et détendez-vous.",
      outro: "La respiration est terminée.",
      finTexte: "Prenez encore un instant : buvez un peu d'eau, étirez la nuque et les épaules, puis reprenez le volant l'esprit clair.",
      exos: [
        { cle:"coherence", icon:"waves", titre:"Relâcher la pression",
          meta:"Cohérence cardiaque · 5 min", tag:"Anti-stress",
          sousTitre:"Inspirez 5 s, expirez 5 s. Laissez le rythme s'installer.",
          type:"souffle", cible:5*60,
          cycle:[ {label:"Inspirez",type:"inspire",dur:5}, {label:"Expirez",type:"expire",dur:5} ] },
        { cle:"478", icon:"moon", titre:"Calmer l'anxiété",
          meta:"Respiration 4-7-8 · 3 min", tag:"Apaisant",
          sousTitre:"Expirez lentement, comme si vous souffliez dans une paille.",
          type:"souffle", cible:3*60,
          cycle:[ {label:"Inspirez",type:"inspire",dur:4}, {label:"Retenez",type:"pause",dur:7}, {label:"Expirez",type:"expire",dur:8} ] },
        { cle:"carree", icon:"square", titre:"Se recentrer",
          meta:"Respiration carrée · 4 min", tag:"Concentration",
          sousTitre:"Quatre temps égaux, comme les quatre côtés d'un carré.",
          type:"souffle", cible:4*60,
          cycle:[ {label:"Inspirez",type:"inspire",dur:4}, {label:"Retenez",type:"pause",dur:4}, {label:"Expirez",type:"expire",dur:4}, {label:"Retenez",type:"pause",dur:4} ] },
      ]
    },

    etirement: {
      nom: "Étirement",
      intro: "La séance d'étirement va commencer au tintement de la cloche. Installez-vous confortablement et détendez-vous.",
      outro: "Les étirements sont terminés.",
      finTexte: "Vos muscles sont détendus. Buvez un peu d'eau et reprenez la route en souplesse.",
      exos: [
        { cle:"nuque", icon:"etir-nuque", titre:"Dénouer la nuque",
          meta:"Nuque & cervicales · 2 min", tag:"Anti-tensions",
          sousTitre:"Mouvements lents, sans forcer. Respirez profondément.",
          type:"sequence", mime:true,
          timeline:[
            { label:"Penchez la tête à droite",    type:"maintien", dur:20, sub:"vers l'épaule, sans forcer", mime:"tete-d" },
            { label:"Revenez au centre",           type:"repos",    dur:6,  mime:"idle" },
            { label:"Penchez la tête à gauche",    type:"maintien", dur:20, sub:"épaules relâchées", mime:"tete-g" },
            { label:"Revenez au centre",           type:"repos",    dur:6,  mime:"idle" },
            { label:"Menton vers la poitrine",     type:"maintien", dur:20, sub:"étirez l'arrière du cou", mime:"menton" },
            { label:"Regardez lentement à droite", type:"maintien", dur:15, mime:"regard-d" },
            { label:"Regardez lentement à gauche", type:"maintien", dur:15, mime:"regard-g" },
            { label:"Revenez, épaules basses",     type:"repos",    dur:8,  mime:"idle" }
          ] },
        { cle:"epaules", icon:"etir-epaules", titre:"Ouvrir les épaules",
          meta:"Épaules & haut du dos · 3 min", tag:"Détente",
          sousTitre:"Idéal après de longues heures les mains sur le volant.",
          type:"sequence", mime:true,
          timeline:[
            { label:"Roulez les épaules en arrière", type:"maintien", dur:20, sub:"grands cercles lents", mime:"epaules" },
            { label:"Roulez les épaules en avant",   type:"maintien", dur:20, mime:"epaules-av" },
            { label:"Bras droit devant la poitrine", type:"maintien", dur:25, sub:"tirez avec l'autre main", mime:"bras-avant-d" },
            { label:"Bras gauche devant la poitrine",type:"maintien", dur:25, mime:"bras-avant-g" },
            { label:"Étirez les bras vers le ciel",  type:"maintien", dur:20, sub:"grandissez-vous", mime:"bras-ciel" },
            { label:"Arrondissez le dos",            type:"maintien", dur:22, sub:"menton rentré", mime:"dos-rond" },
            { label:"Ouvrez la poitrine",            type:"maintien", dur:22, sub:"mains croisées derrière le dos", mime:"poitrine" },
            { label:"Relâchez tout",                 type:"repos",    dur:10, mime:"idle" }
          ] },
        { cle:"jambes", icon:"etir-jambes", titre:"Réveiller les jambes",
          meta:"Hanches & jambes · 3 min", tag:"Circulation",
          sousTitre:"Debout près du véhicule, gardez un appui stable.",
          type:"sequence", mime:true,
          timeline:[
            { label:"Montez sur la pointe des pieds", type:"maintien", dur:18, sub:"puis redescendez lentement", mime:"pointe" },
            { label:"Talon-fesse, jambe droite",      type:"maintien", dur:20, sub:"appui stable", mime:"talon-d" },
            { label:"Talon-fesse, jambe gauche",      type:"maintien", dur:20, mime:"talon-g" },
            { label:"Fente avant douce à droite",     type:"maintien", dur:25, sub:"dos droit", mime:"fente-d" },
            { label:"Fente avant douce à gauche",     type:"maintien", dur:25, sub:"dos droit", mime:"fente-g" },
            { label:"Rotations du bassin",            type:"maintien", dur:20, sub:"dans un sens", mime:"bassin" },
            { label:"Rotations du bassin",            type:"maintien", dur:20, sub:"puis dans l'autre", mime:"bassin-inv" },
            { label:"Secouez les jambes, relâchez",   type:"repos",    dur:10, mime:"secouer" }
          ] }
      ]
    },

    recuperation: {
      nom: "Récupération rapide",
      intro: "La séance va commencer au tintement de la cloche. Installez-vous confortablement et détendez-vous.",
      outro: "La séance est terminée.",
      finTexte: "Vous voilà plus alerte. Vérifiez votre vigilance : en cas de fatigue, accordez-vous une vraie sieste avant de repartir.",
      exos: [
        { cle:"reveil", icon:"zap", titre:"Réveil express",
          meta:"Anti coup de barre · 2 min", tag:"Vigilance",
          sousTitre:"Un coup de fouet doux pour retrouver de l'attention.",
          type:"sequence",
          timeline:[
            { label:"Frottez vos mains l'une contre l'autre", type:"maintien", dur:12, sub:"jusqu'à sentir la chaleur" },
            { label:"Posez vos paumes chaudes sur les yeux",  type:"repos",    dur:12 },
            { label:"Inspirez à fond par le nez",             type:"inspire",  dur:4 },
            { label:"Soufflez fort par la bouche",            type:"expire",   dur:4 },
            { label:"Inspirez à fond par le nez",             type:"inspire",  dur:4 },
            { label:"Soufflez fort par la bouche",            type:"expire",   dur:4 },
            { label:"Inspirez à fond par le nez",             type:"inspire",  dur:4 },
            { label:"Soufflez fort par la bouche",            type:"expire",   dur:4 },
            { label:"Étirez les bras vers le ciel le plus loin possible", type:"maintien", dur:18, sub:"allongez bien le dos" },
            { label:"Massez la nuque et les tempes",          type:"maintien", dur:20 },
            { label:"Ouvrez grand les yeux, respirez",        type:"repos",    dur:10 }
          ] },
        { cle:"detente", icon:"droplet", titre:"Détente éclair",
          meta:"Relâchement · 90 s", tag:"Apaisant",
          sousTitre:"Quand la tension monte : un sas de calme très court.",
          type:"sequence",
          timeline:[
            { label:"Relâchez les épaules",   type:"repos",    dur:10, sub:"laissez-les tomber" },
            { label:"Desserrez la mâchoire",  type:"repos",    dur:10, sub:"langue détendue" },
            { label:"Inspirez lentement",     type:"inspire",  dur:5 },
            { label:"Expirez longuement",     type:"expire",   dur:8 },
            { label:"Inspirez lentement",     type:"inspire",  dur:5 },
            { label:"Expirez longuement",     type:"expire",   dur:8 },
            { label:"Inspirez lentement",     type:"inspire",  dur:5 },
            { label:"Expirez longuement",     type:"expire",   dur:8 },
            { label:"Corps lourd et détendu", type:"repos",    dur:15, sub:"fermez les yeux, savourez le calme" }
          ] },
        { cle:"recharge", icon:"battery-charging", titre:"Recharge complète",
          meta:"Regain d'énergie · 3 min", tag:"Énergie",
          sousTitre:"Alterne respiration active et mobilité pour repartir en forme.",
          type:"sequence", mime:true,
          timeline:[
            { label:"Inspirez en levant les bras",  type:"inspire",  dur:5, sub:"ouvrez la cage thoracique", mime:"souffle-in" },
            { label:"Expirez en baissant les bras", type:"expire",   dur:5, mime:"souffle-out" },
            { label:"Inspirez en levant les bras",  type:"inspire",  dur:5, mime:"souffle-in" },
            { label:"Expirez en baissant les bras", type:"expire",   dur:5, mime:"souffle-out" },
            { label:"Rotations des épaules",        type:"maintien", dur:20, mime:"epaules" },
            { label:"Inclinez le buste à droite",   type:"maintien", dur:20, sub:"étirez le côté", mime:"incline-d" },
            { label:"Inclinez le buste à gauche",   type:"maintien", dur:20, mime:"incline-g" },
            { label:"Marchez sur place, énergique",  type:"maintien", dur:25, sub:"montez les genoux", mime:"marche" },
            { label:"Grande inspiration",           type:"inspire",  dur:5, mime:"souffle-in" },
            { label:"Longue expiration, souriez",   type:"expire",   dur:7, mime:"souffle-out" },
            { label:"Respirez, prêt·e à repartir",  type:"repos",    dur:15, mime:"idle" }
          ] }
      ]
    }
  };

  /* Rotation d'enchaînement (fin de séance → « Enchaîner avec ») */
  const NEXT = {
    respiration:  { section:"etirement",    key:"nuque" },
    etirement:    { section:"recuperation", key:"reveil" },
    recuperation: { section:"respiration",  key:"coherence" }
  };
  /* Teintes de section (carte d'enchaînement uniquement) */
  const TEINTE = {
    respiration:  { pale:"#F3E4EC", fort:"#6E3E5C" },
    etirement:    { pale:"#EDF3E7", fort:"#43603A" },
    recuperation: { pale:"#E7EAF4", fort:"#2E3C63" }
  };
