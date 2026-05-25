const STORAGE_KEY = 'elif-lina-v21-static-state';

const defaultState = {
  mode: 'child',
  selectedScreen: 'home',
  totalStars: 125,
  level: 4,
  streak: 7,
  savedDays: [14, 18, 12, 20, 21, 8, 10],
  tasks: [
    { id: 1, icon: '📖', title: '15 dk kitap okudun mu?', category: 'Eğitim', points: 2, done: true },
    { id: 2, icon: '✏️', title: 'Ödevlerini yaptın mı?', category: 'Eğitim', points: 3, done: true },
    { id: 3, icon: '🛏️', title: 'Yatağını topladın mı?', category: 'Düzen', points: 2, done: true },
    { id: 4, icon: '🦷', title: 'Dişlerini fırçaladın mı?', category: 'Bakım', points: 1, done: true },
    { id: 5, icon: '🧸', title: 'Oyuncaklarını topladın mı?', category: 'Düzen', points: 2, done: false }
  ],
  rewards: [
    { id: 1, icon: '🎁', title: 'Küçük Sürpriz', stars: 10, active: true },
    { id: 2, icon: '🍦', title: 'Dondurma Günü', stars: 20, active: true },
    { id: 3, icon: '🎮', title: 'Oyun Saati Bonusu', stars: 30, active: true },
    { id: 4, icon: '🎬', title: 'Sinema Günü', stars: 50, active: true },
    { id: 5, icon: '👑', title: 'Büyük Ödül', stars: 100, active: true }
  ],
  activities: [
    '15 dk kitap okudu. +2 ⭐',
    'Ödevlerini tamamladı. +3 ⭐',
    'Dişlerini fırçaladı. +1 ⭐'
  ]
};

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : structuredClone(defaultState);
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayEarned() {
  return state.tasks.filter(t => t.done).reduce((sum, t) => sum + Number(t.points || 0), 0);
}

function completedCount() {
  return state.tasks.filter(t => t.done).length;
}

function progress() {
  return Math.round((completedCount() / Math.max(1, state.tasks.length)) * 100);
}

function setMode(mode) {
  state.mode = mode;
  saveState();
  render();
}

function setScreen(screen) {
  state.selectedScreen = screen;
  render();
}

function toggleTask(id) {
  state.tasks = state.tasks.map(task => task.id === id ? { ...task, done: !task.done } : task);
  saveState();
  render();
}

function addTask(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const title = form.get('title').trim();
  if (!title) return;
  state.tasks.unshift({
    id: Date.now(),
    icon: form.get('icon') || '⭐',
    title,
    category: form.get('category') || 'Genel',
    points: Number(form.get('points')) || 1,
    done: false
  });
  event.target.reset();
  saveState();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(task => task.id !== id);
  saveState();
  render();
}

function addReward(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const title = form.get('title').trim();
  if (!title) return;
  state.rewards.unshift({
    id: Date.now(),
    icon: form.get('icon') || '🎁',
    title,
    stars: Number(form.get('stars')) || 10,
    active: true
  });
  event.target.reset();
  saveState();
  render();
}

function deleteReward(id) {
  state.rewards = state.rewards.filter(reward => reward.id !== id);
  saveState();
  render();
}

function saveToday() {
  const earned = todayEarned();
  state.totalStars += earned;
  state.streak += completedCount() === state.tasks.length ? 1 : 0;
  state.savedDays = [...state.savedDays.slice(1), earned];
  state.activities.unshift(`Bugün ${completedCount()} görev tamamlandı. +${earned} ⭐`);
  state.tasks = state.tasks.map(task => ({ ...task, done: false }));
  saveState();
  render();
}

function resetDemo() {
  state = structuredClone(defaultState);
  saveState();
  render();
}

function navItems() {
  return [
    ['home', '🏠', 'Ana Sayfa'],
    ['tasks', '✅', 'Görevler'],
    ['games', '🎮', 'Mini Oyunlar'],
    ['map', '🗺️', 'Macera Haritası'],
    ['badges', '🏅', 'Rozetler'],
    ['rewards', '🎁', 'Ödüller'],
    ['week', '📅', 'Haftalık Takip'],
    ['profile', '👤', 'Profilim']
  ];
}

