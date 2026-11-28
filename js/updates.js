// =====================================================================
//  NEW UPDATES (#/updates): the big player-facing changes, newest first.
//  Same format as "Shadow of Death - Patch Notes.html": add a new
//  <div class="update"> at the TOP for each update. Tags: new, changed,
//  fixed, removed. Owner tools and Server Manager things don't go here
//  (they go in the owner-only patch notes).
// =====================================================================
window.UPDATES_HTML = `

<div class="update">
  <h2>High Scores</h2>
  <div class="date">November 28, 2026</div>

  <section id="highscores">
    <h3><span class="icon">&#127942;</span>High Scores for every game mode</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>High Scores</b> in game: Menu Hub &rsaquo; My Account &rsaquo; High Scores, or <b>::highscores</b>. A tab for every game mode, Overall or any skill, the top 50 and your own rank.</li>
      <li><span class="tag new">NEW</span> <b>Click a name</b> to see all of that player's skills, with their level and rank in each.</li>
      <li><span class="tag new">NEW</span> <b>High Scores on the website</b>: the new <a href="#/highscores">High Scores</a> page in the top menu, with skill icons, a page per mode and a <b>Look up a player</b> box. Click a name for their full skills card.</li>
      <li><span class="tag changed">CHANGED</span> Both update <b>every minute</b>.</li>
    </ul>
  </section>
  <section id="website-button">
    <h3><span class="icon">&#127760;</span>Website in game</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>::website</b> or the <b>Website</b> tile in Menu Hub &rsaquo; Help opens this website in your browser. Thanks to Kagemaru for the idea!</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Bigger bank in your hub colour</h2>
  <div class="date">November 28, 2026</div>

  <section id="bank">
    <h3><span class="icon">&#127974;</span>The bank</h3>
    <ul>
      <li><span class="tag changed">CHANGED</span> On a big game window the bank is <b>wider</b> and shows up to <b>16 items per row</b> instead of 10, so you scroll less. It stays in the middle of the screen. Items stay their normal size.</li>
      <li><span class="tag changed">CHANGED</span> The bank's frame, tabs and buttons now use <b>your hub colour</b> (Menu Hub &rsaquo; Settings &rsaquo; Hub &rsaquo; Hub colour). Change your hub colour and the bank changes too.</li>
      <li><span class="tag fixed">FIXED</span> The <b>Bank value / Total wealth</b> line at the top of the bank stays put.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>New game modes &amp; a new mode picker</h2>
  <div class="date">November 28, 2026</div>

  <section id="game-modes">
    <h3><span class="icon">&#9881;</span>Special game modes</h3>
    <ul>
      <li><span class="tag new">NEW</span> The owner can now add <b>new game modes</b> on top of the usual six. Each one plays like Normal or one of the Ironman modes, with its own XP rates, drop boost and starter kit. Idea from Kagemaru!</li>
      <li><span class="tag new">NEW</span> A mode can make <b>rare drops 2x, 5x or 10x more often</b>, turn off <b>XP boosts</b> (weekend double XP, vote XP and XP items), or only let you <b>trade with players on the same mode</b>.</li>
      <li><span class="tag new">NEW</span> Each mode can have its own <b>chat icon and tag</b>. The icon shows before your name in chat, and the tag in <code>::yell</code>.</li>
      <li><span class="tag new">NEW</span> If a mode is ever removed, you keep all your items and levels and simply pick a new mode.</li>
    </ul>
  </section>

  <section id="mode-picker">
    <h3><span class="icon">&#127919;</span>New mode picker</h3>
    <ul>
      <li><span class="tag changed">CHANGED</span> New players pick their mode in a <b>hub-style window</b>: a card for every mode with its XP and drop rate. Click one to see everything about it, including the whole starter kit, then <b>Confirm</b>.</li>
      <li><span class="tag new">NEW</span> Closed it before picking? Type <code>::pickmode</code>.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Login Streak, Profiles &amp; Hub colours</h2>
  <div class="date">November 23, 2026</div>

  <section id="login-streak">
    <h3><span class="icon">&#128197;</span>Login Streak</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Menu Hub &rsaquo; Tasks &rsaquo; Login Streak</b> (<code>::streak</code>): a reward every day you log in. Day 1 is 10M coins, +2M a day, up to 60M a day from day 26.</li>
      <li><span class="tag new">NEW</span> Bonus boxes: Elite box on days 7 and 14, 2 Elite boxes on day 21, and a Legendary chest + 100M cash ticket on day 30. Then it starts again.</li>
      <li><span class="tag new">NEW</span> One missed day a week is free. Miss more and it goes back to day 1.</li>
    </ul>
  </section>

  <section id="profile-card">
    <h3><span class="icon">&#128100;</span>Profile card</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>My Account &rsaquo; Profile</b> or right-click a player &rsaquo; <b>View Profile</b>: rank, levels, play time, joined date, login streak, top boss kills, collection log %, Slayer, raids, Reaper tasks, Death Zone prestige and best drop.</li>
      <li><span class="tag changed">CHANGED</span> "View Stats" on players is now "View Profile".</li>
    </ul>
  </section>

  <section id="hub-colours">
    <h3><span class="icon">&#127912;</span>Hub colours &amp; What's New</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Settings &rsaquo; Hub &rsaquo; Hub colour</b>: Green, Red, Purple and Ice for everyone; Gold, Blue, Rose, Inferno and Silver for donators. Back to default any time.</li>
      <li><span class="tag new">NEW</span> <b>Help &rsaquo; What's New</b> shows these update notes in game, with a gold dot when there's a new one.</li>
      <li><span class="tag new">NEW</span> Donator colours glow with moving bands and rising sparks. Donators can tick <b>Sparkle</b> to get it on any colour, even green.</li>
      <li><span class="tag new">NEW</span> <b>Settings &rsaquo; Hub &rsaquo; Colour effects</b> turns the glow and sparks off if you just want the plain colour.</li>
      <li><span class="tag fixed">FIXED</span> What's New text no longer gets cut off, and its tabs use short names.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>New shops, Inbox &amp; player reports</h2>
  <div class="date">November 23, 2026</div>

  <section id="hub-shops">
    <h3><span class="icon">&#128722;</span>Shops</h3>
    <ul>
      <li><span class="tag changed">CHANGED</span> Every shop now opens in the same glowing window as the Menu Hub, with each item's picture, name and price. Click to buy one, or use <b>Buy X</b>. General stores have a <b>Sell</b> tab.</li>
      <li><span class="tag changed">CHANGED</span> Every shop on the Shops page has a picture that fits it.</li>
    </ul>
  </section>

  <section id="inbox">
    <h3><span class="icon">&#9993;</span>Inbox</h3>
    <ul>
      <li><span class="tag new">NEW</span> An <b>envelope</b> on the Menu Hub with a red number for unread notes. It keeps what you missed: Trading Post sales, fixed bug reports, rare drops, finished Death's Contracts, events starting and messages from staff.</li>
      <li><span class="tag new">NEW</span> Some messages from staff say <b>REPLY (click)</b>: click to type an answer, and it goes straight to their Inbox.</li>
    </ul>
  </section>

  <section id="player-reports">
    <h3><span class="icon">&#9888;</span>Report a player</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Help &rsaquo; Report a Player</b> or <code>::report name</code>: pick the rule, say what happened and add a proof link. Staff see it straight away, and you get an Inbox note when it's handled.</li>
    </ul>
  </section>

  <section id="donator-reset">
    <h3><span class="icon">&#8634;</span>Donators</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Settings &rsaquo; Donator &rsaquo; Reset look</b> puts your title, colours, display name and skin back to your rank's normal look.</li>
    </ul>
  </section>

  <section id="nov23-fixes">
    <h3><span class="icon">&#128295;</span>Fixes</h3>
    <ul>
      <li><span class="tag fixed">FIXED</span> The New Player Guide's grey text is no longer cut short.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>The Menu Hub</h2>
  <div class="date">November 23, 2026</div>

  <section id="menu-hub">
    <h3><span class="icon">&#9776;</span>Menu Hub</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>One window for everything.</b> Tabs down the left (Home, Teleports, Tasks, Shops &amp; Money, My Account, Donator, Fun &amp; Events, Help, Settings) and big picture tiles on the right. Click a tile to open it, and <b>&lt; Hub</b> takes you back.</li>
      <li><span class="tag new">NEW</span> Open it with the green <b>hub button</b> under the minimap, <b>F1</b> or <code>::hub</code>. It also opens when you log in.</li>
      <li><span class="tag new">NEW</span> <b>Settings &rsaquo; Widgets</b>: turn each button (T, D, M, !) and on-screen box (event timer, slayer counter, pinned task, Death's Contract, potion timers, boss health bar) on or off. Saved on your account.</li>
      <li><span class="tag changed">CHANGED</span> Everyone starts with just the hub button, so the screen is clean. Turn your old buttons back on in Widgets.</li>
      <li><span class="tag changed">CHANGED</span> Donator tiles only show if you have the rank.</li>
      <li><span class="tag changed">CHANGED</span> The glowing windows now have a dark green background instead of brown.</li>
    </ul>
  </section>

  <section id="menu-hub-rightnow">
    <h3><span class="icon">&#9889;</span>Right now strip</h3>
    <ul>
      <li><span class="tag new">NEW</span> The top of the Menu Hub's <b>Home</b> page shows what's on right now: <b>Double XP</b>, <b>Double drops</b>, the <b>World boss</b> and players <b>Online</b>. Anything ON glows, with the time left.</li>
      <li><span class="tag new">NEW</span> When a world boss is up, click its box to go straight there.</li>
    </ul>
  </section>

  <section id="menu-hub-account">
    <h3><span class="icon">&#128273;</span>Change password + New Player Guide</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Settings &rsaquo; Account</b>: change your password in the Menu Hub. Type your current password, the new one and the new one again. It shows as stars and never goes in the chat. 5 to 15 characters, no spaces, capitals count.</li>
      <li><span class="tag changed">CHANGED</span> The Help tab's Welcome tile is now <b>New Player Guide</b> (the same window as the M button).</li>
      <li><span class="tag changed">CHANGED</span> The Money guide (<code>::guide</code>) has a Menu Hub line, and <code>::changepass</code> now takes you to Settings &rsaquo; Account.</li>
    </ul>
  </section>

  <section id="menu-hub-favourites">
    <h3><span class="icon">&#9733;</span>Favourites, Recent and glow badges</h3>
    <ul>
      <li><span class="tag new">NEW</span> Click the small <b>&#9733;</b> on any hub tile to make it a favourite (up to 6). Favourites show first on <b>Home</b>, then the last 4 tiles you opened.</li>
      <li><span class="tag new">NEW</span> A pulsing <b>gold dot</b> on a tile or tab means something is waiting: daily tasks left, no slayer or boss task, a donator box to claim, or a bug reward. Hover the tile to see what.</li>
    </ul>
  </section>

  <section id="menu-hub-settings">
    <h3><span class="icon">&#9881;</span>Settings pages</h3>
    <ul>
      <li><span class="tag new">NEW</span> Menu Hub &rsaquo; Settings now has pages along the top: <b>Widgets, Display, Chat, Loot, Hub</b> and <b>Donator</b>. Everything is a big ON/Off square, saved on your account.</li>
      <li><span class="tag new">NEW</span> Turn off <b>loot beams</b> or other players' <b>drop broadcasts</b>, and get a <b>Low HP warning</b> (a red flash round the screen) when your health drops under 25%.</li>
      <li><span class="tag new">NEW</span> Hub &amp; accessibility: stop the hub opening at login, turn off the glow, use <b>bigger tiles</b> or <b>high contrast</b>, and put every button back in its starting spot.</li>
      <li><span class="tag new">NEW</span> Donators: pick your <b>title, shadow, yell and chat colours</b> by clicking colour squares, with a live preview, plus custom title, display name and more (only what your rank unlocks).</li>
    </ul>
  </section>

  <section id="menu-hub-search">
    <h3><span class="icon">&#128269;</span>Hub search</h3>
    <ul>
      <li><span class="tag new">NEW</span> Click <b>Search everything...</b> at the top right of the Menu Hub and type. It finds panels ("money", "ge", "drops"), every teleport by name or nickname ("zulrah", "gwd", "jad": click one to go straight there), commands ("bank", "lock xp") and settings ("hide buttons").</li>
      <li><span class="tag new">NEW</span> Small typos are fine: "slyer" still finds Slayer. <b>Enter</b> opens the best match, <b>Esc</b> clears the box.</li>
      <li><span class="tag new">NEW</span> The last tile, <b>Find "..."</b>, looks your words up as an item and shows which monsters drop it and which shops sell it.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Glowing Teleport Manager</h2>
  <div class="date">November 23, 2026</div>

  <section id="teleport-glow">
    <h3><span class="icon">T</span>Teleport Manager</h3>
    <ul>
      <li><span class="tag changed">CHANGED</span> The Teleport Manager (<b>T</b> button or <code>::tpmanager</code>) has the new green glow look, and it's bigger with easier-to-read text. Same layout: tabs on the left, teleports in the middle, Favourites on the right.</li>
      <li><span class="tag new">NEW</span> <b>+ Fav</b> saves a teleport to your Favourites (up to 8) and <b>X</b> removes one. Your old favourites are still there.</li>
      <li><span class="tag changed">CHANGED</span> Raids and Dragons open their own lists, with <b>&lt; Back</b> to return. The window closes by itself when you teleport.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>New donator ranks: Eternal &amp; Oblivion</h2>
  <div class="date">November 23, 2026</div>

  <section id="ranks-eternal-oblivion">
    <h3><span class="icon">&#9813;</span>Donator ranks</h3>
    <ul>
      <li><span class="tag new">NEW</span> Two new top ranks: <b>Eternal ($2,500)</b> and <b>Oblivion ($5,000)</b>, with animated name glows (white-cyan and void purple). See everything on the new <a href="#/donate">Donate</a> page.</li>
      <li><span class="tag new">NEW</span> <b>Eternal</b>: prayer never drains, a daily Legendary chest and free Reaper's Elixir, 2x special restore, double Contract points, the full bond drop chance, coins straight to your pouch and <code>::picktask</code>.</li>
      <li><span class="tag new">NEW</span> <b>Oblivion</b>: all of Eternal, plus your own private island (<code>::myisland</code>), a weekly hour of Death Zone double drops (<code>::zoneevent</code>) and a login entrance.</li>
      <li><span class="tag changed">CHANGED</span> New rank amounts: Lost Soul $25, Wraith $50, Phantom $100, Shade $200, Revenant $350, Reaper $600, Death $1,000. Everyone's donated total is <b>multiplied by 5</b> at their next login, so nobody loses a rank.</li>
      <li><span class="tag changed">CHANGED</span> Perk shuffle: Revenant gets longer potions, slower prayer drain, double minigame points and better familiars; vote perks move to Shade+, ammo saver to Death, blood money to bank to Phantom+, the cheap Slayer skip to Shade+.</li>
      <li><span class="tag changed">CHANGED</span> Bonds are worth <b>150M coins per $1</b> and can only be sold to other players (trade or Trading Post player shops).</li>
      <li><span class="tag new">NEW</span> <b>Special Edition</b> <code>::donator</code> panels for Death, Eternal and Oblivion with one-click buttons, including a Death Zone teleport.</li>
      <li><span class="tag new">NEW</span> <b>Donation guide</b>: <code>::donateguide</code> in game shows every rank, every perk by type and every way to get bonds. <code>::rank</code> now shows your progress from your rank to the next.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Earn bonds in game</h2>
  <div class="date">November 23, 2026</div>

  <section id="bonds">
    <h3><span class="icon">&#36;</span>Bonds</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Bonds drop from bosses</b>: very rare $5, $10 and $20 bonds, and the super rare <b>Lucky bond chest</b> ($5 to $100). Lower ranks are luckier. Bonds can be traded and sold on the Trading Post.</li>
      <li><span class="tag new">NEW</span> <b>Milestone bonds</b>: first 99, total level 2,000, every 99, the Completionist Cape, every 250 Slayer tasks and every 150 Elite Slayer tasks (not on Easy mode).</li>
      <li><span class="tag new">NEW</span> Rare bonds from <b>normal-mode raids</b> and <b>events</b> (event boss top damage, the Death giveaway wheel, trivia).</li>
      <li><span class="tag new">NEW</span> <b>Weekly bond hunt</b>: every Saturday from 6pm a chest with a $5 bond is hidden in a town. Solve the riddle and open it first.</li>
      <li><span class="tag new">NEW</span> <b>Redeem choices</b>: rank + Credits, rank only, or Credits only (2x). Every claim gives +10% drop rate for an hour. <code>::rank</code> shows your progress to the next rank.</li>
      <li><span class="tag new">NEW</span> <b>Bond Exchange</b> in the Death Plaza: combine bonds into bigger ones or split one into two.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Reaper's Elixir &amp; Death Zone improvements</h2>
  <div class="date">November 23, 2026</div>

  <section id="reapers-elixir">
    <h3><span class="icon">&#9883;</span>Reaper's Elixir</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Reaper's Elixir</b>: a swirling red and purple super overload from the Death Shop (Death's Merchant, 500M). For 20 minutes Attack, Strength, Defence, Magic and Ranged go up by 15 + 48%, with no life point cost. It also protects you from dragonfire and poison, restores Prayer, heals 2% of your life points every 6 seconds and stays on when you die. Not usable in the Wilderness.</li>
      <li><span class="tag changed">CHANGED</span> The Death Zone <b>potion fountain</b> overload now lasts 20 minutes (still every 30 minutes).</li>
      <li><span class="tag changed">CHANGED</span> Donator <b>anti-fire</b> and <b>super anti-fire</b> perks never run out and show an infinity timer.</li>
      <li><span class="tag fixed">FIXED</span> Fishing spots no longer stop you short with "You can't reach that".</li>
      <li><span class="tag fixed">FIXED</span> Korasi's sword, coloured whips and coloured dark bows examined far too cheap. Rare Legendary chest gear (spirit shields, Primal, Nex bodies, Zaryte bow) is now worth more than the common cash tickets.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Death's Contracts, fishing contracts &amp; the Death satchel</h2>
  <div class="date">November 22, 2026</div>

  <section id="death-contracts">
    <h3><span class="icon">&#9760;</span>Death's Contracts</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Contract points</b>: 3 per contract, 5 for the boss. Do all 3 on a board for a <b>clean sweep</b>: 100M, an Elite mystery box, +5 points and a <b>Superior contract</b> (the board's boss with 2x HP, just for you, for 350M and a rare drop roll).</li>
      <li><span class="tag new">NEW</span> <b>Sweep streaks</b>: keep sweeping within 24 hours for a toolkit roll every 3rd sweep, a <b>Reaper's hand</b> pet roll every 7th and the <b>the Contractor</b> title at 10.</li>
      <li><span class="tag new">NEW</span> <b>Contract Store</b>: 2x drop scroll, pen-time token, the Death satchel, Satchel upgrades and the Reaper's hand pet, all for Contract points.</li>
      <li><span class="tag new">NEW</span> New boards are announced to everyone, with 3, 2 and 1 hour warnings, and you see the current contracts when you log in. A weekly <b>Most clean sweeps</b> board pays out on Sundays.</li>
    </ul>
  </section>

  <section id="fishing-contracts">
    <h3><span class="icon">&#127907;</span>Fishing contracts</h3>
    <ul>
      <li><span class="tag new">NEW</span> Talk to <b>Death's Angler</b> on the Death Zone fishing dock: 3 fishing contracts a day (easy, medium, hard). Fish you catch in the Death Zone count by themselves. Each pays coins + Contract points, and all 3 add 25M, 5 points and a 1 in 25 shot at the <b>Heron pet</b>.</li>
      <li><span class="tag new">NEW</span> <b>Death's Angler Store</b>: fishing outfit, <b>Dragon harpoon</b> (works as a harpoon, 20% faster), Heron pet, the Death satchel and Satchel upgrades.</li>
      <li><span class="tag new">NEW</span> Fishing spots in the Death Zone show what they catch when you hover them, and the shark spots are Harpoon only.</li>
    </ul>
  </section>

  <section id="death-satchel">
    <h3><span class="icon">&#128188;</span>Death satchel</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Death satchel</b> (Death rank, 300 Contract points): 28 extra slots in a bank-style window. Loot you pick up, and fish, ore and logs you gather, go into it when your inventory is full. Kept on death, empties into your bank, not usable in the Wilderness.</li>
      <li><span class="tag new">NEW</span> <b>Satchel upgrades</b> (150 points each, up to 2): +14 slots each, 56 in all. Use any item on the satchel to put it in.</li>
      <li><span class="tag new">NEW</span> Death Zone ranges have a <b>Cook</b> option: you cook one fish at a time, your inventory first, then on into the satchel.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>The Death Zone</h2>
  <div class="date">November 21, 2026</div>

  <section id="death-zone">
    <h3><span class="icon">&#9760;</span>Death Zone (Death rank)</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>A zone of its own for the Death rank</b> (and staff), just east of home, all black and gold. Teleport Manager &gt; Minigames &gt; <b>Death Zone</b>, or the portal at home.</li>
      <li><span class="tag new">NEW</span> <b>Skilling heaven</b>: every ore and tree, a forge with the Metal Bank, a fishing dock and a workshop. 1.25x XP, a <b>skill of the day</b> at 1.5x, trees that never fall, spots that never move, no bait, no burnt food, unlimited run and no prayer drain.</li>
      <li><span class="tag new">NEW</span> <b>Golden spots</b>: a rock, tree and fishing spot with double XP and bonus resources, moving every 15 minutes.</li>
      <li><span class="tag new">NEW</span> <b>Dark crab</b> and <b>deep sea fishing</b> (dark crab, manta ray, sea turtle).</li>
      <li><span class="tag new">NEW</span> <b>Reaper's toolkit</b>: every skilling tool in one, with Auto-bank, Auto-smelt, Auto-cook and Bank everything.</li>
      <li><span class="tag new">NEW</span> <b>Monster pens</b> with safe deaths, drops to your bank, their own slayer master, and rare <b>Superior</b> monsters with triple loot.</li>
      <li><span class="tag new">NEW</span> <b>The plaza</b>: rejuvenation pool, potion fountain, Death Shop, daily Death chest, teleport hub, fast garden, pet garden, Hall of Death, trophy room and a weekly giveaway wheel.</li>
      <li><span class="tag new">NEW</span> <b>Weekly boards</b>: top killers and top skillers win coins every Sunday.</li>
      <li><span class="tag new">NEW</span> <b>Death outfit</b> and a gold <b>Aura of Death</b>, plus fireworks for everyone who reaches the Death rank. Death players can bring a friend with a 30 minute <b>guest pass</b>.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Infernal cape &amp; cape fixes</h2>
  <div class="date">November 20, 2026</div>

  <section id="capes">
    <h3><span class="icon">C</span>Capes</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Infernal cape</b>: beat the Fight Kiln, right-click your <b>TokHaar-Kal &gt; Exchange</b> and sacrifice it for an Infernal cape.</li>
      <li><span class="tag fixed">FIXED</span> The <b>Fire cape</b> and <b>TokHaar-Kal</b> now sit properly on your back with the whole cape showing, and the TokHaar-Kal no longer waves side to side.</li>
      <li><span class="tag fixed">FIXED</span> The bottom of the <b>prayer tab</b> no longer has stray lines.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Slayer duo, examine prices &amp; fixes</h2>
  <div class="date">November 15, 2026</div>

  <section id="slayer-duo">
    <h3><span class="icon">S</span>Slayer duo</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Do Slayer with a friend</b>: right-click them and pick <b>Slayer duo</b>. Your tasks never change. A kill counts for whoever's task it is, so helping a friend makes their task go about twice as fast. The helper gets Slayer XP and half the slayer points. Both have no task? The first to get one gives the other the same task. Stay within 16 squares of each other. Right-click your partner to teleport to their task.</li>
    </ul>
  </section>

  <section id="bug-reports">
    <h3><span class="icon">!</span>Report a bug in game</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Report a bug</b> with the new round <b>!</b> button (or in the Welcome window): pick what kind of bug, say what happened and where, and which item or monster. Your spot, gear and recent clicks are added for you. <b>My reports</b> shows how each one is going, and when a bug you reported is fixed you get <b>1M coins</b> in your bank.</li>
    </ul>
  </section>

  <section id="nov15-more">
    <h3><span class="icon">+</span>More</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Examine shows the price</b> of items in your bag, bank, worn gear and trades (and the total for a stack).</li>
      <li><span class="tag changed">CHANGED</span> <b>Rare prices</b>: party hats, h'ween masks and Santa hats were worth only a few coins. Now Red/White/Blue partyhats are 1b, Yellow/Green/Purple and custom colours 1.5b, dyed partyhats 2.5b, Black partyhat 5b, masks 500m, Santa hat 100m. Rares can't be Quick Sold.</li>
      <li><span class="tag changed">CHANGED</span> <b>Money pouch shows 1.5B</b>, 2.3B and so on, instead of rounding down to 1B, 2B.</li>
      <li><span class="tag new">NEW</span> <b>Sort your bank</b> with the bank's <b>?</b> button: tabs by type, most valuable first.</li>
      <li><span class="tag new">NEW</span> <b>Vet'ion teleport</b> in Teleport Manager &gt; Bosses (Wilderness, with a warning).</li>
      <li><span class="tag fixed">FIXED</span> <b>Dreadfowl</b> pouch now summons, and the obelisk can make <b>Spirit mosquito</b> pouches.</li>
      <li><span class="tag fixed">FIXED</span> Pets now count toward your raid damage, and burying bones at the altar no longer walks you away.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Ring of the gods &amp; Great Olm fix</h2>
  <div class="date">November 14, 2026</div>

  <section id="ring-of-gods">
    <h3><span class="icon">R</span>Ring of the gods</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Loot straight to your bank</b>: while you wear the Ring of the gods (or the imbued one), every monster drop goes to your bank. If your bank is full, it drops on the floor as usual.</li>
      <li><span class="tag changed">CHANGED</span> <b>Now worth 10b</b> (was 60m), the imbued ring too. Sell it on the Trading Post. Dropped by Vet'ion Reborn and Cursed Vet'ion (about 1/228).</li>
      <li><span class="tag fixed">FIXED</span> <b>Great Olm melee</b>: you can now hit the Olm's claws and head with melee in the Chambers of Xeric.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Update 4 &mdash; Thanksgiving &amp; fixes</h2>
  <div class="date">November 9 &ndash; 13, 2026</div>

  <section id="thanksgiving">
    <h3><span class="icon">&#127810;</span>Thanksgiving</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Thanksgiving AFK Tree</b>: the AFK tree at home has its autumn look, the same moving tree in warm orange, red and gold. Chop it forever for candy and rare boxes, same as before. (Get the new client: just open the launcher.)</li>
      <li><span class="tag fixed">FIXED</span> <b>The AFK tree stops cutting</b>: closing a window (a level-up message, Esc) no longer stops you chopping.</li>
    </ul>
  </section>

  <section id="raids4">
    <h3><span class="icon">R</span>Raids</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Raid difficulty: Normal or Easy</b> for the Theatre of Blood and Chambers of Xeric. When the leader presses <b>Start</b> on the Raid Board (or you use a raid teleport) you pick <b>Normal</b>, the same hard fight with the full rewards, or <b>Easy</b>: half boss HP, 60% max hits, weaker and rarer specials, and a smaller chest (1 x 100m ticket, uniques 1 in 20, half-size loot, no Torva/Primal roll, no records). See it with <code>::drops tob easy</code> / <code>::drops cox easy</code>.</li>
    </ul>
  </section>

  <section id="prices4">
    <h3><span class="icon">&#128176;</span>Prices &amp; trading</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>New prices for raid and boss rares</b>, based on how rare they are: Twisted bow 3b, Scythe of vitur 2b, Kodai wand 1.5b, Ancestral top 1.2b, Ghrazi rapier and Sanguinesti staff 900m, Hydra's claw 250m, third-age platebody 250m, Imbued heart 150m, and more. Easy mode raid items are worth the same as Normal. Quick Sell still pays 40%; selling to players earns up to 2.5x more.</li>
      <li><span class="tag fixed">FIXED</span> <b>One price everywhere</b>: the Grand Exchange, Trading Post, price checker, trade window and items kept on death all show the same price now.</li>
      <li><span class="tag fixed">FIXED</span> <b>More rares can be traded</b>: the Ghrazi rapier, Scythe of vitur, Hydra pieces, Kraken tentacle, tridents, Unsired, occult necklaces, Dark claw and wilderness rings can now be sold to other players.</li>
    </ul>
  </section>

  <section id="skilling4">
    <h3><span class="icon">&#9874;</span>Skilling</h3>
    <ul>
      <li><span class="tag fixed">FIXED</span> <b>Anvils always opened bronze</b>: with more than one kind of bar, the anvil asks <b>"Which metal do you want to smith?"</b>, best metal first.</li>
      <li><span class="tag fixed">FIXED</span> <b>Smelting from the Metal Bank stopped after 28 bars</b>: at the home furnace, picking 28 now smelts <b>all</b> of that ore. <b>Make All</b> at the home anvil keeps going until you run out of bars or your bag is full.</li>
      <li><span class="tag fixed">FIXED</span> <b>Farming with the tool belt</b>: the rake, seed dibber and spade on your tool belt work on farm patches. <b>Tool leprechauns</b>: Exchange opens the farming shops and Teleport works. New <b>Fruit/Wood Trees</b> seed shop.</li>
      <li><span class="tag fixed">FIXED</span> <b>Summoning</b>: the spirit wolf pouch summons a wolf again (not a plant), as do the dreadfowl, spirit spider and granite crab. The <b>bull ant</b> and <b>void shifter</b> pouches work. The big obelisk's <b>Renew-points</b> refills your Summoning points.</li>
      <li><span class="tag fixed">FIXED</span> <b>Mining with the basic tool belt</b>: new players can mine with the tool belt's bronze pickaxe.</li>
    </ul>
  </section>

  <section id="rewards4">
    <h3><span class="icon">$</span>Rewards &amp; items</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Warriors' Guild</b> in the Teleport Manager (Minigames). Earn guild points on the dummies, shot put, catapult, kegs and animated armour, then talk to Kamfreena on the top floor and fight cyclopes for <b>defenders</b>, bronze up to dragon, like RuneScape. The cyclops room now always uses the points shown on screen.</li>
      <li><span class="tag fixed">FIXED</span> <b>Fight Caves</b>: the top donator rank always gets <b>double Tokkul</b> for beating TzTok-Jad.</li>
      <li><span class="tag new">NEW</span> <b>Torva set</b> in the purple Torva platebody look.</li>
      <li><span class="tag fixed">FIXED</span> <b>TokHaar-Kal</b> can be worn.</li>
      <li><span class="tag changed">CHANGED</span> <b>Well of Shadows</b>: the well is dark red, and prices show with commas.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Update 3 &mdash; The Shadow Home</h2>
  <div class="date">November 8, 2026</div>

  <section id="newhome">
    <h3><span class="icon">&#9760;</span>A brand new home</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>The Shadow Home island</b>: home has moved to a dark stone and purple island. New players start here, you respawn here after dying, and <code>::home</code> brings you back to the <b>Shadow plaza</b> in the middle.</li>
      <li><span class="tag new">NEW</span> <b>Shadow plaza</b>: the Well of Shadows, the Shops board, the Raid board, Death (Reaper tasks) and a prayer altar, with dark stone paths out to every wing.</li>
      <li><span class="tag new">NEW</span> <b>Bank</b> (north): bank booths, deposit boxes and Grand Exchange clerks. Doorways lead through to the services hall and the reward chests hall.</li>
      <li><span class="tag new">NEW</span> <b>Shops hall</b> (west): every shopkeeper, Smiddi's legendary gear and the Trading Post booth.</li>
      <li><span class="tag new">NEW</span> <b>Slayer hall</b> (east): all the slayer masters, Mandrith and Max.</li>
      <li><span class="tag new">NEW</span> <b>Portal hall</b> (south): the Shadow Portal (teleports), the money-making portal and the house portal.</li>
      <li><span class="tag new">NEW</span> <b>Services hall</b> (north-west): make-over mage, estate agent, Xuan and the pet shop.</li>
      <li><span class="tag new">NEW</span> <b>Reward chests hall</b> (north-east): the Reaper, Toxic, Crystal and Brimstone chests.</li>
      <li><span class="tag new">NEW</span> <b>Event garden</b> (south-west): a Halloween garden around the AFK Tree, with Pumpkin Pete wandering the plaza.</li>
      <li><span class="tag new">NEW</span> <b>Skilling hall</b> (south-east): rocks from tin to runite, the furnace, anvils and Metal Bank, a range, workbenches, thieving stalls, the tool leprechaun, the sawmill and net fishing spots.</li>
    </ul>
    <h4><span class="tag new">NEW</span>Finding your way</h4>
    <ul>
      <li><span class="tag new">NEW</span> <b>Home map</b>: press the world map at home for a map of the island with every wing named, a flashing dot for you and yellow dots for other players. Drag the title to move it and the corner to resize it.</li>
      <li><span class="tag new">NEW</span> <b>Wing names</b>: the top of your screen says which wing you're in, and the minimap shows the wing names too.</li>
    </ul>
  </section>

  <section id="fixes3">
    <h3><span class="icon">&#9874;</span>Shops &amp; fixes</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Summoning Shop at home</b>: a Summoning shopkeeper in the Skilling hall sells gold, green, crimson and blue charms, spirit shards and pouches, and opens the Summoning ingredient shops. It's also under Skilling in <code>::shops</code>.</li>
      <li><span class="tag new">NEW</span> <b>Noose wand</b> in the Hunting Shop (Emir, in the Shops hall).</li>
      <li><span class="tag new">NEW</span> <b>Click the Home map to walk</b> there, like the minimap.</li>
      <li><span class="tag changed">CHANGED</span> <b>Farming grows slower</b>: 5 minutes a stage for flowers, herbs, allotments and hops, 8 for bushes, 10 for trees. You also get 5 minutes to cure a diseased plant.</li>
      <li><span class="tag fixed">FIXED</span> Dead farming patches can be cleared again (needs a spade, tool belt counts).</li>
      <li><span class="tag fixed">FIXED</span> Leather and dragonhides have a <b>Craft</b> option, so the needle on your tool belt works.</li>
      <li><span class="tag fixed">FIXED</span> Gates and doors close when you click them again, like the Lumbridge cow field gate.</li>
      <li><span class="tag fixed">FIXED</span> Lumbridge castle stairs no longer leave you stuck upstairs.</li>
      <li><span class="tag fixed">FIXED</span> Capes no longer sink into the Bandos chestplate.</li>
    </ul>
  </section>
</div>

<div class="update">
  <h2>Update 2 &mdash; Quality of life &amp; Halloween</h2>
  <div class="date">October 24 &ndash; November 7, 2026</div>

  <section id="screen">
    <h3><span class="icon">&#9670;</span>Screen &amp; controls</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Stretched mode</b>: a button on the Options tab stretches the whole game to fill your window, so everything is big instead of tiny.</li>
      <li><span class="tag changed">CHANGED</span> <b>Zoom with the mouse wheel</b>: no need to hold Alt any more. Lists and panels still scroll as normal.</li>
      <li><span class="tag new">NEW</span> <b>Lobby screen</b>: see your character, ranks, levels and time played before entering the world.</li>
      <li><span class="tag new">NEW</span> <b>Saved accounts</b>: up to 3 account cards on the login screen. Click one to log in instantly.</li>
      <li><span class="tag changed">CHANGED</span> <b>New Welcome window</b> at login: what's running (double XP, double drops, events) and your tasks, all clickable.</li>
      <li><span class="tag new">NEW</span> <b>Event countdown</b>: a small box at the top of the screen counts down double XP and double drops.</li>
      <li><span class="tag new">NEW</span> <b>Pin a task</b>: pin your Reaper task, contract or daily task to the corner of your screen to watch its progress.</li>
      <li><span class="tag changed">CHANGED</span> <b>New red &amp; black interface</b> and reaper-themed donator ranks: Lost Soul, Wraith, Phantom, Shade, Revenant, Reaper and Death.</li>
    </ul>
  </section>

  <section id="panels">
    <h3><span class="icon">W</span>Handy windows</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Shops panel</b> (<code>::shops</code>): every home shop in one window, in five tabs.</li>
      <li><span class="tag new">NEW</span> <b>Quests panel</b> (<code>::quests</code>): every quest coloured by how far you've got.</li>
      <li><span class="tag new">NEW</span> <b>Item lookup</b> (<code>::whereget</code>): which monsters drop an item and which shops sell it, with chances and prices.</li>
      <li><span class="tag new">NEW</span> <b>Drop tables</b> (<code>::drops</code>): every boss and raid drop with its picture and chance, shown as "1/300".</li>
      <li><span class="tag new">NEW</span> <b>Loot tables on the key chests</b>: right-click any key chest and pick Loot table.</li>
      <li><span class="tag new">NEW</span> <b>Reaper Task window</b> (<code>::reapertask</code>): your boss task, progress, keys and a teleport button.</li>
      <li><span class="tag new">NEW</span> <b>Donator Panel</b> (<code>::donator</code>): your rank, boosts and perks, plus a daily Elite box for Death-rank donators.</li>
      <li><span class="tag new">NEW</span> <b>Bank value</b>: the bank title shows what your bank and total wealth are worth.</li>
      <li><span class="tag new">NEW</span> <b>Death Recap</b>: after dying, see where you died, what killed you and what you left behind.</li>
    </ul>
  </section>

  <section id="skilling">
    <h3><span class="icon">&#9874;</span>Skilling</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>Ore box and Wood box</b>: 1M each from the home Mining and Woodcutting shops. Each holds 200 ore or logs.</li>
      <li><span class="tag new">NEW</span> <b>Metal Bank</b>: a chest that stores ores and bars separately from your bank. The home furnace and anvils use it directly.</li>
      <li><span class="tag changed">CHANGED</span> <b>Rocks never run out</b>: click once and mine until your bag is full.</li>
      <li><span class="tag changed">CHANGED</span> <b>Faster mithril, adamant and rune mining</b>: twice as fast as before.</li>
      <li><span class="tag new">NEW</span> <b>Upgradeable tool belt</b>: add your best hatchet and pickaxe to the tool belt so they need no bag space.</li>
      <li><span class="tag new">NEW</span> <b>Skilling Contracts</b> (<code>::contracts</code>): pick a contract matched to your levels for coins and rewards.</li>
      <li><span class="tag new">NEW</span> <b>Halloween AFK Tree</b>: chop forever for candy and a chance at mystery boxes.</li>
    </ul>
  </section>

  <section id="rewards">
    <h3><span class="icon">$</span>Bosses, raids &amp; rewards</h3>
    <ul>
      <li><span class="tag changed">CHANGED</span> <b>Easier boss uniques</b>: rare boss drops are 3 times more likely.</li>
      <li><span class="tag changed">CHANGED</span> <b>Easier raid uniques</b>: Theatre of Blood and Chambers of Xeric chests give a unique 1 in 5.</li>
      <li><span class="tag new">NEW</span> <b>Skip to TzTok-Jad</b>: Phantom donators and up can go straight to Jad in the Fight Caves.</li>
      <li><span class="tag new">NEW</span> <b>Smiddi's Dragon &amp; Barrows shop</b>: dragon armour and all four Barrows sets.</li>
      <li><span class="tag new">NEW</span> <b>Blackjack</b> (<code>::blackjack name amount</code>): play another player for coins.</li>
      <li><span class="tag new">NEW</span> <b>Happy Halloween! box</b>: every Halloween cosmetic in one box.</li>
    </ul>
  </section>

  <section id="community">
    <h3><span class="icon">&#9733;</span>Website &amp; community</h3>
    <ul>
      <li><span class="tag new">NEW</span> <b>This website</b>: forums, community posts, profiles and live chat with friends.</li>
      <li><span class="tag new">NEW</span> <b>Game and forums linked</b>: type <code>::forums</code> in game for a code, and your profile shows your levels and ranks.</li>
      <li><span class="tag new">NEW</span> <b>Player Guide</b>: a full guide from your first login to raids. See the Guide tab.</li>
    </ul>
  </section>

  <section id="fixes">
    <h3><span class="icon">&#10003;</span>Fixes</h3>
    <ul>
      <li><span class="tag fixed">FIXED</span> <b>Dungeoneering is easy to start</b>: the entrance makes a party for you and gives you a Ring of kinship.</li>
      <li><span class="tag fixed">FIXED</span> <b>Tool belt tools work everywhere</b>: the belt's pickaxe, knife, chisel and tinderbox now work on rocks, logs and gems.</li>
    </ul>
  </section>
</div>

`;
