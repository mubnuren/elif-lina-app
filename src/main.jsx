import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home,
  CheckSquare,
  Gamepad2,
  Map,
  Trophy,
  Gift,
  CalendarDays,
  User,
  Settings,
  LogOut,
  Bell,
  Star,
  Crown,
  Flame,
  ShieldCheck,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Save,
  Users,
  Lock,
  BookOpen,
  Clock,
  Heart,
  Sparkles,
  ChevronRight,
  Download,
  Menu,
  X,
} from 'lucide-react';
import './styles.css';

const defaultTasks = [
  { id: 1, title: '15 dk kitap okudun mu?', category: 'Eğitim', points: 2, icon: '📖', done: true, period: 'Her gün' },
  { id: 2, title: 'Ödevlerini yaptın mı?', category: 'Eğitim', points: 3, icon: '✏️', done: true, period: 'Her gün' },
  { id: 3, title: 'Yatağını topladın mı?', category: 'Düzen', points: 2, icon: '🛏️', done: true, period: 'Her gün' },
  { id: 4, title: 'Dişlerini fırçaladın mı?', category: 'Kişisel Bakım', points: 1, icon: '🦷', done: true, period: 'Her gün' },
  { id: 5, title: 'Oyuncaklarını topladın mı?', category: 'Düzen', points: 2, icon: '🧸', done: false, period: 'Her gün' },
];

const rewardList = [
  { id: 1, title: 'Küçük Sürpriz', stars: 10, icon: '🎁', status: 'Açık' },
  { id: 2, title: 'Dondurma Günü', stars: 20, icon: '🍦', status: 'Açık' },
  { id: 3, title: 'Oyun Saati Bonusu', stars: 30, icon: '🎮', status: 'Açık' },
  { id: 4, title: 'Sinema Günü', stars: 50, icon: '🎬', status: 'Açık' },
  { id: 5, title: 'Büyük Ödül', stars: 100, icon: '🎀', status: 'Kilitli' },
];

const week = [
  { day: 'Pzt', date: '19/05', score: 14 },
  { day: 'Sal', date: '20/05', score: 18 },
  { day: 'Çar', date: '21/05', score: 12 },
  { day: 'Per', date: '22/05', score: 20 },
  { day: 'Cum', date: '23/05', score: 21 },
  { day: 'Cmt', date: '24/05', score: 8 },
  { day: 'Paz', date: '25/05', score: 10 },
];

const miniGames = [
  { title: 'Eşleştirme', desc: 'Hafıza kartlarını bul', icon: '🐼', plus: '+2', color: 'cyan' },
  { title: 'Yıldız Toplama', desc: 'Uzayda yıldız yakala', icon: '⭐', plus: '+3', color: 'purple' },
  { title: 'Balon Patlatma', desc: 'Puanlı balonları patlat', icon: '🎈', plus: '+1', color: 'teal' },
  { title: 'Kelime Bulmaca', desc: 'Yeni kelimeler öğren', icon: 'abc', plus: '+2', color: 'blue' },
];

const badges = [
  { name: 'Kitap Kurdu', text: '15 gün kitap okuma', icon: '📚', open: true },
  { name: 'Süper Yardımcı', text: '20 görev tamamlama', icon: '🖐️', open: true },
  { name: 'Düzen Şampiyonu', text: 'Yatağını 15 gün toplama', icon: '🛏️', open: true },
  { name: '3 Gün Seri', text: '3 gün üst üste görevleri bitir', icon: '🥉', open: true },
  { name: '7 Gün Seri', text: '7 gün üst üste görevleri bitir', icon: '🏅', open: true },
  { name: '30 Yıldız Kulübü', text: '30 yıldız topla', icon: '🔒', open: false },
];

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  });
  const save = (next) => {
    const nextValue = typeof next === 'function' ? next(value) : next;
    setValue(nextValue);
    try { localStorage.setItem(key, JSON.stringify(nextValue)); } catch {}
  };
  return [value, save];
}

