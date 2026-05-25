import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultTasks = [
  { id: 1, title: '15 dk kitap okudun mu?', category: 'Eğitim', points: 2, icon: '📖', active: true, completed: true },
  { id: 2, title: 'Ödevlerini yaptın mı?', category: 'Eğitim', points: 3, icon: '✏️', active: true, completed: true },
  { id: 3, title: 'Yatağını topladın mı?', category: 'Düzen', points: 2, icon: '🛏️', active: true, completed: true },
  { id: 4, title: 'Dişlerini fırçaladın mı?', category: 'Kişisel Bakım', points: 1, icon: '🦷', active: true, completed: true },
  { id: 5, title: 'Oyuncaklarını topladın mı?', category: 'Düzen', points: 2, icon: '🧸', active: true, completed: false }
];

const defaultRewards = [
  { id: 1, title: 'Küçük Sürpriz', stars: 10, icon: '🎁', active: true },
  { id: 2, title: 'Dondurma Günü', stars: 20, icon: '🍦', active: true },
  { id: 3, title: 'Oyun Saati Bonusu', stars: 30, icon: '🎮', active: true },
  { id: 4, title: 'Sinema Günü', stars: 50, icon: '🎬', active: true },
  { id: 5, title: 'Büyük Ödül', stars: 100, icon: '🎉', active: true }
];

const defaultProfile = {
  childName: 'Elif Lina',
  level: 4,
  xp: 320,
  xpTarget: 500,
  totalStars: 125,
  streak: 7,
  badges: ['Kitap Kurdu', 'Süper Yardımcı', 'Düzen Şampiyonu'],
  theme: 'mor-pembe'
};

const badgeCatalog = [
  { title: 'Kitap Kurdu', condition: '15 gün kitap okuma', icon: '📚', unlocked: true },
  { title: 'Süper Yardımcı', condition: '20 görev tamamlama', icon: '🖐️', unlocked: true },
  { title: 'Düzen Şampiyonu', condition: 'Yatağını 15 gün toplama', icon: '🛏️', unlocked: true },
  { title: '3 Gün Seri', condition: '3 gün üst üste görev bitir', icon: '🥉', unlocked: true },
  { title: '7 Gün Seri', condition: '7 gün üst üste görev bitir', icon: '🏅', unlocked: true },
  { title: '30 Yıldız Kulübü', condition: '30 yıldız topla', icon: '🔒', unlocked: false }
];

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
const icons = ['📖', '✏️', '🛏️', '🦷', '🧸', '🧹', '🌱', '🎮', '🏃', '💧', '🙏', '⭐'];
const rewardIcons = ['🎁', '🍦', '🎮', '🎬', '🎉', '👑', '🧸', '📚', '🍿', '🚲'];

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

