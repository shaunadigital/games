/*
 * Shared feedback panel for every game (2026-11-02, Shauna).
 * Served at https://shauna.digital/games/feedback.js. Each game loads it with:
 *   <script src="https://shauna.digital/games/feedback.js" defer></script>
 * and opens it from any element with a data-feedback attribute, or from code:
 *   window.GameFeedback && GameFeedback.open({ score: 120 })
 * A game can also set window.gameFeedbackContext = () => ({ ... }) to attach its own details.
 *
 * Answers go to Formspree (one email each) with the subject "Game feedback: <game>".
 * Change FORMSPREE below to move them to a different form; nothing in the games changes.
 * The panel lives in a shadow root so game styles cannot reach it, and it stops key and
 * pointer events from reaching the game while it is open (typing "w" must not drive the car).
 */
(function () {
  'use strict';
  if (window.GameFeedback) return;

  var FORMSPREE = 'https://formspree.io/f/xvzwklgz';
  var NAMES = {
    shoreline: 'Shoreline', tropichop: 'TropiChop', saltwhisker: 'Saltwhisker',
    homebeforedark: 'Home Before Dark', '13-beads': '13 Beads'
  };

  function gameSlug() {
    var m = location.pathname.match(/\/games\/([^/]+)/);
    if (m) return m[1];
    var h = location.hostname.split('.')[0].replace(/-psi$/, '');
    return NAMES[h] ? h : (location.pathname.split('/')[1] || h);
  }
  var slug = gameSlug();
  var gameName = NAMES[slug] || document.title || slug;

  var FACES = [
    ['😖', 'Not fun'], ['😕', 'Meh'], ['😐', 'Okay'], ['🙂', 'Fun'], ['😍', 'Loved it']
  ];

  var css = [
    ':host{all:initial}',
    '.back{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,12,16,.55);font:16px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#16181d;-webkit-text-size-adjust:100%}',
    '.card{position:relative;width:100%;max-width:380px;max-height:calc(100dvh - 32px);overflow:auto;box-sizing:border-box;padding:22px 20px 18px;border-radius:16px;background:#fffdf8;box-shadow:0 18px 50px rgba(0,0,0,.35)}',
    'h2{margin:0 36px 4px 0;font-size:20px;line-height:1.25;font-weight:700}',
    'p.sub{margin:0 0 14px;color:#4c5059;font-size:14px}',
    '.x{position:absolute;top:10px;right:10px;width:36px;height:36px;border:0;border-radius:50%;background:transparent;color:#4c5059;font-size:22px;line-height:1;cursor:pointer}',
    '.x:hover,.x:focus-visible{background:#eef0f2}',
    'fieldset{border:0;margin:0 0 14px;padding:0}',
    'legend{padding:0;margin-bottom:6px;font-size:14px;font-weight:600}',
    '.faces{display:flex;gap:6px}',
    '.faces button{flex:1;min-height:46px;border:1.5px solid #d9dce1;border-radius:12px;background:#fff;font-size:24px;cursor:pointer;padding:0}',
    '.faces button[aria-pressed="true"]{border-color:#1F6A75;background:#e4f0f2}',
    'label{display:block;margin-bottom:12px;font-size:14px;font-weight:600}',
    'label span{font-weight:400;color:#4c5059}',
    'textarea,input[type=email]{display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px 12px;border:1.5px solid #d9dce1;border-radius:10px;background:#fff;color:#16181d;font-size:16px;line-height:1.4;font-family:inherit}',
    'textarea{min-height:96px;resize:vertical}',
    'textarea:focus,input:focus,button:focus-visible{outline:2px solid #1F6A75;outline-offset:1px}',
    '.send{width:100%;min-height:46px;border:0;border-radius:10px;background:#1F6A75;color:#fff;font-size:16px;font-weight:600;line-height:1;font-family:inherit;cursor:pointer}',
    '.send:disabled{opacity:.6;cursor:default}',
    '.msg{min-height:1.2em;margin:8px 0 0;font-size:14px;color:#a3362b}',
    '.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}',
    '.done{text-align:center;padding:10px 0 4px}',
    '.done .big{font-size:40px;margin-bottom:6px}',
    '@media (prefers-reduced-motion:no-preference){.card{animation:pop .18s ease-out}@keyframes pop{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}}'
  ].join('\n');

  var host = null, root = null, opener = null, extra = {};

  function stop(e) { e.stopPropagation(); }

  function build() {
    host = document.createElement('div');
    host.setAttribute('data-game-feedback', '');
    root = host.attachShadow({ mode: 'open' });
    ['keydown', 'keyup', 'keypress', 'pointerdown', 'pointerup', 'pointermove', 'pointercancel',
     'mousedown', 'mouseup', 'mousemove', 'click', 'dblclick', 'contextmenu',
     'touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel'].forEach(function (t) {
      host.addEventListener(t, stop, { passive: true });
    });
  }

  function render() {
    var faces = FACES.map(function (f, i) {
      return '<button type="button" data-r="' + (i + 1) + '" aria-pressed="false" aria-label="' + (i + 1) + ' of 5, ' + f[1] + '" title="' + f[1] + '">' + f[0] + '</button>';
    }).join('');
    root.innerHTML = '<style>' + css + '</style>' +
      '<div class="back" part="backdrop"><div class="card" role="dialog" aria-modal="true" aria-labelledby="fbt">' +
      '<button type="button" class="x" aria-label="Close">×</button>' +
      '<form novalidate>' +
      '<h2 id="fbt">How was ' + esc(gameName) + '?</h2>' +
      '<p class="sub">Tell me what to fix or add. I read every one.</p>' +
      '<fieldset><legend>How fun was it?</legend><div class="faces">' + faces + '</div></fieldset>' +
      '<label>What should I fix or add?<textarea name="message" maxlength="2000" required></textarea></label>' +
      '<label>Email <span>(optional, if you want a reply)</span><input type="email" name="email" autocomplete="email" /></label>' +
      '<div class="hp" aria-hidden="true"><input name="_gotcha" tabindex="-1" autocomplete="off" /></div>' +
      '<button type="submit" class="send">Send</button>' +
      '<p class="msg" role="status" aria-live="polite"></p>' +
      '</form></div></div>';

    var form = root.querySelector('form');
    var rating = '';
    root.querySelectorAll('.faces button').forEach(function (b) {
      b.addEventListener('click', function () {
        rating = b.getAttribute('data-r');
        root.querySelectorAll('.faces button').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      });
    });
    root.querySelector('.x').addEventListener('click', close);
    root.querySelector('.back').addEventListener('click', function (e) { if (e.target === e.currentTarget) close(); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') trap(e);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send(form, rating);
    });
  }

  function trap(e) {
    var f = Array.prototype.slice.call(root.querySelectorAll('button, textarea, input:not([tabindex="-1"])'));
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], a = root.activeElement;
    if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  }

  function send(form, rating) {
    var msg = root.querySelector('.msg');
    var text = form.message.value.trim();
    if (!text && !rating) { msg.textContent = 'Pick a face or write a note first.'; form.message.focus(); return; }
    var btn = root.querySelector('.send');
    btn.disabled = true; btn.textContent = 'Sending...'; msg.textContent = '';

    var ctx = {};
    try { if (typeof window.gameFeedbackContext === 'function') ctx = window.gameFeedbackContext() || {}; } catch (err) {}
    for (var k in extra) ctx[k] = extra[k];

    var fd = new FormData();
    fd.append('_subject', 'Game feedback: ' + gameName + (rating ? ' (' + rating + '/5)' : ''));
    fd.append('game', gameName);
    fd.append('rating', rating ? rating + ' of 5 (' + FACES[rating - 1][1] + ')' : 'not picked');
    fd.append('message', text || '(no note)');
    if (form.email.value.trim()) fd.append('email', form.email.value.trim());
    fd.append('_gotcha', form._gotcha.value);
    fd.append('page', location.href);
    fd.append('screen', innerWidth + ' x ' + innerHeight + (matchMedia('(pointer: coarse)').matches ? ', touch' : ', mouse'));
    fd.append('browser', navigator.userAgent);
    if (Object.keys(ctx).length) fd.append('game_details', JSON.stringify(ctx));

    fetch(FORMSPREE, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Send';
        msg.textContent = 'That did not send. Check your connection and try again.';
      });
  }

  function done() {
    try { localStorage.setItem('gamefeedback.sent.' + slug, String(Date.now())); } catch (e) {}
    var card = root.querySelector('.card');
    card.innerHTML = '<button type="button" class="x" aria-label="Close">×</button>' +
      '<div class="done"><div class="big" aria-hidden="true">🙏</div><h2 id="fbt" style="margin:0 0 4px">Thank you!</h2>' +
      '<p class="sub">Your note is on its way to me.</p>' +
      '<button type="button" class="send">Back to the game</button></div>';
    card.querySelector('.x').addEventListener('click', close);
    card.querySelector('.send').addEventListener('click', close);
    card.querySelector('.send').focus();
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function open(details) {
    if (!host) build();
    extra = details || {};
    opener = document.activeElement;
    render();
    if (!host.isConnected) document.body.appendChild(host);
    setTimeout(function () { var t = root.querySelector('textarea'); if (t) t.focus({ preventScroll: true }); }, 30);
  }

  function close() {
    if (host && host.isConnected) host.remove();
    if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
    try { window.dispatchEvent(new CustomEvent('gamefeedback:close')); } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('[data-feedback]');
    if (!t) return;
    e.preventDefault();
    open();
  });

  window.GameFeedback = { open: open, close: close, isOpen: function () { return !!(host && host.isConnected); } };
})();
