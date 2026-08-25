const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

const header=$("#header");
const topBtn=$("#topBtn");
addEventListener("scroll",()=>{
  header.classList.toggle("scrolled",scrollY>45);
  topBtn.classList.toggle("show",scrollY>500);
},{passive:true});
topBtn.onclick=()=>scrollTo({top:0,behavior:"smooth"});

$("#hamburger").onclick=()=>header.classList.toggle("open");
$$("nav a").forEach(a=>a.onclick=()=>header.classList.remove("open"));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}});
},{threshold:.12});
$$(".reveal").forEach(x=>observer.observe(x));

const tabs=$$(".tabs button"), tabContents=$$(".tab-content");
tabs.forEach(btn=>btn.onclick=()=>{
  tabs.forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  tabContents.forEach(x=>x.classList.toggle("active",x.id===btn.dataset.tab));
  $$(".tab-content.active .reveal").forEach(x=>x.classList.add("show"));
});

const filterButtons=$$(".project-filters button"), cards=$$(".project-card");
filterButtons.forEach(btn=>btn.onclick=()=>{
  filterButtons.forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const f=btn.dataset.filter;
  cards.forEach(c=>c.classList.toggle("hide",f!=="all"&&c.dataset.category!==f));
});

const awardCards=$$(".award-card"), dots=$$("#awardDots i");
let awardIndex=0;
function awardShow(i){awardIndex=(i+awardCards.length)%awardCards.length;awardCards.forEach((c,n)=>c.classList.toggle("active",n===awardIndex));dots.forEach((d,n)=>d.classList.toggle("active",n===awardIndex))}
$("#awardPrev").onclick=()=>awardShow(awardIndex-1);
$("#awardNext").onclick=()=>awardShow(awardIndex+1);
setInterval(()=>awardShow(awardIndex+1),6000);

$("#contactForm").onsubmit=e=>{
  e.preventDefault();
  const f=e.currentTarget;
  const subject=encodeURIComponent("Portfolio Contact — Aishwarya Sah");
  const body=encodeURIComponent(`Name: ${f.name.value}\nEmail: ${f.email.value}\n\n${f.message.value}`);
  location.href=`mailto:aishwaryasah25@gmail.com?subject=${subject}&body=${body}`;
};

