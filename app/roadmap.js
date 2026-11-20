// Leonida Trophy Atlas — the road to the platinum, in six stages.
// Each stage names the trophies it covers by id (see app/data/trophies.json)
// and the order to earn them in. The app renders this; nothing here fetches
// the network.

export const ROADMAP = [
  {
    id: "story",
    stage: 1,
    title: "Play the story",
    hours: "50–80 hours",
    note: "Play the campaign at your own pace. Every story trophy pops on its own, so just enjoy it — but do the two Chapter 1 meditations for Positive Mental Attitude before the story moves on (see stage 3).",
    trophies: [
      "just-like-paradise",
      "paradise-lost",
      "tits-ass-drug-money",
      "vice-city-baby",
      "top-of-the-world-ma",
      "trust",
      "break-the-bank",
      "family-matters",
      "dwnfall",
      "hi-jacked",
      "snow-storm",
      "you-gotta-know-when-to-get-off",
    ],
  },
  {
    id: "strangers",
    stage: 2,
    title: "Stranger strands",
    hours: "15–25 hours",
    note: "Strangers appear as question marks on the map as the story opens them up. Clear each strand when it appears; the eight strands also feed the Strangers & Freaks silver.",
    trophies: [
      "road-to-rehabilitation",
      "this-was-no-boat-accident",
      "the-lone-rider",
      "supply-and-demand",
      "spin-on-this",
      "fair-game",
      "strangers-and-freaks",
    ],
  },
  {
    id: "activities",
    stage: 3,
    title: "Activities & challenges",
    hours: "20–30 hours",
    note: "Sample every activity type early for Master of None. Do Positive Mental Attitude in Chapter 1 — it is the only missable trophy on the list. Challenges (50 for One Last Thing, 70 for 100%) complete themselves as you play.",
    trophies: [
      "master-of-none",
      "top-fun",
      "earn-cash-not-kudos",
      "baited-my-tackle",
      "stick-fiddler",
      "positive-mental-attitude",
      "one-last-thing",
      "cunning-stunts",
      "the-shootist",
    ],
  },
  {
    id: "crime",
    stage: 4,
    title: "Crime & partner trophies",
    hours: "10–15 hours",
    note: "Robberies are best done in a focused run: bank vaults, the jewelry store, armored trucks, shops with your partner, and one illegal operation per gang. Save before the stealth ones.",
    trophies: [
      "maximum-withdrawal",
      "hot-together",
      "retail-therapy",
      "sneakthief",
      "a-classic-blitz-play",
      "pest-control",
      "dime-on-the-dollar",
      "gunslinger",
    ],
  },
  {
    id: "collectibles",
    stage: 5,
    title: "Collectibles & exploration",
    hours: "25–40 hours",
    note: "The long grind. Cards (15 sets for 100%), WAiNK scans (100), 100 vehicles, every region, all eight garages. Do these while travelling for other trophies instead of saving them all for the end.",
    trophies: [
      "dont-touch-my-deck",
      "you-wainker",
      "the-goodtime-state",
      "whip-it-good",
      "little-boxes",
      "on-the-spot",
      "treat-yo-self",
    ],
  },
  {
    id: "mopup",
    stage: 6,
    title: "Mop-up & 100%",
    hours: "10–20 hours",
    note: "The ten hidden miscellaneous trophies, then the 100% checklist. Once A Long Road pops, the platinum follows the moment the last trophy does.",
    trophies: [
      "catch-me-if-you-can",
      "challenging-tank",
      "in-the-beginning",
      "capital-offense",
      "lets-go-bowling",
      "personal-best",
      "actions-speak-louder",
      "bad-luck-i-guess",
      "the-truth-is-out-there",
      "ten-pin",
      "a-long-road",
      "vice-got-a-price",
    ],
  },
];

// How many of a stage's trophies are earned.
export function stageProgress(stage, earned) {
  const done = stage.trophies.filter((id) => earned.has(id)).length;
  return { done, total: stage.trophies.length };
}

// Render the roadmap as HTML. `trophies` is the full trophy array from
// trophies.json, `earned` a Set of earned trophy ids, `showSpoilers` whether
// hidden story names may be shown. Hidden story trophies stay masked until
// earned when spoilers are off.
export function renderRoadmap(trophies, earned, showSpoilers) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  const gradeMark = (grade) =>
    grade === "platinum" ? "P" : grade === "gold" ? "G" : grade === "silver" ? "S" : "B";
  return ROADMAP.map((stage) => {
    const { done, total } = stageProgress(stage, earned);
    const rows = stage.trophies
      .map((id) => {
        const t = byId.get(id);
        if (!t) return "";
        const isEarned = earned.has(id);
        const masked = t.hidden && t.kind === "story" && !showSpoilers && !isEarned;
        const name = masked ? "Hidden trophy — earn it to reveal" : t.name;
        const miss = t.missable ? ' <span class="flag missable">MISSABLE</span>' : "";
        return (
          `<li class="road-row${isEarned ? " done" : ""}" data-id="${t.id}">` +
          `<span class="road-check">${isEarned ? "✓" : "○"}</span>` +
          `<span class="grade grade-${t.grade}">${gradeMark(t.grade)}</span>` +
          `<span class="road-name">${name}</span>${miss}</li>`
        );
      })
      .join("");
    return (
      `<section class="road-stage" data-stage="${stage.id}">` +
      `<h3><span class="stage-num">Stage ${stage.stage}</span> ${stage.title} ` +
      `<span class="stage-hours">${stage.hours}</span></h3>` +
      `<p class="stage-note">${stage.note}</p>` +
      `<p class="stage-progress">${done} / ${total} earned</p>` +
      `<ul class="road-list">${rows}</ul></section>`
    );
  }).join("");
}
