---
title: "One keystroke to a project: building a tmux session launcher with fzf"
description: "A ~60 line zsh function that fuzzy-finds any project on your machine, creates it if it doesn't exist, and drops you into a pre-laid-out tmux session. Full source, dependency setup, and a line-by-line breakdown."
pubDate: 2026-08-02
author: "Kamil Rogozinski"
tags: ["tmux", "zsh", "fzf", "tooling", "productivity"]
---

I hit `Ctrl-F` more than any other key combination on this machine.

It runs a shell function called `fts` — "find tmux session," which is not a good name but it's four years too late to change it. I press it, a fuzzy finder opens listing every project directory I have, I type a few characters, and I'm sitting in a tmux session for that project with the panes already laid out. If the session already existed, I'm back in it exactly where I left off. If what I typed doesn't exist yet, it offers to create it.

Somebody watched me do this over a screen share recently and asked what was going on. So: here's the whole thing, the four tools it's built on, and a breakdown of every part that isn't obvious.

**What you'll end up with:**

- One keystroke from anywhere to any project
- Fuzzy search across every repo you own, with a live directory tree preview
- Type a name that doesn't exist → it offers to scaffold and place it
- Never accidentally start a second tmux session for a project you already have open
- The same window/pane layout in every project, every time

## The problem it solves

Before this, starting work looked like:

```sh
cd ~/repo/work/some-project-i-half-remember-the-name-of
tmux new-session -s some-project
# split some panes, badly, slightly differently each time
```

Three or four commands, one of which needed me to remember a path. None of it hard. All of it friction at exactly the wrong moment — the moment you've decided to start something, which is the moment you're most likely to get distracted instead.

I'd also collected tmux sessions named `0`, `1`, `2` and `some-project-2`, because I kept starting new ones instead of attaching to the one already running.

So the goal wasn't really speed. It was making the right thing the automatic thing.

## Prerequisites

Four tools plus zsh. All four are worth having on their own, and three of them are things you'll reach for daily once installed.

