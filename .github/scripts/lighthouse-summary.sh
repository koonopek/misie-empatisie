#!/usr/bin/env bash
#
# Renders a Lighthouse CI manifest as the markdown body of the PR comment.
#
# Usage: .github/scripts/lighthouse-summary.sh <manifest.json> [run-url]

set -euo pipefail

manifest="${1:?usage: lighthouse-summary.sh <manifest.json> [run-url]}"
run_url="${2:-}"

if [ ! -s "$manifest" ]; then
    echo "No Lighthouse manifest at $manifest" >&2
    exit 1
fi

echo "### Lighthouse (mobile, emulated slow 4G)"
echo

jq -r '
    def score($value):
        if $value == null then "–"
        else
            (if $value >= 0.9 then "🟢" elif $value >= 0.5 then "🟠" else "🔴" end)
            + " " + ($value * 100 | round | tostring)
        end;

    ["| Page | Performance | Accessibility | Best practices | SEO |",
     "| --- | --- | --- | --- | --- |"]
    + [ .[]
        | select(.isRepresentativeRun)
        | "| [" + (.url | sub("^https?://[^/]+"; "")) + "](" + .url + ")"
          + " | " + score(.summary.performance)
          + " | " + score(.summary.accessibility)
          + " | " + score(.summary["best-practices"])
          + " | " + score(.summary.seo)
          + " |" ]
    | .[]
' "$manifest"

echo
if [ -n "$run_url" ]; then
    echo "Full reports are attached to [the workflow run]($run_url) as an artifact."
else
    echo "Full reports are attached to the workflow run as an artifact."
fi
