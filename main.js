(function () {
  var cfg = window.TDG_CONFIG || {};

  /* Try a list of file names in order; call done(src) with the first one that loads, or nothing. */
  function firstThatLoads(paths, done) {
    var i = 0;
    (function next() {
      if (i >= paths.length) return;
      var src = paths[i++];
      var probe = new Image();
      probe.onload = function () { done(src); };
      probe.onerror = next;
      probe.src = src;
    })();
  }

  /* Photos: <div class="photo" data-photo="hero"> → assets/img/hero.jpg | .jpeg | .png | .webp */
  document.querySelectorAll('[data-photo]').forEach(function (el) {
    var name = el.getAttribute('data-photo');
    var exts = ['jpg', 'jpeg', 'png', 'webp'];
    var paths = /\.\w+$/.test(name) ? ['assets/img/' + name] : exts.map(function (e) { return 'assets/img/' + name + '.' + e; });
    firstThatLoads(paths, function (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = el.getAttribute('data-alt') || '';
      img.loading = el.hasAttribute('data-eager') ? 'eager' : 'lazy';
      el.insertBefore(img, el.firstChild);
      el.classList.add('has-img');
    });
  });

  /* Logos: <span class="logo-slot" data-logo="ted"> → assets/logos/ted.svg | .png, else the text stays */
  document.querySelectorAll('[data-logo]').forEach(function (el) {
    var name = el.getAttribute('data-logo');
    firstThatLoads(['assets/logos/' + name + '.svg', 'assets/logos/' + name + '.png'], function (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      el.insertBefore(img, el.firstChild);
      el.classList.add('has-img');
    });
  });

  /* Links from config.js */
  var links = {
    apply: cfg.applyUrl,
    newsletter: cfg.newsletterUrl,
    instagram: cfg.instagramUrl,
    linkedin: cfg.linkedinUrl,
    story: cfg.storyVideoUrl,
    contact: cfg.contactEmail ? 'mailto:' + cfg.contactEmail : ''
  };
  document.querySelectorAll('[data-link]').forEach(function (a) {
    var url = links[a.getAttribute('data-link')];
    if (!url) return;
    a.href = url;
    if (/^https?:/.test(url)) { a.target = '_blank'; a.rel = 'noopener'; }
  });
  if (!cfg.newsletterUrl) document.querySelectorAll('[data-needs="newsletter"]').forEach(function (el) { el.hidden = true; });

  /* Mobile menu */
  var header = document.querySelector('.header');
  var menuBtn = document.querySelector('.menu-btn');
  if (header && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    header.querySelectorAll('.mobile-nav a').forEach(function (a) {
      a.addEventListener('click', function () { header.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* Bridge city tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') selectTab(tabs[(i + 1) % tabs.length], true);
      if (e.key === 'ArrowLeft') selectTab(tabs[(i - 1 + tabs.length) % tabs.length], true);
    });
  });

  /* Partner chips → email with the picked options */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var partnerBtn = document.getElementById('partner-btn');
  function updatePartner() {
    var picked = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
      .map(function (c) { return c.textContent.trim(); });
    partnerBtn.textContent = picked.length ? 'Partner with us · ' + picked.length + ' selected →' : 'Partner with us →';
    if (cfg.contactEmail) {
      var subject = 'Partnership' + (picked.length ? ': ' + picked.join(', ') : '');
      var body = 'Hi The Deal Girls team,\n\nWe would like to ' + (picked.length ? picked.join(', ').toLowerCase() : 'partner with you') + '.\n\nOrganisation:\nName:\n';
      partnerBtn.href = 'mailto:' + cfg.contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      updatePartner();
    });
  });
  if (partnerBtn) updatePartner();

  /* Testimonials from config.js */
  var list = (cfg.testimonials || []).filter(function (t) { return t && t.quote; });
  var section = document.getElementById('testimonials');
  var grid = document.getElementById('quotes');
  if (section && grid && list.length) {
    list.forEach(function (t) {
      var fig = document.createElement('figure');
      fig.className = 'quote';
      var q = document.createElement('blockquote');
      q.textContent = '“' + t.quote + '”';
      var cap = document.createElement('figcaption');
      var ph = document.createElement('span');
      ph.className = 'photo';
      if (t.photo) {
        var img = document.createElement('img');
        img.src = 'assets/img/' + t.photo; img.alt = ''; img.loading = 'lazy';
        img.onerror = function () { img.remove(); };
        ph.appendChild(img);
      }
      var who = document.createElement('span');
      var b = document.createElement('b'); b.textContent = t.name || '';
      var s = document.createElement('small'); s.textContent = t.role || '';
      who.appendChild(b); who.appendChild(s);
      cap.appendChild(ph); cap.appendChild(who);
      fig.appendChild(q); fig.appendChild(cap);
      grid.appendChild(fig);
    });
    section.hidden = false;
  }

  /* Footer year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
