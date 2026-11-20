// Leonida Trophy Atlas — checklist, tracker and guide for the 55 PS5 trophies
// of Grand Theft Auto VI. Runs fully offline: it fetches only data/trophies.json
// from its own server and saves progress in localStorage.
import { ROADMAP, renderRoadmap } from "./roadmap.js";

const STORAGE_KEY = "leonida-trophy-atlas-v1";
const DATA_URL = "data/trophies.json";

const KIND_LABELS = {
  story: "Story",
  strangers: "Strangers",
  activities: "Activities",
  crime: "Crime",
  collectibles: "Collectibles",
  misc: "Miscellaneous",
  completion: "Completion",
  platinum: "Platinum",
};

const FILTERS = [
  { id: "all", label: "All 55" },
  { id: "story", label: "Story" },
  { id: "missable", label: "Missable" },
  { id: "collectibles", label: "Collectibles" },
  { id: "activities", label: "Activities" },
  { id: "crime", label: "Crime" },
  { id: "strangers", label: "Strangers" },
  { id: "hidden", label: "Hidden" },
];

let trophies = [];
let earned = new Set();
let currentFilter = "all";
let searchText = "";
let showSpoilers = false;
let earnedOnly = false;
let selectedId = null;

const $ = (id) => document.getElementById(id);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.earned)) earned = new Set(parsed.earned);
    if (typeof parsed.showSpoilers === "boolean") showSpoilers = parsed.showSpoilers;
  } catch (err) {
    console.warn("saved progress could not be read", err);
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ earned: [...earned], showSpoilers }),
    );
  } catch (err) {
    console.warn("progress could not be saved", err);
  }
}

function isMasked(trophy) {
  return trophy.hidden && trophy.kind === "story" && !showSpoilers && !earned.has(trophy.id);
}

function trophyMatchesFilter(trophy) {
  if (earnedOnly && !earned.has(trophy.id)) return false;
  if (searchText) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(searchText)) return false;
  }
  switch (currentFilter) {
    case "all":
      return true;
    case "missable":
      return trophy.missable === true;
    case "hidden":
      return trophy.hidden === true;
    case "story":
    case "strangers":
    case "activities":
    case "crime":
    case "collectibles":
      return trophy.kind === currentFilter;
    default:
      return true;
  }
}

function gradeMark(grade) {
  if (grade === "platinum") return "P";
  if (grade === "gold") return "G";
  if (grade === "silver") return "S";
  return "B";
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("progress-fill").style.width = `${pct}%`;
  $("progress-text").textContent = `${done} of ${total} trophies — ${pct}%`;
  const byGrade = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] || { done: 0, total: 0 };
    byGrade[t.grade].total += 1;
    if (earned.has(t.id)) byGrade[t.grade].done += 1;
  }
  $("grade-counts").innerHTML = ["platinum", "gold", "silver", "bronze"]
    .map(
      (g) =>
        `<span class="grade-count"><span class="grade grade-${g}">${gradeMark(g)}</span> ` +
        `${byGrade[g] ? byGrade[g].done : 0}/${byGrade[g] ? byGrade[g].total : 0} ${g}</span>`,
    )
    .join("");
}

function renderFilters() {
  $("filters").innerHTML = FILTERS.map((f) => {
    const count =
      f.id === "all"
        ? trophies.length
        : trophies.filter((t) => {
            if (f.id === "missable") return t.missable === true;
            if (f.id === "hidden") return t.hidden === true;
            return t.kind === f.id;
          }).length;
    return (
      `<button type="button" class="chip${currentFilter === f.id ? " active" : ""}" ` +
      `data-filter="${f.id}">${f.label} (${count})</button>`
    );
  }).join("");
  for (const btn of $("filters").querySelectorAll("button")) {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      renderFilters();
      renderList();
    });
  }
}

function renderList() {
  const groups = [];
  const order = ["story", "strangers", "activities", "crime", "collectibles", "misc", "completion", "platinum"];
  for (const kind of order) {
    const items = trophies.filter((t) => t.kind === kind && trophyMatchesFilter(t));
    if (items.length) groups.push({ kind, items });
  }
  if (!groups.length) {
    $("trophy-list").innerHTML = `<p class="empty">No trophies match this filter. Try another filter or clear the search.</p>`;
    return;
  }
  $("trophy-list").innerHTML = groups
    .map(
      (g) =>
        `<section class="kind-group" data-kind="${g.kind}"><h2>${KIND_LABELS[g.kind]}</h2><ul class="trophy-rows">` +
        g.items
          .map((t) => {
            const masked = isMasked(t);
            const name = masked ? "Hidden trophy — earn it to reveal" : t.name;
            const desc = masked ? "Story trophy. Its name and description stay hidden until earned." : t.description;
            const miss = t.missable ? ' <span class="flag missable">MISSABLE</span>' : "";
            const hid = t.hidden ? ' <span class="flag hidden">HIDDEN</span>' : "";
            return (
              `<li class="trophy-row${earned.has(t.id) ? " done" : ""}${selectedId === t.id ? " selected" : ""}" data-id="${t.id}">` +
              `<label class="check"><input type="checkbox" data-check="${t.id}"${earned.has(t.id) ? " checked" : ""} aria-label="Mark ${name} as earned"><span class="box">${earned.has(t.id) ? "✓" : ""}</span></label>` +
              `<span class="grade grade-${t.grade}" title="${t.grade}">${gradeMark(t.grade)}</span>` +
              `<span class="trophy-text"><span class="trophy-name">${name}</span>${miss}${hid}` +
              `<span class="trophy-desc">${desc}</span></span>` +
              `<button type="button" class="guide-btn" data-guide="${t.id}">Guide</button></li>`
            );
          })
          .join("") +
        `</ul></section>`,
    )
    .join("");
  for (const box of $("trophy-list").querySelectorAll("[data-check]")) {
    box.addEventListener("change", () => toggleTrophy(box.dataset.check));
  }
  for (const btn of $("trophy-list").querySelectorAll("[data-guide]")) {
    btn.addEventListener("click", () => selectTrophy(btn.dataset.guide));
  }
  for (const row of $("trophy-list").querySelectorAll(".trophy-row")) {
    row.addEventListener("click", (event) => {
      if (event.target.closest("label") || event.target.closest("button")) return;
      selectTrophy(row.dataset.id);
    });
  }
}