function pct(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function App() {
  const [tasks, setTasks] = useLocalStorage('elifLinaTasksV1', defaultTasks);
  const [rewards, setRewards] = useLocalStorage('elifLinaRewardsV1', defaultRewards);
  const [profile, setProfile] = useLocalStorage('elifLinaProfileV1', defaultProfile);
  const [history, setHistory] = useLocalStorage('elifLinaHistoryV1', defaultHistory);
  const [session, setSession] = useLocalStorage('elifLinaSessionV1', { loggedIn: false, role: 'child' });
  const [activePage, setActivePage] = useState('dashboard');

  const activeTasks = tasks.filter((t) => t.active);
  const completedTasks = activeTasks.filter((t) => t.completed);
  const earnedToday = completedTasks.reduce((sum, t) => sum + Number(t.points || 0), 0);
  const completion = pct(completedTasks.length, activeTasks.length);
  const weeklyStars = history.slice(-7).reduce((sum, h) => sum + h.stars, 0);

  function login(role) {
    setSession({ loggedIn: true, role });
    setActivePage('dashboard');
  }

  function logout() {
    setSession({ ...session, loggedIn: false });
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) => {
      if (task.id !== id) return task;
      const nextCompleted = !task.completed;
      setProfile((p) => ({
        ...p,
        totalStars: Math.max(0, p.totalStars + (nextCompleted ? Number(task.points || 0) : -Number(task.points || 0))),
        xp: Math.max(0, p.xp + (nextCompleted ? Number(task.points || 0) * 10 : -Number(task.points || 0) * 10))
      }));
      return { ...task, completed: nextCompleted };
    }));
  }

  function upsertTask(task) {
    if (task.id) {
      setTasks((current) => current.map((item) => item.id === task.id ? task : item));
    } else {
      setTasks((current) => [{ ...task, id: Date.now(), completed: false, active: true }, ...current]);
    }
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((item) => item.id !== id));
  }

  function upsertReward(reward) {
    if (reward.id) {
      setRewards((current) => current.map((item) => item.id === reward.id ? reward : item));
    } else {
      setRewards((current) => [{ ...reward, id: Date.now(), active: true }, ...current]);
    }
  }

  function deleteReward(id) {
    setRewards((current) => current.filter((item) => item.id !== id));
  }

  function finishDay() {
    const record = {
      date: todayKey(),
      completed: completedTasks.length,
      total: activeTasks.length,
      stars: earnedToday
    };
    setHistory((current) => {
      const withoutToday = current.filter((item) => item.date !== record.date);
      return [...withoutToday, record].slice(-30);
    });
    setTasks((current) => current.map((task) => ({ ...task, completed: false })));
    setProfile((p) => ({ ...p, streak: completedTasks.length === activeTasks.length ? p.streak + 1 : 0 }));
  }

  if (!session.loggedIn) return <LoginScreen onLogin={login} />;

  return (
    <div className="app-shell">
      <Sidebar role={session.role} setRole={(role) => setSession({ ...session, role })} activePage={activePage} setActivePage={setActivePage} onLogout={logout} profile={profile} />
      <main className="main-area">
        <TopBar profile={profile} role={session.role} setRole={(role) => setSession({ ...session, role })} />
        {session.role === 'child' ? (
          <ChildPanel
            activePage={activePage}
            tasks={activeTasks}
            allTasks={tasks}
            rewards={rewards.filter((r) => r.active)}
            profile={profile}
            completion={completion}
            completedCount={completedTasks.length}
            earnedToday={earnedToday}
            weeklyStars={weeklyStars}
            history={history}
            onToggleTask={toggleTask}
            onFinishDay={finishDay}
          />
        ) : (
          <ParentPanel
            activePage={activePage}
            tasks={tasks}
            rewards={rewards}
            profile={profile}
            setProfile={setProfile}
            history={history}
            completion={completion}
            completedCount={completedTasks.length}
            earnedToday={earnedToday}
            weeklyStars={weeklyStars}
            onSaveTask={upsertTask}
            onDeleteTask={deleteTask}
            onSaveReward={upsertReward}
            onDeleteReward={deleteReward}
            onFinishDay={finishDay}
          />
        )}
      </main>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="login-page">
      <section className="login-card hero-login">
        <div className="logo-big">Elif Lina</div>
        <p className="tagline">Günlük Sorumluluk ve Oyunlaştırma Programı</p>
        <div className="girl-hero">👧🏻</div>
        <div className="login-actions">
          <button onClick={() => onLogin('child')} className="btn btn-pink">Çocuk Girişi <span>→</span></button>
          <button onClick={() => onLogin('parent')} className="btn btn-white">Ebeveyn Girişi <span>→</span></button>
          <button onClick={() => onLogin('child')} className="btn btn-purple-outline">Demo Olarak Dene</button>
        </div>
        <div className="hero-benefits">
          <Benefit icon="🛡️" title="Güvenli" text="Çocuklara özel, sade içerik" />
          <Benefit icon="⭐" title="Eğlenceli" text="Yıldız kazan, görevleri tamamla" />
          <Benefit icon="🏆" title="Ödüllü" text="Başarıları görünür hale getir" />
        </div>
      </section>
      <section className="login-card login-side">
        <h2>Hoş Geldin! 👋</h2>
        <p>Devam etmek için profil seç.</p>
        <div className="profile-picker active"><span>👧🏻</span><div><b>Elif Lina</b><small>Seviye 4</small></div></div>
        <div className="profile-picker"><span>👦🏻</span><div><b>Ali Efe</b><small>Örnek profil</small></div></div>
        <div className="profile-picker"><span>👧🏽</span><div><b>Zeynep</b><small>Örnek profil</small></div></div>
        <button className="profile-add">+ Yeni Profil Ekle</button>
        <button onClick={() => onLogin('child')} className="btn btn-pink wide">Elif Lina ile Başla</button>
      </section>
    </div>
  );
}

