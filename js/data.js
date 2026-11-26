/* ==========================================================================
   OSRS Account Builder - game data
   Quest requirements: OSRS Wiki "Quests/Requirements by skill" merged with the
   backend's own stated requirements (whichever is higher wins).
   Quest XP rewards: OSRS Wiki "Quest experience rewards".
   Quest order: OSRS Wiki "Optimal quest guide" and "Optimal quest guide/Ironman".
   ========================================================================== */
'use strict';

const SKILLS = ['ATTACK','HITPOINTS','MINING','STRENGTH','AGILITY','SMITHING','DEFENCE','HERBLORE','FISHING',
  'RANGED','THIEVING','COOKING','PRAYER','CRAFTING','FIREMAKING','MAGIC','FLETCHING','WOODCUTTING',
  'RUNECRAFT','SLAYER','FARMING','CONSTRUCTION','HUNTER','SAILING'];

const SHORT = {ATT:'ATTACK',STR:'STRENGTH',DEF:'DEFENCE',RNG:'RANGED',PRA:'PRAYER',MAG:'MAGIC',RC:'RUNECRAFT',
  CON:'CONSTRUCTION',HP:'HITPOINTS',AGI:'AGILITY',HER:'HERBLORE',THI:'THIEVING',CRA:'CRAFTING',FLE:'FLETCHING',
  SLA:'SLAYER',HUN:'HUNTER',MIN:'MINING',SMI:'SMITHING',FIS:'FISHING',COO:'COOKING',FM:'FIREMAKING',
  WC:'WOODCUTTING',FAR:'FARMING',SAI:'SAILING'};

const SKILL_ALIASES = {ATT:'ATTACK',ATTACK:'ATTACK',STR:'STRENGTH',STRENGTH:'STRENGTH',DEF:'DEFENCE',DEFENCE:'DEFENCE',
  DEFENSE:'DEFENCE',RANGE:'RANGED',RANGED:'RANGED',RANG:'RANGED',PRAY:'PRAYER',PRAYER:'PRAYER',MAGE:'MAGIC',MAGIC:'MAGIC',
  RC:'RUNECRAFT',RUNECRAFT:'RUNECRAFT',RUNECRAFTING:'RUNECRAFT',CON:'CONSTRUCTION',CONSTRUCTION:'CONSTRUCTION',
  HP:'HITPOINTS',HITPOINTS:'HITPOINTS',AGI:'AGILITY',AGILITY:'AGILITY',HERB:'HERBLORE',HERBLORE:'HERBLORE',
  THIEF:'THIEVING',THIEV:'THIEVING',THIEVING:'THIEVING',CRAFT:'CRAFTING',CRAFTING:'CRAFTING',FLETCH:'FLETCHING',
  FLETCHING:'FLETCHING',SLAY:'SLAYER',SLAYER:'SLAYER',HUNT:'HUNTER',HUNTER:'HUNTER',MINE:'MINING',MINING:'MINING',
  SMITH:'SMITHING',SMITHING:'SMITHING',FISH:'FISHING',FISHING:'FISHING',COOK:'COOKING',COOKING:'COOKING',
  FM:'FIREMAKING',FIREMAKING:'FIREMAKING',WC:'WOODCUTTING',WOODCUTTING:'WOODCUTTING',FARM:'FARMING',FARMING:'FARMING',
  SAIL:'SAILING',SAILING:'SAILING'};

const COMBAT_TRAIN = new Set(['ATTACK','STRENGTH','DEFENCE','RANGED']);

/* Estimated minutes per quest length (bot time incl. travel/banking). Ironman multiplier applied elsewhere. */
const LEN_MIN = {s:15, n:15, i:30, e:50, m:75, g:110};

/* ---------------- Database ---------------- */
const DB = {};
function parseKV(str){
  const o = {};
  if(!str) return o;
  str.split(',').forEach(p => {
    const [k,v] = p.split(':');
    if(!k) return;
    o[SHORT[k] || k] = parseFloat(v);
  });
  return o;
}
function normKey(k){ return k.includes(':') ? k : 'QUEST:' + k; }
function keyList(str){ return str ? str.split(',').map(s => normKey(s.trim())).filter(Boolean) : []; }

function q(id, name, qp, len, req, pre, xp, ex){
  ex = ex || {};
  const key = 'QUEST:' + id;
  DB[key] = {key, id, type:'QUEST', name, qp, len, raw:key,
    req:parseKV(req), pre:keyList(pre), xp:parseKV(xp),
    rec:parseKV(ex.rec), ireq:parseKV(ex.ireq), irec:parseKV(ex.irec),
    any: ex.any ? [ex.any[0], ex.any[1].map(normKey)] : null,
    partner:!!ex.partner, mini:!!ex.mini, noIron:!!ex.noIron, series:ex.series || '', note:ex.note || '', lamp:ex.lamp || '',
    /* XP lamps: [xp, count, allowed skills (null = any), minimum level in that skill] */
    lamps:(ex.lamps || []).map(l => ({xp:l[0], n:l[1], skills:l[2] ? l[2].split(',').map(k => SHORT[k] || k) : null, min:l[3] || 1}))};
}
function d(id, name, req, pre, len, ex){
  ex = ex || {};
  const key = 'DIARY:' + id;
  DB[key] = {key, id, type:'DIARY', name, qp:0, len:len || 'i', raw:key, req:parseKV(req), pre:keyList(pre), xp:{},
    rec:{}, ireq:{}, irec:{}, any: ex.any ? [ex.any[0], ex.any[1].map(normKey)] : null, note:ex.note || '', approx:!!ex.approx};
}
function ms(id, name, req, pre, len, ex){
  ex = ex || {};
  const key = 'MILESTONE:' + id;
  DB[key] = {key, id, type:'MILESTONE', name, qp:0, len:len || 'e', raw:key, req:parseKV(req), pre:keyList(pre), xp:{},
    rec:{}, ireq:{}, irec:{}, any:null, note:ex.note || ''};
}
function act(key, name, ex){
  ex = ex || {};
  DB[key] = {key, id:key, type:'ACTIVITY', name, qp:0, len:'n', raw:key, req:parseKV(ex.req), pre:keyList(ex.pre), xp:{},
    rec:{}, ireq:{}, irec:{}, any:null, note:ex.note || '', skill:ex.skill || null, method:ex.method || null,
    param:ex.param || null, options:ex.options || null, example:ex.example || '', group:ex.group || 'Minigames',
    defaultParam:ex.defaultParam || '', background:!!ex.background};
}

const KUDOS = 'SHIELD_OF_ARRAV,DEMON_SLAYER,HAZEEL_CULT,MERLINS_CRYSTAL,MAKING_HISTORY,PRIEST_IN_PERIL,THE_GRAND_TREE,HOLY_GRAIL,OBSERVATORY_QUEST,RAG_AND_BONE_MAN_I,TREE_GNOME_VILLAGE,WHAT_LIES_BELOW,THE_GOLEM'.split(',');

