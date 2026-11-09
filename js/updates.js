// =====================================================================
//  NEW UPDATES (#/updates): the big player-facing changes, newest first.
//  Same format as "Shadow of Death - Patch Notes.html": add a new
//  <div class="update"> at the TOP for each update. Tags: new, changed,
//  fixed, removed. Owner tools and Server Manager things don't go here
//  (they go in the owner-only patch notes).
// =====================================================================
window.UPDATES_HTML = `

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
