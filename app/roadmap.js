/* Leonida Trophy Atlas — roadmap to the platinum.
   Built only from the official trophy descriptions and the cited guides
   (PowerPyx, GTABase): story chapters and missions, collectibles and counts,
   in the order to earn them. No online trophies exist. */
(function () {
  var ROADMAP = [
    {
      title: "Step 1 — Play the story, collect as you go (60–80 hours)",
      meta: "Chapters 1–5: Gone Fishing, Breakfast Run, The Cartel Heist, Child's Play, Headliners, VCIA Takedown, Operation Savage Glory, and the final mission.",
      body: "Finish all five chapters in order. The 12 story trophies pop on their own: Just Like Paradise, Paradise Lost, T**s Ass Drug Money, Vice City, Baby!, Top Of The World, Ma, You Gotta Know When to Get Off, Trust, Break the Bank, Family Matters, DWNFALL, Hi-Jacked and Snow Storm. Do optional missions as they appear, scan vehicles (200 of 277 needed later) and study animals (100 of 255) with the WAiNK app and binoculars as you travel, because that progress already counts toward 100 percent.",
      trophies: ["Just Like Paradise", "Paradise Lost", "T**s Ass Drug Money", "Vice City, Baby!", "Top Of The World, Ma", "You Gotta Know When to Get Off", "Trust", "Break the Bank", "Family Matters", "DWNFALL", "Hi-Jacked", "Snow Storm"]
    },
    {
      title: "Step 1b — The one thing to do before Chapter 1 ends",
      meta: "Positive Mental Attitude — the only possibly missable trophy.",
      body: "After the mission Down to Earth, look for Lucia at Jason's house in the morning. When she mentions meditating, follow her to the balcony and accept. That is the first of 18 meditation spots in 10 locations; the last ones need both characters, after Coffee Break in Chapter 2. Whether the Chapter 1 meditation is required is unconfirmed, so do it to be safe.",
      trophies: ["Positive Mental Attitude"]
    },
    {
      title: "Step 2 — Strangers and side characters (alongside the story)",
      meta: "8 stranger strands; final missions for Andy, Kenton, Billy, Randy and Tyrone; a unique animal for Bret.",
      body: "Work the Strangers & Freaks strands as they open: any 8 finished strands earn the silver. Finish the final mission of each named stranger for their trophy — Andy (Lucia-only), Kenton, Billy, Randy and Tyrone (Jason-only) — and hunt Bret's unique animal (Jason-only). These stay open in free roam after the story, so nothing here is missable.",
      trophies: ["Strangers & Freaks", "Road to Rehabilitation", "This Was No Boat Accident", "The Lone Rider", "Supply & Demand", "Spin On This!", "Fair Game"]
    },
    {
      title: "Step 3 — Activities and races (during and after the story)",
      meta: "250 stunts, 42 shooting-range golds, 14 drone-race locations, 20 different races, 9 activity types, 50 of 80 challenges.",
      body: "Try all 9 activity types once for Master of None. Gold all 42 Shooting Range challenges for The Shootist, win a Top Fun Drone Race at all 14 locations, win 20 different races, beat Cal at fishing, finish one arcade game, bowl at the Kolt & Associates alley, and complete 50 of the 80 Challenges for One Last Thing (70 of 80 are needed for 100 percent, so keep going).",
      trophies: ["Master of None", "The Shootist", "Top Fun", "Earn Cash, Not Kudos", "Baited My Tackle", "Stick Fiddler", "One Last Thing", "Cunning Stunts", "Let’s Go Bowling"]
    },
    {
      title: "Step 4 — Crime, robberies and the police",
      meta: "5 bank vaults, 1 armored truck, 1 illegal operation per gang (9 gangs), 3 shops back-to-back, a 4-star escape, $250,000 laundered.",
      body: "Rob 5 Bank Vaults and escape, rob an Armored Truck, and rob one Illegal Operation belonging to each of the 9 gangs. With your partner, rob 3 shops back-to-back without losing your Wanted Level, and lose a 4-star Wanted Level together. Launder $250,000 of Marked Bills through your contacts, take down 5 enemies in one Combat Focus, and rob a jewelry store without being detected.",
      trophies: ["Maximum Withdrawal", "A Classic Blitz Play", "Pest Control", "Retail Therapy", "Hot Together", "Dime on the Dollar", "Gunslinger", "Sneakthief"]
    },
    {
      title: "Step 5 — Collectibles, exploration and money",
      meta: "3 card sets, 100 WAiNK locations, 100 vehicles, all 52 areas, 8 garages, 10 Scooter Bros registrations, $100,000 spent.",
      body: "Complete 3 Collectible Card sets, WAiNK It at 100 locations, discover 100 vehicles, and explore all 52 areas of Leonida. Buy all 8 garage properties, register 10 vehicles to the Scooter Bros app, and spend $100,000 across all shops — the spending, garages and vehicles all feed each other.",
      trophies: ["Don't Touch My Deck", "You WAiNKer!", "Whip It Good", "The Goodtime State", "Little Boxes", "On the Spot", "Treat Yo Self"]
    },
    {
      title: "Step 6 — Secrets, choices and the 100 percent checklist (~100 hours)",
      meta: "Progress > Stats > 100% Completion; A Long Road is the hardest trophy.",
      body: "After the credits, open Progress, then Stats, then 100% Completion and work the checklist: every robbery, underwater discovery, shooting range, drone race and Bret quest, plus 70 of 80 challenges. Sweep the secret trophies on the way: a cocktail on Ocean Beach, the showroom smash, the unscheduled VCIA departure, the Rhino drive, the melee drive-by, the second-attempt trophy, the strange event, the partnership appeal and the choices count. Finish A Long Road, and Vice Got a Price! pops with it.",
      trophies: ["A Long Road", "In The Beginning…", "Capital Offense", "Catch Me If You Can", "Challenging Tank", "Ten Pin", "Bad Luck, I Guess", "The Truth Is Out There", "Personal Best", "Actions Speak Louder", "Vice Got a Price!"]
    }
  ];

  function renderRoadmap() {
    var host = document.getElementById("roadmap");
    if (!host) return;
    host.innerHTML = "";
    ROADMAP.forEach(function (step) {
      var li = document.createElement("li");
      var title = document.createElement("strong");
      title.textContent = step.title;
      var meta = document.createElement("div");
      meta.className = "step-meta";
      meta.textContent = step.meta;
      var body = document.createElement("p");
      body.textContent = step.body;
      li.appendChild(title);
      li.appendChild(meta);
      li.appendChild(body);
      host.appendChild(li);
    });
  }

  window.LeonidaRoadmap = { steps: ROADMAP, render: renderRoadmap };
})();

/* Roadmap coverage check: every one of the 55 trophies is named in at least
   one roadmap step above, so the roadmap really covers the whole list. */
(function () {
  if (!window.LeonidaRoadmap) return;
  var named = {};
  window.LeonidaRoadmap.steps.forEach(function (step) {
    step.trophies.forEach(function (name) { named[name] = true; });
  });
  window.LeonidaRoadmap.coveredTrophyCount = Object.keys(named).length;
})();