/* id, name, qp, length, requirements, prerequisite quests, xp rewards, extras */
q('COOKS_ASSISTANT',"Cook's Assistant",1,'n','','','COO:300');
q('DORICS_QUEST',"Doric's Quest",1,'n','','','MIN:1300');
q('DRUIDIC_RITUAL','Druidic Ritual',4,'n','','','HER:250');
q('IMP_CATCHER','Imp Catcher',1,'n','','','MAG:875',{noIron:1,note:'Imp beads only drop from imps, which ACQUIRE cannot gather: not planned on ironmen'});
q('DWARF_CANNON','Dwarf Cannon',1,'i','','','CRA:750');
q('NATURAL_HISTORY_QUIZ','Natural History Quiz',0,'s','','','HUN:1000,SLA:1000',{mini:1});
q('ROMEO_AND_JULIET','Romeo & Juliet',5,'n','','','');
q('SEA_SLUG','Sea Slug',1,'i','FM:30','','FIS:7175');
q('SHEEP_SHEARER','Sheep Shearer',1,'n','','','CRA:150');
q('THE_FEUD','The Feud',1,'i','THI:30,HP:15,MAG:35','','THI:15000');
q('WITCHS_HOUSE',"Witch's House",4,'i','MAG:9','','HP:6325');
q('WITCHS_POTION',"Witch's Potion",1,'n','','','MAG:325');
q('BLACK_KNIGHTS_FORTRESS',"Black Knights' Fortress",3,'n','QP:12','','');
q('GERTRUDES_CAT',"Gertrude's Cat",1,'n','','','COO:1525');
q('HORROR_FROM_THE_DEEP','Horror from the Deep',2,'e','AGI:35,MAG:35','BARCRAWL','MAG:4662,RNG:4662,STR:4662');
q('ELEMENTAL_WORKSHOP_I','Elemental Workshop I',1,'n','MIN:20,SMI:20,CRA:20','','CRA:5000,SMI:5000');
q('DEATH_PLATEAU','Death Plateau',1,'i','','','ATT:3000');
q('TROLL_STRONGHOLD','Troll Stronghold',1,'e','AGI:15,PRA:43,MAG:30','DEATH_PLATEAU','AGI:2000');
q('X_MARKS_THE_SPOT','X Marks the Spot',1,'n','','','',{lamp:'300 XP lamp',lamps:[[300,1]]});
q('BARCRAWL',"Alfred Grimhand's Barcrawl",0,'s','','','',{mini:1});
q('CLIENT_OF_KOUREND','Client of Kourend',1,'n','','X_MARKS_THE_SPOT','',{lamp:'2 x 500 XP lamps',lamps:[[500,2]]});
q('THE_RESTLESS_GHOST','The Restless Ghost',1,'n','','','PRA:1125');
q('RUNE_MYSTERIES','Rune Mysteries',1,'n','','','RC:500');
q('VAMPYRE_SLAYER','Vampyre Slayer',3,'n','MAG:9','','ATT:4825');
q('WATERFALL_QUEST','Waterfall Quest',1,'i','HP:20','','ATT:13750,STR:13750',{note:'43 Prayer or 20+ Hitpoints; 20 Hitpoints is planned'});
q('PLAGUE_CITY','Plague City',1,'n','','','MIN:2425');
q('BIOHAZARD','Biohazard',3,'n','MAG:9','PLAGUE_CITY','THI:1250');
q('THE_KNIGHTS_SWORD',"The Knight's Sword",1,'i','MIN:10','','SMI:12725');
q('ERNEST_THE_CHICKEN','Ernest the Chicken',4,'n','','','');
q('MONKS_FRIEND',"Monk's Friend",1,'n','','','WC:2000');
q('FIGHT_ARENA','Fight Arena',2,'e','MAG:9,HP:20','','ATT:12175,THI:2175');
q('TREE_GNOME_VILLAGE','Tree Gnome Village',2,'i','MAG:9,HP:20','','ATT:11450');
q('PRIEST_IN_PERIL','Priest in Peril',1,'i','HP:20','','PRA:1406');
q('NATURE_SPIRIT','Nature Spirit',2,'n','MAG:35,HP:20','PRIEST_IN_PERIL,THE_RESTLESS_GHOST','CRA:3000,DEF:2000,HP:2000',{rec:'PRA:43'});
q('RFD_COOK',"RFD: Another Cook's Quest",1,'n','COO:10','COOKS_ASSISTANT','',{series:'RFD'});
q('RFD_DWARF','RFD: Freeing the Mountain Dwarf',1,'n','','RFD_COOK,FISHING_CONTEST,COOKS_ASSISTANT','COO:1000,SLA:1000',{series:'RFD'});
q('FISHING_CONTEST','Fishing Contest',1,'n','FIS:10','','FIS:2437');
q('A_PORCINE_OF_INTEREST','A Porcine of Interest',1,'n','','','SLA:1000',{rec:'MAG:35,HP:20'});
q('ANIMAL_MAGNETISM','Animal Magnetism',1,'i','SLA:18,CRA:19,RNG:30,WC:35','THE_RESTLESS_GHOST,ERNEST_THE_CHICKEN,PRIEST_IN_PERIL','CRA:1000,FLE:1000,SLA:1000,WC:2500');
q('MERLINS_CRYSTAL',"Merlin's Crystal",6,'i','MAG:35,HP:20','','FM:1000');
q('HOLY_GRAIL','Holy Grail',2,'i','ATT:20,MAG:35,HP:20','MERLINS_CRYSTAL','DEF:15300,PRA:11000');
q('DRAGON_SLAYER_I','Dragon Slayer I',2,'e','QP:32,MAG:41','','DEF:18650,STR:18650',{rec:'PRA:43'});
q('LOST_CITY','Lost City',3,'e','CRA:31,WC:36,MAG:39','','CRA:1500,WC:1500');
q('WHAT_LIES_BELOW','What Lies Below',1,'i','RC:35,MAG:35,HP:20,MIN:42','RUNE_MYSTERIES','DEF:2000,RC:8000');
q('THE_DIG_SITE','The Dig Site',2,'i','AGI:10,HER:10,THI:25','DRUIDIC_RITUAL','HER:2000,MIN:15300');
q('THE_GRAND_TREE','The Grand Tree',5,'e','AGI:25,MAG:13','TREE_GNOME_VILLAGE','AGI:7900,ATT:18400,MAG:2150');
q('GOBLIN_DIPLOMACY','Goblin Diplomacy',5,'n','','','CRA:200');
q('RFD_GOBLINS','RFD: Freeing the Goblin Generals',1,'n','','RFD_COOK,GOBLIN_DIPLOMACY','COO:1000,CRA:1000,FAR:1000',{series:'RFD'});
q('FAIRYTALE_I','Fairytale I - Growing Pains',2,'e','','LOST_CITY,NATURE_SPIRIT,JUNGLE_POTION','ATT:2000,FAR:3500,MAG:1000',{rec:'PRA:43'});
q('BONE_VOYAGE','Bone Voyage',1,'i','','THE_DIG_SITE,NATURAL_HISTORY_QUIZ','',{any:[5,KUDOS],note:'Needs 100 kudos: museum finds plus kudos quests'});
q('JUNGLE_POTION','Jungle Potion',1,'n','HER:3','DRUIDIC_RITUAL','HER:775');
q('THE_ASCENT_OF_ARCEUUS','The Ascent of Arceuus',1,'i','HUN:12,MAG:39','CLIENT_OF_KOUREND','HUN:1500,RC:500');
q('SHILO_VILLAGE','Shilo Village',2,'e','CRA:20,AGI:32','JUNGLE_POTION','CRA:3875');
q('ONE_SMALL_FAVOUR','One Small Favour',2,'e','AGI:36,CRA:25,HER:18,SMI:30','SHILO_VILLAGE,RUNE_MYSTERIES,DRUIDIC_RITUAL','',{lamp:'2 x 10,000 XP lamps',lamps:[[10000,2,null,30]]});
q('MURDER_MYSTERY','Murder Mystery',3,'n','','','CRA:1406');
q('KINGS_RANSOM',"King's Ransom",1,'e','DEF:65,MAG:45','BLACK_KNIGHTS_FORTRESS,HOLY_GRAIL,MURDER_MYSTERY,ONE_SMALL_FAVOUR','DEF:33000,MAG:5000');
q('THE_TOURIST_TRAP','The Tourist Trap',2,'i','FLE:10,SMI:20','','',{lamp:'2 x 4,650 XP lamps (Agility, Fletching, Smithing or Thieving)',lamps:[[4650,2,'AGI,FLE,SMI,THI']]});
q('TEMPLE_OF_IKOV','Temple of Ikov',1,'e','THI:42,RNG:40,PRA:43','','FLE:8000,RNG:10500');
q('DESERT_TREASURE_I','Desert Treasure I',3,'m','MAG:62,FM:50,SLA:10,THI:53,PRA:43,HP:28','THE_DIG_SITE,TEMPLE_OF_IKOV,THE_TOURIST_TRAP,TROLL_STRONGHOLD,PRIEST_IN_PERIL,WATERFALL_QUEST','MAG:20000');
q('THE_FREMENNIK_TRIALS','The Fremennik Trials',3,'i','PRA:43,MAG:29','','AGI:2812,ATT:2812,CRA:2812,DEF:2812,FIS:2812,FLE:2812,HP:2812,STR:2812,THI:2812');
q('OBSERVATORY_QUEST','Observatory Quest',2,'n','HP:20,MAG:20','','CRA:2250');
q('DEMON_SLAYER','Demon Slayer',3,'n','','','',{rec:'ATT:20,STR:20,HP:20'});
q('UNDERGROUND_PASS','Underground Pass',5,'e','RNG:25,PRA:43,AGI:50','BIOHAZARD','AGI:3000,ATT:3000',{note:'80+ combat recommended so spiders do not aggro'});
q('THE_GOLEM','The Golem',1,'n','CRA:20,THI:25','','CRA:1000,THI:1000');
q('SHADOW_OF_THE_STORM','Shadow of the Storm',1,'i','CRA:30','THE_GOLEM,DEMON_SLAYER','',{lamp:'10,000 combat XP',lamps:[[10000,1,'ATT,STR,DEF,HP,RNG,MAG']]});
q('GHOSTS_AHOY','Ghosts Ahoy',2,'i','AGI:25,COO:20','PRIEST_IN_PERIL,THE_RESTLESS_GHOST','PRA:2400');
q('MAKING_HISTORY','Making History',3,'i','','PRIEST_IN_PERIL,THE_RESTLESS_GHOST','CRA:1000,PRA:1000');
q('MOUNTAIN_DAUGHTER','Mountain Daughter',2,'i','AGI:20,MAG:9','','ATT:1000,PRA:2000');
q('HAZEEL_CULT','Hazeel Cult',1,'n','','','THI:1500');
q('CHILDREN_OF_THE_SUN','Children of the Sun',1,'n','','','');
q('PRINCE_ALI_RESCUE','Prince Ali Rescue',3,'n','','','CRA:500,SMI:500');
q('ICTHLARINS_LITTLE_HELPER',"Icthlarin's Little Helper",2,'i','','GERTRUDES_CAT','AGI:4000,THI:4500',{rec:'MAG:35'});
q('ENTER_THE_ABYSS','Enter the Abyss',0,'s','','RUNE_MYSTERIES','RC:1000',{mini:1});
q('TEMPLE_OF_THE_EYE','Temple of the Eye',1,'i','RC:10','ENTER_THE_ABYSS','RC:5000');
q('CREATURE_OF_FENKENSTRAIN','Creature of Fenkenstrain',2,'i','CRA:20,THI:25','PRIEST_IN_PERIL,THE_RESTLESS_GHOST','THI:1000');
q('THE_DEPTHS_OF_DESPAIR','The Depths of Despair',1,'n','AGI:18','CLIENT_OF_KOUREND','AGI:1500');
q('THE_QUEEN_OF_THIEVES','The Queen of Thieves',1,'n','THI:20','CLIENT_OF_KOUREND','THI:2000');
q('ENLIGHTENED_JOURNEY','Enlightened Journey',1,'i','QP:20,FM:20,FAR:30,CRA:36','','CRA:2000,FAR:3000,FM:4000,WC:1500');
q('SHEEP_HERDER','Sheep Herder',4,'n','','','HUN:1000');
q('BIG_CHOMPY_BIRD_HUNTING','Big Chompy Bird Hunting',2,'i','RNG:30,COO:30,FLE:5','','COO:1470,FLE:262,RNG:735');
q('RFD_OGRE','RFD: Freeing Skrach Uglogwee',1,'i','COO:41,FM:20','RFD_COOK,BIG_CHOMPY_BIRD_HUNTING','COO:1500,CRA:1500,RNG:1500,WC:1500',{series:'RFD'});
q('RFD_EVIL_DAVE','RFD: Freeing Evil Dave',1,'i','COO:25','RFD_COOK,GERTRUDES_CAT,SHADOW_OF_THE_STORM','COO:7000',{series:'RFD'});
q('RFD_PIRATE','RFD: Freeing Pirate Pete',1,'i','COO:31','RFD_COOK','COO:1000,CRA:1000,FIS:1000,SMI:1000',{series:'RFD'});
q('RFD_GUIDE','RFD: Freeing the Lumbridge Guide',1,'i','COO:40','RFD_COOK,BIG_CHOMPY_BIRD_HUNTING,BIOHAZARD,DEMON_SLAYER,MURDER_MYSTERY,NATURE_SPIRIT,WITCHS_HOUSE','COO:2500,MAG:2500',{series:'RFD'});
q('RFD_MONKEY','RFD: Freeing King Awowogei',1,'e','COO:70,AGI:48','RFD_COOK,MONKEY_MADNESS_I','AGI:10000,COO:10000',{series:'RFD',rec:'MAG:55'});
q('RFD_AMIK_VARZE','RFD: Freeing Sir Amik Varze',1,'e','QP:107,AGI:50,CRA:50,HER:45,MAG:56,MIN:52,PRA:42,SMI:50,STR:50,THI:50,WC:50','RFD_COOK,FAMILY_CREST,HEROES_QUEST,SHILO_VILLAGE,UNDERGROUND_PASS,WATERFALL_QUEST','COO:4000,HP:4000',{series:'RFD',note:"Starts Legends' Quest automatically for jungle access"});
q('RFD_CULINAROMANCER','RFD: Defeating the Culinaromancer',1,'m','QP:175','RFD_COOK,RFD_DWARF,RFD_GOBLINS,RFD_PIRATE,RFD_GUIDE,RFD_EVIL_DAVE,RFD_OGRE,RFD_AMIK_VARZE,RFD_MONKEY','',{series:'RFD',note:'Auto-buys Barrows gloves afterwards'});
q('SHIELD_OF_ARRAV','Shield of Arrav',1,'n','','','',{partner:1,note:'Websocket matchmaking partner'});
q('HEROES_QUEST',"Heroes' Quest",1,'e','QP:55,COO:53,FIS:53,HER:25,MIN:50','SHIELD_OF_ARRAV,LOST_CITY,MERLINS_CRYSTAL,DRAGON_SLAYER_I','ATT:3075,COO:2825,DEF:3075,FM:1575,FIS:2725,HER:1325,HP:3075,MIN:2575,RNG:2075,SMI:2275,STR:3075,WC:1575',{partner:1,note:'Websocket matchmaking partner'});
q('TOWER_OF_LIFE','Tower of Life',2,'i','CON:10','','CON:1000,CRA:500,THI:500');
q('CLOCK_TOWER','Clock Tower',1,'n','','','FM:1000');
q('TRIBAL_TOTEM','Tribal Totem',1,'i','THI:21','','THI:1775');
q('WATCHTOWER','Watchtower',4,'e','MAG:14,THI:15,AGI:25,HER:14,MIN:40','','MAG:15250');
q('GETTING_AHEAD','Getting Ahead',1,'i','CRA:30,CON:26','','CON:3200,CRA:4000');
q('PIRATES_TREASURE',"Pirate's Treasure",2,'n','','','COO:800');
q('SCORPION_CATCHER','Scorpion Catcher',1,'i','PRA:31','BARCRAWL','STR:6625');
q('THE_CORSAIR_CURSE','The Corsair Curse',2,'i','','','FM:1200');
q('FAMILY_CREST','Family Crest',1,'e','MIN:40,SMI:40,MAG:59,CRA:40','','CRA:2000,MIN:2000,SMI:2000');
q('THE_GARDEN_OF_DEATH','The Garden of Death',1,'n','FAR:20','','FAR:10000');
q('MONKEY_MADNESS_I','Monkey Madness I',3,'m','PRA:43','THE_GRAND_TREE,TREE_GNOME_VILLAGE','',{lamp:'Combat XP reward (use :TAKEXP)'});
q('THE_FORSAKEN_TOWER','The Forsaken Tower',1,'i','','CLIENT_OF_KOUREND','');
q('HAUNTED_MINE','Haunted Mine',2,'e','CRA:35,MAG:39,HP:28','PRIEST_IN_PERIL,THE_RESTLESS_GHOST','STR:22000');
q('TALE_OF_THE_RIGHTEOUS','Tale of the Righteous',1,'n','STR:16,MIN:10','CLIENT_OF_KOUREND','MIN:1500');
q('SLEEPING_GIANTS','Sleeping Giants',1,'n','SMI:15','','SMI:6000');
q('TROLL_ROMANCE','Troll Romance',2,'e','AGI:28,PRA:43','TROLL_STRONGHOLD','AGI:8000,STR:4000');
q('THE_LOST_TRIBE','The Lost Tribe',1,'i','AGI:13,THI:13,MIN:17','GOBLIN_DIPLOMACY,RUNE_MYSTERIES','MIN:3000');
q('RECRUITMENT_DRIVE','Recruitment Drive',1,'n','','BLACK_KNIGHTS_FORTRESS,DRUIDIC_RITUAL','AGI:1000,HER:1000,PRA:1000',{rec:'ATT:5,STR:5'});
q('A_KINGDOM_DIVIDED','A Kingdom Divided',2,'e','AGI:54,CRA:38,HER:50,MAG:50,MIN:42,THI:52,WC:52,ATT:50,STR:50,RNG:50','THE_DEPTHS_OF_DESPAIR,THE_QUEEN_OF_THIEVES,THE_ASCENT_OF_ARCEUUS,THE_FORSAKEN_TOWER,TALE_OF_THE_RIGHTEOUS','',{lamp:'XP lamps'});
q('DEATH_ON_THE_ISLE','Death on the Isle',2,'i','AGI:32,THI:34','CHILDREN_OF_THE_SUN','AGI:7500,CRA:5000,THI:10000');
q('WANTED','Wanted!',1,'i','QP:32','RECRUITMENT_DRIVE,THE_LOST_TRIBE,PRIEST_IN_PERIL,ENTER_THE_ABYSS','SLA:5000');
q('TWILIGHTS_PROMISE',"Twilight's Promise",1,'i','','CHILDREN_OF_THE_SUN','THI:3000',{rec:'CB:30'});
q('REGICIDE','Regicide',3,'m','AGI:56,CRA:10','UNDERGROUND_PASS','AGI:13750');
q('ROVING_ELVES','Roving Elves',1,'e','','REGICIDE,WATERFALL_QUEST','STR:10000');
q('MOURNINGS_END_PART_I',"Mourning's End Part I",2,'m','RNG:60,THI:50','ROVING_ELVES,BIG_CHOMPY_BIRD_HUNTING,SHEEP_HERDER','HP:25000,THI:40000');
q('MOURNINGS_END_PART_II',"Mourning's End Part II",2,'m','','MOURNINGS_END_PART_I','AGI:60000',{rec:'AGI:65'});
q('ETHICALLY_ACQUIRED_ANTIQUITIES','Ethically Acquired Antiquities',1,'i','THI:25','CHILDREN_OF_THE_SUN,SHIELD_OF_ARRAV','THI:6000');
q('DADDYS_HOME',"Daddy's Home",1,'n','','','CON:400');
q('LUNAR_DIPLOMACY','Lunar Diplomacy',2,'e','CRA:61,DEF:40,FM:49,HER:5,MAG:65,MIN:60,WC:55','THE_FREMENNIK_TRIALS,LOST_CITY,RUNE_MYSTERIES,SHILO_VILLAGE','MAG:5000,RC:5000');
q('IN_SEARCH_OF_THE_MYREQUE','In Search of the Myreque',2,'i','AGI:25','NATURE_SPIRIT','ATT:600,CRA:600,DEF:600,HP:600,STR:600');
q('IN_AID_OF_THE_MYREQUE','In Aid of the Myreque',2,'e','CRA:25,MAG:7,MIN:15','IN_SEARCH_OF_THE_MYREQUE','ATT:2000,CRA:2000,DEF:2000,STR:2000');
q('THRONE_OF_MISCELLANIA','Throne of Miscellania',1,'e','WC:45,FAR:10,HER:35','THE_FREMENNIK_TRIALS,HEROES_QUEST','FAR:1000,FIS:1000,MIN:1000,WC:1000');
q('ROYAL_TROUBLE','Royal Trouble',1,'e','AGI:40,SLA:40','THRONE_OF_MISCELLANIA','AGI:5000,HP:5000,SLA:5000');
q('THE_HAND_IN_THE_SAND','The Hand in the Sand',1,'i','THI:17,CRA:49','','CRA:9000,THI:1000');
q('ZOGRE_FLESH_EATERS','Zogre Flesh Eaters',1,'i','SMI:4,HER:8,RNG:30,MAG:39','BIG_CHOMPY_BIRD_HUNTING,JUNGLE_POTION','FLE:2000,HER:2000,RNG:2000');
q('RUM_DEAL','Rum Deal',2,'e','CRA:42,FIS:50,FAR:40,PRA:47,SLA:42','PRIEST_IN_PERIL,ZOGRE_FLESH_EATERS','FAR:7000,FIS:7000,PRA:7000');
q('CABIN_FEVER','Cabin Fever',2,'e','AGI:42,CRA:45,SMI:50,RNG:40','PIRATES_TREASURE,RUM_DEAL','AGI:7000,CRA:7000,SMI:7000');
q('THE_EYES_OF_GLOUPHRIE','The Eyes of Glouphrie',2,'i','CON:5,MAG:46','THE_GRAND_TREE','CON:250,MAG:12000,RC:6000,WC:2500',{ireq:'RC:13'});
q('THE_SLUG_MENACE','The Slug Menace',1,'i','CRA:30,RC:30,SLA:30,THI:30','WANTED,SEA_SLUG','CRA:3500,RC:3500,THI:3500');
q('BELOW_ICE_MOUNTAIN','Below Ice Mountain',1,'n','QP:16,MIN:10','','MIN:1200');
q('EADGARS_RUSE',"Eadgar's Ruse",1,'e','HER:31','DRUIDIC_RITUAL,TROLL_STRONGHOLD','HER:11000');
q('GARDEN_OF_TRANQUILLITY','Garden of Tranquillity',2,'i','FAR:25','CREATURE_OF_FENKENSTRAIN','FAR:5000');
q('A_SOULS_BANE',"A Soul's Bane",1,'n','RNG:30','','DEF:500,HP:500');
q('SHADOWS_OF_CUSTODIA','Shadows of Custodia',1,'i','SLA:54,CON:41,FIS:45,HUN:36','CHILDREN_OF_THE_SUN','CON:3000,FIS:3000,HUN:4000,SLA:10000');
q('MONKEY_MADNESS_II','Monkey Madness II',4,'g','AGI:55,CRA:70,FM:60,HUN:60,SLA:69,THI:55','ENLIGHTENED_JOURNEY,THE_EYES_OF_GLOUPHRIE,RFD_MONKEY,TROLL_STRONGHOLD,WATCHTOWER,MONKEY_MADNESS_I','AGI:60000,HUN:50000,SLA:80000,THI:50000',{irec:'RNG:70'});
q('TAI_BWO_WANNAI_TRIO','Tai Bwo Wannai Trio',2,'e','AGI:15,COO:30,FIS:5','JUNGLE_POTION','ATT:2500,COO:5000,FIS:5000,STR:2500',{irec:'FIS:65'});
q('BARBARIAN_TRAINING','Barbarian Training',0,'i','AGI:15,STR:35,FIS:55,FAR:15,SMI:5','TAI_BWO_WANNAI_TRIO,DRUIDIC_RITUAL','',{mini:1,note:'Fishing, farming and hasta parts only'});
q('THE_FREMENNIK_ISLES','The Fremennik Isles',1,'e','CON:20,PRA:43','THE_FREMENNIK_TRIALS','CON:5000,CRA:5000',{ireq:'WC:56,CRA:46'});
q('PANDEMONIUM','Pandemonium',1,'n','','','SAI:300');
q('PRYING_TIMES','Prying Times',1,'i','SAI:12,SMI:30','PANDEMONIUM,THE_KNIGHTS_SWORD','SAI:800,SMI:1000');
q('CURRENT_AFFAIRS','Current Affairs',1,'i','SAI:22,FIS:10','PANDEMONIUM','FIS:1000,SAI:1400');
q('MA1','Mage Arena I',0,'i','MAG:60,PRA:43','','',{mini:1,note:'Also unlocks all god staves and capes'});
q('MA2','Mage Arena II',0,'e','MAG:75,PRA:43','MA1','',{mini:1});
q('SONG_OF_THE_ELVES','Song of the Elves',4,'g','AGI:70,CON:70,FAR:70,HER:70,HUN:70,MIN:70,SMI:70,WC:70,PRA:43,MAG:80','MOURNINGS_END_PART_II,MAKING_HISTORY','AGI:40000,CON:40000,FAR:40000,HER:40000,HUN:40000,MIN:40000,SMI:40000');
q('DARKNESS_OF_HALLOWVALE','Darkness of Hallowvale',2,'e','CON:5,MIN:20,THI:22,AGI:26,CRA:32,MAG:33,STR:40','IN_AID_OF_THE_MYREQUE','AGI:7000,CON:2000,THI:6000');
q('DEVIOUS_MINDS','Devious Minds',1,'e','SMI:65,FLE:50,RC:50','WANTED,TROLL_STRONGHOLD,DORICS_QUEST,ENTER_THE_ABYSS','FLE:5000,RC:5000,SMI:6500');
q('COLD_WAR','Cold War',1,'e','HUN:10,THI:15,AGI:30,CRA:30,CON:34','','AGI:5000,CON:1500,CRA:2000',{note:'Needs a player-owned house'});
q('MY_ARMS_BIG_ADVENTURE',"My Arm's Big Adventure",1,'e','WC:10,FAR:29','EADGARS_RUSE,THE_FEUD,JUNGLE_POTION','FAR:5000,HER:10000');
q('SWAN_SONG','Swan Song',2,'m','QP:100,MAG:66,COO:62,FIS:62,SMI:45,FM:42,CRA:40,PRA:43','ONE_SMALL_FAVOUR,GARDEN_OF_TRANQUILLITY','FIS:50000,MAG:15000,PRA:10000');
q('EAGLES_PEAK',"Eagles' Peak",2,'i','HUN:27','','HUN:2500');
q('AT_FIRST_LIGHT','At First Light',1,'i','HUN:46,HER:30,CON:27','CHILDREN_OF_THE_SUN,EAGLES_PEAK','CON:800,HER:500,HUN:4500');
q('ENAKHRAS_LAMENT',"Enakhra's Lament",2,'e','CRA:50,FM:45,PRA:43,MAG:39','','CRA:7000,FM:7000,MAG:7000,MIN:7000');
q('SPIRITS_OF_THE_ELID','Spirits of the Elid',2,'i','RNG:37,MIN:37,THI:37,MAG:33','','MAG:1000,PRA:8000,THI:1000');
q('A_RUFF_SITUATION','A Ruff Situation',1,'n','CRA:15','','CRA:1000');
q('CRAB_QUEST','Crab Quest',1,'i','SAI:40,FIS:30','PANDEMONIUM','FIS:3000,SAI:10000');
q('RIBBITING_TALE','The Ribbiting Tale of a Lily Pad Labour Dispute',1,'n','WC:15','CHILDREN_OF_THE_SUN','WC:2000');
q('TEARS_OF_GUTHIX','Tears of Guthix',1,'i','QP:43,FM:49,CRA:20,MIN:20','','CRA:1000');
q('RAG_AND_BONE_MAN_I','Rag and Bone Man I',1,'n','','','COO:500,PRA:500');
q('THE_IDES_OF_MILK','The Ides of Milk',1,'n','','','',{lamp:'XP lamp (Prayer on ironmen)'});
q('TROUBLED_TORTUGANS','Troubled Tortugans',1,'e','SLA:51,CON:48,SAI:45,HUN:45,WC:40,CRA:34','PANDEMONIUM','SAI:10000,SLA:8000');
q('FALLEN_FROM_GRACE','Fallen from Grace',1,'e','SAI:62,CRA:60,RC:47,MIN:53','PANDEMONIUM','CRA:10000,MIN:5000,RC:5000,SAI:12500');
q('FAIRYTALE_II','Fairytale II - Cure a Queen',2,'e','THI:40,FAR:49,HER:57,CB:70','FAIRYTALE_I','HER:3500,THI:2500');
q('MEAT_AND_GREET','Meat and Greet',1,'i','PRA:43,CB:60','CHILDREN_OF_THE_SUN','COO:8000');
q('A_TAIL_OF_TWO_CATS','A Tail of Two Cats',2,'i','','ICTHLARINS_LITTLE_HELPER','',{lamp:'2 x 2,500 XP lamps',lamps:[[2500,2,null,30]],irec:'COO:50'});
q('DEFENDER_OF_VARROCK','Defender of Varrock',2,'e','SMI:55,HUN:52,MIN:14,CB:65','SHIELD_OF_ARRAV,TEMPLE_OF_IKOV,BELOW_ICE_MOUNTAIN,FAMILY_CREST,GARDEN_OF_TRANQUILLITY,WHAT_LIES_BELOW,ROMEO_AND_JULIET,DEMON_SLAYER','HUN:15000,SMI:15000');
q('MUDFOOTS_BIG_ADVENTURE',"Mudfoot's Big Adventure",1,'n','','','',{lamp:'XP lamp'});
q('A_SHELL_OF_A_FRIEND','A Shell of a Friend',1,'i','HER:16,CON:15,CB:40','PRIEST_IN_PERIL','CON:2500,HER:2500');
q('SKIPPY_AND_THE_MOGRES','Skippy and the Mogres',0,'s','COO:20','','',{mini:1});

