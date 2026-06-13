# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**obsidian-go-up** is an Obsidian plugin that enables hierarchical navigation through notes by utilizing a customizable parent property in frontmatter. Users can navigate to parent pages via keyboard shortcut, supporting both single and multiple parent pages with a modal selection UI.

## Build & Development Commands

```bash
# Development mode (watch + rebuild)
npm run dev

# Production build (type-check + bundle)
npm run build

# Version bump (updates manifest.json and versions.json)
npm run version
```

The build system uses esbuild configured in `esbuild.config.mjs`:
- Entry point: `src/main.ts`
- Output: `main.js` (bundled for Obsidian)
- Dev mode includes inline sourcemaps and watch mode
- Production mode strips sourcemaps and exits after build

## Architecture

### Core Navigation Flow

1. **main.ts** (`goUp` class) - Plugin entry point
   - Registers the "Go upper page" command
   - Manages settings (customizable parent property name, auto-add on creation)
   - Reads frontmatter from active file using Obsidian's metadata cache
   - Routes to `goSinglePage` or `goMultiPage` based on property type
   - Uses private method `#goPage` bound to `app.workspace.openLinkText`

2. **goSinglePage.ts** - Handles single parent navigation
   - Extracts page name from wiki-link format `[[PageName]]`
   - Resolves aliases to actual page names
   - Directly navigates to parent page

3. **goMultiPage.ts** - Handles multiple parent navigation
   - Filters and normalizes array of parent links
   - If only one valid parent remains, navigates directly
   - Otherwise, opens `MultiPageModal` for user selection

4. **modal/MultiPageModal.ts** - Interactive parent selection
   - Extends `SuggestModal` from Obsidian API
   - Provides filtered search through available parent pages
   - Executes navigation on selection

### Utility Functions

Located in `src/utils/`:
- **getPageName.ts** - Regex-based extraction of page names from `[[...]]` format
- **checkAlias.ts** - Detects if a page reference includes an alias (format: `[[page|alias]]`)
- **getPageNameInAlias.ts** - Extracts actual page name from aliased references
- **makeNotice.ts** - Creates temporary notification UI elements

### Settings System

**setting.ts** (`goUpSettingTab` class):
- Configurable parent property name (default: `"up"`)
- Toggle for auto-adding parent property on file creation
- Changes trigger `applySettings()` which re-registers the create file event

### Auto-Parent Feature

When enabled (`addUpPropertyOnCreate: true`):
- Listens to vault's `"create"` event (main.ts:60-77)
- Automatically adds parent property to new files
- Sets value to `[[ParentFolderName]]` using file's parent directory
- Uses `processFrontMatter` API for safe YAML manipulation

## Type Definitions

**types/goPage.d.ts**:
- `goPageType` - Function signature matching Obsidian's `openLinkText` method
- `propertiesType` - Frontmatter property structure (`{[key: string]: string[] | null}`)

## Key Technical Details

- **Private fields**: Uses `#` syntax for truly private class members (e.g., `#goPage`, `#activeNotice`)
- **Notice debouncing**: Prevents spam by checking `#activeNotice` before showing new notifications
- **Event lifecycle**: Properly unregisters create file event when settings change or plugin unloads
- **Strict null checks**: Enabled in tsconfig.json - always check for `null`/`undefined` before use
- **Type safety**: Never use `any` type - create proper interfaces as per global CLAUDE.md rules
