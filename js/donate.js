// The Donate page (#/donate): every donator rank, how to get it (donating or bonds), and every perk sorted into groups,
// with a tick under each rank that has it. Same as the in-game Donation guide (::donateguide).
// Keep in step with custom-ranks.txt (the Manager's Ranks page) when ranks or perks change.
(function () {
  const RANKS = [
    // name, dollars, xp %, drops %, colour
    ['Lost Soul', 25, 10, 0.5, '#b8b8b8'],
    ['Wraith', 50, 20, 1, '#9ec9ff'],
    ['Phantom', 100, 30, 1.5, '#b072e6'],
    ['Shade', 200, 40, 2, '#2fb5a8'],
    ['Revenant', 350, 50, 2.5, '#e0602a'],
    ['Reaper', 600, 60, 3, '#ff2a2a'],
    ['Death', 1000, 70, 3.5, '#e8c45c'],
    ['Eternal', 2500, 70, 3.5, '#b8f4ff'],
    ['Oblivion', 5000, 70, 3.5, '#a66bff'],
  ];
  const COINS_PER_DOLLAR = 150e6;

  // Each perk: [what it does, lowest rank (0 = Lost Soul ... 8 = Oblivion), how to use it]
  const GROUPS = [
    ['⚔️', 'Combat', [
      ['Always protected from dragonfire (anti-fire)', 3, 'Always on'],
      ['Potions, anti-fires and overloads last twice as long', 4, 'Always on'],
      ['Prayer drains 25% slower', 4, 'Always on'],
      ['Prayer drains 50% slower', 6, 'Always on'],
      ['Prayer never goes down', 7, 'Always on'],
      ['Always fully protected from dragonfire (super anti-fire)', 6, 'Always on'],
      ['Ranged never uses up arrows or bolts', 6, 'Always on'],
      ['Run energy never runs out', 6, 'Always on'],
      ['Special attack restores twice as fast', 7, 'Always on'],
      ['A free Reaper\'s Elixir every day', 7, 'Comes with the daily chest in ::donator'],
    ]],
    ['💰', 'Loot & money', [
      ['XP and drop boosts (see the table above)', 0, 'Always on'],
      ['Every Grand Exchange slot (others get 3)', 0, 'Always on'],
      ['Blood money goes straight to your bank', 2, 'Always on'],
      ['Vote perks always on, as if you voted', 3, 'Always on'],
      ['Monster drops go straight to your bank', 3, 'Always on'],
      ['One free Elite mystery box every day', 6, 'Claim in ::donator'],
      ['The daily box becomes a Legendary mystery chest', 7, 'Claim in ::donator'],
      ['The full bond drop chance (Death gets half)', 7, 'Always on'],
      ['Coins from kills go straight into your money pouch', 7, 'Always on'],
      ['Double Contract points (Death\'s Contracts and fishing contracts)', 7, 'Always on'],
    ]],
    ['💀', 'Slayer', [
      ['Skipping a Slayer task costs 15 points instead of 30', 3, 'At any Slayer master'],
      ['Teleport straight to your Slayer task', 4, '::tasktp or the button in ::donator'],
      ['Double Slayer points', 5, 'Always on'],
      ['Pick your own Slayer task for 30 points', 7, '::picktask'],
    ]],
    ['⛏️', 'Skilling & minigames', [
      ['Can enter the Refuge of Fear minigame', 1, ''],
      ['Skip Fight Caves waves and fight TzTok-Jad straight away', 2, ''],
      ['Farming patch teleports', 2, '::patches'],
      ['+2 harvest from farming patches', 4, 'Always on'],
      ['Familiars last 50% longer', 4, 'Always on'],
      ['Familiar special moves need no scrolls', 4, 'Always on'],
      ['Double Pest Control points, Fight Caves tokkul and Dominion Tower points', 4, 'Always on'],
      ['Fight Kiln starts at wave 10', 6, ''],
    ]],
    ['🧭', 'Travel & handy', [
      ['The Donator Zone', 0, '::dhub or the Donator Zone teleport'],
      ['The donator gravestone', 0, 'Always on'],
      ['Open your bank anywhere', 1, '::bank'],
      ['Fly', 2, '::fly'],
      ['Death Recap: where you died, your items, teleport back', 6, '::death'],
      ['The Death Zone: the top ranks\' own zone (see below)', 6, 'Teleport button in ::donator, home portal or Teleports menu'],
      ['Your own private island with a bank, altar and monster pen', 8, '::myisland'],
      ['Start 1 hour of Death Zone double drops once a week', 8, '::zoneevent'],
    ]],
    ['✨', 'Looks & chat', [
      ['Talk to the whole server', 0, '::yell'],
      ['Pick a title, or make your own', 0, '::title, ::customtitle'],
      ['Green and blue skin', 0, '::greenskin, ::blueskin'],
      ['Swimming', 0, '::swimming'],
      ['Change your yell and title colours', 1, '::yellcolor, ::titlecolor, ::titleshade'],
      ['Change your chat colour', 3, '::chatcolor'],
      ['Change your display name', 3, '::setdisplay'],
      ['Animated name glow (white-cyan for Eternal, void purple for Oblivion)', 7, 'Yells and login messages'],
      ['A dark entrance and a server message when you log in', 8, 'Always on'],
    ]],
  ];

  const DEATH_ZONE = [
    ['Every skill in one place', 'All ores, trees, a fishing dock, forge, workshop and altars.'],
    ['Never runs out', 'Rocks and trees never deplete; resources can go straight to your bank.'],
    ['Auto-smelt & auto-cook', 'The Reaper\'s toolkit: ore becomes bars, food never burns, full XP.'],
    ['Extra XP', 'A zone XP boost, plus a skill of the day at 1.5x XP and golden spots with double XP.'],
    ['Monster pens', 'Safe deaths, drops to bank, a loot sack and rare superior monsters.'],
    ['Death\'s Contracts', 'Kill tasks for Contract points, prestige and the Reaper\'s Mark.'],
    ['Free boosts', 'A rejuvenation pool and a potion fountain every 30 minutes.'],
    ['Unlimited run', 'No run drain and no prayer drain inside the zone.'],
    ['Teleport hub', 'One click to bosses, skilling spots and raids, no runes.'],
    ['Daily Death chest', 'A free loot roll every day, plus a weekly giveaway wheel.'],
    ['Guest pass', 'Bring one friend in for 30 minutes a day.'],
  ];

  const EARN = [
    ['💳', 'Donate', 'Every $1 you donate adds $1 to your rank total. <b>Only ever donate to Shadow</b> - anyone else asking is scamming you.'],
    ['🎟️', 'Bonds', 'Bonds come in $5, $10, $20, $30, $50 and $100. Right-click <b>Redeem</b> and pick: rank + Credits, rank only, or Credits only (twice as many). Redeeming also gives +10% drops for 1 hour.'],
    ['🐉', 'Boss drops', 'Every boss can drop a bond: $5 about 1 in 150, $10 1 in 400, $20 1 in 1,000, and a <b>Lucky bond chest</b> 1 in 2,500 (opens into a $5 to $100 bond). Lower ranks are luckier; Death gets half, Eternal and Oblivion the full chance.'],
    ['🏆', 'Milestones', 'Once each: first 99 ($5), total level 2,000 ($5), all 99s ($20), the completionist cape ($10). Slayer: every 250 tasks $5, every 150 Elite tasks $10. Not on Easy mode.'],
    ['🏰', 'Raids', 'Normal-mode Chambers of Xeric and Theatre of Blood: about 1 in 60 for a bond.'],
    ['🎉', 'Events', 'Top damage on an event boss and the Death Zone giveaway wheel: 1 in 15. Trivia answers: 1 in 400.'],
    ['🗺️', 'Weekly bond hunt', 'Every Saturday from 6pm a chest with a $5 bond is hidden in a town. Solve the riddle in chat and open it first.'],
    ['🤝', 'Buy from players', 'Bonds are worth <b>150M coins per $1</b> ($5 = 750M, $100 = 15B). Players sell them in their own Trading Post shops - bonds can\'t be sold to stores, the Grand Exchange or Quick Sell. The <b>Bond Exchange</b> in the Death Plaza combines or splits them.'],
  ];

  const coins = (n) => n >= 1e9 ? (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B' : Math.round(n / 1e6) + 'M';

  const rankCards = RANKS.map(([n, d, xp, dr, c], i) => `
    <article class="d-rank" style="--rc:${c}">
      <img class="rank-emblem" src="img/cinematic/rank-${n.toLowerCase().replace(/ /g, '-')}-reforged.png" alt="" width="640" height="640" loading="lazy">
      <div class="d-rname">${n}</div>
      <div class="d-amt">$${d.toLocaleString()}</div>
      <div class="d-boost">+${xp}% XP · +${dr}% drops</div>
      <div class="d-coins">${coins(d * COINS_PER_DOLLAR)} coins in bonds</div>
      ${i >= 7 ? '<div class="d-tag">Perks only</div>' : ''}
      <a class="rank-perks" href="#d-perks">View perks <span aria-hidden="true">↓</span></a>
    </article>`).join('');

  const head = '<tr><th scope="col">Perk</th>' + RANKS.map(([n, , , , c]) => `<th scope="col" class="d-c" style="--perk-rank:${c}">${n}</th>`).join('') + '</tr>';
  const groups = GROUPS.map(([, name, perks]) => {
    const id = 'd-' + name.toLowerCase().replace(/[^a-z]+/g, '-');
    return `
    <section class="ch d-perk-group" id="${id}">
      <h2 id="${id}-title">${name}</h2>
      <div class="d-scroll" tabindex="0" role="region" aria-labelledby="${id}-title">
        <table class="d-table"><thead>${head}</thead><tbody>${perks.map(([what, from, how]) => `
          <tr><th scope="row">${what}${how ? `<div class="small">${how}</div>` : ''}</th>${RANKS.map((r, i) =>
            `<td class="d-c">${i >= from ? '<span class="d-yes" aria-label="Included">✔</span>' : '<span class="d-no" aria-label="Unavailable">·</span>'}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
    </section>`;
  }).join('');

  window.DONATE_TOC = `<a href="#d-ranks">The ranks</a><a href="#d-earn">How to get them</a>`
    + GROUPS.map(([, n]) => `<a href="#d-${n.toLowerCase().replace(/[^a-z]+/g, '-')}">${n}</a>`).join('')
    + `<a href="#d-zone">The Death Zone</a>`;

  window.DONATE_RANKS = `
    <section class="ch" id="d-ranks">
      <h2>The ranks</h2>
      <p>Your rank goes by how much you've donated in total (bonds count too). Each rank has every perk of the ranks below it. Eternal and Oblivion keep Death's boosts and add their own perks.</p>
      <div class="d-ranks">${rankCards}</div>
    </section>
  `;

  window.DONATE_HTML = `
    <div class="warn"><b>Only donate to Shadow.</b> Anyone else asking for donations is scamming you. In game, type <code>::donateguide</code> for this page, <code>::rank</code> for your progress and <code>::donator</code> for your perks.</div>
    <section class="ch" id="d-earn">
      <h2>How to get them</h2>
      <div class="grid">${EARN.map(([, t, p]) => `<div class="card"><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
    </section>
    <div id="d-perks">${groups}</div>
    <section class="ch" id="d-zone">
      <h2>The Death Zone <span class="muted small">Death, Eternal and Oblivion</span></h2>
      <p>The top ranks' own island. Get there with the <b>Teleport: Death Zone</b> button in <code>::donator</code>, the portal at home or the Teleports menu.</p>
      <div class="grid">${DEATH_ZONE.map(([t, p]) => `<div class="card"><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
    </section>`;
})();
