/*!
 * utils.js — Petits utilitaires DOM partagés (chargé en premier).
 *   $     : raccourci document.getElementById.
 *   $app  : conteneur racine .app (porteur du thème par section).
 *   fmt   : formate un nombre de secondes en "m:ss".
 */
  const $ = id => document.getElementById(id);
  const $app = document.querySelector(".app");

  function fmt(s){ s = Math.max(0, Math.round(s)); const m = Math.floor(s/60), ss = String(s%60).padStart(2,"0"); return m + ":" + ss; }
