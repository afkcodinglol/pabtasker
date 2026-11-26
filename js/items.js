/* ==========================================================================
   OSRS Account Builder - shopping list data
   Quest items: "Items required" from each quest's OSRS Wiki details box (items the
   wiki marks as obtained during the quest are left out).
   Skilling supplies: per training method, XP earned per item used.
   ========================================================================== */
'use strict';

/* ID|Item:qty;Item:qty   (none = no items) */
const QUEST_ITEMS_RAW = `
COOKS_ASSISTANT|Bucket of milk:1;Pot of flour:1;Egg:1
DORICS_QUEST|Clay:6;Copper ore:4;Iron ore:2
DRUIDIC_RITUAL|Raw bear meat:1;Raw rat meat:1;Raw beef:1;Raw chicken:1
IMP_CATCHER|Black bead:1;Yellow bead:1;Red bead:1;White bead:1
DWARF_CANNON|Hammer:1
NATURAL_HISTORY_QUIZ|none
ROMEO_AND_JULIET|none
SEA_SLUG|Swamp paste:1
SHEEP_SHEARER|Ball of wool:20
THE_FEUD|Coins:501;Gloves:1;Kharidian headpiece:1;Fake beard:1
WITCHS_HOUSE|Cheese:1;Leather gloves:1
WITCHS_POTION|Burnt meat:1;Eye of newt:1;Onion:1
BLACK_KNIGHTS_FORTRESS|Cabbage:1;Iron chainbody:1;Bronze med helm:1
GERTRUDES_CAT|Bucket of milk:1;Coins:100;Raw sardine:1
HORROR_FROM_THE_DEEP|Fire rune:1;Air rune:1;Water rune:1;Earth rune:1;Sword or Longsword:1;Arrow:1;Molten glass:1;Tinderbox:1;Hammer:1;Steel nails:60;Plank:2;Swamp tar:1
ELEMENTAL_WORKSHOP_I|Pickaxe:1;Thread:1;Needle:1;Leather:1;Knife:1;Hammer:1;Coal:4
DEATH_PLATEAU|Coins:60;Bread:10;Cooked trout:10;Iron bar:1;Asgarnian ale:1
TROLL_STRONGHOLD|Climbing boots:1
X_MARKS_THE_SPOT|Spade:1
BARCRAWL|Coins:208
CLIENT_OF_KOUREND|Feather:1
THE_RESTLESS_GHOST|none
RUNE_MYSTERIES|none
VAMPYRE_SLAYER|Hammer:1
WATERFALL_QUEST|Air rune:6;Earth rune:6;Water rune:6;Rope:1
PLAGUE_CITY|Dwellberries:1;Rope:1;Spade:1;Bucket of water:4;Chocolate dust:1;Bucket of milk:1;Snape grass:1
BIOHAZARD|Gas mask:1
THE_KNIGHTS_SWORD|Redberry pie:1;Iron bar:2;Pickaxe:1
ERNEST_THE_CHICKEN|none
MONKS_FRIEND|Jug of water:1;Logs:1
FIGHT_ARENA|Coins:5
TREE_GNOME_VILLAGE|Logs:6
PRIEST_IN_PERIL|Rune essence:50
NATURE_SPIRIT|Silver sickle:1;Ghostspeak amulet:1
RFD_COOK|Eye of newt:1;Greenman's ale:1;Rotten tomato:1;Fruit blast:1;Ashes:1
RFD_DWARF|Bucket of milk:1;Pot of flour:1;Egg:1;Bowl of water:1;Coins:306;Gloves:1
FISHING_CONTEST|Spade:1;Coins:5;Fishing rod:1
A_PORCINE_OF_INTEREST|Rope:1
ANIMAL_MAGNETISM|Mithril axe:1;Iron bar:5;Ghostspeak amulet:1;Ecto-token:20;Hammer:1;Hard leather:1;Holy symbol:1;Polished buttons:1
MERLINS_CRYSTAL|Bread:1;Tinderbox:1
HOLY_GRAIL|Excalibur:1
DRAGON_SLAYER_I|Unfired bowl:1;Wizard's mind bomb:1;Lobster pot:1;Silk:1;Law rune:1;Air rune:1;Hammer:1;Steel nails:90;Plank:3;Coins:2000
LOST_CITY|Knife:1;Axe:1
WHAT_LIES_BELOW|Bowl:1;Chaos rune:15;Chaos talisman:1
THE_DIG_SITE|Pestle and mortar:1;Vial:1;Tinderbox:1;Cup of tea:1;Rope:2;Uncut opal:1
THE_GRAND_TREE|Coins:1000
GOBLIN_DIPLOMACY|Blue dye:1;Orange dye:1
RFD_GOBLINS|Bread:1;Orange slices:1;Blue dye:1;Spice:1;Fishing bait:1;Bucket of water:1;Charcoal:1
FAIRYTALE_I|Secateurs:1;Ghostspeak amulet:1;Dramen staff:1
BONE_VOYAGE|Vodka:2;Marrentill potion (unf):1
JUNGLE_POTION|none
THE_ASCENT_OF_ARCEUUS|none
SHILO_VILLAGE|Spade:1;Candle lantern or torch:1;Rope:1;Bronze wire:1;Chisel:1
ONE_SMALL_FAVOUR|Steel bar:4;Bronze bar:1;Iron bar:1;Guam leaf:2;Marrentill:1;Harralander:1;Hammer:1;Opal:2;Jade:2;Red topaz:2;Sapphire:2
MURDER_MYSTERY|Pot:1
KINGS_RANSOM|Granite:1;Black full helm:1;Black platebody:1;Black platelegs:1;Bronze med helm:1;Iron chainbody:1
THE_TOURIST_TRAP|Desert shirt:1;Desert robe:1;Desert boots:1;Hammer:1;Bronze bar:1;Feather:10;Shantay pass:1
TEMPLE_OF_IKOV|Yew bow or thrown weapon:1;Limpwurt root:20
DESERT_TREASURE_I|Shantay pass:10;Coins:650;Magic logs:12;Steel bar:6;Molten glass:6;Ashes:1;Charcoal:1;Blood rune:1;Bones:1;Silver bar:1;Garlic powder:1;Spice:1;Cake:1;Climbing boots:1;Facemask or Gas mask:1;Tinderbox:1;Lockpick:20
THE_FREMENNIK_TRIALS|Coins:5252;Tinderbox:1;Raw shark:1;Lyre:1
OBSERVATORY_QUEST|Plank:3;Bronze bar:1;Molten glass:1
DEMON_SLAYER|Bones:25;Coins:1
UNDERGROUND_PASS|Rope:1;Bow:1;Arrows:1;Spade:1
THE_GOLEM|Vial:1;Pestle and mortar:1;Papyrus:1;Soft clay:1
SHADOW_OF_THE_STORM|Black dye:1;Silver bar:1
GHOSTS_AHOY|Ecto-token:31;Coins:400;Ghostspeak amulet:1;Bucket of milk:1;Silk:1;Dye:3;Spade:1;Oak longbow:1;Knife:1;Needle:1;Thread:1;Bucket of slime:1;Nettle tea:1
MAKING_HISTORY|Spade:1;Sapphire amulet:1;Ghostspeak amulet:1
MOUNTAIN_DAUGHTER|Rope:1;Pickaxe:1;Axe:1;Plank:1;Staff or pole:1;Gloves:1
HAZEEL_CULT|none
CHILDREN_OF_THE_SUN|none
PRINCE_ALI_RESCUE|Soft clay:1;Ball of wool:3;Yellow dye:1;Redberries:1;Ashes:1;Pot of flour:1;Bronze bar:1;Pink skirt:1;Beer:3;Rope:1
ICTHLARINS_LITTLE_HELPER|Cat or kitten:1;Tinderbox:1;Willow logs:1;Bag of salt:1;Bucket of sap:1;Waterskin:1;Linen:1
ENTER_THE_ABYSS|none
TEMPLE_OF_THE_EYE|Bucket of water:1
CREATURE_OF_FENKENSTRAIN|Ghostspeak amulet:1;Silver bar:1;Bronze wire:3;Needle:1;Thread:5;Spade:1;Law rune:1
THE_DEPTHS_OF_DESPAIR|none
THE_QUEEN_OF_THIEVES|Stew:1
ENLIGHTENED_JOURNEY|Papyrus:3;Ball of wool:1;Potatoes(10):1;Empty sack:8;Unlit candle:1;Yellow dye:1;Red dye:1;Silk:10;Logs:10;Tinderbox:1;Willow branch:12
SHEEP_HERDER|Coins:100
BIG_CHOMPY_BIRD_HUNTING|Axe:1;Feather:100;Knife:1;Chisel:1
RFD_OGRE|Axe:1;Raw chompy:1;Iron spit:1;Tinderbox:1;Pickaxe:1;Ball of wool:1;Ogre bow:1;Ogre arrow:1
RFD_EVIL_DAVE|Cat or kitten:1;Stew:9
RFD_PIRATE|Raw cod:1;Pestle and mortar:1;Bread:1;Knife:1;Fishbowl:1;Needle:1;Bronze wire:3
RFD_GUIDE|Bucket of milk:1;Egg:1;Pot of flour:1;Cake tin:1
RFD_MONKEY|M'speak amulet:1;Karamjan monkey greegree:1;Gorilla greegree:1;Ninja monkey greegree:1;Zombie monkey greegree:1;Rope:1;Knife:1;Pestle and mortar:1
RFD_AMIK_VARZE|Bucket of milk:1;Pot of cream:1;Pot of cornflour:1;Vanilla pod:1;Dramen staff:1;Dramen branch:1;Pestle and mortar:1;Raw chicken:1
RFD_CULINAROMANCER|Ice gloves:1;Restore potion:1
SHIELD_OF_ARRAV|Coins:20
HEROES_QUEST|Smiths gloves (i):1;Harralander potion (unf):1;Pickaxe:1
TOWER_OF_LIFE|Hammer:1;Saw:1;Beer:1
CLOCK_TOWER|Jug of water:1
TRIBAL_TOTEM|none
WATCHTOWER|Coins:20;Gold bar:1;Tinderbox:1;Pickaxe:1;Dragon bones:1;Rope:1;Guam potion (unf):1
GETTING_AHEAD|Bear fur:1;Soft clay:1;Steel nails:6
PIRATES_TREASURE|Coins:60
SCORPION_CATCHER|none
THE_CORSAIR_CURSE|none
FAMILY_CREST|Shrimps:1;Salmon:1;Tuna:1;Bass:1;Swordfish:1;Pickaxe:1;Ruby:2;Ring mould:1;Necklace mould:1;Antipoison:1
THE_GARDEN_OF_DEATH|none
MONKEY_MADNESS_I|Gold bar:1;Ball of wool:1
THE_FORSAKEN_TOWER|none
HAUNTED_MINE|none
TALE_OF_THE_RIGHTEOUS|Pickaxe:1;Rope:1
SLEEPING_GIANTS|Oak logs:3;Wool:1;Steel nails:10;Hammer:1;Chisel:1;Ice gloves:1
TROLL_ROMANCE|Iron bar:1;Maple logs:1;Rope:1;Climbing boots:1;Wax:1
THE_LOST_TRIBE|Pickaxe:1
RECRUITMENT_DRIVE|none
A_KINGDOM_DIVIDED|Axe:1;Defence potion:1;Volcanic sulphur:1;Molten glass:1;Pickaxe:1;Chisel:1
DEATH_ON_THE_ISLE|none
WANTED|Coins:10000;Rune essence:20
TWILIGHTS_PROMISE|none
REGICIDE|Coal:9;Bow:1;Arrows:1;Rope:2;Spade:1;Pickaxe:1;Tinderbox:1;Strip of cloth:1;Pestle and mortar:1;Gloves:1
ROVING_ELVES|Spade:1;Rope:1
MOURNINGS_END_PART_I|Silk:2;Feather:1;Toad crunchies:1;Magic logs:1;Leather:1;Coal:9
MOURNINGS_END_PART_II|Mourner gear:1;Chisel:1;Death talisman:1;Rope:1
ETHICALLY_ACQUIRED_ANTIQUITIES|none
DADDYS_HOME|Plank:10;Bolt of cloth:5;Steel nails:16
LUNAR_DIPLOMACY|Tinderbox:1;Coins:1000;Pestle and mortar:1;Hammer:1;Needle:1;Thread:2;Axe:1;Pickaxe:1;Spade:1;Bullseye lantern:1;Elemental talisman (or air, water, earth and fire talismans):1;Dramen staff:1
IN_SEARCH_OF_THE_MYREQUE|Steel longsword:1;Steel sword:2;Steel mace:1;Steel warhammer:1;Steel dagger:1;Steel nails:225;Druid pouch:1;Mort myre fungus:1;Hammer:1;Plank:6;Coins:10
IN_AID_OF_THE_MYREQUE|Spade:1;Bucket:5;Pickaxe:1;Hammer:1;Plank:11;Steel nails:2;Swamp paste:1;Raw mackerel:10;Bronze axe:10;Tinderbox:4;Steel bar:2;Coal:1;Soft clay:1;Rope:1;Silver bar:1;Mithril bar:1;Sapphire:1;Cosmic rune:1;Water rune:1
THRONE_OF_MISCELLANIA|Iron bar:1;Gold ring:1;Coins:1875
ROYAL_TROUBLE|none
THE_HAND_IN_THE_SAND|Coins:150;Vial:1;White berries:1;Lantern lens:1;Earth rune:5
ZOGRE_FLESH_EATERS|none
RUM_DEAL|none
CABIN_FEVER|none
THE_EYES_OF_GLOUPHRIE|Bucket of sap:1;Mud rune:1;Maple logs:1;Oak logs:1;Hammer:1;Saw:1;Pestle and mortar:1
THE_SLUG_MENACE|Commorb:1;Swamp paste:1;Dead sea slug:1;Rune essence:5;Chisel:1;Elemental talisman (or air, water, earth and fire talismans):1;Mind talisman:1
BELOW_ICE_MOUNTAIN|Cooked meat:1;Bread:1;Knife:1;Beer:1
EADGARS_RUSE|Climbing boots:1;Vodka:1;Pineapple chunks:1;Logs:1;Grain:10;Raw chicken:5;Pestle and mortar:1;Ranarr potion (unf):1
GARDEN_OF_TRANQUILLITY|Ring of charos:1;Rake:1;Seed dibber:1;Spade:1;Secateurs:1;Watering can:1;Gardening trowel:1;Plant cure:2;Marigold seed:1;Cabbage seed:3;Onion seed:3;Hammer:1;Rune essence:1;Filled plant pot:1;Compost:2
A_SOULS_BANE|Rope:1
SHADOWS_OF_CUSTODIA|Willow longbow:4;Maple logs:4;Fishing rod:1;Hammer:1
MONKEY_MADNESS_II|Lemon:1;Grapes:1;Pestle and mortar:1;Logs:1;Hammer:1;Chisel:1;M'speak amulet:1;Monkey talisman:1;Ninja monkey greegree:1;Translation book:1
TAI_BWO_WANNAI_TRIO|Knife:1;Sliced banana:1;Small fishing net:1;Pestle and mortar:1;Logs:2;Iron spear:1;Agility potion(4):1;Jogre bones:1;Seaweed:1;Karamjan rum:1
BARBARIAN_TRAINING|Seed:1;Spade:1;Sapling:1;Axe:1;Bow:1;Oak logs:1;Tinderbox:1;Feather:1;Knife:1;Hammer:1;Metal bar:2;Logs:2;Attack potion:1;Roe:1
THE_FREMENNIK_ISLES|Raw tuna:1;Tin ore:1;Rope:9;Knife:1;Split log:8;Neitiznot shield:1;Yak-hide armour (top):1;Yak-hide armour (legs):1;Silly jester costume:1
PANDEMONIUM|Hammer:1;Saw:1
PRYING_TIMES|Hammer:1;Steel bar:1;Redberry pie:1;Captain's log:1
CURRENT_AFFAIRS|Charcoal:1;Coins:50
MA1|Knife:1
MA2|God staves:3;Air rune:1;Fire rune:1;Blood rune:1;Knife:1
SONG_OF_THE_ELVES|Steel full helm:1;Steel platebody:1;Steel platelegs:1;Red dye:1;Purple dye:1;Mourner gear:1;Gas mask:1;Silk:1;Runite bar:1;Limestone brick:8;Tinderbox:1;Rope:1;Nature rune:1;Irit leaf:1;Adamant chainbody:1;Wine of zamorak:1;Cabbage:1;Black dagger:1;Cadantine seed:1;Seed dibber:1;Vial of water:1;Pestle and mortar:1;Hammer:1;Saw:1;Pickaxe:1;Axe:1;Spade:1
DARKNESS_OF_HALLOWVALE|Steel nails:8;Plank:2;Hammer:1;Knife:1;Air rune:1;Law rune:1
DEVIOUS_MINDS|Mithril 2h sword:1;Bow string:1;Large pouch:1
COLD_WAR|Oak plank:10;Steel nails:10;Hammer:1;Spade:1;Steel bar:1;Plank:1;Silk:1;Raw cod:1;Swamp tar:1;Feather:5;Mahogany plank:1;Leather:1;Cowbells:1
MY_ARMS_BIG_ADVENTURE|Bucket:1;Ugthanki dung:3;Supercompost:7;Spade:1;Rake:1;Seed dibber:1;Plant cure:1;Climbing boots:1
SWAN_SONG|Mist rune:10;Lava rune:10;Blood rune:5;Airtight pot:1;Iron bar:5;Logs:1
EAGLES_PEAK|Yellow dye:1;Swamp tar:1;Coins:50
AT_FIRST_LIGHT|Needle:1
ENAKHRAS_LAMENT|Chisel:1;Bread:1;Tinderbox:1;Lit candle:1;Logs:1;Oak logs:1;Willow logs:1;Maple logs:1;Pickaxe:1
SPIRITS_OF_THE_ELID|Needle:1;Thread:2;Law rune:1;Air rune:1;Knife:1;Rope:1
A_RUFF_SITUATION|Needle:1;Thread:1;Fur:1;Grain:1
CRAB_QUEST|none
RIBBITING_TALE|none
TEARS_OF_GUTHIX|Sapphire lantern:1;Sapphire:1;Tinderbox:1;Chisel:1;Pickaxe:1;Rope:1
RAG_AND_BONE_MAN_I|Coins:8;Pot:8
THE_IDES_OF_MILK|none
TROUBLED_TORTUGANS|none
FALLEN_FROM_GRACE|none
FAIRYTALE_II|Dramen staff:1;Vial of water:1;Pestle and mortar:1
MEAT_AND_GREET|none
A_TAIL_OF_TWO_CATS|Cat or kitten:1;Catspeak amulet:1;Death rune:5;Chocolate cake:1;Logs:1;Tinderbox:1;Bucket of milk:1;Shears:1;Potato seed:4;Rake:1;Seed dibber:1;Vial of water:1;Druid's robe top:1;Druid's robe:1
DEFENDER_OF_VARROCK|Pickaxe:1
MUDFOOTS_BIG_ADVENTURE|none
A_SHELL_OF_A_FRIEND|none
SKIPPY_AND_THE_MOGRES|Bucket of water:1;Nettle tea:1;Hangover cure:1
`;

