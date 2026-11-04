// The player guide (#/guide), copied from "Shadow of Death - Player Guide.html" in the server folder.
// Contents links (#start, #slayer...) scroll within the page; app.js handles them so they don't change the route.
window.GUIDE_TOC = `  <a href="#start">1. Getting in</a>
  <a href="#modes">2. Game modes</a>
  <a href="#first">3. Your first hour</a>
  <a href="#buttons">4. Buttons &amp; tabs</a>
  <a href="#panels">5. Every panel</a>
  <a href="#home">6. Around home</a>
  <a href="#skills">7. Levelling skills</a>
  <a href="#slayer">8. Slayer</a>
  <a href="#reaper">9. Reaper tasks</a>
  <a href="#contracts">10. Skilling contracts</a>
  <a href="#daily">11. Daily tasks</a>
  <a href="#money">12. Making money</a>
  <a href="#bossing">13. Bossing</a>
  <a href="#raids">14. Raids</a>
  <a href="#boxes">15. Boxes, keys &amp; tickets</a>
  <a href="#trading">16. Trading Post &amp; shops</a>
  <a href="#donator">17. Donator ranks</a>
  <a href="#extras">18. Fun extras</a>
  <a href="#commands">19. Commands</a>
  <a href="#tips">20. Tips &amp; known issues</a>
`;
window.GUIDE_HTML = `
<!-- 1 -->
<section class="ch" id="start">
  <h2><span class="num">1</span>Getting in</h2>
  <div class="card">
    <h3>Download &amp; install</h3>
    <ol class="steps">
      <li>Download the installer: <a href="https://github.com/tjsmith95/Shadow-of-Death/releases/latest">github.com/tjsmith95/Shadow-of-Death/releases/latest</a>. Grab the <b>Shadow of Death Final Installer + Java</b> .exe. Java comes built in, so you don't need to install anything else.</li>
      <li>Run it. You get a desktop shortcut and a Start menu entry, with no admin prompt.</li>
      <li>Open <b>Shadow of Death</b>. The launcher checks for updates every time and downloads them for you, so you never have to reinstall. It also shows whether the server is online and how many people are playing.</li>
      <li>Press <b>PLAY</b>.</li>
    </ol>
    <div class="tip"><b>Black screen when you maximise?</b> Open the launcher's <b>Settings</b> and turn on <b>safe graphics</b>.</div>
  </div>
  <div class="card">
    <h3>Making your account</h3>
    <p>There's no sign-up page. Type a name and a password on the login screen and that account is created the first time you log in. <b>Remember the password</b>, because it's the only thing that protects your account.</p>
    <div class="warn"><b>Name rules.</b> Breaking these gives "Invalid loginserver requested" or "Invalid username":
      <ul>
        <li><b>12 characters or fewer</b>, spaces included</li>
        <li>Letters, numbers and spaces only. It can't start or end with a space or underscore.</li>
        <li>It can't contain <b>mod</b>, <b>admin</b> or <b>owner</b> (so nobody can fake a staff name)</li>
      </ul>
    </div>
    <p><b>Saved accounts:</b> after your first successful login, a card with your name shows under the login box. Next time just click the card to log in. The small X forgets it. Up to 3 accounts can be saved.</p>
  </div>
  <div class="card">
    <h3>The Lobby &amp; Welcome window</h3>
    <p>After logging in you see the <b>Lobby</b>. It shows your character, players online, any double XP or drops running, the latest news and the latest big drop. Click <b>Click here to play</b> (or press <kbd>Enter</kbd>).</p>
    <p>In game, the <b>Welcome window</b> pops up. It lists everything worth doing right now (double XP, events, daily tasks, slayer, Reaper task, contracts), and each row opens its window. Reopen it any time with the round <span class="btn-ico">M</span> button or <code>::welcome</code>.</p>
  </div>
</section>

<!-- 2 -->
<section class="ch" id="modes">
  <h2><span class="num">2</span>Game modes</h2>
  <div class="card">
    <p>New accounts pick a mode before they can move. <b>You can't change it afterwards</b>, so choose carefully.</p>
    <div class="tbl"><table>
      <tr><th>Mode</th><th>Combat XP</th><th>Skilling XP</th><th>Bonus</th><th>Good for</th></tr>
      <tr><td><b>Easy</b></td><td class="v">125x</td><td class="v">50x</td><td>&mdash;</td><td>Getting maxed fast and going straight to bossing</td></tr>
      <tr><td><b>Normal</b></td><td class="v">10x</td><td class="v">10x</td><td>+5% drop rate</td><td>A proper grind that still moves</td></tr>
      <tr><td><b>Hard</b></td><td class="v">5x</td><td class="v">5x</td><td>+10% drop rate, 5% chance of double drops</td><td>Veterans who want the best loot luck</td></tr>
      <tr><td><b>Ironman</b></td><td class="v">25x</td><td class="v">15x</td><td>+5% drop rate</td><td>Doing everything yourself (no trading, limited shops)</td></tr>
      <tr><td><b>Hardcore Ironman</b></td><td class="v">25x</td><td class="v">15x</td><td>+10% drop rate</td><td>Ironman, with higher stakes</td></tr>
      <tr><td><b>Ultimate Ironman</b></td><td class="v">25x</td><td class="v">15x</td><td>&mdash;</td><td>The hardest way to play</td></tr>
    </table></div>
    <p>Every mode starts with a starter kit: gear, weapons, runes, arrows and coins (1M, or 100K for Ironmen).</p>
    <div class="tip"><b>Ironmen:</b> you can't trade, use the Trading Post, gamble or play Blackjack, and you only see the shops Ironmen are allowed to use, plus the two Ironman shops.</div>
  </div>
</section>

<!-- 3 -->
<section class="ch" id="first">
  <h2><span class="num">3</span>Your first hour</h2>
  <div class="card">
    <h3>A good order to do things in</h3>
    <ol class="steps">
      <li><b>Read the Welcome window</b> to see whether double XP or a world event boss is up right now.</li>
      <li><b>Open the Money guide</b> (<code>::guide</code>). It shows every way to earn on the server, and you can click any line to teleport there.</li>
      <li><b>Check your Daily tasks</b> (the <span class="btn-ico">D</span> button). You get three tasks a day worth <b>8M&ndash;30M each</b>, plus an Elite box for finishing all three.</li>
      <li><b>Get a Slayer task</b> from a slayer master at home. Tasks give XP, coins per kill, a big payout at the end and box chances. Use <b>Teleport to task</b> in the Slayer Task window.</li>
      <li><b>Pick a Skilling contract</b> (<code>::contracts</code>) for whatever skill you're training. It pays about 40% more than selling.</li>
      <li><b>Sell spare loot</b> at the Trading Post (Quick Sell) for fast cash, and buy upgrades from the shops (<code>::shops</code>).</li>
      <li>Once your combat is decent, start <b>bossing</b>: God Wars, Vorkath, Zulrah and the rest, all in the Teleport Manager. Then get a <b>Reaper task</b> from Death.</li>
      <li>Team up for <b>raids</b> at the Raid Board for the best loot in the game.</li>
    </ol>
    <div class="good"><b>The goal:</b> the economy is tuned so a dedicated player can afford a full <b>Torva or Primal</b> set in about a week of play.</div>
  </div>
</section>

<!-- 4 -->
<section class="ch" id="buttons">
  <h2><span class="num">4</span>Buttons &amp; tabs</h2>
  <div class="grid">
    <div class="card"><h3><span class="btn-ico">T</span> Teleport Manager</h3><p>Teleports to bosses, monsters, dragons, slayer dungeons, skilling spots, minigames, raids and the world event boss. Also <code>::tpmanager</code>.</p></div>
    <div class="card"><h3><span class="btn-ico">D</span> Daily Tasks</h3><p>Your three tasks for today, with progress bars and rewards. Shortcut buttons go to Slayer, Reaper task, Contracts and the Money guide.</p></div>
    <div class="card"><h3><span class="btn-ico">M</span> Menu / Welcome</h3><p>Reopens the Welcome window with everything going on right now.</p></div>
  </div>
  <div class="tip"><b>Move things around:</b> hold <kbd>Shift</kbd> and drag the T / D / M buttons, the event countdown, the saved account cards, the Blackjack table and most Shadow of Death windows. They remember where you put them.</div>
  <div class="card">
    <h3>Side tabs</h3>
    <ul>
      <li><b>Player Info</b> (replaces the old Task tab): framed boxes for combat level, total level, total XP, daily tasks, achievements, slayer task and streak, boss kills, money pouch, time played and quests, plus an <b>Item lookup</b> box. <b>Click a box</b> to open its window.</li>
      <li><b>Information</b> (blue "i" tab, where Notes used to be): all your stats in one list, including Reaper task, drop rate boost and more.</li>
      <li><b>Quests</b> (blue icon): opens the Quests panel.</li>
      <li><b>Equipment</b>: the <b>tool belt</b> button opens your Tool Belt (see <a href="#panels">panels</a>).</li>
      <li><b>Options</b> (spanner): <b>Stretched mode</b> ON/OFF makes the whole interface about 1.5x bigger in a large window.</li>
      <li><b>Money pouch</b>: right-click for <b>Buy 100m ticket / Buy 1b ticket</b>, which turn coins into a tradeable ticket.</li>
    </ul>
    <p><b>Zoom:</b> scroll the mouse wheel over the game. No Alt needed.</p>
  </div>
</section>

<!-- 5 -->
<section class="ch" id="panels">
  <h2><span class="num">5</span>Every panel, explained</h2>
  <div class="grid">
    <div class="card"><h3>Money Making Guide <span class="how">::guide</span></h3>
      <p>Tabs: <b>Bossing, Raids, Slayer, Skilling, Daily &amp; Events</b>. Each line shows what it pays, a short how-to and the best drops. Click a line to <b>teleport there</b> or <b>see its drop table</b>.</p></div>
    <div class="card"><h3>Daily Tasks <span class="how">D button / ::daily</span></h3>
      <p>Three random tasks every day: kill bosses, a certain boss, monsters, slayer kills, slayer tasks or raids. Resets at midnight. See <a href="#daily">Daily tasks</a>.</p></div>
    <div class="card"><h3>Slayer Task <span class="how">::slayertask</span></h3>
      <p>Your task, who gave it, kills left and a progress bar. Shows the exact coins and points it will pay, plus box chances. <b>Teleport to task</b> button, and your streak and points at the bottom.</p></div>
    <div class="card"><h3>Reaper Task <span class="how">::reapertask</span></h3>
      <p>Your boss task from Death: progress, kills left, the Reaper points it pays, a <b>Teleport to task</b> button, your Reaper keys, chests opened and everything the Reaper chest has given you.</p></div>
    <div class="card"><h3>Skilling Contracts <span class="how">::contracts</span></h3>
      <p>Pick one of three delivery jobs ("Deliver 150 Magic logs"). You get paid per item as you hand them in, plus a bonus at the end. See <a href="#contracts">Contracts</a>.</p></div>
    <div class="card"><h3>Shops panel <span class="how">::shops / Shop Board</span></h3>
      <p>Every home shop in one window, in five tabs: <b>Combat, Supplies, Skilling, Points, Donator/Special</b>. Click a shop to open it.</p></div>
    <div class="card"><h3>Raid Board <span class="how">board at home</span></h3>
      <p>Make or join a raid party (up to 5), pick Theatre of Blood or Chambers of Xeric, ready up and go in together. It also shows kill-time <b>Records</b>. See <a href="#raids">Raids</a>.</p></div>
    <div class="card"><h3>Trading Post <span class="how">booth at home</span></h3>
      <p>Player-owned shops: browse everyone's shops, search by item or player, run your own shop, see market history, and <b>Quick Sell</b> anything instantly.</p></div>
    <div class="card"><h3>Quests <span class="how">::quests / Quests tab</span></h3>
      <p>Tabs: All, To do, Started, Done, Other. Colours: <span style="color:#ff6b6b">red</span> = not started, <span style="color:#ffd84d">yellow</span> = started, <span style="color:var(--green)">green</span> = done. Click one for <b>View quest</b> (where it starts, what you need, the reward) or <b>Teleport to start</b>.</p></div>
    <div class="card"><h3>Drop tables <span class="how">::drops name</span></h3>
      <p>E.g. <code>::drops general graardor</code>, <code>::drops tob</code>, <code>::drops cox</code>. Shows every drop with its chance ("1/300"), sorted Common to Super Rare. Hover for the exact %.</p></div>
    <div class="card"><h3>Tool Belt <span class="how">::toolbelt</span></h3>
      <p>Right-click any hatchet or pickaxe and choose <b>Add to tool belt</b>. Woodcutting and Mining then use it automatically, with no inventory slot needed. Adding a better one gives the old one back. Every belt tool works like one in your bag: right-click logs for <b>Craft</b> (fletch with the belt knife) or <b>Light</b> (belt tinderbox), and uncut gems for <b>Craft</b> (belt chisel).</p></div>
    <div class="card"><h3>Item lookup <span class="how">Player Info tab / ::whereget name</span></h3>
      <p>Click <b>Item lookup</b> on the Player Info tab (or type <code>::whereget</code>) and type in its <b>search box</b>: matching items show with their pictures as you type. Click one (or press Enter for the first) to see <b>where to get it</b>: every monster that drops it (chance per kill and level) and every shop that sells it (price, and where it is in <code>::shops</code>). Click a monster for its drop table or a home shop to open it. If nothing in the game gives it, it says <b>Not obtainable right now</b>.</p></div>
    <div class="card"><h3>Pin a task <span class="how">Pin task button</span></h3>
      <p>The Reaper Task, Contracts and Daily Tasks windows have a <b>Pin task</b> button. The task then shows in the top-left of your screen with its progress (under the slayer counter) and updates as you go. One at a time; <b>Unpin</b> hides it.</p></div>
    <div class="card"><h3>Collection log <span class="how">::collections</span></h3>
      <p>Tracks the boss items you've collected.</p></div>
    <div class="card"><h3>Donator Panel <span class="how">::donator</span></h3>
      <p>Your rank, progress to the next one, every rank's boosts and perks, Donator Zone and slayer task teleports, the daily Elite box (Death rank) and Death Recap.</p></div>
    <div class="card"><h3>Event countdown <span class="how">top of screen</span></h3>
      <p>A small box shows "DOUBLE XP 1h 23m", "WEEKEND 2x XP" or "DOUBLE DROPS" while those are on. You also get a message about them at login.</p></div>
    <div class="card"><h3>Bank value <span class="how">bank title</span></h3>
      <p>The bank title shows your <b>bank value</b> and <b>total wealth</b> (bank, inventory, gear and pouch), priced at Trading Post fair prices.</p></div>
    <div class="card"><h3>Forums link <span class="how">::forums</span></h3>
      <p>Gives a 6-letter code to link your game account on the website, <a href="https://playshadowofdeath.github.io">playshadowofdeath.github.io</a>. Your profile then shows your levels, rank and "In game now".</p></div>
  </div>
</section>

<!-- 6 -->
<section class="ch" id="home">
  <h2><span class="num">6</span>Around home</h2>
  <div class="card">
    <p>Everyone spawns and respawns at home. <code>::home</code> takes you back from anywhere (normal teleport rules apply, so not in deep Wilderness or in combat).</p>
    <div class="tbl"><table>
      <tr><th>What</th><th>What it's for</th></tr>
      <tr><td><b>Bank</b></td><td>Bank booths at home. Wraith donators and up can use <code>::bank</code> anywhere.</td></tr>
      <tr><td><b>Shop Board</b> (by the Well of Shadows)</td><td>Opens the Shops panel. The shopkeepers themselves are around home too.</td></tr>
      <tr><td><b>Raid Board</b></td><td>Wooden sign near spawn: make or join raid parties.</td></tr>
      <tr><td><b>Trading Post booth</b></td><td>Player shops and Quick Sell.</td></tr>
      <tr><td><b>Slayer masters</b></td><td>Get slayer tasks.</td></tr>
      <tr><td><b>Death</b></td><td>Gives Reaper (boss) tasks.</td></tr>
      <tr><td><b>Smiddi</b></td><td>Legendary gear shop (Torva, Primal, godswords and more) <i>and</i> Dragon &amp; Barrows shop.</td></tr>
      <tr><td><b>Key chests</b></td><td>Reaper, Toxic, Crystal and Brimstone chests. Right-click <b>Loot table</b> to see what each one gives.</td></tr>
      <tr><td><b>Halloween AFK Tree</b> (west, by the Trading Post area)</td><td>Chop forever for candy and rare boxes. See <a href="#money">Making money</a>.</td></tr>
      <tr><td><b>Well of Shadows</b></td><td>Sells the <b>global boosts</b> that help everyone online for an hour: Global xp boost <b>250M</b>, Global drop boost <b>500M</b>.</td></tr>
      <tr><td><b>Shadow Portal</b></td><td>The home teleporter.</td></tr>
      <tr><td><b>Altars</b></td><td>Pray at any normal altar to switch between Normal Prayers and <b>Ancient Curses</b>.</td></tr>
      <tr><td><b>Smithing corner</b> (north-west of spawn)</td><td>Furnace, anvil and the <b>Metal Bank</b> chest. See <a href="#smithing">Smithing corner</a> below.</td></tr>
    </table></div>
  </div>

  <div class="card" id="smithing">
    <h3>Smithing corner: furnace, anvil &amp; Metal Bank</h3>
    <p><b>Where it is:</b> from where you spawn, walk <b>north-west</b> past the well. Keep going past the slayer chests and the smithing corner is just north of them, about 15 steps from spawn. You'll see a <b>furnace</b>, an <b>anvil</b> and a steel chest called the <b>Metal Bank</b> standing together on a raised <b>stone platform</b>. Just walk up onto it from any side.</p>
    <h3>The Metal Bank</h3>
    <p>A second bank just for <b>ores and bars</b> (not Dungeoneering ones). It holds up to <b>30 different kinds</b>, as many of each as you like, and it's yours alone: other players see their own Metal Bank.</p>
    <ol class="steps">
      <li><b>Open it:</b> left-click the chest. Your ores and bars are on the left, your bag on the right.</li>
      <li><b>Put things in:</b> right-click an item in your bag and pick <b>Deposit-1</b>, <b>-10</b>, <b>-All</b> or <b>-X</b> (type an amount). Noted ores and bars go in too.</li>
      <li><b>Quick deposit:</b> right-click the chest and pick <b>Deposit-all</b>. Every ore and bar in your bag goes in, and so does everything in your <b>Ore box</b>, without opening the chest.</li>
      <li><b>Take things out:</b> right-click an item in the chest and pick <b>Withdraw-1</b>, <b>-10</b>, <b>-All</b>, <b>-X</b> or <b>Withdraw-All-noted</b> (noted saves bag space when you want to sell). The button at the bottom takes everything out.</li>
      <li><b>Using an ore, bar or your Ore box on the chest</b> does the same as Deposit-all.</li>
    </ol>
    <h3>Smelting &amp; smithing straight from the Metal Bank</h3>
    <p>The <b>home furnace and anvil read the Metal Bank for you</b>, so you don't have to withdraw anything first.</p>
    <ul>
      <li><b>Furnace:</b> click it and pick a bar as normal. It uses ore from your bag first, then from the Metal Bank. Bars made from Metal Bank ore go <b>back into the Metal Bank</b> (or your bag if it's full).</li>
      <li><b>Anvil:</b> you only need a <b>hammer</b> in your bag (or tool belt). Click the anvil and the smithing screen counts bars in your bag <i>and</i> your Metal Bank. What you make goes into your bag, so keep a free slot.</li>
      <li>This only works at the home furnace and anvil. Anywhere else, the bars and ore need to be in your bag.</li>
    </ul>
    <div class="tip"><b>Fast smithing loop:</b> mine with an Ore box, teleport home, right-click the Metal Bank &gt; <b>Deposit-all</b>, then smelt and smith without ever opening your bank.</div>
  </div>

  <div class="card" id="oreboxes">
    <h3>Ore box &amp; Wood box</h3>
    <p>Carry up to <b>200</b> extra ore or logs in one bag slot.</p>
    <div class="tbl"><table>
      <tr><th>Box</th><th>Holds</th><th>Where to buy</th><th>Price</th></tr>
      <tr><td><b>Ore box</b> (grey)</td><td>Any ore, coal or clay (not Dungeoneering ores)</td><td>Home <b>Mining</b> shop</td><td class="v">1M</td></tr>
      <tr><td><b>Wood box</b> (brown)</td><td>Any logs</td><td>Home <b>Woodcutting</b> shop</td><td class="v">1M</td></tr>
    </table></div>
    <p>Right-click the box in your bag:</p>
    <ul>
      <li><b>Fill</b> moves the matching ore or logs from your bag into the box. A box holds <b>one kind at a time</b>, so empty it before switching from, say, coal to iron.</li>
      <li><b>Inspect</b> tells you what's inside and how many.</li>
      <li><b>Empty</b> takes the contents out into your bag (as many as you have free slots for).</li>
      <li><b>Into your bank:</b> with your bank open, deposit the box as normal. It empties into your bank and the box stays in your bag.</li>
      <li><b>Into the Metal Bank</b> (Ore box only): use <b>Deposit-all</b> on the chest, or deposit the box from the Metal Bank screen.</li>
      <li><b>Destroy</b> asks first. Anything inside is sent to your bank, so nothing is lost.</li>
    </ul>
    <div class="warn"><b>Rules:</b> one of each box per person. You can't trade or drop them, and you keep them when you die (even in the Wilderness). Empty a box before banking it.</div>
  </div>
</section>

<!-- 7 -->
<section class="ch" id="skills">
  <h2><span class="num">7</span>Levelling skills</h2>
  <div class="card">
    <h3>How XP works here</h3>
    <ul>
      <li>Your <b>game mode</b> multiplies your XP (see <a href="#modes">modes</a>).</li>
      <li><b>Double XP</b> events stack on top, up to 2x total. <b>Weekends are double XP</b> automatically.</li>
      <li>Donator ranks add an extra XP boost.</li>
    </ul>
    <div class="tip"><b>Fastest teleports:</b> <code>::skilling</code> opens a menu of skilling spots (Fishing, Mining, Agility, Woodcutting, Runecrafting, Summoning, Hunter, Puro-Puro, Falconry, Gemstone rocks, Dungeoneering). <code>::train</code> opens combat training spots. The Teleport Manager's <b>Skilling</b> tab also has Ardougne thieving, Seers woodcutting, the gnome and barbarian agility courses and Dungeoneering.</div>
  </div>

  <div class="card">
    <h3>Combat (Attack, Strength, Defence, Ranged, Magic, Constitution)</h3>
    <ol>
      <li><b>Low levels:</b> Rock crabs, Sand crabs, Cows, Yaks or Experiments (Teleport Manager &gt; Monsters, or <code>::train</code>).</li>
      <li><b>Mid levels:</b> Chaos druids and desert bandits, then <b>Slayer tasks</b>, which give combat XP <i>and</i> Slayer XP <i>and</i> money.</li>
      <li><b>High levels:</b> Dragons (frost, adamant, rune) and bosses. Bossing is also where the real money is.</li>
    </ol>
    <p><b>Prayer:</b> bury bones, or use bones on the altar in the Donator Zone for <b>double Prayer XP</b>. Dragon and frost dragon bones are best.</p>
    <p><b>Food:</b> Saradomin brews are strong here. They heal <b>175</b> (super brews 210).</p>
  </div>

  <div class="tbl card">
    <h3>Skill-by-skill</h3>
    <table>
      <tr><th>Skill</th><th>How to train it</th><th>Money angle</th></tr>
      <tr><td><b>Woodcutting</b></td><td>Seers' Village (yews, magics) via <code>::skilling</code>. Or the <b>Halloween AFK tree</b> at home, which never falls down. A <a href="#oreboxes">Wood box</a> carries 200 extra logs.</td><td>Magic logs 60K, yews 15K each (Quick Sell)</td></tr>
      <tr><td><b>Mining</b></td><td>Dwarf mine, coal, LRC, Lava flow and Gemstone rocks via <code>::skilling</code>. Rocks never run out. Mithril, adamant and rune are quick here (at 99 about 1,100 / 560 / 260 ore an hour). An <a href="#oreboxes">Ore box</a> carries 200 extra ore.</td><td>Runite ore 150K</td></tr>
      <tr><td><b>Smithing</b></td><td>Smelt and smith the bars you mined. The <a href="#smithing">smithing corner</a> at home uses ore and bars straight from your Metal Bank.</td><td>Rune bar 350K</td></tr>
      <tr><td><b>Fishing</b></td><td>Barbarian, Draynor or <b>Catherby</b> (best) via <code>::skilling</code>.</td><td>Rocktails 50K raw / 70K cooked, mantas 35K / 50K</td></tr>
      <tr><td><b>Cooking</b></td><td>Cook your catch on a range.</td><td>Cooked fish sell for more than raw</td></tr>
      <tr><td><b>Herblore</b></td><td>Clean herbs and make potions.</td><td>Torstol 120K, snapdragon 70K, ranarr 50K (clean)</td></tr>
      <tr><td><b>Crafting</b></td><td>Cut gems and make jewellery and armour.</td><td>Cut dragonstone 120K</td></tr>
      <tr><td><b>Fletching</b></td><td>Cut logs into bows and arrows.</td><td>Contracts pay for fletched items</td></tr>
      <tr><td><b>Thieving</b></td><td>Ardougne market stalls (Teleport Manager &gt; Skilling).</td><td>Coins and stall items</td></tr>
      <tr><td><b>Agility</b></td><td>Gnome course, then Barbarian Outpost, then the Agility Pyramid.</td><td>&mdash;</td></tr>
      <tr><td><b>Runecrafting</b></td><td>Altars for Air through Astral via <code>::skilling</code>.</td><td>Runes for your Magic</td></tr>
      <tr><td><b>Hunter</b></td><td>Hunter areas, Puro-Puro (impling jars) and Falconry.</td><td>Contracts include Hunter</td></tr>
      <tr><td><b>Summoning</b></td><td>The Summoning area via <code>::skilling</code>. Make pouches.</td><td>Familiars help with bossing</td></tr>
      <tr><td><b>Farming</b></td><td>Plant in patches. <code>::farmingstatus</code> shows your patches.</td><td>Herbs to sell</td></tr>
      <tr><td><b>Firemaking</b></td><td>Burn the logs you cut.</td><td>&mdash;</td></tr>
      <tr><td><b>Construction</b></td><td>Build in your house.</td><td>&mdash;</td></tr>
      <tr><td><b>Slayer</b></td><td>Tasks from the slayer masters. See <a href="#slayer">Slayer</a>.</td><td>Coins per kill and per task</td></tr>
      <tr><td><b>Dungeoneering</b></td><td>Teleport Manager &gt; Skilling &gt; Dungeoneering.</td><td>&mdash;</td></tr>
      <tr><td><b>Divination</b></td><td>Wisps.</td><td>&mdash;</td></tr>
    </table>
    <div class="tip"><b>Skilling points:</b> skilling earns points you can spend in the <b>Skilling points</b> shop (Shops panel &gt; Points). Skillcapes, hoods and master capes are in the Skilling tab.</div>
  </div>
</section>

<!-- 8 -->
<section class="ch" id="slayer">
  <h2><span class="num">8</span>Slayer</h2>
  <div class="card">
    <h3>How it works</h3>
    <ol class="steps">
      <li>Talk to a <b>slayer master</b> at home and get a task ("Kill 120 Abyssal demons"). Higher masters need higher combat but pay more.</li>
      <li>Open the <b>Slayer Task</b> window (<code>::slayertask</code>, or click Slayer task on the Player Info tab) and press <b>Teleport to task</b>. <code>::tasktp</code> does the same.</li>
      <li>Kill your monsters. The <b>slayer counter</b> in the top left shows how many are left.</li>
      <li>Finish the task to get paid, then get a new one. Tasks done in a row build a <b>streak</b>.</li>
    </ol>
    <div class="tbl"><table>
      <tr><th>Master</th><th>Coins per kill on task</th></tr>
      <tr><td>Turael / Spria</td><td class="v">10K</td></tr>
      <tr><td>Mazchna / Achtryn</td><td class="v">20K</td></tr>
      <tr><td>Vannaka</td><td class="v">30K</td></tr>
      <tr><td>Chaeldar</td><td class="v">60K</td></tr>
      <tr><td>Sumona</td><td class="v">70K</td></tr>
      <tr><td>Duradel / Lapalok</td><td class="v">85K</td></tr>
      <tr><td>Kuradal</td><td class="v">100K</td></tr>
      <tr><td>Krystillia (Wilderness tasks)</td><td class="v">135K</td></tr>
    </table></div>
    <ul>
      <li><b>Finished task:</b> 500K&ndash;12M coins depending on the master and task size, plus <b>slayer points</b>.</li>
      <li><b>Box chances</b> per finished task: Elite box 1 in 20, Legendary chest 1 in 150.</li>
      <li>Spend slayer points in the <b>Slayer points</b> and <b>Boss slayer</b> shops (Shops panel &gt; Points).</li>
      <li>Don't like your task? <code>::resettask</code> resets it.</li>
    </ul>
    <div class="tip"><b>Slayer dungeons</b> (Teleport Manager &gt; Slayer): Kuradal's Dungeon, Fremennik Dungeon, Slayer Tower, Catacombs of Kourend, Edgeville dungeon, Glacor Cave and Jadinko Lair. A few tasks have no teleport yet. The window tells you when that happens.</div>
  </div>
</section>

<!-- 9 -->
<section class="ch" id="reaper">
  <h2><span class="num">9</span>Reaper tasks</h2>
  <div class="card">
    <h3>Boss tasks from Death</h3>
    <p>Once you can handle bosses, talk to <b>Death</b> at home for a <b>Reaper task</b>: kill a set number of one boss (e.g. "19 General Graardor").</p>
    <ul>
      <li>Open the <b>Reaper Task</b> window (<code>::reapertask</code>, or the button in the Daily Tasks and Slayer windows) and press <b>Teleport to task</b>.</li>
      <li>Finishing a task pays <b>Reaper points</b>.</li>
      <li>Bosses on your Reaper task drop <b>Reaper keys</b> (1 in 50 per kill).</li>
      <li>Use the key on the <b>Reaper chest</b> at home. Right-click it and pick <b>Loot table</b> to see the rewards.</li>
      <li>The chest's best rewards are the <b>Reaper scythe</b> and the <b>Reaper hand pet</b>, 1 in 1,202 each per key.</li>
      <li>Press <b>Pin task</b> in the window to keep your progress on screen while you kill.</li>
    </ul>
    <p>Bosses that can be Reaper tasks include Nex, the four God Wars generals, Corporeal Beast, Cerberus, Abyssal Sire, Queen Black Dragon, King Black Dragon, Kalphite Queen, Kraken, Dagannoth Kings and more.</p>
    <div class="good"><b>Stack it up:</b> a Reaper task boss still counts for your <b>daily tasks</b>, still pays boss coins and still rolls boss boxes and tickets. One kill, four rewards.</div>
  </div>
</section>

<!-- 10 -->
<section class="ch" id="contracts">
  <h2><span class="num">10</span>Skilling contracts</h2>
  <div class="card">
    <p>Open <code>::contracts</code> (or <b>Contracts</b> in the Daily Tasks window) and pick one of three offers. They come in <b>Easy, Medium, Hard or Elite</b>, matched to your levels, and cover Woodcutting, Mining, Fishing, Cooking, Smithing, Fletching, Farming, Crafting and Hunter.</p>
    <ul>
      <li>Hand items in <b>from anywhere</b>. Noted items count.</li>
      <li>You're paid per item as you hand them in, about <b>40% more than Quick Sell</b>, plus a <b>25% finishing bonus</b>.</li>
      <li>Box chances on finishing: Elite box (Medium 1/20, Hard 1/10, Elite 1/5), Legendary chest (Hard 1/100, Elite 1/40) and a 100m ticket (Hard 1/200, Elite 1/50).</li>
      <li><b>Every 10th contract gives a free Elite box.</b></li>
      <li>A top Elite contract is worth roughly <b>10&ndash;35M</b>.</li>
      <li>New offers appear every 5 minutes. Cancelling keeps what you were paid but loses the bonus.</li>
      <li>Press <b>Pin task</b> to keep "Contract: 200 x Yew logs 50 / 200" on screen while you gather.</li>
    </ul>
  </div>
</section>

<!-- 11 -->
<section class="ch" id="daily">
  <h2><span class="num">11</span>Daily tasks</h2>
  <div class="card">
    <ul>
      <li><b>3 random tasks a day</b>, reset at midnight: kill bosses, kill a certain boss, kill monsters, slayer kills, finish slayer tasks or complete raids.</li>
      <li>Each pays <b>8M&ndash;30M</b>. Raid tasks also give an Elite box.</li>
      <li><b>Finish all three:</b> +10M and an <b>Elite box</b>.</li>
      <li>Boss kills count for <b>everyone who did 100+ damage</b>, so bossing with friends helps everyone's dailies.</li>
      <li>Each unfinished task has a <b>Pin task</b> button to keep its progress on screen.</li>
    </ul>
  </div>
</section>

<!-- 12 -->
<section class="ch" id="money">
  <h2><span class="num">12</span>Making money</h2>
  <div class="grid">
    <div class="card"><h3>Bossing</h3><p>Every boss pays coins on each kill: <b>1.5M&ndash;3.5M</b> from big bosses, <b>300K&ndash;1M</b> from fast ones, plus drops, boxes and cash tickets. It's the best money in the game.</p></div>
    <div class="card"><h3>World event boss</h3><p>Every <b>3 hours</b> an Enraged Olm, Amethyst dragon or Pumpkin brute spawns and the whole server is told. Everyone who helps splits <b>150M</b> by damage (2M+ each). <code>::event</code> teleports you there.</p></div>
    <div class="card"><h3>Slayer</h3><p>Coins on every task kill, plus 500K&ndash;12M per finished task and box chances.</p></div>
    <div class="card"><h3>Daily tasks</h3><p>Up to about 100M a day with the bonus, plus Elite boxes.</p></div>
    <div class="card"><h3>Skilling + Contracts</h3><p>Skilling items sell well (magic logs 60K, rune bars 350K, rocktails 70K, torstols 120K). Contracts pay even more.</p></div>
    <div class="card"><h3>Halloween AFK Tree</h3><p>At home. Every chop (2.4s) gives <b>1 Halloween candy</b> for the candy shop, and each chop can drop boxes: H'ween box 1/400, Mystery box 1/600, Slayer casket 1/1,200, Elite box 1/4,000, Legendary chest 1/10,000, 100m ticket 1/12,000 and more. Needs a hatchet. Great while you're AFK.</p></div>
  </div>
  <div class="tip"><b>Quick Sell</b> at the Trading Post sells any tradeable item instantly for 40% of its fair price. It's handy for dumping loot, but selling to players in your own shop gets more.</div>
</section>

<!-- 13 -->
<section class="ch" id="bossing">
  <h2><span class="num">13</span>Bossing</h2>
  <div class="card">
    <p>All bosses are in the <b>Teleport Manager &gt; Bosses</b>: General Graardor, Kree'arra, Commander Zilyana, K'ril Tsutsaroth, Queen Black Dragon, King Black Dragon, Kalphite Queen, The Alchemist, Dagannoth Kings, Kraken, Zulrah, Vorkath, Cerberus and more. Raids and the world event boss are in the same tab.</p>
    <ul>
      <li><b>Boss uniques are 3x more common</b> than normal RuneScape. A Bandos chestplate is about 1 in 80.</li>
      <li>Every boss can drop a <b>100m ticket</b> (1/100) and a <b>1b ticket</b> (1/600). Fast bosses drop them half as often.</li>
      <li>Big bosses drop an <b>Elite box</b> 1/25 and a <b>Legendary chest</b> 1/150 (fast bosses 1/50 and 1/300).</li>
      <li>Check any boss's drops first with <code>::drops boss name</code>.</li>
      <li><code>::bosskc</code> shows your boss kill counts.</li>
    </ul>
    <div class="tip"><b>Dragons:</b> Teleport Manager &gt; Monsters has green, blue, black, red, metal, frost and adamant/rune dragons. None of them are in the Wilderness.</div>
  </div>
</section>

<!-- 14 -->
<section class="ch" id="raids">
  <h2><span class="num">14</span>Raids</h2>
  <div class="card">
    <h3>Theatre of Blood &amp; Chambers of Xeric</h3>
    <ol class="steps">
      <li>Go to the <b>Raid Board</b> at home and click <b>Create party</b> (you become the leader), or <b>Request</b> to join someone's party.</li>
      <li>The leader picks the raid and an optional minimum combat level, and accepts or kicks people. Up to 5 players.</li>
      <li>Everyone presses <b>Ready</b>, the leader presses <b>Start</b>, and after 10 seconds the whole party goes in. Playing alone? Use <b>Start solo</b>.</li>
      <li>Kill the boss. Everyone alive who did 100+ damage opens <b>their own chest</b>.</li>
    </ol>
    <ul>
      <li><b>Dying in a raid is safe.</b> You keep everything and get sent home.</li>
      <li>Bosses get +40% HP per extra player and switch targets between players.</li>
      <li><b>Theatre of Blood</b> (Verzik): 1&ndash;3 x 100m tickets every chest, uniques 1 in 5 (Scythe, Ghrazi rapier, Justiciar, Sanguinesti staff, Avernic hilt), Lil' Zik pet 1/250.</li>
      <li><b>Chambers of Xeric</b> (Great Olm: kill both claws first, then the head): uniques 1 in 5 (Twisted bow, Kodai, Ancestral, Elder maul, DHCB, claws and more), Olmlet pet 1/250.</li>
      <li><b>Bonus roll:</b> 1 in 30 chests also has a <b>Torva or Primal</b> piece.</li>
      <li>After a group kill you see the MVP and everyone's damage. The board's <b>Records</b> page shows the fastest kills.</li>
    </ul>
  </div>
</section>

<!-- 15 -->
<section class="ch" id="boxes">
  <h2><span class="num">15</span>Boxes, keys &amp; tickets</h2>
  <div class="grid">
    <div class="card"><h3>Elite box &amp; Legendary chest</h3><p>Black-and-red Elite boxes and red-and-gold Legendary chests come from bosses, slayer, raids, contracts and daily tasks. They stack. Right-click <b>Check drops</b> to see every reward and its chance. The Legendary chest can give every piece of Torva and Primal.</p></div>
    <div class="card"><h3>Other boxes</h3><p>Shadow Box, Mystery box, Toxic box, PvP box, Slayer caskets, H'ween box and more. All of them have <b>Check drops</b>.</p></div>
    <div class="card"><h3>Cash tickets</h3><p><b>100m</b> and <b>1b</b> tickets. Right-click <b>Claim</b> (or Claim-all) to turn them into coins. You can also <i>buy</i> them from your money pouch, which is handy for trading big amounts.</p></div>
    <div class="card"><h3>Key chests</h3><p><b>Reaper</b> (Reaper keys), <b>Toxic</b>, <b>Crystal</b> and <b>Brimstone</b> chests at home, plus <b>Larran's chest</b> in the Wilderness. Right-click <b>Loot table</b> to see what each one gives.</p></div>
  </div>
</section>

<!-- 16 -->
<section class="ch" id="trading">
  <h2><span class="num">16</span>Trading Post &amp; shops</h2>
  <div class="card">
    <h3>Trading Post</h3>
    <ul>
      <li>Browse every player's shop, or search by item or player name.</li>
      <li>Set up <b>your own shop</b> and sell to other players while you play.</li>
      <li><b>Market history</b> shows what things actually sell for.</li>
      <li><b>Quick Sell:</b> instant 40% of fair price.</li>
    </ul>
  </div>
  <div class="card">
    <h3>Shops worth knowing</h3>
    <div class="tbl"><table>
      <tr><th>Shop</th><th>What's in it</th></tr>
      <tr><td><b>Combat tab</b></td><td>Armour, weapons, pure gear, ranged, magic and slayer equipment</td></tr>
      <tr><td><b>Supplies tab</b></td><td>General store, food, potions, clothes</td></tr>
      <tr><td><b>Skilling tab</b></td><td>All skill shops, skillcapes, hoods and master capes</td></tr>
      <tr><td><b>Points tab</b></td><td>Vote, Shadow points, trivia, slayer points, boss slayer, loyalty, skilling points</td></tr>
      <tr><td><b>Smiddi &ndash; Legendary gear</b></td><td>Full Torva (helm 375M, body 560M, legs 500M, gloves/boots 100M) and Primal (310M / 500M / 440M / 125M / 125M). Also whip 20M, vine whip 50M, Korasi 110M, BGS 100M, AGS 150M, rapier 125M, claws 190M, DFS 65M, Fire cape 75M, TokHaar-Kal 190M, Bandos and more</td></tr>
      <tr><td><b>Smiddi &ndash; Dragon &amp; Barrows</b></td><td>The step up from rune: dragon armour (2M&ndash;10M) and all four Barrows sets (Dharok's, Guthan's, Torag's, Verac's) at 3&ndash;5M a piece</td></tr>
      <tr><td><b>Halloween candy shop</b></td><td>Cosmetics bought with candy from the AFK tree</td></tr>
    </table></div>
  </div>
</section>

<!-- 17 -->
<section class="ch" id="donator">
  <h2><span class="num">17</span>Donator ranks</h2>
  <div class="card">
    <p>Reaper-themed ranks, lowest to highest. Each has its own chat icon and name colour, plus XP and drop boosts. See them all in <code>::donator</code>.</p>
    <p>
      <span class="rank" style="color:#bbb">Lost Soul</span>
      <span class="rank" style="color:#9fd0ff">Wraith</span>
      <span class="rank" style="color:#b98cff">Phantom</span>
      <span class="rank" style="color:#4fd3c4">Shade</span>
      <span class="rank" style="color:#ff7a2e">Revenant</span>
      <span class="rank" style="color:#ff3b3b">Reaper</span>
      <span class="rank" style="color:#e8c45c">Death</span>
    </p>
    <ul>
      <li><b>Donator Zone</b> (Teleport Manager &gt; Minigames, or <code>::dhub</code>) with an altar for double Prayer XP.</li>
      <li><code>::bank</code> anywhere (Wraith+).</li>
      <li><b>Death</b> rank: a free <b>daily Elite box</b>, plus <b>Death Recap</b>, which shows where you died, what killed you, what you dropped and gives a one-time teleport back to your items. Reopen it with <code>::death</code>.</li>
      <li>Coloured yell tags: <code>::yell message</code>.</li>
    </ul>
    <div class="warn"><b>Only donate to Shadow.</b> Anyone else asking for donations is scamming you.</div>
  </div>
</section>

<!-- 18 -->
<section class="ch" id="extras">
  <h2><span class="num">18</span>Fun extras</h2>
  <div class="grid">
    <div class="card"><h3>Blackjack <span class="how">::blackjack name amount</span></h3><p>Challenge a player, e.g. <code>::blackjack bob 5m</code>. Bets are 10K&ndash;2B from your pouch. Closest to 21 wins the pot. You get 30 seconds per turn. Not allowed in the Wilderness or for Ironmen. <code>::blackjack</code> on its own explains the rules.</p></div>
    <div class="card"><h3>Quests</h3><p>Nine quests are listed as playable (Cook's Assistant, Restless Ghost, Imp Catcher, Dwarf Cannon, Lost City, Ernest the Chicken, Gertrude's Cat, Threat of Kharzard, Nomad's Requiem), but see the note in <a href="#tips">known issues</a>.</p></div>
    <div class="card"><h3>Titles &amp; looks</h3><p><code>::title</code>, <code>::claimtitle</code>, <code>::makeover</code> and <code>::gender</code> change your look. <code>::yellcolor</code> sets your yell colour (donators).</p></div>
    <div class="card"><h3>Forums &amp; community</h3><p><a href="https://playshadowofdeath.github.io">playshadowofdeath.github.io</a> has forums, a community feed, friends and instant chat. Link your game account with <code>::forums</code>.</p></div>
  </div>
</section>

<!-- 19 -->
<section class="ch" id="commands">
  <h2><span class="num">19</span>Commands</h2>
  <div class="card tbl">
    <p>Type these in the chat box. <code>::commands</code> in game shows a list too.</p>
    <table>
      <tr><th>Command</th><th>What it does</th></tr>
      <tr><td><code>::home</code></td><td>Teleport home</td></tr>
      <tr><td><code>::welcome</code></td><td>Welcome window (same as the M button)</td></tr>
      <tr><td><code>::guide</code></td><td>Money Making Guide</td></tr>
      <tr><td><code>::daily</code></td><td>Daily Tasks (same as the D button)</td></tr>
      <tr><td><code>::tpmanager</code></td><td>Teleport Manager (same as the T button)</td></tr>
      <tr><td><code>::skilling</code> / <code>::train</code></td><td>Skilling teleports / combat training teleports</td></tr>
      <tr><td><code>::slayertask</code></td><td>Slayer Task window</td></tr>
      <tr><td><code>::tasktp</code> / <code>::resettask</code></td><td>Teleport to / reset your slayer task</td></tr>
      <tr><td><code>::reapertask</code></td><td>Reaper Task window</td></tr>
      <tr><td><code>::contracts</code></td><td>Skilling Contracts</td></tr>
      <tr><td><code>::shops</code></td><td>Shops panel</td></tr>
      <tr><td><code>::drops name</code></td><td>Drop table for a monster, or <code>tob</code> / <code>cox</code></td></tr>
      <tr><td><code>::whereget name</code> / <code>::find name</code></td><td>Item lookup: which monsters drop an item and which shops sell it</td></tr>
      <tr><td><code>::quests</code></td><td>Quests panel</td></tr>
      <tr><td><code>::toolbelt</code></td><td>Tool Belt</td></tr>
      <tr><td><code>::event</code></td><td>Teleport to the world event boss</td></tr>
      <tr><td><code>::collections</code></td><td>Collection log</td></tr>
      <tr><td><code>::bosskc</code></td><td>Boss kill counts</td></tr>
      <tr><td><code>::donator</code></td><td>Donator Panel</td></tr>
      <tr><td><code>::death</code></td><td>Death Recap (Death rank)</td></tr>
      <tr><td><code>::blackjack name amount</code></td><td>Challenge someone to Blackjack</td></tr>
      <tr><td><code>::forums</code></td><td>Code to link your forum account</td></tr>
      <tr><td><code>::yell message</code></td><td>Message the whole server (donators)</td></tr>
      <tr><td><code>::changepass</code></td><td>Change your password</td></tr>
      <tr><td><code>::farmingstatus</code></td><td>Your farming patches</td></tr>
      <tr><td><code>::togglehits</code></td><td>Change the hitsplat style</td></tr>
      <tr><td><code>::commands</code></td><td>Full in-game command list</td></tr>
    </table>
  </div>
</section>

<!-- 20 -->
<section class="ch" id="tips">
  <h2><span class="num">20</span>Tips &amp; known issues</h2>
  <div class="card">
    <h3>Pro tips</h3>
    <ul>
      <li><b>Stack your goals.</b> Pick a slayer task, a Reaper task and daily tasks that overlap, so one boss kill counts for all of them.</li>
      <li><b>Always check double XP</b> (Welcome window or the countdown) before a long skilling session. Weekends are 2x.</li>
      <li>Use <code>::drops</code> before farming a boss so you know what you're hunting.</li>
      <li>Put your hatchet and pickaxe on the <b>tool belt</b> to free up inventory space.</li>
      <li>Leave the <b>AFK tree</b> running when you step away. Free candy and lottery boxes.</li>
      <li>Don't Quick Sell rares. Check the Trading Post market history first.</li>
      <li>The Wilderness is dangerous: you lose items there. Everywhere else, and in raids, deaths are safe.</li>
    </ul>
  </div>
  <div class="card">
    <h3>Known issues (being worked on)</h3>
    <ul>
      <li><b>Quests</b> may not finish properly yet. Don't count on quest rewards for now.</li>
      <li>The <b>Completionist cape</b> stand isn't in the world yet.</li>
      <li>A few items have a blank or wrong inventory picture (Divine spirit shield, fire cape icon).</li>
      <li>A handful of slayer tasks have no teleport yet.</li>
    </ul>
    <p>Found a bug? Tell Shadow in game or post it in the <b>Support</b> forum on the website.</p>
  </div>
</section>

`;
