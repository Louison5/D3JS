From https://github.com/jeremy-friesen/stackoverflow-2019-survey-world-map-d3

# 💻 Cooperates

## To replicate:

```sh
git clone https://github.com/Louison5/D3JS
python preprocess.py
```

## To see results:

You should try to set up live servers on your personal IDEs

## To coorperate using github:

If you are unfamiliar, see [Tutorial](https://missing.csail.mit.edu/2020/version-control/).
If you don't want to work this way, or with git or github, 将你的成果打包发群里，并指出哪些文件做了什么改动

Branching:

```sh
git branch <branch_name>
git checkout <branch_name>
```

Create and switch between branches to work on different features or bug fixes simultaneously.

Push Changes:

```sh
git add <file(s)>
git commit -m "Commit message"
git push origin <branch_name>
```

Add, commit, and push your changes to the remote repository on a specific branch.
Pull Changes:

```sh
git pull origin <branch_name>
```

Fetch and merge the latest changes from a remote repository into your local branch.
Merge Changes:

```sh
git checkout <target_branch>
git merge <source_branch>
```

# 🧾 Structures

## [suicide_data.json](suicide_data.json)

```
| country
| ├── year
| | ├── hdi
| | ├── ppp
| | ├── sex
| | | ├── ...
| | ├── age
| | | ├── ...
```

## [index.html](index.html)

important components: 1. timeline 2. colorbar 3. turning pages

🛠️under construction

# 📜 Quests

Here, any group member could publish some quests,

format:

quest_id.quest_raiser:quest(quest_taker)✅

Filled quests will be credited

    1.luoyc: Finish the colorbar()
