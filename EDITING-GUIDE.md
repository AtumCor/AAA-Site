# AAA website — quick editing guide for the next e-board

**You do not need to know programming to run this website.** The site is hosted on GitHub Pages. You make routine edits through the Pages CMS visual editor, which saves them to GitHub for you.

## Open the editor

1. Go to **https://app.pagescms.org**.
2. Sign in with the GitHub account (or approved Pages CMS account) that has access to the AAA site repository.
3. Click the AAA website repository, and choose the section you want to edit.
4. Save your changes. GitHub Pages automatically republishes the site after the update.

## When a new e-board is elected

1. Click **Executive board members**.
2. Edit a member's **name**, **position**, and optional **short bio**. Upload a new portrait photo, or leave it blank for the initials design.
3. To add **more members**, click **Add item**. You can add as many people as the current e-board needs—4, 10, 20, or more. Delete past members and rearrange the list to set the display order. The page automatically creates more rows.
4. Board photos do **not** have numbered “02 / AAA” labels anymore. A missing picture will show the member’s initials until a headshot is ready.
5. Open **Website words & contact info** and change **E-board term label**, **President's name**, and **Collaboration inbox**.
6. Remove previous members' access to the editor/repository; invite the new media or tech chairs. Never share passwords.

**Editing without Pages CMS?** Open `content/board.json` in VS Code, insert another entry in the JSON array, and save. Look at `content/board.example.json` for the field names, then preview using Live Server. Keep commas between member objects.

**Navigation animation:** A blue umbrella swings in from the top, faces forward, spins, and drops below the screen when switching between pages—representing AAA's umbrella role for APIDA organizations. It is automatic; there is nothing to update in the editor. Visitors who enable reduced-motion accessibility settings skip the animation.

## Adding upcoming AND past events

1. Select **Events — upcoming & past** → Add an item.
2. Fill in the **title**, **date**, **location**, and optional **time** and **description**. Dates use `YYYY-MM-DD` (for example, `2026-11-18`).
3. Optionally upload an **event flyer/photo** or paste an **RSVP, photo album, or recap URL**. Without a photo, the website uses a colorful AAA placeholder.
4. Save. **Today’s and future events** appear on the Events page under **Coming Up**; up to two appear on the homepage.
5. **Past events** automatically move into the archive under their semester: **Spring (Jan–Apr), Summer (May–Jul), or Fall (Aug–Dec)**. Visitors can choose a semester from the dropdown.

**Don't delete an event when it's over.** Keeping it in the list preserves the archive. To add old events from previous semesters, enter their real past dates and upload photos you have permission to post. The archive builds itself.

**Preview examples:** The `content/events.example.json` file contains fictional, clearly labeled demonstration events. It is not displayed publicly. Use it as a reference for field names, **not** as actual AAA history.

## Updating the Instagram section

1. On Instagram, open a **public** AAA post or reel and copy its link.
2. In **Instagram highlights**, add an item, paste the link, and give it a short title.
3. Upload a square **cover photo** (recommended: 1000 × 1000 JPG or WebP). Ask for permission if it contains identifiable members.
4. Save. The card opens the original Instagram post when clicked.

**Note:** The feed is a curated set of Instagram highlights, not a live automatic feed. Followers can always see current posts via the @aaaohiostate link.

## Changing the contact information

Open **Website words & contact info** and change the **President's name**, **Collaboration inbox**, or **General organization email**. We recommend keeping these as shared organization inboxes rather than student personal email accounts.

## Troubleshooting

- **Changed something but it's not visible?** Confirm that the edit was saved and look at GitHub Actions/Pages to see whether the deployment has completed. Refresh the site.
- **Photo is missing?** Re-upload it using the visual editor. Avoid renaming files in GitHub by hand.
- **An Instagram card doesn't show a picture?** Add a preview image in the editor. The original post link still works.
- **A contact message doesn't send?** The form opens a draft in the visitor's email app. Visitors still need to send that email. The direct contact link is available on the Contact page as a fallback.
- **The editor says you can't access the site?** Contact the GitHub repository owner for access; do not create shared login credentials.

## Once-per-year checklist

- [ ] Confirm the new e-board's names, roles, and headshots.
- [ ] Confirm the president's preferred collaboration inbox.
- [ ] Update the e-board term label.
- [ ] Add new events, check past semester photos, and keep old entries in the archive.
- [ ] Update Instagram highlights.
- [ ] Remove access for past officers and grant it to current maintainers.

*For technical deployment and file details, see README.md.*