const QUEST_ALIAS = {SOTE:'SONG_OF_THE_ELVES', MAGE_ARENA_I:'MA1', MAGE_ARENA_II:'MA2'};

/* Achievement diaries supported by the backend */
d('ARDOUGNE_EASY','Ardougne Easy','THI:5','BIOHAZARD,RUNE_MYSTERIES','i');
d('ARDOUGNE_MEDIUM','Ardougne Medium','AGI:39,CRA:49,FAR:31,FM:50,MAG:51,STR:38,THI:38','DIARY:ARDOUGNE_EASY,ENLIGHTENED_JOURNEY,FAIRYTALE_I,THE_HAND_IN_THE_SAND,SEA_SLUG,TOWER_OF_LIFE,WATCHTOWER','e',{approx:1});
d('LUMBRIDGE_EASY','Lumbridge & Draynor Easy','SLA:7,RC:5,WC:15,FM:15,MIN:15','COOKS_ASSISTANT,RUNE_MYSTERIES','i');
d('LUMBRIDGE_MEDIUM','Lumbridge & Draynor Medium','AGI:20,CRA:38,FIS:30,HUN:42,MAG:31,RNG:50,STR:19,THI:38,WC:30','DIARY:LUMBRIDGE_EASY,LOST_CITY,FAIRYTALE_I,ANIMAL_MAGNETISM','e',{approx:1,note:'Ironmen need to be able to make a mithril grapple'});
d('VARROCK_EASY','Varrock Easy','AGI:13,MIN:15,FIS:20,THI:5,CRA:8,RC:9','NATURAL_HISTORY_QUIZ','i',{any:[2,KUDOS],note:'Needs 50 kudos'});
d('VARROCK_MEDIUM','Varrock Medium','AGI:30,CRA:36,FAR:30,FM:40,HER:10,MAG:25,THI:25','DIARY:VARROCK_EASY,BONE_VOYAGE,GERTRUDES_CAT,ENLIGHTENED_JOURNEY,GARDEN_OF_TRANQUILLITY,A_SOULS_BANE,TREE_GNOME_VILLAGE','e',{approx:1,note:'Needs 2FA or Jagex account, possibly 30 slayer points'});
d('KARAMJA_EASY','Karamja Easy','AGI:15,MIN:40','','i');
d('KARAMJA_MEDIUM','Karamja Medium','AGI:42,FIS:65,WC:50,HUN:41,MIN:40,COO:16,FAR:27','DIARY:KARAMJA_EASY,THE_GRAND_TREE,SHILO_VILLAGE,DRAGON_SLAYER_I,TAI_BWO_WANNAI_TRIO','e');
d('KOUREND_EASY','Kourend & Kebos Easy','CON:25,MIN:15,FIS:20,HER:12,THI:25','DRUIDIC_RITUAL','i');
d('KOUREND_MEDIUM','Kourend & Kebos Medium','AGI:49,CON:30,CRA:30,FAR:45,FM:50,FIS:43,HUN:53,MIN:42,WC:50,CB:50','DIARY:KOUREND_EASY,EAGLES_PEAK,THE_DEPTHS_OF_DESPAIR,THE_QUEEN_OF_THIEVES,TALE_OF_THE_RIGHTEOUS,THE_FORSAKEN_TOWER,THE_ASCENT_OF_ARCEUUS','e');
d('FALADOR_EASY','Falador Easy','AGI:5,MIN:10,SMI:13,CON:16','DORICS_QUEST,THE_KNIGHTS_SWORD,RUNE_MYSTERIES','i');
d('WESTERN_EASY','Western Provinces Easy','RNG:30,FLE:20,HUN:9,MIN:15,CB:40','BIG_CHOMPY_BIRD_HUNTING,RUNE_MYSTERIES','i');
d('MORYTANIA_EASY','Morytania Easy','CRA:15,COO:12,SLA:15,FAR:23,CB:20','PRIEST_IN_PERIL,NATURE_SPIRIT','i');

