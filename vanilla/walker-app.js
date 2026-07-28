// walker-app.js — Dog Walking Tracker (the walker's app). Plain-JS
// reimplementation of Dog Walking Tracker.dc.html — same state machine,
// same seed data, same formulas, rendered with plain DOM instead of React.

// Android intent link: opens the Rover app (com.rover.android) if installed, else falls back to the Rover website.
const ROVER_URL = 'intent://www.rover.com/#Intent;scheme=https;package=com.rover.android;S.browser_fallback_url=https%3A%2F%2Fwww.rover.com%2F;end';

function mkClient(o) {
  return Object.assign({ packageUsed: 0, balance: 0, log: [], walks: [], sitting: null, phone: '+1 (555) 040-' + String(o.id || 0).padStart(4, '0') }, o);
}

const CLIENTS = [
mkClient({id:1,name:'Maria Chen',pet:'Biscuit',breed:'Cavalier King Charles',address:'214 Willow St',rateType:'package',packageTotal:10,packageUsed:6,rate:20,
  notes:{access:'Lockbox code 4471, key under mat',feeding:'1 cup kibble AM, no treats — chicken allergy',medical:'None',behavior:'Shy with strangers, warms up fast'},
  log:[{date:'Jul 24',text:'Great walk, met the neighbor dog fine.'}],
  walks:[{date:'Jul 27',duration:'32 min',distance:'1.8 mi',paid:true}]}),
mkClient({id:2,name:'Jordan Patel',pet:'Tank',breed:'Boxer',address:'88 Elm Ave',rateType:'perwalk',rate:25,balance:25,
  notes:{access:'Ring doorbell, owner buzzes in',feeding:'No feeding needed',medical:'Hip dysplasia — short walks only',behavior:'High energy, pulls on leash'},
  log:[{date:'Jul 22',text:'Kept pace slow per vet note, went well.'}],
  walks:[{date:'Jul 25',duration:'20 min',distance:'1.0 mi',paid:false}]}),
mkClient({id:3,name:'Sam Rivera',pet:'Luna & Milo',breed:'Aussie mix (x2)',address:'50 Cedar Ln',rateType:'package',packageTotal:5,packageUsed:5,rate:30,
  notes:{access:'Garage code 8821',feeding:'Separate bowls, Milo eats fast',medical:'None',behavior:'Both friendly, Luna leash-reactive to cats'},
  log:[{date:'Jul 20',text:'Package used up — need to renew.'}],
  walks:[{date:'Jul 21',duration:'40 min',distance:'2.1 mi',paid:true}]}),
mkClient({id:4,name:'Priya Nair',pet:'Cooper',breed:'Golden Retriever',address:'12 Birchwood Dr',rateType:'perwalk',rate:22,
  notes:{access:'Hidden key in fake rock by porch',feeding:'2 cups kibble, twice daily',medical:'None',behavior:'Very friendly, loves belly rubs'},
  log:[{date:'Jul 18',text:'Confirmed sitting dates for August trip.'}],
  walks:[{date:'Jul 23',duration:'35 min',distance:'2.0 mi',paid:true}],
  sitting:{start:'Aug 3',end:'Aug 5',tasks:[{label:'Morning feed',done:false},{label:'Midday walk',done:false},{label:'Evening feed',done:false},{label:'Water & yard check',done:false}]}}),
mkClient({id:5,name:'Devon Brooks',pet:'Peanut',breed:'Dachshund',address:'305 Maple Ct',rateType:'package',packageTotal:10,packageUsed:3,rate:18,source:'rover',
  notes:{access:'Owner home most days, text on arrival',feeding:'Half cup, watch weight',medical:'Back issues — no stairs/jumping',behavior:'Sweet, a bit vocal'},
  log:[],walks:[{date:'Jul 26',duration:'18 min',distance:'0.8 mi',paid:true}]}),
mkClient({id:6,name:'Alicia Gomez',pet:'Zeus',breed:'German Shepherd',address:'77 Aspen Way',rateType:'perwalk',rate:28,balance:56,
  notes:{access:'Side gate, combo 2210',feeding:'No feeding needed',medical:'None',behavior:'Protective, needs firm handling'},
  log:[{date:'Jul 15',text:'Doing well with the halti collar.'}],
  walks:[{date:'Jul 19',duration:'30 min',distance:'1.6 mi',paid:false},{date:'Jul 12',duration:'28 min',distance:'1.5 mi',paid:false}]}),
mkClient({id:7,name:'Noah Kim',pet:'Daisy',breed:'Poodle mix',address:'9 Fairview Rd',rateType:'package',packageTotal:10,packageUsed:9,rate:20,
  notes:{access:'Doggie door, no entry needed',feeding:'N/A',medical:'None',behavior:'Easygoing, great on leash'},
  log:[{date:'Jul 21',text:'One walk left on package — remind to renew.'}],
  walks:[{date:'Jul 24',duration:'25 min',distance:'1.3 mi',paid:true}]}),
mkClient({id:8,name:'Sophie Turner',pet:'Ranger',breed:'Labrador',address:'421 Highland Ave',rateType:'perwalk',rate:24,
  notes:{access:'Lockbox code 9034',feeding:'2 cups AM and PM',medical:'None',behavior:'Loves water, avoid puddles on walks'},
  log:[],walks:[{date:'Jul 20',duration:'33 min',distance:'1.9 mi',paid:true}],
  sitting:{start:'Aug 8',end:'Aug 10',tasks:[{label:'Morning feed',done:false},{label:'Midday walk',done:false},{label:'Evening feed',done:false},{label:'Meds — none',done:true}]}}),
mkClient({id:9,name:'Marcus Webb',pet:'Coco',breed:'French Bulldog',address:'63 Orchard St',rateType:'package',packageTotal:5,packageUsed:2,rate:26,
  notes:{access:'Buzzer, unit 4B',feeding:'Small portions, prone to bloat',medical:'Brachycephalic — short walks, avoid heat',behavior:'Calm, loves attention'},
  log:[],walks:[{date:'Jul 17',duration:'15 min',distance:'0.6 mi',paid:true}]}),
mkClient({id:10,name:'Elena Ruiz',pet:'Bear',breed:'Newfoundland',address:'140 Lakeview Dr',rateType:'perwalk',rate:32,balance:32,source:'rover',
  notes:{access:'Key with neighbor at #142',feeding:'No feeding needed',medical:'None',behavior:'Very large, slow and gentle'},
  log:[],walks:[{date:'Jul 18',duration:'40 min',distance:'1.7 mi',paid:false}]}),
mkClient({id:11,name:'Tyler Osei',pet:'Pepper',breed:'Mini Aussie',address:'28 Sunset Blvd',rateType:'package',packageTotal:10,packageUsed:7,rate:20,
  notes:{access:'Code 5567',feeding:'N/A',medical:'None',behavior:'Smart, knows tricks, high energy'},
  log:[],walks:[{date:'Jul 22',duration:'30 min',distance:'1.8 mi',paid:true}]}),
mkClient({id:12,name:'Grace Lin',pet:'Olive',breed:'Beagle',address:'19 Chestnut Pl',rateType:'perwalk',rate:22,
  notes:{access:'Owner works from home',feeding:'N/A',medical:'None',behavior:'Nose to the ground, loves sniff walks'},
  log:[],walks:[{date:'Jul 25',duration:'28 min',distance:'1.4 mi',paid:true}]}),
mkClient({id:13,name:'Ben Foster',pet:'Duke',breed:'Rottweiler',address:'505 Ridge Rd',rateType:'package',packageTotal:10,packageUsed:4,rate:24,source:'rover',
  notes:{access:'Text on arrival, owner lets in',feeding:'N/A',medical:'None',behavior:'Well trained, great with people'},
  log:[],walks:[{date:'Jul 19',duration:'35 min',distance:'2.0 mi',paid:true}]}),
mkClient({id:14,name:'Hannah Diaz',pet:'Waffles',breed:'Corgi',address:'82 Meadow Ln',rateType:'perwalk',rate:20,balance:20,
  notes:{access:'Lockbox 3120',feeding:'Half cup, twice daily while sitting',medical:'None',behavior:'Chatty, loves belly rubs'},
  log:[{date:'Jul 14',text:'Confirmed sitting for mid-August.'}],
  walks:[{date:'Jul 16',duration:'22 min',distance:'1.1 mi',paid:false}],
  sitting:{start:'Aug 14',end:'Aug 16',tasks:[{label:'Morning feed',done:false},{label:'Midday walk',done:false},{label:'Evening feed',done:false},{label:'Water & yard check',done:false}]}}),
mkClient({id:15,name:'Owen Clarke',pet:'Rocky',breed:'Pit mix',address:'11 Harbor View',rateType:'package',packageTotal:5,packageUsed:5,rate:25,source:'rover',
  notes:{access:'Side door, code 1290',feeding:'N/A',medical:'None',behavior:'Sweet but strong, needs experienced walker'},
  log:[{date:'Jul 20',text:'Package finished, discussed renewal.'}],
  walks:[{date:'Jul 20',duration:'30 min',distance:'1.7 mi',paid:true}]}),
];