function sidebar() {
  const items = navItems().map(([id, icon, label]) => `
    <button class="side-nav ${state.selectedScreen === id ? 'active' : ''}" onclick="setScreen('${id}')">
      <span>${icon}</span><strong>${label}</strong>
    </button>
  `).join('');

  return `
    <aside class="sidebar">
      <div class="brand-card">
        <div class="logo-text">Elif Lina</div>
        <div class="logo-sub">Günlük Sorumluluk</div>
        <div class="avatar-wrap"><div class="girl-avatar"><span>🎀</span><b>👧🏻</b><i>⭐</i></div></div>
      </div>
      <div class="mode-switch">
        <button class="${state.mode === 'child' ? 'active' : ''}" onclick="setMode('child')">Çocuk</button>
        <button class="${state.mode === 'parent' ? 'active' : ''}" onclick="setMode('parent')">Ebeveyn</button>
      </div>
      <nav>${items}</nav>
      <div class="side-goal">
        <div class="goal-star">⭐</div>
        <b>Günlük hedef</b>
        <p>${state.totalStars} yıldız toplandı</p>
        <button onclick="resetDemo()">Demo Sıfırla</button>
      </div>
    </aside>
  `;
}

function topBar() {
  return `
    <header class="topbar">
      <div>
        <h1>Merhaba Elif Lina! 👋</h1>
        <p>Bugün harika işler seni bekliyor.</p>
      </div>
      <div class="top-stats">
        <div class="mini-stat premium">V2.1 Exact</div>
        <div class="mini-stat">⭐ <b>${state.totalStars}</b><span>Toplam</span></div>
        <div class="mini-stat">🛡️ <b>${state.level}</b><span>Seviye</span></div>
        <div class="mini-stat">🔥 <b>${state.streak}</b><span>Seri</span></div>
        <div class="mini-stat">✅ <b>${completedCount()}/${state.tasks.length}</b><span>Bugün</span></div>
        <button class="panel-pill" onclick="setMode('${state.mode === 'child' ? 'parent' : 'child'}')">${state.mode === 'child' ? 'Çocuk Paneli' : 'Ebeveyn Paneli'}⌄</button>
      </div>
    </header>
  `;
}

function hero() {
  return `
    <section class="hero-panel">
      <div class="hero-copy">
        <span class="eyebrow">Bugünün macerası başladı ✨</span>
        <h2>Merhaba Elif Lina! Bugün yıldızları toplamaya hazır mısın?</h2>
        <p>Görevlerini tamamla, macera haritasında ilerle ve sürpriz kutuya bir adım daha yaklaş.</p>
        <div class="hero-actions">
          <button onclick="setScreen('tasks')">Görevlerime Git</button>
          <button class="ghost" onclick="setScreen('map')">Haritayı Aç</button>
        </div>
      </div>
      <div class="hero-character">
        <div class="orbit o1">⭐</div><div class="orbit o2">🎁</div><div class="orbit o3">🏰</div>
        <div class="big-girl"><span>🎀</span><b>👧🏻</b><i>⭐</i></div>
        <div class="hero-score"><b>${progress()}%</b><span>İlerleme</span></div>
        <div class="hero-score s2"><b>${completedCount()}/${state.tasks.length}</b><span>Görev</span></div>
        <div class="hero-score s3"><b>+${todayEarned()}</b><span>Yıldız</span></div>
      </div>
    </section>
  `;
}

function progressCard() {
  const p = progress();
  return `
    <div class="card progress-card">
      <h3>Bugünkü İlerlemen</h3>
      <div class="ring" style="--p:${p}"><span>${p}%</span></div>
      <h4>${completedCount()} / ${state.tasks.length} görev</h4>
      <p>tamamlandı</p>
    </div>
  `;
}

