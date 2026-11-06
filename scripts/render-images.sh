#!/usr/bin/env bash
# Renders the extension icons and the Chrome Web Store images from the SVG/HTML
# sources with headless Chrome. Run it after changing docs/icon.svg, docs/hero.svg
# or anything in store/.
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

render() {
  local source="$1" output="$2" width="$3" height="$4" background="$5"

  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --user-data-dir="$TMP/profile" --default-background-color="$background" \
    --window-size="$width,$height" --screenshot="$output" "file://$source" >/dev/null 2>&1
}

mkdir -p icons store/images

for size in 16 32 48 128; do
  cat >"$TMP/icon.html" <<EOF
<!doctype html><html><body style="margin:0;background:transparent">
<img src="file://$ROOT/docs/icon.svg" style="display:block;width:${size}px;height:${size}px">
</body></html>
EOF
  render "$TMP/icon.html" "icons/icon$size.png" "$size" "$size" 00000000
done

render "$ROOT/store/screenshot.html" store/images/screenshot-1280x800.png 1280 800 ffffffff
render "$ROOT/store/promo-small.html" store/images/promo-small-440x280.png 440 280 ffffffff

ls -l icons store/images
