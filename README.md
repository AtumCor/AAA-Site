# AAA at Ohio State — website starter

A colorful, fast, mobile-friendly website for the **Asian American Association at The Ohio State University**.

**Hosting:** GitHub Pages (100% static).  
**Editing:** [Pages CMS](https://app.pagescms.org), a visual content editor for future executive boards.  
**Tech:** HTML + CSS + vanilla JavaScript. No Node.js, React, package installs, database, secrets, or build process are needed.

## What is included?

- Home, Our Story, The Board, Events, and Contact pages.
- Smooth animated transitions between pages (including a reduced-motion accessibility option).
- Responsive design and mobile navigation.
- Editable executive board cards with name, photo, title, bio, and optional Instagram link.
- Events page with upcoming event cards, photo flyers, and a browseable archive grouped by past semester. When an event date passes, it disappears from the homepage upcoming list and moves automatically into the archive.
- An Instagram *highlights* section: add links to real posts and optionally upload cover images. Clicking each card opens that post.
- Instagram profile link and an email-based collaboration form that opens a draft in the visitor's email application.
- A visual editor so future maintainers can add and update content with almost no technical knowledge.

## Important before sharing the URL

The initial names are from the **public Ohio State student organization directory**, NOT a verified current-term e-board roster. Check everyone's role and photo consent before public launch. The draft term label explicitly calls this out.

- Public directory lists: Markus Frijas (primary leader), Lina Fang (secondary leader), and Ananya Swarup (treasurer). Roles are shown as listed, **not guessed as president/vice-president**.
- Public organization Instagram: https://www.instagram.com/aaaohiostate/
- Public organization email: aaaohiostate@gmail.com
- The collaboration email currently goes to the general inbox; replace it with the president's preferred organization contact address after confirming it.

The source is the [Ohio State Student Activities listing](https://activities.osu.edu/involvement/student-organizations/find-a-student-org/?c=Columbus&i=32e46e5a-74ec-4192-b850-904802296b63&page=7). Public contact details and roles can change.

## Publish to GitHub Pages (one-time setup)

1. Make a new GitHub repository, e.g. `aaa-website` (public if your GitHub plan requires this for Pages).
2. Upload **all the files INSIDE this folder**, including hidden `.pages.yml` and `.nojekyll`, to the repository root. The top-level `index.html` should be visible in the repository's root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, `main`, and `/(root)`; click **Save**.
5. The site will be available at `https://YOUR-USERNAME.github.io/aaa-website/` (or your repository's URL when Pages finishes publishing).
6. If you name the repository `YOUR-USERNAME.github.io`, it will be hosted at `https://YOUR-USERNAME.github.io/`.

You do **not** need a custom domain, paid hosting, or any build commands. The site is compatible with both user and project GitHub Pages URLs.

## Set up the visual editor (one-time setup)

1. Open https://app.pagescms.org and sign in with GitHub.
2. Allow/install the Pages CMS GitHub App for the account/organization that owns the repository. Select the AAA repository when prompted.
3. Open the repository in Pages CMS. The included `.pages.yml` already specifies the editable sections.
4. You should see **Website words & contact info**, **Executive board members**, **Events — upcoming & past**, and **Instagram highlights**.
5. Save an edit and wait for GitHub Pages to republish. No coding or CLI is necessary.
6. When new officers take over, grant them editor access through the appropriate GitHub/Pages CMS permissions and remove departed members' access. Avoid sharing personal passwords.

Pages CMS is a **third-party hosted editor** that connects to GitHub with your authorization. It does not run on the public website. The public site continues to work if editors stop using Pages CMS. See the [official Pages CMS documentation](https://pagescms.org/docs/quick-start/).

### Routine updates

Open the visual editor and select the appropriate section:

| Want to change... | Select... |
| --- | --- |
| Organization description, contact email, president name, Instagram profile | Website words & contact info |
| Board members, headshots, positions | Executive board members |
| Upcoming events, older event archives, images, and recap links | Events — upcoming & past |
| Featured Instagram posts, captions, cover photos | Instagram highlights |

See [EDITING-GUIDE.md](./EDITING-GUIDE.md) for an officer-friendly handoff document.

## Adding events and preserving past semesters

All event listings live in **`content/events.json`**. Each event can contain a title, date (formatted `YYYY-MM-DD`), optional time, location, description, image, and an optional HTTPS URL for RSVPs, photos, or a recap. Dates decide where events appear:

- **Today and future dates** → Upcoming on the Events page (also up to two on the homepage). If a date is blank, the item stays Upcoming with a “date to be announced” label.
- **Earlier dates** → Past Events archive automatically. Events are grouped into **Spring (January–April), Summer (May–July), or Fall (August–December)** using their dates. Visitors can filter the archive by semester.

**Don't delete old events** just because they have passed: their photos and descriptions will stay in the archive. For images, upload a JPG, WebP, or PNG in Pages CMS; without one, the site displays a decorative placeholder.

`content/events.example.json` is a **fictional demonstration dataset**, not published content. It is provided only to show the format, and must never be mistaken for real organization history. The live file `content/events.json` intentionally starts empty until officers confirm real events.


## Instagram: what is and isn't automatic

**This starter does not claim to pull a live, auto-updating Instagram feed.** Instagram doesn't expose the latest posts to ordinary browser-only GitHub Pages sites as a simple public JSON feed. Here, approved officers use Pages CMS to paste direct Instagram post/reel URLs and (optionally) upload preview images. That's reliable and avoids API keys, expiring tokens, or surprise monthly widget fees.

If the organization later wants an always-current feed, it can add a compliant hosted third-party feed widget/service, or build a separate server-side integration that handles Instagram API authentication. Check the provider's privacy, cost, and permissions before embedding it. The current version already links to AAA's Instagram for truly live content.

## Why the contact form opens email

GitHub Pages has no server to receive form submissions. This form prepares an email using `mailto:`; visitors confirm and send it from their own email applications. This means no database or private information is stored in the website. It does depend on the visitor having a configured email app. For a serverless direct-send form in the future, integrate a reputable hosted form provider.

## Preview on your computer

Do **not** just double-click `index.html`: web browsers restrict loading local JSON content via `file://`.

From the folder containing `index.html`, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. On Windows, `py -m http.server 8000` works if Python is installed. Alternatively, use the VS Code Live Server extension.

## Files

```text
index.html           Page shell, navigation, footer
styles.css           Visual design, animations, mobile styles
app.js               Page rendering, page transitions, contact form
content/site.json    All site words and contact information
content/board.json   Editable executive board entries
content/events.json  Editable events (upcoming and archives)
content/events.example.json  Fictional sample entries, NOT displayed
content/posts.json   Editable Instagram highlights
.pages.yml           Visual editor configuration
.nojekyll            GitHub Pages compatibility
assets/uploads/      Headshots and photos uploaded by officers
EDITING-GUIDE.md     One-page guide for future officers
```

## Customizing the theme

If a developer later wants to adjust the design, edit the CSS variables at the very top of `styles.css`. Most routine updates should happen **only** in Pages CMS.

## Privacy and image use

Only use photos the people pictured have agreed to publish. Avoid personal phone numbers, private contact details, and event attendee data. Prefer an organization email for the president so it can be handed off every year.

---

*Independent student organization website starter. This is not an official university-managed website.*