function chestCard() {
  const earned = todayEarned();
  return `
    <div class="card chest-card">
      <h3>Sürpriz Kutu</h3>
      <div class="chest-line"><div class="chest-icon">🧰</div><b>${Math.min(30, earned + 17)} / 30 yıldız</b></div>
      <div class="bar"><span style="width:${Math.min(100, ((earned + 17) / 30) * 100)}%"></span></div>
      <p>30 yıldız olduğunda kutunu aç!</p>
    </div>
  `;
}

function motivationCard() {
  return `
    <div class="card motivation-card">
      <h3>Günlük Motivasyon 🦄</h3>
      <div class="motivation-content"><span>🦄</span><b>Küçük adımlar, büyük değişimler yaratır! 🌈</b></div>
    </div>
  `;
}

function taskList(compact = false) {
  const rows = state.tasks.map(task => `
    <button class="task-row ${task.done ? 'done' : ''}" onclick="toggleTask(${task.id})">
      <span class="task-icon">${task.icon}</span>
      <span class="task-info"><b>${task.title}</b><small>${task.category}</small></span>
      <strong>+${task.points} ⭐</strong>
      <i>${task.done ? '✓' : ''}</i>
    </button>
  `).join('');
  return `
    <div class="card tasks-card ${compact ? 'compact' : ''}">
      <div class="section-title"><h3>Bugünkü Görevlerin</h3><button onclick="setScreen('tasks')">Tümünü Gör</button></div>
      <div class="task-list">${rows}</div>
      <div class="task-actions"><button onclick="setScreen('tasks')">Tüm Görevleri Gör</button><button onclick="saveToday()" class="save">Kaydet</button></div>
    </div>
  `;
}

function rewardShop() {
  return `
    <div class="card reward-card">
      <div class="section-title"><h3>Ödüller Dükkanı</h3><button onclick="setScreen('rewards')">Tümünü Gör</button></div>
      <div class="reward-list">
        ${state.rewards.map(r => `<div class="reward-row"><span>${r.icon}</span><b>${r.title}</b><strong>${r.stars} ⭐</strong></div>`).join('')}
      </div>
    </div>
  `;
}

function gamesGrid() {
  const games = [
    ['🐼', 'Eşleştirme', 'Hafıza kartlarını bul', '+2'],
    ['⭐', 'Yıldız Toplama', 'Uzayda yıldız yakala', '+3'],
    ['🎈', 'Balon Patlatma', 'Puanlı balonları patlat', '+1'],
    ['abc', 'Kelime Bulmaca', 'Yeni kelimeler öğren', '+2']
  ];
  return `
    <div class="card games-card">
      <div class="section-title"><h3>Mini Oyunlar</h3><button onclick="setScreen('games')">Tümünü Gör</button></div>
      <div class="games-grid">
        ${games.map((g, i) => `<div class="game-tile g${i + 1}"><span>${g[0]}</span><b>${g[1]}</b><small>${g[2]}</small><button>Oyna</button><em>${g[3]} ⭐</em></div>`).join('')}
      </div>
    </div>
  `;
}

function mapCard(large = false) {
  return `
    <div class="card map-card ${large ? 'large' : ''}">
      <div class="section-title"><h3>Macera Haritası</h3><button onclick="setScreen('map')">Tümünü Gör</button></div>
      <div class="map-world">
        <div class="mount">⛰️</div><div class="castle">🏰</div><div class="tree t1">🌳</div><div class="tree t2">🌲</div><div class="treasure">🎁</div>
        <svg viewBox="0 0 600 230" preserveAspectRatio="none"><path d="M20 155 C95 70 160 190 230 130 C310 58 345 178 420 110 C500 42 535 95 590 35"/></svg>
        ${[1,2,3,4,5].map((n,i) => `<div class="level-dot d${n}">${n}</div>`).join('')}
      </div>
      <div class="map-footer"><b>Seviye 5: Harika!</b><span>Sonraki hedef: 6. seviye</span><div class="bar"><span style="width:68%"></span></div></div>
    </div>
  `;
}