function Character({ size = 'big' }) {
  return (
    <div className={`character character-${size}`}>
      <div className="hair hair-left" />
      <div className="hair hair-right" />
      <div className="bow"><span /> <span /></div>
      <div className="face">
        <div className="eye left" /><div className="eye right" />
        <div className="cheek left" /><div className="cheek right" />
        <div className="smile" />
      </div>
      <div className="body"><Star size={18} fill="currentColor" /></div>
    </div>
  );
}

function ProgressCircle({ value, label }) {
  return (
    <div className="progress-circle" style={{ '--p': `${value * 3.6}deg` }}>
      <div className="progress-inner"><strong>{value}%</strong><span>{label}</span></div>
    </div>
  );
}

function Sidebar({ mode, setMode, active, setActive, onLogout }) {
  const items = [
    ['home', 'Ana Sayfa', Home],
    ['tasks', 'Görevler', CheckSquare],
    ['games', 'Mini Oyunlar', Gamepad2],
    ['map', 'Macera Haritası', Map],
    ['badges', 'Rozetler', Trophy],
    ['rewards', 'Ödüller', Gift],
    ['week', 'Haftalık Takip', CalendarDays],
    ['profile', 'Profilim', User],
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-title">Elif Lina</div>
        <div className="brand-sub">Günlük Sorumluluk</div>
      </div>
      <div className="avatar-card"><Character size="medium" /></div>
      <div className="mode-toggle">
        <button className={mode === 'child' ? 'active' : ''} onClick={() => setMode('child')}>Çocuk</button>
        <button className={mode === 'parent' ? 'active' : ''} onClick={() => setMode('parent')}>Ebeveyn</button>
      </div>
      <nav className="side-nav">
        {items.map(([id, text, Icon]) => (
          <button key={id} onClick={() => setActive(id)} className={active === id ? 'active' : ''}>
            <Icon size={18} /> <span>{text}</span>
          </button>
        ))}
      </nav>
      <div className="daily-target">
        <Star fill="currentColor" />
        <strong>Günlük hedef</strong>
        <span>125 yıldız toplandı</span>
        <button onClick={onLogout}>Çıkış Yap</button>
      </div>
    </aside>
  );
}

function TopBar({ stats, mode, setMode }) {
  return (
    <header className="topbar">
      <div>
        <h1>Merhaba Elif Lina! 👋</h1>
        <p>Bugün harika işler seni bekliyor.</p>
      </div>
      <div className="top-actions">
        <span className="version">V2.0 Exact</span>
        <div className="mini-stat"><Star fill="currentColor" size={18}/><strong>{stats.total}</strong><span>Toplam</span></div>
        <div className="mini-stat"><ShieldCheck size={18}/><strong>4</strong><span>Seviye</span></div>
        <div className="mini-stat"><Flame fill="currentColor" size={18}/><strong>7</strong><span>Seri</span></div>
        <button className="bell"><Bell size={18}/><b>3</b></button>
        <select value={mode} onChange={(e)=>setMode(e.target.value)}>
          <option value="child">Çocuk Paneli</option>
          <option value="parent">Ebeveyn Paneli</option>
        </select>
      </div>
    </header>
  );
}

function Hero({ stats }) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="pill">Bugünün macerası başladı ✨</span>
        <h2>Merhaba Elif Lina! Bugün yıldızları toplamaya hazır mısın?</h2>
        <p>Görevlerini tamamla, macera haritasında ilerle ve sürpriz kutuya bir adım daha yaklaş.</p>
        <div className="hero-buttons"><button>Görevlerime Git</button><button className="ghost">Haritayı Aç</button></div>
      </div>
      <div className="hero-character">
        <Character size="large" />
        <div className="floating-score score-a"><Star fill="currentColor"/> {stats.progress}%<span>İlerleme</span></div>
        <div className="floating-score score-b">{stats.done}/5<span>Görev</span></div>
        <div className="floating-score score-c">+{stats.today}<span>Yıldız</span></div>
      </div>
    </section>
  );
}

function TaskList({ tasks, setTasks, compact = false }) {
  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  return (
    <div className={`task-list ${compact ? 'compact' : ''}`}>
      {tasks.map(task => (
        <button key={task.id} className={`task-row ${task.done ? 'done' : ''}`} onClick={() => toggle(task.id)}>
          <span className="task-icon">{task.icon}</span>
          <span className="task-body"><b>{task.title}</b><small>{task.category}</small></span>
          <span className="task-points">+{task.points} ⭐</span>
          <span className="task-check">{task.done ? '✓' : ''}</span>
        </button>
      ))}
    </div>
  );
}

