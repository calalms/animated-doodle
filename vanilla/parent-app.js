// parent-app.js — Pet Parent App (phone-first, SMS-verification instead of
// login). Plain-JS reimplementation of "Pet Parent App.dc.html".

const ParentApp = {
  state: {
    screen: 'verify', phoneNumber: '', smsCode: '', showCodeInput: false,
    clientName: 'Maria', petName: 'Biscuit', walkerName: 'Callie',
    walk: { elapsed: 612, distanceMi: 1.1, path: [[40, 340], [70, 320], [95, 290], [120, 270], [150, 250], [170, 220], [190, 190]] },
  },
  timer: null,
  screenRoot: null,

  setState(patch) {
    const next = typeof patch === 'function' ? patch(this.state) : patch;
    if (next) Object.assign(this.state, next);
    this.render();
  },

  setPhoneNumber(v) { ParentApp.setState({ phoneNumber: v }); },
  setSmsCode(v) { ParentApp.setState({ smsCode: v }); },
  sendSms() { if (ParentApp.state.phoneNumber.trim()) ParentApp.setState({ showCodeInput: true }); },
  resendSms() { ParentApp.setState({ smsCode: '' }); },
  verifyCode() {
    if (ParentApp.state.smsCode === '123456') ParentApp.setState({ screen: 'home' });
    else alert('Invalid code');
  },
  logout() { ParentApp.setState({ screen: 'verify', phoneNumber: '', smsCode: '', showCodeInput: false }); },
  goHome() { ParentApp.setState({ screen: 'home' }); },
  goHistory() { ParentApp.setState({ screen: 'history' }); },
  goPay() { ParentApp.setState({ screen: 'pay' }); },
  goMessage() { ParentApp.setState({ screen: 'message' }); },
  goWalkLive() { ParentApp.setState({ screen: 'walkLive' }); },

  computeVals() {
    const s = ParentApp.state;
    const w = s.walk;
    const screen = s.screen;
    const packageTotal = 10, packageUsed = 6, walksLeft = packageTotal - packageUsed;
    const balance = 45;
    return {
      screen, clientName: s.clientName, petName: s.petName, walkerName: s.walkerName,
      phoneNumber: s.phoneNumber, smsCode: s.smsCode, showCodeInput: s.showCodeInput,
      packageTotal, walksLeft, packagePct: (walksLeft / packageTotal) * 100,
      hasBalance: balance > 0, balance,
      hasUpcoming: true, upcomingRange: 'Aug 3 – Aug 5', upcomingNote: '214 Willow St · daily feed, walk & yard check',
      mapEmbedUrl: 'https://maps.google.com/maps?q=' + encodeURIComponent('214 Willow St') + '&z=15&output=embed',
      routePoints: w.path.map(p => p[0] + ',' + p[1]).join(' '),
      routeEnd: { x: w.path[w.path.length - 1][0], y: w.path[w.path.length - 1][1] },
      elapsedLabel: fmtTime(w.elapsed), distanceLabel: w.distanceMi.toFixed(2) + ' mi',
      history: [
        { photoId: 'ph-hist-1', date: 'Jul 27', duration: '32 min', distance: '1.8 mi', note: 'Great walk, met the neighbor dog fine.' },
        { photoId: 'ph-hist-2', date: 'Jul 24', duration: '28 min', distance: '1.5 mi', note: 'Stopped to sniff every mailbox on Willow St 🐾' },
        { photoId: 'ph-hist-3', date: 'Jul 20', duration: '30 min', distance: '1.6 mi', note: 'A little tired today, took it slow.' },
      ],
      venmoUrl: 'https://venmo.com/u/CalliesAlpineCanine?txn=pay&amount=' + balance + '&note=' + encodeURIComponent('Dog walking - Biscuit'),
      venmoPackageUrl: 'https://venmo.com/u/CalliesAlpineCanine?txn=pay&amount=200&note=' + encodeURIComponent('10-walk package - Biscuit'),
      stripeUrl: 'https://checkout.stripe.com/pay/callies-alpine-canine',
      smsUrl: 'sms:+15550401001?body=' + encodeURIComponent("Hi Ash, it's Maria — "),
      telUrl: 'tel:+15550401001',
    };
  },

  render() {
    withFocusPreserved(ParentApp.screenRoot, () => {
      const v = ParentApp.computeVals();
      const kids = [];
      if (v.screen === 'verify') kids.push(ParentApp.renderVerify(v));
      else if (v.screen === 'home') kids.push(ParentApp.renderHome(v));
      else if (v.screen === 'walkLive') kids.push(ParentApp.renderWalkLive(v));
      else if (v.screen === 'history') kids.push(ParentApp.renderHistory(v));
      else if (v.screen === 'pay') kids.push(ParentApp.renderPay(v));
      else if (v.screen === 'message') kids.push(ParentApp.renderMessage(v));

      const showBottomNav = ['home', 'history', 'pay'].includes(v.screen);
      if (showBottomNav) kids.push(ParentApp.renderBottomNav(v));

      mount(ParentApp.screenRoot, kids);
    });
  },

  renderVerify(v) {
    const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;justify-content:center;padding:32px;gap:18px' }, [
      h('div', { style: 'text-align:center;margin-bottom:6px' }, [
        h('div', { style: 'width:64px;height:64px;border-radius:50%;background:var(--color-accent-2-200);color:var(--color-accent-2-800);display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:24px;margin:0 auto 12px' }, '🐾'),
        h('h2', { style: 'margin:0' }, "Callie's Alpine Canine"),
        h('div', { style: 'font-size:12.5px;opacity:.65' }, 'Pet parent app'),
      ]),
      h('div', { style: 'text-align:center;margin-bottom:12px' }, [
        h('div', { style: 'font-size:14px;margin-bottom:4px' }, 'Enter your phone number to get started'),
        h('div', { style: 'font-size:12px;opacity:.65' }, "We'll send you a verification code"),
      ]),
      h('div', { class: 'field' }, [h('label', {}, 'Phone number'), h('input', { class: 'input', type: 'tel', placeholder: '(555) 123-4567', 'data-key': 'phone', value: v.phoneNumber, onInput: e => ParentApp.setPhoneNumber(e.target.value), maxLength: '20' })]),
      h('button', { class: 'btn btn-primary btn-block', style: 'height:50px;margin-top:4px', onClick: ParentApp.sendSms }, 'Send code'),
    ]);
    if (v.showCodeInput) {
      wrap.appendChild(h('div', { style: 'display:flex;flex-direction:column;gap:12px;padding-top:12px;border-top:1px solid var(--color-divider)' }, [
        h('div', { style: 'font-size:13px' }, 'Enter the code we sent to ' + v.phoneNumber),
        h('input', { class: 'input', type: 'text', placeholder: '000000', 'data-key': 'smscode', value: v.smsCode, onInput: e => ParentApp.setSmsCode(e.target.value), maxLength: '6', style: 'text-align:center;font-size:18px;letter-spacing:8px' }),
        h('button', { class: 'btn btn-primary btn-block', style: 'height:50px', onClick: ParentApp.verifyCode }, 'Verify'),
        h('button', { class: 'btn btn-secondary btn-block', style: 'height:46px', onClick: ParentApp.resendSms }, 'Resend code'),
      ]));
    }
    return wrap;
  },

  renderHome(v) {
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:22px 20px 90px;display:flex;flex-direction:column;gap:16px' });
    wrap.appendChild(h('div', { style: 'display:flex;align-items:center;justify-content:space-between' }, [
      h('div', {}, [h('div', { style: 'font-size:12px;opacity:.6' }, 'Hi ' + v.clientName + ' 👋'), h('h2', { style: 'margin:2px 0 0' }, v.petName + "'s day")]),
      h('button', { class: 'btn btn-icon btn-secondary', onClick: ParentApp.logout, style: 'width:44px;height:44px' }, [icon('logout')]),
    ]));
    wrap.appendChild(h('div', { class: 'card elev-md', style: 'gap:8px;cursor:pointer', onClick: ParentApp.goWalkLive }, [
      h('div', { style: 'display:flex;align-items:center;gap:8px' }, [
        h('span', { class: 'tag tag-accent', style: 'animation:pulseDot 1.4s infinite' }, '● Live now'),
        h('span', { class: 'card-title', style: 'font-size:15px' }, v.walkerName + ' is walking ' + v.petName),
      ]),
      h('div', { style: 'font-size:12.5px;opacity:.7' }, 'Started 10 minutes ago · tap to watch live'),
    ]));
    wrap.appendChild(h('div', { class: 'card elev-sm', style: 'background:var(--color-accent-100)' }, [
      h('div', { class: 'card-kicker' }, 'Your package'),
      h('div', { style: 'display:flex;align-items:baseline;gap:8px' }, [h('h1', { style: 'margin:0;font-size:32px' }, v.walksLeft + '/' + v.packageTotal), h('span', { style: 'font-size:13px;opacity:.7' }, 'walks remaining')]),
      h('div', { style: 'height:6px;border-radius:999px;background:var(--color-neutral-300);overflow:hidden;margin-top:2px' }, [h('div', { style: 'height:100%;border-radius:999px;background:var(--color-accent-600);width:' + v.packagePct + '%' })]),
    ]));
    if (v.hasBalance) {
      wrap.appendChild(h('div', { class: 'card elev-sm', style: 'flex-direction:row;align-items:center;gap:10px' }, [
        h('div', { style: 'flex:1' }, [h('div', { class: 'card-title', style: 'font-size:14px' }, '$' + v.balance + ' due'), h('div', { style: 'font-size:11.5px;opacity:.65' }, 'For your last sitting')]),
        h('button', { class: 'btn btn-primary', onClick: ParentApp.goPay }, 'Pay now'),
      ]));
    }
    if (v.hasUpcoming) {
      wrap.appendChild(h('div', {}, [
        h('h5', { style: 'margin:0 0 8px' }, 'Upcoming'),
        h('div', { class: 'card elev-sm', style: 'gap:4px' }, [h('div', { style: 'font-size:13px;font-weight:600' }, v.upcomingRange + ' · Sitting'), h('div', { style: 'font-size:12px;opacity:.65' }, v.upcomingNote)]),
      ]));
    }
    wrap.appendChild(h('div', { style: 'display:flex;gap:10px' }, [
      h('button', { class: 'btn btn-secondary', style: 'flex:1;height:48px', onClick: ParentApp.goMessage }, [icon('message'), ' Message ' + v.walkerName]),
      h('button', { class: 'btn btn-secondary', style: 'flex:1;height:48px', onClick: ParentApp.goHistory }, [icon('history'), ' Walk history']),
    ]));
    return wrap;
  },

  renderWalkLive(v) {
    const wrap = h('div', { style: 'flex:1;position:relative;overflow:hidden' });
    wrap.appendChild(h('iframe', { title: 'Live map', src: v.mapEmbedUrl, style: 'position:absolute;inset:0;width:100%;height:100%;border:0', loading: 'lazy', class: 'washed' }));
    const svg = frag('<svg width="100%" height="100%" viewBox="0 0 412 700" style="position:absolute;inset:0;pointer-events:none"></svg>');
    svg.appendChild(frag('<polyline points="' + v.routePoints + '" fill="none" stroke="var(--color-accent-700)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"></polyline>'));
    svg.appendChild(frag('<circle cx="' + v.routeEnd.x + '" cy="' + v.routeEnd.y + '" r="8" fill="var(--color-accent-700)"></circle>'));
    wrap.appendChild(svg);
    wrap.appendChild(h('div', { style: 'position:absolute;top:16px;left:16px;right:16px;display:flex;align-items:center;gap:8px' }, [
      h('button', { class: 'btn btn-icon btn-secondary', style: 'background:var(--color-bg)', onClick: ParentApp.goHome }, [icon('back')]),
      h('span', { class: 'tag tag-accent', style: 'animation:pulseDot 1.4s infinite' }, '● Live'),
      h('span', { style: 'font-size:12.5px;font-weight:600;background:var(--color-bg);padding:4px 10px;border-radius:999px' }, v.petName + ' with ' + v.walkerName),
    ]));
    wrap.appendChild(h('div', { style: 'position:absolute;left:0;right:0;bottom:0;background:var(--color-bg);border-radius:24px 24px 0 0;box-shadow:var(--shadow-lg);padding:20px;display:flex;flex-direction:column;gap:12px' }, [
      h('div', { style: 'display:flex;justify-content:space-around;text-align:center' }, [
        h('div', {}, [h('div', { style: 'font-family:var(--font-heading);font-size:24px' }, v.elapsedLabel), h('div', { style: 'font-size:11px;opacity:.6' }, 'time')]),
        h('div', {}, [h('div', { style: 'font-family:var(--font-heading);font-size:24px' }, v.distanceLabel), h('div', { style: 'font-size:11px;opacity:.6' }, 'distance')]),
      ]),
      h('button', { class: 'btn btn-secondary btn-block', style: 'margin-top:0', onClick: ParentApp.goMessage }, 'Message ' + v.walkerName),
    ]));
    return wrap;
  },

  renderHistory(v) {
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:22px 20px 90px;display:flex;flex-direction:column;gap:14px' });
    wrap.appendChild(h('div', { style: 'display:flex;align-items:center;gap:10px' }, [
      h('button', { class: 'btn btn-icon btn-secondary', onClick: ParentApp.goHome }, [icon('back')]),
      h('h3', { style: 'margin:0' }, 'Walk history'),
    ]));
    v.history.forEach(hh => {
      wrap.appendChild(h('div', { class: 'card elev-sm', style: 'gap:8px' }, [
        h('image-slot', { id: hh.photoId, shape: 'rounded', style: 'width:100%;height:140px', placeholder: 'Drop a photo from this walk' }),
        h('div', { style: 'display:flex;justify-content:space-between;align-items:center' }, [
          h('div', { style: 'font-size:13px;font-weight:600' }, hh.date + ' · ' + hh.duration),
          h('span', { class: 'tag tag-accent-2' }, hh.distance),
        ]),
        h('div', { style: 'font-size:12.5px;opacity:.8' }, hh.note),
      ]));
    });
    return wrap;
  },

  renderPay(v) {
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:22px 20px 90px;display:flex;flex-direction:column;gap:16px' });
    wrap.appendChild(h('div', { style: 'display:flex;align-items:center;gap:10px' }, [
      h('button', { class: 'btn btn-icon btn-secondary', onClick: ParentApp.goHome }, [icon('back')]),
      h('h3', { style: 'margin:0' }, 'Payments'),
    ]));
    wrap.appendChild(h('div', { class: 'card elev-sm', style: 'background:var(--color-accent-100)' }, [h('div', { class: 'card-kicker' }, 'Balance due'), h('h1', { style: 'margin:0;font-size:32px' }, '$' + v.balance)]));
    wrap.appendChild(h('a', { class: 'btn btn-block', style: 'height:52px;background:#3D95CE;color:#fff;text-decoration:none', href: v.venmoUrl, target: '_blank', rel: 'noopener' }, 'Pay with Venmo'));
    wrap.appendChild(h('a', { class: 'btn btn-secondary btn-block', style: 'height:52px;text-decoration:none', href: v.stripeUrl, target: '_blank', rel: 'noopener' }, 'Pay by card (Stripe)'));
    wrap.appendChild(h('div', { style: 'font-size:11.5px;opacity:.6;text-align:center' }, 'Opens Venmo or a secure Stripe checkout'));
    wrap.appendChild(h('div', {}, [
      h('h5', { style: 'margin:16px 0 8px' }, 'Buy another package'),
      h('div', { class: 'card elev-sm', style: 'flex-direction:row;align-items:center;gap:10px' }, [
        h('div', { style: 'flex:1' }, [h('div', { class: 'card-title', style: 'font-size:14px' }, '10 walks · $200'), h('div', { style: 'font-size:11.5px;opacity:.65' }, 'Save $20 vs. per-walk rate')]),
        h('a', { class: 'btn btn-primary', style: 'text-decoration:none', href: v.venmoPackageUrl, target: '_blank', rel: 'noopener' }, 'Buy'),
      ]),
    ]));
    return wrap;
  },

  renderMessage(v) {
    // NOTE: the header literally says "Message Ash" and the avatar shows "C"
    // in the source .dc.html even though this app's walkerName is "Callie" —
    // copied verbatim, quirks and all.
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:22px 20px 90px;display:flex;flex-direction:column;gap:16px' });
    wrap.appendChild(h('div', { style: 'display:flex;align-items:center;gap:10px' }, [
      h('button', { class: 'btn btn-icon btn-secondary', onClick: ParentApp.goHome }, [icon('back')]),
      h('h3', { style: 'margin:0' }, 'Message Ash'),
    ]));
    wrap.appendChild(h('div', { class: 'card elev-sm', style: 'flex-direction:row;align-items:center;gap:12px' }, [
      h('div', { style: 'width:44px;height:44px;border-radius:50%;background:var(--color-accent-2-200);color:var(--color-accent-2-800);display:flex;align-items:center;justify-content:center;font-family:var(--font-heading)' }, 'C'),
      h('div', {}, [h('div', { style: 'font-size:14px;font-weight:600' }, v.walkerName + ' — your walker'), h('div', { style: 'font-size:12px;opacity:.65' }, 'Usually replies within an hour')]),
    ]));
    wrap.appendChild(h('a', { class: 'btn btn-primary btn-block', style: 'height:50px;text-decoration:none', href: v.smsUrl }, 'Send a text'));
    wrap.appendChild(h('a', { class: 'btn btn-secondary btn-block', style: 'height:50px;text-decoration:none', href: v.telUrl }, 'Call ' + v.walkerName));
    return wrap;
  },

  renderBottomNav(v) {
    const colFor = tab => v.screen === tab ? 'var(--color-accent-700)' : 'var(--color-neutral-600)';
    return h('div', { style: 'display:flex;border-top:1px solid var(--color-divider);background:var(--color-bg);padding:8px 4px 10px' }, [
      h('button', { onClick: ParentApp.goHome, style: 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;color:' + colFor('home') }, [icon('home'), h('span', { style: 'font-size:10px' }, 'Home')]),
      h('button', { onClick: ParentApp.goHistory, style: 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;color:' + colFor('history') }, [icon('history'), h('span', { style: 'font-size:10px' }, 'History')]),
      h('button', { onClick: ParentApp.goPay, style: 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;color:' + colFor('pay') }, [icon('payments'), h('span', { style: 'font-size:10px' }, 'Pay')]),
    ]);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  ParentApp.screenRoot = bootPhoneApp('root');
  ParentApp.render();
  ParentApp.timer = setInterval(() => {
    ParentApp.setState(s => {
      const last = s.walk.path[s.walk.path.length - 1];
      const nx = Math.max(20, Math.min(392, last[0] + (Math.random() * 30 - 10)));
      const ny = Math.max(60, Math.min(660, last[1] - (4 + Math.random() * 8)));
      const path = [...s.walk.path, [nx, ny]].slice(-60);
      return { walk: Object.assign({}, s.walk, { elapsed: s.walk.elapsed + 1, distanceMi: s.walk.distanceMi + 0.006 + Math.random() * 0.005, path }) };
    });
  }, 1000);
});