function Benefit({ icon, title, text }) {
  return <div className="benefit"><span>{icon}</span><b>{title}</b><small>{text}</small></div>;
}

function Sidebar({ role, setRole, activePage, setActivePage, onLogout, profile }) {
  const items = [
    ['dashboard', 'Ana Sayfa', '🏠'],
    ['tasks', 'Görevler', '✅'],
    ['games', 'Mini Oyunlar', '🎮'],
    ['map', 'Macera Haritası', '🗺️'],
    ['badges', 'Rozetler', '🏅'],
    ['rewards', 'Ödüller', '🎁'],
    ['weekly', 'Haftalık Takip', '📅'],
    ['profile', 'Profilim', '👤']
  ];
  const parentItems = [
    ['dashboard', 'Dashboard', '🏠'],
    ['tasks', 'Görev Yönetimi', '✅'],
    ['rewards', 'Ödül Yönetimi', '🎁'],
    ['weekly', 'Performans', '📈'],
    ['profile', 'Çocuk Profili', '👧🏻'],
    ['settings', 'Ayarlar', '⚙️']
  ];
  const nav = role === 'parent' ? parentItems : items;
  return (
    <aside className="sidebar">
      <div className="brand-card">
        <div className="brand-title">Elif Lina</div>
        <small>Günlük Sorumluluk</small>
        <div className="brand-character">👧🏻</div>
      </div>
      <div className="role-switch">
        <button className={role === 'child' ? 'selected' : ''} onClick={() => setRole('child')}>Çocuk</button>
        <button className={role === 'parent' ? 'selected' : ''} onClick={() => setRole('parent')}>Ebeveyn</button>
      </div>
      <nav>
        {nav.map(([key, label, icon]) => (
          <button key={key} className={activePage === key ? 'active' : ''} onClick={() => setActivePage(key)}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="mini-star">⭐</div>
        <b>Günlük hedefini tamamla!</b>
        <small>Toplam yıldız: {profile.totalStars}</small>
        <button onClick={onLogout}>Çıkış Yap</button>
      </div>
    </aside>
  );
}

function TopBar({ profile, role, setRole }) {
  return (
    <header className="topbar">
      <div>
        <h1>Merhaba {profile.childName}! 👋</h1>
        <p>Bugün harika işler seni bekliyor.</p>
      </div>
      <div className="top-actions">
        <StatPill icon="⭐" label="Toplam Yıldız" value={profile.totalStars} />
        <StatPill icon="🛡️" label="Seviye" value={profile.level} />
        <StatPill icon="🔥" label="Günlük Seri" value={profile.streak} />
        <button className="notif">🔔<span>3</span></button>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="child">Çocuk Paneli</option>
          <option value="parent">Ebeveyn Paneli</option>
        </select>
      </div>
    </header>
  );
}

function StatPill({ icon, label, value }) {
  return <div className="stat-pill"><span>{icon}</span><div><small>{label}</small><b>{value}</b></div></div>;
}

function ChildPanel(props) {
  const { activePage } = props;
  if (activePage === 'tasks') return <TaskPage {...props} />;
  if (activePage === 'games') return <GamesPage />;
  if (activePage === 'map') return <AdventureMap />;
  if (activePage === 'badges') return <BadgesPage profile={props.profile} />;
  if (activePage === 'rewards') return <RewardsPage rewards={props.rewards} totalStars={props.profile.totalStars} />;
  if (activePage === 'weekly') return <WeeklyPage history={props.history} weeklyStars={props.weeklyStars} />;
  if (activePage === 'profile') return <ChildProfile profile={props.profile} completedCount={props.completedCount} />;
  return <ChildDashboard {...props} />;
}

function ChildDashboard({ tasks, rewards, profile, completion, completedCount, earnedToday, weeklyStars, history, onToggleTask, onFinishDay }) {
  return (
    <div className="dashboard-grid">
      <ProgressCard completion={completion} completed={completedCount} total={tasks.length} />
      <ChestCard stars={earnedToday} />
      <MotivationCard />
      <RewardsMini rewards={rewards} totalStars={profile.totalStars} />
      <TaskMini tasks={tasks} onToggle={onToggleTask} />
      <GamesMini />
      <MapMini />
      <WeeklySummary history={history} weeklyStars={weeklyStars} />
      <FeatureStrip />
      <div className="action-banner">
        <span>🏆</span>
        <div><b>Elif Lina ile her gün daha iyiye!</b><small>Görevleri tamamla, yıldızları topla, ödülleri kazan.</small></div>
        <button onClick={onFinishDay}>Bugünü Kaydet</button>
      </div>
    </div>
  );
}

function ProgressCard({ completion, completed, total }) {
  return <Card title="Bugünkü İlerlemen" className="progress-card"><div className="ring" style={{ '--p': `${completion}%` }}><b>{completion}%</b></div><div><h3>{completed} / {total} görev</h3><p>tamamlandı</p><div className="small-bar"><span style={{ width: `${completion}%` }} /></div></div></Card>;
}
function ChestCard({ stars }) { return <Card title="Sürpriz Kutu"><div className="chest-row"><span className="big-emoji">🧰</span><div><b>{Math.min(30, 25 + stars)} / 30 yıldız</b><small>30 yıldız olduğunda sürpriz kutunu aç!</small><div className="small-bar"><span style={{ width: `${Math.min(100, ((25 + stars) / 30) * 100)}%` }} /></div></div></div></Card>; }
function MotivationCard() { return <Card title="Günlük Motivasyon"><div className="motivation"><span>🦄</span><b>Küçük adımlar, büyük değişimler yaratır! 🌈</b></div></Card>; }

function TaskMini({ tasks, onToggle }) {
  return <Card title="Bugünkü Görevlerin" className="task-mini"><TaskList tasks={tasks.slice(0, 5)} onToggle={onToggle} /><button className="purple-btn">Tüm Görevleri Gör</button></Card>;
}

function TaskPage({ tasks, onToggleTask, earnedToday }) {
  return (
    <section className="page-card">
      <PageHeader title="Bugünkü Görevler" subtitle="Görevlerini tamamla, yıldızları topla." />
      <TaskList tasks={tasks} onToggle={onToggleTask} big />
      <div className="task-total"><span>⭐</span> Günün Toplamı: <b>{earnedToday} yıldız</b></div>
    </section>
  );
}

function TaskList({ tasks, onToggle, big = false }) {
  return <div className={big ? 'task-list big' : 'task-list'}>{tasks.map((task) => <button key={task.id} className={task.completed ? 'task-row completed' : 'task-row'} onClick={() => onToggle(task.id)}><span className="task-icon">{task.icon}</span><b>{task.title}</b><small>+{task.points} ⭐</small><em>{task.completed ? '✓' : ''}</em></button>)}</div>;
}

function GamesMini() { return <Card title="Mini Oyunlar" action="Tümünü Gör"><div className="games-grid mini"><GameCard title="Eşleştirme" icon="🐼" /><GameCard title="Yıldız Toplama" icon="⭐" /><GameCard title="Balon Patlatma" icon="🎈" /><GameCard title="Kelime Bulmaca" icon="🔤" /></div></Card>; }
function GamesPage() { return <section className="page-card"><PageHeader title="Mini Oyunlar" subtitle="Görevleri tamamladıkça oyun hakkı kazan." /><div className="games-grid"><GameCard title="Eşleştirme Oyunu" icon="🐼" text="Kartları eşleştir" /><GameCard title="Yıldız Toplama" icon="⭐" text="Yıldızları topla" /><GameCard title="Balon Patlatma" icon="🎈" text="Puanlı balonları patlat" /><GameCard title="Kelime Bulmaca" icon="🔤" text="Kelimeyi bul" /></div></section>; }
function GameCard({ title, icon, text = 'Oyna ve yıldız kazan' }) { return <div className="game-card"><span>{icon}</span><b>{title}</b><small>{text}</small><button>Oyna</button></div>; }

function MapMini() { return <Card title="Macera Haritası" action="Tümünü Gör"><AdventureMap compact /></Card>; }
function AdventureMap({ compact = false }) { return <section className={compact ? 'map-card compact' : 'page-card map-full'}><div className="map-scene"><div className="castle">🏰</div><div className="river">〰️</div>{[1,2,3,4,5].map((n,i)=><div key={n} className={`map-node n${n}`}>{n}</div>)}<div className="treasure">🧰</div></div><div className="map-footer"><b>Seviye 5: Harika!</b><small>Sonraki hedef: 6. seviye</small><div className="small-bar"><span style={{ width: '64%' }} /></div></div></section>; }

function BadgesPage({ profile }) { return <section className="page-card"><PageHeader title="Rozetler ve Başarılar" subtitle="Açılan başarıların burada görünür." /><div className="badges-grid">{badgeCatalog.map((badge) => <div key={badge.title} className={badge.unlocked ? 'badge-card' : 'badge-card locked'}><span>{badge.icon}</span><b>{badge.title}</b><small>{badge.condition}</small></div>)}</div></section>; }

function RewardsMini({ rewards, totalStars }) { return <Card title="Ödüller Dükkanı" action="Tümünü Gör"><div className="reward-list mini">{rewards.slice(0,5).map((r) => <div key={r.id}><span>{r.icon}</span><b>{r.title}</b><small>{r.stars} ⭐</small></div>)}</div></Card>; }
function RewardsPage({ rewards, totalStars }) { return <section className="page-card"><PageHeader title="Ödüller Dükkanı" subtitle={`Mevcut yıldızın: ${totalStars}`} /><div className="reward-list">{rewards.map((r) => <div key={r.id} className="reward-row"><span>{r.icon}</span><b>{r.title}</b><small>{r.stars} yıldız</small><button disabled={totalStars < r.stars}>{totalStars >= r.stars ? 'Al' : 'Kilitli'}</button></div>)}</div></section>; }

function WeeklySummary({ history, weeklyStars }) { return <Card title="Haftalık Özet"><div className="week-dots">{history.slice(-7).map((d) => <div key={d.date}><span>⭐</span><b>{d.stars}</b><small>{d.date.slice(5)}</small></div>)}</div><div className="weekly-total"><b>{weeklyStars} ⭐</b><small>haftalık toplam</small></div></Card>; }
function WeeklyPage({ history, weeklyStars }) { return <section className="page-card"><PageHeader title="Haftalık Takip" subtitle="Son 7 gün performansı" /><WeeklySummary history={history} weeklyStars={weeklyStars} /><Chart history={history.slice(-7)} /></section>; }

function ChildProfile({ profile, completedCount }) { return <section className="page-card profile-page"><div className="profile-avatar">👧🏻</div><h2>{profile.childName}</h2><p>Seviye {profile.level}</p><div className="profile-stats"><StatPill icon="⭐" label="Toplam Yıldız" value={profile.totalStars} /><StatPill icon="🔥" label="Günlük Seri" value={profile.streak} /><StatPill icon="✅" label="Bugünkü Görev" value={completedCount} /></div></section>; }

function ParentPanel(props) {
  const { activePage } = props;
  if (activePage === 'tasks') return <TaskManager {...props} />;
  if (activePage === 'rewards') return <RewardManager {...props} />;
  if (activePage === 'weekly') return <PerformancePage {...props} />;
  if (activePage === 'profile') return <ProfileSettings {...props} />;
  if (activePage === 'settings') return <SettingsPage onFinishDay={props.onFinishDay} />;
  return <ParentDashboard {...props} />;
}

function ParentDashboard({ tasks, rewards, profile, completion, completedCount, earnedToday, weeklyStars, history }) {
  return <div className="parent-grid"><Kpi title="Toplam Görev" value={tasks.length} /><Kpi title="Tamamlanan" value={completedCount} /><Kpi title="Tamamlanma Oranı" value={`%${completion}`} /><Kpi title="Toplam Yıldız" value={profile.totalStars} /><Kpi title="Günlük Seri" value={`${profile.streak} gün`} /><div className="parent-card span-2"><h3>Son 7 Gün Performansı</h3><Chart history={history.slice(-7)} /></div><div className="parent-card"><h3>Görev Durumu</h3><ProgressCard completion={completion} completed={completedCount} total={tasks.length} /></div><div className="parent-card span-2"><h3>Aktif Ödüller</h3><div className="reward-list mini">{rewards.slice(0,5).map((r) => <div key={r.id}><span>{r.icon}</span><b>{r.title}</b><small>{r.stars} ⭐</small></div>)}</div></div></div>;
}

function TaskManager({ tasks, onSaveTask, onDeleteTask }) {
  const [editing, setEditing] = useState(null);
  return <section className="page-card"><PageHeader title="Görev Yönetimi" subtitle="Yeni görev ekle veya mevcut görevleri düzenle." /><TaskForm key={editing?.id || 'new'} initial={editing} onSubmit={(task) => { onSaveTask(task); setEditing(null); }} onCancel={() => setEditing(null)} /><DataTable rows={tasks} type="task" onEdit={setEditing} onDelete={onDeleteTask} /></section>;
}

function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { title: '', category: 'Eğitim', points: 2, icon: '📖', active: true, completed: false });
  return <form className="form-card" onSubmit={(e) => { e.preventDefault(); if (form.title.trim()) onSubmit({ ...form, points: Number(form.points) }); }}><h3>{initial ? 'Görev Düzenle' : 'Yeni Görev Ekle'}</h3><div className="form-grid"><input placeholder="Görev adı" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /><select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select><input type="number" min="1" max="20" value={form.points} onChange={(e) => setForm({...form, points: e.target.value})} /><select value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})}>{icons.map(i => <option key={i}>{i}</option>)}</select><label><input type="checkbox" checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} /> Aktif</label></div><div className="form-actions"><button className="purple-btn">Kaydet</button>{initial && <button type="button" onClick={onCancel} className="light-btn">İptal</button>}</div></form>;
}

