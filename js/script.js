(function(){
  const root=document.documentElement;
  const savedTheme=localStorage.getItem('shopzoneTheme')||'light';
  root.dataset.theme=savedTheme;
  function updateThemeButton(){document.querySelectorAll('#themeToggle').forEach(b=>b.textContent=root.dataset.theme==='dark'?'☀️':'🌙')}
  function toggleTheme(){const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;localStorage.setItem('shopzoneTheme',next);updateThemeButton()}
  document.querySelectorAll('#themeToggle').forEach(b=>b.addEventListener('click',toggleTheme));updateThemeButton();
  window.showToast=function(message){const t=document.getElementById('toast');if(!t)return;t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)};
  const count=document.getElementById('cartCount');if(count){const cart=JSON.parse(localStorage.getItem('shopzoneCart')||'[]');count.textContent=cart.reduce((s,x)=>s+x.quantity,0)}
  const searchInput=document.getElementById('searchInput');const category=document.getElementById('categorySelect');const searchBtn=document.getElementById('searchBtn');
  function search(){if(!searchInput)return;const q=searchInput.value.trim().toLowerCase();const c=category?category.value:'all';document.querySelectorAll('.category-card,.product-card').forEach(card=>{const okText=!q||card.textContent.toLowerCase().includes(q);const okCat=c==='all'||card.dataset.category===c;card.style.display=okText&&okCat?'':'none'});if(q||c!=='all')showToast('Search/filter applied.')}
  searchBtn?.addEventListener('click',search);searchInput?.addEventListener('keydown',e=>{if(e.key==='Enter')search()});
  document.getElementById('backTop')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  document.getElementById('menuBtn')?.addEventListener('click',()=>showToast('Menu clicked. Add your navigation menu here.'));
  document.getElementById('signinForm')?.addEventListener('submit',e=>{e.preventDefault();showToast('Demo sign-in successful. Connect authentication service later.')});
  document.getElementById('togglePassword')?.addEventListener('click',()=>{const p=document.getElementById('password'),b=document.getElementById('togglePassword');const visible=p.type==='text';p.type=visible?'password':'text';b.textContent=visible?'Show':'Hide'});
  document.getElementById('createAccount')?.addEventListener('click',()=>showToast('Registration page can be added next.'));
})();
