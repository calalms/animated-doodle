// website-app.js — Callie's Alpine Canine marketing site. Plain-JS
// reimplementation of "Callies Alpine Canine Website.dc.html" — same pages,
// copy, testimonials, pricing, responsive breakpoint and contact form logic,
// rendered with plain DOM instead of React.

const TESTIMONIALS = [
  { quote: "Ash sends a photo after every walk — my dog is always mid-grin.", name: 'Priya N.', pet: 'Cooper' },
  { quote: "Reliable, on time, and Biscuit genuinely gets excited when Ash pulls up.", name: 'Maria C.', pet: 'Biscuit' },
  { quote: "The overnight sitting checklist gave me total peace of mind on our trip.", name: 'Sophie T.', pet: 'Ranger' },
];
const CREDENTIALS = ['Insured & bonded', 'Pet first-aid certified', '6+ years of walking & sitting experience', 'Background checked'];

const Site = {
  state: {
    page: 'home', isMobile: false, mobileNavOpen: false,
    contactName: '', contactEmail: '', contactPhone: '', contactPet: '', contactMessage: '', service: 'walks',
    formSubmitted: false,
  },
  screenRoot: null,
  mq: null,

  setState(patch) {
    const next = typeof patch === 'function' ? patch(this.state) : patch;
    if (next) Object.assign(this.state, next);
    this.render();
  },

  go(page) { Site.setState({ page, mobileNavOpen: false }); },
  goHome() { Site.go('home'); }, goServices() { Site.go('services'); }, goAbout() { Site.go('about'); }, goContact() { Site.go('contact'); },
  toggleMobileNav() { Site.setState(s => ({ mobileNavOpen: !s.mobileNavOpen })); },

  setField(field, v) { Site.setState({ [field]: v }); },
  setSvc(v) { Site.setState({ service: v }); },
  submitContact() { if (!Site.state.contactName.trim()) return; Site.setState({ formSubmitted: true }); },

  computeVals() {
    const s = Site.state;
    const m = s.isMobile;
    return {
      page: s.page,
      showDesktopNav: !m, showMobileToggle: m, showMobileMenu: m && s.mobileNavOpen,
      pagePad: m ? '20px' : '48px',
      sectionPad: m ? '28px 20px' : '56px 48px',
      sectionPadBottom: m ? '28px' : '56px',
      heroCols: m ? '1fr' : '1.1fr 0.9fr',
      heroFontSize: m ? '32px' : '48px',
      heroImgHeight: m ? '220px' : '420px',
      threeCol: m ? '1fr' : 'repeat(3, 1fr)',
      aboutCols: m ? '1fr' : '0.9fr 1.1fr',
      aboutImgHeight: m ? '260px' : '460px',
      contactCols: m ? '1fr' : '1.3fr 0.7fr',
    };
  },

  render() {
    withFocusPreserved(Site.screenRoot, () => {
      const v = Site.computeVals();
      const s = Site.state;
      const kids = [Site.renderNav(v)];
      if (v.showMobileMenu) kids.push(Site.renderMobileMenu(v));
      if (v.page === 'home') kids.push(Site.renderHome(v));
      else if (v.page === 'services') kids.push(Site.renderServices(v));
      else if (v.page === 'about') kids.push(Site.renderAbout(v));
      else if (v.page === 'contact') kids.push(Site.renderContact(v));
      kids.push(Site.renderFooter(v));
      mount(Site.screenRoot, kids);
    });
  },

  renderNav(v) {
    const nav = h('div', {
      class: 'nav',
      style: 'padding:20px ' + v.pagePad + ';position:sticky;top:0;background:var(--color-bg);z-index:5;border-bottom:1px solid var(--color-divider)',
    }, [
      h('div', { class: 'nav-brand', style: 'display:flex;align-items:center;gap:8px;cursor:pointer', onClick: Site.goHome }, [
        h('span', { style: 'font-size:22px' }, '🐾'), ' Callie\'s Alpine Canine',
      ]),
    ]);
    if (v.showDesktopNav) {
      nav.appendChild(h('a', { href: '#', onClick: e => { e.preventDefault(); Site.goHome(); }, 'aria-current': v.page === 'home' ? 'page' : undefined }, 'Home'));
      nav.appendChild(h('a', { href: '#', onClick: e => { e.preventDefault(); Site.goServices(); }, 'aria-current': v.page === 'services' ? 'page' : undefined }, 'Services'));
      nav.appendChild(h('a', { href: '#', onClick: e => { e.preventDefault(); Site.goAbout(); }, 'aria-current': v.page === 'about' ? 'page' : undefined }, 'About'));
      nav.appendChild(h('a', { href: '#', onClick: e => { e.preventDefault(); Site.goContact(); }, 'aria-current': v.page === 'contact' ? 'page' : undefined }, 'Contact'));
      nav.appendChild(h('a', { class: 'btn btn-primary', style: 'text-decoration:none', href: 'Pet Parent Portal.html', target: '_blank', rel: 'noopener' }, 'Client Login'));
    }
    if (v.showMobileToggle) {
      nav.appendChild(h('button', { class: 'btn btn-icon btn-secondary', style: 'margin-left:auto', onClick: Site.toggleMobileNav }, [icon('hamburger')]));
    }
    return nav;
  },

  renderMobileMenu() {
    return h('div', { style: 'display:flex;flex-direction:column;gap:2px;padding:12px 20px;border-bottom:1px solid var(--color-divider);background:var(--color-surface)' }, [
      h('a', { href: '#', style: 'padding:10px 0', onClick: e => { e.preventDefault(); Site.goHome(); } }, 'Home'),
      h('a', { href: '#', style: 'padding:10px 0', onClick: e => { e.preventDefault(); Site.goServices(); } }, 'Services'),
      h('a', { href: '#', style: 'padding:10px 0', onClick: e => { e.preventDefault(); Site.goAbout(); } }, 'About'),
      h('a', { href: '#', style: 'padding:10px 0', onClick: e => { e.preventDefault(); Site.goContact(); } }, 'Contact'),
      h('a', { class: 'btn btn-primary btn-block', style: 'text-decoration:none;margin:8px 0 4px', href: 'Pet Parent Portal.html', target: '_blank', rel: 'noopener' }, 'Client Login'),
    ]);
  },

  renderHome(v) {
    const frag2 = h('div', {});
    frag2.appendChild(h('div', { style: 'display:grid;grid-template-columns:' + v.heroCols + ';gap:40px;align-items:center;padding:' + v.sectionPad }, [
      h('div', { style: 'display:flex;flex-direction:column;gap:18px' }, [
        h('h1', { style: 'margin:0;font-size:' + v.heroFontSize }, "Trusted dog walking & pet sitting, right in your neighborhood."),
        h('p', { style: 'font-size:16px;opacity:.8;max-width:480px' }, "Callie's Alpine Canine gives your dog daily walks, drop-in visits and overnight sitting from someone who actually knows their name — and their favorite trail."),
        h('div', { style: 'display:flex;gap:12px;flex-wrap:wrap' }, [
          h('button', { class: 'btn btn-primary', style: 'height:48px;padding-inline:24px', onClick: Site.goContact }, 'Request a booking'),
          h('a', { class: 'btn btn-secondary', style: 'height:48px;padding-inline:24px;text-decoration:none;display:inline-flex;align-items:center', href: 'Pet Parent Portal.html', target: '_blank', rel: 'noopener' }, 'Client login'),
        ]),
      ]),
      h('image-slot', { id: 'hero-photo', shape: 'rounded', style: 'width:100%;height:' + v.heroImgHeight, placeholder: 'Drop a hero photo of a happy dog' }),
    ]));

    const servicesWrap = h('div', { style: 'padding:0 ' + v.sectionPad + ' ' + v.sectionPadBottom });
    servicesWrap.appendChild(h('h3', { style: 'margin:0 0 6px' }, 'Services'));
    servicesWrap.appendChild(h('p', { style: 'opacity:.7;margin:0 0 24px' }, 'A few ways I look after your dog'));
    servicesWrap.appendChild(h('div', { style: 'display:grid;grid-template-columns:' + v.threeCol + ';gap:20px' }, [
      h('div', { class: 'card elev-sm', style: 'gap:8px' }, [
        h('div', { class: 'card-kicker' }, 'Daily walks'), h('div', { class: 'card-title' }, '$22 / walk'),
        h('p', { class: 'card-body' }, '30-minute neighborhood walks with GPS-tracked routes and a note after every visit.'),
      ]),
      h('div', { class: 'card elev-sm', style: 'gap:8px' }, [
        h('div', { class: 'card-kicker' }, 'Drop-in visits'), h('div', { class: 'card-title' }, '$20 / visit'),
        h('p', { class: 'card-body' }, 'Quick feed, potty break and playtime — perfect for a long workday.'),
      ]),
      h('div', { class: 'card elev-sm', style: 'gap:8px' }, [
        h('div', { class: 'card-kicker' }, 'Overnight sitting'), h('div', { class: 'card-title' }, '$65 / night'),
        h('p', { class: 'card-body' }, 'Your dog stays in their own home, with daily task checklists sent your way.'),
      ]),
    ]));
    servicesWrap.appendChild(h('button', { class: 'btn btn-ghost', style: 'margin-top:16px', onClick: Site.goServices }, 'See full pricing →'));
    frag2.appendChild(servicesWrap);

    const testWrap = h('div', { style: 'padding:0 ' + v.sectionPad + ' ' + v.sectionPadBottom });
    testWrap.appendChild(h('h3', { style: 'margin:0 0 20px' }, 'What pet parents say'));
    const testGrid = h('div', { style: 'display:grid;grid-template-columns:' + v.threeCol + ';gap:20px' });
    TESTIMONIALS.forEach(t => {
      testGrid.appendChild(h('div', { class: 'card elev-sm', style: 'gap:10px' }, [
        h('p', { class: 'card-body', style: 'font-size:14px;opacity:1' }, '"' + t.quote + '"'),
        h('div', { class: 'card-meta' }, '— ' + t.name + ', ' + t.pet + "'s parent"),
      ]));
    });
    testWrap.appendChild(testGrid);
    frag2.appendChild(testWrap);

    frag2.appendChild(h('div', { class: 'card elev-md', style: 'margin:0 ' + v.sectionPad + ' ' + v.sectionPadBottom + ';background:var(--color-accent-2-100);flex-direction:row;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px' }, [
      h('div', {}, [
        h('div', { class: 'card-title' }, "Ready to book your dog's next walk?"),
        h('div', { style: 'font-size:13px;opacity:.75' }, 'Usually able to reply within a few hours.'),
      ]),
      h('button', { class: 'btn btn-primary', style: 'height:46px;padding-inline:22px', onClick: Site.goContact }, 'Request a booking'),
    ]));

    return frag2;
  },

  renderServices(v) {
    const wrap = h('div', { style: 'padding:' + v.sectionPad });
    wrap.appendChild(h('h1', { style: 'margin:0 0 8px' }, 'Services & rates'));
    wrap.appendChild(h('p', { style: 'opacity:.75;margin:0 0 28px;max-width:560px' }, 'Simple, transparent pricing — pay per visit or save with a package.'));
    wrap.appendChild(h('div', { style: 'display:grid;grid-template-columns:' + v.threeCol + ';gap:20px' }, [
      h('div', { class: 'card elev-md', style: 'gap:10px' }, [
        h('div', { class: 'card-kicker' }, 'Walks'),
        h('div', { class: 'card-title', style: 'font-size:24px' }, ['$22', h('span', { style: 'font-size:13px;font-family:var(--font-body);opacity:.6' }, '/walk')]),
        h('p', { class: 'card-body' }, '30 minutes, one-on-one, GPS-tracked route + photo.'),
        h('div', { style: 'font-size:12px;opacity:.7' }, '10-walk package: $200 (save $20)'),
        h('button', { class: 'btn btn-primary btn-block', onClick: Site.goContact }, 'Book walks'),
      ]),
      h('div', { class: 'card elev-md', style: 'gap:10px' }, [
        h('div', { class: 'card-kicker' }, 'Drop-in visits'),
        h('div', { class: 'card-title', style: 'font-size:24px' }, ['$20', h('span', { style: 'font-size:13px;font-family:var(--font-body);opacity:.6' }, '/visit')]),
        h('p', { class: 'card-body' }, '15–20 minutes — feed, potty break, fresh water, playtime.'),
        h('div', { style: 'font-size:12px;opacity:.7' }, 'Great for lunch breaks or workdays'),
        h('button', { class: 'btn btn-primary btn-block', onClick: Site.goContact }, 'Book a visit'),
      ]),
      h('div', { class: 'card elev-md', style: 'gap:10px' }, [
        h('div', { class: 'card-kicker' }, 'Overnight sitting'),
        h('div', { class: 'card-title', style: 'font-size:24px' }, ['$65', h('span', { style: 'font-size:13px;font-family:var(--font-body);opacity:.6' }, '/night')]),
        h('p', { class: 'card-body' }, 'Your dog stays home, with daily check-ins and a task checklist.'),
        h('div', { style: 'font-size:12px;opacity:.7' }, 'Multi-night discounts available'),
        h('button', { class: 'btn btn-primary btn-block', onClick: Site.goContact }, 'Book a sitting'),
      ]),
    ]));
    return wrap;
  },

  renderAbout(v) {
    const wrap = h('div', { style: 'display:grid;grid-template-columns:' + v.aboutCols + ';gap:40px;align-items:start;padding:' + v.sectionPad });
    wrap.appendChild(h('image-slot', { id: 'about-photo', shape: 'rounded', style: 'width:100%;height:' + v.aboutImgHeight, placeholder: 'Drop a photo of you with a dog' }));
    const right = h('div', { style: 'display:flex;flex-direction:column;gap:14px' }, [
      h('h1', { style: 'margin:0' }, "Hi, I'm Ash"),
      h('p', { style: 'font-size:15px;opacity:.85' }, "I started Callie's Alpine Canine — named after my own dog, Callie — because I wanted every dog on my route to get the same attention she does: real walks, real playtime, and someone who notices when something's off."),
    ]);
    const credWrap = h('div', { style: 'display:flex;flex-direction:column;gap:8px' });
    CREDENTIALS.forEach(cr => {
      credWrap.appendChild(h('div', { style: 'display:flex;align-items:center;gap:10px' }, [
        h('span', { html: ICONS.checkAbout }),
        h('span', { style: 'font-size:14px' }, cr),
      ]));
    });
    right.appendChild(credWrap);
    right.appendChild(h('button', { class: 'btn btn-primary', style: 'align-self:flex-start;margin-top:6px', onClick: Site.goContact }, 'Get in touch'));
    wrap.appendChild(right);
    return wrap;
  },

  renderContact(v) {
    const s = Site.state;
    const wrap = h('div', { style: 'display:grid;grid-template-columns:' + v.contactCols + ';gap:40px;padding:' + v.sectionPad });
    const left = h('div', {}, [
      h('h1', { style: 'margin:0 0 8px' }, 'Get in touch'),
      h('p', { style: 'opacity:.75;margin:0 0 20px' }, "Tell me about your dog and I'll follow up to confirm details."),
    ]);
    if (s.formSubmitted) {
      left.appendChild(h('div', { class: 'card elev-md', style: 'background:var(--color-accent-2-100);gap:8px' }, [
        h('div', { class: 'card-title' }, 'Thanks, ' + s.contactName + '! 🐾'),
        h('p', { class: 'card-body' }, "Your request is in — I'll reply within a few hours to confirm."),
      ]));
    } else {
      left.appendChild(h('div', { style: 'display:flex;flex-direction:column;gap:14px;max-width:480px' }, [
        h('div', { class: 'field' }, [h('label', {}, 'Your name'), h('input', { class: 'input', 'data-key': 'c-name', value: s.contactName, onInput: e => Site.setField('contactName', e.target.value) })]),
        h('div', { style: 'display:flex;gap:12px' }, [
          h('div', { class: 'field', style: 'flex:1' }, [h('label', {}, 'Email'), h('input', { class: 'input', 'data-key': 'c-email', value: s.contactEmail, onInput: e => Site.setField('contactEmail', e.target.value) })]),
          h('div', { class: 'field', style: 'flex:1' }, [h('label', {}, 'Phone'), h('input', { class: 'input', 'data-key': 'c-phone', value: s.contactPhone, onInput: e => Site.setField('contactPhone', e.target.value) })]),
        ]),
        h('div', { class: 'field' }, [h('label', {}, 'Pet name & breed'), h('input', { class: 'input', 'data-key': 'c-pet', value: s.contactPet, onInput: e => Site.setField('contactPet', e.target.value) })]),
        h('div', { class: 'field' }, [
          h('label', {}, 'Service interested in'),
          h('div', { class: 'seg', style: 'width:100%' }, [
            h('label', { class: 'seg-opt', style: 'flex:1;justify-content:center' }, [h('input', { type: 'radio', name: 'svc', checked: s.service === 'walks', onChange: () => Site.setSvc('walks') }), h('span', {}, 'Walks')]),
            h('label', { class: 'seg-opt', style: 'flex:1;justify-content:center' }, [h('input', { type: 'radio', name: 'svc', checked: s.service === 'dropin', onChange: () => Site.setSvc('dropin') }), h('span', {}, 'Drop-ins')]),
            h('label', { class: 'seg-opt', style: 'flex:1;justify-content:center' }, [h('input', { type: 'radio', name: 'svc', checked: s.service === 'sitting', onChange: () => Site.setSvc('sitting') }), h('span', {}, 'Sitting')]),
          ]),
        ]),
        h('div', { class: 'field' }, [h('label', {}, 'Message'), h('textarea', { class: 'input', 'data-key': 'c-msg', placeholder: 'Tell me a bit about your dog…', onInput: e => Site.setField('contactMessage', e.target.value) }, s.contactMessage)]),
        h('button', { class: 'btn btn-primary btn-block', style: 'height:48px', onClick: Site.submitContact }, 'Send request'),
      ]));
    }
    wrap.appendChild(left);
    wrap.appendChild(h('div', { class: 'card elev-sm', style: 'gap:12px;height:fit-content' }, [
      h('div', { class: 'card-title', style: 'font-size:16px' }, 'Contact info'),
      h('div', { style: 'font-size:13.5px' }, '📍 Serving the Willow St / Highland neighborhood'),
      h('div', { style: 'font-size:13.5px' }, ['📞 ', h('a', { href: 'tel:+15550401001' }, '(555) 040-1001')]),
      h('div', { style: 'font-size:13.5px' }, ['✉️ ', h('a', { href: 'mailto:ash@calliesalpinecanine.com' }, 'ash@calliesalpinecanine.com')]),
      h('div', { class: 'hr' }),
      h('div', { style: 'font-size:12px;opacity:.7' }, ['Already a client? ', h('a', { href: 'Pet Parent Portal.html', target: '_blank', rel: 'noopener' }, 'Log in to your portal'), ' to pay, message, or check on today\'s walk.']),
    ]));
    return wrap;
  },

  renderFooter(v) {
    return h('div', { style: 'margin-top:auto;padding:28px ' + v.sectionPad + ';border-top:1px solid var(--color-divider);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:12.5px;opacity:.65' }, [
      h('div', {}, "🐾 Callie's Alpine Canine"),
      h('div', {}, '© 2026 · Insured & bonded pet care'),
    ]);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Site.screenRoot = bootBrowserApp('root', 'calliesalpinecanine.com');
  Site.mq = window.matchMedia('(max-width: 760px)');
  const onMq = () => Site.setState({ isMobile: Site.mq.matches, mobileNavOpen: false });
  Site.mq.addEventListener ? Site.mq.addEventListener('change', onMq) : Site.mq.addListener(onMq);
  onMq();
});