/* Milestones */
ms('DRAGON_DEFENDER','Dragon defender','ATTSTR:130','','e',{note:'Warriors Guild'});
ms('RUNE_DEFENDER','Rune defender','ATTSTR:130','','e',{note:'Warriors Guild, for zerker accounts'});
ms('FAIRY_RINGS','Fairy rings','','FAIRYTALE_I','i',{note:'Fairytale II up to the fairy ring unlock'});
ms('UNLOCK_PIETY','Piety and Chivalry','ATT:60,STR:50','KINGS_RANSOM','e',{note:'Knight Waves Training Grounds'});
/* Knight Waves rewards 20,000 XP in each melee skill */
DB['MILESTONE:UNLOCK_PIETY'].xp = parseKV('ATT:20000,STR:20000,DEF:20000,HP:20000');
ms('ROGUES_OUTFIT',"Rogues' outfit",'AGI:50,THI:50','','e');
ms('ROCK_CAKE','Dwarven rock cake','','RFD_DWARF','n');
ms('BLACK_MASK','Black mask','SLA:58','CABIN_FEVER','m',{note:'Farms cave horrors until a black mask drops'});

/* Minigames, repeating tasks and other backend tasks */
act('IRON_STARTER_PART1','Ironman starter (part 1)',{group:'Starter',note:'Bruhsailer route to Ardougne, starting quests, Wintertodt and blackjacking requirements'});
act('MINIGAME:WINTERTODT','Wintertodt',{skill:'FIREMAKING',method:'WT',req:'FM:50',param:'level',defaultParam:'80'});
act('MINIGAME:MLM','Motherlode Mine',{skill:'MINING',method:'MLM',req:'MIN:30',param:'level',options:['COALBAG','GEMBAG','SET','HAT','TOP','LEGS','BOOTS'],defaultParam:'60'});
act('MINIGAME:GF',"Giant's Foundry",{skill:'SMITHING',method:'GF',req:'SMI:15',param:'level',options:['MOULD','TOP','LEGS','GLOVES','BOOTS','COLOSSAL'],defaultParam:'60'});
act('MINIGAME:LIBRARY','Arceuus Library',{skill:'MAGIC',method:'LIB_MAG',pre:'X_MARKS_THE_SPOT',param:'level',defaultParam:'55',note:'Add :RC after the level to train Runecraft'});
act('MINIGAME:RUMOURS','Hunter Rumours',{skill:'HUNTER',method:'RUMOURS',req:'HUN:46',param:'level',defaultParam:'70'});
act('MINIGAME:HUNTER_RUMOURS','Hunter Rumours (alt)',{skill:'HUNTER',method:'RUMOURS',req:'HUN:46',param:'level',defaultParam:'70'});
act('MINIGAME:VALE_TOTEMS','Vale Totems',{skill:'FLETCHING',method:'VALE',param:'level',defaultParam:'60'});
act('MINIGAME:MTA','Mage Training Arena',{param:'option',options:['GREENLOG','EFFICIENT','ROBES','B2P','WAND','BOOK','TOP','BOTTOM','HAT','BOOTS','GLOVES','POUCH'],defaultParam:'EFFICIENT'});
act('MINIGAME:PEST_CONTROL','Pest Control',{req:'CB:40',param:'number',defaultParam:'250',note:'Target points; add :RANGED, :MAGIC etc. for style'});
act('REPEATING:BIRDHOUSES','Birdhouse runs',{group:'Repeating',pre:'BONE_VOYAGE',req:'HUN:9',param:'level',defaultParam:'99',background:1});
act('REPEATING:TREE_RUNS','Tree runs',{group:'Repeating',req:'FAR:15',param:'level',defaultParam:'99',background:1});
act('REPEATING:HERB_RUNS','Herb runs',{group:'Repeating',req:'FAR:9',param:'level',defaultParam:'99',background:1});
act('REPEATING:SEAWEED_RUNS','Seaweed runs',{group:'Repeating',pre:'BONE_VOYAGE',req:'FAR:22',param:'level',defaultParam:'99',background:1});
act('REPEATING:HOP_RUNS','Hop runs',{group:'Repeating',req:'FAR:13',param:'level',defaultParam:'99',background:1});
act('REPEATING:COMPOST_RUNS','Compost runs',{group:'Repeating',pre:'BONE_VOYAGE',req:'FAR:22',background:1});
act('REPEATING:HESPORI','Hespori',{group:'Repeating',req:'FAR:65,MAG:59',background:1});
act('REPEATING:TOG','Tears of Guthix (repeating)',{group:'Repeating',pre:'TEARS_OF_GUTHIX',background:1});
act('REPEATING:KINGDOM','Kingdom of Miscellania',{group:'Repeating',pre:'THRONE_OF_MISCELLANIA',param:'text',defaultParam:'MAHOG:HERB',background:1,note:'Two worker choices: HERB MINE WOOD TEAK MAHOG FISH FARM'});
act('HUNTER_FARM','Hunter farm (single creature)',{group:'Other',param:'text',defaultParam:'RED_CHINCHOMPA'});
act('ACQUIRE','Acquire item',{group:'Other',param:'text',defaultParam:'Oak logs,50-800',note:'ItemName,min-max; join several with &'});

