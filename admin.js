import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
const $=s=>document.querySelector(s);const app=initializeApp(firebaseConfig);const auth=getAuth(app),db=getFirestore(app);let unsubscribe=null;
$('#login-form').addEventListener('submit',async e=>{e.preventDefault();$('#login-status').textContent='登入中…';try{await signInWithEmailAndPassword(auth,$('#email').value.trim(),$('#password').value);$('#login-status').textContent='';}catch(err){$('#login-status').textContent=`登入失敗：${err.code}`;}});
$('#logout').addEventListener('click',()=>signOut(auth));
onAuthStateChanged(auth,user=>{if(unsubscribe){unsubscribe();unsubscribe=null;}$('#login-panel').classList.toggle('hidden',!!user);$('#dashboard').classList.toggle('hidden',!user);$('#records').replaceChildren();if(!user)return;
 const q=query(collection(db,'responses'),orderBy('createdAt','desc'));
 unsubscribe=onSnapshot(q,snapshot=>{$('#count').textContent=String(snapshot.size);$('#records').replaceChildren();if(snapshot.empty){$('#records').textContent='目前還沒有回覆。';return;}
 snapshot.forEach(doc=>{const data=doc.data();const card=document.createElement('article');card.className='record';const date=document.createElement('p');date.className='small';date.textContent=data.createdAt?.toDate()?.toLocaleString('zh-TW',{timeZone:'Asia/Taipei'})||'處理中';card.append(date);
 (data.answers||[]).forEach((item,i)=>{const h=document.createElement('h3');h.textContent=`${i+1}. ${item.question}`;const p=document.createElement('p');p.textContent=Array.isArray(item.answer)?item.answer.join('；')||'未作答':item.answer||'未作答';card.append(h,p);});if(data.extra){const h=document.createElement('h3');h.textContent='補充的話';const p=document.createElement('p');p.textContent=data.extra;card.append(h,p);}$('#records').append(card);});
 },err=>{$('#records').textContent=`無法讀取資料：${err.code}。請確認管理者 UID 與 Firestore Rules。`;});});