function Card({ title, action, children, className = '' }) {
  return <section className={`card ${className}`}><div className="card-head"><h3>{title}</h3>{action && <button>{action}</button>}</div>{children}</section>;
}

function RewardsCard() {
  return (
    <Card title="Ödüller Dükkanı" action="Tümünü Gör" className="rewards-card">
      {rewardList.map(r => <div className="reward-row" key={r.id}><span>{r.icon}</span><b>{r.title}</b><em>{r.stars} ⭐</em></div>)}
    </Card>
  );
}

function MiniGames() {
  return (
    <Card title="Mini Oyunlar" action="Tümünü Gör" className="games-card">
      <div className="game-grid">
        {miniGames.map(g => <div className={`game-card ${g.color}`} key={g.title}><span className="spark">✦</span><div className="game-icon">{g.icon}</div><b>{g.title}</b><small>{g.desc}</small><button>Oyna</button><em>{g.plus}⭐</em></div>)}
      </div>
    </Card>
  );
}

function AdventureMap() {
  return (
    <Card title="Macera Haritası" action="Tümünü Gör" className="map-card">
      <div className="map-world">
        <div className="mountain">⛰️</div>
        <div className="castle">🏰</div>
        <div className="treasure">🎁</div>
        <svg viewBox="0 0 600 250" className="path-svg" preserveAspectRatio="none">
          <path d="M50 180 C120 100 190 210 260 145 C335 80 380 210 455 125 C510 70 540 90 570 55" />
        </svg>
        {[1,2,3,4,5].map((n,i)=><div key={n} className={`level-dot dot-${n}`}>{n}</div>)}
      </div>
      <div className="map-footer"><b>Seviye 5: Harika!</b><span>Sonraki hedef: 6. seviye</span><div><i style={{width:'62%'}} /></div></div>
    </Card>
  );
}

function WeeklySummary() {
  const total = week.reduce((a,b)=>a+b.score,0);
  return (
    <Card title="Haftalık Özet" action="Tümünü Gör" className="week-card">
      <div className="week-grid">{week.map(d=><div className="day" key={d.day}><Star size={18} fill="currentColor"/><b>{d.score}</b><small>{d.date}</small></div>)}</div>
      <div className="week-total"><strong>{total} ⭐</strong><span>haftalık toplam</span></div>
    </Card>
  );
}

function ChildHome({ tasks, setTasks }) {
  const stats = useMemo(() => {
    const done = tasks.filter(t=>t.done).length;
    const today = tasks.filter(t=>t.done).reduce((s,t)=>s+t.points,0);
    return { done, today, progress: Math.round((done/tasks.length)*100), total: 125 + today };
  }, [tasks]);
  return (
    <>
      <TopBar stats={stats} mode="child" setMode={()=>{}} />
      <Hero stats={stats} />
      <main className="dashboard-grid exact-grid">
        <Card title="Bugünkü İlerlemen" className="progress-card"><ProgressCircle value={stats.progress} label="İlerleme"/><div className="progress-text"><b>{stats.done} / 5 görev</b><span>tamamlandı</span></div></Card>
        <Card title="Sürpriz Kutu" className="chest-card"><div className="chest-icon">💼</div><strong>25 / 30 yıldız</strong><div className="bar"><i style={{width:'84%'}} /></div><small>30 yıldız olduğunda kutunu aç!</small></Card>
        <Card title="Günlük Motivasyon" className="motivation-card"><div className="unicorn">🦄</div><p>Küçük adımlar, büyük değişimler yaratır! 🌈</p></Card>
        <RewardsCard />
        <Card title="Bugünkü Görevlerin" action="Tümünü Gör" className="tasks-card"><TaskList tasks={tasks} setTasks={setTasks} /><div className="task-actions"><button>Tüm Görevleri Gör</button><button className="save-btn"><Save size={16}/> Kaydet</button></div></Card>
        <MiniGames />
        <AdventureMap />
        <WeeklySummary />
      </main>
      <Benefits />
      <BottomBanner />
    </>
  );
}