/* General gear some quests ask you to bring (not counted as items) */
const QUEST_GEAR = {
  TREE_GNOME_VILLAGE:'Combat gear and food', TALE_OF_THE_RIGHTEOUS:'A ranged weapon, a melee weapon and runes',
  A_KINGDOM_DIVIDED:'Normal spellbook and fire spell runes', TWILIGHTS_PROMISE:'Gear for two combat styles, or a poisoned weapon',
  ZOGRE_FLESH_EATERS:'Combat gear', LUNAR_DIPLOMACY:'Combat gear', FALLEN_FROM_GRACE:'Raft or skiff, combat gear and food',
  ENAKHRAS_LAMENT:'Runes for Fire Bolt, Wind Bolt and Crumble Undead (or stronger)', SPIRITS_OF_THE_ELID:'Crush, stab and slash weapons, a light source',
  MA1:'Runes or a powered staff', A_SOULS_BANE:'A weapon', THE_LOST_TRIBE:'A light source', WANTED:'A light source',
  MONKEY_MADNESS_II:'A light source', DRAGON_SLAYER_I:'A magic or ranged weapon', IN_AID_OF_THE_MYREQUE:"Efaritay's aid or silver weaponry, food",
  TAI_BWO_WANNAI_TRIO:'Ranged or magic gear, or a halberd'
};