function weeklyCard() {
  const days = ['19/05','20/05','21/05','22/05','23/05','24/05','25/05'];
  return `
    <div class="card week-card">
      <div class="section-title"><h3>Haftalık Özet</h3><button onclick="setScreen('week')">Tümünü Gör</button></div>
      <div class="week-days">
        ${state.savedDays.map((s, i) => `<div><span>⭐</span><b>${s}</b><small>${days[i]}</small></div>`).join('')}
      </div>
      <div class="week-total"><b>${state.savedDays.reduce((a,b)=>a+b,0)} ⭐</b><span>haftalık toplam</span></div>
    </div>
  `;
}

function benefitStrip() {
  const items = [
    ['🛡️', 'Sorumluluk Bilinci', 'Görevleri tamamla, alışkanlık kazan.'],
    ['⭐', 'Motivasyon Artar', 'Yıldız ve ödüllerle motivasyon yükselir.'],
    ['🎮', 'Eğlenceli Öğrenme', 'Oyunlarla keşfet.'],
    ['⏰', 'Zaman Yönetimi', 'Planlı olmayı öğrenir.'],
    ['🏆', 'Özgüven Gelişimi', 'Başardıkça kendine güvenir.'],
    ['👨‍👩‍👧', 'Aile Bağı Güçlenir', 'Birlikte takip edin.']
  ];
  return `<div class="benefit-strip">${items.map(i => `<div><span>${i[0]}</span><b>${i[1]}</b><small>${i[2]}</small></div>`).join('')}</div>`;
}

function childHome() {
  return `
    ${hero()}
    <section class="dashboard-grid exact-grid">
      ${progressCard()}
      ${chestCard()}
      ${motivationCard()}
      ${rewardShop()}
      ${taskList(true)}
      ${gamesGrid()}
      ${mapCard()}
      ${weeklyCard()}
    </section>
    ${benefitStrip()}
    <footer class="bottom-cta"><div>🏆 <b>Elif Lina ile her gün daha iyiye!</b><span>Görevleri tamamla, yıldızlarını topla, ödülleri kazan.</span></div><button onclick="saveToday()">Bugünü Kaydet</button></footer>
  `;
}

function tasksScreen() {
  return `<section class="screen-shell"><h2>Bugünkü Görevler</h2><p>Görevlerini tamamla, yıldızları topla.</p>${taskList()}</section>`;
}

function gamesScreen() {
  return `<section class="screen-shell"><h2>Mini Oyunlar</h2><p>Günlük görevlerini tamamla, oyun hakları kazan.</p>${gamesGrid()}</section>`;
}

function mapScreen() {
  return `<section class="screen-shell"><h2>Macera Haritası</h2><p>Her görev seni yeni seviyeye yaklaştırır.</p>${mapCard(true)}</section>`;
}

function badgesScreen() {
  const badges = [ ['📚','Kitap Kurdu','15 gün kitap okuma'], ['🖐️','Süper Yardımcı','20 görev tamamlama'], ['🛏️','Düzen Şampiyonu','Yatağını 15 gün toplama'], ['🥉','3 Gün Seri','3 gün üst üste görev'], ['🏅','7 Gün Seri','7 gün üst üste görev'], ['🔒','30 Yıldız Kulübü','30 yıldız topla'] ];
  return `<section class="screen-shell"><h2>Rozetler ve Başarılar</h2><div class="badge-grid">${badges.map(b => `<div class="badge-card"><span>${b[0]}</span><b>${b[1]}</b><small>${b[2]}</small></div>`).join('')}</div></section>`;
}

function rewardsScreen() {
  return `<section class="screen-shell"><h2>Ödüller Dükkanı</h2>${rewardShop()}</section>`;
}

function weekScreen() {
  return `<section class="screen-shell"><h2>Haftalık Takip</h2>${weeklyCard()}</section>`;
}