const responses=[
  {keys:["hi","hello","hey"],text:"Hey! 👋 I'm Aishwarya's portfolio assistant. I can tell you about her skills, projects, experience, education or contact details.",chips:["Skills","Projects","Experience","Contact"]},
  {keys:["skill","skills","tech","stack","tools","technology"],text:"Aishwarya's toolkit includes Python, Pandas, NumPy, Matplotlib, Seaborn, Tableau, Excel, scikit-learn, SQL, MySQL, PostgreSQL, Java, C, R, PHP, HTML, CSS, JavaScript, Git/GitHub, Jupyter, Colab, Postman, AWS Fundamentals and Oracle OCI AI Foundations.",chips:["Projects","Experience","Education"]},
  {keys:["project","projects","portfolio","built"],text:"Key projects include Churn & Retention Intelligence Engine, Superstore Sales & Profit Analysis, Machine Downtime Dashboard, Brain Tumor Detection, Drought Prediction System, Promptly AI Caption Generator, University Chatbot, CleckBasket and Turtle Graphics.",chips:["Churn","Drought","Promptly"]},
  {keys:["churn","retention"],text:"The Churn & Retention Intelligence Engine predicts customers at risk of leaving from behavioural and transaction data and surfaces the drivers behind churn. Built with Python, Pandas, scikit-learn and feature engineering.",chips:["Projects","GitHub","Contact"]},
  {keys:["experience","internship","intern","work","career"],text:"Aishwarya's highlights include Data Visualization Associate Intern at Saint Louis University, Nobel Global Intern, AWS Fellow and international competition experience. At Saint Louis University she was recognized as a Star Performer with a $1000 scholarship.",chips:["Skills","Education","Awards"]},
  {keys:["education","degree","university","college","gpa"],text:"Aishwarya is pursuing BSc (Hons.) Computing at The British College, affiliated with Leeds Beckett University, 2023–2027, with a GPA of 3.8/4.0. High school: Model Multiple College.",chips:["Skills","Projects","CV"]},
  {keys:["award","awards","competition","hult","hpair","aida"],text:"Recognition includes Hult Prize Campus Runner-Up 2026, HPAIR 2025 Delegate, AIDA Hackathon Semifinalist for HearMe, AWS Fellow and a $1000 Star Performer scholarship.",chips:["Experience","Projects","Contact"]},
  {keys:["contact","email","hire","reach","job","recruiter"],text:"Email: aishwaryasah25@gmail.com\nGitHub: github.com/Aishwaryagithubit\nLinkedIn: linkedin.com/in/aishwarya-sah-16580b28b\nWhatsApp: +977 9817835460",chips:["CV","Skills","Projects"]},
  {keys:["cv","resume","download"],text:"You can download the CV here: <a href='assets/AishwaryaSah-CV.pdf' download style='color:#c41e3a'>Download Aishwarya's CV ↓</a>",chips:["Skills","Experience","Contact"]},
  {keys:["location","where","nepal","kathmandu","remote"],text:"Aishwarya is based in Kathmandu, Nepal and is open to global remote opportunities and relocation for the right opportunity.",chips:["Contact","Experience"]}
];
function addMsg(text,type="bot"){const d=document.createElement("div");d.className=`message ${type}`;d.innerHTML=text.replace(/\n/g,"<br>");$("#chatMessages").appendChild(d);$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight}
function chips(list){const box=$("#chatChips");box.innerHTML="";list.forEach(t=>{const b=document.createElement("button");b.className="chat-chip";b.textContent=t;b.onclick=()=>send(t);box.appendChild(b)})}
function answer(q){const l=q.toLowerCase();return responses.find(x=>x.keys.some(k=>l.includes(k)))||{text:"I'm not sure about that yet. Try asking about Aishwarya's skills, projects, experience, education, awards or contact details.",chips:["Skills","Projects","Experience","Contact"]}}
function send(q){if(!q.trim())return;addMsg(q,"user");$("#chatInput").value="";chips([]);setTimeout(()=>{const r=answer(q);addMsg(r.text);chips(r.chips)},350)}
function openChat(){const box=$("#chatBox");box.classList.add("open");if(!$("#chatMessages").children.length){addMsg("👋 Hi! I'm Aishwarya's portfolio assistant.");addMsg("Ask me about skills, projects, experience, education or contact.");chips(["Skills","Projects","Experience","Contact"])}$("#chatInput").focus()}
$("#chatToggle").onclick=()=>$("#chatBox").classList.contains("open")?$("#chatBox").classList.remove("open"):openChat();
$("#chatClose").onclick=()=>$("#chatBox").classList.remove("open");
$("#chatSend").onclick=()=>send($("#chatInput").value);
$("#chatInput").onkeydown=e=>{if(e.key==="Enter")send(e.target.value)};

$$("a[href^='#']").forEach(a=>a.addEventListener("click",e=>{
  const target=$(a.getAttribute("href"));
  if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth"})}
}));

document.addEventListener("DOMContentLoaded", () => {

    // GitHub icon
    document.querySelectorAll('a[href*="github"]').forEach(link => {
        link.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor"
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.15c-3.2.7-3.87-1.55-3.87-1.55-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
            </svg>
        `;
    });


    // WhatsApp icon
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
        link.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor"
                    d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.48 0 .14 5.34.14 11.9c0 2.1.55 4.15 1.6 5.96L.04 24l6.28-1.65a11.88 11.88 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.43-8.43z"/>
            </svg>
        `;
    });

});