/* Tools: needed once, not per quest */
const TOOL_ITEMS = new Set(['Hammer','Pickaxe','Spade','Chisel','Knife','Tinderbox','Saw','Needle','Pestle and mortar','Axe','Rake',
  'Seed dibber','Secateurs','Watering can','Gardening trowel','Shears','Ghostspeak amulet','Dramen staff','Climbing boots','Gas mask',
  'Ice gloves','Lobster pot','Small fishing net','Fishing rod','Fly fishing rod','Barbarian rod',"M'speak amulet",'Catspeak amulet',
  'Bullseye lantern','Ring mould','Necklace mould','Cake tin','Iron spit','Glassblowing pipe','Bird snare','Butterfly net','Silver sickle',
  'Smiths gloves (i)','Mourner gear','Excalibur','Lyre','Candle lantern or torch','Sapphire lantern','Desert shirt','Desert robe','Desert boots',
  'Gloves','Leather gloves','Ring of charos','Lockpick','Fishbowl','Steel pickaxe','Steel axe']);
/* Ironman tool upgrade bought before the first Mining / Woodcutting work */
const STEEL_TOOL = {MINING:'Steel pickaxe', WOODCUTTING:'Steel axe'};
const TOOL_PRICE = {'Steel pickaxe':500, 'Steel axe':200};
/* Coin rewards from quests (OSRS Wiki), and the quick coin quests in the order they are used */
const COIN_REWARDS = {ERNEST_THE_CHICKEN:300, X_MARKS_THE_SPOT:200, DORICS_QUEST:180, SHEEP_SHEARER:60, PRINCE_ALI_RESCUE:700, SHEEP_HERDER:3100};
const COIN_QUESTS = ['ERNEST_THE_CHICKEN', 'X_MARKS_THE_SPOT', 'SHEEP_HERDER'];
const COIN_WHY = 'Coins for steel tools';

