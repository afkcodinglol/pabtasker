# OSRS Account Builder

A visual task-list planner for Old School RuneScape account builders that read a `TASK:ARGS` list format
(`QUEST:...`, `SKILL:...:LEVEL`, `MINIGAME:...`, `DIARY:...`, `ACQUIRE:...` and so on). Pick goals, and it
builds an ordered, requirement-checked task list you can export straight into the bot.

It is a single HTML file: no install, no server, nothing leaves your browser.

## Using it

1. Download `TaskSequencer.html` and open it in any modern browser.
2. Pick an account type (Ironman, Hardcore ironman or Main, with an optional Pure toggle).
3. Click goals in the library (quests, diaries, milestones, minigames) or set end-goal levels in the skill panel.
4. Run **Optimize**, then **Export** and paste the list into your account builder.

Your list and settings are saved in the browser's local storage.

## Features

- **Goal planning**: clicking a goal (for example Recipe for Disaster) adds every prerequisite quest and skill
  level in a working order, following the OSRS Wiki optimal quest guide (ironman or main order).
- **Requirement checking**: every task is simulated in order; unmet requirements are flagged with a "Fix here"
  button and the task number where each requirement is reached.
- **Quest XP first**: quests that give XP in the skills you are short on are done instead of training, valued
  across every skill they help with (Waterfall Quest for Attack and Strength before Demon Slayer, for example).
  XP lamps are assigned automatically.
- **Training in chunks**: skill training is split at tool, gear and method milestones and capped at a maximum task
  time, and the same skill is never trained twice in a row when something else can go between.
- **Ironman support**: gp-free methods (Arceuus Library, mess hall, Wintertodt), coin quests for steel tools, and
  `ACQUIRE` tasks that gather quest items and training supplies right before they are needed. Gathers are sized
  in whole inventories so the bank never drops below the trigger amount, and the skills needed to gather an item
  are trained first.
- **Hardcore ironman**: every plan opens with 9 Magic and Witch's House.
- **Pure mode**: never trains Defence, never puts a lamp on it, and skips quests that give Defence XP.
- **Optimize, Shuffle and Variety**: optimize rebuilds the list and shows a summary of the changes; shuffle
  reorders slightly without breaking requirements or adding time; variety picks between near-equal plans so
  lists differ from each other.
- **Shopping list**: every quest item the list needs, plus training supplies, in two separate lists.
- **Library filters**, including quests that give combat XP sorted by fewest requirements.

## Building from source

The app is written as separate files and inlined into one HTML file:

```
src.html        layout, styles and dialogs
js/data.js      skills, quests, diaries, milestones, training methods and XP rates
js/engine.js    state simulation, requirement checks and the planner
js/items.js     quest items, training supplies and ACQUIRE task generation
js/ui.js        the interface
build.py        inlines the scripts into TaskSequencer.html
```

After changing anything, rebuild with Python 3:

```
python build.py
```

Then reload `TaskSequencer.html`. Commit the rebuilt file along with your changes so the download stays current.

## Contributing

Issues and pull requests are welcome, especially corrections to quest requirements, XP rewards, item lists
and training rates. Please keep the interface free of emojis.

## Data sources and disclaimer

Quest requirements, XP rewards, item lists and the optimal quest order are compiled from the
[Old School RuneScape Wiki](https://oldschool.runescape.wiki/), whose content is available under
[CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/).

This is an unofficial fan project. It is not affiliated with or endorsed by Jagex or by the authors of any
account builder plugin. Old School RuneScape and RuneScape are trademarks of Jagex Ltd. Using third-party
automation may break the game's rules; you are responsible for how you use this tool.

## License

The code is released under the [MIT License](LICENSE).
