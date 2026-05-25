import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const nowDate = () => new Date().toISOString().slice(0, 10);
const trDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

const defaultTasks = [
  { id: 1, title: '15 dk kitap okudun mu?', category: 'Eğitim', points: 2, icon: '📚', done: true, active: true, repeat: 'Her gün' },
  { id: 2, title: 'Ödevlerini yaptın mı?', category: 'Eğitim', points: 3, icon: '✏️', done: true, active: true, repeat: 'Her gün' },
  { id: 3, title: 'Yatağını topladın mı?', category: 'Düzen', points: 2, icon: '🛏️', done: true, active: true, repeat: 'Her gün' },
  { id: 4, title: 'Dişlerini fırçaladın mı?', category: 'Bakım', points: 1, icon: '🦷', done: true, active: true, repeat: 'Sabah/Akşam' },
  { id: 5, title: 'Oyuncaklarını topladın mı?', category: 'Düzen', points: 2, icon: '🧸', done: false, active: true, repeat: 'Her gün' }
];
const defaultRewards = [
  { id: 1, title: 'Küçük Sürpriz', stars: 10, icon: '🎁', stock: 'Sınırsız', active: true },
  { id: 2, title: 'Dondurma Günü', stars: 20, icon: '🍦', stock: '2 adet', active: true },
  { id: 3, title: 'Oyun Saati Bonusu', stars: 30, icon: '🎮', stock: 'Sınırsız', active: true },
  { id: 4, title: 'Sinema Günü', stars: 50, icon: '🎬', stock: '1 adet', active: true },
  { id: 5, title: 'Büyük Ödül', stars: 100, icon: '👑', stock: '1 adet', active: true }
];
const defaultHistory = [
  { date: '2026-05-20', stars: 18, completed: 4, total: 5 },
  { date: '2026-05-21', stars: 12, completed: 3, total: 5 },
  { date: '2026-05-22', stars: 20, completed: 5, total: 5 },
  { date: '2026-05-23', stars: 21, completed: 5, total: 5 },
  { date: '2026-05-24', stars: 8, completed: 2, total: 5 },
  { date: '2026-05-25', stars: 10, completed: 4, total: 5 },
  { date: nowDate(), stars: 0, completed: 0, total: 5 }
];
const games = [
  { title: 'Eşleştirme', sub: 'Hafıza kartlarını bul', icon: '🐼', color: 'turq', reward: '+2' },
  { title: 'Yıldız Toplama', sub: 'Uzayda yıldız yakala', icon: '⭐', color: 'violet', reward: '+3' },
  { title: 'Balon Patlatma', sub: 'Puanlı balonları patlat', icon: '🎈', color: 'sky', reward: '+1' },
  { title: 'Kelime Bulmaca', sub: 'Yeni kelimeler öğren', icon: '🔤', color: 'blue', reward: '+2' }
];
const badges = [
  { icon: '📖', title: 'Kitap Kurdu', sub: '15 gün okuma', open: true },
  { icon: '🙌', title: 'Süper Yardımcı', sub: '20 görev', open: true },
  { icon: '🛏️', title: 'Düzen Şampiyonu', sub: 'Yatak rutini', open: true },
  { icon: '🔥', title: '7 Gün Seri', sub: 'Seriyi koru', open: true },
  { icon: '🔒', title: '30 Yıldız Kulübü', sub: 'Kilidi aç', open: false }
];

