const DEFAULT_SILLY = [
  "Le canard qui t'enseignait le ski nautique", "Un concours de chaussettes dépareillées", "La fois où mon grille-pain t'a demandé un autographe", "Une sieste héroïque dans un bac à glaçons", "Notre rendez-vous secret avec trois pingouins", "Le jour où ta plante verte a gagné au karaoké", "Quand tu as publié : Le mystère du croissant disparu", "Qund tu as voulu courir le  marathon en chaussures de ski", "Comment j'ai apprécié ta recette de soupe au chocolat", "Le pigeon qui connaissait nos prénoms", "L'invasion des confettis dans le salon", "Le cours de salsa avec une lampe torche"
];
const BLANK = () => ({ id: crypto.randomUUID(), label: "Nouvelle animation", firstName: "", addressForm: "tu", question: "", correctAnswer: "Notre aventure inoubliable !", sillyAnswers: [...DEFAULT_SILLY] });
let animations = load();
let correctAnswerLibrary = loadCorrectAnswerLibrary();
let selectedId = animations[0]?.id;
let currentRound = [];
let remainingSillyAnswers = [];
let signIndex = 0;
let timer;
const $ = id => document.getElementById(id);
const fields = { label: $("label"), firstName: $("first-name"), addressForm: $("address-form"), question: $("question"), correctAnswer: $("correct-answer"), sillyAnswers: $("silly-answers") };
function load(){ try { const saved = JSON.parse(localStorage.getItem("nouvel-an-animations")); return Array.isArray(saved) && saved.length ? saved : [BLANK()]; } catch { return [BLANK()]; } }
function loadCorrectAnswerLibrary(){ try { const saved = JSON.parse(localStorage.getItem("nouvel-an-bonnes-reponses")); return Array.isArray(saved) ? saved.filter(value => typeof value === "string") : []; } catch { return []; } }
function saveCorrectAnswerLibrary(){ localStorage.setItem("nouvel-an-bonnes-reponses", JSON.stringify(correctAnswerLibrary)); }
function renderCorrectAnswerLibrary(){
  const select = $("choose-correct-answer");
  select.replaceChildren(new Option("Choisir une réponse…", ""));
  correctAnswerLibrary.forEach((answer, index) => select.add(new Option(answer, String(index))));
  select.disabled = correctAnswerLibrary.length === 0;
}
function current(){ return animations.find(item => item.id === selectedId); }
function save(){ localStorage.setItem("nouvel-an-animations", JSON.stringify(animations)); $("save-state").textContent = "Enregistré localement"; renderList(); }
function displayName(item){ return item.label?.trim() || (item.firstName?.trim() ? `Vœux pour ${item.firstName.trim()}` : "Animation sans prénom"); }
function renderList(){ const list = $("animation-list"); list.innerHTML = ""; const template = $("list-item-template"); animations.forEach(item => { const node = template.content.firstElementChild.cloneNode(true); node.classList.toggle("active", item.id === selectedId); node.querySelector(".item-name").textContent = displayName(item); node.querySelector(".item-detail").textContent = item.firstName?.trim() ? `Pour ${item.firstName.trim()}` : "Sans prénom"; node.onclick = () => { selectedId = item.id; renderEditor(); resetPreview(); }; list.append(node); }); }
function renderEditor(){ const item = current(); if (!item) return; $("editor-title").textContent = displayName(item); fields.label.value = item.label || ""; fields.firstName.value = item.firstName || ""; fields.addressForm.value = item.addressForm === "vous" ? "vous" : "tu"; fields.question.value = item.question || ""; fields.correctAnswer.value = item.correctAnswer || ""; fields.sillyAnswers.value = (item.sillyAnswers || []).join("\n"); updateCall(); renderList(); }
function updateCall(){ const formal = current()?.addressForm === "vous"; $("stage").querySelector(".message-before").textContent = `${formal ? "Embarquez" : "Embarque"} vers une bonne et heureuse nouvelle année`; $("stage").querySelector(".message-after").textContent = `${formal ? "Voguez" : "Vogue"} vers un horizon dégagé`; $("stage").querySelector(".trash-bag").firstChild.nodeValue = formal ? "Vos embrouilles" : "Tes embrouilles"; }
function updateModel(){ const item = current(); if (!item) return; item.label = fields.label.value; item.firstName = fields.firstName.value; item.addressForm = fields.addressForm.value; item.question = fields.question.value; item.correctAnswer = fields.correctAnswer.value; item.sillyAnswers = fields.sillyAnswers.value.split("\n").map(x => x.trim()).filter(Boolean); save(); updateCall(); }
function shuffle(items){ return [...items].sort(() => Math.random() - .5); }
function makeRound(){
  const item = current();
  const pool = item.sillyAnswers.length >= 3 ? item.sillyAnswers : [...item.sillyAnswers, ...DEFAULT_SILLY];
  const nonsense = [];
  while (nonsense.length < 3) {
    if (!remainingSillyAnswers.length) remainingSillyAnswers = shuffle(pool);
    const different = remainingSillyAnswers.findIndex(answer => !nonsense.includes(answer));
    nonsense.push(remainingSillyAnswers.splice(different < 0 ? 0 : different, 1)[0]);
  }
  return [...nonsense, item.correctAnswer || "La bonne réponse !"];
}
function resetPreview(){ clearTimeout(timer); signIndex = 0; remainingSillyAnswers = []; currentRound = makeRound(); const stage = $("stage"); stage.className = "stage scene-intro"; const sign = $("sign"); sign.textContent = "?"; sign.onclick = null; $("answer-button").hidden = true; $("success").hidden = true; $("scene-caption").textContent = ""; timer = setTimeout(showKnock, 2300); }
function showKnock(){ $("stage").className = "stage scene-knock"; timer = setTimeout(showRetreat, 1900); }
function showRetreat(){ $("stage").className = "stage scene-retreat"; timer = setTimeout(showIntroSign, 840); }
function showIntroSign(){ const sign = $("sign"); $("stage").className = "stage scene-question"; sign.textContent = "Il nous faut le sésame !"; sign.onclick = null; $("scene-caption").textContent = ""; timer = setTimeout(showQuestion, 1800); }
function showQuestion(){ clearTimeout(timer); const question = current().question.trim(); const sign = $("sign"); $("stage").className = "stage scene-question"; sign.textContent = question || "Un souvenir commun…"; sign.onclick = null; $("scene-caption").textContent = ""; timer = setTimeout(showPromptSign, 3000); }
function showPromptSign(){ clearTimeout(timer); const sign = $("sign"); $("stage").className = "stage scene-question"; sign.textContent = current().addressForm === "vous" ? "Cliquez si vous vous en souvenez" : "Clique si tu t’en souviens"; sign.onclick = showNextSign; $("scene-caption").textContent = ""; timer = setTimeout(showNextSign, 3000); }
function wrongAnswer(){ clearTimeout(timer); $("stage").className = "stage scene-wrong"; $("scene-caption").textContent = "Oh non…"; timer = setTimeout(resetPreview, 4000); }
function restartSequence(){ clearTimeout(timer); $("stage").className = "stage scene-restart"; $("scene-caption").textContent = ""; timer = setTimeout(resetPreview, 1100); }
function showNextSign(){ clearTimeout(timer); $("stage").className = "stage scene-answers"; const sign = $("sign"); $("answer-button").hidden = true; sign.textContent = currentRound[signIndex]; sign.onclick = () => { clearTimeout(timer); if (signIndex === 3) success(); else wrongAnswer(); }; $("scene-caption").textContent = ""; timer = setTimeout(() => { signIndex = (signIndex + 1) % 4; if (signIndex === 0) currentRound = makeRound(); showNextSign(); }, 3000); }
function success(){ clearTimeout(timer); $("stage").className = "stage scene-success scene-walking"; $("answer-button").hidden = true; $("success").hidden = false; $("scene-caption").textContent = ""; timer = setTimeout(() => { $("stage").className = "stage scene-success scene-final-knock"; timer = setTimeout(() => { $("stage").className = "stage scene-success scene-sunrise"; timer = setTimeout(() => { $("stage").classList.add("scene-message-rolling"); timer = setTimeout(() => { $("stage").classList.replace("scene-message-rolling", "scene-message-changed"); timer = setTimeout(() => { $("stage").classList.add("scene-message-final-rolling"); timer = setTimeout(() => { $("stage").classList.replace("scene-message-final-rolling", "scene-message-final"); }, 1000); }, 9000); }, 1000); }, 13000); }, 1620); }, 2600); }
Object.values(fields).forEach(field => field.addEventListener("input", () => { updateModel(); resetPreview(); }));
$("correct-answer-library").addEventListener("input", event => {
  correctAnswerLibrary = event.target.value.split("\n").map(value => value.trim()).filter(Boolean);
  saveCorrectAnswerLibrary();
  renderCorrectAnswerLibrary();
  $("save-state").textContent = "Enregistré localement";
});
$("choose-correct-answer").addEventListener("change", event => {
  if (event.target.value === "") return;
  const answer = correctAnswerLibrary[Number(event.target.value)];
  if (answer.length > 120) { alert("Cette réponse dépasse 120 caractères. Raccourcissez-la dans la liste commune avant de la choisir."); event.target.value = ""; return; }
  fields.correctAnswer.value = answer;
  event.target.value = "";
  updateModel();
  resetPreview();
});
$("new-animation").onclick = () => { const item = BLANK(); animations.unshift(item); selectedId = item.id; save(); renderEditor(); resetPreview(); };
$("duplicate").onclick = () => { const clone = structuredClone(current()); clone.id = crypto.randomUUID(); clone.label = `${displayName(current())} — copie`; animations.unshift(clone); selectedId = clone.id; save(); renderEditor(); resetPreview(); };
$("delete-animation").onclick = () => { if (animations.length === 1) { alert("Conservez au moins une animation."); return; } if (confirm(`Supprimer « ${displayName(current())} » ?`)) { animations = animations.filter(x => x.id !== selectedId); selectedId = animations[0].id; save(); renderEditor(); resetPreview(); } };
$("reset-preview").onclick = resetPreview;
function animationHtml(styles, item) {
  const data = { addressForm: item.addressForm === "vous" ? "vous" : "tu", question: item.question || "", correctAnswer: item.correctAnswer || "", sillyAnswers: [...(item.sillyAnswers || [])] };
  const stage = $("stage").cloneNode(true);
  stage.className = "stage scene-intro";
  const formal = item.addressForm === "vous";
  stage.querySelector(".message-before").textContent = `${formal ? "Embarquez" : "Embarque"} vers une bonne et heureuse nouvelle année`;
  stage.querySelector(".message-after").textContent = `${formal ? "Voguez" : "Vogue"} vers un horizon dégagé`;
  stage.querySelector(".trash-bag").firstChild.nodeValue = formal ? "Vos embrouilles" : "Tes embrouilles";
  stage.querySelector("#sign").textContent = "?";
  stage.querySelector("#scene-caption").textContent = "";
  stage.querySelector("#answer-button").hidden = true;
  stage.querySelector("#success").hidden = true;
  const playerFunctions = [shuffle, makeRound, resetPreview, showKnock, showRetreat, showIntroSign, showQuestion, showPromptSign, wrongAnswer, restartSequence, showNextSign, success].map(fn => fn.toString()).join("\n");
  const safeJson = value => JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  const script = `const DEFAULT_SILLY = ${safeJson(DEFAULT_SILLY)};\nconst item = ${safeJson(data)};\nlet currentRound = [], remainingSillyAnswers = [], signIndex = 0, timer;\nconst $ = id => document.getElementById(id);\nfunction current(){ return item; }\n${playerFunctions}\nresetPreview();`;
  return `<!doctype html>\n<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>La porte du Nouvel An</title><style>${styles.replace(/<\/style/gi, "<\\/style")}\nbody { margin: 0; } .stage { width: 100%; min-height: 100vh; min-height: 100svh; }</style></head><body>${stage.outerHTML}<script>${script}<\/script></body></html>`;
}
function downloadFile(blob, name) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
function exportAnimation(styles) {
  const item = current();
  if (!item) return;
  const html = animationHtml(styles, item);
  const name = (item.firstName || "animation").trim().replace(/[\\/:*?"<>|\x00-\x1f]/g, "-").replace(/^\.+|\.+$/g, "").trim() || "animation";
  downloadFile(new Blob([html], { type: "text/html;charset=utf-8" }), `${name}.html`);
}
// Archive ZIP sans compression : les pages restent autonomes et ne nécessitent aucune bibliothèque externe.
function publicationZip(files) {
  const encoder = new TextEncoder();
  const parts = [], directory = [];
  let offset = 0;
  const header = (size, signature) => { const bytes = new Uint8Array(size); new DataView(bytes.buffer).setUint32(0, signature, true); return bytes; };
  const crc32 = bytes => { let crc = 0xffffffff; for (const byte of bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; };
  for (const file of files) {
    const name = encoder.encode(file.name), data = encoder.encode(file.content), crc = crc32(data);
    const local = header(30, 0x04034b50), lv = new DataView(local.buffer);
    lv.setUint16(4, 20, true); lv.setUint16(6, 0x800, true); lv.setUint32(14, crc, true); lv.setUint32(18, data.length, true); lv.setUint32(22, data.length, true); lv.setUint16(26, name.length, true);
    const central = header(46, 0x02014b50), cv = new DataView(central.buffer);
    cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x800, true); cv.setUint32(16, crc, true); cv.setUint32(20, data.length, true); cv.setUint32(24, data.length, true); cv.setUint16(28, name.length, true); cv.setUint32(42, offset, true);
    parts.push(local, name, data); directory.push(central, name);
    offset += local.length + name.length + data.length;
  }
  const directorySize = directory.reduce((sum, part) => sum + part.length, 0), end = header(22, 0x06054b50), ev = new DataView(end.buffer);
  ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true); ev.setUint32(12, directorySize, true); ev.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end], { type: "application/zip" });
}
function exportPublication(styles) {
  const files = [], used = new Set();
  const csv = ["Destinataire;Animation;Chemin à ajouter à l’adresse du site"];
  const cell = value => `"${String(value || "").replace(/"/g, '""')}"`;
  for (const item of animations) {
    // Les identifiants ne révèlent pas le nom du destinataire et restent stables entre exports.
    let id = String(item.id || "");
    if (!/^[a-zA-Z0-9-]{1,80}$/.test(id) || used.has(id)) {
      const oldId = id;
      id = crypto.randomUUID();
      item.id = id;
      if (selectedId === oldId && current() === undefined) selectedId = id;
    }
    used.add(id);
    const path = `voeux/${id}.html`;
    files.push({ name: `site/${path}`, content: animationHtml(styles, item) });
    csv.push([item.firstName, displayName(item), path].map(cell).join(";"));
  }
  save();
  files.push({ name: "liens-prives.csv", content: "\ufeff" + csv.join("\r\n") });
  files.push({ name: "LISEZ-MOI.txt", content: "Publiez uniquement le contenu du dossier site dans un même dépôt ou hébergement statique. Gardez liens-prives.csv pour vous : il associe les destinataires aux chemins. Après publication, ajoutez chaque chemin à l'adresse du site pour obtenir le lien individuel. Les liens ne sont pas protégés par mot de passe : toute personne disposant d'un lien peut ouvrir la page.\n" });
  downloadFile(publicationZip(files), "publication-voeux.zip");
}
let exportMode = "single";
function startExport(mode) {
  exportMode = mode;
  let styles;
  try {
    styles = [...document.styleSheets].map(sheet => [...sheet.cssRules].map(rule => rule.cssText).join("\n")).join("\n");
  } catch {
    alert("Pour inclure les styles, choisissez le fichier style.css du dossier de l’application.");
    $("export-style-file").click();
    return;
  }
  (mode === "publication" ? exportPublication : exportAnimation)(styles);
}
$("export-html").onclick = () => {
  startExport("single");
};
$("export-publication").onclick = () => startExport("publication");
$("export-style-file").onchange = async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.name !== "style.css") throw new Error();
    const styles = await file.text();
    const inlineStyles = [...document.querySelectorAll("head style")].map(style => style.textContent).join("\n");
    (exportMode === "publication" ? exportPublication : exportAnimation)(`${styles}\n${inlineStyles}`);
  } catch {
    alert("Impossible de lire les styles. Veuillez sélectionner le fichier style.css du dossier de l’application.");
  } finally {
    event.target.value = "";
  }
};
$("export-json").onclick = () => { const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), animations, correctAnswerLibrary }, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "voeux-nouvel-an.json"; link.click(); URL.revokeObjectURL(link.href); };
$("import-json").onchange = event => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(reader.result); const incoming = Array.isArray(data) ? data : data.animations; if (!Array.isArray(incoming)) throw new Error(); const hasLibrary = !Array.isArray(data) && Object.prototype.hasOwnProperty.call(data, "correctAnswerLibrary"); if (hasLibrary && (!Array.isArray(data.correctAnswerLibrary) || !data.correctAnswerLibrary.every(value => typeof value === "string"))) throw new Error(); const importedAnimations = incoming.map(x => ({ ...BLANK(), ...x, id: x.id || crypto.randomUUID(), sillyAnswers: Array.isArray(x.sillyAnswers) ? x.sillyAnswers : DEFAULT_SILLY })); animations = importedAnimations; if (hasLibrary) { correctAnswerLibrary = data.correctAnswerLibrary; saveCorrectAnswerLibrary(); $("correct-answer-library").value = correctAnswerLibrary.join("\n"); renderCorrectAnswerLibrary(); } selectedId = animations[0]?.id; save(); renderEditor(); resetPreview(); } catch { alert("Ce fichier JSON n’est pas reconnu."); } }; reader.readAsText(file); event.target.value = ""; };
$("correct-answer-library").value = correctAnswerLibrary.join("\n"); renderCorrectAnswerLibrary(); renderEditor(); resetPreview();