function Benefits() {
  const benefits = [
    ['🛡️','Sorumluluk Bilinci','Görevleri tamamla, alışkanlık kazan.'],
    ['⭐','Motivasyon Artar','Yıldız ve ödüllerle motivasyon yükselir.'],
    ['🎮','Eğlenceli Öğrenme','Oyunlarla öğrenmek daha keyifli.'],
    ['⏰','Zaman Yönetimi','Planlı olmayı öğrenir.'],
    ['🏆','Özgüven Gelişimi','Başardıkça kendine güvenir.'],
    ['👨‍👩‍👧','Aile Bağı Güçlenir','Birlikte takip edin.'],
  ];
  return <div className="benefits">{benefits.map(b=><div key={b[1]}><span>{b[0]}</span><b>{b[1]}</b><small>{b[2]}</small></div>)}</div>;
}

function BottomBanner() {
  return <div className="bottom-banner"><div><Trophy fill="currentColor"/><b>Elif Lina ile her gün daha iyiye!</b><span>Görevleri tamamla, yıldızlarını topla, ödülleri kazan.</span></div><button>Bugünü Kaydet</button></div>;
}

function FullScreen({ active, tasks, setTasks }) {
  if (active === 'tasks') return <Page title="Görevler"><TaskList tasks={tasks} setTasks={setTasks}/></Page>;
  if (active === 'games') return <Page title="Mini Oyunlar"><MiniGames /></Page>;
  if (active === 'map') return <Page title="Macera Haritası"><AdventureMap /></Page>;
  if (active === 'badges') return <Page title="Rozetler"><div className="badges-grid">{badges.map(b=><div className={`badge ${b.open?'':'locked'}`} key={b.name}><span>{b.icon}</span><b>{b.name}</b><small>{b.text}</small>{b.open ? <em>✓</em> : <Lock size={20}/>}</div>)}</div></Page>;
  if (active === 'rewards') return <Page title="Ödüller Dükkanı"><RewardsCard /></Page>;
  if (active === 'week') return <Page title="Haftalık Takip"><WeeklySummary /></Page>;
  if (active === 'profile') return <Page title="Profilim"><Profile /></Page>;
  return null;
}

function Page({ title, children }) { return <><TopBar stats={{total:125, progress:80, done:4, today:8}} mode="child" setMode={()=>{}}/><div className="page-panel"><h2>{title}</h2>{children}</div></>; }

function Profile() {
  return <div className="profile-card"><Character size="large"/><h3>Elif Lina</h3><span>Seviye 4</span><div className="bar"><i style={{width:'64%'}} /></div><p>Toplam Yıldız: 125</p><p>Günlük Seri: 7 gün</p><p>Açılan Rozet: 12</p></div>;
}

