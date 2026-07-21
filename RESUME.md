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
- **Personnage animé « mime »** (SVG inline `#bonhomme`, animé en CSS) au centre de la scène pour **Étirements** et **Récup' exercice 3 (Recharge)** : chaque phase porte un mot-clé `mime` (`incline-d/g`, `bras-ciel`, `epaules`, `souffle-in/out`, `jambe-d/g`, `dos-rond`, `secouer`, `idle`) joué **en rythme** (`--mime-dur` = durée de la phase). Figé en pause et en `prefers-reduced-motion`.

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

**Stack : aucune dépendance applicative, aucun build.** Tout tient dans un seul fichier statique.

- **`index.html`** (~950 lignes) : structure HTML, CSS embarqué dans un `<style>`, logique JS embarquée dans un `<script>`. Vanilla JS, aucun framework, aucun bundler, aucun `package.json`.
- **Langue** : `<html lang="fr">`, toute l'UI et le contenu sont en français.
- **Polices** : chargées depuis Google Fonts (`fonts.googleapis.com`) —
  - **Bricolage Grotesque** (300/500/700/800, axe optique `opsz 12..96`) → titres, logo, boutons, consignes.
  - **Karla** (400/500/600/700) → corps de texte.
- **Icônes** : **SVG inlinés** dans le script (objet `ICONS`, jeu dérivé de Lucide ; `icon(nom,taille)` + `hydrateIcones()`). **Aucune librairie, aucun CDN** → rendu hors-ligne garanti. *(Auparavant : emojis Unicode.)*
- **Assets locaux** : dossier `assets/` (5 `.mp3`) + `logo.png` (favicon **et logo de l'en-tête**, 36×36, cercle).
- **Rendu** : mobile-first, conteneur `.app` `max-width:440px`, plein écran sur mobile et **« carte » arrondie centrée** sur grand écran (`min-width:520px`) ; en-tête fixe + écran actif défilant.

**Organisation du code JS** (dans l'ordre du fichier) :
1. `SECTIONS` — objet de **données** décrivant les 3 sections et leurs exercices.
2. Bloc **Icônes** (`ICONS`, `icon()`, `hydrateIcones()`) — SVG inlinés, aucun réseau.
3. Bloc **Audio** (`A`, ding / **musique dynamique par section** `demarrerMusique` / voix, déverrouillage mobile).
4. Bloc **animation de la bulle** (échelles, easing).
5. Bloc **état de session** (variables globales).
6. Bloc **navigation / rendu** (`montrer`, `choisirSection`, `rendreListe`, thème).
7. Bloc **moteur de séance** (`construireTimeline`, `lancerExo`, `rendreFrame`/`boucle`, `majMime`, **contrôles** `basculerPause`/`phaseSuivante`/`phasePrecedente`, `conclure`, `afficherFin`, `goNext`, `refaire`, arrêts).

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
- Bouton **fermer (×)** dans la séance ou **touche Échap** → `allerAccueil()` (`arreterTout()` + retour accueil).
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

Chaque **exercice** : `{ cle, icon, titre, meta, tag, sousTitre, type, … }` — `icon` = nom d'un SVG de l'objet `ICONS` ; `titre`/`meta`/`tag`/`sousTitre` = textes d'origine (carte + en-tête de séance).

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
- Étirement : `nuque` « Dénouer la nuque » (`bonhomme`, 2 min), `epaules` « Ouvrir les épaules » (`bonhomme`, 3 min), `jambes` « Réveiller les jambes » (`bonhomme`, 3 min). *(les 3 portent `mime:true` → personnage animé)*
- Récupération : `reveil` « Réveil express » (`zap`, 2 min), `detente` « Détente éclair » (`droplet`, 90 s), `recharge` « Recharge complète » (`battery-charging`, 3 min).

### 4.2 Assets audio (`assets/`)
Objet `A` = 5 éléments `Audio` (`preload="auto"`) :

| Fichier | Rôle | Détails |
|---|---|---|
| `ding.mp3` (~101 Ko) | **Cloche** de début/fin de séance | `volume 0.7`, durée déclarée `DING_DUREE = 2 s` |
| `music.mp3` (~7,5 Mo) | **Musique d'ambiance** — piste de **repli** commune | `loop = true`, `volume` nominal `0.35`, baissé à `0.15` (ducking) pendant un repère vocal |
| `music-{respiration,etirement,recuperation}.mp3` *(à fournir)* | **Bande-son propre à chaque section** (musique dynamique) | Chargées par `demarrerMusique(section)` ; repli mémorisé sur `music.mp3` si absentes |
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
| `#ecran-seance` (`.seance`) | En-tête `#seance-titre`/`#seance-sous-titre` + fermer (×) ; `#phase` puis `#sous-consigne` **au-dessus de la bulle** ; `.scene` (`.halo`, `.anneau`, `.cercle`, `#compte`, personnage `#bonhomme`) ; `.progression`>`#barre`, `#temps-restant` ; **`#controles`** (Recule / Pause / Avance) |
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
