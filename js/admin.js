document.getElementById('adminAddProduct')?.addEventListener('click',()=>showToast('Product creation form can be connected to the Product Service next.'));
document.getElementById('adminProductAction')?.addEventListener('click',()=>showToast('Product management is currently a frontend prototype.'));
document.querySelectorAll('.table-action').forEach(b=>b.addEventListener('click',()=>showToast('Edit action selected. Connect this to the Product Service API.')));
