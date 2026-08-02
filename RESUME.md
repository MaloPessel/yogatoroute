# RESUME — Yogatoroute

> Document d'analyse technique établi à partir du code (`index.html`, `assets/`, `logo.png`).
> La refonte UI/UX (section 0) a été **implémentée** : elle **conserve la palette** (section 5), **tous les textes d'origine**, **le logo** et **la logique audio**, et adapte la présentation au contenu existant.

---

## 0. Refonte UI/UX — état actuel (implémentée)

La refonte visuelle (prototype *« Yogatoroute – Prototype 1a »*, projet claude.ai/design *« Refonte UI/UX avec palette doré-violet »*) est **en place dans `index.html`**. Principe directeur : **le design s'adapte au contenu, pas l'inverse.**

**Conservé à l'identique :**
- **Tous les textes d'origine** — titres/sous-titres d'exercices, `meta`, tags, consignes et sous-consignes de phase, messages `intro`/`outro`/`finTexte`, accueil (« Vous êtes garé·e ? Offrez-vous *une vraie pause*. », question « De quoi avez-vous besoin là, maintenant ? »), note de sécurité, copyright, écran fin (« Bien joué. Bonne route ! », « Faire un autre exercice »).
- **Le logo** (`logo.png`) — réintégré dans l'en-tête, à gauche du mot-symbole « Yoga**to**route ».
- **La logique audio complète** — cloche (intro/outro), musique d'ambiance en boucle, repères vocaux (Respiration) + ducking, déverrouillage mobile. **Inchangée.**
- **La palette** (section 5) et la bascule de thème par section.
- **Le moteur de séance** — timeline aplatie, bulle peinte en rAF, easing, accessibilité (`aria-live`, focus visibles, `prefers-reduced-motion`), mise à jour `theme-color`.

**Nouveautés visuelles / fonctionnelles :**
- **Icônes SVG inlinées** (objet `ICONS`, jeu dérivé de Lucide) en remplacement des emojis → **aucune dépendance CDN pour les icônes ; l'app fonctionne hors-ligne** (seules les polices Google Fonts restent servies par CDN, avec repli `system-ui` — les icônes, elles, ne dépendent plus du réseau).
- **Nouvelle mise en page** des 3 écrans : en-tête mot-symbole + badge « Mode pause » à pastille ; onglets colonne (icône + libellé) ; cartes à pastille d'icône + **tag doré** ; séance recentrée avec **compteur au cœur de la bulle** ; écran fin repensé.
- **Récapitulatif de fin** (durée + nombre de respirations/mouvements) et **enchaînement** (« Enchaîner avec » : exercice suggéré, rotation inter-sections `NEXT`) — deux ajouts au parcours.

---

## 0.1 Itération 2 — retours clients (implémentée)

Nouveautés ajoutées lors d'une seconde passe de retours, **sans toucher au design, aux couleurs ni à la base technique** :

- **Textes** : dans *Réveiller les jambes* la **fente gauche** porte aussi « dos droit » ; dans *Réveil express* l'étirement des bras devient « **Étirez les bras vers le ciel le plus loin possible** » (sous-consigne « allongez bien le dos » ; imperatif, cohérent avec la voix de l'app) ; dans *Détente éclair* la dernière étape ajoute « **fermez les yeux** ».
- **Texte d'intro déplacé** : le message de préparation n'est plus dans la bulle — le libellé « Préparez-vous… » coiffe une **sous-consigne placée AU-DESSUS de la bulle** (`.sous-consigne` remontée entre `.phase-label` et `.scene`). Seul le décompte reste au centre de la bulle.
- **Contrôles multimédia** (`#controles`) sous la barre de progression : **Recule / Pause-Lecture / Avance**, reliés au minuteur (`basculerPause`, `phaseSuivante`, `phasePrecedente` via `sauterA` qui recale `t0`). Actifs pendant l'exercice, désactivés (`.inactif`) pendant l'intro/fin. Raccourcis clavier : **Espace** (pause), **←/→** (mouvement précédent/suivant).
- **Musique dynamique par section** : `demarrerMusique(section)` charge `assets/music-<section>.mp3` (respiration / etirement / recuperation) avec **repli automatique et mémorisé** sur `assets/music.mp3` si le fichier est absent → *déposer les 3 pistes dans `assets/` pour les activer*, aucune régression tant qu'elles manquent.
- **Icône Étirements** = personnage `bonhomme` (bras en l'air, jambes écartées, inspiré du logo), en remplacement de la feuille — onglet **et** cartes/en-tête de la section.
- **Personnage animé « mime »** (SVG inline `#bonhomme`, animé en CSS) au centre de la scène pour **Étirements** et **Récup' exercice 3 (Recharge)** : chaque phase porte un mot-clé `mime` joué **en rythme** (`--mime-dur` = durée de la phase). Figé en pause et en `prefers-reduced-motion`. *(Jeu d'animations enrichi en itération 3 — voir 0.2.)*

