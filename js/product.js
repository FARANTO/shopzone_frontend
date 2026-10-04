const products = {
  1: {name:'Smartphone', price:299.99, category:'electronics', description:'A modern smartphone with a bright display, reliable performance and an everyday-friendly design.', image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', sizes:['One Size'], colors:['black','blue','green']},
  2: {name:'Wireless Earbuds', price:49.99, category:'electronics', description:'Compact wireless earbuds with a comfortable fit and clear sound for everyday listening.', image:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80', sizes:['One Size'], colors:['black','white','purple']},
  3: {name:'Beauty & Skincare Set', price:35.00, category:'beauty', description:'A practical skincare and beauty set for a simple daily self-care routine.', image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80', sizes:['Standard'], colors:['pink','white','green']},
  4: {name:'Kids Building Set', price:29.99, category:'toys', description:'A creative building set designed to encourage hands-on play and imagination.', image:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=900&q=80', sizes:['Small','Medium','Large'], colors:['red','blue','yellow']},
  5: {name:'Running Shoes', price:59.99, category:'fashion', description:'Lightweight running shoes designed for everyday training, walking and active use.', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', sizes:['38','39','40','41','42','43'], colors:['pink','black','white']}
};

const params = new URLSearchParams(location.search);
const product = products[params.get('id')] || products[1];
document.title = `${product.name} - ShopZone`;
document.getElementById('breadcrumbName').textContent = product.name;
document.getElementById('productName').textContent = product.name;
document.getElementById('productDescription').textContent = product.description;
document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
document.getElementById('productImage').style.backgroundImage = `url("${product.image}")`;

const sizeOptions = document.getElementById('sizeOptions');
product.sizes.forEach((size, i) => { const b=document.createElement('button'); b.className='option-button'+(i===0?' selected':''); b.textContent=size; b.onclick=()=>{document.querySelectorAll('#sizeOptions .option-button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')}; sizeOptions.appendChild(b); });
const colorOptions = document.getElementById('colorOptions');
product.colors.forEach((color,i)=>{const b=document.createElement('button');b.className='color-swatch '+color+(i===0?' selected':'');b.title=color;b.onclick=()=>{document.querySelectorAll('.color-swatch').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')};colorOptions.appendChild(b)});
let qty=1; const qtyValue=document.getElementById('qtyValue');
document.getElementById('qtyMinus').onclick=()=>{qty=Math.max(1,qty-1);qtyValue.textContent=qty}; document.getElementById('qtyPlus').onclick=()=>{qty++;qtyValue.textContent=qty};
function selectedSize(){return document.querySelector('#sizeOptions .selected')?.textContent || product.sizes[0]}
function selectedColor(){return document.querySelector('#colorOptions .selected')?.title || product.colors[0]}
function add(){const cart=JSON.parse(localStorage.getItem('shopzoneCart')||'[]'); const key=`${product.name}-${selectedSize()}-${selectedColor()}`;const found=cart.find(x=>x.key===key);if(found)found.quantity+=qty;else cart.push({key,name:product.name,price:product.price,image:product.image,size:selectedSize(),color:selectedColor(),quantity:qty});localStorage.setItem('shopzoneCart',JSON.stringify(cart));window.location.href='cart.html'}
document.getElementById('addToCart').onclick=add; document.getElementById('buyNow').onclick=add;
