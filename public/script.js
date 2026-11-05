const menuButton=document.querySelector('.menu-button');
const menu=document.querySelector('.menu');
function toggleMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('menu-open',open)}
menuButton.addEventListener('click',()=>toggleMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.intro-content,.focus-heading,.focus-grid,.work-heading,.project,.experience-layout').forEach(el=>{el.classList.add('reveal');observer.observe(el)})}
const dialog=document.querySelector('#detail');
function showDetail(label,title,copy){document.querySelector('#dialog-label').textContent=label;document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-copy').textContent=copy;dialog.showModal()}
const projects=[["APP / DAILY HELPER","Personal AI App","An app I built for myself that uses AI to take the headache out of everyday tasks and get them done quicker."],["ETSY SHOP / DIGITAL PRODUCTS","Digital Routine Tools","My Etsy shop, where I design digital planners, templates, and tools to help people get a bit more organized."],["TINKERING / SIDE PROJECTS","Other AI Builds","Smaller tools, workflows, and experiments from teaching myself new AI tech."]];
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>showDetail(...projects[Number(button.dataset.project)])));
document.querySelector('.contact-button').addEventListener('click',()=>{window.location.href='mailto:grizville.chand@gmail.com'});
document.querySelectorAll('.close-dialog,.dialog-done').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close()}});
document.querySelector('#year').textContent=new Date().getFullYear();

