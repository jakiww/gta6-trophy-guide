/* Leonida Trophy Atlas — tracker logic.
   Loads app/data/trophies.json, renders the checklist, saves earned trophies
   in localStorage, and exports/imports that progress as a file. No network
   request is made except loading the app's own data file. */
(function () {
  "use strict";

  var STORAGE_KEY = "leonida-trophy-atlas-v1";
  var SPOILER_KEY = "leonida-trophy-atlas-spoilers";
  var GRADE_ORDER = ["platinum", "gold", "silver", "bronze"];
  var KIND_LABELS = {
    story: "Story",
    missable: "Missable",
    collectibles: "Collectibles",
    activities: "Activities",
    crime: "Crime",
    misc: "Side & secrets",
    platinum: "Platinum",
    online: "Online"
  };

  var trophies = [];
  var earned = new Set();
  var activeKind = "all";
  var activeGrade = "all";
  var searchText = "";
  var earnedOnly = false;
  var hideEarned = false;
  var hideSpoilers = true;

  var listEl = document.getElementById("list");
  var progressTextEl = document.getElementById("progressText");
  var progressBarEl = document.getElementById("progressBar");
  var gradeTextEl = document.getElementById("gradeText");
  var gradeCountsEl = document.getElementById("gradeCounts");
  var resultCountEl = document.getElementById("resultCount");
  var saveNoteEl = document.getElementById("saveNote");
  var searchEl = document.getElementById("search");
  var gradeFilterEl = document.getElementById("gradeFilter");
  var spoilerToggleEl = document.getElementById("spoilerToggle");
  var earnedOnlyEl = document.getElementById("earnedOnly");
  var hideEarnedEl = document.getElementById("hideEarned");
  var exportBtn = document.getElementById("exportBtn");
  var importFileEl = document.getElementById("importFile");
  var resetBtn = document.getElementById("resetBtn");

  function loadStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var ids = JSON.parse(raw);
        if (Array.isArray(ids)) ids.forEach(function (id) { earned.add(id); });
      }
      var sp = localStorage.getItem(SPOILER_KEY);
      if (sp !== null) hideSpoilers = sp === "1";
    } catch (err) { earned = new Set(); }
  }

  function saveStored(note) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(earned).sort(function (a, b) { return a - b; })));
      localStorage.setItem(SPOILER_KEY, hideSpoilers ? "1" : "0");
    } catch (err) { /* storage full or blocked: progress stays in memory only */ }
    if (note && saveNoteEl) {
      saveNoteEl.textContent = "Saved.";
      window.setTimeout(function () { saveNoteEl.textContent = ""; }, 2000);
    }
  }

  function trophyMatches(t) {
    if (activeKind === "online") return false;
    if (activeKind === "missable" && !t.missable) return false;
    if (activeKind !== "all" && activeKind !== "missable" && t.kind !== activeKind) return false;
    if (activeGrade !== "all" && t.grade !== activeGrade) return false;
    if (earnedOnly && !earned.has(t.id)) return false;
    if (hideEarned && earned.has(t.id)) return false;
    if (searchText) {
      var hay = (t.name + " " + t.description + " " + t.guide + " " + t.kind).toLowerCase();
      if (hay.indexOf(searchText) === -1) return false;
    }
    return true;
  }

  function isSpoilerHidden(t) {
    return hideSpoilers && t.kind === "story" && !earned.has(t.id);
  }

  function gradeBadge(t) {
    var span = document.createElement("span");
    span.className = "badge " + t.grade;
    span.textContent = t.grade;
    return span;
  }

  function renderCard(t) {
    var card = document.createElement("article");
    card.className = "card" + (earned.has(t.id) ? " earned" : "");
    card.dataset.trophyId = String(t.id);

    var head = document.createElement("div");
    head.className = "card-head";

    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = earned.has(t.id);
    box.setAttribute("aria-label", "Mark " + t.name + " as earned");
    box.addEventListener("change", function () {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveStored(true);
      renderAll();
    });
    head.appendChild(box);

    var titleWrap = document.createElement("div");
    titleWrap.className = "card-title";
    var h3 = document.createElement("h3");
    if (isSpoilerHidden(t)) {
      h3.textContent = "Hidden story trophy";
      h3.className = "spoiler-note";
    } else {
      h3.textContent = t.name;
      if (earned.has(t.id)) h3.className = "earned-name";
    }
    titleWrap.appendChild(h3);
    var desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = isSpoilerHidden(t)
      ? "Story trophy — its name and description stay hidden until you earn it."
      : t.description;
    titleWrap.appendChild(desc);

    var badges = document.createElement("div");
    badges.appendChild(gradeBadge(t));
    var kindTag = document.createElement("span");
    kindTag.className = "badge tag";
    kindTag.textContent = KIND_LABELS[t.kind] || t.kind;
    badges.appendChild(kindTag);
    if (t.hidden) {
      var hid = document.createElement("span");
      hid.className = "badge hidden-flag";
      hid.textContent = "Hidden on PSN";
      badges.appendChild(hid);
    }
    if (t.missable) {
      var mis = document.createElement("span");
      mis.className = "badge miss";
      mis.textContent = "Missable";
      badges.appendChild(mis);
    }
    titleWrap.appendChild(badges);
    head.appendChild(titleWrap);
    card.appendChild(head);

    if (!isSpoilerHidden(t)) {
      var guide = document.createElement("details");
      guide.className = "guide";
      var summary = document.createElement("summary");
      summary.textContent = "Guide — how to earn it";
      guide.appendChild(summary);
      var para = document.createElement("p");
      para.textContent = t.guide;
      guide.appendChild(para);
      if (t.sources && t.sources.length) {
        var src = document.createElement("p");
        src.className = "sources";
        src.appendChild(document.createTextNode("Sources: "));
        t.sources.forEach(function (s, i) {
          if (i > 0) src.appendChild(document.createTextNode(" · "));
          var a = document.createElement("a");
          a.href = s.url;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = s.name;
          src.appendChild(a);
        });
        guide.appendChild(src);
      }
      card.appendChild(guide);
    }
    return card;
  }

  function renderProgress() {
    var total = trophies.length;
    var done = earned.size;
    var pct = total ? Math.round((done / total) * 100) : 0;
    progressTextEl.textContent = done + " of " + total + " earned · " + pct + "%";
    progressBarEl.style.width = pct + "%";
    var parts = GRADE_ORDER.map(function (g) {
      var gTotal = trophies.filter(function (t) { return t.grade === g; }).length;
      var gDone = trophies.filter(function (t) { return t.grade === g && earned.has(t.id); }).length;
      return g + " " + gDone + "/" + gTotal;
    });
    gradeCountsEl.textContent = parts.join(" · ");
    gradeTextEl.textContent = done === total && total > 0 ? "Platinum earned!" : "";
  }

  function renderList() {
    listEl.innerHTML = "";
    var shown = trophies.filter(trophyMatches);
    if (activeKind === "online") {
      var note = document.createElement("p");
      note.className = "empty";
      note.textContent = "There are no online trophies in GTA 6 — all 55 are offline single-player, so this filter is empty by design.";
      listEl.appendChild(note);
    } else if (shown.length === 0) {
      var empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No trophies match these filters. Clear the search or pick another kind.";
      listEl.appendChild(empty);
    } else {
      shown.forEach(function (t) { listEl.appendChild(renderCard(t)); });
    }
    resultCountEl.textContent = activeKind === "online"
      ? "0 online trophies — every trophy is offline."
      : "Showing " + shown.length + " of " + trophies.length + " trophies.";
  }

  function renderAll() {
    renderProgress();
    renderList();
  }

  function exportProgress() {
    var payload = {
      app: "leonida-trophy-atlas",
      game: "Grand Theft Auto VI",
      exportedAt: new Date().toISOString(),
      earned: Array.from(earned).sort(function (a, b) { return a - b; })
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "gta6-trophies-progress.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    if (saveNoteEl) saveNoteEl.textContent = "Exported " + earned.size + " earned trophies.";
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result));
        var ids = Array.isArray(data) ? data : data.earned;
        if (!Array.isArray(ids)) throw new Error("bad file");
        var next = new Set();
        ids.forEach(function (id) {
          var n = Number(id);
          if (trophies.some(function (t) { return t.id === n; })) next.add(n);
        });
        earned = next;
        saveStored(true);
        renderAll();
        if (saveNoteEl) saveNoteEl.textContent = "Imported " + earned.size + " earned trophies.";
      } catch (err) {
        if (saveNoteEl) saveNoteEl.textContent = "That file is not a progress export from this guide.";
      }
    };
    reader.readAsText(file);
  }

  function bindControls() {
    document.querySelectorAll("#kindFilters .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll("#kindFilters .chip").forEach(function (c) { c.classList.remove("on"); });
        chip.classList.add("on");
        activeKind = chip.dataset.kind;
        renderList();
      });
    });
    searchEl.addEventListener("input", function () {
      searchText = searchEl.value.trim().toLowerCase();
      renderList();
    });
    gradeFilterEl.addEventListener("change", function () {
      activeGrade = gradeFilterEl.value;
      renderList();
    });
    spoilerToggleEl.checked = hideSpoilers;
    spoilerToggleEl.addEventListener("change", function () {
      hideSpoilers = spoilerToggleEl.checked;
      saveStored(false);
      renderList();
    });
    earnedOnlyEl.addEventListener("change", function () {
      earnedOnly = earnedOnlyEl.checked;
      if (earnedOnly) hideEarned = false, hideEarnedEl.checked = false;
      renderList();
    });
    hideEarnedEl.addEventListener("change", function () {
      hideEarned = hideEarnedEl.checked;
      if (hideEarned) earnedOnly = false, earnedOnlyEl.checked = false;
      renderList();
    });
    exportBtn.addEventListener("click", exportProgress);
    importFileEl.addEventListener("change", function () {
      if (importFileEl.files && importFileEl.files[0]) importProgress(importFileEl.files[0]);
      importFileEl.value = "";
    });
    resetBtn.addEventListener("click", function () {
      if (window.confirm("Reset all earned trophies in this browser?")) {
        earned = new Set();
        saveStored(true);
        renderAll();
      }
    });
  }

  function start() {
    loadStored();
    bindControls();
    if (window.LeonidaRoadmap) window.LeonidaRoadmap.render();
    fetch("data/trophies.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        trophies = data.trophies || data;
        renderAll();
      })
      .catch(function () {
        listEl.innerHTML = "";
        var err = document.createElement("p");
        err.className = "empty";
        err.textContent = "Could not load data/trophies.json. Serve the app/ folder with a static server and reload.";
        listEl.appendChild(err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

/* Expand-all helper: one button in the tracker controls opens or closes
   every visible trophy guide at once, so a reader can scan all the
   cited guides without opening them one by one. */
(function () {
  "use strict";
  var panel = document.getElementById("controls");
  if (!panel) return;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Expand all guides";
  btn.addEventListener("click", function () {
    var guides = document.querySelectorAll("#list details.guide");
    var anyClosed = Array.prototype.some.call(guides, function (g) { return !g.open; });
    guides.forEach(function (g) { g.open = anyClosed; });
    btn.textContent = anyClosed ? "Collapse all guides" : "Expand all guides";
  });
  var row = panel.querySelector(".control-row:last-of-type") || panel;
  row.appendChild(btn);
})();
