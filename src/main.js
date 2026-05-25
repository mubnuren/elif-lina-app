if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => registrations.forEach(reg => reg.unregister()));
  if (window.caches) caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
}

const tasks = [
  { icon:'📖', title:'15 dk kitap okudun mu?', cat:'Eğitim', stars:2, done:true },
  { icon:'✏️', title:'Ödevlerini yaptın mı?', cat:'Eğitim', stars:3, done:true },
  { icon:'🛏️', title:'Yatağını topladın mı?', cat:'Düzen', stars:2, done:true },
  { icon:'🦷', title:'Dişlerini fırçaladın mı?', cat:'Bakım', stars:1, done:true },
  { icon:'🧸', title:'Oyuncaklarını topladın mı?', cat:'Düzen', stars:2, done:false }
];

const rewards = [
  { icon:'🎁', title:'Küçük Sürpriz', stars:10 },
  { icon:'🍦', title:'Dondurma Günü', stars:20 },
  { icon:'🎮', title:'Oyun Saati Bonusu', stars:30 },
  { icon:'🎬', title:'Sinema Günü', stars:50 },
  { icon:'👑', title:'Büyük Ödül', stars:100 }
];

const games = [
  { icon:'🐼', title:'Eşleştirme', text:'Hafıza kartlarını bul', score:'+2' },
  { icon:'⭐', title:'Yıldız Toplama', text:'Uzayda yıldız yakala', score:'+3' },
  { icon:'🎈', title:'Balon Patlatma', text:'Puanlı balonları patlat', score:'+1' },
  { icon:'abc', title:'Kelime Bulmaca', text:'Yeni kelimeler öğren', score:'+2' }
];

const week = [14,18,12,20,21,8,10];
const root = document.getElementById('app');

function girl(className='') {
  return `<div class="girl ${className}"><div class="hair"></div><div class="bow"><i></i></div><div class="face"><i class="eye left"></i><i class="eye right"></i><i class="cheek l"></i><i class="cheek r"></i><i class="mouth"></i></div><div class="dress">★</div></div>`;
}

function sidebar() {
  return `
  <aside class="sidebar">
    <div class="brand"><span>Elif</span> Lina <b>★</b></div>
    <div class="brand-sub">Günlük Sorumluluk<br/>ve Oyunlaştırma Programı</div>
    <div class="sidebar-character">${girl('small')}</div>
    <div class="role-tabs"><button class="active" onclick="setMode('child')">Çocuk</button><button onclick="setMode('parent')">Ebeveyn</button></div>
    <nav class="side-nav">
      <button class="active">🏠 Ana Sayfa</button>
      <button>✅ Görevler</button>
      <button>🎮 Mini Oyunlar</button>
      <button>🗺️ Macera Haritası</button>
      <button>🏅 Rozetler</button>
      <button>🎁 Ödüller</button>
      <button>📅 Haftalık Takip</button>
      <button>👤 Profilim</button>
    </nav>
    <div class="daily-target">
      <div class="big-star">⭐</div>
      <b>Günlük hedef</b>
      <small>125 yıldız toplandı</small>
      <button>Çıkış Yap</button>
    </div>
  </aside>`;
}

function topbar() {
  return `
  <header class="topbar">
    <div><h1>Merhaba Elif Lina! 👋</h1><p>Bugün harika işler seni bekliyor.</p></div>
    <div class="top-stats">
      <div class="mini-stat"><span>⭐</span><small>Toplam Yıldız</small><b>125</b></div>
      <div class="mini-stat"><span>🛡️</span><small>Seviye</small><b>4</b></div>
      <div class="mini-stat"><span>🔥</span><small>Günlük Seri</small><b>7</b></div>
      <div class="mini-stat good"><span>✅</span><small>Görev</small><b>4/5</b></div>
      <button class="panel-select">Çocuk Paneli⌄</button>
    </div>
  </header>`;
}

function hero() {
  return `
  <section class="hero-card">
    <div class="hero-copy">
      <div class="eyebrow">Bugünün macerası başladı ✨</div>
      <h2>Merhaba Elif Lina! Bugün yıldızları toplamaya hazır mısın?</h2>
      <p>Görevlerini tamamla, macera haritasında ilerle ve sürpriz kutuya bir adım daha yaklaş.</p>
      <div class="hero-actions"><button>Görevlerime Git</button><button>Haritayı Aç</button></div>
    </div>
    <div class="hero-character">
      ${girl('large')}
      <div class="bubble b1"><b>80%</b><small>İlerleme</small></div>
      <div class="bubble b2"><b>4/5</b><small>Görev</small></div>
      <div class="bubble b3"><b>+8</b><small>Yıldız</small></div>
    </div>
  </section>`;
}

function taskRows() {
  return tasks.map(t => `
    <div class="task-row ${t.done ? 'done' : ''}">
      <div class="task-icon">${t.icon}</div>
      <div class="task-text"><b>${t.title}</b><small>${t.cat}</small></div>
      <div class="task-stars">+${t.stars}⭐</div>
      <div class="task-check">${t.done ? '✓' : ''}</div>
    </div>
  `).join('');
}

function rewardRows() {
  return rewards.map(r => `
    <div class="reward-row"><span>${r.icon}</span><b>${r.title}</b><em>${r.stars}⭐</em></div>
  `).join('');
}

function gameCards() {
  return games.map((g, idx) => `
    <div class="game-card g${idx+1}"><i>${g.icon}</i><b>${g.title}</b><small>${g.text}</small><button>Oyna</button><em>${g.score}⭐</em></div>
  `).join('');
}

function weekCards() {
  return week.map((val, idx) => `
    <div class="week-day"><span>⭐</span><b>${val}</b><small>${String(19+idx).padStart(2,'0')}/05</small></div>
  `).join('');
}

