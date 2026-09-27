const toast=document.getElementById('toast');
function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}
const searchBtn=document.getElementById('searchBtn');
function search(){const q=(document.getElementById('searchInput')?.value||'').toLowerCase().trim();const cat=document.getElementById('category')?.value||'all';const items=document.querySelectorAll('.card,.product');let count=0;items.forEach(x=>{const okText=!q||x.textContent.toLowerCase().includes(q);const okCat=cat==='all'||x.dataset.category===cat;x.style.display=okText&&okCat?'':'none';if(okText&&okCat)count++});showToast(count?`${count} matching item(s) found.`:'No matching items found.')}
searchBtn?.addEventListener('click',search);document.getElementById('searchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')search()});
document.getElementById('top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
document.getElementById('menuBtn')?.addEventListener('click',()=>showToast('Navigation menu placeholder.'));
document.getElementById('showPassword')?.addEventListener('click',e=>{const p=document.getElementById('password');p.type=p.type==='password'?'text':'password';e.target.textContent=p.type==='password'?'Show':'Hide'});
document.getElementById('signinForm')?.addEventListener('submit',e=>{e.preventDefault();showToast('Demo sign-in submitted. Connect your authentication API next.')});
document.getElementById('createAccount')?.addEventListener('click',()=>showToast('Registration page can be added next.'));
