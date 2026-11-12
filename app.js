import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
import { questions } from './questions.js';
const $ = s=>document.querySelector(s);
const container=$('#questions');
questions.forEach((item,i)=>{
 const section=document.createElement('section');section.className='card';
 const title=document.createElement('h2');title.textContent=`${String(i+1).padStart(2,'0')}　${item.q}`;section.append(title);
 if(item.options.length){
  const hint=document.createElement('p');hint.className='hint';hint.textContent='可以複選，也可以不選。';section.append(hint);
  const options=document.createElement('div');options.className='options';
  item.options.forEach((v,j)=>{const label=document.createElement('label');label.className='option';const input=document.createElement('input');input.type='checkbox';input.name=`q${i}`;input.value=v;const span=document.createElement('span');span.textContent=`${'ABCD'[j]}. ${v}`;label.append(input,span);options.append(label);});section.append(options);
 }else {const textarea=document.createElement('textarea');textarea.id=`q${i}`;textarea.maxLength=3000;textarea.rows=4;textarea.placeholder='你可以自由回答（選填）';section.append(textarea);}
 container.append(section);
});
const configReady=!Object.values(firebaseConfig).some(x=>String(x).includes('REPLACE_WITH'));
$('#consent').addEventListener('change',e=>{$('#submit').disabled=!e.target.checked || !configReady;});
if(!configReady){$('#status').textContent='網站尚未完成 Firebase 設定，暫時無法送出。';$('#status').className='status bad';}
$('#survey').addEventListener('submit',async e=>{
 e.preventDefault();if(!$('#consent').checked||!configReady)return;
 const button=$('#submit');button.disabled=true;$('#status').className='status';$('#status').textContent='正在安全儲存回覆…';
 try{
  const answers=questions.map((item,i)=>({question:item.q,answer:item.options.length?[...document.querySelectorAll(`input[name=q${i}]:checked`)].map(x=>x.value):document.getElementById(`q${i}`).value.trim()}));
  const app=initializeApp(firebaseConfig);const auth=getAuth(app);await signInAnonymously(auth);const db=getFirestore(app);
  await addDoc(collection(db,'responses'),{answers,extra:$('#extra').value.trim(),createdAt:serverTimestamp(),version:1});
  $('#survey').innerHTML='<section class="card"><h2>已成功送出</h2><p>謝謝你認真回答。</p></section>';
  window.scrollTo({top:0,behavior:'smooth'});
 }catch(err){console.error(err);$('#status').textContent=`送出失敗：${err.code||'連線或資料庫權限問題'}。請確認 Firebase 設定與規則後重試。`;$('#status').className='status bad';button.disabled=false;}
});
