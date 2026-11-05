# BenKen Stage Pro™ website

English product website in Navy & Copper, redesigned 5 November 2026.

## Pages
- index.html: overview, screenshots, features, latest additions.
- tutorials.html: searchable written guides and future YouTube video area.
- help.html: common questions and support information.

Publish the main branch from / (root) on GitHub Pages. No build step or dependencies. Keep CNAME as benkenstagepro.com.

## Add YouTube later
Edit tutorials-data.js. Set youtubeChannel to the confirmed https://www.youtube.com/@... address. Add videos with title, description and url fields, using confirmed YouTube links. The page replaces the coming-later panel automatically. Only HTTPS youtube.com, www.youtube.com and youtu.be URLs are accepted. Videos open on YouTube; no player or tracker loads automatically.

## Maintain the guides
Edit the guides array in tutorials-data.js. Keep each id unique and unchanged so existing links keep working. Fields: id, category, title, summary, steps, note, image. Category choices are Getting started, Rehearsal, Live setup and Sharing. Add or change categories in tutorials.html as needed.

## App screenshots
Screenshots show demo content. stage.png and capo.png were refreshed from Web V26.105. The tuner screenshot uses a demonstration signal. Actual device behaviour still needs physical testing. Keep the development status and do not add a fake App Store, YouTube, pricing or support link.

The pre-redesign source is preserved in Website_Archive/2026-11-05_before_redesign in the local workspace.

Made for BenKen™
Copyright © Kenneth Hjelle 2026.
