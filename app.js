/*
 * AAA website — no framework, no build step.
 * All the wording, people, events and Instagram posts come from content/*.json.
 * These files are also editable through the Pages CMS visual editor.
 */
(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const main = $('#main');
  const menuButton = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  const icons = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };
  const fallback = {
    organizationName: 'Asian American Association',
    shortName: 'AAA',
    school: 'The Ohio State University',
    heroEyebrow: 'THE OHIO STATE UNIVERSITY / EST. 1970s',
    heroLineOne: 'YOUR PEOPLE.',
    heroLineTwo: 'YOUR PLACE.',
    heroDescription: 'A community for connection, culture, and showing up as your whole self.',
    mission: 'Building community and leadership for Asian American students at Ohio State.',
    story: 'Since the 1970s, AAA has helped students find connection at Ohio State.',
    boardLabel: 'Leadership & executive board',
    boardYear: 'Meet the team',
    meetingInfo: 'See Instagram for the latest updates.',
    instagramUsername: 'aaaohiostate',
    instagramUrl: 'https://www.instagram.com/aaaohiostate/',
    generalEmail: 'aaaohiostate@gmail.com',
    presidentName: '',
    presidentEmail: 'aaaohiostate@gmail.com',
    collaborationPrompt: 'Have an idea for an event or partnership? Get in touch.',
    contactNote: '',
    campusLocation: 'Columbus, Ohio'
  };
  let content = { site: fallback, board: [], posts: [], events: [] };
  let currentRoute = '';
  let renderLock = false;
  let queuedRoute = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  }
  function cleanEmail(value) {
    const email = String(value || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : fallback.generalEmail;
  }
  function externalUrl(value, fallbackUrl = '#/contact') {
    try {
      const url = new URL(String(value || ''));
      return url.protocol === 'https:' ? escapeHtml(url.href) : fallbackUrl;
    } catch { return fallbackUrl; }
  }
  function imageUrl(value) {
    if (!value || typeof value !== 'string') return '';
    const raw = value.trim();
    if (/^https:\/\//i.test(raw)) return externalUrl(raw, '');
    if (/^(javascript:|data:|blob:|\/\/)/i.test(raw) || raw.includes('..')) return '';
    try { return escapeHtml(new URL(raw.replace(/^\/+/, ''), document.baseURI).href); }
    catch { return ''; }
  }
  function initials(value) {
    return String(value || 'AAA').split(/\s+/).filter(Boolean).slice(0, 2).map(v => v[0]).join('').toUpperCase();
  }
  function getRoute() {
    const path = window.location.hash.replace(/^#\/?/, '').split('?')[0].replace(/\/$/, '');
    return ['about', 'board', 'campus', 'contact'].includes(path) ? path : 'home';
  }
  function btn(label, route, otherClass = '') {
    return `<a class="button button-dark ${otherClass}" href="#/${route === 'home' ? '' : route}" data-route="${route}"><span>${escapeHtml(label)}</span>${icons.arrow}</a>`;
  }
  function sectionTag(index, text) {
    return `<div class="eyebrow"><span class="eyebrow-number">${escapeHtml(index)}</span><span class="eyebrow-line"></span><span>${escapeHtml(text)}</span></div>`;
  }
  function instaLink() {
    return externalUrl(content.site.instagramUrl, fallback.instagramUrl);
  }
  function mailto(email, subject) {
    return `mailto:${cleanEmail(email)}?subject=${encodeURIComponent(subject)}`;
  }
  function eventDate(raw) {
    if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return {day: '✳', month: 'SOON', full: 'Date to be announced'};
    const date = new Date(raw + 'T12:00:00');
    if (Number.isNaN(date.getTime())) return {day: '✳', month: 'SOON', full: 'Date to be announced'};
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: date.toLocaleDateString('en-US', {month: 'short'}).toUpperCase(),
      full: date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
    };
  }
  function renderEvent(event, index = 0) {
    const d = eventDate(event.date);
    const title = escapeHtml(event.title || 'Community event');
    const location = escapeHtml(event.location || 'Details coming soon');
    const description = event.description ? `<p>${escapeHtml(event.description)}</p>` : '';
    const link = event.url && /^https:\/\//i.test(event.url)
      ? `<a href="${externalUrl(event.url)}" target="_blank" rel="noopener noreferrer" class="event-action" aria-label="Learn more about ${title}">${icons.external}</a>`
      : `<a href="${instaLink()}" target="_blank" rel="noopener noreferrer" class="event-action" aria-label="See Instagram for event information">${icons.external}</a>`;
    return `<article class="event-row" style="--i:${index}">
      <div class="event-date"><strong>${d.day}</strong><span>${d.month}</span></div>
      <div class="event-content"><span class="micro-label">${escapeHtml(d.full)}</span><h3>${title}</h3>${description}<div class="event-location">${icons.map}<span>${location}</span></div></div>
      ${link}
    </article>`;
  }
  function eventSection(limit = 3) {
    const events = content.events.slice().filter(e => e && e.title).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    // Show future events first; retain old ones if editors haven't published new dates.
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const upcoming = events.filter(e => !e.date || e.date >= dateKey);
    if (!upcoming.length) return `<div class="empty-events"><div class="empty-icon">✳</div><h3>Something good is always happening.</h3><p>Our latest meeting and event announcements live on Instagram. Follow along so you don't miss the next one.</p><a href="${instaLink()}" target="_blank" rel="noopener noreferrer" class="text-link">See what's happening ${icons.external}</a></div>`;
    return `<div class="event-list">${upcoming.slice(0, limit).map(renderEvent).join('')}</div>`;
  }
  function home() {
    const s = content.site;
    return `
      <section class="home-hero hero-grid section-wrap">
        <div class="hero-copy">
          ${sectionTag('01', s.heroEyebrow)}
          <h1 class="hero-title"><span>${escapeHtml(s.heroLineOne)}</span><span class="hero-outline">${escapeHtml(s.heroLineTwo)}</span></h1>
          <p class="hero-description">${escapeHtml(s.heroDescription)}</p>
          <div class="hero-buttons">${btn('Get to know us', 'about')}<a href="${instaLink()}" target="_blank" rel="noopener noreferrer" class="button button-outline">Find us on Instagram ${icons.external}</a></div>
          <div class="hero-bottom"><div class="stacked-dots"><i></i><i></i><i></i><i></i></div><span>Culture. Connection. Community.</span></div>
        </div>
        <div class="hero-art" aria-label="Colorful geometric illustration celebrating community" role="img">
          <div class="art-grain"></div><span class="art-small-text">A LITTLE COMMUNITY,<br/>A LOT OF HEART.</span>
          <div class="flower" aria-hidden="true"><div class="flower-petal p1"></div><div class="flower-petal p2"></div><div class="flower-petal p3"></div><div class="flower-petal p4"></div><div class="flower-petal p5"></div><div class="flower-petal p6"></div><div class="flower-center">AAA</div></div>
          <div class="art-bottom"><span>YOU BELONG HERE</span><span>✦ &nbsp; 001 / ∞</span></div>
          <div class="orbit-label">made of<br/>many stories</div>
        </div>
      </section>
      <div class="ticker" aria-hidden="true"><div class="ticker-track">${Array.from({length: 5}, () => '<span>NOT JUST A CLUB</span><b>✳</b><span>IT’S A COMMUNITY</span><b>✳</b>').join('')}</div></div>
      <section class="intro-section section-wrap section-space">
        <div class="intro-heading">${sectionTag('02', 'WHAT WE’RE ABOUT')}<h2>Different stories.<br/><em>One community.</em></h2></div>
        <div class="intro-copy"><div class="mini-sun" aria-hidden="true">✳</div><p>${escapeHtml(s.mission)}</p><a href="#/about" data-route="about" class="text-link">More about our story ${icons.arrow}</a></div>
      </section>
      <section class="values-strip section-wrap"><div><span>01 /</span><strong>Find your people</strong></div><div><span>02 /</span><strong>Celebrate culture</strong></div><div><span>03 /</span><strong>Make an impact</strong></div></section>
      <section class="section-wrap section-space happenings"><div class="section-top">${sectionTag('03', 'ON THE CALENDAR')}<a href="#/campus" data-route="campus" class="text-link">Explore campus life ${icons.arrow}</a></div><h2 class="section-title">What’s <span class="highlighted">happening?</span></h2>${eventSection(2)}</section>
      <section class="wide-cta section-wrap"><div class="cta-graphic" aria-hidden="true"><span>✳</span></div><div><span class="mini-caps">NEW FRIENDS START SOMEWHERE</span><h2>Come as you are.<br/>Leave with community.</h2><p>Whether it’s your first event or your fiftieth, there’s room for you.</p></div><a href="${instaLink()}" target="_blank" rel="noopener noreferrer" class="round-cta" aria-label="Visit our Instagram">${icons.external}</a></section>
    `;
  }
  function about() {
    const s = content.site;
    return `
      <section class="page-hero section-wrap about-hero">${sectionTag('01', 'THE AAA STORY')}<div class="page-heading-row"><h1>MORE THAN<br/><span class="serif-italic">a club.</span></h1><div class="page-heading-note"><div class="asterisk">✳</div><p>Rooted in our stories.<br/>Growing together.</p></div></div></section>
      <section class="story-layout section-wrap"><div class="story-art"><span class="story-side-label">OUR ROOTS RUN DEEP</span><div class="story-years">19<span>70</span>s</div><div class="story-stamp">A STORY<br/>STILL<br/>GROWING ↗</div></div><div class="story-text">${sectionTag('02', 'HOW IT STARTED')}<h2>We make room<br/>for <em>belonging.</em></h2><p>${escapeHtml(s.story)}</p><p>${escapeHtml(s.mission)}</p><a href="#/board" data-route="board" class="text-link">Meet the people behind it ${icons.arrow}</a></div></section>
      <section class="section-wrap section-space"><div class="section-top">${sectionTag('03', 'WHAT BRINGS US TOGETHER')}</div><h2 class="section-title">Our kind of <span class="highlighted">energy.</span></h2><div class="pillar-grid"><article class="pillar pillar-yellow"><span class="pillar-no">/ 01</span><div class="pillar-symbol">✺</div><h3>Community</h3><p>Good conversations, new friends, and meaningful connections.</p></article><article class="pillar pillar-peach"><span class="pillar-no">/ 02</span><div class="pillar-symbol">✳</div><h3>Culture</h3><p>Stories, traditions, identities, and the joy of sharing them.</p></article><article class="pillar pillar-lilac"><span class="pillar-no">/ 03</span><div class="pillar-symbol">↗</div><h3>Advocacy</h3><p>Space to uplift APIDA voices, learn, and make a difference.</p></article></div></section>
      <section class="section-wrap split-cta"><p>Every story adds to ours.</p>${btn('Meet our team', 'board')}</section>
    `;
  }
  function boardCard(person, index) {
    const name = person.name ? escapeHtml(person.name) : 'Meet your board member';
    const role = escapeHtml(person.role || 'Executive board');
    const photo = imageUrl(person.photo);
    const bio = escapeHtml(person.bio || 'Meet the people who make this community possible.');
    const colors = ['card-chartreuse', 'card-lavender', 'card-salmon', 'card-mint', 'card-blue', 'card-butter'];
    const image = photo ? `<img loading="lazy" src="${photo}" alt="Portrait of ${name}" />` : `<div class="board-initials" aria-hidden="true">${escapeHtml(initials(person.name))}</div><span class="photo-fallback-caption">PHOTO COMING SOON</span>`;
    const social = person.instagram && /^https:\/\//i.test(person.instagram) ? `<a href="${externalUrl(person.instagram)}" target="_blank" rel="noopener noreferrer" class="board-social" aria-label="${name} on Instagram">${icons.insta}</a>` : '';
    return `<article class="board-card" style="--i:${index}"><div class="board-photo ${colors[index % colors.length]}">${image}<span class="board-index">${String(index + 1).padStart(2, '0')} / AAA</span></div><div class="board-details"><div><span class="board-role">${role}</span><h3>${name}</h3></div>${social}</div><p class="board-bio">${bio}</p></article>`;
  }
  function board() {
    const s = content.site;
    return `<section class="page-hero section-wrap board-hero">${sectionTag('01', s.boardLabel)}<div class="page-heading-row"><h1>THE PEOPLE<br/><span class="serif-italic">behind AAA.</span></h1><div class="board-hero-icon" aria-hidden="true">✳</div></div><div class="page-subline"><p>A lot of heart. A lot of ideas. One amazing team.</p><span class="term-pill">${escapeHtml(s.boardYear)}</span></div></section>
      <section class="section-wrap board-section">${content.board.length ? `<div class="board-grid">${content.board.map(boardCard).join('')}</div>` : `<div class="board-empty"><span>✳</span><h2>Meet the next chapter.</h2><p>The current board lineup is being updated. Check back soon!</p></div>`}</section>
      <section class="section-wrap section-space board-footer-banner"><div class="board-footer-art" aria-hidden="true">AAA✳</div><div><span class="mini-caps">BETTER TOGETHER</span><h2>Want to collaborate<br/>with our team?</h2><p>New ideas and great partnerships are always welcome.</p>${btn('Get in touch', 'contact')}</div></section>`;
  }
  function postCard(post, index) {
    const title = escapeHtml(post.title || 'A moment with AAA');
    const caption = escapeHtml(post.caption || 'A little snapshot from our community.');
    const img = imageUrl(post.image);
    const url = externalUrl(post.url, instaLink());
    const colors = ['post-a', 'post-b', 'post-c', 'post-d'];
    return `<a class="post-card ${colors[index % colors.length]}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="View ${title} on Instagram"><div class="post-media">${img ? `<img loading="lazy" src="${img}" alt="${title}"/>` : `<div class="post-placeholder"><span>AAA</span><b>✳</b><small>THE MOMENTS THAT MAKE US</small></div>`}<span class="post-instagram">${icons.insta}</span></div><div class="post-info"><span>${title}</span><span>${icons.external}</span></div><p>${caption}</p></a>`;
  }
  function campus() {
    const s = content.site;
    const ig = instaLink();
    return `<section class="page-hero section-wrap campus-hero">${sectionTag('01', 'CAMPUS LIFE')}<div class="page-heading-row"><h1>GOOD TIMES.<br/><span class="serif-italic">Good people.</span></h1><div class="page-heading-note"><div class="asterisk">✺</div><p>Come for the events.<br/>Stay for the friends.</p></div></div></section>
      <section class="section-wrap campus-events"><div class="section-top">${sectionTag('02', 'WHAT’S NEXT?')}<span class="subtle-caption">All events are open to the community.</span></div><h2 class="section-title">See you <span class="highlighted">there.</span></h2>${eventSection(8)}</section>
      <section class="social-section section-wrap section-space"><div class="section-top">${sectionTag('03', 'THE INSTAGRAM JOURNAL')}<a href="${ig}" target="_blank" rel="noopener noreferrer" class="text-link">@${escapeHtml(s.instagramUsername)} ${icons.external}</a></div><div class="social-heading"><h2>Little moments.<br/><em>Big memories.</em></h2><p>Follow along for event announcements, photo drops, and all the everyday moments in between.</p></div>${content.posts.length ? `<div class="post-grid">${content.posts.filter(p => p && (p.url || p.title)).map(postCard).join('')}</div>` : `<div class="instagram-empty"><div class="instagram-mockups" aria-hidden="true"><div class="mockup mockup-1"><span>✳</span><b>AAA</b></div><div class="mockup mockup-2"><span>CREATING<br/>MEMORIES<br/>TOGETHER.</span><b>✺</b></div><div class="mockup mockup-3"><span>✷</span><small>YOUR COMMUNITY.</small></div></div><div class="instagram-empty-copy"><span class="mini-caps">YOUR DIRECT LINE TO AAA</span><h3>Catch our latest<br/>on Instagram.</h3><p>New updates are on our profile. Add Instagram post links and photos in the editor to feature them here.</p><a href="${ig}" target="_blank" rel="noopener noreferrer" class="button button-dark">Explore @${escapeHtml(s.instagramUsername)} ${icons.external}</a></div></div>`}<div class="social-footer"><a href="${ig}" target="_blank" rel="noopener noreferrer">${icons.insta} <span>FOLLOW ALONG @${escapeHtml(s.instagramUsername)}</span> ${icons.arrow}</a></div></section>`;
  }
  function contact() {
    const s = content.site;
    const presidentText = s.presidentName ? escapeHtml(s.presidentName) : 'The AAA President';
    const presidentEmail = cleanEmail(s.presidentEmail || s.generalEmail);
    return `<section class="page-hero section-wrap contact-hero">${sectionTag('01', 'LET’S CONNECT')}<div class="page-heading-row"><h1>LET’S MAKE<br/><span class="serif-italic">something happen.</span></h1></div><p class="contact-intro">${escapeHtml(s.collaborationPrompt)}</p></section>
      <section class="contact-grid section-wrap"><div class="contact-card contact-primary"><span class="mini-caps">FOR COLLABORATIONS & PARTNERSHIPS</span><div class="contact-icon">${icons.mail}</div><div><h2>Start a conversation.</h2><p>Reach out to ${presidentText} about hosting an event together, partnering with AAA, or sharing an idea.</p><a href="${escapeHtml(mailto(presidentEmail, 'AAA collaboration inquiry'))}" class="email-link">${escapeHtml(presidentEmail)} ${icons.external}</a>${s.contactNote ? `<p class="contact-footnote">${escapeHtml(s.contactNote)}</p>` : ''}</div></div><div class="contact-card contact-secondary"><span class="mini-caps">OR FIND US HERE</span><div class="small-contact-item"><span class="small-icon">${icons.insta}</span><div><span>Instagram</span><a href="${instaLink()}" target="_blank" rel="noopener noreferrer">@${escapeHtml(s.instagramUsername)} ↗</a></div></div><div class="small-contact-item"><span class="small-icon">${icons.mail}</span><div><span>General questions</span><a href="mailto:${escapeHtml(cleanEmail(s.generalEmail))}">${escapeHtml(s.generalEmail)} ↗</a></div></div><div class="small-contact-item"><span class="small-icon">${icons.map}</span><div><span>Find us</span><strong>${escapeHtml(s.school)}<br/>${escapeHtml(s.campusLocation)}</strong></div></div><div class="contact-mini-graphic" aria-hidden="true">✳ <span>HI, FRIEND!</span></div></div></section>
      <section class="section-wrap contact-form-section"><div class="form-head">${sectionTag('02', 'SEND A QUICK NOTE')}<h2>Tell us your <em>idea.</em></h2><p>Fill this out and we’ll prepare an email in your default email app. Nothing is sent until you hit Send there.</p></div><form id="collab-form" class="contact-form"><div class="form-line"><label>Your name <input name="name" type="text" autocomplete="name" placeholder="Your name" maxlength="100" required /></label><label>Your email <input name="email" type="email" autocomplete="email" placeholder="you@example.com" maxlength="150" required /></label></div><label>What’s on your mind? <select name="kind"><option value="Campus collaboration">Campus collaboration</option><option value="Event partnership">Event partnership</option><option value="Joining AAA">Joining AAA</option><option value="Something else">Something else</option></select></label><label>Your message <textarea name="message" placeholder="Tell us a little about your idea..." rows="5" maxlength="4000" required></textarea></label><button type="submit" class="button button-dark send-button">Open email draft ${icons.arrow}</button><div id="form-result" class="form-result" role="status" aria-live="polite"></div></form></section>`;
  }
  const pages = { home, about, board, campus, contact };
  const titles = { home: 'Home', about: 'Our Story', board: 'Our Board', campus: 'Campus Life', contact: 'Contact' };

  function hookContactForm() {
    const form = $('#collab-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const email = cleanEmail(content.site.presidentEmail || content.site.generalEmail);
      const subject = `AAA — ${data.get('kind') || 'Collaboration inquiry'}`;
      const body = `Hi AAA!\n\n${data.get('message')}\n\nFrom: ${data.get('name')}\nReply email: ${data.get('email')}`;
      const link = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      $('#form-result').textContent = 'Your email application should open now. Review your message and press Send in your email app.';
      window.location.href = link;
    });
  }
  function updateNav(route) {
    document.querySelectorAll('[data-route]').forEach(link => {
      const isActive = link.dataset.route === route;
      link.classList.toggle('is-current', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = `${titles[route]} — AAA at Ohio State`;
    closeMenu();
  }
  function displayPage(route) {
    main.innerHTML = pages[route]();
    main.dataset.page = route;
    updateNav(route);
    hookContactForm();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  async function navigate() {
    const route = getRoute();
    if (route === currentRoute) { updateNav(route); return; }
    if (renderLock) { queuedRoute = route; return; }
    renderLock = true;
    const hasPrevious = Boolean(currentRoute);
    const animate = hasPrevious && !prefersReducedMotion.matches;
    if (animate) {
      try {
        await main.animate([
          { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
          { opacity: 0, transform: 'translateY(-15px)', filter: 'blur(5px)' }
        ], { duration: 190, easing: 'ease-in', fill: 'forwards' }).finished;
      } catch { /* Browser canceled an animation: still switch pages. */ }
    }
    displayPage(route);
    currentRoute = route;
    if (animate) {
      const animation = main.animate([
        { opacity: 0, transform: 'translateY(22px)', filter: 'blur(5px)' },
        { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }
      ], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
      await animation.finished.catch(() => {});
    }
    renderLock = false;
    if (queuedRoute && queuedRoute !== currentRoute) {
      queuedRoute = null;
      navigate();
    } else queuedRoute = null;
  }
  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  }
  function initNavigation() {
    menuButton.addEventListener('click', () => {
      const shouldOpen = mobileNav.hidden;
      mobileNav.hidden = !shouldOpen;
      menuButton.classList.toggle('is-open', shouldOpen);
      menuButton.setAttribute('aria-expanded', String(shouldOpen));
      menuButton.setAttribute('aria-label', shouldOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('hashchange', navigate);
    document.addEventListener('click', (event) => {
      if (event.target.closest('#mobile-nav a')) closeMenu();
      const routeLink = event.target.closest('a[data-route]');
      if (routeLink && getRoute() === routeLink.dataset.route) closeMenu();
    });
  }
  async function loadJson(filename) {
    const response = await fetch(`./content/${filename}.json`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Unable to load ${filename}.json`);
    return response.json();
  }
  async function init() {
    initNavigation();
    $('#footer-year').textContent = new Date().getFullYear();
    const settled = await Promise.allSettled(['site', 'board', 'events', 'posts'].map(loadJson));
    if (settled[0].status === 'rejected') {
      main.innerHTML = `<section class="section-wrap load-error"><h1>Couldn’t load the site content.</h1><p>When testing locally, run a small web server instead of opening <code>index.html</code> directly. See the README for instructions.</p><p>This site is ready for GitHub Pages hosting, where the content loads normally.</p></section>`;
      return;
    }
    const [site, board, events, posts] = settled.map(v => v.status === 'fulfilled' ? v.value : null);
    content = {
      site: { ...fallback, ...(site && typeof site === 'object' ? site : {}) },
      board: Array.isArray(board) ? board : [],
      events: Array.isArray(events) ? events : [],
      posts: Array.isArray(posts) ? posts : []
    };
    $('#footer-instagram').href = instaLink();
    $('#footer-email').href = `mailto:${cleanEmail(content.site.generalEmail)}`;
    navigate();
  }
  init();
})();
