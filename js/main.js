(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// mobile menu
const mb=$('.menu-btn'),tabs=$('.tabs');
if(mb)mb.addEventListener('click',()=>{const o=tabs.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
// filter chips (heritage + gallery)
const chips=$$('.chip');
if(chips.length)chips.forEach(c=>c.addEventListener('click',()=>{
  chips.forEach(x=>x.classList.remove('on'));c.classList.add('on');
  const f=c.dataset.f;$$('[data-cat]').forEach(el=>{el.hidden=!(f==='all'||el.dataset.cat===f)});
}));
// lightbox
const lb=$('.lb');
if(lb){
  const im=$('img',lb),cap=$('.cap-t',lb),lk=$('.cap a',lb);let list=[],i=0;
  const show=()=>{const b=list[i];im.onerror=()=>{im.onerror=null;im.src=b.dataset.fb};im.src=b.dataset.src;im.alt=b.dataset.alt;cap.textContent=b.dataset.title;lk.href=b.dataset.href;};
  const open=b=>{list=$$('.shot').filter(s=>!s.hidden);i=list.indexOf(b);show();lb.classList.add('open');$('.x',lb).focus();};
  $$('.shot').forEach(b=>b.addEventListener('click',()=>open(b)));
  const step=d=>{i=(i+d+list.length)%list.length;show()};
  $('.pv',lb).onclick=()=>step(-1);$('.nx',lb).onclick=()=>step(1);
  const close=()=>lb.classList.remove('open');$('.x',lb).onclick=close;
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
}
// booking form
const form=$('#booking');
if(form){
  const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
  const ci=$('#checkin'),co=$('#checkout'),today=new Date().toISOString().slice(0,10);
  ci.min=today;co.min=today;
  const val=n=>form.elements[n].value;
  const calc=()=>{
    const a=new Date(ci.value),b=new Date(co.value);
    let nights=(ci.value&&co.value)?Math.round((b-a)/864e5):0;if(nights<0)nights=0;
    const hotel=form.elements.hotel.selectedOptions[0],base=+(hotel.dataset.price||0);
    const room=+((form.querySelector('[name=room]:checked')||{dataset:{m:1}}).dataset.m);
    const meal=+((form.querySelector('[name=meal]:checked')||{dataset:{p:0}}).dataset.p);
    const rooms=+val('rooms')||1,adults=+val('adults')||1;
    let extras=0;$$('[name=extras]:checked',form).forEach(x=>extras+=+x.dataset.p);
    const stay=base*room*rooms*nights,meals=meal*(adults+ +val('children')*0.5)*nights,total=stay+meals+extras;
    $('#s-hotel').textContent=hotel.value?hotel.textContent.split(' (')[0]:'Not chosen';
    $('#s-nights').textContent=nights;$('#s-stay').textContent=inr(stay);$('#s-meals').textContent=inr(meals);$('#s-extras').textContent=inr(extras);$('#s-total').textContent=inr(total);
    return{nights,total};
  };
  ci.addEventListener('change',()=>{if(ci.value){const d=new Date(ci.value);d.setDate(d.getDate()+1);co.min=d.toISOString().slice(0,10);if(co.value&&co.value<=ci.value)co.value=''}});
  form.addEventListener('input',calc);form.addEventListener('change',calc);calc();
  form.addEventListener('submit',e=>{
    e.preventDefault();const err=$('#date-err');err.textContent='';
    const {nights,total}=calc();
    if(!ci.value||!co.value||nights<1){err.textContent='Choose a check-out date that is after your check-in date.';co.focus();return}
    if(!form.checkValidity()){form.reportValidity();return}
    const ref='JPR-'+Math.random().toString(36).slice(2,8).toUpperCase();
    $('#m-ref').textContent=ref;$('#m-name').textContent=val('name');
    $('#m-detail').textContent=`${$('#s-hotel').textContent}, ${nights} night${nights>1?'s':''}, ${ci.value} to ${co.value}`;
    $('#m-total').textContent=inr(total);$('#m-mail').textContent=val('email');
    $('#modal').classList.add('open');$('#modal .btn').focus();
  });
  $('#modal .btn').addEventListener('click',()=>{$('#modal').classList.remove('open');form.reset();calc()});
}
})();
