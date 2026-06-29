# obsidian-go-up

> Go Upper Page

This plugin allows users to quickly navigate to a specified "parent" page by utilizing a custom property in the page's front matter.

# How to Use

1. Install the Plugin: Download and install the **Go Up plugin** in your Obsidian vault through the community plugins section.
2. Add "up" Property: In your note, include an up property in the front matter. <br/>

    For example:

    ```yaml
    ---
    up: "[[ParentNote]]"
    ---
    ```

    Replace ParentNote with the link to the page you wish to navigate to. <br/>

    or you can use Multiple Pages in "up" Property like this <br />

    ```yaml
    ---
    up:
     - "[[ParentNote1]]"
     - "[[ParentNote2]]"
    ---
    ```

3. Set a Hotkey: Open **Settings → Hotkeys**, search for "Go Up", and bind the command you want (see **Commands** below). <br />
   I recommend `Cmd + Shift + U` to navigate to the specified parent page.


# Commands

The plugin adds two commands you can bind to separate hotkeys, depending on whether you want the current note to stay open:

| Command | Behavior |
| --- | --- |
| **Navigate to parent page** | Replaces the current note with the parent. If the current note is **pinned**, it is kept open instead. If the parent is **already open** in another tab, that tab is focused and the current note is closed (no duplicate tab). |
| **Navigate to parent page in new tab** | Keeps the current note open. If the parent is **already open**, focus simply switches to it; otherwise the parent opens in a new tab next to the current note. |

When the `up` property lists multiple parents, a picker is shown first and the chosen parent then follows the behavior above.


# Customize your own parent property

go to setting tab "Go Up" and fill out Parent property to use "parent" notes.

![setting tab](./public/setting.png)
