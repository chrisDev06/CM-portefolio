/**
 * Révèle l'image nette du hero une fois décodée, sans attendre l'hydratation.
 * Écoute en phase de capture (load ne remonte pas) : posée dans le <head>,
 * elle voit passer le chargement de l'image quel que soit le moment.
 */
export const HERO_REVEAL_SCRIPT = `(function(){
function ready(i){var h=i.closest("[data-hero]");if(!h)return;var d=function(){h.setAttribute("data-state","ready")};(i.decode?i.decode():Promise.resolve()).then(d,d)}
function hero(e){var t=e.target;return t&&t.matches&&t.matches("img[data-hero-img]")?t:null}
document.addEventListener("load",function(e){var i=hero(e);if(i)ready(i)},true);
document.addEventListener("error",function(e){var i=hero(e);if(i){var h=i.closest("[data-hero]");if(h)h.setAttribute("data-state","ready")}},true);
})();`;