function RewardManager({ rewards, onSaveReward, onDeleteReward }) {
  const [editing, setEditing] = useState(null);
  return <section className="page-card"><PageHeader title="Ödül Yönetimi" subtitle="Ödülleri ve gerekli yıldız değerlerini yönet." /><RewardForm key={editing?.id || 'new'} initial={editing} onSubmit={(reward) => { onSaveReward(reward); setEditing(null); }} onCancel={() => setEditing(null)} /><DataTable rows={rewards} type="reward" onEdit={setEditing} onDelete={onDeleteReward} /></section>;
}

function RewardForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { title: '', stars: 10, icon: '🎁', active: true });
  return <form className="form-card" onSubmit={(e) => { e.preventDefault(); if (form.title.trim()) onSubmit({ ...form, stars: Number(form.stars) }); }}><h3>{initial ? 'Ödül Düzenle' : 'Yeni Ödül Ekle'}</h3><div className="form-grid"><input placeholder="Ödül adı" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /><input type="number" min="1" value={form.stars} onChange={(e) => setForm({...form, stars: e.target.value})} /><select value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})}>{rewardIcons.map(i => <option key={i}>{i}</option>)}</select><label><input type="checkbox" checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} /> Aktif</label></div><div className="form-actions"><button className="purple-btn">Kaydet</button>{initial && <button type="button" onClick={onCancel} className="light-btn">İptal</button>}</div></form>;
}