function profileScreen() {
  return `<section class="screen-shell profile-screen"><div class="profile-avatar"><div class="big-girl"><span>🎀</span><b>👧🏻</b><i>⭐</i></div></div><h2>Elif Lina</h2><p>Seviye ${state.level}</p><div class="profile-stats"><div>⭐<b>${state.totalStars}</b><span>Toplam Yıldız</span></div><div>🔥<b>${state.streak}</b><span>Günlük Seri</span></div><div>✅<b>${completedCount()}</b><span>Tamamlanan</span></div></div></section>`;
}

function parentPanel() {
  const completed = completedCount();
  const total = state.tasks.length;
  return `
    <section class="parent-layout">
      <div class="parent-header"><div><h2>Ebeveyn Yönetim Paneli</h2><p>Kolay yönetim, detaylı takip ve ödül kontrolü.</p></div><button onclick="setMode('child')">Çocuk Paneline Dön</button></div>
      <div class="parent-stats">
        <div><span>Toplam Görev</span><b>${total}</b></div><div><span>Tamamlanan</span><b>${completed}</b></div><div><span>Tamamlanma Oranı</span><b>%${progress()}</b></div><div><span>Toplam Yıldız</span><b>${state.totalStars}</b></div><div><span>Günlük Seri</span><b>${state.streak}</b></div>
      </div>
      <div class="parent-grid">
        <div class="admin-card wide"><h3>Görev Ekle / Düzenle</h3><form onsubmit="addTask(event)" class="admin-form"><input name="title" placeholder="Görev adı"/><select name="category"><option>Eğitim</option><option>Düzen</option><option>Bakım</option><option>Yardım</option></select><input name="points" type="number" value="2" min="1"/><input name="icon" value="📖"/><button>Kaydet</button></form><div class="admin-list">${state.tasks.map(t => `<div><span>${t.icon}</span><b>${t.title}</b><small>${t.category} · +${t.points} ⭐</small><button onclick="deleteTask(${t.id})">Sil</button></div>`).join('')}</div></div>
        <div class="admin-card"><h3>Ödül Yönetimi</h3><form onsubmit="addReward(event)" class="admin-form reward-form"><input name="title" placeholder="Ödül adı"/><input name="stars" type="number" value="20"/><input name="icon" value="🎁"/><button>Ödül Ekle</button></form><div class="admin-list">${state.rewards.map(r => `<div><span>${r.icon}</span><b>${r.title}</b><small>${r.stars} yıldız</small><button onclick="deleteReward(${r.id})">Sil</button></div>`).join('')}</div></div>
        <div class="admin-card"><h3>Performans Grafiği</h3><div class="bars">${state.savedDays.map(v => `<i style="height:${Math.max(15, v*4)}px"><b>${v}</b></i>`).join('')}</div></div>
        <div class="admin-card"><h3>Hızlı Ayarlar</h3><label>Günlük yıldız limiti <input value="50"/></label><label>Sürpriz kutu eşiği <input value="30"/></label><label><input type="checkbox" checked/> Motivasyon mesajları</label><label><input type="checkbox" checked/> Haftalık rapor</label><button class="full">Kaydet</button></div>
      </div>
    </section>
  `;
}

function currentScreen() {
  if (state.mode === 'parent') return parentPanel();
  switch (state.selectedScreen) {
    case 'tasks': return tasksScreen();
    case 'games': return gamesScreen();
    case 'map': return mapScreen();
    case 'badges': return badgesScreen();
    case 'rewards': return rewardsScreen();
    case 'week': return weekScreen();
    case 'profile': return profileScreen();
    default: return childHome();
  }
}

function render() {
  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      ${sidebar()}
      <main class="main-content">
        ${topBar()}
        ${currentScreen()}
      </main>
    </div>
  `;
}

window.setMode = setMode;
window.setScreen = setScreen;
window.toggleTask = toggleTask;
window.addTask = addTask;
window.deleteTask = deleteTask;
window.addReward = addReward;
window.deleteReward = deleteReward;
window.saveToday = saveToday;
window.resetDemo = resetDemo;

render();