---

## 0.2 Itération 3 — réalisme des Étirements (implémentée)

- **Animations « mime » repensées, membre par membre.** Fin du « balancier » global (ancienne rotation de tout le bloc) : le repos (`idle`) est désormais une simple **respiration verticale**. Chaque phase anime précisément les bons membres, en rythme :
  - *tête* (le corps reste immobile) : `tete-d`/`tete-g` (inclinaisons nuque), `regard-d`/`regard-g`, `menton` ;
  - *bras* : `bras-ciel`, `souffle-in`/`souffle-out` (montent/descendent), `epaules`/`epaules-av` (roulement), `bras-avant-d`/`g`, `poitrine`, `dos-rond` ;
  - *buste* : `incline-d`/`incline-g` (inclinaison latérale + bras opposé au-dessus) ;
  - *jambes* : `pointe`, `talon-d`/`talon-g`, `fente-d`/`fente-g` (corps qui descend + jambes écartées), `marche` (jambes alternées), `bassin`/`bassin-inv`, `secouer`.
  Chaque membre pivote à **son articulation** (`transform-box:view-box` + `transform-origin` au cou / épaule / hanche), d'où des mouvements réellement indépendants.
- **Squelette articulé (itération 4)** : le personnage a désormais des **coudes et des genoux** (groupes SVG imbriqués `m-epaule→m-coude`, `m-hanche→m-genou` ; l'enfant pivote avant le parent → l'avant-bras/tibia restent attachés). Cela rend les poses bien plus justes — **fente à genou plié**, **talon-fesse** (tibia replié), étirements de bras coude fléchi (`bras-ciel`, `poitrine`, `dos-rond`, `bras-avant`). Style minimaliste et animation CSS fluides conservés ; figé en pause et `prefers-reduced-motion`.
- **3 icônes d'exercice sur les cartes** de la section Étirements — **métaphores d'origine** vectorisées façon Lucide (itération 5) : `etir-nuque` = **girafe** (long cou), `etir-epaules` = **pousse / branche** (sprout), `etir-jambes` = **feuille portée par le vent**. L'**onglet** et le titre de section gardent le bonhomme « étoile » comme identité. *(Ces cartes affichaient brièvement des poses de bonhomme en itération 3 ; remplacées ici par les métaphores.)*

---

## 0.3 Refactorisation modulaire — déploiement Netlify (implémentée)