/* Ironman starter end state (IRON_STARTER_PART1) */
const STARTER = {
  quests:'MONKS_FRIEND,CLOCK_TOWER,HAZEEL_CULT,SEA_SLUG,TRIBAL_TOTEM,ERNEST_THE_CHICKEN,CHILDREN_OF_THE_SUN,X_MARKS_THE_SPOT,WITCHS_POTION,WITCHS_HOUSE,TREE_GNOME_VILLAGE,WATERFALL_QUEST,GERTRUDES_CAT,COOKS_ASSISTANT,RFD_COOK,CLIENT_OF_KOUREND,OBSERVATORY_QUEST,PLAGUE_CITY,MURDER_MYSTERY,DWARF_CANNON,SHEEP_SHEARER,DRUIDIC_RITUAL,FISHING_CONTEST,RFD_DWARF,GOBLIN_DIPLOMACY,RFD_GOBLINS,BLACK_KNIGHTS_FORTRESS,THE_FORSAKEN_TOWER,THE_QUEEN_OF_THIEVES,DADDYS_HOME,FIGHT_ARENA,TALE_OF_THE_RIGHTEOUS,THE_KNIGHTS_SWORD,THE_FEUD'.split(','),
  levels:{ATTACK:40,STRENGTH:30,PRAYER:9,MAGIC:20,SLAYER:14,CONSTRUCTION:8,FARMING:9,WOODCUTTING:48,FIREMAKING:50,
    COOKING:40,FISHING:42,SMITHING:29,MINING:23,HITPOINTS:25,CRAFTING:22,FLETCHING:10,THIEVING:54,HERBLORE:3}
};

