# Chrome Web Store listing

Copy each field into the matching place in the developer dashboard.

## Package

- **ZIP:** `dist/azure-pr-review-keys-<version>.zip`, created by `./scripts/package.sh`

## Store listing

- **Name:** Azure PR Review Keys
- **Summary** (from `manifest.json`, max. 132 characters): Keyboard shortcuts for reviewing Azure DevOps pull requests: next and previous change, mark a file as reviewed.
- **Category:** Developer Tools
- **Language:** English
- **Store icon (128×128):** `icons/icon128.png`
- **Screenshot (1280×800):** `store/images/screenshot-1280x800.png`
- **Small promo tile (440×280):** `store/images/promo-small-440x280.png`
- **Homepage URL:** https://github.com/gustavos00/azure-pr-review-keys
- **Support URL:** https://github.com/gustavos00/azure-pr-review-keys/issues

### Description

```
Review Azure DevOps pull requests without leaving the keyboard.

Instead of hunting with the mouse for the next change and for each file's review checkbox, jump from block to block with the arrow keys and close each file with one shortcut that takes you straight to the next file left to review.

SHORTCUTS (Ctrl instead of ⌘ on Windows and Linux)
• ⌘ ↓  Next change. At the end of a file, moves on to the next file.
• ⌘ ↑  Previous change.
• ⌘ Enter  Marks the file as reviewed and opens the next file you haven't reviewed yet. On a file that is already reviewed, removes the mark.

DETAILS
• Works on the Files tab of any pull request on dev.azure.com and *.visualstudio.com.
• Works with one file at a time and with all files in a single scroll.
• Stays out of the way: while you type a comment the shortcuts are off, so ⌘ Enter still posts the comment.
• The current block gets a blue bar and a small toast confirms each file you mark.
• Messages in English, or in Portuguese when the browser is in Portuguese.

PRIVACY
No permissions, no data collected or stored, no network requests. A single script that only runs on Azure DevOps pages and only reacts to the three shortcuts.

Open source (MIT): https://github.com/gustavos00/azure-pr-review-keys
```

## Privacy practices

- **Single purpose:**
  > Adds keyboard shortcuts to the Files tab of Azure DevOps pull requests, to move between changes and mark files as reviewed.
- **Host permission justification** (`https://dev.azure.com/*`, `https://*.visualstudio.com/*`):
  > The content script must run on Azure DevOps pages to listen for the shortcuts and click Azure's own "Next difference" and "Mark as reviewed" controls. It runs on no other site.
- **Remote code:** No, I am not using remote code.
- **Data usage:** collects none of the listed data types. Tick the three certifications (no selling, no unrelated use, no creditworthiness use).
- **Privacy policy URL:** not required, since no user data is collected. If the dashboard asks for one, use the README's privacy section: https://github.com/gustavos00/azure-pr-review-keys#privacy

## Distribution

- **Visibility:** Public, Unlisted (only people with the link) or Private (chosen testers or a Google Workspace domain).
- **Regions:** all.