function renderDetail() {
  const panel = $("detail");
  const t = trophies.find((x) => x.id === selectedId);
  if (!t) {
    panel.innerHTML =
      `<h2>Pick a trophy</h2><p>Select any trophy in the checklist to read its guide and sources. ` +
      `Story trophies stay hidden until you earn them, unless spoilers are on.</p>`;
    return;
  }
  if (isMasked(t)) {
    panel.innerHTML =
      `<h2>Hidden story trophy</h2>` +
      `<p><span class="grade grade-${t.grade}">${gradeMark(t.grade)}</span> ${t.grade} · story · hidden</p>` +
      `<p>Its name, description and guide stay hidden until you earn it — turn spoilers on to reveal it, or earn it in the game first.</p>`;
    return;
  }
  const sources = (t.sources || [])
    .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.site}</a></li>`)
    .join("");
  panel.innerHTML =
    `<h2>${t.name}</h2>` +
    `<p><span class="grade grade-${t.grade}">${gradeMark(t.grade)}</span> ${t.grade}` +
    `${t.hidden ? ' · <span class="flag hidden">HIDDEN</span>' : ""}` +
    `${t.missable ? ' · <span class="flag missable">MISSABLE</span>' : ""} · ${KIND_LABELS[t.kind]}</p>` +
    `<p class="official">Official description: “${t.description}”</p>` +
    `<p class="guide">${t.guide}</p>` +
    `<h3>Sources</h3><ul class="sources">${sources}</ul>` +
    `<button type="button" id="detail-toggle">${earned.has(t.id) ? "Mark as not earned" : "Mark as earned"}</button>`;
  $("detail-toggle").addEventListener("click", () => toggleTrophy(t.id));
}

function renderRoadmapView() {
  $("roadmap").innerHTML = renderRoadmap(trophies, earned, showSpoilers);
}

function renderAll() {
  renderProgress();
  renderFilters();
  renderList();
  renderDetail();
  renderRoadmapView();
}

function toggleTrophy(id) {
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  saveState();
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmapView();
}

function selectTrophy(id) {
  selectedId = id;
  renderList();
  renderDetail();
  $("detail").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showView(view) {
  const checklist = view === "checklist";
  $("view-checklist").hidden = !checklist;
  $("view-roadmap").hidden = checklist;
  $("tab-checklist").classList.toggle("active", checklist);
  $("tab-roadmap").classList.toggle("active", !checklist);
  if (!checklist) renderRoadmapView();
}

function exportProgress() {
  const blob = new Blob(
    [JSON.stringify({ game: "Grand Theft Auto VI", earned: [...earned].sort(), exportedAt: new Date().toISOString() }, null, 2)],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leonida-trophy-progress.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast("Progress exported.");
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const ids = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(ids)) throw new Error("not a progress file");
      const known = new Set(trophies.map((t) => t.id));
      const kept = ids.filter((id) => known.has(id));
      earned = new Set(kept);
      saveState();
      renderAll();
      toast(`Imported ${kept.length} earned trophies.`);
    } catch (err) {
      toast("That file is not a Leonida progress export.");
    }
  };
  reader.readAsText(file);
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.hidden = false;
  setTimeout(() => {
    el.hidden = true;
  }, 3000);
}

async function init() {
  loadState();
  const response = await fetch(DATA_URL);
  const data = await response.json();
  trophies = data.trophies;
  $("spoiler-toggle").checked = showSpoilers;
  $("spoiler-toggle").addEventListener("change", (event) => {
    showSpoilers = event.target.checked;
    saveState();
    renderAll();
  });
  $("earned-only").addEventListener("change", (event) => {
    earnedOnly = event.target.checked;
    renderList();
  });
  $("search").addEventListener("input", (event) => {
    searchText = event.target.value.trim().toLowerCase();
    renderList();
  });
  $("tab-checklist").addEventListener("click", () => showView("checklist"));
  $("tab-roadmap").addEventListener("click", () => showView("roadmap"));
  $("export-btn").addEventListener("click", exportProgress);
  $("import-btn").addEventListener("click", () => $("import-file").click());
  $("import-file").addEventListener("change", (event) => {
    if (event.target.files.length) importProgress(event.target.files[0]);
    event.target.value = "";
  });
  $("reset-btn").addEventListener("click", () => {
    if (window.confirm("Clear all earned trophies?")) {
      earned = new Set();
      saveState();
      renderAll();
    }
  });
  renderAll();
}

init();