function DataTable({ rows, type, onEdit, onDelete }) {
  return <div className="table-card"><table><thead><tr><th>Simge</th><th>Ad</th><th>{type === 'task' ? 'Kategori' : 'Yıldız'}</th><th>{type === 'task' ? 'Puan' : 'Durum'}</th><th>İşlem</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.icon}</td><td>{row.title}</td><td>{type === 'task' ? row.category : `${row.stars} ⭐`}</td><td>{type === 'task' ? `${row.points} ⭐` : (row.active ? 'Aktif' : 'Pasif')}</td><td><button onClick={() => onEdit(row)}>Düzenle</button><button className="danger" onClick={() => onDelete(row.id)}>Sil</button></td></tr>)}</tbody></table></div>;
}

function PerformancePage({ history, weeklyStars }) { return <section className="page-card"><PageHeader title="Performans Raporu" subtitle="Haftalık gelişim ve alışkanlık takibi." /><Chart history={history.slice(-14)} /><WeeklySummary history={history.slice(-7)} weeklyStars={weeklyStars} /></section>; }
function ProfileSettings({ profile, setProfile }) { return <section className="page-card"><PageHeader title="Çocuk Profili" subtitle="Profil bilgilerini düzenle." /><div className="form-card"><input value={profile.childName} onChange={(e) => setProfile({...profile, childName: e.target.value})} /><div className="profile-stats"><StatPill icon="⭐" label="Toplam Yıldız" value={profile.totalStars} /><StatPill icon="🛡️" label="Seviye" value={profile.level} /><StatPill icon="🔥" label="Seri" value={profile.streak} /></div></div></section>; }
function SettingsPage({ onFinishDay }) { return <section className="page-card"><PageHeader title="Ayarlar" subtitle="Hızlı ayarlar ve günlük işlem." /><div className="settings-list"><label>Günlük Yıldız Limiti <input defaultValue="50" /></label><label>Sürpriz Kutu Eşiği <input defaultValue="30" /></label><label><input type="checkbox" defaultChecked /> Günlük Hatırlatma</label><label><input type="checkbox" defaultChecked /> Motivasyon Mesajları</label><button onClick={onFinishDay} className="purple-btn">Bugünü Kaydet ve Yeni Güne Başla</button></div></section>; }