const QUEST_ITEMS = {};
QUEST_ITEMS_RAW.trim().split('\n').forEach(line => {
  const [id, rest] = line.split('|');
  if(!rest || rest === 'none'){ QUEST_ITEMS[id] = []; return; }
  QUEST_ITEMS[id] = rest.split(';').map(part => {
    const i = part.lastIndexOf(':');
    return {name: part.slice(0, i).trim(), qty: parseInt(part.slice(i + 1), 10) || 1};
  });
});

/* Skilling supplies per training method, keyed "SKILL|method label".
   items: [name, XP per item, from level, to level] (level range optional)
   hourly: [name, amount per hour of training]
   tools: needed once */
const SUPPLIES = {
  'PRAYER|Dragon bones at gilded altar': {items:[['Dragon bones', 252]]},
  'PRAYER|Blessed bone shards': {items:[['Blessed bone shards', 5], ['Jug of sunfire wine', 2000]]},
  'MAGIC|Enchant sapphire jewellery': {items:[['Cosmic rune', 17.5], ['Water rune', 17.5], ['Sapphire ring', 17.5]]},
  'MAGIC|Enchant emerald jewellery': {items:[['Cosmic rune', 37], ['Air rune', 37 / 3], ['Emerald ring', 37]]},
  'MAGIC|Enchant topaz jewellery': {items:[['Cosmic rune', 59], ['Fire rune', 59 / 5], ['Topaz bracelet', 59]]},
  'MAGIC|Tele-alching': {items:[['Nature rune', 120.5], ['Law rune', 120.5], ['Fire rune', 120.5 / 5], ['Air rune', 120.5 / 5], ['Rune arrow (to alch)', 120.5]]},
  'HERBLORE|Attack potions': {items:[['Guam leaf', 25], ['Eye of newt', 25], ['Vial of water', 25]]},
  'HERBLORE|Energy potions': {items:[['Harralander', 67.5], ['Chocolate dust', 67.5], ['Vial of water', 67.5]]},
  'HERBLORE|Prayer potions': {items:[['Ranarr weed', 87.5], ['Snape grass', 87.5], ['Vial of water', 87.5]]},
  'HERBLORE|Super energy potions': {items:[['Avantoe', 117.5], ['Mort myre fungus', 117.5], ['Vial of water', 117.5]]},
  'FISHING|Shrimps and anchovies': {tools:['Small fishing net']},
  'FISHING|Trout and salmon': {items:[['Feather', 60]], tools:['Fly fishing rod']},
  'FISHING|Barbarian fishing': {items:[['Feather', 65]], tools:['Barbarian rod']},
  'COOKING|Regular raw food': {items:[['Raw trout', 70, 15, 25], ['Raw shrimps', 30, 1, 15], ['Raw salmon', 90, 25, 99]]},
  'COOKING|Jugs of wine (GE)': {items:[['Grapes', 200], ['Jug of water', 200]]},
  'FIREMAKING|Normal logs': {items:[['Logs', 40]], tools:['Tinderbox']},
  'FIREMAKING|Oak logs': {items:[['Oak logs', 60]], tools:['Tinderbox']},
  'FIREMAKING|Willow logs': {items:[['Willow logs', 90]], tools:['Tinderbox']},
  'FIREMAKING|Maple and yew logs': {items:[['Maple logs', 135, 45, 60], ['Yew logs', 202.5, 60, 99]], tools:['Tinderbox']},
  'FIREMAKING|Wintertodt': {hourly:[['Food (Wintertodt)', 12]], tools:['Axe', 'Tinderbox', 'Hammer', 'Knife']},
  'CRAFTING|Glassblowing': {items:[['Molten glass', 40]], tools:['Glassblowing pipe']},
  'CRAFTING|Cutting gems': {items:[['Uncut sapphire', 50, 20, 27], ['Uncut emerald', 67.5, 27, 34], ['Uncut ruby', 85, 34, 43], ['Uncut diamond', 107.5, 43, 99]], tools:['Chisel']},
  'FLETCHING|Headless arrows': {items:[['Arrow shaft', 1], ['Feather', 1]]},
  'FLETCHING|Stringing shortbows and longbows': {items:[['Longbow (u)', 10, 10, 20], ['Oak shortbow (u)', 16.5, 20, 25], ['Oak longbow (u)', 25, 25, 35],
    ['Willow shortbow (u)', 33.3, 35, 40], ['Willow longbow (u)', 41.5, 40, 50], ['Bow string', 30]]},
  'FLETCHING|Stringing maple, yew and magic bows': {items:[['Maple shortbow (u)', 50, 50, 55], ['Maple longbow (u)', 58.3, 55, 65], ['Yew shortbow (u)', 67.5, 65, 70],
    ['Yew longbow (u)', 75, 70, 80], ['Magic shortbow (u)', 83.3, 80, 85], ['Magic longbow (u)', 91.5, 85, 99], ['Bow string', 70]]},
  'RUNECRAFT|Air tiaras': {items:[['Tiara', 25], ['Air talisman', 25]]},
  'SMITHING|Anvil smithing (Varrock west)': {items:[['Bronze bar', 12.5, 1, 15], ['Iron bar', 25, 15, 30], ['Steel bar', 37.5, 30, 50],
    ['Mithril bar', 50, 50, 70], ['Adamantite bar', 62.5, 70, 85], ['Runite bar', 75, 85, 99]], tools:['Hammer']},
  "SMITHING|Giant's Foundry": {items:[['Metal bars (steel and mithril, approx.)', 250]], tools:['Hammer']},
  'SMITHING|Steel bars (Blast Furnace)': {items:[['Iron ore', 17.5], ['Coal', 17.5]], hourly:[['Coins (coffer and foreman)', 72000]], tools:['Ice gloves', 'Coal bag']},
  'SMITHING|Gold bars (Blast Furnace)': {items:[['Gold ore', 56.2]], hourly:[['Coins (coffer and foreman)', 72000]], tools:['Goldsmith gauntlets', 'Ice gloves']},
  'CONSTRUCTION|Mahogany Homes': {items:[['Plank', 35, 1, 20], ['Oak plank', 72, 20, 50], ['Teak plank', 108, 50, 70], ['Mahogany plank', 168, 70, 99], ['Steel bar', 2000, 20, 99]], tools:['Hammer', 'Saw']},
  'FARMING|Bagged plants': {items:[['Bagged plant 1', 31.5]], tools:['Rake', 'Spade']},
  'FARMING|Farm runs': {items:[['Seeds and compost (farm runs)', 2500]], tools:['Rake', 'Spade', 'Seed dibber', 'Secateurs']},
  'HUNTER|Crimson swifts (Isle of Souls)': {tools:['Bird snare']},
  'HUNTER|Copper longtails (Isle of Souls)': {tools:['Bird snare']},
  'HUNTER|Ruby harvest and bird snaring (Piscatoris)': {tools:['Bird snare', 'Butterfly net', 'Butterfly jar']},
  'SLAYER|Slayer tasks (point boosting)': {hourly:[['Food and potions (slayer)', 15]]},
  'SLAYER|Slayer tasks': {hourly:[['Food and potions (slayer)', 15]]},
  'SLAYER|Slayer tasks (burst, cannon)': {hourly:[['Cannonballs', 600], ['Food and potions (slayer)', 10]]},
  'THIEVING|Blackjacking': {hourly:[['Jug of wine', 60]], tools:['Blackjack']}
};
/* Gear upgrades worth buying as the plan reaches them */
const TOOL_UPGRADES = {
  WOODCUTTING:[[1,'Bronze axe'],[6,'Steel axe'],[11,'Black axe'],[21,'Mithril axe'],[31,'Adamant axe'],[41,'Rune axe'],[61,'Dragon axe']],
  MINING:[[1,'Bronze pickaxe'],[6,'Steel pickaxe'],[11,'Black pickaxe'],[21,'Mithril pickaxe'],[31,'Adamant pickaxe'],[41,'Rune pickaxe'],[61,'Dragon pickaxe']]
};

