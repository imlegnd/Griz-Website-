const menuButton=document.querySelector('.menu-button');
const menu=document.querySelector('.menu');
function toggleMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('menu-open',open)}
menuButton.addEventListener('click',()=>toggleMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.intro-content,.focus-heading,.focus-grid,.work-heading,.project,.experience-layout').forEach(el=>{el.classList.add('reveal');observer.observe(el)})}
const dialog=document.querySelector('#detail');
function showDetail(label,title,copy){document.querySelector('#dialog-label').textContent=label;document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-copy').textContent=copy;dialog.showModal()}
const projects=[['PROJECT PLACEHOLDER / AI','An idea, made useful.','This is a space for a real AI project. Add the idea behind it, what you built, the tools you used, and what you learned. Screenshots and a live project link can go here when it’s ready.'],['PROJECT PLACEHOLDER / TECHNOLOGY','Making the pieces click.','This is a space for a technical build or case study. Add the challenge, your approach, and the result. Replace this concept artwork with an image of your work whenever you like.']];
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>showDetail(...projects[Number(button.dataset.project)])));
document.querySelector('.contact-button').addEventListener('click',()=>showDetail('A CONVERSATION STARTS HERE','Say hello.','Griz’s contact details haven’t been added yet. This space is ready for an email address, LinkedIn profile, or booking link.'));
document.querySelectorAll('.close-dialog,.dialog-done').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close()}});
document.querySelector('#year').textContent=new Date().getFullYear();
