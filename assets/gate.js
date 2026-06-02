/* =========================================================
   Password gate for work pages.
   Client-side only — obscures content from casual viewing.
   Password hash (SHA-256) lives here; the plaintext does not.
   ========================================================= */
(function () {
  var KEY = 'work-unlocked';
  var HASH = '0cd843885cb6b4838578bd3dd858e47b450363c981000664b68c5bd6c7714d92';

  // Never gate inside an iframe. You can't reach an embedded prototype
  // without already unlocking the parent page, so the parent's gate is
  // sufficient. This also avoids cross-origin sessionStorage quirks on
  // file:// where each document is its own origin.
  try { if (window.self !== window.top) return; } catch (e) { return; }

  if (sessionStorage.getItem(KEY) === '1') return;

  // Mark <html> as locked immediately so the pre-content cover renders
  // before <body> exists. Prevents any flash of protected content.
  document.documentElement.classList.add('is-locked');

  var style = document.createElement('style');
  style.textContent = [
    'html.is-locked { overflow: hidden; }',
    'html.is-locked body { overflow: hidden; }',
    /* Instant cream cover, painted by CSS before DOMContentLoaded. */
    'html.is-locked::before {',
    '  content: "";',
    '  position: fixed; inset: 0;',
    '  background: #FAFAF7;',
    '  z-index: 9998;',
    '}',
    '.gate-overlay {',
    '  position: fixed; inset: 0;',
    '  z-index: 9999;',
    '  background: #FAFAF7;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 32px;',
    '  font-family: "DM Sans", system-ui, -apple-system, sans-serif;',
    '  color: #18181A;',
    '  animation: gate-fade 320ms ease both;',
    '}',
    '@keyframes gate-fade { from { opacity: 0; } to { opacity: 1; } }',
    '.gate-card {',
    '  width: 100%;',
    '  max-width: 440px;',
    '  text-align: left;',
    '}',
    '.gate-eyebrow {',
    '  font-family: "DM Sans", system-ui, sans-serif;',
    '  font-size: 11px;',
    '  letter-spacing: 0.14em;',
    '  text-transform: uppercase;',
    '  color: #5F5E5C;',
    '  margin-bottom: 24px;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 8px;',
    '}',
    '.gate-eyebrow .dot {',
    '  width: 6px; height: 6px; border-radius: 50%;',
    '  background: #1A7A45;',
    '  display: inline-block;',
    '}',
    '.gate-title {',
    '  font-family: "Fraunces", Georgia, serif;',
    '  font-weight: 400;',
    '  font-size: clamp(34px, 5vw, 48px);',
    '  line-height: 1.05;',
    '  letter-spacing: -0.01em;',
    '  margin-bottom: 16px;',
    '}',
    '.gate-title em { font-style: italic; font-weight: 400; }',
    '.gate-sub {',
    '  font-size: 15px;',
    '  line-height: 1.55;',
    '  color: #5F5E5C;',
    '  margin-bottom: 32px;',
    '  max-width: 380px;',
    '}',
    '.gate-form {',
    '  display: flex;',
    '  gap: 8px;',
    '  align-items: stretch;',
    '  margin-bottom: 16px;',
    '}',
    '.gate-input {',
    '  flex: 1 1 auto;',
    '  font: inherit;',
    '  font-size: 15px;',
    '  padding: 14px 16px;',
    '  border: 1px solid #E2E1DA;',
    '  border-radius: 10px;',
    '  background: #FFFFFF;',
    '  color: #18181A;',
    '  outline: none;',
    '  transition: border-color 160ms ease, box-shadow 160ms ease;',
    '}',
    '.gate-input::placeholder { color: #A8A7A3; }',
    '.gate-input:focus {',
    '  border-color: #18181A;',
    '  box-shadow: 0 0 0 3px rgba(24,24,26,0.08);',
    '}',
    '.gate-btn {',
    '  flex: 0 0 auto;',
    '  font: inherit;',
    '  font-size: 14px;',
    '  font-weight: 500;',
    '  padding: 0 20px;',
    '  border: 1px solid #18181A;',
    '  border-radius: 10px;',
    '  background: #18181A;',
    '  color: #FAFAF7;',
    '  cursor: pointer;',
    '  transition: background 160ms ease, color 160ms ease;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 8px;',
    '}',
    '.gate-btn:hover { background: #2A2A2C; }',
    '.gate-btn:disabled { opacity: 0.55; cursor: wait; }',
    '.gate-error {',
    '  font-size: 13px;',
    '  color: #D94530;',
    '  margin: 4px 2px 16px;',
    '  min-height: 18px;',
    '}',
    '.gate-help {',
    '  font-size: 13px;',
    '  color: #5F5E5C;',
    '  margin-top: 8px;',
    '}',
    '.gate-help a {',
    '  color: #18181A;',
    '  text-decoration: underline;',
    '  text-underline-offset: 3px;',
    '  text-decoration-thickness: 1px;',
    '}',
    '.gate-card.shake { animation: gate-shake 380ms cubic-bezier(.36,.07,.19,.97); }',
    '@keyframes gate-shake {',
    '  10%, 90% { transform: translate3d(-1px, 0, 0); }',
    '  20%, 80% { transform: translate3d(2px, 0, 0); }',
    '  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }',
    '  40%, 60% { transform: translate3d(4px, 0, 0); }',
    '}',
    /* Dark palette support, just in case a page sets data-palette="ink" */
    'html[data-palette="ink"].is-locked::before,',
    'html[data-palette="ink"] .gate-overlay {',
    '  background: #15140F;',
    '  color: #F5F2EC;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  async function sha256Hex(str) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  function unlock(overlay) {
    sessionStorage.setItem(KEY, '1');
    document.documentElement.classList.remove('is-locked');
    overlay.style.transition = 'opacity 220ms ease';
    overlay.style.opacity = '0';
    setTimeout(function () {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      var s = document.getElementById('gate-style');
      if (s && s.parentNode) s.parentNode.removeChild(s);
    }, 240);
  }

  function build() {
    var overlay = document.createElement('div');
    overlay.className = 'gate-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Password required');
    overlay.innerHTML = [
      '<div class="gate-card">',
      '  <div class="gate-eyebrow"><span class="dot"></span> Protected</div>',
      '  <h1 class="gate-title">This work is <em>private</em>.</h1>',
      '  <p class="gate-sub">Enter the password to view this case study.</p>',
      '  <form class="gate-form" autocomplete="off" novalidate>',
      '    <input type="password" class="gate-input" placeholder="Password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />',
      '    <button type="submit" class="gate-btn">Enter <span aria-hidden="true">→</span></button>',
      '  </form>',
      '  <p class="gate-error" aria-live="polite"></p>',
      '  <p class="gate-help">Need access? <a href="mailto:jiseo@gmail.com">Email me</a>.</p>',
      '</div>'
    ].join('\n');

    document.body.appendChild(overlay);
    style.id = 'gate-style';

    var card = overlay.querySelector('.gate-card');
    var form = overlay.querySelector('.gate-form');
    var input = overlay.querySelector('.gate-input');
    var btn = overlay.querySelector('.gate-btn');
    var err = overlay.querySelector('.gate-error');

    setTimeout(function () { input.focus(); }, 50);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var val = input.value.trim();
      if (!val) return;
      btn.disabled = true;
      err.textContent = '';
      try {
        var hex = await sha256Hex(val);
        if (hex === HASH) {
          unlock(overlay);
        } else {
          err.textContent = 'Incorrect password. Try again.';
          card.classList.remove('shake');
          void card.offsetWidth;
          card.classList.add('shake');
          input.select();
          btn.disabled = false;
        }
      } catch (e2) {
        err.textContent = 'Something went wrong. Please reload.';
        btn.disabled = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