/* Quest items the backend's ACQUIRE task can gather on an ironman, with what the account
   needs to gather them itself: [requirements, prerequisite quests]. Supported sources per the
   backend: NPC shops, mining ores and gems (gems need Shilo Village), anvil smithing and bars,
   chopping, molten glass, herbs and potions, jewellery, leather, fletching, cooking shop fish. */
const ACQUIRE_ITEMS = (() => {
  const m = {};
  const add = (names, req, pre) => names.split('|').forEach(n => m[n] = {req:parseKV(req || ''), pre:keyList(pre || '')});
  /* NPC shops */
  add('Hammer|Chisel|Knife|Spade|Pickaxe|Axe|Saw|Needle|Thread|Pestle and mortar|Tinderbox|Rake|Seed dibber|Secateurs|Watering can|Gardening trowel|Shears|Fishing rod|Small fishing net|Lobster pot|Cake tin|Steel pickaxe|Steel axe');
  add('Bucket|Pot|Bowl|Vial|Vial of water|Bucket of water|Jug of water|Rope|Feather|Fishing bait|Eye of newt|Cheese|Silk|Unlit candle|Plant cure');
  add('Air rune|Water rune|Earth rune|Fire rune|Mind rune|Chaos rune|Death rune|Law rune|Nature rune|Cosmic rune|Blood rune');
  add("Beer|Asgarnian ale|Wizard's mind bomb|Vodka|Greenman's ale|Karamjan rum");
  add('Shantay pass|Desert shirt|Desert robe|Desert boots|Bronze med helm|Iron chainbody');
  add('Potato seed|Onion seed|Cabbage seed|Marigold seed');
  /* Mining */
  add('Clay|Copper ore|Tin ore', 'MIN:1');
  add('Iron ore', 'MIN:15');
  add('Coal', 'MIN:30');
  add('Gold ore', 'MIN:40');
  add('Granite', 'MIN:45');
  add('Uncut opal', 'MIN:40', 'SHILO_VILLAGE');
  /* Smelting and anvil smithing */
  add('Bronze bar', 'SMI:1');
  add('Iron bar', 'SMI:15,MIN:15');
  add('Silver bar', 'SMI:20,MIN:20');
  add('Steel bar', 'SMI:30,MIN:30');
  add('Gold bar', 'SMI:40,MIN:40');
  add('Mithril bar', 'SMI:50,MIN:55');
  add('Steel nails', 'SMI:34,MIN:30');
  /* Woodcutting */
  add('Logs', 'WC:1'); add('Oak logs', 'WC:15'); add('Willow logs', 'WC:30');
  add('Maple logs', 'WC:45'); add('Yew logs', 'WC:60'); add('Magic logs', 'WC:75');
  /* Crafting */
  add('Molten glass');
  add('Leather|Hard leather');
  add('Gold ring', 'CRA:5,SMI:40,MIN:40');
  add('Holy symbol', 'CRA:16,SMI:20,MIN:20');
  add('Sapphire amulet', 'CRA:24,SMI:40,MIN:40');
  add('Bow string', 'CRA:10');
  /* Herblore (cleaning herbs and mixing) */
  add('Guam leaf|Guam potion (unf)|Attack potion', 'HER:3', 'DRUIDIC_RITUAL');
  add('Marrentill|Marrentill potion (unf)|Antipoison', 'HER:5', 'DRUIDIC_RITUAL');
  add('Harralander|Harralander potion (unf)', 'HER:21', 'DRUIDIC_RITUAL');
  add('Restore potion', 'HER:22', 'DRUIDIC_RITUAL');
  add('Ranarr potion (unf)|Defence potion', 'HER:30', 'DRUIDIC_RITUAL');
  add('Agility potion(4)', 'HER:34', 'DRUIDIC_RITUAL');
  /* Fletching */
  add('Oak longbow', 'FLE:25'); add('Willow longbow', 'FLE:40');
  /* Cooking (raw fish bought from shops) */
  add('Shrimps', 'COO:1'); add('Cooked trout', 'COO:15'); add('Salmon', 'COO:25');
  add('Tuna', 'COO:30'); add('Bass', 'COO:43'); add('Swordfish', 'COO:45');
  return m;
})();
/* The quest item lists use the wiki's wording; the backend needs the exact in-game item name.
   Generic tools become the bronze tool (skipped when a steel one is already owned), and potions
   become the 3-dose potion that Herblore makes. Checked against the full OSRS item list. */
