import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const today = () => new Date().toISOString().slice(0, 10);
const fmtShort = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
};

const defaultTasks = [
  { id: 1, title: '15 dk kitap okudun mu?', category: 'Eğitim', points: 2, icon: '📖', active: true, completed: true, repeat: 'Her gün' },
  { id: 2, title: 'Ödevlerini yaptın mı?', category: 'Eğitim', points: 3, icon: '✏️', active: true, completed: true, repeat: 'Her gün' },
  { id: 3, title: 'Yatağını topladın mı?', category: 'Düzen', points: 2, icon: '🛏️', active: true, completed: true, repeat: 'Her gün' },
  { id: 4, title: 'Dişlerini fırçaladın mı?', category: 'Kişisel Bakım', points: 1, icon: '🦷', active: true, completed: true, repeat: 'Her gün' },
  { id: 5, title: 'Oyuncaklarını topladın mı?', category: 'Düzen', points: 2, icon: '🧸', active: true, completed: false, repeat: 'Her gün' }
];

const defaultRewards = [
  { id: 1, title: 'Küçük Sürpriz', stars: 10, icon: '🎁', active: true },
  { id: 2, title: 'Dondurma Günü', stars: 20, icon: '🍦', active: true },
  { id: 3, title: 'Oyun Saati Bonusu', stars: 30, icon: '🎮', active: true },
  { id: 4, title: 'Sinema Günü', stars: 50, icon: '🎬', active: true },
  { id: 5, title: 'Büyük Ödül', stars: 100, icon: '👑', active: true }
];

const defaultProfile = {
  childName: 'Elif Lina',
  level: 4,
  xp: 320,
  xpTarget: 500,
  totalStars: 125,
  streak: 7,
  dailyLimit: 50,
  chestTarget: 30,
  reminder: '20:00'
};

const defaultHistory = [
  { date: '2026-05-19', completed: 3, total: 5, stars: 14 },
  { date: '2026-05-20', completed: 4, total: 5, stars: 18 },
  { date: '2026-05-21', completed: 3, total: 5, stars: 12 },
  { date: '2026-05-22', completed: 5, total: 5, stars: 20 },
  { date: '2026-05-23', completed: 4, total: 5, stars: 21 },
  { date: '2026-05-24', completed: 2, total: 5, stars: 8 },
  { date: '2026-05-25', completed: 4, total: 5, stars: 10 }
];

const categories = ['Eğitim', 'Düzen', 'Kişisel Bakım', 'Yardım', 'Spor', 'Manevi', 'Diğer'];
const taskIcons = ['📖', '✏️', '🛏️', '🦷', '🧸', '🧹', '🌱', '🎮', '🏃', '💧', '🙏', '⭐'];
const rewardIcons = ['🎁', '🍦', '🎮', '🎬', '👑', '🧸', '📚', '🍿', '🚲', '🎠'];

