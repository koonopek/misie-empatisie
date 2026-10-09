# misie-empatisie.pl

Static site for the Misie Empatisie preschool. There is no build step — the
HTML, CSS, images and JavaScript in this repository are exactly what gets
served.

- Production: <https://misie-empatisie.pl>, published from the root of `main`
  (Settings → Pages → "Deploy from a branch"), with the custom domain pinned by
  `CNAME`.
- Locally: `python3 -m http.server 8000` and open <http://localhost:8000>.

## Pull request previews

Every pull request opened from a branch of this repository gets its own live
copy of the site:

```
https://misie-empatisie.pl/pr-preview/pr-<number>/
```

A comment on the pull request links to it, the link refreshes on every push,
and the preview is deleted when the pull request is closed or merged.

What `.github/workflows/pr-preview.yml` does:

1. `.github/scripts/build-preview.sh` collects the committed site files into
   `_site/`, dropping everything that is not part of the published site
   (workflow files, the Lighthouse PDFs, other pull requests' previews) and
   adding a `noindex, nofollow` tag to every page.
2. `rossjrw/pr-preview-action` commits `_site/` to `main` under
   `pr-preview/pr-<number>/`. GitHub Pages only ever publishes one branch, so a
   preview has to live next to production to be reachable; the commits never
   touch anything outside their own directory.
3. Lighthouse audits the deployed preview and posts the scores as a second
   comment, with the full reports attached to the run as an artifact. The
   scores are advisory — a shared CI runner is too noisy to gate merges on.

Notes:

- The workflow requests the permissions it needs itself, so the repository-wide
  "Workflow permissions" setting can stay read-only. If a run ever fails with a
  403 while pushing, check Settings → Actions → General.
- Previews carry `noindex, nofollow` so they cannot compete with the real pages
  in search results. Lighthouse would score that as a failed SEO audit, so
  `.github/lighthouse/lighthouserc.json` skips `is-crawlable`; every other SEO
  audit still counts.
- Pull requests from forks get no preview, because their token cannot write to
  this repository.
- Previews for open pull requests are visible in `main`. They disappear when the
  pull request closes.

If those preview directories in `main` ever get in the way, there are two ways
out, both needing setup outside this repository: deploy previews to a second
repository (the action's `deploy-repository` input plus a token secret), or move
hosting to Cloudflare Pages or Netlify, which give every branch and every pull
request its own URL without committing anything.