const ACQUIRE_AS = {
  'Pickaxe':'Bronze pickaxe', 'Axe':'Bronze axe', 'Unlit candle':'Candle', 'Granite':'Granite (5kg)', 'Cooked trout':'Trout',
  'Attack potion':'Attack potion(3)', 'Antipoison':'Antipoison(3)', 'Restore potion':'Restore potion(3)',
  'Defence potion':'Defence potion(3)', 'Agility potion(4)':'Agility potion(3)'
};
/* a generic tool counts as owned once this better version is */
const GENERIC_TOOL = {'Pickaxe':'Steel pickaxe', 'Axe':'Steel axe'};
const cleanName = name => name.replace(/['\u2019]/g, '').trim().replace(/\s+/g, ' ');
/* Backend item name format: exact item name, apostrophes dropped, spaces kept (Axeman's folly -> Axemans folly) */
function acquireName(name){ return cleanName(ACQUIRE_AS[name] || name); }
/* Lists saved before the item names were fixed: rewrite e.g. ACQUIRE:Pickaxe,1-1 to ACQUIRE:Bronze pickaxe,1-1 */
function fixAcquireRaw(raw){
  if(!/^ACQUIRE:/i.test(raw)) return raw;
  return raw.slice(0, 8) + raw.slice(8).split('&').map(part => {
    const i = part.indexOf(',');
    const n = (i < 0 ? part : part.slice(0, i)).trim();
    const old = Object.keys(ACQUIRE_AS).find(k => cleanName(k).toLowerCase() === n.toLowerCase());
    return old ? acquireName(old) + (i < 0 ? '' : part.slice(i)) : part;
  }).join('&');
}
/* Magic logs come from Wintertodt reward carts with only 50 Woodcutting (10-20 per logs roll),
   25 levels before an ironman could chop them. Ironmen take Wintertodt to 75 Firemaking (a quest
   cape requirement anyway), which should give enough reward rolls for the logs. */
ACQUIRE_ITEMS['Magic logs'].wt = {req:parseKV('WC:50,FM:75'), label:'Wintertodt to 75 Firemaking'};
function meetsReq(req, S){ for(const [s, v] of Object.entries(req)) if(lvl(S, s) < v) return false; return true; }
/* Use Wintertodt for this item instead of chopping? */
function viaWintertodt(name, S, o){
  const d = ACQUIRE_ITEMS[name];
  return !!(d && d.wt && o.wintertodt && !meetsReq(d.req, S));
}
function canAcquire(name, S){
  const d = ACQUIRE_ITEMS[name];
  if(!d) return false;
  for(const [s, v] of Object.entries(d.req)) if(lvl(S, s) < v) return false;
  return d.pre.every(k => S.done.has(k));
}
const ACQUIRE_WHY = 'Gather for ';
/* items per inventory when training uses them: the tool takes a slot (27 logs + tinderbox), cooking
   needs none, two-item recipes use half */
const INV_UNIT = {FIREMAKING:27, SMITHING:27, CRAFTING:27, MAGIC:27, COOKING:28, HERBLORE:14, FLETCHING:14};
/* XP an ironman earns gathering an item itself: [skill, XP each] */
const GATHER_XP = {
  'Logs':['WOODCUTTING',25], 'Oak logs':['WOODCUTTING',37.5], 'Willow logs':['WOODCUTTING',67.5], 'Maple logs':['WOODCUTTING',100],
  'Yew logs':['WOODCUTTING',175], 'Magic logs':['WOODCUTTING',250],
  'Clay':['MINING',5], 'Copper ore':['MINING',17.5], 'Tin ore':['MINING',17.5], 'Iron ore':['MINING',35], 'Coal':['MINING',50],
  'Gold ore':['MINING',65], 'Granite':['MINING',50],
  'Bronze bar':['SMITHING',6.2], 'Iron bar':['SMITHING',12.5], 'Silver bar':['SMITHING',13.7], 'Steel bar':['SMITHING',17.5],
  'Gold bar':['SMITHING',22.5], 'Mithril bar':['SMITHING',30]
};
/* Apply an ACQUIRE:Item,min-max(&...) task the way the backend runs it: it only triggers when the
   bank holds less than min, then gathers up to max. Stock is tracked so XP is only counted for what
   is actually gathered. */
function acquireXp(S, raw){
  if(!S.items) S.items = {};
  raw.slice(8).split('&').forEach(part => {
    const m = part.match(/^(.*),\s*(\d+)\s*(?:-\s*(\d+))?$/);
    if(!m) return;
    const id = m[1].trim().toLowerCase();
    const min = parseInt(m[2], 10) || 0, max = Math.max(min, parseInt(m[3] || m[2], 10) || 0);
    const have = S.items[id] || 0;
    if(have >= min) return;   /* enough banked: the task does nothing */
    S.items[id] = max;
    const name = Object.keys(GATHER_XP).find(k => acquireName(k).toLowerCase() === id);
    if(!name) return;
    const [s, x] = GATHER_XP[name];
    S.xp[s] += (max - have) * x;
  });
}
/* A quest uses up its items (tools are kept) */
function consumeQuestItems(S, entry){
  if(!S.items) return;
  for(const it of (QUEST_ITEMS[entry.id] || [])){
    if(it.name === 'Coins' || TOOL_ITEMS.has(it.name)) continue;
    const id = acquireName(it.name).toLowerCase();
    if(S.items[id]) S.items[id] = Math.max(0, S.items[id] - it.qty);
  }
}
/* Training a skill that uses supplies uses up banked ones: gain / XP-each of them. Items worth the
   same XP each are used together (herb + secondary + vial); otherwise the best go first (willow logs
   before leftover oak logs), the way the bot picks them. */
let CONSUMES = null;
function consumesMap(){
  if(!CONSUMES){
    CONSUMES = {};
    const put = (sk, n, x) => { const m = CONSUMES[sk] = CONSUMES[sk] || {}; const id = acquireName(n).toLowerCase(); m[id] = Math.max(m[id] || 0, x); };
    for(const [k, def] of Object.entries(SUPPLIES)) (def.items || []).forEach(([n, per]) => put(k.split('|')[0], n, per));
    FM_LOGS.forEach(l => put('FIREMAKING', l[0], l[3]));
  }
  return CONSUMES;
}
function consumesItem(skill, id){ const m = consumesMap()[skill]; return !!(m && m[id]); }
function consumeTraining(S, skill, gain){
  if(!S.items || !(gain > 0)) return;
  const m = consumesMap()[skill] || {};
  const groups = new Map();
  Object.keys(S.items).filter(id => m[id] && S.items[id] > 0).forEach(id => { const x = m[id]; groups.set(x, (groups.get(x) || []).concat([id])); });
  let left = gain;
  for(const x of [...groups.keys()].sort((a, b) => b - a)){
    if(left <= 0) break;
    const ids = groups.get(x);
    const use = Math.min(Math.ceil(left / x), ...ids.map(id => S.items[id]));
    ids.forEach(id => { S.items[id] -= use; });
    left -= use * x;
  }
}
/* Firemaking logs: [name, Firemaking level, Woodcutting level, Firemaking XP each] */
const FM_LOGS = [['Logs',1,1,40], ['Oak logs',15,15,60], ['Willow logs',30,30,90], ['Maple logs',45,45,135], ['Yew logs',60,60,202.5], ['Magic logs',75,75,303.8]];
/* Supplies an ironman gathers for a plain SKILL training task: [{name, qty}].
   Firemaking uses the best log the account can both burn and chop at each point, crediting the
   Woodcutting XP from chopping as it goes. Other skills use the method's supplies that ACQUIRE can gather. */
function trainingSupplies(S, p, o, bridge){
  const T = cloneState(S);
  const startXp = T.xp[p.skill];
  if(xpFor(p.level) <= startXp) return [];
  const need = new Map();
  const add = (n, q) => need.set(n, (need.get(n) || 0) + q);
  for(let l = lvlOf(startXp); l < p.level; l++){
    const lo = Math.max(startXp, XP[l]), hi = XP[l + 1];
    if(hi <= lo) continue;
    const gain = hi - lo;
    const m = bestMethod(p.skill, l, T, o, false, true);
    if(!m || !m.gp) continue;   /* gp-free methods need nothing gathered */
    if(p.skill === 'FIREMAKING'){
      const log = FM_LOGS.filter(([, fl, wl]) => fl <= l && wl <= lvl(T, 'WOODCUTTING')).pop();
      const q = gain / log[3];
      add(log[0], q);
      T.xp.WOODCUTTING += q * GATHER_XP[log[0]][1];
      continue;
    }
    const def = SUPPLIES[p.skill + '|' + m.label];
    if(!def) continue;
    (def.items || []).forEach(([n, per, a, b]) => {
      if(a !== undefined && !(l >= a && l < (b || 99))) return;
      if(canAcquire(n, T)) add(n, gain / per);
    });
  }
  /* Firemaking reaching a better log's level: if Woodcutting is still short of chopping it, chop a
     few extra of the current log so the next task can switch straight away (logs to 15 Woodcutting
     for oaks at 15, not normal logs up to 30). Only when more Firemaking training follows. */
  let br = null;
  if(p.skill === 'FIREMAKING' && bridge){
    const wc = lvl(T, 'WOODCUTTING');
    const cur = FM_LOGS.filter(([, fl, wl]) => fl < p.level && wl <= wc).pop();
    const next = FM_LOGS.filter(([, fl]) => fl <= p.level).pop();
    if(cur && next && next !== cur && next[2] > wc && need.has(cur[0])){
      const extra = Math.ceil((xpFor(next[2]) - T.xp.WOODCUTTING) / GATHER_XP[cur[0]][1]);
      add(cur[0], extra);
      br = {name:cur[0], extra, wc:next[2], log:next[0]};
    }
  }
  return [...need.entries()].map(([name, q]) => ({name, qty:Math.ceil(q), bridge:br && br.name === name ? br : null})).filter(x => x.qty > 0);
}
/* Skill levels an ironman still needs to gather this quest's items itself (ACQUIRE), e.g. 15 Mining
   for Doric's Quest's iron ore. Items behind an unfinished quest (gems need Shilo Village) are left
   to the quest. If the training would take longer than o.gatherMaxMin (default 5h), nothing is
   returned and the quest handles its own items. */
function gatherNeeds(e, S, o){
  if(!o.gatherReqs || !e || e.type !== 'QUEST' || S.done.has(e.key)) return [];
  const need = {}, item = {};
  let viaWt = false;
  for(const it of (QUEST_ITEMS[e.id] || [])){
    const d = ACQUIRE_ITEMS[it.name];
    if(!d || !d.pre.every(k => S.done.has(k))) continue;
    const wt = viaWintertodt(it.name, S, o);
    let req = wt ? d.wt.req : d.req;
    /* Wintertodt route: get 50 Woodcutting first so every game after it can roll magic logs */
    if(wt && lvl(S, 'WOODCUTTING') < (d.wt.req.WOODCUTTING || 0)) req = {WOODCUTTING:d.wt.req.WOODCUTTING};
    for(const [s, v] of Object.entries(req)) if(lvl(S, s) < v && v > (need[s] || 0)){
      need[s] = v; item[s] = wt ? `${it.name} (${d.wt.label})` : it.name; if(wt) viaWt = true;
    }
  }
  if(o.defPure) delete need.DEFENCE;
  const skills = Object.keys(need);
  if(!skills.length) return [];
  let t = 0;
  for(const s of skills){ const m = reqTrainMinutes(S, s, need[s], o); if(!isFinite(m)) return []; t += m; }
  /* the Wintertodt route is wanted anyway (quest cape Firemaking), so it is not capped */
  if(!viaWt && t > (o.gatherMaxMin || 300)) return [];
  return skills.map(s => ({t:'skill', skill:s, need:need[s], have:lvl(S, s), gather:item[s]}));
}
/* Ironman: put an ACQUIRE task for each gatherable quest item right before its quest.
   min = max = the amount the quest needs, so the bot only gathers what is missing.
   Tools are gathered once. Runs again from scratch each time (earlier auto tasks are removed). */
function addAcquires(list, start, o){
  const base = list.filter(t => !((t.raw.toUpperCase().startsWith('ACQUIRE:') || t.raw.toUpperCase().startsWith('MINIGAME:WINTERTODT:')) && (t.why || '').startsWith(ACQUIRE_WHY)));
  if(o.mode !== 'iron') return base;
  const S = cloneState(start);
  const out = [];
  const gotTool = new Set();
  const userAcq = new Set(base.filter(t => t.raw.toUpperCase().startsWith('ACQUIRE:')).map(t => t.raw.toUpperCase()));
  let wtWithWc = false;   /* Wintertodt already played at 50+ Woodcutting (reward carts can give magic logs) */
  /* ---- Coins and steel tools ----
     Steel tools are the best value upgrade for an ironman (usable at 6). Coins are tracked through the
     list: a fresh account starts with 25, the iron starter leaves plenty, quests pay their rewards.
     When a tool is due and coins are short, quick coin quests go first: Ernest the Chicken (300, Draynor)
     and X Marks the Spot (200, Lumbridge), then Sheep Herder (3,100, needs 100 coins up front). */
  let coins = o.startCoins === undefined ? 25 : o.startCoins;
  const coinKeys = new Set(base.filter(t => (t.why || '').startsWith(COIN_WHY)).map(t => parseRaw(t.raw).key));
  /* the same item for the next few quests in the list, so one gathering trip covers them; stops at
     training that would use the item up. Kept to the next LATER_QUESTS quests so an early account is
     not sent to buy or gather for the whole quest list at once. */
  const LATER_QUESTS = 10;
  const laterNeed = (name, from) => {
    const id = acquireName(name).toLowerCase();
    const seenQ = new Set();
    let n = 0;
    for(let j = from; j < base.length; j++){
      const q = parseRaw(base[j].raw);
      if(q.kind === 'SKILL' && q.skill && consumesItem(q.skill, id)) break;
      if(q.kind !== 'QUEST' || !q.entry || S.done.has(q.key) || seenQ.has(q.key)) continue;
      if(seenQ.size >= LATER_QUESTS) break;
      seenQ.add(q.key);
      for(const it of (QUEST_ITEMS[q.entry.id] || [])) if(it.name === name) n += it.qty;
    }
    return n;
  };
  let pos = 0;   /* index in base of the task being placed */
  const stock = name => (S.items || {})[acquireName(name).toLowerCase()] || 0;
  const questGather = (p, prefix) => {
    for(const it of (QUEST_ITEMS[p.entry.id] || [])){
      if(it.name === 'Coins') continue;
      if(!canAcquire(it.name, S)){
        /* Magic logs below 75 Woodcutting: a Wintertodt session right before the quest */
        if(viaWintertodt(it.name, S, o) && !wtWithWc && lvl(S, 'WOODCUTTING') >= 50 && lvl(S, 'FIREMAKING') >= 50 && lvl(S, 'FIREMAKING') < 99){
          const cur = lvl(S, 'FIREMAKING');
          let target = cur + 1;
          while(target < 99 && trainMinutes(S, 'FIREMAKING', target, o, 'WT') < 50) target++;
          const raw = `MINIGAME:WINTERTODT:${target}`;
          out.push({raw, why:`${ACQUIRE_WHY}${p.entry.name}: ${it.qty} ${it.name} from Wintertodt rewards (needs 50 Woodcutting, drops are random)`});
          applyTask(S, parseRaw(raw));
          wtWithWc = true;
        }
        continue;
      }
      const tool = TOOL_ITEMS.has(it.name);
      if(tool && (gotTool.has(it.name) || gotTool.has(GENERIC_TOOL[it.name]))) continue;
      const q = tool ? 1 : it.qty;
      if(!tool && ((S.items || {})[acquireName(it.name).toLowerCase()] || 0) >= q) continue;   /* stocked by an earlier gather */
      const later = tool ? 0 : laterNeed(it.name, pos + 1);
      /* min sits just above what is banked, so the task fires now and never again: max leaves exactly
         min in the bank once the quests have used theirs */
      const min = tool ? 1 : stock(it.name) + 1, max = tool ? 1 : min + q + later;
      const raw = `ACQUIRE:${acquireName(it.name)},${min}-${max}`;
      if(userAcq.has(raw.toUpperCase())) continue;
      pushGather(raw, `${ACQUIRE_WHY}${p.entry.name}${tool ? '' : `: ${q} needed${later ? `, ${later} more for later quests` : ''}, ${min} kept so it does not trigger again`}`);
      if(tool) gotTool.add(it.name);
    }
  };
  /* Doing a quest: pay its coin costs, gather its items, collect its coin reward */
  const doQuest = (t, p) => {
    const cost = (QUEST_ITEMS[p.entry.id] || []).filter(it => it.name === 'Coins').reduce((a, it) => a + it.qty, 0);
    questGather(p);
    out.push(t);
    applyTask(S, p);
    coins += (COIN_REWARDS[p.entry.id] || 0) - cost;
  };
  const earnCoins = need => {
    for(const id of COIN_QUESTS){
      if(coins >= need) return;
      const key = 'QUEST:' + id;
      if(S.done.has(key) || o.defPure && pureBlocked(key, S)) continue;
      const cost = (QUEST_ITEMS[id] || []).filter(it => it.name === 'Coins').reduce((a, it) => a + it.qty, 0);
      if(coins < cost) continue;
      coinKeys.add(key);
      doQuest({raw:key, why:`${COIN_WHY} (${COIN_REWARDS[id].toLocaleString()} coin reward)`}, parseRaw(key));
    }
  };
  const ensureSteel = skill => {
    const tool = STEEL_TOOL[skill];
    if(!tool || gotTool.has(tool)) return;
    gotTool.add(tool);
    if(userAcq.has(`ACQUIRE:${acquireName(tool).toUpperCase()},1-1`)) return;
    const price = TOOL_PRICE[tool];
    if(coins < price) earnCoins(price);
    if(coins < price) return;   /* no way to pay yet: the bot keeps its current tool */
    out.push({raw:`ACQUIRE:${acquireName(tool)},1-1`, why:`${ACQUIRE_WHY}${SKILL_LABEL(skill)}: ${tool.toLowerCase()} (${price} coins, best value tool on an ironman)`});
    coins -= price;
  };
  /* Mining or Woodcutting work coming up (training, Motherlode Mine, or gathering ores and logs) */
  const gatherSkillOf = raw => {
    const m = raw.slice(8).split('&')[0].match(/^(.*),\s*\d+(?:\s*-\s*(\d+))?$/);
    if(!m) return null;
    const name = Object.keys(GATHER_XP).find(k => acquireName(k).toLowerCase() === m[1].trim().toLowerCase());
    const sk = name && GATHER_XP[name][0];
    return sk && STEEL_TOOL[sk] ? sk : null;
  };
  const pushGather = (raw, why) => {
    const sk = gatherSkillOf(raw);
    if(sk) ensureSteel(sk);
    out.push({raw, why});
    applyTask(S, parseRaw(raw));
  };
  for(const t of base){
    pos = base.indexOf(t);
    const p = parseRaw(t.raw);
    /* a coin quest pulled earlier: skip its later copy */
    if(p.kind === 'QUEST' && coinKeys.has(p.key) && S.done.has(p.key) && !(t.why || '').startsWith(COIN_WHY)) continue;
    if(p.kind === 'STARTER' && !S.done.has('IRON_STARTER_PART1')) coins += 50000;
    if(p.skill && p.level && STEEL_TOOL[p.skill] && (p.kind === 'SKILL' || p.kind === 'ACTIVITY') && lvl(S, p.skill) < p.level) ensureSteel(p.skill);
    if(p.methodId === 'WT' && lvl(S, 'WOODCUTTING') >= 50 && lvl(S, 'FIREMAKING') < (p.level || 0)) wtWithWc = true;
    if(p.kind === 'QUEST' && p.key === 'QUEST:SHEEP_HERDER' && !S.done.has(p.key) && coins < 100) earnCoins(100);
    if(p.kind === 'QUEST' && p.entry && !S.done.has(p.key)){ doQuest(t, p); continue; }
    /* ironman training that burns or uses supplies: gather them right before the task */
    if(p.kind === 'SKILL' && p.skill && p.level && lvl(S, p.skill) < p.level){
      const moreSame = base.slice(pos + 1).some(t => { const q = parseRaw(t.raw); return q.kind === 'SKILL' && q.skill === p.skill; });
      for(const it of trainingSupplies(S, p, o, moreSame)){
        const have = stock(it.name);
        if(have >= it.qty) continue;   /* stocked by an earlier gather */
        /* One gather per goal level. The bot withdraws whole inventories (27 logs + tinderbox), so the
           bank drops by full inventories: max = min + the amount to burn rounded up to inventories
           (+ any extra chopped for Woodcutting), which leaves at least min banked once the goal level
           is reached, so the task never re-triggers. */
        const extra = it.bridge ? it.bridge.extra : 0, use = it.qty - extra;
        const unit = INV_UNIT[p.skill] || 27, inv = Math.ceil(use / unit);
        const min = have + 1, max = min + inv * unit + extra;
        pushGather(`ACQUIRE:${acquireName(it.name)},${min}-${max}`,
          `${ACQUIRE_WHY}${SKILL_LABEL(p.skill)} ${p.level}: ${use} to use = ${inv} inventor${inv === 1 ? 'y' : 'ies'} of ${unit}`
          + (extra ? `, +${extra} so Woodcutting reaches ${it.bridge.wc} for ${it.bridge.log.toLowerCase()}` : '')
          + `, ${min} kept so it does not trigger again`);
      }
    }
    out.push(t);
    applyTask(S, p);
  }
  return out;
}
