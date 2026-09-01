#!/usr/bin/env bash
#
# Assembles the copy of the site that gets published as a pull request preview.
#
# The production site is served straight from the repository root, so there is
# no build step to reuse: "building" here means collecting the published files
# and leaving behind everything that only exists for development. Listing them
# with git keeps previews limited to what is actually committed.
#
# Usage: .github/scripts/build-preview.sh [output-dir]

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

out="${1:-_site}"

rm -rf "${out:?}"
mkdir -p "$out"

while IFS= read -r -d '' file; do
    mkdir -p "$out/$(dirname "$file")"
    cp "$file" "$out/$file"
done < <(git ls-files -z -- \
    ':!:.github/**' \
    ':!:.gitignore' \
    ':!:CNAME' \
    ':!:README.md' \
    ':!:pr-preview/**' \
    ':!:*.pdf')

# Previews are served from the production domain, so search engines must be
# told to ignore them or they compete with the real pages as duplicates.
find "$out" -name '*.html' -exec sed -i \
    's|<head>|<head>\n  <meta name="robots" content="noindex, nofollow">|' {} +

unmarked=$(grep -LR 'content="noindex, nofollow"' --include='*.html' "$out" || true)
if [ -n "$unmarked" ]; then
    echo "Refusing to publish a preview: no noindex tag in" >&2
    echo "$unmarked" >&2
    exit 1
fi

echo "Preview assembled in $out/:"
find "$out" -type f | sort | sed 's/^/  /'