/* ---------------- Optimal quest order (OSRS Wiki) ---------------- */
const GUIDE_IRON = `COOKS_ASSISTANT SHEEP_SHEARER THE_RESTLESS_GHOST X_MARKS_THE_SPOT WITCHS_POTION CLIENT_OF_KOUREND PANDEMONIUM
CHILDREN_OF_THE_SUN GERTRUDES_CAT DADDYS_HOME NATURAL_HISTORY_QUIZ DEMON_SLAYER RUNE_MYSTERIES TREE_GNOME_VILLAGE HAZEEL_CULT
CLOCK_TOWER MONKS_FRIEND PLAGUE_CITY BIOHAZARD ENTER_THE_ABYSS DIARY:ARDOUGNE_EASY TEMPLE_OF_THE_EYE FIGHT_ARENA TRIBAL_TOTEM
SHEEP_HERDER WATERFALL_QUEST MURDER_MYSTERY DORICS_QUEST DRUIDIC_RITUAL WITCHS_HOUSE DWARF_CANNON MERLINS_CRYSTAL HOLY_GRAIL
VAMPYRE_SLAYER THE_IDES_OF_MILK MUDFOOTS_BIG_ADVENTURE BELOW_ICE_MOUNTAIN BLACK_KNIGHTS_FORTRESS PIRATES_TREASURE
OBSERVATORY_QUEST A_RUFF_SITUATION ROMEO_AND_JULIET PRIEST_IN_PERIL NATURE_SPIRIT RECRUITMENT_DRIVE BARCRAWL SCORPION_CATCHER
JUNGLE_POTION A_PORCINE_OF_INTEREST RAG_AND_BONE_MAN_I DEATH_PLATEAU THE_QUEEN_OF_THIEVES THE_FORSAKEN_TOWER
THE_DEPTHS_OF_DESPAIR TALE_OF_THE_RIGHTEOUS THE_ASCENT_OF_ARCEUUS THE_GRAND_TREE MOUNTAIN_DAUGHTER SHIELD_OF_ARRAV
THE_DIG_SITE THE_GOLEM ETHICALLY_ACQUIRED_ANTIQUITIES TWILIGHTS_PROMISE DEATH_ON_THE_ISLE RFD_COOK GOBLIN_DIPLOMACY
THE_LOST_TRIBE RFD_GOBLINS THE_KNIGHTS_SWORD PRINCE_ALI_RESCUE THE_FEUD THE_CORSAIR_CURSE ICTHLARINS_LITTLE_HELPER
SHADOW_OF_THE_STORM SEA_SLUG FISHING_CONTEST RFD_DWARF RIBBITING_TALE LOST_CITY FAIRYTALE_I MILESTONE:FAIRY_RINGS
RFD_EVIL_DAVE GHOSTS_AHOY CREATURE_OF_FENKENSTRAIN MAKING_HISTORY TEMPLE_OF_IKOV BONE_VOYAGE THE_TOURIST_TRAP WANTED
ERNEST_THE_CHICKEN ANIMAL_MAGNETISM DIARY:KARAMJA_EASY IMP_CATCHER WATCHTOWER BIG_CHOMPY_BIRD_HUNTING ZOGRE_FLESH_EATERS
DIARY:VARROCK_EASY SPIRITS_OF_THE_ELID DRAGON_SLAYER_I HORROR_FROM_THE_DEEP THE_GARDEN_OF_DEATH ENLIGHTENED_JOURNEY
GARDEN_OF_TRANQUILLITY IN_SEARCH_OF_THE_MYREQUE IN_AID_OF_THE_MYREQUE DARKNESS_OF_HALLOWVALE A_TAIL_OF_TWO_CATS
TOWER_OF_LIFE DIARY:FALADOR_EASY TAI_BWO_WANNAI_TRIO DIARY:KARAMJA_MEDIUM TROLL_STRONGHOLD EADGARS_RUSE
MY_ARMS_BIG_ADVENTURE THE_FREMENNIK_TRIALS SHILO_VILLAGE TROLL_ROMANCE THE_EYES_OF_GLOUPHRIE ELEMENTAL_WORKSHOP_I
PRYING_TIMES SLEEPING_GIANTS RFD_PIRATE A_SHELL_OF_A_FRIEND THE_FREMENNIK_ISLES GETTING_AHEAD MEAT_AND_GREET RFD_GUIDE
RFD_OGRE HAUNTED_MINE MONKEY_MADNESS_I TEARS_OF_GUTHIX ONE_SMALL_FAVOUR THE_SLUG_MENACE COLD_WAR UNDERGROUND_PASS
SKIPPY_AND_THE_MOGRES CURRENT_AFFAIRS CRAB_QUEST RUM_DEAL CABIN_FEVER THE_HAND_IN_THE_SAND ENAKHRAS_LAMENT HEROES_QUEST
THRONE_OF_MISCELLANIA ROYAL_TROUBLE DESERT_TREASURE_I FAMILY_CREST RFD_AMIK_VARZE DIARY:LUMBRIDGE_EASY DIARY:KOUREND_EASY
DIARY:MORYTANIA_EASY DIARY:WESTERN_EASY DIARY:ARDOUGNE_MEDIUM A_SOULS_BANE DIARY:VARROCK_MEDIUM FAIRYTALE_II
A_KINGDOM_DIVIDED RFD_MONKEY REGICIDE ROVING_ELVES MOURNINGS_END_PART_I MOURNINGS_END_PART_II LUNAR_DIPLOMACY
WHAT_LIES_BELOW KINGS_RANSOM MILESTONE:UNLOCK_PIETY SWAN_SONG RFD_CULINAROMANCER EAGLES_PEAK AT_FIRST_LIGHT
DEFENDER_OF_VARROCK DIARY:KOUREND_MEDIUM DIARY:LUMBRIDGE_MEDIUM DEVIOUS_MINDS TROUBLED_TORTUGANS FALLEN_FROM_GRACE
SHADOWS_OF_CUSTODIA MONKEY_MADNESS_II SONG_OF_THE_ELVES`.split(/\s+/);

const GUIDE_MAIN = `COOKS_ASSISTANT SHEEP_SHEARER PRINCE_ALI_RESCUE THE_RESTLESS_GHOST RUNE_MYSTERIES IMP_CATCHER WITCHS_POTION
GERTRUDES_CAT CHILDREN_OF_THE_SUN NATURAL_HISTORY_QUIZ DADDYS_HOME DWARF_CANNON MUDFOOTS_BIG_ADVENTURE ERNEST_THE_CHICKEN
WATERFALL_QUEST TREE_GNOME_VILLAGE DORICS_QUEST WITCHS_HOUSE BELOW_ICE_MOUNTAIN ROMEO_AND_JULIET DEMON_SLAYER
BLACK_KNIGHTS_FORTRESS THE_KNIGHTS_SWORD THE_TOURIST_TRAP DRUIDIC_RITUAL RECRUITMENT_DRIVE GOBLIN_DIPLOMACY SLEEPING_GIANTS
FIGHT_ARENA PLAGUE_CITY MONKS_FRIEND HAZEEL_CULT SHEEP_HERDER BIOHAZARD TOWER_OF_LIFE TRIBAL_TOTEM DEATH_PLATEAU
MERLINS_CRYSTAL HOLY_GRAIL MURDER_MYSTERY THE_GRAND_TREE DIARY:ARDOUGNE_EASY A_RUFF_SITUATION RAG_AND_BONE_MAN_I
PRIEST_IN_PERIL NATURE_SPIRIT PIRATES_TREASURE GHOSTS_AHOY MAKING_HISTORY THE_IDES_OF_MILK THE_CORSAIR_CURSE CLOCK_TOWER
SEA_SLUG THE_LOST_TRIBE ELEMENTAL_WORKSHOP_I ICTHLARINS_LITTLE_HELPER THE_GOLEM RIBBITING_TALE LOST_CITY FAIRYTALE_I
MILESTONE:FAIRY_RINGS RFD_COOK RFD_GOBLINS PANDEMONIUM PRYING_TIMES CURRENT_AFFAIRS FISHING_CONTEST RFD_DWARF
MOUNTAIN_DAUGHTER THE_FEUD DEATH_ON_THE_ISLE BARCRAWL SCORPION_CATCHER THE_DIG_SITE ENTER_THE_ABYSS TEMPLE_OF_THE_EYE
X_MARKS_THE_SPOT CLIENT_OF_KOUREND THE_QUEEN_OF_THIEVES THE_DEPTHS_OF_DESPAIR A_PORCINE_OF_INTEREST WANTED SHIELD_OF_ARRAV
BONE_VOYAGE WATCHTOWER VAMPYRE_SLAYER SHADOW_OF_THE_STORM HORROR_FROM_THE_DEEP ANIMAL_MAGNETISM CREATURE_OF_FENKENSTRAIN
BIG_CHOMPY_BIRD_HUNTING JUNGLE_POTION SHILO_VILLAGE DIARY:KARAMJA_EASY ZOGRE_FLESH_EATERS OBSERVATORY_QUEST
SPIRITS_OF_THE_ELID GARDEN_OF_TRANQUILLITY ENLIGHTENED_JOURNEY TEARS_OF_GUTHIX IN_SEARCH_OF_THE_MYREQUE
IN_AID_OF_THE_MYREQUE SKIPPY_AND_THE_MOGRES TROLL_STRONGHOLD TROLL_ROMANCE DARKNESS_OF_HALLOWVALE A_SHELL_OF_A_FRIEND
UNDERGROUND_PASS REGICIDE DRAGON_SLAYER_I THE_FREMENNIK_TRIALS THE_FREMENNIK_ISLES RFD_EVIL_DAVE RFD_PIRATE
TAI_BWO_WANNAI_TRIO TEMPLE_OF_IKOV THE_EYES_OF_GLOUPHRIE ONE_SMALL_FAVOUR THE_ASCENT_OF_ARCEUUS TALE_OF_THE_RIGHTEOUS
THE_FORSAKEN_TOWER THE_SLUG_MENACE GETTING_AHEAD COLD_WAR THE_HAND_IN_THE_SAND ENAKHRAS_LAMENT EADGARS_RUSE
MY_ARMS_BIG_ADVENTURE THE_GARDEN_OF_DEATH CRAB_QUEST RUM_DEAL CABIN_FEVER MEAT_AND_GREET RFD_GUIDE RFD_OGRE HEROES_QUEST
THRONE_OF_MISCELLANIA ROYAL_TROUBLE HAUNTED_MINE MONKEY_MADNESS_I ETHICALLY_ACQUIRED_ANTIQUITIES TWILIGHTS_PROMISE
ROVING_ELVES MOURNINGS_END_PART_I MOURNINGS_END_PART_II DESERT_TREASURE_I FAMILY_CREST WHAT_LIES_BELOW EAGLES_PEAK
A_TAIL_OF_TWO_CATS RFD_AMIK_VARZE A_KINGDOM_DIVIDED AT_FIRST_LIGHT DIARY:LUMBRIDGE_EASY DIARY:KOUREND_EASY
DIARY:MORYTANIA_EASY DIARY:WESTERN_EASY DIARY:FALADOR_EASY DIARY:VARROCK_EASY DIARY:ARDOUGNE_MEDIUM DIARY:VARROCK_MEDIUM
FAIRYTALE_II RFD_MONKEY RFD_CULINAROMANCER LUNAR_DIPLOMACY KINGS_RANSOM MILESTONE:UNLOCK_PIETY SWAN_SONG
DEFENDER_OF_VARROCK DEVIOUS_MINDS DIARY:KARAMJA_MEDIUM DIARY:KOUREND_MEDIUM DIARY:LUMBRIDGE_MEDIUM A_SOULS_BANE
SHADOWS_OF_CUSTODIA TROUBLED_TORTUGANS FALLEN_FROM_GRACE MONKEY_MADNESS_II SONG_OF_THE_ELVES`.split(/\s+/);

