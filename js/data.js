/*!
 * data.js — Contenu de l'application (données pures, aucune logique).
 *   SECTIONS : 3 sections (respiration / etirement / recuperation), leurs exercices,
 *              phases (libellés, durées, type, mouvement "mime"), textes intro/outro/fin.
 *   NEXT     : rotation d'enchaînement inter-sections (écran de fin).
 *   TEINTE   : couleurs pâle/foncée par section (carte "Enchaîner avec").
 *
 *   BILINGUE : tout texte affiché est écrit T("français", "english") — les deux versions
 *              restent côte à côte, impossible d'en oublier une. Résolution à l'affichage
 *              via tr() (voir js/i18n.js, chargé AVANT ce fichier).
 */
/* ============================================================
   DONNÉES : 3 sections, chacune avec sa couleur et ses exercices
   - "souffle"   → cycle de respiration répété pour remplir la durée cible
   - "sequence"  → suite d'étapes jouée une seule fois
   Types de phase : inspire | expire | pause | maintien | repos
   ============================================================ */
  const SECTIONS = {
    respiration: {
      nom: T("Respiration", "Breathing"),
      intro: T("La respiration va commencer au tintement de la cloche, fermez les yeux et détendez-vous.",
               "The breathing session will start at the sound of the bell. Close your eyes and relax."),
      outro: T("La respiration est terminée.", "The breathing session is over."),
      finTexte: T("Prenez encore un instant : buvez un peu d'eau, étirez la nuque et les épaules, puis reprenez le volant l'esprit clair.",
                  "Take another moment: drink a little water, stretch your neck and shoulders, then take the wheel with a clear mind."),
      exos: [
        { cle:"coherence", icon:"waves",
          titre: T("Relâcher la pression", "Release the pressure"),
          meta:  T("Cohérence cardiaque · 5 min", "Heart coherence · 5 min"),
          tag:   T("Anti-stress", "Stress relief"),
          sousTitre: T("Inspirez 5 s, expirez 5 s. Laissez le rythme s'installer.",
                       "Breathe in for 5 s, out for 5 s. Let the rhythm settle."),
          type:"souffle", cible:5*60,
          cycle:[ { label:T("Inspirez","Breathe in"), type:"inspire", dur:5 },
                  { label:T("Expirez","Breathe out"), type:"expire",  dur:5 } ] },

        { cle:"478", icon:"moon",
          titre: T("Calmer l'anxiété", "Calm your anxiety"),
          meta:  T("Respiration 4-7-8 · 3 min", "4-7-8 breathing · 3 min"),
          tag:   T("Apaisant", "Soothing"),
          sousTitre: T("Expirez lentement, comme si vous souffliez dans une paille.",
                       "Breathe out slowly, as if blowing through a straw."),
          type:"souffle", cible:3*60,
          cycle:[ { label:T("Inspirez","Breathe in"), type:"inspire", dur:4 },
                  { label:T("Retenez","Hold"),        type:"pause",   dur:7 },
                  { label:T("Expirez","Breathe out"), type:"expire",  dur:8 } ] },

        { cle:"carree", icon:"square",
          titre: T("Se recentrer", "Refocus"),
          meta:  T("Respiration carrée · 4 min", "Box breathing · 4 min"),
          tag:   T("Concentration", "Focus"),
          sousTitre: T("Quatre temps égaux, comme les quatre côtés d'un carré.",
                       "Four equal counts, like the four sides of a square."),
          type:"souffle", cible:4*60,
          cycle:[ { label:T("Inspirez","Breathe in"), type:"inspire", dur:4 },
                  { label:T("Retenez","Hold"),        type:"pause",   dur:4 },
                  { label:T("Expirez","Breathe out"), type:"expire",  dur:4 },
                  { label:T("Retenez","Hold"),        type:"pause",   dur:4 } ] },
      ]
    },

    etirement: {
      nom: T("Étirement", "Stretching"),
      intro: T("La séance d'étirement va commencer au tintement de la cloche. Installez-vous confortablement et détendez-vous.",
               "The stretching session will start at the sound of the bell. Get comfortable and relax."),
      outro: T("Les étirements sont terminés.", "The stretches are over."),
      finTexte: T("Vos muscles sont détendus. Buvez un peu d'eau et reprenez la route en souplesse.",
                  "Your muscles are loose. Drink a little water and get back on the road feeling supple."),
      exos: [
        { cle:"nuque", icon:"etir-nuque",
          titre: T("Dénouer la nuque", "Loosen your neck"),
          meta:  T("Nuque & cervicales · 2 min", "Neck & upper spine · 2 min"),
          tag:   T("Anti-tensions", "Tension relief"),
          sousTitre: T("Mouvements lents, sans forcer. Respirez profondément.",
                       "Slow movements, never forcing. Breathe deeply."),
          type:"sequence", mime:true,
          timeline:[
            { label:T("Penchez la tête à droite","Tilt your head to the right"), type:"maintien", dur:20,
              sub:T("vers l'épaule, sans forcer","towards the shoulder, without forcing"), mime:"tete-d" },
            { label:T("Revenez au centre","Come back to the centre"), type:"repos", dur:6, mime:"idle" },
            { label:T("Penchez la tête à gauche","Tilt your head to the left"), type:"maintien", dur:20,
              sub:T("épaules relâchées","shoulders relaxed"), mime:"tete-g" },
            { label:T("Revenez au centre","Come back to the centre"), type:"repos", dur:6, mime:"idle" },
            { label:T("Menton vers la poitrine","Chin towards your chest"), type:"maintien", dur:20,
              sub:T("étirez l'arrière du cou","stretch the back of your neck"), mime:"menton" },
            { label:T("Regardez lentement à droite","Look slowly to the right"), type:"maintien", dur:15, mime:"regard-d" },
            { label:T("Regardez lentement à gauche","Look slowly to the left"),  type:"maintien", dur:15, mime:"regard-g" },
            { label:T("Revenez, épaules basses","Come back, shoulders down"),    type:"repos",    dur:8,  mime:"idle" }
          ] },

        { cle:"epaules", icon:"etir-epaules",
          titre: T("Ouvrir les épaules", "Open your shoulders"),
          meta:  T("Épaules & haut du dos · 3 min", "Shoulders & upper back · 3 min"),
          tag:   T("Détente", "Relaxation"),
          sousTitre: T("Idéal après de longues heures les mains sur le volant.",
                       "Ideal after long hours with your hands on the wheel."),
          type:"sequence", mime:true,
          timeline:[
            { label:T("Roulez les épaules en arrière","Roll your shoulders backwards"), type:"maintien", dur:20,
              sub:T("grands cercles lents","big slow circles"), mime:"epaules" },
            { label:T("Roulez les épaules en avant","Roll your shoulders forwards"), type:"maintien", dur:20, mime:"epaules-av" },
            { label:T("Bras droit devant la poitrine","Right arm across your chest"), type:"maintien", dur:25,
              sub:T("Entourez le bras avec le coude inverse","Wrap the arm with your opposite elbow"), mime:"bras-avant-d" },
            { label:T("Bras gauche devant la poitrine","Left arm across your chest"), type:"maintien", dur:25, mime:"bras-avant-g" },
            { label:T("Étirez les bras vers le ciel","Stretch your arms to the sky"), type:"maintien", dur:20,
              sub:T("grandissez-vous","make yourself taller"), mime:"bras-ciel" },
            { label:T("Arrondissez le dos","Round your back"), type:"maintien", dur:22,
              sub:T("menton rentré","chin tucked in"), mime:"dos-rond" },
            { label:T("Ouvrez la poitrine","Open your chest"), type:"maintien", dur:22,
              sub:T("mains croisées derrière le dos","hands clasped behind your back"), mime:"poitrine" },
            { label:T("Relâchez tout","Let everything go"), type:"repos", dur:10, mime:"idle" }
          ] },

        { cle:"jambes", icon:"etir-jambes",
          titre: T("Réveiller les jambes", "Wake up your legs"),
          meta:  T("Hanches & jambes · 3 min", "Hips & legs · 3 min"),
          tag:   T("Circulation", "Circulation"),
          sousTitre: T("Debout près du véhicule, gardez un appui stable.",
                       "Standing by your vehicle, keep a stable footing."),
          type:"sequence", mime:true,
          timeline:[
            { label:T("Montez sur la pointe des pieds","Rise up onto your toes"), type:"maintien", dur:18,
              sub:T("puis redescendez lentement","then lower down slowly"), mime:"pointe" },
            { label:T("Talon-fesse, jambe droite","Heel to buttock, right leg"), type:"maintien", dur:20,
              sub:T("appui stable","stable footing"), mime:"talon-d" },
            { label:T("Talon-fesse, jambe gauche","Heel to buttock, left leg"), type:"maintien", dur:20, mime:"talon-g" },
            { label:T("Fente avant douce à droite","Gentle forward lunge, right"), type:"maintien", dur:25,
              sub:T("dos droit","back straight"), mime:"fente-d" },
            { label:T("Fente avant douce à gauche","Gentle forward lunge, left"), type:"maintien", dur:25,
              sub:T("dos droit","back straight"), mime:"fente-g" },
            { label:T("Rotations du bassin","Hip circles"), type:"maintien", dur:20,
              sub:T("dans un sens","one way"), mime:"bassin" },
            { label:T("Rotations du bassin","Hip circles"), type:"maintien", dur:20,
              sub:T("puis dans l'autre","then the other"), mime:"bassin-inv" },
            { label:T("Secouez les jambes l'une après l'autre","Shake out your legs, one after the other"), type:"repos", dur:10,
              sub:T("relâchez tout","let everything go"), mime:"secouer" }
          ] }
      ]
    },

    recuperation: {
      nom: T("Récupération rapide", "Quick reset"),
      intro: T("La séance va commencer au tintement de la cloche. Installez-vous confortablement et détendez-vous.",
               "The session will start at the sound of the bell. Get comfortable and relax."),
      outro: T("La séance est terminée.", "The session is over."),
      finTexte: T("Vous voilà plus alerte. Vérifiez votre vigilance : en cas de fatigue, accordez-vous une vraie sieste avant de repartir.",
                  "You are more alert now. Check how you feel: if you are still tired, take a proper nap before setting off again."),
      exos: [
        { cle:"reveil", icon:"zap",
          titre: T("Réveil express", "Express wake-up"),
          meta:  T("Anti coup de barre · 2 min", "Beat the slump · 2 min"),
          tag:   T("Vigilance", "Alertness"),
          sousTitre: T("Un coup de fouet doux pour retrouver de l'attention.",
                       "A gentle boost to get your focus back."),
          type:"sequence",
          timeline:[
            { label:T("Frottez vos mains l'une contre l'autre","Rub your hands together"), type:"maintien", dur:12,
              sub:T("jusqu'à sentir la chaleur","until you feel the warmth") },
            { label:T("Posez vos paumes chaudes sur les yeux","Place your warm palms over your eyes"), type:"repos", dur:12 },
            { label:T("Inspirez à fond par le nez","Breathe in deeply through your nose"), type:"inspire", dur:4 },
            { label:T("Soufflez fort par la bouche","Blow out hard through your mouth"),   type:"expire",  dur:4 },
            { label:T("Inspirez à fond par le nez","Breathe in deeply through your nose"), type:"inspire", dur:4 },
            { label:T("Soufflez fort par la bouche","Blow out hard through your mouth"),   type:"expire",  dur:4 },
            { label:T("Inspirez à fond par le nez","Breathe in deeply through your nose"), type:"inspire", dur:4 },
            { label:T("Soufflez fort par la bouche","Blow out hard through your mouth"),   type:"expire",  dur:4 },
            { label:T("Étirez les bras vers le ciel le plus loin possible","Stretch your arms up as high as you can"), type:"maintien", dur:18,
              sub:T("allongez bien le dos","really lengthen your back") },
            { label:T("Massez la nuque et les tempes","Massage your neck and temples"), type:"maintien", dur:20 },
            { label:T("Ouvrez grand les yeux, respirez","Open your eyes wide, breathe"), type:"repos", dur:10 }
          ] },

        { cle:"detente", icon:"droplet",
          titre: T("Détente éclair", "Instant unwind"),
          meta:  T("Relâchement · 90 s", "Letting go · 90 s"),
          tag:   T("Apaisant", "Soothing"),
          sousTitre: T("Quand la tension monte : un sas de calme très court.",
                       "When tension rises: a very short pocket of calm."),
          type:"sequence",
          timeline:[
            { label:T("Relâchez les épaules","Drop your shoulders"), type:"repos", dur:10,
              sub:T("laissez-les tomber","let them fall") },
            { label:T("Desserrez la mâchoire","Unclench your jaw"), type:"repos", dur:10,
              sub:T("langue détendue","tongue relaxed") },
            { label:T("Inspirez lentement","Breathe in slowly"),      type:"inspire", dur:5 },
            { label:T("Expirez longuement","Breathe out at length"),  type:"expire",  dur:8 },
            { label:T("Inspirez lentement","Breathe in slowly"),      type:"inspire", dur:5 },
            { label:T("Expirez longuement","Breathe out at length"),  type:"expire",  dur:8 },
            { label:T("Inspirez lentement","Breathe in slowly"),      type:"inspire", dur:5 },
            { label:T("Expirez longuement","Breathe out at length"),  type:"expire",  dur:8 },
            { label:T("Corps lourd et détendu","Body heavy and relaxed"), type:"repos", dur:15,
              sub:T("fermez les yeux, savourez le calme","close your eyes, enjoy the calm") }
          ] },

        { cle:"recharge", icon:"battery-charging",
          titre: T("Recharge complète", "Full recharge"),
          meta:  T("Regain d'énergie · 3 min", "Energy boost · 3 min"),
          tag:   T("Énergie", "Energy"),
          sousTitre: T("Alterne respiration active et mobilité pour repartir en forme.",
                       "Alternates active breathing and mobility so you set off in good shape."),
          type:"sequence", mime:true,
          timeline:[
            { label:T("Inspirez en levant les bras","Breathe in, raising your arms"), type:"inspire", dur:5,
              sub:T("ouvrez la cage thoracique","open your rib cage"), mime:"souffle-in" },
            { label:T("Expirez en baissant les bras","Breathe out, lowering your arms"), type:"expire", dur:5, mime:"souffle-out" },
            { label:T("Inspirez en levant les bras","Breathe in, raising your arms"),   type:"inspire", dur:5, mime:"souffle-in" },
            { label:T("Expirez en baissant les bras","Breathe out, lowering your arms"), type:"expire", dur:5, mime:"souffle-out" },
            { label:T("Rotations des épaules","Shoulder circles"), type:"maintien", dur:20, mime:"epaules" },
            { label:T("Inclinez le buste à droite","Lean your torso to the right"), type:"maintien", dur:20,
              sub:T("étirez le côté","stretch your side"), mime:"incline-d" },
            { label:T("Inclinez le buste à gauche","Lean your torso to the left"), type:"maintien", dur:20, mime:"incline-g" },
            { label:T("Marchez sur place, énergique","March on the spot, briskly"), type:"maintien", dur:25,
              sub:T("montez les genoux","lift your knees"), mime:"marche" },
            { label:T("Grande inspiration","Big breath in"),            type:"inspire", dur:5, mime:"souffle-in" },
            { label:T("Longue expiration, souriez","Long breath out, smile"), type:"expire", dur:7, mime:"souffle-out" },
            { label:T("Respirez, prêt·e à repartir","Breathe, ready to go"), type:"repos", dur:15, mime:"idle" }
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