Séparation **propre HTML / CSS / JS**, sans **aucune** modification de logique, de texte ni de couleur (refactoring pur — cf. §2 pour l'arborescence) :
- `index.html` (racine) ne contient plus que le markup + les liens vers `css/styles.css` et 7 modules `js/*.js`.
- CSS extrait dans `css/styles.css` ; JS découpé par responsabilité : `utils`, `icons`, `data`, `audio`, `animations`, `timer`, `app`.
- Scripts **classiques** (non-modules) chargés dans l'ordre de dépendance → fonctions globales conservées, handlers `onclick=` inline inchangés, site **sans build** (déployable tel quel sur Netlify).
- Chemins audio `assets/…` inchangés (résolus depuis `index.html`) → **déverrouillage mobile préservé**. Squelette SVG articulé et icônes intacts.
- Vérifié : contenu code **strictement identique** (aucune ligne perdue/altérée), app fonctionnelle de bout en bout, zéro erreur console.

---

## 0.4 Itération 4 — retours clients + bilingue FR/EN (implémentée)

**Retours de texte (2)** — dans `js/data.js` uniquement :
- *Réveiller les jambes* (Étirements, 3ᵉ exercice), dernière étape : « Secouez les jambes, relâchez » → « **Secouez les jambes l'une après l'autre** » (sous-consigne « relâchez tout »).
- *Ouvrir les épaules*, 3ᵉ mouvement : sous-consigne « tirez avec l'autre main » → « **Entourez le bras avec le coude inverse** » (le mouvement gauche symétrique reste sans sous-consigne, conformément au motif existant : la consigne détaillée n'est portée que par le premier mouvement d'une paire).

**Bascule de langue français / anglais** — nouveau module `js/i18n.js`, chargé **juste après `utils.js` et AVANT `data.js`** :
- **Textes de contenu** (`data.js`) : chaque chaîne affichée s'écrit `T("français", "english")` → les deux versions restent **côte à côte**, impossible d'en oublier une. Résolution à l'affichage par `tr(valeur)`. Aucun doublon de structure (durées, `mime`, `type`, `cle`, icônes restent uniques) → **pas de dérive possible** entre les deux langues.
- **Libellés d'interface** : dictionnaire `UI = { fr, en }` (mêmes clés des deux côtés), lus par `t("cle")` et `tf("cle", {vars})` (substitution `{t}`, ex. « Encore 2:30 » / « 2:30 left »).
- **DOM statique** : `index.html` porte des attributs `data-i18n` (texte), `data-i18n-html` (titre d'accueil, `<em>` de la banderole dorée conservé) et `data-i18n-aria` (`aria-label`). Les textes accompagnés d'une icône ont été **enveloppés dans un `<span>`** pour que la traduction ne remplace jamais le SVG.
- **Bouton** : pastille `FR | EN` dans l'en-tête (à droite, à côté du badge « Mode pause » ; le badge s'efface sous 360 px). Langue active en **doré** (`--dore-pale`/`--dore-fort`, fil conducteur), `aria-pressed` à jour.
- **Choix mémorisé** dans `localStorage` (`yogatoroute:langue`) ; à défaut, langue du navigateur ; à défaut, français. `<html lang>`, `<title>` et `meta description` suivent la langue.
- **Bascule à chaud** : `appliquerLangue()` repeint le DOM statique puis `rafraichirEcrans()` retraduit ce que peint le JS, **selon l'étape en cours** (accueil, intro, exercice, conclusion, fin). En pleine séance, la consigne, la sous-consigne, le titre et le temps restant changent de langue **sans toucher à l'horloge** (`t0`/`pauseElapsed` intacts, aucun saut, décompte conservé) — fonctionne en lecture comme en pause.
- **Repères vocaux** : les enregistrements (`inspire`/`bloque`/`expire`.mp3) n'existent **qu'en français** → la constante `VOIX_LANGUES = ["fr"]` les coupe en anglais (la cloche et la musique, neutres, restent actives). *Ajouter `"en"` à cette constante le jour où les voix anglaises sont déposées dans `assets/`.*
- Corollaire corrigé : `afficherFin()` déclarait une variable locale `t` (teinte) qui masquait la fonction de traduction `t()` → renommée `teinte`.

---

## 1. Concept et Objectif

**Yogatoroute** est une application web mono-page de **pauses guidées destinées aux conducteurs sur les aires de repos d'autoroute**. Le message porté par l'interface est explicite : la pratique se fait *« à l'arrêt, moteur coupé, sur une aire de repos »*, dans le but de réduire le stress et d'améliorer l'attention au volant (`<title>`, meta `description`, note de sécurité `.note-secu`).

L'app propose **3 familles de pauses** (« sections »), chacune avec ses propres exercices :

| Section | Onglet | Icône (SVG) | Objet |
|---|---|---|---|
| `respiration` | Respiration | `wind` | Exercices de respiration rythmée (cohérence cardiaque, 4-7-8, carrée) |
| `etirement` | Étirement | `bonhomme` | Séquences d'étirements guidés (nuque, épaules, jambes) |
| `recuperation` | Récup' rapide | `zap` | Routines courtes anti-fatigue / relâchement (réveil, détente, recharge) |

**Boucle utilisateur (loop principale) :**
1. **Accueil** — l'utilisateur choisit une section (onglet) puis un exercice (carte).
2. **Séance** — une phase d'**introduction** (message + tintement de cloche) puis l'**exercice** proprement dit : une « bulle » qui se gonfle/dégonfle, une consigne texte, un décompte, une barre de progression, et (en Respiration) des **repères vocaux** sur fond de **musique d'ambiance**.
3. **Fin** — écran de conclusion (message `outro` + cloche) invitant à s'hydrater/s'étirer, avec un **récapitulatif** (durée + respirations/mouvements), une carte **« Enchaîner avec »** (exercice suggéré) et les boutons **Refaire** / **Faire un autre exercice**.

L'expérience est **100 % côté client, sans compte, sans persistance, sans réseau** : **fonctionnelle hors-ligne** (icônes SVG inlinées, audio et logo locaux). Seules les **polices Google Fonts** sont chargées via CDN, avec repli `system-ui` si elles sont indisponibles.

---

## 2. Architecture et Stack technique

**Stack : aucun framework, aucun bundler, aucun build, aucun `package.json`.** Vanilla JS + CSS. Site **statique**, déployable **tel quel sur Netlify** (Netlify sert directement les fichiers, aucune étape de build).

### 2.1 Arborescence (refactorisation modulaire)
Le code, auparavant réuni dans un unique `index.html`, est désormais **séparé HTML / CSS / JS** :

```
index.html            structure HTML uniquement (+ liens vers css/ et js/)
css/
  styles.css          toute la feuille de style (tokens, thèmes, écrans, mime…)
js/
  utils.js            helpers DOM partagés ($, $app, fmt)
  i18n.js             bilingue FR/EN : T/tr (contenu), UI/t/tf (interface), bascule
  icons.js            ICONS + icon() + hydrateIcones() (SVG inline)
  data.js             SECTIONS, NEXT, TEINTE (contenu, textes bilingues T("fr","en"))
  audio.js            cloche, musique dynamique par section, voix, déverrouillage mobile
  animations.js       échelle de la bulle + personnage articulé « mime »
  timer.js            état, timeline, horloge rAF, contrôles de lecture, conclusion
  app.js              navigation, thème, rendu, lancement, écran fin, amorçage
assets/               ding / music / inspire / bloque / expire (.mp3)
logo.png              favicon + logo d'en-tête
```

- **Chargement** : les 8 scripts sont inclus en fin de `<body>` via `<script src>` **classiques** (non-modules), dans l'**ordre de dépendance** `utils → i18n → icons → data → audio → animations → timer → app` (`i18n` **avant** `data`, qui utilise `T()` dès son évaluation). Choix d'architecture assumé : les gestionnaires **`onclick=` inline** du HTML appellent des fonctions **globales** ; des scripts classiques les exposent nativement (aucune réécriture des handlers, aucun build). Toutes les fonctions/constantes partagent le même scope global ; `app.js` (dernier) amorce l'app une fois tout chargé.
- **Langue** : **bilingue français / anglais** (cf. §0.4). `<html lang>` suit la langue active ; français par défaut, choix mémorisé dans `localStorage`.
- **Polices** : Google Fonts — **Bricolage Grotesque** (300/500/700/800) titres/logo/consignes, **Karla** (400/500/600/700) corps. Repli `system-ui` si indisponibles.
- **Icônes** : SVG **inline** (`js/icons.js`) — aucune librairie, aucun CDN.
- **Assets audio** : `new Audio("assets/…")`. ⚠️ Ces chemins sont résolus **relativement au document** (`index.html`, à la racine), **pas** au fichier JS — ils restent donc valides depuis `js/`, et le **déverrouillage audio mobile** est préservé.
- **Rendu** : mobile-first, `.app` `max-width:440px`, plein écran sur mobile et **« carte » arrondie centrée** sur grand écran ; en-tête fixe + écran actif défilant.

### 2.2 Rôle de chaque module JS
| Fichier | Responsabilité |
|---|---|
| `utils.js` | Helpers DOM (`$`, `$app`) et formatage `fmt` |
| `i18n.js` | Bilingue FR/EN : `T`/`tr` (textes de contenu), dictionnaire `UI` + `t`/`tf` (interface), `choisirLangue`/`appliquerLangue`/`rafraichirEcrans`, `VOIX_LANGUES` |
| `icons.js` | Bibliothèque d'icônes SVG inline + injection (`icon`, `hydrateIcones`) |
| `data.js` | Données : sections, exercices, phases, enchaînement `NEXT`, teintes `TEINTE` |
| `audio.js` | Cloche, **musique par section** (+ repli mémorisé), repères vocaux + ducking, déverrouillage mobile |
| `animations.js` | Échelle de la bulle (easing) + synchro du personnage « mime » (`echelleDe`, `placerBulle`, `majMime`) |
| `timer.js` | État de session, `construireTimeline`, horloge rAF (`rendreFrame`/`boucle`), contrôles (`basculerPause`/`phaseSuivante`/`phasePrecedente`), `conclure` |
| `app.js` | Navigation/thème, `rendreListe`, `lancerExo`, `afficherFin`, `goNext`/`refaire`, `arreterTout`, raccourcis clavier, amorçage |

**Modèle de rendu des écrans** : les 3 `<section class="ecran">` (accueil / séance / fin) coexistent dans le DOM ; une seule porte la classe `.actif` (les autres sont `display:none`). `montrer(id)` bascule cette classe. Aucun routeur, pas d'URL/hash.

**Outillage (hors app)** : `.claude/` (skill « impeccable ») et `skills-lock.json` sont du tooling local Claude Code, **ignorés par git** (`.gitignore`) — sans impact sur le produit livré.

---

## 3. Logique Métier et Flow (parcours de A à Z)

### Machine à états
Variable `etat` : `accueil → intro → exercice → conclusion → fin`. Une variable `jetonLancement` (compteur) invalide tout lancement asynchrone en attente (anti double-clic / anti-course pendant l'intro).

### Étape par étape

**A. Amorçage** — en fin de script, `choisirSection("respiration")` : la section Respiration est active par défaut, ses cartes sont rendues, le thème violet pâle est appliqué.

**B. Choix de la section** — `choisirSection(id)` :
- met à jour `sectionCourante`, applique le thème (`appliquerTheme`), bascule `aria-selected` sur les onglets, et re-rend la liste de cartes (`rendreListe`).

**C. Rendu des cartes** — `rendreListe(id)` construit dynamiquement une `<button class="carte-exo">` par exercice : pastille (**icône SVG** via `icon(exo.icon,…)`), titre (`titre`), méta (`meta`) et **tag doré** (`tag`). Chaque carte appelle `lancerExo(sectionId, exo.cle)` au clic.

**D. Lancement d'un exercice** — `lancerExo(sectionId, cle)` (async) :
1. `arreterTout()` (nettoyage) puis `deverrouillerAudio()` — **déverrouillage audio dans le geste utilisateur** (indispensable Chrome mobile / iOS Safari).
2. `voixActive = (sectionId === "respiration")` — les repères vocaux sont **réservés à la Respiration**.
3. `construireTimeline(exo)` — aplatit l'exercice en une **suite de phases** (voir §4).
4. Affiche l'écran séance en **état `intro`** : message `section.intro`, bulle à l'échelle minimale.
5. **Déroulé de l'intro** (durée totale `DUREE_INTRO = 5 s`) : lecture silencieuse du message pendant `DUREE_INTRO − DING_DUREE`, puis `jouerDing()` (cloche `DING_DUREE = 2 s`). L'exercice démarre **pile à la fin du tintement**.
6. Lance la **musique** en boucle (`A.music`, volume `MUSIQUE_VOL = 0.35`).
7. Passe en **état `exercice`**, initialise l'horloge `t0 = performance.now()` et démarre la boucle rAF.

**E. Boucle d'animation** — `boucle()` (une seule horloge `requestAnimationFrame`) :
- calcule `elapsed`, trouve la phase courante via `bornes`, met à jour le **texte de phase uniquement au changement** (évite le spam du lecteur d'écran) et, si `voixActive`, joue le **repère vocal** (`jouerVoix(phase.type)`).
- affiche le **décompte** `Math.ceil(duree − tIn)`, peint l'**échelle de la bulle** (`echelleDe`) et la **barre de progression** image par image, met à jour le **temps restant global** (`Encore m:ss`).
- quand `elapsed >= dureeTotale` → `conclure()`.

**F. Conclusion** — `conclure()` : arrête rAF/voix/musique, passe en **état `conclusion`**, affiche `section.outro`, joue la cloche, puis passe en **état `fin`**. `afficherFin()` remplit alors l'écran final : `section.finTexte`, le **récapitulatif** (`fmt(dureeTotale)` + nb de respirations/mouvements) et la carte **« Enchaîner avec »** (`NEXT[section]` → titre/méta de l'exercice suggéré, teinté par sa section).

**G. Sorties / relances possibles :**
- Bouton explicite **« ← Retour à l'accueil »** dans la séance, **touche Échap / Retour arrière (Backspace)**, ou **geste « retour » natif du mobile / flèche Précédent** → `allerAccueil()` (`arreterTout()` : coupe musique + rAF/compteurs, puis retour accueil). Le geste natif est géré via l'**API History** : `history.pushState` à l'entrée en séance (`marquerSession`), `popstate` → `allerAccueil()`.
- Clic sur le **logo** (`allerAccueil`) → idem.
- Écran fin : **« Refaire »** (`refaire()` → relance le même exercice), **« Enchaîner avec »** (`goNext()` → exercice suggéré, éventuellement d'une autre section), **« Faire un autre exercice »** (`allerAccueil()`).

`arreterTout()` incrémente `jetonLancement`, annule le rAF, coupe tout l'audio (`stopAudio`), et remet `etat = "accueil"`.

---

## 4. Modèles de Données et Assets

### 4.1 Modèle de données — `SECTIONS`
Objet JS littéral (aucune API, aucun stockage). Trois clés (`respiration`, `etirement`, `recuperation`), chacune :

```
{
  nom, intro, outro, finTexte,   // libellés texte de la section (inchangés)
  exos: [ … ]                    // exercices
}
```

Chaque **exercice** : `{ cle, icon, titre, meta, tag, sousTitre, type, … }` — `icon` = nom d'un SVG de l'objet `ICONS` ; `titre`/`meta`/`tag`/`sousTitre` = textes affichés (carte + en-tête de séance).

⚠️ **Tous les champs texte** (`nom`, `intro`, `outro`, `finTexte`, `titre`, `meta`, `tag`, `sousTitre`, `label`, `sub`) sont **bilingues** : ils s'écrivent `T("français", "english")` et se lisent **toujours** via `tr(…)` au moment de l'affichage (cf. §0.4). Les champs non textuels (`cle`, `icon`, `type`, `dur`, `cible`, `mime`) restent uniques et **ne doivent pas** être traduits.

**Deux types d'exercices** (champ `type`) :

- **`souffle`** (respiration) : un **cycle** (`cycle: [phases]`) répété autant de fois que nécessaire pour approcher `cible` (secondes). Ex. cohérence cardiaque = `[inspire 5s, expire 5s]` × N pour ~5 min.
- **`sequence`** (étirement / récupération) : une **`timeline`** de phases jouée **une seule fois**.

**Phase** (unité élémentaire) :
```
{ label, type, dur, sub? }
```
- `label` : consigne affichée. `dur` : secondes. `sub` : sous-consigne optionnelle. *(Textes d'origine ; champs renommés depuis `nom`/`duree`/`sous`.)*
- `type` ∈ **`inspire` | `expire` | `pause` | `maintien` | `repos`** — pilote (a) l'échelle cible de la bulle et (b) le repère vocal éventuel.

**Aplatissement** — `construireTimeline(exo)` produit un tableau `timeline` de phases enrichies (`debut`, `debutEchelle`, `finEchelle`), un tableau `bornes` (temps de début) et `dureeTotale`. Mapping type → échelle cible :

| type | `finEchelle` | Repère vocal |
|---|---|---|
| `inspire` | `ECHELLE_MAX = 1` | `inspire.mp3` |
| `expire` | `ECHELLE_MIN = 0.68` | `expire.mp3` |
| `pause` | tient l'échelle courante | `bloque.mp3` |
| `maintien` | `ECHELLE_MAINTIEN = 0.9` | — (aucun) |
| `repos` | `ECHELLE_MIN = 0.68` | — (aucun) |

Animation : rampe adoucie par `easeInOut` (demi-cosinus) ; `inspire`/`expire` sur toute la durée, `pause`/`maintien`/`repos` rejoignent la cible sur `SETTLE = 1.1 s` puis tiennent.

**Inventaire des exercices (9 au total)** *(titres et durées d'origine ; icône SVG entre parenthèses)* :
- Respiration : `coherence` « Relâcher la pression » (`waves`, 5 min), `478` « Calmer l'anxiété » (`moon`, 3 min), `carree` « Se recentrer » (`square`, 4 min).
- Étirement : `nuque` « Dénouer la nuque » (`etir-nuque` = girafe, 2 min), `epaules` « Ouvrir les épaules » (`etir-epaules` = pousse, 3 min), `jambes` « Réveiller les jambes » (`etir-jambes` = feuille au vent, 3 min). *(métaphores d'origine ; les 3 portent `mime:true` → personnage articulé animé)*
- Récupération : `reveil` « Réveil express » (`zap`, 2 min), `detente` « Détente éclair » (`droplet`, 90 s), `recharge` « Recharge complète » (`battery-charging`, 3 min).

### 4.2 Assets audio (`assets/`)
Objet `A` = 5 éléments `Audio` (`preload="auto"`) :

| Fichier | Rôle | Détails |
|---|---|---|
| `ding.mp3` (~101 Ko) | **Cloche** de début/fin de séance | `volume 0.7`, durée déclarée `DING_DUREE = 2 s` |
| `music.mp3` (~7,5 Mo) | **Musique d'ambiance** — piste de **repli** commune | `loop = true`, `volume` nominal `0.35`, baissé à `0.15` (ducking) pendant un repère vocal |
| `music2.mp3` (étirement) · `music3.mp3` (récupération) | **Bande-son propre à chaque section** (musique dynamique ; respiration = `music.mp3`) | Chargées par `demarrerMusique(section)` via `MUSIQUE_SRC` (`js/audio.js`) ; repli mémorisé sur `music.mp3` si absentes |
| `inspire.mp3` | Repère vocal **« inspirez »** | joué à l'entrée d'une phase `inspire` |
| `bloque.mp3` | Repère vocal **« bloquez »** (rétention) | phase `pause` |
| `expire.mp3` | Repère vocal **« expirez »** | phase `expire` |

**Mécanismes audio notables :**
- **Déverrouillage mobile** (`deverrouillerAudio`) : au clic « Lancer », lecture muette synchrone de chaque piste puis remise à zéro — contourne le blocage autoplay iOS/Android.
- **Ducking** (`fondreMusique`) : la musique descend en douceur (fondu en rAF sur ~180 ms) pendant un repère vocal, puis remonte à `ended`.
- **Robustesse** (`jouerDing`) : si l'audio est refusé, un repli `setTimeout` garantit que l'intro garde toujours la même durée — l'app fonctionne **sans son**.

### 4.3 Autres assets
- **`logo.png`** (~70 Ko) : favicon (`<link rel="icon">`) **et logo de l'en-tête** (`.logo img`, 36×36, `border-radius:50%`) — **présent et visible** dans la refonte, à gauche du mot-symbole.
- **Icônes** : plus aucun fichier — les SVG sont **inlinés** dans l'objet `ICONS` du script (jeu dérivé de Lucide).

---

## 5. Couleurs et Thème Actuel (CRITIQUE — à conserver telles quelles)

> ⚠️ **Exigence client : ces couleurs ne doivent PAS être modifiées lors de la refonte.**
> Toutes définies comme **variables CSS** dans `:root` (`index.html`, lignes ~14–51). Le thème bascule **par section** via l'attribut `.app[data-section="…"]`, qui réécrit les 4 variables « actives » `--accent`, `--accent-fort`, `--accent-doux`, `--accent-pale`.

### 5.1 Neutres chauds (chrome commun, toutes sections)
| Variable | Hex | Usage |
|---|---|---|
| `--blanc-brume` | `#FDFAF8` | Fond de page (blanc chaud) |
| `--encre` | `#33302B` | Texte principal (AAA sur clair) |
| `--encre-douce` | `#6A625A` | Texte secondaire (AA) |

### 5.2 Doré — fil conducteur CONSTANT (présent dans les 3 sections : logo + tags + banderole du titre)
| Variable | Valeur | Usage |
|---|---|---|
| `--dore` | `#C9A227` | Doré vif — le « to » du logo (marque) |
| `--dore-fort` | `#7C6410` | Doré foncé lisible — **texte des tags** (AA sur clair) |
| `--dore-doux` | `rgba(227,199,102,.5)` | **Doré translucide 50 %** — banderole de surlignage du titre d'accueil (`.accueil h1 em`) |
| `--dore-pale` | `#FBF3DA` | Doré très pâle — **fond des tags** |

### 5.3 RESPIRATION — Doré & **Violet pâle** *(le « mix d'origine », exigence explicite)*
| Variable | Hex | Usage |
|---|---|---|
| `--resp-accent` | `#8B5A79` | Remplissages (boutons/onglet actif) — blanc dessus AA (5,5:1) |
| `--resp-fort` | `#6E3E5C` | Texte / titres — AA sur blanc (8,4:1) et sur pâle (6,8:1) |
| `--resp-doux` | `#C9A2BE` | Bordures douces, halo |
| `--resp-pale` | `#F3E4EC` | **Le violet pâle d'origine** — fonds teintés, pastilles, `theme-color` par défaut |

### 5.4 ÉTIREMENT — Doré & **Vert sauge**
| Variable | Hex | Usage |
|---|---|---|
| `--etir-accent` | `#7FA06E` | Remplissages |
| `--etir-fort` | `#43603A` | Texte / titres (AA sur blanc) |
| `--etir-doux` | `#AEC59F` | Bordures douces, halo |
| `--etir-pale` | `#EDF3E7` | Fonds teintés, pastilles |

### 5.5 RÉCUPÉRATION RAPIDE — Doré & **Bleu nuit**
| Variable | Hex | Usage |
|---|---|---|
| `--recup-accent` | `#47598C` | Remplissages |
| `--recup-fort` | `#2E3C63` | Texte / titres (AA sur blanc) |
| `--recup-doux` | `#8C99BE` | Bordures douces, halo |
| `--recup-pale` | `#E7EAF4` | Fonds teintés, pastilles |

### 5.6 Variables actives (réécrites par section)
`--accent`, `--accent-fort`, `--accent-doux`, `--accent-pale` pointent par défaut vers le jeu **Respiration** (dans `:root`, lignes 45–48), puis sont redéfinies par le sélecteur `.app[data-section="…"]`. Toute l'UI (titres, boutons, onglet actif, cartes, halo, bulle, barre, badge, copyright) consomme **exclusivement** ces 4 variables → **changer de section reteinte toute l'interface** (transitions `.4s`/`.5s`).

**Application dynamique JS** : `appliquerTheme(sectionId)` pose `data-section` sur `.app` **et** met à jour la balise `<meta name="theme-color">` avec la valeur calculée de `--accent-pale` (couleur de la barre navigateur mobile).

### 5.7 Autres constantes visuelles
- **Gradient de fond `.app`** : `linear-gradient(172deg, var(--accent-pale) 0%, var(--blanc-brume) 46%, var(--accent-pale) 100%)`.
- **Fond de page (`body`)** : `--greige #EDE8E1` (visible autour de la carte sur grand écran).
- **Bulle `.cercle`** : `radial-gradient(circle at 35% 30%, var(--accent-pale), var(--accent-doux))`.
- **Halo `.halo`** : `radial-gradient(circle, var(--accent-doux) 0%, transparent 65%)` + **anneau** `.anneau` (bordure `--accent-doux`).
- Rayon des cartes : `16px` ; carte-application sur grand écran : `38px`.
- Ombres portées à base d'encre translucide : `rgba(51,48,43,.14 → .5)`.
- `theme-color` initial (HTML statique) : `#F3E4EC` (= violet pâle Respiration).

---

## 6. Composants Clés (structure & fonctions)

### 6.1 Composants d'interface (DOM / CSS)
| Élément | Rôle |
|---|---|
| `.app[data-section]` | Conteneur racine + **porteur du thème** (source unique de couleur) |
| `header` : `.logo` (`logo.png` + mot-symbole « Yoga**to**route ») + `.badge-pause` | En-tête constant (retour accueil au clic logo ; badge « Mode pause » à icône `pause`) |
| `#ecran-accueil` (`.accueil`) | Titre à banderole dorée, intro, `.onglets` (tablist ARIA), `.question`, `.choix` (cartes), note sécurité (icône `car`), copyright |
| `.onglets` / `.onglet` | Sélecteur de section (icône SVG + libellé, `role="tab"`, `aria-selected`) |
| `.carte-exo` | Carte exercice (**pastille icône SVG** + titre + méta + **tag doré**) — **générée en JS** |
| `#ecran-seance` (`.seance`) | En-tête `#seance-titre`/`#seance-sous-titre` + bouton **« ← Retour »** ; `#phase` puis `#sous-consigne` **au-dessus de la bulle** ; `.scene` (`.halo`, `.anneau`, `.cercle`, `#compte`, personnage `#bonhomme` **à silhouette dorée fine + lueur** — calque de fond `.m-contour` (trait doré fin `stroke-width:7`, sous le calque vert) qui détoure la silhouette globale + halo doré doux) ; `.progression`>`#barre`, `#temps-restant` ; **`#controles`** (Recule / Pause / Avance) |
| `#ecran-fin` (`.fin`) | Pastille `check` + titre « Bien joué. Bonne route ! » + texte + **`.recap`** (durée / respirations-mouvements) + **`.enchainer`** (carte suggérée) + boutons **Refaire** / **Faire un autre exercice** |

### 6.2 Fonctions clés (JS)
| Fonction | Responsabilité |
|---|---|
| `icon(nom, taille)` / `hydrateIcones()` | **Icônes SVG inlinées** : renvoie le markup / remplit les emplacements `data-icon` (aucun réseau) |
| `choisirSection(id)` | Change de section : thème + onglets + re-rendu des cartes |
| `rendreListe(id)` | Génère les cartes d'exercice (pastille via `icon()`, titre, méta, tag) |
| `appliquerTheme(id)` | Pose `data-section` + met à jour `meta[theme-color]` |
| `lancerExo(section, cle)` | **Orchestrateur de séance** (async) : intro, cloche, musique, démarrage boucle |
| `construireTimeline(exo)` | Aplatit `souffle`/`sequence` en `timeline` + `bornes` + échelles |
| `echelleDe(phase, tIn)` / `easeInOut` | Calcule l'échelle instantanée de la bulle (animation organique) |
| `rendreFrame(elapsed)` / `boucle()` | Rendu d'une image à un instant donné (texte, décompte, bulle, barre, mime, voix) ; `boucle` = horloge rAF qui l'appelle |
| `majMime(phase)` | Met le personnage `#bonhomme` en phase avec le mouvement (`--mime-dur`, classe `mv-…`) |
| `basculerPause` / `phaseSuivante` / `phasePrecedente` / `sauterA` | **Contrôles multimédia** : pause-reprise (recale `t0`), saut de mouvement |
| `demarrerMusique(section)` | Musique dynamique par section (repli mémorisé sur `music.mp3`) |
| `conclure()` | Fin d'exercice : arrêt audio, message outro, cloche → `afficherFin()` + écran fin |
| `afficherFin()` | Remplit l'écran fin : `finTexte`, récapitulatif (durée + respirations/mouvements), carte d'enchaînement |
| `goNext()` / `refaire()` | Lance l'exercice suggéré (`NEXT`) / relance l'exercice courant |
| `arreterTout()` / `allerAccueil()` | Sorties / nettoyage (jeton, rAF, audio) |
| **Audio** : `deverrouillerAudio`, `jouerDing`, `jouerVoix`, `fondreMusique`, `arreterVoix`, `stopAudio` | Chaîne audio complète (déverrouillage mobile, cloche, repères vocaux, ducking musique) — **inchangée** |

### 6.3 Points d'attention (préservés dans la refonte)
- **Accessibilité** : `aria-live="polite"` sur la phase, `aria-hidden` sur décoratifs, focus visibles (`:focus-visible`), rôle tablist, support **`prefers-reduced-motion`** (désactive transitions/animations). **Conservée.**
- **Contrastes** : les couleurs `*-fort`/`*-accent` sont annotées AA/AAA dans le code — ratios maintenus.
- **Une seule source de couleur** : toute la teinte passe par 4 variables actives → design system par tokens toujours le pivot.
- **Hors-ligne** : icônes SVG inlinées + audio/logo locaux → l'app rend et fonctionne sans réseau (polices Google Fonts en repli `system-ui`).
- **Aucune persistance / aucun backend** : pas de suivi de progression, pas de favoris, pas de réglages sauvegardés (piste d'évolution possible).
- **Contenu figé en dur** dans `SECTIONS` (pas de CMS) — toute évolution de contenu passe par l'édition du JS.

---

*Document mis à jour après implémentation de la refonte UI/UX (section 0). Établi à partir de `index.html`, du dossier `assets/` et de `logo.png`.*
