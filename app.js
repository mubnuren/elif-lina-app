const tasks = [
  { icon: '📖', title: '15 dk kitap okudun mu?', category: 'Eğitim', points: 2, done: true },
  { icon: '✏️', title: 'Ödevlerini yaptın mı?', category: 'Eğitim', points: 3, done: true },
  { icon: '🛏️', title: 'Yatağını topladın mı?', category: 'Düzen', points: 2, done: true },
  { icon: '🦷', title: 'Dişlerini fırçaladın mı?', category: 'Bakım', points: 1, done: true },
  { icon: '🧸', title: 'Oyuncaklarını topladın mı?', category: 'Düzen', points: 2, done: false }
];

const taskList = document.getElementById('taskList');
const appShell = document.querySelector('.app-shell');
const modeButtons = document.querySelectorAll('.mode-btn');

function renderTasks(){
  taskList.innerHTML = tasks.map((task, index) => `
    <button class="task ${task.done ? 'done' : ''}" data-index="${index}">
      <span>${task.icon}</span>
      <span><b>${task.title}</b><small>${task.category}</small></span>
      <span class="points">+${task.points}⭐</span>
      <span class="check">✓</span>
    </button>
  `).join('');
  document.querySelectorAll('.task').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      tasks[index].done = !tasks[index].done;
      updateNumbers();
      renderTasks();
    });
  });
}

function updateNumbers(){
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const earned = tasks.filter(t => t.done).reduce((sum, t) => sum + t.points, 0);
  const progress = Math.round((done / total) * 100);
  document.getElementById('topStars').textContent = 117 + earned;
  document.getElementById('topDone').textContent = `${done}/${total}`;
  document.getElementById('heroProgress').textContent = `${progress}%`;
  document.getElementById('heroDone').textContent = `${done}/${total}`;
  document.getElementById('heroEarned').textContent = `+${earned}`;
  document.getElementById('progressText').textContent = `${progress}%`;
  document.getElementById('progressRing').style.background = `conic-gradient(#24c46b 0 ${progress}%,#e9e1ff 0)`;
  document.getElementById('completedText').textContent = `${done} / ${total} görev`;
}

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(btn.dataset.mode === 'parent') appShell.classList.add('parent-mode');
    else appShell.classList.remove('parent-mode');
  });
});

document.getElementById('saveDay').addEventListener('click', () => alert('Bugünün görevleri kaydedildi. Harika iş!'));
document.getElementById('footerSave').addEventListener('click', () => alert('Bugün kaydedildi. Yıldızların haftalık özete eklendi.'));

renderTasks();
updateNumbers();