function useLocal(key, initial) {
  const [value, setValue] = useState(() => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

function Avatar({ big=false, mini=false }) {
  return <div className={`avatar ${big?'big':''} ${mini?'mini':''}`}><div className="bow">🎀</div><div className="face">👧🏻</div><div className="star-medal">⭐</div></div>;
}
function Ring({ value }) { return <div className="ring" style={{'--p': `${value}%`}}><b>{value}%</b></div>; }
function Button({children, kind='primary', onClick, type='button'}) { return <button type={type} onClick={onClick} className={`btn ${kind}`}>{children}</button>; }

function App() {
  const [tasks, setTasks] = useLocal('elif-v13-tasks', defaultTasks);
  const [rewards, setRewards] = useLocal('elif-v13-rewards', defaultRewards);
  const [history, setHistory] = useLocal('elif-v13-history', defaultHistory);
  const [profile, setProfile] = useLocal('elif-v13-profile', { name:'Elif Lina', totalStars:125, level:4, xp:320, xpMax:500, streak:7, chest:25, chestMax:30, theme:'Mor/Pembe' });
  const [session, setSession] = useLocal('elif-v13-session', { logged:false, role:'child' });
  const [page, setPage] = useState('home');
  const activeTasks = tasks.filter(t => t.active);
  const doneTasks = activeTasks.filter(t => t.done);
  const earned = doneTasks.reduce((s,t)=>s+Number(t.points||0),0);
  const completion = pct(doneTasks.length, activeTasks.length);
  const week = history.slice(-7);
  const weeklyStars = week.reduce((s,h)=>s+Number(h.stars||0),0);

  const toggleTask = (id) => {
    const task = tasks.find(t=>t.id===id); if(!task) return;
    const delta = task.done ? -task.points : task.points;
    setTasks(list => list.map(t=> t.id===id ? {...t, done:!t.done} : t));
    setProfile(p => ({...p, totalStars:Math.max(0,p.totalStars+delta), xp:Math.max(0,p.xp+delta*10), chest:Math.min(p.chestMax, Math.max(0,p.chest+delta))}));
  };
  const finishDay = () => {
    const rec = {date:nowDate(), stars:earned, completed:doneTasks.length, total:activeTasks.length};
    setHistory(list => [...list.filter(x=>x.date!==rec.date), rec].slice(-30));
    setTasks(list => list.map(t=>({...t, done:false})));
    setProfile(p => ({...p, streak: completion===100 ? p.streak+1 : 0}));
    setPage('weekly');
  };

  if(!session.logged) return <Login onLogin={(role)=>setSession({logged:true, role})} />;
  return <div className="shell">
    <Sidebar role={session.role} setRole={(role)=>setSession({...session, role})} page={page} setPage={setPage} profile={profile} onLogout={()=>setSession({...session, logged:false})} />
    <main className="main">
      <Top profile={profile} role={session.role} setRole={(role)=>setSession({...session, role})} completion={completion} done={doneTasks.length} earned={earned} />
      {session.role==='child'
        ? <ChildDashboard page={page} setPage={setPage} tasks={activeTasks} rewards={rewards.filter(r=>r.active)} history={week} profile={profile} completion={completion} done={doneTasks.length} earned={earned} weeklyStars={weeklyStars} toggleTask={toggleTask} finishDay={finishDay} />
        : <ParentDashboard tasks={tasks} rewards={rewards} history={history} profile={profile} setProfile={setProfile} completion={completion} done={doneTasks.length} earned={earned} weeklyStars={weeklyStars} setTasks={setTasks} setRewards={setRewards} finishDay={finishDay} />}
    </main>
  </div>;
}

function Login({onLogin}) {
  return <div className="login">
    <section className="loginCard dark">
      <div className="sparkles">✦ ★ ✧ ★ ✦</div><h1>Elif Lina</h1><p>Günlük Sorumluluk + Oyunlaştırma Programı</p><Avatar big />
      <Button onClick={()=>onLogin('child')}>Çocuk Girişi →</Button><Button kind="white" onClick={()=>onLogin('parent')}>Ebeveyn Girişi →</Button>
      <div className="trust"><span>🛡️ Güvenli</span><span>⭐ Motive</span><span>🏆 Ödüllü</span></div>
    </section>
    <section className="loginCard select">
      <h2>Hoş Geldin! 👋</h2><p>Devam etmek için profil seç.</p>
      {['Elif Lina','Ali Efe','Zeynep'].map((n,i)=><div className={`profile ${i===0?'active':''}`} key={n}>{i===0?<Avatar mini />:<span className="profileEmoji">{i===1?'👦🏻':'👧🏽'}</span>}<b>{n}</b><small>{i===0?'Seviye 4':'Örnek profil'}</small><em>›</em></div>)}
      <Button kind="ghost">+ Yeni Profil Ekle</Button><Button onClick={()=>onLogin('child')}>Elif Lina ile Başla</Button>
    </section>
  </div>
}
function Sidebar({role,setRole,page,setPage,profile,onLogout}) {
  const items = [['home','🏠','Ana Sayfa'],['tasks','✅','Görevler'],['games','🎮','Mini Oyunlar'],['map','🗺️','Macera Haritası'],['badges','🏅','Rozetler'],['rewards','🎁','Ödüller'],['weekly','📅','Haftalık'],['profile','👤','Profilim']];
  return <aside className="side">
    <div className="logo"><h2>Elif Lina</h2><small>Günlük Sorumluluk</small><Avatar /></div>
    <div className="switch"><button className={role==='child'?'on':''} onClick={()=>setRole('child')}>Çocuk</button><button className={role==='parent'?'on':''} onClick={()=>setRole('parent')}>Ebeveyn</button></div>
    <nav>{items.map(([id,ic,txt])=><button key={id} className={page===id?'active':''} onClick={()=>setPage(id)}><span>{ic}</span>{txt}</button>)}</nav>
    <div className="goal"><b>⭐ Günlük hedef</b><small>{profile.totalStars} yıldız toplandı</small><button onClick={onLogout}>Çıkış Yap</button></div>
  </aside>
}
function Top({profile,role,setRole,completion,done,earned}) {
  return <header className="top"><div><h2>Merhaba {profile.name}! 👋</h2><p>Bugün harika işler seni bekliyor.</p></div><div className="topPills"><span className="version">V1.3 Ultra</span><Pill label="Toplam" value={profile.totalStars} icon="⭐"/><Pill label="Seviye" value={profile.level} icon="🛡️"/><Pill label="Seri" value={profile.streak} icon="🔥"/><Pill label="Bugün" value={`${done} / ${done+Math.max(0,5-done)}`} icon="✅"/><button className="roleBtn" onClick={()=>setRole(role==='child'?'parent':'child')}>{role==='child'?'Çocuk':'Ebeveyn'} Paneli⌄</button></div></header>
}
function Pill({icon,label,value}) { return <div className="pill"><span>{icon}</span><b>{value}</b><small>{label}</small></div> }

function ChildDashboard({page,setPage,tasks,rewards,history,profile,completion,done,earned,weeklyStars,toggleTask,finishDay}) {
  if(page==='tasks') return <Page title="Bugünkü Görevler"><TaskList tasks={tasks} toggleTask={toggleTask} full /><ActionBar finishDay={finishDay} /></Page>;
  if(page==='games') return <Page title="Mini Oyunlar"><Games full /></Page>;
  if(page==='map') return <Page title="Macera Haritası"><Adventure large profile={profile}/></Page>;
  if(page==='badges') return <Page title="Rozetler ve Başarılar"><Badges /></Page>;
  if(page==='rewards') return <Page title="Ödüller Dükkanı"><Rewards rewards={rewards} stars={profile.totalStars} /></Page>;
  if(page==='weekly') return <Page title="Haftalık Takip"><Weekly history={history} weeklyStars={weeklyStars} large /></Page>;
  if(page==='profile') return <Page title="Profilim"><Profile profile={profile} done={done} completion={completion}/></Page>;
  return <div className="dashboard">
    <Hero profile={profile} completion={completion} done={done} earned={earned} setPage={setPage}/>
    <ProgressCard completion={completion} done={done} total={tasks.length}/><Chest profile={profile}/><Motivation/><RewardsCompact rewards={rewards} stars={profile.totalStars}/>
    <TaskCard tasks={tasks} toggleTask={toggleTask} finishDay={finishDay}/><Games/><Adventure profile={profile}/><Weekly history={history} weeklyStars={weeklyStars}/>
    <FeatureStrip/><div className="banner"><span>🏆</span><div><b>Elif Lina ile her gün daha iyiye!</b><small>Görevleri tamamla, yıldızları topla, ödülleri kazan.</small></div><Button kind="white" onClick={finishDay}>Bugünü Kaydet</Button></div>
  </div>
}
function Hero({profile,completion,done,earned,setPage}) { return <section className="hero panel"><div><span className="tag">Bugünün macerası başladı ✨</span><h1>Merhaba {profile.name}! Bugün yıldızları toplamaya hazır mısın?</h1><p>Görevlerini tamamla, macera haritasında ilerle ve sürpriz kutuya bir adım daha yaklaş.</p><Button onClick={()=>setPage('tasks')}>Görevlerime Git</Button><Button kind="ghost" onClick={()=>setPage('map')}>Haritayı Aç</Button></div><div className="heroAvatar"><Avatar big/><div className="heroStats"><b>{completion}%</b><small>İlerleme</small><b>{done}/5</b><small>Görev</small><b>+{earned}</b><small>Yıldız</small></div></div></section> }
function ProgressCard({completion,done,total}) { return <section className="panel stat"><h3>Bugünkü İlerlemen</h3><Ring value={completion}/><h2>{done} / {total} görev</h2><p>tamamlandı</p></section> }
function Chest({profile}) { const v=pct(profile.chest,profile.chestMax); return <section className="panel chest"><h3>Sürpriz Kutu</h3><div className="bigIcon">🧰</div><b>{profile.chest} / {profile.chestMax} yıldız</b><div className="bar"><i style={{width:`${v}%`}} /></div><small>{profile.chestMax} yıldız olduğunda kutunu aç!</small></section> }
function Motivation(){ return <section className="panel motivation"><h3>Günlük Motivasyon</h3><div className="unicorn">🦄</div><h2>Küçük adımlar, büyük değişimler yaratır! 🌈</h2></section> }
function RewardsCompact({rewards,stars}){ return <section className="panel rewardCompact"><h3>Ödüller Dükkanı</h3>{rewards.map(r=><div className="rewardLine" key={r.id}><span>{r.icon}</span><b>{r.title}</b><em>{r.stars} ⭐</em></div>)}</section> }
function TaskCard({tasks,toggleTask,finishDay}){ return <section className="panel tasks"><div className="head"><h3>Bugünkü Görevlerin</h3><button>Tümünü Gör</button></div><TaskList tasks={tasks} toggleTask={toggleTask}/><div className="taskActions"><Button kind="wide">Tüm Görevleri Gör</Button><Button kind="soft" onClick={finishDay}>Kaydet</Button></div></section> }
function TaskList({tasks,toggleTask,full=false}){ return <div className={`taskList ${full?'full':''}`}>{tasks.map(t=><button key={t.id} className={`task ${t.done?'done':''}`} onClick={()=>toggleTask(t.id)}><span className="tIcon">{t.icon}</span><b>{t.title}</b><small>{t.category}</small><em>+{t.points} ⭐</em><i>{t.done?'✓':''}</i></button>)}</div> }
function Games({full=false}){ return <section className={`panel games ${full?'full':''}`}><div className="head"><h3>Mini Oyunlar</h3><button>Tümünü Gör</button></div><div className="gameGrid">{games.map(g=><div className={`game ${g.color}`} key={g.title}><span>{g.icon}</span><b>{g.title}</b><small>{g.sub}</small><button>Oyna</button><em>{g.reward} ⭐</em></div>)}</div></section> }
function Adventure({large=false,profile}) { return <section className={`panel adventure ${large?'large':''}`}><div className="head"><h3>Macera Haritası</h3><button>Tümünü Gör</button></div><div className="map"><span className="mount">⛰️</span><span className="castle">🏰</span><span className="sun">☀️</span><span className="tree t1">🌳</span><span className="tree t2">🌲</span><div className="path"></div>{[1,2,3,4,5].map((n,i)=><span className={`node n${n}`} key={n}>{n}</span>)}<span className="treasure">🎁</span></div><b>Seviye 5: Harika!</b><small>Sonraki hedef: 6. seviye</small><div className="bar"><i style={{width:`${pct(profile.xp,profile.xpMax)}%`}} /></div></section> }
function Weekly({history,weeklyStars,large=false}){ return <section className={`panel weekly ${large?'large':''}`}><div className="head"><h3>Haftalık Özet</h3><button>Tümünü Gör</button></div><div className="weekGrid">{history.map(h=><div key={h.date}><span>⭐</span><b>{h.stars}</b><small>{trDate(h.date)}</small></div>)}</div><h2>{weeklyStars} ⭐</h2><p>haftalık toplam</p></section> }
function Badges(){ return <div className="badges">{badges.map(b=><div className={`badge ${b.open?'':'locked'}`} key={b.title}><span>{b.icon}</span><b>{b.title}</b><small>{b.sub}</small></div>)}</div> }
function Rewards({rewards,stars}){ return <div className="rewardShop">{rewards.map(r=><div className="shopItem" key={r.id}><span>{r.icon}</span><div><b>{r.title}</b><small>{r.stars} yıldız · {r.stock}</small></div><button disabled={stars<r.stars}>{stars>=r.stars?'Al':'Kilitli'}</button></div>)}</div> }
function Profile({profile,done,completion}){ return <section className="panel profilePage"><Avatar big/><h2>{profile.name}</h2><p>Seviye {profile.level}</p><div className="profileStats"><Pill icon="⭐" label="Toplam" value={profile.totalStars}/><Pill icon="🔥" label="Seri" value={profile.streak}/><Pill icon="✅" label="Görev" value={done}/><Pill icon="📈" label="Başarı" value={`${completion}%`}/></div></section> }
function Page({title,children}){ return <section className="page"><h1>{title}</h1>{children}</section> }
function FeatureStrip(){ return <div className="features">{[['🛡️','Sorumluluk Bilinci','Görevleri tamamla, alışkanlık kazan.'],['⭐','Motivasyon Artar','Yıldız ve ödüllerle motivasyon yükselir.'],['🎮','Eğlenceli Öğrenme','Oyunlarla öğrenmek daha keyifli.'],['⏰','Zaman Yönetimi','Planlı olmayı öğrenir.'],['🏆','Özgüven Gelişimi','Başardıkça kendine güvenir.'],['👨‍👩‍👧','Aile Bağı Güçlenir','Birlikte takip edin.']].map(([i,t,s])=><div key={t}><span>{i}</span><b>{t}</b><small>{s}</small></div>)}</div> }
function ActionBar({finishDay}){ return <div className="actionBar"><Button onClick={finishDay}>Bugünü Kaydet</Button></div> }

function ParentDashboard({tasks,rewards,history,profile,setProfile,completion,done,earned,weeklyStars,setTasks,setRewards,finishDay}){
  const [taskDraft,setTaskDraft] = useState({title:'', category:'Eğitim', points:2, icon:'⭐', repeat:'Her gün'});
  const [rewardDraft,setRewardDraft] = useState({title:'', stars:10, icon:'🎁', stock:'Sınırsız'});
  const addTask = (e)=>{e.preventDefault(); if(!taskDraft.title.trim())return; setTasks([{id:Date.now(),...taskDraft, done:false, active:true},...tasks]); setTaskDraft({title:'', category:'Eğitim', points:2, icon:'⭐', repeat:'Her gün'});};
  const addReward = (e)=>{e.preventDefault(); if(!rewardDraft.title.trim())return; setRewards([{id:Date.now(),...rewardDraft, active:true},...rewards]); setRewardDraft({title:'', stars:10, icon:'🎁', stock:'Sınırsız'});};
  return <div className="parent">
    <section className="panel parentHero"><h1>Ebeveyn Yönetim Paneli</h1><p>Görevleri, ödülleri ve haftalık performansı tek yerden yönetin.</p></section>
    <section className="kpis"><Pill icon="✅" label="Tamamlanan" value={`${done}/${tasks.filter(t=>t.active).length}`}/><Pill icon="📈" label="Başarı" value={`${completion}%`}/><Pill icon="⭐" label="Bugünkü" value={earned}/><Pill icon="🔥" label="Seri" value={profile.streak}/></section>
    <section className="panel chart"><h3>Son 7 Gün Performansı</h3><div className="bars">{history.slice(-7).map(h=><div key={h.date}><i style={{height:`${Math.max(18,h.stars*3)}px`}}></i><small>{trDate(h.date)}</small></div>)}</div></section>
    <section className="panel donut"><h3>Görev Durumu</h3><Ring value={completion}/><p>{done} görev tamamlandı</p></section>
    <FormPanel title="Görev Ekle" onSubmit={addTask} draft={taskDraft} setDraft={setTaskDraft} type="task" />
    <section className="panel table"><h3>Görev Yönetimi</h3>{tasks.map(t=><div className="row" key={t.id}><span>{t.icon}</span><b>{t.title}</b><small>{t.category} · +{t.points}</small><button onClick={()=>setTasks(tasks.filter(x=>x.id!==t.id))}>Sil</button></div>)}</section>
    <FormPanel title="Ödül Ekle" onSubmit={addReward} draft={rewardDraft} setDraft={setRewardDraft} type="reward" />
    <section className="panel table"><h3>Ödül Yönetimi</h3>{rewards.map(r=><div className="row" key={r.id}><span>{r.icon}</span><b>{r.title}</b><small>{r.stars} yıldız</small><button onClick={()=>setRewards(rewards.filter(x=>x.id!==r.id))}>Sil</button></div>)}</section>
    <section className="panel settings"><h3>Hızlı Ayarlar</h3><label>Günlük Yıldız Limiti <input value="50" readOnly /></label><label>Sürpriz Kutu Eşiği <input value={profile.chestMax} onChange={e=>setProfile({...profile,chestMax:Number(e.target.value)||30})}/></label><Button onClick={finishDay}>Bugünü Kaydet</Button></section>
  </div>
}
function FormPanel({title,onSubmit,draft,setDraft,type}){ return <form className="panel form" onSubmit={onSubmit}><h3>{title}</h3><input placeholder={type==='task'?'Görev adı':'Ödül adı'} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/><div className="formLine"><input value={draft.icon} onChange={e=>setDraft({...draft,icon:e.target.value})}/>{type==='task'?<><select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}>{['Eğitim','Düzen','Bakım','Yardım','Spor','Manevi'].map(x=><option key={x}>{x}</option>)}</select><input type="number" value={draft.points} onChange={e=>setDraft({...draft,points:Number(e.target.value)||1})}/></>:<><input type="number" value={draft.stars} onChange={e=>setDraft({...draft,stars:Number(e.target.value)||10})}/><input value={draft.stock} onChange={e=>setDraft({...draft,stock:e.target.value})}/></>}</div><Button type="submit">Kaydet</Button></form> }

createRoot(document.getElementById('root')).render(<App />);