const App = {
  state: {
    screen: 'home',
    selectedClientId: null,
    selSittingClientId: null,
    search: '',
    noteDraft: '',
    showWalkPicker: false,
    showAddClient: false,
    showShareSheet: false,
    copied: false,
    draft: { name: '', pet: '', breed: '', address: '', rateType: 'perwalk', rate: '20' },
    walk: null,
    walkNoteDraft: '',
    payChoice: 'paid',
    clients: CLIENTS,
  },
  timer: null,
  screenRoot: null,
  _shareText: '',

  setState(patch) {
    const next = typeof patch === 'function' ? patch(this.state) : patch;
    if (next) Object.assign(this.state, next);
    this.render();
  },

  // ── navigation ──
  goHome() { App.setState({ screen: 'home', showWalkPicker: false }); },
  goClients() { App.setState({ screen: 'clients' }); },
  goCalendar() { App.setState({ screen: 'calendar' }); },
  goPayments() { App.setState({ screen: 'payments' }); },
  openWalkPicker() { App.setState({ showWalkPicker: true }); },
  closeWalkPicker() { App.setState({ showWalkPicker: false }); },
  openAddClient() { App.setState({ showAddClient: true, draft: { name: '', pet: '', breed: '', address: '', rateType: 'perwalk', rate: '20' } }); },
  closeAddClient() { App.setState({ showAddClient: false }); },
  backToClients() { App.setState({ screen: 'clients' }); },

  setSearch(v) { App.setState({ search: v }); },
  setNoteDraft(v) { App.setState({ noteDraft: v }); },
  addNote() {
    const text = App.state.noteDraft.trim();
    if (!text) return;
    const clients = App.state.clients.map(c => c.id === App.state.selectedClientId ? Object.assign({}, c, { log: [{ date: 'Today', text }, ...c.log] }) : c);
    App.setState({ clients, noteDraft: '' });
  },
  markClientPaid(id) {
    const clients = App.state.clients.map(c => c.id === id ? Object.assign({}, c, { balance: 0, walks: c.walks.map(w => Object.assign({}, w, { paid: true })) }) : c);
    App.setState({ clients });
  },

  setDraftField(field, v) { App.setState({ draft: Object.assign({}, App.state.draft, { [field]: v }) }); },
  setDraftPerWalk() { App.setState({ draft: Object.assign({}, App.state.draft, { rateType: 'perwalk' }) }); },
  setDraftPackage() { App.setState({ draft: Object.assign({}, App.state.draft, { rateType: 'package' }) }); },
  submitAddClient() {
    const d = App.state.draft;
    if (!d.name.trim()) return;
    const nc = mkClient({
      id: Date.now(), name: d.name, pet: d.pet || 'Pet', breed: d.breed || '—', address: d.address || '—',
      rateType: d.rateType, rate: parseFloat(d.rate) || 20, packageTotal: d.rateType === 'package' ? 10 : undefined,
      notes: { access: '—', feeding: '—', medical: '—', behavior: '—' },
    });
    App.setState({ clients: [nc, ...App.state.clients], showAddClient: false });
  },

  startWalkFor(clientId) {
    if (App.timer) clearInterval(App.timer);
    App.setState({
      screen: 'walkActive', showWalkPicker: false, selectedClientId: clientId,
      walk: { clientId, elapsed: 0, distanceMi: 0, path: [[40, 340], [40, 340]], peeCount: 0, poopCount: 0 },
    });
    App.timer = setInterval(() => {
      App.setState(s => {
        if (!s.walk) return null;
        const last = s.walk.path[s.walk.path.length - 1];
        const nx = Math.max(20, Math.min(392, last[0] + (Math.random() * 36 - 14)));
        const ny = Math.max(60, Math.min(660, last[1] - (6 + Math.random() * 10)));
        const path = [...s.walk.path, [nx, ny]].slice(-60);
        return { walk: Object.assign({}, s.walk, { elapsed: s.walk.elapsed + 1, distanceMi: s.walk.distanceMi + 0.007 + Math.random() * 0.006, path }) };
      });
    }, 1000);
  },
  stopWalk() {
    if (App.timer) clearInterval(App.timer);
    App.setState({ screen: 'walkSummary', payChoice: 'paid', walkNoteDraft: '' });
  },
  cancelWalk() {
    if (App.timer) clearInterval(App.timer);
    App.setState({ screen: 'home', walk: null });
  },
  backFromSummary() {
    const clientId = App.state.walk ? App.state.walk.clientId : App.state.selectedClientId;
    App.setState({ screen: 'clientDetail', selectedClientId: clientId, walk: null });
  },
  incPee() { App.setState(s => ({ walk: Object.assign({}, s.walk, { peeCount: s.walk.peeCount + 1 }) })); },
  incPoop() { App.setState(s => ({ walk: Object.assign({}, s.walk, { poopCount: s.walk.poopCount + 1 }) })); },
  openShareSheet() { App.setState({ showShareSheet: true, copied: false }); },
  closeShareSheet() { App.setState({ showShareSheet: false }); },
  copyShareText() {
    const text = App._shareText || '';
    try { navigator.clipboard.writeText(text); } catch (e) {}
    App.setState({ copied: true });
    setTimeout(() => App.setState({ copied: false }), 2000);
  },
  renewPackage(id) {
    const clients = App.state.clients.map(c => c.id === id ? Object.assign({}, c, { packageUsed: 0 }) : c);
    App.setState({ clients });
  },
  setWalkNoteDraft(v) { App.setState({ walkNoteDraft: v }); },
  setPayPaid() { App.setState({ payChoice: 'paid' }); },
  setPayOwe() { App.setState({ payChoice: 'owe' }); },
  saveWalkSummary() {
    const w = App.state.walk;
    if (!w) return;
    const note = App.state.walkNoteDraft.trim();
    const mins = Math.round(w.elapsed / 60) || 1;
    const dist = w.distanceMi.toFixed(2) + ' mi';
    const clients = App.state.clients.map(c => {
      if (c.id !== w.clientId) return c;
      const isPackage = c.rateType === 'package';
      const paid = App.state.payChoice === 'paid';
      const walkRec = { date: 'Today', duration: mins + ' min', distance: dist, paid: isPackage ? true : paid };
      const potty = '💧 ' + w.peeCount + ' · 💩 ' + w.poopCount;
      const fullNote = note ? (potty + ' — ' + note) : potty;
      const log = [{ date: 'Today', text: fullNote }, ...c.log];
      return Object.assign({}, c, {
        packageUsed: isPackage ? c.packageUsed + 1 : c.packageUsed,
        balance: isPackage ? c.balance : (paid ? c.balance : c.balance + c.rate),
        walks: [walkRec, ...c.walks], log,
      });
    });
    App.setState({ clients, screen: 'clientDetail', selectedClientId: w.clientId, walk: null });
  },
  toggleTask(clientId, idx) {
    const clients = App.state.clients.map(c => {
      if (c.id !== clientId || !c.sitting) return c;
      const tasks = c.sitting.tasks.map((t, i) => i === idx ? Object.assign({}, t, { done: !t.done }) : t);
      return Object.assign({}, c, { sitting: Object.assign({}, c.sitting, { tasks }) });
    });
    App.setState({ clients });
  },
  selectSittingDay(cid) { App.setState({ selSittingClientId: cid, screen: 'calendar' }); },
  selectSitting(cid) { App.setState({ selSittingClientId: cid }); },
  openClient(id) { App.setState({ screen: 'clientDetail', selectedClientId: id }); },

  // ── derived values (mirrors renderVals() in the source) ──
  computeVals() {
    const s = App.state;
    const clients = s.clients;
    const selClientRaw = clients.find(c => c.id === s.selectedClientId);

    const q = s.search.toLowerCase();
    const filtered = clients.filter(c => !q || c.name.toLowerCase().includes(q) || c.pet.toLowerCase().includes(q)).map(c => {
      const balanceTag = c.balance > 0;
      const lowPkg = c.rateType === 'package' && (c.packageTotal - c.packageUsed) <= 2;
      return {
        client: c, initial: initials(c.name), isRover: c.source === 'rover',
        tagClass: balanceTag ? 'tag-accent' : (lowPkg ? 'tag-accent-2' : 'tag-neutral'),
        tagText: balanceTag ? ('$' + c.balance + ' owed') : (c.rateType === 'package' ? (c.packageTotal - c.packageUsed) + ' left' : 'per walk'),
      };
    });

    let selClient = null;
    if (selClientRaw) {
      const c = selClientRaw;
      selClient = {
        client: c, initial: initials(c.name), isRover: c.source === 'rover',
        rateLabel: c.rateType === 'package' ? '$' + c.rate + ' · ' + (c.packageTotal - c.packageUsed) + '/' + c.packageTotal + ' left' : '$' + c.rate + '/walk',
        balanceLabel: c.balance > 0 ? '$' + c.balance + ' owed' : 'Paid up',
        balanceColor: c.balance > 0 ? 'var(--color-accent-700)' : 'var(--color-accent-2-700)',
        showMarkPaid: c.balance > 0, isNotRover: c.source !== 'rover',
        messageUrl: c.source === 'rover' ? ROVER_URL : ('sms:' + c.phone + '?body=' + encodeURIComponent('Hi ' + c.name.split(' ')[0] + ', this is Ash — checking in about ' + c.pet + '!')),
        messageLabel: c.source === 'rover' ? 'Message in Rover app' : 'Message client',
        hasSitting: !!c.sitting,
        sittingRange: c.sitting ? (c.sitting.start + ' – ' + c.sitting.end) : null,
        walks: c.walks.map(w => Object.assign({}, w, { tagClass: w.paid ? 'tag-accent-2' : 'tag-accent', tagText: w.paid ? 'Paid' : 'Unpaid' })),
      };
    }

    const walk = s.walk;
    const walkClient = walk ? clients.find(c => c.id === walk.clientId) : null;
    const routePoints = walk ? walk.path.map(p => p[0] + ',' + p[1]).join(' ') : '';
    const routeStart = walk ? { x: walk.path[0][0], y: walk.path[0][1] } : { x: 0, y: 0 };
    const routeEnd = walk ? { x: walk.path[walk.path.length - 1][0], y: walk.path[walk.path.length - 1][1] } : { x: 0, y: 0 };
    const elapsedLabel = walk ? fmtTime(walk.elapsed) : '00:00';
    const distanceLabel = walk ? walk.distanceMi.toFixed(2) + ' mi' : '0.00 mi';
    const pace = walk && walk.distanceMi > 0.03 ? fmtTime(Math.round((walk.elapsed / 60) / walk.distanceMi * 60)) : '—:—';

    const owedClientsRaw = clients.filter(c => c.balance > 0).sort((a, b) => b.balance - a.balance);
    const owedClients = owedClientsRaw.map(c => ({
      client: c, name: c.name, balance: c.balance,
      unpaidCountLabel: c.walks.filter(w => !w.paid).length + ' unpaid walk' + (c.walks.filter(w => !w.paid).length === 1 ? '' : 's'),
    }));
    const totalOwed = owedClientsRaw.reduce((a, c) => a + c.balance, 0);

    const packageClients = clients.filter(c => c.rateType === 'package').map(c => {
      const remain = c.packageTotal - c.packageUsed;
      return { name: c.name, remainLabel: remain + ' left', pct: Math.max(4, (remain / c.packageTotal) * 100), tagClass: remain <= 2 ? 'tag-accent' : 'tag-accent-2' };
    });

    const reminders = [];
    owedClientsRaw.forEach(c => reminders.push({ text: c.name + ' owes $' + c.balance, tagText: 'Unpaid', clientId: c.id, renewId: null }));
    clients.filter(c => c.rateType === 'package' && (c.packageTotal - c.packageUsed) <= 2).forEach(c => {
      const left = c.packageTotal - c.packageUsed;
      reminders.push({ text: c.name + ' has ' + left + ' walk' + (left === 1 ? '' : 's') + ' left on their package', tagText: 'Low', clientId: c.id, renewId: c.id });
    });

    const todaySchedule = [
      { time: '8:00 AM', name: 'Jordan Patel', pet: 'Tank', type: 'Walk', petInitial: 'T' },
      { time: '12:30 PM', name: 'Priya Nair', pet: 'Cooper', type: 'Sitting check-in', petInitial: 'C' },
      { time: '5:30 PM', name: 'Grace Lin', pet: 'Olive', type: 'Walk', petInitial: 'O' },
    ];

    // calendar
    const monthLabel = 'August 2026';
    const sittingByDay = { 3: 4, 4: 4, 5: 4, 8: 8, 9: 8, 10: 8, 14: 14, 15: 14, 16: 14 };
    const leadingBlanks = 6; // Aug 1 2026 assumed Saturday
    const days = [];
    for (let i = 0; i < leadingBlanks; i++) days.push({ blank: true });
    for (let d = 1; d <= 31; d++) {
      const cid = sittingByDay[d];
      const sel = s.selSittingClientId === cid && cid;
      days.push({
        num: d, hasSitting: !!cid, cid,
        bg: sel ? 'var(--color-accent-700)' : (cid ? 'var(--color-accent-2-100)' : 'transparent'),
        color: sel ? 'var(--color-bg)' : 'var(--color-text)',
      });
    }

    const sittingClients = clients.filter(c => c.sitting);
    const sittingsList = sittingClients.map(c => ({ clientId: c.id, clientName: c.name, pet: c.pet, address: c.address, range: c.sitting.start + ' – ' + c.sitting.end }));
    let selSitting = null;
    if (s.selSittingClientId) {
      const c = clients.find(c => c.id === s.selSittingClientId);
      if (c && c.sitting) {
        selSitting = {
          clientId: c.id, clientName: c.name, range: c.sitting.start + ' – ' + c.sitting.end, address: c.address,
          tasks: c.sitting.tasks.map((t, i) => ({ idx: i, label: t.label, done: t.done, bg: t.done ? 'var(--color-accent-2-600)' : 'transparent', textStyle: t.done ? 'text-decoration:line-through;opacity:.55' : '' })),
        };
      }
    }

    const screen = s.screen;
    return {
      screen, filtered, selClient, walk, walkClient, routePoints, routeStart, routeEnd, elapsedLabel, distanceLabel, pace,
      owedClients, totalOwed, owedCount: owedClientsRaw.length, packageClients, reminders, todaySchedule,
      monthLabel, days, sittingsList, selSitting, sittingClientsCount: sittingClients.length,
      mapEmbedUrl: walkClient ? ('https://maps.google.com/maps?q=' + encodeURIComponent(walkClient.address) + '&z=15&output=embed') : '',
      walkClientIsRover: !!(walkClient && walkClient.source === 'rover'),
      walkClientIsNotRover: !!(walkClient && walkClient.source !== 'rover'),
      shareSheetTitle: screen === 'walkActive' ? 'Share live location' : 'Share summary',
      shareText: (App._shareText = walkClient ? (
        screen === 'walkActive'
          ? ('🔴 Live: tracking ' + walkClient.pet + "'s walk now — " + elapsedLabel + ' in, ' + distanceLabel + ' so far.')
          : (walkClient.name + "'s walk with " + walkClient.pet + ' — ' + elapsedLabel + ', ' + distanceLabel + '. 💧 ' + (walk ? walk.peeCount : 0) + ' · 💩 ' + (walk ? walk.poopCount : 0) + (s.walkNoteDraft.trim() ? ('. Notes: ' + s.walkNoteDraft.trim()) : ''))
      ) : ''),
      payOweLabel: walkClient && walkClient.rateType === 'package' ? 'Use credit' : 'Mark owed',
    };
  },

  // ── rendering ──
  render() {
    withFocusPreserved(App.screenRoot, () => {
      const v = App.computeVals();
      const s = App.state;
      const kids = [];

      if (v.screen === 'home') kids.push(App.renderHome(v));
      else if (v.screen === 'clients') kids.push(App.renderClients(v));
      else if (v.screen === 'clientDetail') kids.push(App.renderClientDetail(v));
      else if (v.screen === 'walkActive') kids.push(App.renderWalkActive(v));
      else if (v.screen === 'walkSummary') kids.push(App.renderWalkSummary(v));
      else if (v.screen === 'payments') kids.push(App.renderPayments(v));
      else if (v.screen === 'calendar') kids.push(App.renderCalendar(v));

      if (s.showShareSheet) kids.push(App.renderShareSheet(v));

      const showBottomNav = ['home', 'clients', 'calendar', 'payments'].includes(v.screen);
      if (showBottomNav) kids.push(App.renderBottomNav(v));

      if (s.showAddClient) kids.push(App.renderAddClientDialog());

      mount(App.screenRoot, kids);
    });
  },

  renderHome(v) {
    const s = App.state;
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:22px 20px 12px;display:flex;flex-direction:column;gap:18px' });

    wrap.appendChild(h('div', { style: 'display:flex;align-items:center;justify-content:space-between' }, [
      h('div', {}, [
        h('div', { style: 'font-size:12px;color:color-mix(in srgb,var(--color-text) 55%,transparent)' }, 'Tuesday, July 28'),
        h('h2', { style: 'margin:2px 0 0' }, 'Good morning, Ash'),
      ]),
      h('div', { style: 'width:42px;height:42px;border-radius:50%;background:var(--color-accent-2-200);display:flex;align-items:center;justify-content:center;color:var(--color-accent-2-800);font-family:var(--font-heading)' }, 'A'),
    ]));

    const earnCard = h('div', { class: 'card elev-sm', style: 'background:var(--color-accent-100)' }, [
      h('div', { class: 'card-kicker' }, 'This week'),
      h('div', { style: 'display:flex;align-items:baseline;gap:8px' }, [
        h('h1', { style: 'margin:0;font-size:36px' }, '$268'),
        h('span', { style: 'font-size:13px;opacity:.7' }, 'earned'),
      ]),
      h('div', { style: 'display:flex;gap:16px;margin-top:2px' }, [
        h('div', { style: 'font-size:12px' }, [h('strong', {}, '12'), ' walks']),
        h('div', { style: 'font-size:12px' }, [h('strong', {}, String(v.sittingClientsCount)), ' sittings active']),
      ]),
    ]);
    wrap.appendChild(earnCard);

    wrap.appendChild(h('div', { style: 'display:flex;gap:10px' }, [
      h('button', { class: 'btn btn-primary btn-block', style: 'height:52px;font-size:15px;flex:1;margin-top:0', onClick: App.openWalkPicker }, [icon('play'), ' Start a walk']),
      h('button', { class: 'btn btn-secondary', style: 'height:52px;width:52px;flex:none;padding:0', onClick: App.openAddClient }, [icon('plus')]),
    ]));

    if (s.showWalkPicker) {
      const pickerCard = h('div', { class: 'card elev-md', style: 'gap:var(--space-2)' }, [
        h('div', { class: 'card-title', style: 'font-size:14px' }, 'Who are you walking?'),
      ]);
      v.filtered.forEach(fc => {
        const c = fc.client;
        pickerCard.appendChild(h('div', {
          style: 'display:flex;align-items:center;gap:10px;padding:6px 2px;cursor:pointer',
          onClick: () => { if (c.source === 'rover') window.open(ROVER_URL, '_blank'); else App.startWalkFor(c.id); },
        }, [
          h('div', { style: 'width:32px;height:32px;border-radius:50%;background:var(--color-accent-2-200);color:var(--color-accent-2-800);display:flex;align-items:center;justify-content:center;font-size:13px;font-family:var(--font-heading);flex:none' }, initials(c.name)),
          h('div', { style: 'font-size:13px;flex:1' }, c.name + ' · ' + c.pet),
          fc.isRover ? h('span', { class: 'tag tag-outline' }, 'Rover') : null,
        ]));
      });
      pickerCard.appendChild(h('button', { class: 'btn btn-ghost', style: 'align-self:flex-start', onClick: App.closeWalkPicker }, 'Cancel'));
      wrap.appendChild(pickerCard);
    }

    const todayBlock = h('div', {}, [h('h4', { style: 'margin:0 0 8px' }, 'Today')]);
    const todayList = h('div', { style: 'display:flex;flex-direction:column;gap:8px' });
    v.todaySchedule.forEach(t => {
      todayList.appendChild(h('div', { class: 'card elev-sm', style: 'flex-direction:row;align-items:center;gap:12px' }, [
        h('div', { style: 'font-family:var(--font-heading);font-size:13px;color:var(--color-accent-700);width:56px;flex:none' }, t.time),
        h('div', { style: 'width:34px;height:34px;border-radius:50%;background:var(--color-accent-2-200);color:var(--color-accent-2-800);display:flex;align-items:center;justify-content:center;font-size:12px;font-family:var(--font-heading);flex:none' }, t.petInitial),
        h('div', { style: 'flex:1' }, [
          h('div', { style: 'font-size:13px;font-weight:600' }, t.name + ' · ' + t.pet),
          h('div', { style: 'font-size:11px;opacity:.65' }, t.type),
        ]),
      ]));
    });
    todayBlock.appendChild(todayList);
    wrap.appendChild(todayBlock);

    const remindersBlock = h('div', {}, [h('h4', { style: 'margin:0 0 8px' }, 'Reminders')]);
    const remindersList = h('div', { style: 'display:flex;flex-direction:column;gap:8px' });
    v.reminders.forEach(r => {
      const open = () => App.setState({ screen: 'clientDetail', selectedClientId: r.clientId });
      const row = h('div', { class: 'card elev-sm', style: 'flex-direction:row;align-items:center;gap:10px' }, [
        h('span', { style: 'flex:none;cursor:pointer', onClick: open, html: ICONS.alertCircle }),
        h('div', { style: 'font-size:12.5px;flex:1;cursor:pointer', onClick: open }, r.text),
        r.renewId ? h('button', { class: 'btn btn-secondary', style: 'font-size:11px;padding:4px 10px', onClick: () => App.renewPackage(r.renewId) }, 'Renew') : null,
        h('span', { class: 'tag tag-accent' }, r.tagText),
      ]);
      remindersList.appendChild(row);
    });
    remindersBlock.appendChild(remindersList);
    wrap.appendChild(remindersBlock);

    return wrap;
  },

  renderClients(v) {
    const wrap = h('div', { style: 'position:relative;flex:1;overflow:hidden;display:flex;flex-direction:column' });
    const scroll = h('div', { style: 'flex:1;overflow-y:auto;padding:22px 20px 90px;display:flex;flex-direction:column;gap:14px' });
    scroll.appendChild(h('h2', { style: 'margin:0' }, 'Clients'));
    scroll.appendChild(h('input', { class: 'input', 'data-key': 'search', placeholder: 'Search clients or pets', value: App.state.search, onInput: e => App.setSearch(e.target.value) }));
    const list = h('div', { style: 'display:flex;flex-direction:column;gap:10px' });
    v.filtered.forEach(fc => {
      const c = fc.client;
      list.appendChild(h('div', { class: 'card elev-sm', style: 'flex-direction:row;align-items:center;gap:12px;cursor:pointer', onClick: () => App.openClient(c.id) }, [
        h('div', { style: 'width:44px;height:44px;border-radius:50%;background:var(--color-accent-2-200);color:var(--color-accent-2-800);display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:16px;flex:none' }, fc.initial),
        h('div', { style: 'flex:1;min-width:0' }, [
          h('div', { style: 'font-size:14px;font-weight:600' }, c.name),
          h('div', { style: 'font-size:12px;opacity:.65' }, c.pet + ' · ' + c.breed),
        ]),
        fc.isRover ? h('span', { class: 'tag tag-outline' }, 'Rover') : null,
        h('span', { class: 'tag ' + fc.tagClass }, fc.tagText),
      ]));
    });
    scroll.appendChild(list);
    wrap.appendChild(scroll);
    wrap.appendChild(h('button', {
      style: 'position:absolute;right:20px;bottom:88px;width:52px;height:52px;border-radius:50%;background:var(--color-accent);color:var(--color-bg);border:none;box-shadow:var(--shadow-lg);display:flex;align-items:center;justify-content:center;cursor:pointer',
      onClick: App.openAddClient,
    }, [icon('plusLg')]));
    return wrap;
  },

  renderClientDetail(v) {
    const sc = v.selClient;
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:18px 20px 24px;display:flex;flex-direction:column;gap:16px' });
    if (!sc) return wrap;
    const c = sc.client;

    wrap.appendChild(h('div', { style: 'display:flex;align-items:center;gap:10px' }, [
      h('button', { class: 'btn btn-icon btn-secondary', onClick: App.backToClients }, [icon('back')]),
      h('h3', { style: 'margin:0' }, c.name),
      sc.isRover ? h('span', { class: 'tag tag-outline' }, 'Rover') : null,
    ]));

    if (sc.isRover) {
      wrap.appendChild(h('div', { class: 'card elev-sm', style: 'background:var(--color-accent-2-100);flex-direction:row;align-items:center;gap:8px' }, [
        h('span', { style: 'flex:none', html: ICONS.messageSm }),
        h('div', { style: 'font-size:12px' }, 'Booked via Rover — message this client in the Rover app.'),
      ]));
    }

    wrap.appendChild(h('div', { class: 'card elev-sm', style: 'flex-direction:row;align-items:center;gap:12px' }, [
      h('div', { style: 'width:48px;height:48px;border-radius:50%;background:var(--color-accent-2-200);color:var(--color-accent-2-800);display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:18px;flex:none' }, sc.initial),
      h('div', { style: 'flex:1' }, [
        h('div', { style: 'font-size:14px;font-weight:600' }, c.pet + ' · ' + c.breed),
        h('div', { style: 'font-size:12px;opacity:.7' }, c.address),
      ]),
    ]));

    wrap.appendChild(h('div', { style: 'display:flex;gap:10px' }, [
      h('div', { class: 'card elev-sm', style: 'flex:1;gap:2px' }, [h('div', { class: 'card-kicker' }, 'Rate'), h('div', { style: 'font-family:var(--font-heading);font-size:16px' }, sc.rateLabel)]),
      h('div', { class: 'card elev-sm', style: 'flex:1;gap:2px' }, [h('div', { class: 'card-kicker' }, 'Balance'), h('div', { style: 'font-family:var(--font-heading);font-size:16px;color:' + sc.balanceColor }, sc.balanceLabel)]),
    ]));

    const actionRow = h('div', { style: 'display:flex;gap:10px' });
    if (sc.isRover) actionRow.appendChild(h('a', { class: 'btn btn-primary', style: 'flex:1;text-decoration:none', href: ROVER_URL, target: '_blank', rel: 'noopener' }, 'Start walk in Rover'));
    if (sc.isNotRover) actionRow.appendChild(h('button', { class: 'btn btn-primary', style: 'flex:1', onClick: () => App.startWalkFor(c.id) }, 'Start walk'));
    if (sc.showMarkPaid) actionRow.appendChild(h('button', { class: 'btn btn-secondary', style: 'flex:1', onClick: () => App.markClientPaid(c.id) }, 'Mark paid'));
    wrap.appendChild(actionRow);

    wrap.appendChild(h('a', { class: 'btn btn-secondary btn-block', style: 'text-decoration:none;margin-top:0', href: sc.messageUrl, target: '_blank', rel: 'noopener' }, [icon('message'), ' ' + sc.messageLabel]));

    wrap.appendChild(h('div', {}, [
      h('h5', { style: 'margin:0 0 8px' }, 'Care notes'),
      h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:8px' }, [
        h('div', { class: 'card elev-sm', style: 'gap:3px' }, [h('div', { class: 'card-kicker' }, 'Access'), h('div', { style: 'font-size:12.5px' }, c.notes.access)]),
        h('div', { class: 'card elev-sm', style: 'gap:3px' }, [h('div', { class: 'card-kicker' }, 'Feeding'), h('div', { style: 'font-size:12.5px' }, c.notes.feeding)]),
        h('div', { class: 'card elev-sm', style: 'gap:3px' }, [h('div', { class: 'card-kicker' }, 'Medical'), h('div', { style: 'font-size:12.5px' }, c.notes.medical)]),
        h('div', { class: 'card elev-sm', style: 'gap:3px' }, [h('div', { class: 'card-kicker' }, 'Behavior'), h('div', { style: 'font-size:12.5px' }, c.notes.behavior)]),
      ]),
    ]));

    const logBlock = h('div', {}, [h('h5', { style: 'margin:0 0 8px' }, 'Log')]);
    const logList = h('div', { style: 'display:flex;flex-direction:column;gap:6px;margin-bottom:8px' });
    c.log.forEach(l => {
      logList.appendChild(h('div', { style: 'font-size:12.5px;padding:8px 10px;background:var(--color-surface);border-radius:var(--radius-md)' }, [h('strong', { style: 'opacity:.6;font-weight:600' }, l.date + ' —'), ' ' + l.text]));
    });
    logBlock.appendChild(logList);
    logBlock.appendChild(h('div', { style: 'display:flex;gap:8px' }, [
      h('input', { class: 'input', 'data-key': 'noteDraft', placeholder: 'Add a note…', value: App.state.noteDraft, onInput: e => App.setNoteDraft(e.target.value) }),
      h('button', { class: 'btn btn-secondary', onClick: App.addNote }, 'Add'),
    ]));
    wrap.appendChild(logBlock);

    if (sc.hasSitting) {
      wrap.appendChild(h('div', {}, [
        h('h5', { style: 'margin:0 0 8px' }, 'Upcoming sitting'),
        h('div', { class: 'card elev-sm', style: 'gap:6px' }, [
          h('div', { style: 'font-size:13px;font-weight:600' }, sc.sittingRange),
          h('div', { style: 'font-size:12px;opacity:.7' }, c.address),
        ]),
      ]));
    }

    const walkHistBlock = h('div', {}, [h('h5', { style: 'margin:0 0 8px' }, 'Walk history')]);
    const walkHistList = h('div', { style: 'display:flex;flex-direction:column;gap:6px' });
    sc.walks.forEach(w => {
      walkHistList.appendChild(h('div', { style: 'display:flex;align-items:center;gap:10px;font-size:12.5px;padding:8px 10px;background:var(--color-surface);border-radius:var(--radius-md)' }, [
        h('div', { style: 'width:60px;flex:none;opacity:.65' }, w.date),
        h('div', { style: 'flex:1' }, w.duration + ' · ' + w.distance),
        h('span', { class: 'tag ' + w.tagClass }, w.tagText),
      ]));
    });
    walkHistBlock.appendChild(walkHistList);
    wrap.appendChild(walkHistBlock);

    return wrap;
  },

  renderWalkActive(v) {
    const w = v.walk, wc = v.walkClient;
    const wrap = h('div', { style: 'flex:1;position:relative;overflow:hidden;background:var(--color-accent-2-100)' });
    wrap.appendChild(h('iframe', { title: 'Live map', src: v.mapEmbedUrl, style: 'position:absolute;inset:0;width:100%;height:100%;border:0', loading: 'lazy', class: 'washed' }));

    const svg = frag('<svg width="100%" height="100%" viewBox="0 0 412 700" style="position:absolute;inset:0;pointer-events:none"></svg>');
    svg.appendChild(frag('<polyline points="' + v.routePoints + '" fill="none" stroke="var(--color-accent-700)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"></polyline>'));
    svg.appendChild(frag('<circle cx="' + v.routeStart.x + '" cy="' + v.routeStart.y + '" r="7" fill="var(--color-accent-2-700)"></circle>'));
    svg.appendChild(frag('<circle cx="' + v.routeEnd.x + '" cy="' + v.routeEnd.y + '" r="8" fill="var(--color-accent-700)"></circle>'));
    wrap.appendChild(svg);

    wrap.appendChild(h('div', { style: 'position:absolute;top:16px;left:16px;right:16px;display:flex;align-items:center;gap:8px' }, [
      h('button', { class: 'btn btn-icon btn-secondary', style: 'background:var(--color-bg);flex:none', onClick: App.cancelWalk }, [icon('back')]),
      h('span', { class: 'tag tag-accent', style: 'animation:pulseDot 1.4s infinite' }, '● Live'),
      h('span', { style: 'font-size:12.5px;font-weight:600;background:var(--color-bg);padding:4px 10px;border-radius:999px' }, wc ? wc.name : ''),
    ]));
    wrap.appendChild(h('div', { style: 'position:absolute;top:60px;left:16px;display:flex;align-items:center;gap:5px;background:var(--color-bg);padding:4px 10px;border-radius:999px;font-size:11px;opacity:.75' }, [icon('gps'), ' Live map · GPS paired']));

    const sheet = h('div', { style: 'position:absolute;left:0;right:0;bottom:0;background:var(--color-bg);border-radius:24px 24px 0 0;box-shadow:var(--shadow-lg);padding:20px;display:flex;flex-direction:column;gap:14px' }, [
      h('div', { style: 'display:flex;justify-content:space-around;text-align:center' }, [
        h('div', {}, [h('div', { style: 'font-family:var(--font-heading);font-size:26px' }, v.elapsedLabel), h('div', { style: 'font-size:11px;opacity:.6' }, 'time')]),
        h('div', {}, [h('div', { style: 'font-family:var(--font-heading);font-size:26px' }, v.distanceLabel), h('div', { style: 'font-size:11px;opacity:.6' }, 'distance')]),
        h('div', {}, [h('div', { style: 'font-family:var(--font-heading);font-size:26px' }, v.pace), h('div', { style: 'font-size:11px;opacity:.6' }, 'pace /mi')]),
      ]),
      h('div', { style: 'display:flex;gap:10px' }, [
        h('div', { style: 'flex:1;display:flex;align-items:center;justify-content:space-between;background:var(--color-surface);border-radius:999px;padding:6px 6px 6px 14px' }, [
          h('span', { style: 'font-size:13px' }, ['💧 Pee ', h('strong', {}, String(w.peeCount))]),
          h('button', { class: 'btn btn-icon btn-secondary', style: 'background:var(--color-bg)', onClick: App.incPee }, [icon('plusSm')]),
        ]),
        h('div', { style: 'flex:1;display:flex;align-items:center;justify-content:space-between;background:var(--color-surface);border-radius:999px;padding:6px 6px 6px 14px' }, [
          h('span', { style: 'font-size:13px' }, ['💩 Poop ', h('strong', {}, String(w.poopCount))]),
          h('button', { class: 'btn btn-icon btn-secondary', style: 'background:var(--color-bg)', onClick: App.incPoop }, [icon('plusSm')]),
        ]),
      ]),
    ]);
    if (v.walkClientIsNotRover) {
      sheet.appendChild(h('button', { class: 'btn btn-secondary', style: 'height:44px;font-size:13px', onClick: App.openShareSheet }, [icon('share'), ' Share live location with ' + (wc ? wc.name : '')]));
    }
    if (v.walkClientIsRover) {
      sheet.appendChild(h('a', { href: ROVER_URL, target: '_blank', rel: 'noopener', class: 'btn btn-secondary', style: 'height:44px;font-size:13px;text-decoration:none' }, 'Message via Rover app'));
    }
    sheet.appendChild(h('button', { class: 'btn btn-block', style: 'height:54px;background:var(--color-accent-800);color:#fff;font-size:15px;margin-top:0', onClick: App.stopWalk }, [icon('stop'), ' Stop walk']));
    wrap.appendChild(sheet);
    return wrap;
  },

  renderWalkSummary(v) {
    const w = v.walk, wc = v.walkClient;
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px' });
    wrap.appendChild(h('div', { style: 'display:flex;align-items:center;gap:10px' }, [
      h('button', { class: 'btn btn-icon btn-secondary', onClick: App.backFromSummary }, [icon('back')]),
      h('h3', { style: 'margin:0' }, 'Walk complete 🐾'),
    ]));
    wrap.appendChild(h('div', { style: 'font-size:13px;opacity:.7;margin-top:-10px' }, 'with ' + (wc ? wc.name : '')));

    const mapSvg = frag('<svg width="100%" height="140" viewBox="0 0 412 200" class="washed" style="border-radius:var(--radius-md);background:var(--color-accent-2-100)"></svg>');
    const defs = frag('<defs><pattern id="mapgrid2" width="35" height="35" patternUnits="userSpaceOnUse"><rect width="35" height="35" fill="var(--color-accent-2-100)"></rect><rect width="35" height="4" fill="var(--color-neutral-200)"></rect><rect width="4" height="35" fill="var(--color-neutral-200)"></rect></pattern></defs>');
    mapSvg.appendChild(defs);
    mapSvg.appendChild(frag('<rect width="412" height="200" fill="url(#mapgrid2)"></rect>'));
    mapSvg.appendChild(frag('<polyline points="' + (w ? v.routePoints : '') + '" fill="none" stroke="var(--color-accent-700)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>'));
    wrap.appendChild(mapSvg);
    wrap.appendChild(h('div', { style: 'display:flex;align-items:center;gap:5px;font-size:11px;opacity:.6;margin-top:-8px' }, [icon('gpsSummary'), ' Route captured from cached offline map']));

    wrap.appendChild(h('div', { style: 'display:flex;gap:10px' }, [
      h('div', { class: 'card elev-sm', style: 'flex:1;align-items:center' }, [h('div', { style: 'font-family:var(--font-heading);font-size:20px' }, v.elapsedLabel), h('div', { style: 'font-size:11px;opacity:.6' }, 'time')]),
      h('div', { class: 'card elev-sm', style: 'flex:1;align-items:center' }, [h('div', { style: 'font-family:var(--font-heading);font-size:20px' }, v.distanceLabel), h('div', { style: 'font-size:11px;opacity:.6' }, 'distance')]),
    ]));
    wrap.appendChild(h('div', { style: 'display:flex;gap:10px' }, [
      h('div', { class: 'card elev-sm', style: 'flex:1;align-items:center' }, [h('div', { style: 'font-family:var(--font-heading);font-size:20px' }, '💧 ' + (w ? w.peeCount : 0)), h('div', { style: 'font-size:11px;opacity:.6' }, 'pees')]),
      h('div', { class: 'card elev-sm', style: 'flex:1;align-items:center' }, [h('div', { style: 'font-family:var(--font-heading);font-size:20px' }, '💩 ' + (w ? w.poopCount : 0)), h('div', { style: 'font-size:11px;opacity:.6' }, 'poops')]),
    ]));

    wrap.appendChild(h('div', { class: 'field' }, [
      h('label', {}, 'Notes for this walk'),
      h('textarea', { class: 'input', 'data-key': 'walkNote', placeholder: 'How did it go?', onInput: e => App.setWalkNoteDraft(e.target.value) }, App.state.walkNoteDraft),
    ]));

    const payBlock = h('div', {}, [h('div', { class: 'card-kicker', style: 'margin-bottom:6px' }, 'Payment')]);
    const seg = h('div', { class: 'seg', style: 'width:100%' }, [
      h('label', { class: 'seg-opt', style: 'flex:1;justify-content:center' }, [h('input', { type: 'radio', name: 'pay', checked: App.state.payChoice === 'paid', onChange: App.setPayPaid }), h('span', {}, 'Mark paid')]),
      h('label', { class: 'seg-opt', style: 'flex:1;justify-content:center' }, [h('input', { type: 'radio', name: 'pay', checked: App.state.payChoice === 'owe', onChange: App.setPayOwe }), h('span', {}, v.payOweLabel)]),
    ]);
    payBlock.appendChild(seg);
    wrap.appendChild(payBlock);

    wrap.appendChild(h('div', {}, [
      h('div', { class: 'card-kicker', style: 'margin-bottom:6px' }, 'Photo from the walk'),
      h('image-slot', { id: 'walk-photo-slot', shape: 'rounded', style: 'width:100%;height:150px', placeholder: 'Drop a photo from the walk' }),
    ]));

    const actions = h('div', { style: 'display:flex;gap:10px' });
    if (v.walkClientIsRover) actions.appendChild(h('a', { href: ROVER_URL, target: '_blank', rel: 'noopener', class: 'btn btn-secondary', style: 'flex:1;height:50px;text-decoration:none' }, 'Message via Rover app'));
    if (v.walkClientIsNotRover) actions.appendChild(h('button', { class: 'btn btn-secondary', style: 'flex:1;height:50px', onClick: App.openShareSheet }, [icon('shareSm'), ' Share with client']));
    actions.appendChild(h('button', { class: 'btn btn-primary', style: 'flex:1;height:50px', onClick: App.saveWalkSummary }, 'Save walk'));
    wrap.appendChild(actions);

    return wrap;
  },

  renderShareSheet(v) {
    const dialog = h('div', { class: 'dialog' }, [
      h('div', { class: 'dialog-title' }, v.shareSheetTitle),
      h('textarea', { class: 'input', readOnly: true, style: 'min-height:120px' }, v.shareText),
      h('div', { class: 'dialog-actions', style: 'justify-content:space-between;align-items:center' }, [
        h('span', { style: 'font-size:12px;opacity:.65' }, App.state.copied ? 'Copied!' : ' '),
        h('div', { style: 'display:flex;gap:8px' }, [
          h('button', { class: 'btn btn-ghost', onClick: App.closeShareSheet }, 'Close'),
          h('button', { class: 'btn btn-primary', onClick: App.copyShareText }, 'Copy text'),
        ]),
      ]),
    ]);
    return dialogBackdrop(dialog, App.closeShareSheet);
  },

  renderPayments(v) {
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:22px 20px 24px;display:flex;flex-direction:column;gap:18px' });
    wrap.appendChild(h('h2', { style: 'margin:0' }, 'Payments'));
    wrap.appendChild(h('div', { class: 'card elev-sm', style: 'background:var(--color-accent-100)' }, [
      h('div', { class: 'card-kicker' }, 'Outstanding'),
      h('h1', { style: 'margin:0;font-size:32px' }, '$' + v.totalOwed),
      h('div', { style: 'font-size:12px;opacity:.7' }, 'across ' + v.owedCount + ' clients'),
    ]));

    const unpaidBlock = h('div', {}, [h('h5', { style: 'margin:0 0 8px' }, 'Unpaid walks')]);
    const unpaidList = h('div', { style: 'display:flex;flex-direction:column;gap:8px' });
    v.owedClients.forEach(o => {
      unpaidList.appendChild(h('div', { class: 'card elev-sm', style: 'flex-direction:row;align-items:center;gap:10px' }, [
        h('div', { style: 'flex:1' }, [h('div', { style: 'font-size:13px;font-weight:600' }, o.name), h('div', { style: 'font-size:11.5px;opacity:.65' }, o.unpaidCountLabel)]),
        h('div', { style: 'font-family:var(--font-heading);font-size:16px;color:var(--color-accent-700)' }, '$' + o.balance),
        h('button', { class: 'btn btn-secondary btn-icon', onClick: () => App.markClientPaid(o.client.id) }, [icon('check')]),
      ]));
    });
    unpaidBlock.appendChild(unpaidList);
    wrap.appendChild(unpaidBlock);

    const pkgBlock = h('div', {}, [h('h5', { style: 'margin:0 0 8px' }, 'Package credits')]);
    const pkgList = h('div', { style: 'display:flex;flex-direction:column;gap:8px' });
    v.packageClients.forEach(p => {
      pkgList.appendChild(h('div', { class: 'card elev-sm', style: 'gap:6px' }, [
        h('div', { style: 'display:flex;justify-content:space-between;align-items:center' }, [
          h('div', { style: 'font-size:13px;font-weight:600' }, p.name),
          h('span', { class: 'tag ' + p.tagClass }, p.remainLabel),
        ]),
        h('div', { style: 'height:6px;border-radius:999px;background:var(--color-neutral-300);overflow:hidden' }, [
          h('div', { style: 'height:100%;border-radius:999px;background:var(--color-accent-2-500);width:' + p.pct + '%' }),
        ]),
      ]));
    });
    pkgBlock.appendChild(pkgList);
    wrap.appendChild(pkgBlock);

    return wrap;
  },

  renderCalendar(v) {
    const wrap = h('div', { style: 'flex:1;overflow-y:auto;padding:22px 20px 24px;display:flex;flex-direction:column;gap:18px' });
    wrap.appendChild(h('h2', { style: 'margin:0' }, v.monthLabel));

    const grid = h('div', { style: 'display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center' });
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(wd => grid.appendChild(h('div', { style: 'font-size:10px;opacity:.55;padding-bottom:2px' }, wd)));
    v.days.forEach(d => {
      if (d.blank) { grid.appendChild(h('div', {})); return; }
      const cell = h('div', {
        style: 'position:relative;height:34px;display:flex;align-items:center;justify-content:center;font-size:12px;border-radius:50%;cursor:pointer;background:' + d.bg + ';color:' + d.color,
        onClick: d.hasSitting ? (() => App.selectSittingDay(d.cid)) : undefined,
      }, [String(d.num)]);
      if (d.hasSitting) cell.appendChild(h('span', { style: 'position:absolute;bottom:3px;width:4px;height:4px;border-radius:50%;background:var(--color-accent-2-600)' }));
      grid.appendChild(cell);
    });
    wrap.appendChild(grid);

    const sittingsBlock = h('div', {}, [h('h5', { style: 'margin:0 0 8px' }, 'Upcoming sittings')]);
    const sittingsList = h('div', { style: 'display:flex;flex-direction:column;gap:8px' });
    v.sittingsList.forEach(s => {
      sittingsList.appendChild(h('div', { class: 'card elev-sm', style: 'cursor:pointer', onClick: () => App.selectSitting(s.clientId) }, [
        h('div', { style: 'display:flex;justify-content:space-between;align-items:center' }, [
          h('div', { style: 'font-size:13px;font-weight:600' }, s.clientName + ' · ' + s.pet),
          h('span', { class: 'tag tag-accent-2' }, s.range),
        ]),
        h('div', { style: 'font-size:12px;opacity:.65' }, s.address),
      ]));
    });
    sittingsBlock.appendChild(sittingsList);
    wrap.appendChild(sittingsBlock);

    if (v.selSitting) {
      const sel = v.selSitting;
      const card = h('div', { class: 'card elev-md', style: 'gap:10px' }, [
        h('div', { class: 'card-title', style: 'font-size:15px' }, sel.clientName + ' · ' + sel.range),
        h('div', { style: 'font-size:12px;opacity:.7' }, sel.address),
      ]);
      const tasksWrap = h('div', { style: 'display:flex;flex-direction:column;gap:6px;margin-top:4px' });
      sel.tasks.forEach(t => {
        const row = h('div', { style: 'display:flex;align-items:center;gap:10px;cursor:pointer', onClick: () => App.toggleTask(sel.clientId, t.idx) }, [
          h('div', { style: 'width:20px;height:20px;border-radius:6px;border:1.5px solid var(--color-divider);background:' + t.bg + ';display:flex;align-items:center;justify-content:center;flex:none' }, t.done ? [h('span', { html: ICONS.checkSm })] : []),
          h('div', { style: 'font-size:13px;' + t.textStyle }, t.label),
        ]);
        tasksWrap.appendChild(row);
      });
      card.appendChild(tasksWrap);
      wrap.appendChild(card);
    }

    return wrap;
  },

  renderBottomNav(v) {
    const colFor = tab => v.screen === tab ? 'var(--color-accent-700)' : 'var(--color-neutral-600)';
    return h('div', { style: 'display:flex;border-top:1px solid var(--color-divider);background:var(--color-bg);padding:8px 4px 10px' }, [
      h('button', { onClick: App.goHome, style: 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;color:' + colFor('home') }, [icon('home'), h('span', { style: 'font-size:10px' }, 'Home')]),
      h('button', { onClick: App.goClients, style: 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;color:' + colFor('clients') }, [icon('clients'), h('span', { style: 'font-size:10px' }, 'Clients')]),
      h('button', { onClick: App.goCalendar, style: 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;color:' + colFor('calendar') }, [icon('calendar'), h('span', { style: 'font-size:10px' }, 'Calendar')]),
      h('button', { onClick: App.goPayments, style: 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;color:' + colFor('payments') }, [icon('payments'), h('span', { style: 'font-size:10px' }, 'Payments')]),
    ]);
  },

  renderAddClientDialog() {
    const d = App.state.draft;
    const dialog = h('div', { class: 'dialog' }, [
      h('div', { class: 'dialog-title' }, 'New client'),
      h('div', { class: 'field' }, [h('label', {}, 'Owner name'), h('input', { class: 'input', 'data-key': 'draft-name', value: d.name, onInput: e => App.setDraftField('name', e.target.value) })]),
      h('div', { style: 'display:flex;gap:8px' }, [
        h('div', { class: 'field', style: 'flex:1' }, [h('label', {}, 'Pet name'), h('input', { class: 'input', 'data-key': 'draft-pet', value: d.pet, onInput: e => App.setDraftField('pet', e.target.value) })]),
        h('div', { class: 'field', style: 'flex:1' }, [h('label', {}, 'Breed'), h('input', { class: 'input', 'data-key': 'draft-breed', value: d.breed, onInput: e => App.setDraftField('breed', e.target.value) })]),
      ]),
      h('div', { class: 'field' }, [h('label', {}, 'Address'), h('input', { class: 'input', 'data-key': 'draft-address', value: d.address, onInput: e => App.setDraftField('address', e.target.value) })]),
      h('div', { class: 'field' }, [
        h('label', {}, 'Rate type'),
        h('div', { class: 'seg', style: 'width:100%' }, [
          h('label', { class: 'seg-opt', style: 'flex:1;justify-content:center' }, [h('input', { type: 'radio', name: 'rt', checked: d.rateType === 'perwalk', onChange: App.setDraftPerWalk }), h('span', {}, 'Per walk')]),
          h('label', { class: 'seg-opt', style: 'flex:1;justify-content:center' }, [h('input', { type: 'radio', name: 'rt', checked: d.rateType === 'package', onChange: App.setDraftPackage }), h('span', {}, 'Package')]),
        ]),
      ]),
      h('div', { class: 'field' }, [h('label', {}, 'Rate per walk ($)'), h('input', { class: 'input', 'data-key': 'draft-rate', value: d.rate, onInput: e => App.setDraftField('rate', e.target.value) })]),
      h('div', { class: 'dialog-actions' }, [
        h('button', { class: 'btn btn-ghost', onClick: App.closeAddClient }, 'Cancel'),
        h('button', { class: 'btn btn-primary', onClick: App.submitAddClient }, 'Add client'),
      ]),
    ]);
    return dialogBackdrop(dialog, App.closeAddClient);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  App.screenRoot = bootPhoneApp('root');
  App.render();
});