/* ---------------- Training methods (backend capabilities) ----------------
   rate = XP/hour on a regular account, irate = XP/hour on an ironman (0 = not used).
   Rates are conservative bot estimates from the OSRS Wiki training guides. */
function M(from, to, rate, label, o){
  o = o || {};
  return Object.assign({from, to, rate, irate: o.irate !== undefined ? o.irate : rate, label,
    pre: keyList(o.pre || ''), req: parseKV(o.req || ''), raw: o.raw || null, id: o.id || null,
    alt: o.alt === 'main' ? 'main' : !!o.alt, toggle: o.toggle || null, unlock: keyList(o.unlock || ''), iunlock: keyList(o.iunlock || ''), ilabel: o.ilabel || null,
    gp: !!o.gp, isuffix: o.isuffix || ''}, {});
}
const CRAB = [[1,10,8000],[10,20,13000],[20,30,18000],[30,40,24000],[40,50,30000],[50,60,36000],[60,70,42000],[70,80,48000],[80,99,55000]];
const crabs = () => CRAB.map(([a,b,r]) => M(a,b,r,'Crabs'));
const METHODS = {
  ATTACK: crabs(), STRENGTH: crabs(), DEFENCE: crabs(),
  RANGED: CRAB.map(([a,b,r]) => M(a,b,Math.round(r*1.05),'Crabs (ranged)')),
  HITPOINTS: [],
  PRAYER: [M(1,99,250000,'Dragon bones at gilded altar',{irate:8000,ilabel:'Bones at altar (limited supply)',gp:1}),
           M(30,99,0,'Blessed bone shards',{irate:55000})],
  /* Ironmen skip Imp Catcher (imp bead drops): Witch's Potion plus the X Marks the Spot and Client of Kourend lamps on Magic reach 10 */
  MAGIC: [M(1,7,0,'No method: quest XP',{unlock:'WITCHS_POTION,IMP_CATCHER',iunlock:'WITCHS_POTION,X_MARKS_THE_SPOT,CLIENT_OF_KOUREND'}),
          M(7,27,25000,'Enchant sapphire jewellery',{irate:10000,gp:1}), M(27,49,40000,'Enchant emerald jewellery',{irate:14000,gp:1}),
          M(49,55,55000,'Enchant topaz jewellery',{irate:18000,gp:1}), M(55,99,110000,'Tele-alching',{irate:30000,gp:1}),
          /* Ironmen: default Magic method (no jewellery or alch supplies needed). Regular accounts: variety alternative */
          /* XP per book scales with level */
          ...[[7,30,20000],[30,50,35000],[50,70,50000],[70,99,65000]].map(([a,b,r]) => M(a,b,r,'Arceuus Library',{alt:'main',id:'LIB_MAG',raw:'MINIGAME:LIBRARY:{L}',pre:'X_MARKS_THE_SPOT'}))],
  HERBLORE: [M(1,3,0,'Druidic Ritual unlock',{unlock:'DRUIDIC_RITUAL'}),
             M(3,26,60000,'Attack potions',{irate:12000,pre:'DRUIDIC_RITUAL',gp:1}),
             M(26,38,150000,'Energy potions',{irate:15000,pre:'DRUIDIC_RITUAL',gp:1}),
             M(38,52,200000,'Prayer potions',{irate:18000,pre:'DRUIDIC_RITUAL',gp:1}),
             M(52,99,280000,'Super energy potions',{irate:20000,pre:'DRUIDIC_RITUAL',gp:1})],
  WOODCUTTING: [M(1,15,8000,'Regular trees'), M(15,35,20000,'Oak trees near Varrock'), M(35,60,45000,'Teak trees'), M(60,99,65000,'Teak trees')],
  MINING: [M(1,15,9000,'Powermine copper (Varrock east)'), M(15,30,20000,'Powermine iron (Isle of Souls)'),
           M(30,45,30000,'Powermine iron (Isle of Souls)'), M(45,60,40000,'Powermine iron (Isle of Souls)'),
           M(60,99,55000,'Iron ore (Mining Guild)'), M(30,99,30000,'Motherlode Mine',{alt:1,id:'MLM',raw:'MINIGAME:MLM:{L}'})],
  FISHING: [M(1,20,6000,'Shrimps and anchovies'), M(20,40,22000,'Trout and salmon'), M(40,99,35000,'Trout and salmon'),
            M(58,70,50000,'Barbarian fishing',{req:'STR:30,AGI:30',pre:'BARBARIAN_TRAINING'}),
            M(70,99,62000,'Barbarian fishing',{req:'STR:45,AGI:45',pre:'BARBARIAN_TRAINING'})],
  COOKING: [M(1,35,40000,'Regular raw food',{irate:30000}), M(35,99,400000,'Jugs of wine (GE)',{irate:0,gp:1}),
            M(25,99,0,'Mess hall',{irate:75000,isuffix:':MESS'})],
  /* Ironmen chop their own logs first (ACQUIRE), so their rates include the chopping */
  FIREMAKING: [M(1,15,25000,'Normal logs',{irate:8000,ilabel:'Chop and burn logs',gp:1}), M(15,30,45000,'Oak logs',{irate:10000,ilabel:'Chop and burn oak logs',gp:1}),
               M(30,45,70000,'Willow logs',{irate:20000,ilabel:'Chop and burn willow logs',gp:1}), M(45,99,150000,'Maple and yew logs',{irate:22000,ilabel:'Chop and burn maple logs',gp:1}),
               M(50,99,150000,'Wintertodt',{irate:120000,id:'WT',raw:'MINIGAME:WINTERTODT:{L}',toggle:'wintertodt'})],
  CRAFTING: [M(1,20,50000,'Glassblowing',{irate:30000,gp:1}), M(20,40,100000,'Cutting gems',{irate:35000,gp:1}),
             M(40,60,180000,'Cutting gems',{irate:45000,gp:1}), M(60,99,250000,'Cutting gems',{irate:60000,gp:1})],
  AGILITY: [M(1,10,6000,'Gnome Stronghold course'), M(10,20,8000,'Draynor rooftop'), M(20,30,9500,'Al Kharid rooftop'),
            M(30,40,12000,'Varrock rooftop'), M(40,50,16000,'Canifis rooftop'), M(50,60,24000,'Falador rooftop'),
            M(60,70,40000,"Seers' rooftop"), M(70,80,48000,'Pollnivneach rooftop'), M(80,90,55000,'Rellekka rooftop'),
            M(90,99,62000,'Ardougne rooftop')],
  FLETCHING: [M(1,10,40000,'Headless arrows',{irate:15000,gp:1}), M(10,50,90000,'Stringing shortbows and longbows',{irate:35000,gp:1}),
              M(50,99,200000,'Stringing maple, yew and magic bows',{irate:50000,gp:1}),
              /* Ironmen: uses logs the account already has, then chops more (no gp) */
              M(1,99,45000,'Vale Totems',{irate:40000,alt:'main',id:'VALE',raw:'MINIGAME:VALE_TOTEMS:{L}'})],
  RUNECRAFT: [M(1,10,25000,'Air tiaras',{irate:6000,ilabel:'Air runes'}), M(10,27,25000,'Air tiaras',{irate:15000,gp:1}),
              M(27,99,45000,'Guardians of the Rift',{pre:'TEMPLE_OF_THE_EYE'}),
              /* Ironmen: default below Guardians of the Rift (no gp) */
              ...[[1,30,15000],[30,50,25000],[50,70,35000],[70,99,45000]].map(([a,b,r]) => M(a,b,r,'Arceuus Library',{alt:'main',id:'LIB_RC',raw:'MINIGAME:LIBRARY:{L}:RC',pre:'X_MARKS_THE_SPOT'}))],
  THIEVING: [M(1,5,3000,'Pickpocket men'), M(5,99,15000,'Cake stall'), M(25,99,45000,'Fruit stalls',{pre:'CLIENT_OF_KOUREND'}),
             M(45,99,150000,'Blackjacking',{irate:0,pre:'THE_FEUD'}),
             M(50,99,0,'Stealing valuables',{irate:110000,pre:'CHILDREN_OF_THE_SUN'})],
  SLAYER: [M(1,30,10000,'Slayer tasks (point boosting)'), M(30,60,18000,'Slayer tasks'), M(60,99,28000,'Slayer tasks (burst, cannon)')],
  HUNTER: [M(1,9,5000,'Crimson swifts (Isle of Souls)'), M(9,15,8000,'Copper longtails (Isle of Souls)'),
           M(15,43,22000,'Ruby harvest and bird snaring (Piscatoris)'), M(43,99,55000,'Falconry'),
           M(46,99,60000,'Hunter Rumours',{alt:1,id:'RUMOURS',raw:'MINIGAME:RUMOURS:{L}'})],
  SMITHING: [M(1,99,30000,'Anvil smithing (Varrock west)',{irate:20000,gp:1}),
             M(15,99,60000,"Giant's Foundry",{irate:50000,id:'GF',raw:'MINIGAME:GF:{L}'}),
             M(30,99,0,'Steel bars (Blast Furnace)',{irate:65000,req:'MIN:50',gp:1}),
             M(40,99,280000,'Gold bars (Blast Furnace)',{irate:0,req:'MIN:50'})],
  CONSTRUCTION: [M(1,20,25000,'Mahogany Homes',{irate:20000,pre:'PLAGUE_CITY',gp:1}), M(20,50,45000,'Mahogany Homes',{irate:35000,pre:'PLAGUE_CITY',gp:1}),
                 M(50,99,70000,'Mahogany Homes',{irate:50000,pre:'PLAGUE_CITY',gp:1})],
  FARMING: [M(1,36,60000,'Bagged plants',{irate:20000,ilabel:'Bagged plants (gp heavy on ironmen)',gp:1}), M(36,99,40000,'Farm runs',{irate:20000})],
  SAILING: [M(1,17,15000,'Sea charting',{pre:'PANDEMONIUM'}), M(17,34,25000,'Cargo tasks',{pre:'PANDEMONIUM'}),
            M(34,99,40000,'Charting and barracuda trials',{pre:'PANDEMONIUM'})]
};
const METHOD_BY_ID = {};
Object.entries(METHODS).forEach(([s, list]) => list.forEach(m => { m.skill = s; if(m.id && !METHOD_BY_ID[m.id]) METHOD_BY_ID[m.id] = m; }));
/* A method id can span several level ranges with different rates (e.g. Arceuus Library) */
function methodById(id, l){
  for(const list of Object.values(METHODS)) for(const m of list) if(m.id === id && m.from <= l && l < m.to) return m;
  return METHOD_BY_ID[id] || null;
}

