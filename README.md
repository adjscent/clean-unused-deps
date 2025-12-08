# clean-unused-deps

`clean-unused-deps` is a zero-config CLI that finds unused dependencies in a Node.js project and removes them with your preferred package manager. It wraps [`depcheck`](https://github.com/depcheck/depcheck) for detection, figures out whether you are using npm, pnpm, or bun, and then runs the corresponding uninstall command for every unused package it finds.

## Features
- Detects npm, pnpm, or bun automatically via `npm_config_user_agent` and lockfiles.
- Lists every dependency that `depcheck` marks as unused before uninstalling it.
- Executes the matching uninstall command (`npm uninstall`, `pnpm remove`, or `bun remove`) so you do not have to copy/paste package names.
- Works as a one-off `npx` run or as a globally installed CLI.

## Requirements
- Node.js >= 18 (uses ES modules and the built-in `node --test` runner).
- A git workspace is strongly recommended so you can inspect changes before committing.

## Installation

```sh
# run without installing
npx clean-unused-deps

# or install globally
npm install -g clean-unused-deps
clean-unused-deps
```

## Usage
1. Change into the root of the project whose `package.json` you want to clean.
2. Run `npx clean-unused-deps` (or the globally installed binary).
3. The tool prints the detected package manager, lists every unused dependency, and removes them automatically.

Example output:

```
Detected package manager: pnpm
Unused dependencies: left-pad, colors
Running: pnpm remove left-pad colors
Unused dependencies removed successfully.
```

### What it does under the hood
1. Calls `depcheck` to analyze your project files.
2. Reads `npm_config_user_agent` or lockfiles to decide between npm, pnpm, and bun.
3. Runs the matching uninstall command with every dependency that `depcheck` reports as unused.

### Safety tips
- Commit your work (or `git stash`) before running the CLI so you can revert if needed.
- Review the list of packages printed to the console; press `Ctrl+C` if something looks wrong.
- Dynamic imports, require hooks, or tooling that loads modules by string might fool `depcheck`. Add those packages back manually if you still need them.

## Limitations
- `depcheck` uses static analysis, so it can miss dependencies that are only required through dynamic code paths.
- Only the `dependencies` section is removed today. Dev dependencies are not touched.
- The CLI currently has no `--dry-run` flag; use version control to preview changes.

## Contributing
Issues and pull requests are welcome! Please open an issue before large changes so we can discuss the approach.

## License
MIT © [adjscent](https://github.com/adjscent)