function useLS(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
const cls = (...parts) => parts.filter(Boolean).join(' ');

function App() {
  const [tasks, setTasks] = useLS('elifLinaTasksV11', defaultTasks);
  const [rewards, setRewards] = useLS('elifLinaRewardsV11', defaultRewards);
  const [profile, setProfile] = useLS('elifLinaProfileV11', defaultProfile);
  const [history, setHistory] = useLS('elifLinaHistoryV11', defaultHistory);
  const [session, setSession] = useLS('elifLinaSessionV11', { loggedIn: false, role: 'child' });
  const [page, setPage] = useState('dashboard');

  const activeTasks = tasks.filter((t) => t.active);
  const completedTasks = activeTasks.filter((t) => t.completed);
  const earnedToday = completedTasks.reduce((s, t) => s + Number(t.points || 0), 0);
  const completion = pct(completedTasks.length, activeTasks.length);
  const week = useMemo(() => history.slice(-7), [history]);
  const weeklyStars = week.reduce((s, h) => s + Number(h.stars || 0), 0);

  function toggleTask(id) {
    const task = tasks.find((x) => x.id === id);
    if (!task) return;
    const delta = task.completed ? -Number(task.points || 0) : Number(task.points || 0);
    setTasks((list) => list.map((item) => item.id === id ? { ...item, completed: !item.completed } : item));
    setProfile((p) => ({
      ...p,
      totalStars: Math.max(0, Number(p.totalStars || 0) + delta),
      xp: Math.max(0, Number(p.xp || 0) + delta * 10)
    }));
  }

  function finishDay() {
    const record = { date: today(), completed: completedTasks.length, total: activeTasks.length, stars: earnedToday };
    setHistory((list) => [...list.filter((x) => x.date !== record.date), record].slice(-30));
    setTasks((list) => list.map((item) => ({ ...item, completed: false })));
    setProfile((p) => ({ ...p, streak: completedTasks.length === activeTasks.length ? Number(p.streak || 0) + 1 : 0 }));
    setPage('weekly');
  }

  function saveTask(task) {
    if (task.id) setTasks((list) => list.map((x) => x.id === task.id ? task : x));
    else setTasks((list) => [{ ...task, id: Date.now(), active: true, completed: false }, ...list]);
  }
  function saveReward(reward) {
    if (reward.id) setRewards((list) => list.map((x) => x.id === reward.id ? reward : x));
    else setRewards((list) => [{ ...reward, id: Date.now(), active: true }, ...list]);
  }

  if (!session.loggedIn) {
    return <Login onLogin={(role) => { setSession({ loggedIn: true, role }); setPage('dashboard'); }} />;
  }

  return (
    <div className="app">
      <Sidebar profile={profile} role={session.role} setRole={(role) => setSession({ ...session, role })} page={page} setPage={setPage} onLogout={() => setSession({ ...session, loggedIn: false })} />
      <main className="workspace">
        <Topbar profile={profile} role={session.role} setRole={(role) => setSession({ ...session, role })} />
        {session.role === 'child' ? (
          <ChildArea page={page} setPage={setPage} profile={profile} tasks={activeTasks} rewards={rewards.filter(r => r.active)} history={history} completion={completion} completed={completedTasks.length} earnedToday={earnedToday} weeklyStars={weeklyStars} onToggle={toggleTask} onFinishDay={finishDay} />
        ) : (
          <ParentArea page={page} profile={profile} setProfile={setProfile} tasks={tasks} rewards={rewards} history={history} completion={completion} completed={completedTasks.length} earnedToday={earnedToday} weeklyStars={weeklyStars} onSaveTask={saveTask} onDeleteTask={(id) => setTasks((list) => list.filter((x) => x.id !== id))} onSaveReward={saveReward} onDeleteReward={(id) => setRewards((list) => list.filter((x) => x.id !== id))} onFinishDay={finishDay} />
        )}
      </main>
    </div>
  );
}

function ElifAvatar({ size = 'md' }) {
  return (
    <div className={cls('elif-avatar', size)} aria-label="Elif Lina avatar">
      <svg viewBox="0 0 180 180" role="img">
        <defs>
          <linearGradient id="dress" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff69b4"/><stop offset="1" stopColor="#e23686"/></linearGradient>
          <linearGradient id="bow" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff95c9"/><stop offset="1" stopColor="#f43f8b"/></linearGradient>
        </defs>
        <circle cx="90" cy="90" r="83" fill="#fff1f8"/>
        <path d="M35 83c0-49 27-78 55-78s55 29 55 78c0 60-22 84-55 84S35 143 35 83z" fill="#6d2a16"/>
        <path d="M40 92c-16 1-19 32-2 36M140 92c16 1 19 32 2 36" fill="none" stroke="#6d2a16" strokeWidth="14" strokeLinecap="round"/>
        <circle cx="90" cy="87" r="51" fill="#ffd4bd"/>
        <path d="M43 79c16-47 57-54 88-21 8 8 14 18 16 30-25-6-46-23-58-43-12 23-30 33-46 34z" fill="#55200f"/>
        <circle cx="71" cy="91" r="7" fill="#21113a"/><circle cx="109" cy="91" r="7" fill="#21113a"/>
        <circle cx="68" cy="88" r="2.2" fill="#fff"/><circle cx="106" cy="88" r="2.2" fill="#fff"/>
        <path d="M76 117c9 10 21 10 30 0" stroke="#b91c5c" strokeWidth="7" strokeLinecap="round" fill="none"/>
        <circle cx="58" cy="106" r="8" fill="#ff9ab4" opacity=".55"/><circle cx="122" cy="106" r="8" fill="#ff9ab4" opacity=".55"/>
        <path d="M39 42c-12-26 28-48 51-17-9 25-35 31-51 17z" fill="url(#bow)"/>
        <path d="M92 25c25-34 65-12 52 16-26 14-47 6-52-16z" fill="url(#bow)"/>
        <circle cx="89" cy="38" r="12" fill="#ff4fa3"/>
        <path d="M52 151c8-27 68-27 76 0" fill="url(#dress)"/>
        <path d="M90 134l8 14 15 2-11 11 3 15-15-8-14 8 3-15-11-11 15-2z" fill="#facc15"/>
      </svg>
    </div>
  );
}

function Login({ onLogin }) {
  return (
    <div className="login-wrap">
      <section className="login-hero">
        <div className="stars-bg">✦ ★ ✧ ★ ✦</div>
        <h1>Elif Lina</h1>
        <p>Günlük Sorumluluk ve Oyunlaştırma Programı</p>
        <div className="login-figure"><ElifAvatar size="xl" /><span className="bunny">🐰</span></div>
        <button className="primary big" onClick={() => onLogin('child')}>Çocuk Paneli</button>
        <button className="secondary big" onClick={() => onLogin('parent')}>Ebeveyn Paneli</button>
        <div className="safe-row">
          <MiniBenefit icon="🛡️" title="Güvenli" text="Çocuğa özel" />
          <MiniBenefit icon="⭐" title="Eğlenceli" text="Görev + yıldız" />
          <MiniBenefit icon="🏆" title="Ödüllü" text="Başarı görünür" />
        </div>
      </section>
      <section className="login-select card">
        <h2>Hoş Geldin! 👋</h2>
        <p>Devam etmek için profil seç.</p>
        <ProfileOption name="Elif Lina" sub="Seviye 4" active />
        <ProfileOption name="Ali Efe" sub="Örnek profil" icon="👦🏻" />
        <ProfileOption name="Zeynep" sub="Örnek profil" icon="👧🏽" />
        <button className="ghost wide">+ Yeni Profil Ekle</button>
        <button className="primary wide" onClick={() => onLogin('child')}>Elif Lina ile Başla</button>
      </section>
    </div>
  );
}
function ProfileOption({ name, sub, icon, active }) {
  return <div className={cls('profile-option', active && 'active')}>{icon ? <span>{icon}</span> : <ElifAvatar size="xs" />}<div><b>{name}</b><small>{sub}</small></div><em>›</em></div>;
}
function MiniBenefit({ icon, title, text }) { return <div className="mini-benefit"><span>{icon}</span><b>{title}</b><small>{text}</small></div>; }

function Sidebar({ profile, role, setRole, page, setPage, onLogout }) {
  const childItems = [
    ['dashboard', 'Ana Sayfa', '🏠'], ['tasks', 'Görevler', '✅'], ['games', 'Mini Oyunlar', '🎮'], ['map', 'Macera Haritası', '🗺️'], ['badges', 'Rozetler', '🏅'], ['rewards', 'Ödüller', '🎁'], ['weekly', 'Haftalık Takip', '📅'], ['profile', 'Profilim', '👤']
  ];
  const parentItems = [
    ['dashboard', 'Dashboard', '🏠'], ['tasks', 'Görev Yönetimi', '✅'], ['rewards', 'Ödül Yönetimi', '🎁'], ['weekly', 'Haftalık Rapor', '📊'], ['profile', 'Çocuk Profili', '👧'], ['settings', 'Ayarlar', '⚙️']
  ];
  const items = role === 'parent' ? parentItems : childItems;
  return (
    <aside className="sidebar">
      <div className="brand-panel">
        <h2>Elif Lina</h2><small>Günlük Sorumluluk</small><ElifAvatar size="lg" />
      </div>
      <div className="role-switch"><button className={role === 'child' ? 'active' : ''} onClick={() => setRole('child')}>Çocuk</button><button className={role === 'parent' ? 'active' : ''} onClick={() => setRole('parent')}>Ebeveyn</button></div>
      <nav>{items.map(([id, label, icon]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}><span>{icon}</span>{label}</button>)}</nav>
      <div className="side-footer"><b>⭐ Günlük hedef</b><small>{profile.totalStars} yıldız toplandı</small><button onClick={onLogout}>Çıkış Yap</button></div>
    </aside>
  );
}

function Topbar({ profile, role, setRole }) {
  return <header className="topbar"><div><h1>Merhaba {profile.childName}! 👋</h1><p>Bugün harika işler seni bekliyor.</p></div><div className="top-stats"><Pill icon="⭐" label="Toplam Yıldız" value={profile.totalStars}/><Pill icon="🛡️" label="Seviye" value={profile.level}/><Pill icon="🔥" label="Günlük Seri" value={profile.streak}/><button className="bell">🔔<i>3</i></button><select value={role} onChange={(e) => setRole(e.target.value)}><option value="child">Çocuk Paneli</option><option value="parent">Ebeveyn Paneli</option></select></div></header>;
}
function Pill({ icon, label, value }) { return <div className="pill"><span>{icon}</span><small>{label}</small><b>{value}</b></div>; }

function ChildArea(props) {
  if (props.page === 'tasks') return <TasksPage {...props} />;
  if (props.page === 'games') return <GamesPage />;
  if (props.page === 'map') return <MapPage profile={props.profile} />;
  if (props.page === 'badges') return <BadgesPage />;
  if (props.page === 'rewards') return <RewardsPage rewards={props.rewards} profile={props.profile} />;
  if (props.page === 'weekly') return <WeeklyPage history={props.history} weeklyStars={props.weeklyStars} />;
  if (props.page === 'profile') return <ProfilePage profile={props.profile} />;
  return <ChildDashboard {...props} />;
}

function ChildDashboard({ profile, tasks, rewards, history, completion, completed, earnedToday, weeklyStars, onToggle, onFinishDay, setPage }) {
  return (
    <div className="dashboard-grid">
      <ProgressCard completion={completion} completed={completed} total={tasks.length} />
      <ChestCard stars={earnedToday} target={profile.chestTarget} />
      <MotivationCard />
      <RewardMini rewards={rewards} profile={profile} />
      <TasksMini tasks={tasks} onToggle={onToggle} setPage={setPage} onFinishDay={onFinishDay} />
      <GamesMini setPage={setPage} />
      <AdventureMini setPage={setPage} />
      <WeeklyMini history={history} weeklyStars={weeklyStars} setPage={setPage} />
      <FeatureStrip />
      <div className="action-banner"><span>🏆</span><div><b>Elif Lina ile her gün daha iyiye!</b><small>Görevleri tamamla, yıldızlarını topla, ödülleri kazan.</small></div><button onClick={onFinishDay}>Bugünü Kaydet</button></div>
    </div>
  );
}

function ProgressCard({ completion, completed, total }) { return <section className="card progress-card"><h3>Bugünkü İlerlemen</h3><div className="ring" style={{ '--p': `${completion * 3.6}deg` }}><b>{completion}%</b></div><strong>{completed} / {total} görev</strong><small>tamamlandı</small></section>; }
function ChestCard({ stars, target }) { const ratio = Math.min(100, Math.round((stars / target) * 100)); return <section className="card chest-card"><h3>Sürpriz Kutu</h3><div className="treasure">🧰</div><b>{stars} / {target} yıldız</b><small>{target} yıldız olduğunda kutunu aç.</small><div className="meter"><i style={{ width: `${ratio}%` }} /></div></section>; }
function MotivationCard() { return <section className="card motivation"><h3>Günlük Motivasyon</h3><div className="unicorn">🦄</div><b>Küçük adımlar, büyük değişimler yaratır! 🌈</b></section>; }
function RewardMini({ rewards, profile }) { return <section className="card reward-mini"><HeaderLink title="Ödüller Dükkanı" /><div>{rewards.slice(0,5).map(r => <div className="reward-line" key={r.id}><span>{r.icon}</span><b>{r.title}</b><em>{r.stars} ⭐</em></div>)}</div></section>; }
function HeaderLink({ title, onClick }) { return <div className="card-title"><h3>{title}</h3>{onClick && <button onClick={onClick}>Tümünü Gör</button>}</div>; }
function TasksMini({ tasks, onToggle, setPage, onFinishDay }) { return <section className="card tasks-mini"><HeaderLink title="Bugünkü Görevlerin" onClick={() => setPage('tasks')} />{tasks.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}<div className="button-row"><button className="primary wide" onClick={() => setPage('tasks')}>Tüm Görevleri Gör</button><button className="secondary" onClick={onFinishDay}>Kaydet</button></div></section>; }
function TaskRow({ task, onToggle }) { return <button className={cls('task-row', task.completed && 'done')} onClick={() => onToggle(task.id)}><span>{task.icon}</span><b>{task.title}</b><em>+{task.points} ⭐</em><i>{task.completed ? '✓' : ''}</i></button>; }
function GamesMini({ setPage }) { const games = [['🐼','Eşleştirme'],['⭐','Yıldız Toplama'],['🎈','Balon Patlatma'],['abc','Kelime Bulmaca']]; return <section className="card games-card"><HeaderLink title="Mini Oyunlar" onClick={() => setPage('games')} /><div className="games-grid mini">{games.map(([icon, title]) => <GameTile key={title} icon={icon} title={title} />)}</div></section>; }
function GameTile({ icon, title }) { return <div className="game-tile"><span>{icon}</span><b>{title}</b><button>Oyna</button></div>; }
function AdventureMini({ setPage }) { return <section className="card map-card"><HeaderLink title="Macera Haritası" onClick={() => setPage('map')} /><AdventureMap /><div className="map-footer"><b>Seviye 5: Harika!</b><small>Sonraki hedef: 6. seviye</small><div className="meter"><i style={{ width: '64%' }} /></div></div></section>; }
function WeeklyMini({ history, weeklyStars, setPage }) { return <section className="card weekly-card"><HeaderLink title="Haftalık Özet" onClick={() => setPage('weekly')} /><div className="week-cards">{history.slice(-7).map(h => <div key={h.date}><span>⭐</span><b>{h.stars}</b><small>{fmtShort(h.date)}</small></div>)}</div><div className="weekly-total"><b>{weeklyStars} ⭐</b><small>haftalık toplam</small></div></section>; }
function FeatureStrip() { return <section className="feature-strip"><MiniBenefit icon="🛡️" title="Sorumluluk Bilinci" text="Görevleri tamamla" /><MiniBenefit icon="⭐" title="Motivasyon Artar" text="Yıldızlarla destek" /><MiniBenefit icon="🎮" title="Eğlenceli Öğrenme" text="Oyunlarla keşfet" /><MiniBenefit icon="⏰" title="Zaman Yönetimi" text="Planlı olmayı öğrenir" /><MiniBenefit icon="🏆" title="Özgüven Gelişimi" text="Başardıkça güçlenir" /><MiniBenefit icon="👨‍👩‍👧" title="Aile Bağı Güçlenir" text="Birlikte takip" /></section>; }

function AdventureMap() {
  return <div className="adventure"><div className="sky"></div><div className="mountains">🏔️</div><div className="castle">🏰</div><svg viewBox="0 0 420 240" preserveAspectRatio="none"><path d="M20 198 C92 116 128 221 186 128 C239 42 308 118 390 52" fill="none" stroke="#ffd37d" strokeWidth="28" strokeLinecap="round" strokeDasharray="20 18"/><path d="M20 198 C92 116 128 221 186 128 C239 42 308 118 390 52" fill="none" stroke="#fff2c2" strokeWidth="16" strokeLinecap="round" strokeDasharray="14 21"/></svg>{[1,2,3,4,5].map((n, i) => <div key={n} className={`node n${n}`}>{n}</div>)}<div className="chest">🧰</div></div>;
}

function TasksPage({ tasks, onToggle, earnedToday, completed, completion, onFinishDay }) { return <section className="page card"><div className="page-head"><div><h2>Bugünkü Görevler</h2><p>Görevleri tamamla, yıldızları topla.</p></div><b>{completed} / {tasks.length} tamamlandı</b></div><div className="task-list big">{tasks.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}</div><div className="task-total"><span>Günün Toplamı: ⭐ {earnedToday}</span><button className="primary" onClick={onFinishDay}>Bugünü Kaydet</button></div></section>; }
function GamesPage() { return <section className="page card"><div className="page-head"><h2>Mini Oyunlar</h2><p>Görevlerini tamamla, ekstra oyun hakkı kazan.</p></div><div className="games-grid full"><GameDetail icon="🐼" title="Eşleştirme Oyunu" score="+2 ⭐"/><GameDetail icon="⭐" title="Yıldız Toplama" score="+3 ⭐"/><GameDetail icon="🎈" title="Balon Patlatma" score="+1 ⭐"/><GameDetail icon="abc" title="Kelime Bulmaca" score="+2 ⭐"/></div></section>; }
function GameDetail({ icon, title, score }) { return <div className="game-detail"><span>{icon}</span><h3>{title}</h3><p>Oyna ve yıldız kazan.</p><button>{score} Oyna</button></div>; }
function MapPage() { return <section className="page card"><div className="page-head"><h2>Macera Haritası</h2><p>Her başarı seni yeni seviyeye taşır.</p></div><div className="large-map"><AdventureMap /></div><div className="level-info"><b>Seviye 5: Harika!</b><small>Sonraki hedef 6. seviye</small><div className="meter"><i style={{ width: '64%' }} /></div></div></section>; }
function BadgesPage() { const badges = [['📚','Kitap Kurdu','15 gün kitap okuma',true],['🖐️','Süper Yardımcı','20 görev tamamlama',true],['🛏️','Düzen Şampiyonu','Yatağını 15 gün toplama',true],['🥉','3 Gün Seri','3 gün üst üste görev',true],['🏅','7 Gün Seri','7 gün üst üste görev',true],['🔒','30 Yıldız Kulübü','30 yıldız topla',false]]; return <section className="page card"><div className="page-head"><h2>Rozetler ve Başarılar</h2></div><div className="badges-grid">{badges.map(([icon,title,sub,open]) => <div className={cls('badge-card', !open && 'locked')} key={title}><span>{icon}</span><b>{title}</b><small>{sub}</small></div>)}</div></section>; }
function RewardsPage({ rewards, profile }) { return <section className="page card"><div className="page-head"><h2>Ödüller Dükkanı</h2><b>Mevcut yıldızın: {profile.totalStars} ⭐</b></div><div className="reward-list">{rewards.map(r => <div className="reward-shop" key={r.id}><span>{r.icon}</span><div><b>{r.title}</b><small>{r.stars} yıldız</small></div><button disabled={profile.totalStars < r.stars}>{profile.totalStars >= r.stars ? 'Al' : 'Kilitli'}</button></div>)}</div></section>; }
function WeeklyPage({ history, weeklyStars }) { return <section className="page card"><div className="page-head"><h2>Haftalık Takip</h2><b>{weeklyStars} ⭐ haftalık toplam</b></div><Chart history={history.slice(-7)} /><div className="week-cards large">{history.slice(-7).map(h => <div key={h.date}><span>⭐</span><b>{h.stars}</b><small>{fmtShort(h.date)} · {h.completed}/{h.total}</small></div>)}</div></section>; }
function ProfilePage({ profile }) { return <section className="page card profile-page"><ElifAvatar size="xl" /><h2>{profile.childName}</h2><p>Seviye {profile.level}</p><div className="profile-stats"><Pill icon="⭐" label="Toplam Yıldız" value={profile.totalStars}/><Pill icon="🔥" label="Günlük Seri" value={profile.streak}/><Pill icon="🏅" label="Açılan Rozet" value="8 / 20"/></div></section>; }

function ParentArea(props) {
  if (props.page === 'tasks') return <TaskManager {...props} />;
  if (props.page === 'rewards') return <RewardManager {...props} />;
  if (props.page === 'weekly') return <ParentReports {...props} />;
  if (props.page === 'profile') return <ProfileSettings {...props} />;
  if (props.page === 'settings') return <SettingsPage {...props} />;
  return <ParentDashboard {...props} />;
}
function ParentDashboard({ tasks, rewards, profile, history, completion, completed, weeklyStars, onFinishDay }) {
  return <div className="parent-grid"><Kpi label="Toplam Görev" value={tasks.length}/><Kpi label="Tamamlanan" value={completed}/><Kpi label="Tamamlama Oranı" value={`%${completion}`}/><Kpi label="Toplam Yıldız" value={profile.totalStars}/><Kpi label="Günlük Seri" value={profile.streak}/><section className="card span-2"><h3>Son 7 Gün Performansı</h3><Chart history={history.slice(-7)} /></section><section className="card"><h3>Görev Durumu</h3><div className="donut" style={{'--p': `${completion * 3.6}deg`}}><b>{completion}%</b></div></section><section className="card span-2"><h3>Görev Yönetimi</h3><TableTasks tasks={tasks.slice(0,5)} simple /></section><section className="card span-2"><h3>Ödül Yönetimi</h3><TableRewards rewards={rewards.slice(0,5)} simple /></section><section className="card span-2"><h3>Haftalık Rapor</h3><p className="muted">Bu hafta toplam {weeklyStars} yıldız kazanıldı.</p><button className="primary" onClick={onFinishDay}>Bugünü Kaydet ve Haftaya İşle</button></section></div>;
}
function Kpi({ label, value }) { return <section className="card kpi"><small>{label}</small><b>{value}</b></section>; }
function Chart({ history }) { const max = Math.max(20, ...history.map(h => Number(h.stars || 0))); return <div className="chart">{history.map(h => <div className="bar-col" key={h.date}><b>{h.stars}</b><i style={{ height: `${(h.stars / max) * 160}px` }} /><small>{fmtShort(h.date)}</small></div>)}</div>; }
function TaskManager({ tasks, onSaveTask, onDeleteTask }) { const [editing, setEditing] = useState(null); return <section className="page card"><div className="page-head"><h2>Görev Yönetimi</h2><button className="primary" onClick={() => setEditing({ title: '', category: 'Eğitim', points: 2, icon: '📖', repeat: 'Her gün', active: true, completed: false })}>+ Yeni Görev</button></div>{editing && <TaskForm task={editing} onCancel={() => setEditing(null)} onSave={(t) => { onSaveTask(t); setEditing(null); }} />}<TableTasks tasks={tasks} onEdit={setEditing} onDelete={onDeleteTask} /></section>; }
function TaskForm({ task, onSave, onCancel }) { const [f, setF] = useState(task); return <div className="form-card"><h3>{f.id ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</h3><div className="form-grid"><input value={f.title} onChange={e => setF({...f,title:e.target.value})} placeholder="Görev adı"/><select value={f.category} onChange={e => setF({...f,category:e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select><input type="number" value={f.points} min="1" max="20" onChange={e => setF({...f,points:Number(e.target.value)})}/><select value={f.icon} onChange={e => setF({...f,icon:e.target.value})}>{taskIcons.map(i => <option key={i}>{i}</option>)}</select><label><input type="checkbox" checked={f.active} onChange={e => setF({...f,active:e.target.checked})}/> Aktif</label></div><div className="form-actions"><button className="danger" onClick={onCancel}>İptal</button><button className="primary" onClick={() => onSave(f)}>Kaydet</button></div></div>; }
function TableTasks({ tasks, onEdit, onDelete, simple }) { return <div className="table-wrap"><table><thead><tr><th>Görev</th><th>Kategori</th><th>Puan</th><th>Durum</th>{!simple && <th>İşlem</th>}</tr></thead><tbody>{tasks.map(t => <tr key={t.id}><td>{t.icon} {t.title}</td><td>{t.category}</td><td>{t.points} ⭐</td><td>{t.active ? 'Aktif' : 'Pasif'}</td>{!simple && <td><button onClick={() => onEdit(t)}>Düzenle</button><button className="danger" onClick={() => onDelete(t.id)}>Sil</button></td>}</tr>)}</tbody></table></div>; }
function RewardManager({ rewards, onSaveReward, onDeleteReward }) { const [editing, setEditing] = useState(null); return <section className="page card"><div className="page-head"><h2>Ödül Yönetimi</h2><button className="primary" onClick={() => setEditing({ title: '', stars: 10, icon: '🎁', active: true })}>+ Yeni Ödül</button></div>{editing && <RewardForm reward={editing} onCancel={() => setEditing(null)} onSave={(r) => { onSaveReward(r); setEditing(null); }} />}<TableRewards rewards={rewards} onEdit={setEditing} onDelete={onDeleteReward} /></section>; }
function RewardForm({ reward, onSave, onCancel }) { const [f, setF] = useState(reward); return <div className="form-card"><h3>{f.id ? 'Ödülü Düzenle' : 'Yeni Ödül Ekle'}</h3><div className="form-grid"><input value={f.title} onChange={e => setF({...f,title:e.target.value})} placeholder="Ödül adı"/><input type="number" value={f.stars} min="1" onChange={e => setF({...f,stars:Number(e.target.value)})}/><select value={f.icon} onChange={e => setF({...f,icon:e.target.value})}>{rewardIcons.map(i => <option key={i}>{i}</option>)}</select><label><input type="checkbox" checked={f.active} onChange={e => setF({...f,active:e.target.checked})}/> Aktif</label></div><div className="form-actions"><button className="danger" onClick={onCancel}>İptal</button><button className="primary" onClick={() => onSave(f)}>Kaydet</button></div></div>; }
function TableRewards({ rewards, onEdit, onDelete, simple }) { return <div className="table-wrap"><table><thead><tr><th>Ödül</th><th>Gerekli Yıldız</th><th>Durum</th>{!simple && <th>İşlem</th>}</tr></thead><tbody>{rewards.map(r => <tr key={r.id}><td>{r.icon} {r.title}</td><td>{r.stars} ⭐</td><td>{r.active ? 'Aktif' : 'Pasif'}</td>{!simple && <td><button onClick={() => onEdit(r)}>Düzenle</button><button className="danger" onClick={() => onDelete(r.id)}>Sil</button></td>}</tr>)}</tbody></table></div>; }
function ParentReports({ history, weeklyStars }) { return <section className="page card"><div className="page-head"><h2>Haftalık Rapor</h2><b>{weeklyStars} ⭐</b></div><Chart history={history.slice(-7)} /><div className="week-cards large">{history.slice(-7).map(h => <div key={h.date}><span>⭐</span><b>{h.stars}</b><small>{h.completed}/{h.total} görev · {fmtShort(h.date)}</small></div>)}</div></section>; }
function ProfileSettings({ profile, setProfile }) { return <section className="page card"><h2>Çocuk Profili</h2><div className="settings-list"><label>Çocuk Adı<input value={profile.childName} onChange={e => setProfile({...profile, childName:e.target.value})}/></label><label>Seviye<input type="number" value={profile.level} onChange={e => setProfile({...profile, level:Number(e.target.value)})}/></label><label>Toplam Yıldız<input type="number" value={profile.totalStars} onChange={e => setProfile({...profile, totalStars:Number(e.target.value)})}/></label></div></section>; }
function SettingsPage({ profile, setProfile }) { return <section className="page card"><h2>Ayarlar</h2><div className="settings-list"><label>Günlük Yıldız Limiti<input type="number" value={profile.dailyLimit} onChange={e => setProfile({...profile,dailyLimit:Number(e.target.value)})}/></label><label>Sürpriz Kutu Eşiği<input type="number" value={profile.chestTarget} onChange={e => setProfile({...profile,chestTarget:Number(e.target.value)})}/></label><label>Günlük Hatırlatma<input value={profile.reminder} onChange={e => setProfile({...profile,reminder:e.target.value})}/></label><label>Motivasyon Mesajları<input type="checkbox" defaultChecked /></label></div></section>; }

createRoot(document.getElementById('root')).render(<App />);