function progressCard() {
  return `<section class="card progress-card"><h3>Bugünkü İlerlemen</h3><div class="progress-flex"><div class="ring"><span>80%</span></div><div><h2>4 / 5 görev</h2><p>tamamlandı</p><div class="bar"><i style="width:80%"></i></div></div></div></section>`;
}

function chestCard() {
  return `<section class="card chest-card"><h3>Sürpriz Kutu</h3><div class="chest-flex"><div class="treasure">🧰</div><div><h2>25 / 30 yıldız</h2><p>30 yıldız olduğunda kutunu aç!</p><div class="bar"><i style="width:83%"></i></div></div></div></section>`;
}

function motivationCard() {
  return `<section class="card motivation-card"><h3>Günlük Motivasyon 🦄</h3><div class="motivation-content"><span>🦄</span><h2>Küçük adımlar,<br/>büyük değişimler yaratır! 🌈</h2></div></section>`;
}

function rewardsCard() {
  return `<section class="card rewards-card"><h3>Ödüller Dükkanı <button>Tümünü Gör</button></h3>${rewardRows()}</section>`;
}

function tasksCard() {
  return `<section class="card tasks-card"><h3>Bugünkü Görevlerin <button>Tümünü Gör</button></h3>${taskRows()}<div class="card-actions"><button>Tüm Görevleri Gör</button><button>Kaydet</button></div></section>`;
}

function gamesCard() {
  return `<section class="card games-card"><h3>Mini Oyunlar <button>Tümünü Gör</button></h3><div class="games-grid">${gameCards()}</div></section>`;
}

function mapCard() {
  return `
  <section class="card map-card">
    <h3>Macera Haritası <button>Tümünü Gör</button></h3>
    <div class="map-world">
      <div class="sun">☀️</div><div class="mountain">⛰️</div><div class="castle">🏰</div><div class="gift">🎁</div>
      <div class="road"></div>
      <div class="level l1">1</div><div class="level l2">2</div><div class="level l3">3</div><div class="level l4">4</div><div class="level l5">5</div>
      <div class="cloud c1"></div><div class="cloud c2"></div>
    </div>
    <div class="map-footer"><b>Seviye 5: Harika!</b><small>Sonraki hedef: 6. seviye</small><div class="bar"><i style="width:72%"></i></div></div>
  </section>`;
}

function weekCard() {
  return `<section class="card week-card"><h3>Haftalık Özet <button>Tümünü Gör</button></h3><div class="week-grid">${weekCards()}</div><div class="week-total"><b>103 ⭐</b><small>haftalık toplam</small></div></section>`;
}

function badgesStrip() {
  const items = [['🛡️','Sorumluluk Bilinci','Görevleri tamamla, alışkanlık kazan.'],['⭐','Motivasyon Artar','Yıldız ve ödüllerle motivasyon yükselir.'],['🎮','Eğlenceli Öğrenme','Oyunlarla öğrenmek daha keyifli.'],['⏰','Zaman Yönetimi','Planlı olmayı öğrenir.'],['🏆','Özgüven Gelişimi','Başardıkça kendine güvenir.'],['👨‍👩‍👧','Aile Bağı Güçlenir','Birlikte takip edin.']];
  return `<div class="benefits">${items.map(i=>`<div><span>${i[0]}</span><b>${i[1]}</b><small>${i[2]}</small></div>`).join('')}</div>`;
}

function bottomBar() {
  return `<div class="bottom-bar"><b>🏆 Elif Lina ile her gün daha iyiye!</b><span>Görevleri tamamla, yıldızlarını topla, ödülleri kazan.</span><button>Bugünü Kaydet</button></div>`;
}

function childScreen() {
  return `<div class="screen child-screen">${hero()}<div class="top-grid">${progressCard()}${chestCard()}${motivationCard()}</div><div class="main-grid">${rewardsCard()}${tasksCard()}${gamesCard()}</div><div class="lower-grid">${mapCard()}${weekCard()}</div>${badgesStrip()}${bottomBar()}</div>`;
}

function parentScreen() {
  return `
  <div class="screen parent-screen">
    <section class="parent-hero"><div><span>👨‍👩‍👧 Ebeveyn Paneli</span><h2>Takip, yönetim ve raporlama ekranı</h2><p>Görevleri, ödülleri ve haftalık gelişimi tek ekrandan yönetin.</p></div><button>Raporu İndir</button></section>
    <div class="parent-stats"><div><b>15</b><small>Toplam Görev</small></div><div><b>11</b><small>Tamamlanan</small></div><div><b>%73</b><small>Başarı</small></div><div><b>125⭐</b><small>Toplam Yıldız</small></div></div>
    <div class="parent-grid">
      <section class="card"><h3>Görev Yönetimi <button>+ Yeni Görev</button></h3>${taskRows()}</section>
      <section class="card"><h3>Ödül Yönetimi <button>+ Yeni Ödül</button></h3>${rewardRows()}</section>
      <section class="card chart-card"><h3>Son 7 Gün Performansı</h3><div class="chart"><i style="height:70%"></i><i style="height:90%"></i><i style="height:60%"></i><i style="height:100%"></i><i style="height:85%"></i><i style="height:40%"></i><i style="height:65%"></i></div></section>
    </div>
  </div>`;
}

function app(mode='child') {
  root.className = `app ${mode}`;
  root.innerHTML = sidebar() + `<main class="main">${topbar()}${childScreen()}${parentScreen()}</main>`;
  document.querySelectorAll('.role-tabs button').forEach((btn, idx) => btn.classList.toggle('active', (mode === 'child' && idx === 0) || (mode === 'parent' && idx === 1)));
}

window.setMode = app;
app('child');
