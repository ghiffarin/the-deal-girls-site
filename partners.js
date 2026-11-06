/* The Deal Girls — Partners page interactions (loads after config.js and main.js) */
(function () {
  var cfg = window.TDG_CONFIG || {};

  /* ---------- Photo deck: one photo on top, tap any card to bring it forward ---------- */
  var deck = document.querySelector('[data-deck]');
  if (deck) {
    var cards = Array.prototype.slice.call(deck.querySelectorAll('.deck__card'));
    var dotsBox = deck.querySelector('[data-deck-dots]');
    var count = deck.querySelector('[data-deck-count]');
    var n = cards.length;
    var cur = 0;
    var TILT = [-5, 6, -9, 4, 9, -6, 5];
    var SHIFT = [[-56, 10], [60, -14], [-80, 26], [48, 30], [86, -8], [-40, -18], [20, 36]];
    var pad = function (x) { return (x < 10 ? '0' : '') + x; };

    var dots = cards.map(function (card, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'deck__dot';
      d.setAttribute('aria-label', 'Photo ' + (i + 1));
      d.addEventListener('click', function () { show(i); });
      dotsBox.appendChild(d);
      return d;
    });

    function show(i) {
      cur = (i + n) % n;
      cards.forEach(function (card, k) {
        var depth = (k - cur + n) % n;
        var s = SHIFT[k % SHIFT.length], f = window.innerWidth < 800 ? 0.55 : 1;
        card.style.zIndex = String(20 - depth);
        card.style.transform = depth === 0
          ? 'translate(0,0) rotate(-1deg) scale(1)'
          : 'translate(' + Math.round(s[0] * f) + 'px,' + Math.round(s[1] * f) + 'px) rotate(' + TILT[k % TILT.length] + 'deg) scale(' + (1 - depth * 0.03) + ')';
        card.setAttribute('aria-current', depth === 0 ? 'true' : 'false');
      });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
      if (count) count.textContent = pad(cur + 1) + ' / ' + pad(n);
    }

    cards.forEach(function (card, i) { card.addEventListener('click', function () { show(i); }); });
    deck.querySelector('[data-deck-prev]').addEventListener('click', function () { show(cur - 1); });
    deck.querySelector('[data-deck-next]').addEventListener('click', function () { show(cur + 1); });
    deck.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
    show(0);
    window.addEventListener('resize', function () { show(cur); });
  }

  /* ---------- Let's talk: pick topics, email opens with them in the subject ---------- */
  var topics = Array.prototype.slice.call(document.querySelectorAll('.topic'));
  var btn = document.getElementById('talk-btn');
  var btnText = document.getElementById('talk-btn-text');
  function updateTalk() {
    var picked = topics.filter(function (t) { return t.getAttribute('aria-pressed') === 'true'; })
      .map(function (t) { return t.textContent.trim(); });
    btnText.textContent = picked.length ? 'Email us · ' + picked.length + ' selected' : 'Email us';
    if (cfg.contactEmail) {
      var subject = 'Partnership' + (picked.length ? ': ' + picked.join(', ') : '');
      var body = 'Hi The Deal Girls team,\n\nWe would like to talk about: ' + (picked.length ? picked.join(', ') : 'partnering with you') + '.\n\nOrganisation:\nName:\n';
      btn.href = 'mailto:' + cfg.contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }
  }
  topics.forEach(function (t) {
    t.addEventListener('click', function () {
      t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      updateTalk();
    });
  });
  if (btn) updateTalk();

  /* Show the email address in "Or write to us directly", or hide that line until config.js has one */
  document.querySelectorAll('[data-needs="email"]').forEach(function (el) {
    if (!cfg.contactEmail) { el.hidden = true; return; }
    var a = el.querySelector('[data-email-text]');
    if (a) a.textContent = cfg.contactEmail;
  });
})();