function ParentPanel({ tasks, setTasks }) {
  const done = tasks.filter(t=>t.done).length;
  const [title, setTitle] = useState('');
  const add = () => { if(!title.trim()) return; setTasks([...tasks, { id: Date.now(), title, category:'Eğitim', points:2, icon:'📌', done:false, period:'Her gün'}]); setTitle(''); };
  const remove = id => setTasks(tasks.filter(t=>t.id!==id));
  return (
    <>
      <header className="parent-header"><div><Users/> <h1>Ebeveyn Yönetim Paneli</h1><p>Görev, ödül, performans ve rapor yönetimi</p></div><button><Download size={16}/> Raporu İndir</button></header>
      <div className="parent-stats">
        <div><b>{tasks.length}</b><span>Toplam Görev</span></div>
        <div><b>{done}</b><span>Tamamlanan</span></div>
        <div><b>%{Math.round(done/tasks.length*100)}</b><span>Tamamlanma</span></div>
        <div><b>125</b><span>Toplam Yıldız</span></div>
        <div><b>7</b><span>Günlük Seri</span></div>
      </div>
      <div className="parent-grid">
        <section className="admin-card wide"><h3>Son 7 Gün Performansı</h3><div className="chart">{week.map(d=><div key={d.day}><span style={{height:`${d.score*4}px`}}/><small>{d.day}</small></div>)}</div></section>
        <section className="admin-card"><h3>Görev Durumu</h3><ProgressCircle value={Math.round(done/tasks.length*100)} label="Tamam"/><p>{done} tamamlanan, {tasks.length-done} bekleyen</p></section>
        <section className="admin-card wide"><div className="admin-head"><h3>Görev Yönetimi</h3><button onClick={add}><Plus size={16}/> Yeni Görev Ekle</button></div><div className="add-line"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Yeni görev adı"/><button onClick={add}>Ekle</button></div><table><thead><tr><th>Görev Adı</th><th>Kategori</th><th>Puan</th><th>Aktif</th><th>İşlem</th></tr></thead><tbody>{tasks.map(t=><tr key={t.id}><td>{t.icon} {t.title}</td><td>{t.category}</td><td>{t.points}</td><td><span className="switch on" /></td><td><Edit3 size={16}/><button className="icon-btn" onClick={()=>remove(t.id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table></section>
        <section className="admin-card"><h3>Ödül Yönetimi</h3>{rewardList.map(r=><div className="admin-reward" key={r.id}><span>{r.icon}</span><b>{r.title}</b><em>{r.stars}⭐</em></div>)}<button className="full-btn">+ Yeni Ödül Ekle</button></section>
        <section className="admin-card"><h3>Hızlı Ayarlar</h3>{['Günlük Yıldız Limiti 50','Sürpriz Kutu Eşiği 30','Motivasyon Mesajları Açık','Haftalık Rapor e-posta'].map(x=><div className="setting-line" key={x}><span>{x}</span><span className="switch on"/></div>)}<button className="full-btn">Kaydet</button></section>
      </div>
    </>
  );
}

function Login({ onLogin }) {
  return <div className="login-page"><div className="login-left"><div className="logo-xl">Elif Lina</div><p>Günlük Sorumluluk + Oyunlaştırma Programı</p><Character size="xl"/><button onClick={()=>onLogin('child')}>Çocuk Girişi <ChevronRight size={18}/></button><button className="white" onClick={()=>onLogin('parent')}>Ebeveyn Girişi <ChevronRight size={18}/></button><button className="demo" onClick={()=>onLogin('child')}>Demo Olarak Dene</button></div><div className="login-right"><h2>Hoş Geldin! 👋</h2><p>Devam etmek için profil seç.</p>{['Elif Lina','Ali Efe','Zeynep'].map((p,i)=><button className={i===0?'selected':''} key={p}><Character size="tiny"/> <b>{p}</b><span>{i===0?'Seviye 4':'Örnek profil'}</span></button>)}<button className="add-profile">+ Yeni Profil Ekle</button><button className="start" onClick={()=>onLogin('child')}>Elif Lina ile Başla</button></div></div>
}

function App() {
  const [mode, setMode] = useStoredState('elif-v2-mode', 'child');
  const [logged, setLogged] = useStoredState('elif-v2-logged', true);
  const [active, setActive] = useState('home');
  const [tasks, setTasks] = useStoredState('elif-v2-tasks', defaultTasks);
  const [mobileNav, setMobileNav] = useState(false);

  if (!logged) return <Login onLogin={(m)=>{ setMode(m); setLogged(true); }} />;

  return (
    <div className="app-shell">
      <button className="mobile-menu" onClick={()=>setMobileNav(true)}><Menu /></button>
      <div className={mobileNav ? 'mobile-shade show' : 'mobile-shade'} onClick={()=>setMobileNav(false)} />
      <div className={mobileNav ? 'sidebar-wrap show' : 'sidebar-wrap'}><button className="close-mobile" onClick={()=>setMobileNav(false)}><X/></button><Sidebar mode={mode} setMode={setMode} active={active} setActive={(id)=>{setActive(id); setMobileNav(false)}} onLogout={()=>setLogged(false)} /></div>
      <main className="content-area">
        {mode === 'parent' ? <ParentPanel tasks={tasks} setTasks={setTasks}/> : active === 'home' ? <ChildHome tasks={tasks} setTasks={setTasks}/> : <FullScreen active={active} tasks={tasks} setTasks={setTasks}/>} 
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
