#!/usr/bin/env bash
# Builds the ZIP to upload to the Chrome Web Store (and Edge Add-ons):
# only the files the extension runs, named after the manifest version.
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION="$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json)"
OUTPUT="dist/azure-pr-review-keys-$VERSION.zip"

mkdir -p dist
rm -f "$OUTPUT"
zip -q -X "$OUTPUT" manifest.json content.js icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png

unzip -l "$OUTPUT"
echo "Created $OUTPUT"