| Tool | Version I'm on | What it does here |
| --- | --- | --- |
| [**tmux**](https://github.com/tmux/tmux) | 3.6a | The terminal multiplexer. Holds the sessions, windows and panes. |
| [**fzf**](https://github.com/junegunn/fzf) | 0.67.0 | The fuzzy finder. Every picker in this function is fzf. |
| [**fd**](https://github.com/sharkdp/fd) | 10.3.0 | A faster, friendlier `find`. Generates the list of directories. |
| [**eza**](https://github.com/eza-community/eza) | 0.23.4 | A modern `ls`. Draws the tree preview inside fzf. |
| **zsh** | 5.9 | The shell. `read -q` and the `zle` keybinding are zsh-specific. |

### Install

**macOS (Homebrew):**

```sh
brew install tmux fzf fd eza
```

**Debian / Ubuntu:**

```sh
sudo apt install tmux fzf fd-find
# eza needs its own repo on older releases — see eza-community/eza#installation
# and note the fd binary is called `fdfind` on Debian; symlink or alias it to `fd`
```

**Arch:**

```sh
sudo pacman -S tmux fzf fd eza
```

### Why these, specifically

**fd over `find`.** The important part isn't speed, it's that `fd` respects `.gitignore` by default. Without that, the picker list is 90% `node_modules` and the whole thing is unusable. You can do the same with `find` and a pile of `-prune` flags, but you'll write them once and never touch them again.

**eza over `tree`.** `eza --tree --level=2 --color=always --icons` is one command that gives a colourised, icon'd, gitignore-aware two-level tree. `tree` can get close but not with the same flags-to-output ratio.

**fzf.** No substitute. `--print-query` in particular — covered below — is what makes the create-if-missing flow possible at all.

**tmux ≥ 1.8** for the commands used here. Anything from the last decade is fine.

### Bash instead of zsh?

The function is mostly POSIX-ish, but three bits are zsh:

- `read -q "confirm?Proceed? [y/N] "` → in bash: `read -n 1 -p "Proceed? [y/N] " confirm`
- `<<<"$fzf_out"` (herestring) → bash has this too, you're fine
- The `zle` widget at the end → bash equivalent is `bind -x '"\C-f": fts'`

Everything else ports directly.

## The full function

Copy-paste this into your `~/.zshrc`. The only thing you need to change is `FTS_ROOT` — mine is `~/repo`, with projects grouped one level deeper into `work`, `learning`, `college`, `openSource`.

```sh
# ---- fts: find tmux session ----
FTS_ROOT="${FTS_ROOT:-$HOME/repo}"

fts() {
  local dir query selection fzf_out

  # --print-query: line 1 = typed query, line 2 = selected match
  fzf_out=$(fd --type d . "$FTS_ROOT" 2>/dev/null | fzf \
    --height 40% \
    --reverse \
    --print-query \
    --prompt="Directory: " \
    --preview 'eza --tree --level=2 --color=always --icons --ignore-glob "node_modules" {}' \
    --preview-window=right:50%)

  query=$(sed -n '1p' <<<"$fzf_out")
  selection=$(sed -n '2p' <<<"$fzf_out")

  if [[ -n "$selection" ]]; then
    dir="$selection"
  elif [[ -n "$query" ]]; then
    # No match, but something was typed → treat it as a new project name
    local sanitized
    sanitized=$(echo "$query" | tr -cs 'a-zA-Z0-9_-' '-' | sed 's/^-//;s/-$//')
    [[ -z "$sanitized" ]] && return

    local parent
    parent=$(fd --type d --max-depth 1 . "$FTS_ROOT" 2>/dev/null | fzf \
      --height 30% \
      --reverse \
      --prompt="Create '$sanitized' inside: ")
    [[ -z "$parent" ]] && return

    dir="${parent%/}/$sanitized"

    echo "Creating $dir"
    read -q "confirm?Proceed? [y/N] " || { echo; return }
    echo
    mkdir -p "$dir"
  else
    return  # escaped out — do nothing
  fi

  local session_name
  session_name=$(basename "$dir" | tr ' ./:' '_' | tr -s '_')

  # Already running? Attach and stop.
  if tmux has-session -t "$session_name" 2>/dev/null; then
    if [[ -n "$TMUX" ]]; then
      tmux switch-client -t "$session_name:main"
    else
      tmux attach-session -t "$session_name:main"
    fi
    return
  fi

  # Window 1 (main): single pane
  tmux new-session -d -s "$session_name" -c "$dir" -n main

  # Window 2 (dev): big left pane, two stacked on the right
  tmux new-window   -t "$session_name"       -c "$dir" -n dev
  tmux split-window -h -t "$session_name:dev" -c "$dir"
  tmux split-window -v -t "$session_name:dev" -c "$dir"
  tmux select-pane  -t "$session_name:dev" -L

  tmux select-window -t "$session_name:main"

  if [[ -n "$TMUX" ]]; then
    tmux switch-client -t "$session_name"
  else
    tmux attach-session -t "$session_name"
  fi
}

# ---- bind it to Ctrl-F ----
fts-widget() {
  BUFFER="fts"
  zle accept-line
}
zle -N fts-widget
bindkey '^F' fts-widget
```

Then `source ~/.zshrc` and hit `Ctrl-F`.

The rest of this post is what each part is doing and why.

## Step 1: the picker, and the `--print-query` trick

```sh
fzf_out=$(fd --type d . "$FTS_ROOT" 2>/dev/null | fzf \
  --height 40% \
  --reverse \
  --print-query \
  --prompt="Directory: " \
  --preview 'eza --tree --level=2 --color=always --icons --ignore-glob "node_modules" {}' \
  --preview-window=right:50%)
```

Flag by flag:

- `--height 40%` — fzf renders in the bottom 40% of the terminal instead of taking the whole screen. Your scrollback stays visible, which makes it feel like a prompt rather than a mode you've entered.
- `--reverse` — list grows downward from the prompt at the top. Personal preference; try both.
- `--prompt="Directory: "` — labels what you're picking. Matters more once you have several fzf-driven tools and they all look identical.
- `--preview` — runs a command on the highlighted line. `{}` is substituted with that line.
- `--preview-window=right:50%` — where the preview goes.

The preview was a late addition and it changed how the tool feels. When you've got three directories with similar names, two levels of tree tells you instantly which one is the real project and which one you abandoned in March.

Now the important flag. **`--print-query`**.

By default fzf prints what you selected. With `--print-query`, it prints two lines: what you *typed*, then what you *selected*. If your query matched nothing, line two is empty.

```sh
query=$(sed -n '1p' <<<"$fzf_out")      # line 1
selection=$(sed -n '2p' <<<"$fzf_out")  # line 2
```

That's the whole trick. An empty line two isn't a failure — it's a different intent. You didn't fail to find a project, you named one that doesn't exist yet. The picker becomes a creator with no second command and no flag, and I never have to decide which mode I'm in before I start typing.

Three branches follow:

```sh
if   [[ -n "$selection" ]]; then  # picked something → open it
elif [[ -n "$query"     ]]; then  # typed something unmatched → create it
else                              # nothing at all → do nothing
```

That third branch matters as much as the others. Hitting `Esc` has to be completely free. A tool you reach for reflexively needs a zero-cost way to back out, or you stop reaching for it reflexively.

## Step 2: creating a project, carefully

This is the only place `fts` touches the filesystem, so it's the only place it asks permission.

```sh
sanitized=$(echo "$query" | tr -cs 'a-zA-Z0-9_-' '-' | sed 's/^-//;s/-$//')
```

`tr -cs 'a-zA-Z0-9_-' '-'` reads as: take the set of alphanumerics, hyphen and underscore; `-c` **complements** it (so we're now matching everything *not* in that set); replace those with `-`; `-s` **squeezes** runs of the replacement into one.

So `my new API client!!` becomes `my-new-API-client-`, and the `sed` trims the leading/trailing hyphen → `my-new-API-client`. It's there because I type project names in prose and don't want to think about casing or spaces.

```sh
parent=$(fd --type d --max-depth 1 . "$FTS_ROOT" 2>/dev/null | fzf \
  --height 30% --reverse --prompt="Create '$sanitized' inside: ")
```

A second fzf, this time `--max-depth 1`, to pick which top-level bucket it lands in. That's my taxonomy, but the idea generalises: a new directory needs a home, and picking one from a list beats typing a path.

```sh
read -q "confirm?Proceed? [y/N] " || { echo; return }
```

`read -q` is zsh's single-keypress read — it returns 0 only on `y`/`Y`, and the text after the `?` is the prompt. It's the last gate before anything is written. I'd keep it even though it costs a keystroke every time, because a fuzzy finder that silently creates directories on a typo is one you learn to distrust.

## Step 3: naming the session

```sh
session_name=$(basename "$dir" | tr ' ./:' '_' | tr -s '_')
```

tmux session names can't contain `.` or `:` — those are its own separators for windows and panes, so `mysession:dev` already means something. Spaces are legal but painful to type in `-t` targets. All three get mapped to `_`, and `tr -s '_'` squeezes runs down to one so `my..project` doesn't become `my__project`.

## Step 4: the check that stops duplicate sessions

```sh
if tmux has-session -t "$session_name" 2>/dev/null; then
  if [[ -n "$TMUX" ]]; then
    tmux switch-client -t "$session_name:main"
  else
    tmux attach-session -t "$session_name:main"
  fi
  return
fi
```

This is the highest-value block in the function. `has-session` exits 0 if a session by that name exists — check first, attach if it's there, build only if it isn't. `fts` on a project I opened this morning is a two-keystroke return to exactly where I was. `fts` on a fresh one builds it. Same command either way, and I never have to know which case I'm in.

**The `$TMUX` gotcha.** `$TMUX` is set whenever you're inside a tmux session. If you are and you call `attach-session`, you get **nested tmux** — a session rendered inside a session, two status bars, and a prefix key that now goes to the wrong one. What you actually want from inside tmux is `switch-client`, which moves your existing client to a different session.

Every tmux helper script I've written has needed this branch eventually. If you write your own, put it in from the start.

## Step 5: building the layout

```sh
tmux new-session -d -s "$session_name" -c "$dir" -n main

tmux new-window   -t "$session_name"       -c "$dir" -n dev
tmux split-window -h -t "$session_name:dev" -c "$dir"
tmux split-window -v -t "$session_name:dev" -c "$dir"
tmux select-pane  -t "$session_name:dev" -L

tmux select-window -t "$session_name:main"
```

Two flags carry most of the weight:

- `-d` creates the session **detached**, so all the setup happens off-screen. Without it you'd watch the panes get built.
- `-c "$dir"` sets the working directory for the session and every window/pane created with it. Without this everything starts in `$HOME` and you `cd` four times.

The targeting syntax is `session:window` — `"$session_name:dev"` means "the window called `dev` in this session". `split-window -h` splits horizontally (side by side), `-v` vertically (stacked). `select-pane -L` moves focus to the pane on the **L**eft.

What you get:

```
┌─ main ────────────────┐   ┌─ dev ──────────┬──────────┐
│                       │   │                │  server  │
│      (one pane)       │   │   (editor /    ├──────────┤
│                       │   │    scratch)    │   logs   │
└───────────────────────┘   └────────────────┴──────────┘
```

**main** is one full-width pane — editor, or an agent, or whatever I'm actually doing. **dev** is a big left pane with two stacked on the right: dev server top, tests or logs bottom.

The last `select-window` returns to `main`, so `dev` sits pre-arranged and waiting the first time I switch to it rather than needing setup mid-flow.

I'm not proposing this layout — it's just the one I converged on. The value isn't the arrangement, it's that it's the *same* arrangement every time, so my hands know where things are without looking.

## Step 6: binding it to a key

Running `fts` still meant typing `fts`. Three characters, but three characters at the shell prompt, competing with whatever I was half-typing.

```sh
fts-widget() {
  BUFFER="fts"
  zle accept-line
}
zle -N fts-widget
bindkey '^F' fts-widget
```

This is **zle**, the Zsh Line Editor:

- `BUFFER` is the current command line as a string. Assigning to it replaces whatever you'd typed.
- `zle accept-line` presses Enter for you.
- `zle -N fts-widget` registers the function as a widget so it can be bound.
- `bindkey '^F' fts-widget` maps `Ctrl-F` to it. `^F` is zsh notation for Ctrl-F.

`Ctrl-F` normally moves the cursor forward one character in emacs mode. I never used it — right arrow exists. Check what you're overwriting with `bindkey | grep '\^F'` before you take a binding, but *do* take one. The difference between a three-character command and a keystroke is the difference between a tool you use and a tool you use without thinking about it, and only the second kind actually changes anything.

**Bash version:**

```sh
bind -x '"\C-f": fts'
```

## Troubleshooting

**"Nothing shows up in the picker."** `fd` respects `.gitignore` and skips hidden directories. If your projects live somewhere ignored, add `--hidden --no-ignore` — you'll want a `--exclude .git` alongside it.

**"sessions have weird truncated names."** `basename` on a path with a trailing slash returns something you didn't expect. `${dir%/}` strips it; add that if you're feeding paths in from elsewhere.

**"I get two status bars."** That's nested tmux — see the `$TMUX` check in step 4.

**"`read -q` : command not found."** You're in bash. Use `read -n 1 -p "Proceed? [y/N] " confirm` and test `[[ $confirm == [yY] ]]`.

**"The preview is blank."** `eza` isn't installed or isn't on `PATH` inside fzf's subshell. Test with `eza --tree --level=2 .` first.

## Making it yours

The two things most worth changing:

**The root.** Set `FTS_ROOT` in your `.zshrc` before the function, or export it per-machine. If your projects aren't under a single tree, feed fzf multiple `fd` calls:

```sh
{ fd --type d . ~/repo; fd --type d --max-depth 2 . ~/work; } | fzf ...
```

**The layout.** Everything in step 5 is just tmux commands. Want three windows? Add another `new-window`. Want a server running the moment the session exists?

```sh
tmux send-keys -t "$session_name:dev.{top-right}" 'bun dev' C-m
```

`C-m` is Enter. Note the `{top-right}` rather than a pane number — tmux accepts positional pane targets, and they're worth using here because numeric indices depend on whether you've set `pane-base-index 1` in your `tmux.conf`. I have, so `dev.1` on my machine is the left pane and on a default install it's the top right. Positional targets don't care.

I don't actually do this — different projects have different start commands and I'd rather type it than have the wrong one fire — but it's one line if you want it.

## What I'd still change

Some honesty, since it's easy to write a post like this and imply the thing is finished:

**Session names collide on basename.** `~/repo/work/api` and `~/repo/learning/api` both want to be `api`, and the second silently attaches to the first. I've been lucky rather than careful. The fix is to derive the name from the path relative to `FTS_ROOT` — `work_api`, `learning_api`.

**It doesn't know about git worktrees.** They show up as ordinary directories, so you can end up with a session per worktree and nothing in the name telling you which branch you're in.

**Every project gets the same two windows.** A Go CLI and a Next.js app get identical treatment. A `.tmux-layout` file it checked for would be the obvious next step; I keep not writing it because the generic layout has been fine.

None of these have cost me enough to fix, which is worth stating plainly. This is a tool that's been good enough for a long time, not one that's been polished.

## Takeaways

If you don't want `fts` specifically, take the shape:

1. **Find the friction that isn't hard, just repeated.** Mine was four commands and a remembered path. It never registered as a problem because no single instance was one.
2. **Make the right thing automatic, not just fast.** The `has-session` check is the most valuable line here and it has nothing to do with speed — it makes the correct behaviour the one that takes no thought.
3. **Handle the miss.** `--print-query` turned "you typed something that doesn't exist" from an error into a feature. Plenty of tools have a branch like that sitting unused.
4. **Bind it.** An unbound tool is one you have to decide to use.

The whole thing lives in my `.zshrc` between an alias block and a function that opens the current repo's PR page in a browser. No tests, no repo, no README. Best return-on-effort code I've written this year, and it took an afternoon.

Not everything has to be a project.

---

*If you build a version of this, I'd genuinely like to see it — especially the layout section, since that's the part everyone does differently.*