/* Goal levels: gear and method unlocks used to split training into meaningful chunks */
const MILESTONES = {
  WOODCUTTING:{6:'Steel axe',11:'Black axe',15:'Oak trees',21:'Mithril axe',31:'Adamant axe',35:'Teak trees',41:'Rune axe',61:'Dragon axe'},
  MINING:{6:'Steel pickaxe',11:'Black pickaxe',15:'Iron ore',21:'Mithril pickaxe',31:'Adamant pickaxe',41:'Rune pickaxe',60:'Mining Guild',61:'Dragon pickaxe'},
  ATTACK:{5:'Steel weapons',10:'Black weapons',20:'Mithril weapons',30:'Adamant weapons',40:'Rune weapons',50:'Leaf-bladed weapons',60:'Dragon weapons',70:'Abyssal whip'},
  STRENGTH:{10:'Max hit checkpoint',20:'Max hit checkpoint',30:'Max hit checkpoint',40:'Max hit checkpoint',50:'Granite maul',60:'Obsidian weapons',70:'Max hit checkpoint',80:'Max hit checkpoint',90:'Max hit checkpoint'},
  DEFENCE:{5:'Steel armour',10:'Black armour',20:'Mithril armour',30:'Adamant armour',40:'Rune armour',45:'Berserker helm',60:'Dragon armour',70:'Barrows armour'},
  RANGED:{5:'Oak shortbow',20:'Willow shortbow',30:'Maple shortbow',40:'Yew shortbow',50:'Magic shortbow',61:'Rune crossbow',70:'Black dragonhide'},
  PRAYER:{25:'Protect Item',37:'Protect from Magic',40:'Protect from Missiles',43:'Protect from Melee',44:'Eagle Eye',45:'Mystic Might',70:'Piety'},
  MAGIC:{13:'Fire Strike',21:'Low Level Alchemy',25:'Varrock Teleport',33:'Telekinetic Grab',35:'Fire Bolt',39:'Crumble Undead',45:'Camelot Teleport',55:'High Level Alchemy',59:'Fire Blast',75:'Fire Wave'},
  FISHING:{20:'Fly fishing',30:'Salmon',40:'Lobsters',58:'Barbarian fishing',62:'Monkfish',76:'Sharks'},
  AGILITY:{10:'Draynor rooftop',20:'Al Kharid rooftop',30:'Varrock rooftop',40:'Canifis rooftop',50:'Falador rooftop',60:"Seers' rooftop",70:'Pollnivneach rooftop',80:'Rellekka rooftop',90:'Ardougne rooftop'},
  THIEVING:{5:'Cake stall',25:'Fruit stalls',45:'Blackjacking',50:'Stealing valuables'},
  HUNTER:{9:'Copper longtails',15:'Ruby harvest',43:'Falconry',46:'Hunter Rumours'},
  RUNECRAFT:{10:'Temple of the Eye',27:'Guardians of the Rift',44:'Nature runes'},
  SMITHING:{15:"Giant's Foundry",30:'Steel bars',40:'Gold bars'},
  CRAFTING:{20:'Gem cutting'},
  COOKING:{25:'Mess hall',35:'Jugs of wine'},
  FIREMAKING:{15:'Oak logs',30:'Willow logs',45:'Maple logs',50:'Wintertodt',60:'Yew logs'},
  FLETCHING:{10:'Bow stringing',50:'Maple bows'},
  HERBLORE:{26:'Energy potions',38:'Prayer potions',52:'Super energy potions'},
  CONSTRUCTION:{20:'Mahogany Homes novice',50:'Mahogany Homes adept',70:'Mahogany Homes expert'},
  FARMING:{15:'Tree runs',36:'Farm runs'},
  SAILING:{5:'Sea charting',17:'Cargo tasks',34:'Barracuda trials'},
  SLAYER:{}, HITPOINTS:{}
};

/* Goal presets for the library */
const PRESETS = [
  {name:'Barrows gloves', sub:'Recipe for Disaster, full quest', targets:['QUEST:RFD_CULINAROMANCER']},
  {name:'All supported quests', sub:'Every quest the backend can run', all:true},
  {name:'Fairy rings', sub:'Fairytale I, then Fairytale II to the unlock', targets:['MILESTONE:FAIRY_RINGS']},
  {name:'Ancient Magicks', sub:'Desert Treasure I', targets:['QUEST:DESERT_TREASURE_I']},
  {name:'Lunar spellbook', sub:'Lunar Diplomacy', targets:['QUEST:LUNAR_DIPLOMACY']},
  {name:'Piety', sub:"King's Ransom and Knight Waves", targets:['MILESTONE:UNLOCK_PIETY']},
  {name:'Fossil Island', sub:'Bone Voyage', targets:['QUEST:BONE_VOYAGE']},
  {name:'Birdhouse runs', sub:'Bone Voyage, 9 Hunter, repeating runs', targets:['QUEST:BONE_VOYAGE'], skills:[['HUNTER',9]], extra:'REPEATING:BIRDHOUSES:99'},
  {name:'Herb and tree runs', sub:'15 Farming, repeating runs', skills:[['FARMING',15]], extra:'REPEATING:HERB_RUNS:99|REPEATING:TREE_RUNS:99'},
  {name:"Ava's accumulator", sub:'Animal Magnetism', targets:['QUEST:ANIMAL_MAGNETISM']},
  {name:'Blackjacking', sub:'The Feud (Thieving 45+)', targets:['QUEST:THE_FEUD']},
  {name:'Guardians of the Rift', sub:'Temple of the Eye (Runecraft 27+)', targets:['QUEST:TEMPLE_OF_THE_EYE']},
  {name:'Barbarian fishing', sub:'Barbarian Training, fishing part', targets:['QUEST:BARBARIAN_TRAINING']},
  {name:'Kingdom of Miscellania', sub:'Royal Trouble, then managed kingdom', targets:['QUEST:ROYAL_TROUBLE'], extra:'REPEATING:KINGDOM:MAHOG:HERB'},
  {name:'Dragon defender', sub:'Attack + Strength 130', targets:['MILESTONE:DRAGON_DEFENDER']},
  {name:'Black mask', sub:'Cabin Fever and 58 Slayer', targets:['MILESTONE:BLACK_MASK']},
  {name:'Dwarven rock cake', sub:'RFD: Mountain Dwarf', targets:['MILESTONE:ROCK_CAKE']},
  {name:"Rogues' outfit", sub:'50 Agility, 50 Thieving', targets:['MILESTONE:ROGUES_OUTFIT']},
  {name:'Imbued god cape', sub:'Mage Arena I and II', targets:['QUEST:MA2']},
  {name:'Monkey Madness II', sub:'Heavy ballista, zenyte access', targets:['QUEST:MONKEY_MADNESS_II']},
  {name:'Prifddinas', sub:'Song of the Elves', targets:['QUEST:SONG_OF_THE_ELVES']}
];
