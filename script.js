// ===== scroll progress bar =====
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  if(progressBar) progressBar.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateProgress);

// ===== reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== animated stat counters =====
const statEls = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ animateCount(entry.target); statObserver.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObserver.observe(el));

function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const prefix = el.dataset.prefix || '';
  const duration = 1400;
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = prefix + (decimals ? value.toFixed(decimals) : Math.round(value));
    if(progress < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + (decimals ? target.toFixed(decimals) : target);
  }
  requestAnimationFrame(tick);
}

// ===== project card cursor-follow glow =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
  });
});

// ===== scroll-to-top button =====
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if(window.scrollY > 480) scrollTopBtn.classList.add('show');
  else scrollTopBtn.classList.remove('show');
});
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== header background on scroll =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 40
    ? 'rgba(11,10,23,0.95)'
    : 'rgba(11,10,23,0.7)';
});

// ===== mobile menu =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
let menuOpen = false;
menuBtn?.addEventListener('click', () => {
  menuOpen = !menuOpen;
  if(menuOpen){
    nav.style.cssText = `
      display:flex; position:fixed; top:70px; left:0; right:0;
      flex-direction:column; align-items:center; gap:24px;
      background:rgba(11,10,23,0.98); padding:32px 0;
      backdrop-filter:blur(14px);
      border-bottom:1px solid rgba(232,228,255,0.1);
      z-index:199;
    `;
  } else {
    nav.style.display = 'none';
  }
});
nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if(window.innerWidth <= 980){ nav.style.display = 'none'; menuOpen = false; }
  });
});

// ===== CHATBOT =====
let chatData = null;

async function loadChatbot(){
  try {
    const res = await fetch('chatbot.json');
    chatData = await res.json();
  } catch(e){
    chatData = null;
  }
  renderWelcome();
}

function renderWelcome(){
  const msgs = document.getElementById('chatMessages');
  if(!msgs) return;
  msgs.innerHTML = '';
  addBotMessage("👋 Hi! I'm Aishwarya's portfolio assistant. Ask me about her skills, projects, experience, or how to contact her!");
  renderChips(["Her skills 🛠️","Projects 📊","Experience 💼","Contact her 📬"]);
}

function addBotMessage(html){
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = html.replace(/\n/g, '<br>');
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text){
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg user';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping(){
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot typing-indicator';
  div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function renderChips(chips){
  const container = document.getElementById('chatChips');
  container.innerHTML = '';
  (chips || []).forEach(chip => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = chip;
    btn.onclick = () => handleInput(chip);
    container.appendChild(btn);
  });
}

function handleInput(text){
  if(!text.trim()) return;
  const input = document.getElementById('chatInput');
  if(input) input.value = '';

  addUserMessage(text);
  renderChips([]);

  const typingEl = showTyping();

  setTimeout(() => {
    typingEl.remove();
    const { reply, chips } = getResponse(text);
    addBotMessage(reply);
    renderChips(chips);
  }, 700 + Math.random() * 400);
}

function getResponse(text){
  if(!chatData) return { reply: "Sorry, I couldn't load my knowledge base. Please contact Aishwarya directly at aishwaryasah25@gmail.com 😊", chips: [] };

  const lower = text.toLowerCase();

  // special chip actions
  if(lower.includes('download cv') || lower.includes('cv 📄')){
    return { reply: "Here you go! 📄 <a href='AishwaryaSah-CV.pdf' download style='color:var(--teal);text-decoration:underline'>Download Aishwarya's CV</a>", chips: ["Her skills 🛠️","Contact her 📬"] };
  }
  if(lower.includes('view github') || lower.includes('github →')){
    return { reply: "Check out all of Aishwarya's code on GitHub 💻: <a href='https://github.com/Aishwaryagithubit' target='_blank' style='color:var(--teal);text-decoration:underline'>github.com/Aishwaryagithubit</a>", chips: ["Her projects 📁","Contact her 📬"] };
  }

  // match against responses in JSON
  for(const resp of chatData.responses){
    for(const trigger of resp.triggers){
      if(lower.includes(trigger)){
        return { reply: resp.reply, chips: resp.chips || [] };
      }
    }
  }

  return { reply: chatData.fallback, chips: chatData.fallbackChips || [] };
}

// toggle open/close
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

chatToggle?.addEventListener('click', () => {
  chatBox.classList.toggle('open');
  if(chatBox.classList.contains('open') && !chatData) loadChatbot();
  if(chatBox.classList.contains('open')) chatInput?.focus();
});
chatClose?.addEventListener('click', () => chatBox.classList.remove('open'));

chatSend?.addEventListener('click', () => handleInput(chatInput?.value || ''));
chatInput?.addEventListener('keydown', e => { if(e.key === 'Enter') handleInput(chatInput.value); });

// preload chatbot data
loadChatbot();

// ===== CONTACT FORM — mailto =====
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = contactForm.querySelector('[name="name"]').value.trim();
  const email   = contactForm.querySelector('[name="email"]').value.trim();
  const message = contactForm.querySelector('[name="message"]').value.trim();
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:saishwarya23@tbc.edu.np?subject=${subject}&body=${body}`;
});
