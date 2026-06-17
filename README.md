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

3. Use the Keyboard Shortcut: With the up property set, you can set the Keyboard Shortcut. <br />
   i recommend `Cmd + Shift + U` to navigate to the specified parent page.


# Customize your own parent property

go to setting tab "Go Up" and fill out Parent property to use "parent" notes.

![setting tab](./public/setting.png)