function Chart({ history }) {
  const max = Math.max(1, ...history.map(h => h.stars));
  return <div className="chart">{history.map((h) => <div key={h.date} className="bar-col"><div className="bar" style={{ height: `${(h.stars / max) * 130}px` }} /><b>{h.stars}</b><small>{h.date.slice(5)}</small></div>)}</div>;
}

function FeatureStrip() { const features = [['🛡️','Sorumluluk Bilinci','Görevleri tamamla, alışkanlık kazan.'],['⭐','Motivasyon Artar','Yıldız ve ödüllerle motivasyon yükselir.'],['🎮','Eğlenceli Öğrenme','Oyunlarla öğrenmek daha keyifli.'],['⏰','Zaman Yönetimi','Planlı olmayı öğrenir.'],['🏆','Özgüven Gelişimi','Başardıkça kendine güvenir.'],['👨‍👩‍👧','Aile Bağı Güçlenir','Birlikte takip edin.']]; return <div className="feature-strip">{features.map(([i,t,x]) => <Benefit key={t} icon={i} title={t} text={x} />)}</div>; }

function Card({ title, action, className = '', children }) { return <section className={`card ${className}`}><div className="card-head"><h2>{title}</h2>{action && <button>{action}</button>}</div>{children}</section>; }
function PageHeader({ title, subtitle }) { return <div className="page-header"><div><h2>{title}</h2><p>{subtitle}</p></div></div>; }
function Kpi({ title, value }) { return <div className="kpi"><small>{title}</small><b>{value}</b></div>; }

createRoot(document.getElementById('root')).render(<App />);
