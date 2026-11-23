(() => {
const $=id=>document.getElementById(id), store='nirvo-student-life-v1';
const quotes={
en:['Small steps every day become big changes.','Your future is built by what you practise today.','Progress is better than perfection.','Start where you are. Use what you have. Do what you can.'],
ml:['ഓരോ ദിവസവും ചെയ്യുന്ന ചെറിയ ശ്രമങ്ങളാണ് വലിയ മാറ്റങ്ങൾ സൃഷ്ടിക്കുന്നത്.','ഇന്നത്തെ പരിശ്രമമാണ് നാളെയുടെ ആത്മവിശ്വാസം.','പൂർണ്ണതയല്ല, സ്ഥിരമായ പുരോഗതിയാണ് പ്രധാനം.'],
hi:['हर दिन के छोटे कदम बड़े बदलाव लाते हैं।','आज की मेहनत कल का आत्मविश्वास बनती है।','पूर्णता नहीं, लगातार प्रगति मायने रखती है।'],
ta:['ஒவ்வொரு நாளின் சிறிய முயற்சியும் பெரிய மாற்றத்தை உருவாக்கும்.','இன்றைய முயற்சி நாளைய நம்பிக்கை.','முழுமையை விட தொடர்ச்சியான முன்னேற்றம் முக்கியம்.'],
kn:['ಪ್ರತಿದಿನದ ಸಣ್ಣ ಪ್ರಯತ್ನಗಳು ದೊಡ್ಡ ಬದಲಾವಣೆಯನ್ನು ತರುತ್ತವೆ.','ಇಂದಿನ ಪರಿಶ್ರಮ ನಾಳೆಯ ಆತ್ಮವಿಶ್ವಾಸ.','ಪೂರ್ಣತೆಯಿಗಿಂತ ನಿರಂತರ ಪ್ರಗತಿ ಮುಖ್ಯ.']
};
const ideas=['Learn one useful skill for 15 minutes today.','Teach a family member one thing you learned.','Make a tiny budget: needs, savings and wants.','Try a 10-minute walk without scrolling.','Write one question you want to investigate this week.','Organise tomorrow’s books and set one clear goal.','Watch one science explanation, then explain it in your own words.'];
let started=Date.now(),seconds=0,phone=0;
try{const d=JSON.parse(localStorage.getItem(store)||'{}');seconds=d.seconds||0;phone=d.phone||0;}catch{}
const today=new Date().toISOString().slice(0,10);
try{const d=JSON.parse(localStorage.getItem(store)||'{}');if(d.day!==today){seconds=0;phone=0;}}catch{}
function persist(){try{localStorage.setItem(store,JSON.stringify({day:today,seconds,phone}))}catch{}}
function tick(){if(!document.hidden){seconds++;persist()}const h=String(Math.floor(seconds/3600)).padStart(2,'0'),m=String(Math.floor(seconds%3600/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');$('nirvoScreenTime').textContent=h+':'+m+':'+s;$('screenStatus').textContent=document.hidden?'Paused while this tab is hidden.':'Counting while this NIRVO tab is visible.'}
setInterval(tick,1000);document.addEventListener('visibilitychange',tick);tick();
$('phoneScreenTime').value=phone||'';$('phoneScreenSummary').textContent=phone?'Manual Android screen-time entry: '+phone+' minutes today.':'Enter the total shown in Android Settings → Digital Wellbeing.';
$('savePhoneTime').addEventListener('click',()=>{const n=Number($('phoneScreenTime').value);if(!Number.isFinite(n)||n<0||n>1440)return alert('Enter minutes from 0 to 1440.');phone=n;persist();$('phoneScreenSummary').textContent='Saved manually: '+phone+' minutes today. This number comes from your Android report.'});
function quote(){const l=$('lifeQuoteLanguage').value,list=quotes[l]||quotes.en;const index=Math.floor(Date.now()/86400000)%list.length;$('dailyQuote').textContent=list[index];$('quoteAuthor').textContent='— NIRVO daily reminder';}
$('lifeQuoteLanguage').addEventListener('change',quote);quote();
function idea(){const index=Math.floor(Math.random()*ideas.length);$('dailyIdea').textContent=ideas[index]}
$('newDailyIdea').addEventListener('click',idea);idea();
const plans={
balanced:['5 min brisk walk in place','3 min gentle squats or sit-to-stands','3 min wall push-ups','4 min easy stretching'],
walk:['2 min gentle warm-up','10 min comfortable walk or jog','3 min cool-down walk and stretches'],
bodyweight:['3 min warm-up','2 rounds: 8 chair squats, 6 wall push-ups, 10 calf raises','Finish with 3 min gentle stretching'],
stretch:['Neck and shoulder mobility','Gentle side reaches and hip circles','Calf, hamstring and back stretches without forcing'],
sports:['5 min warm-up','10 min easy skill practice or ball control','5 min cool-down and hydration'],
rest:['Recovery day: relaxed walk if comfortable','Gentle mobility only if it feels good','Prioritise sleep, water and recovery']
};
function buildWorkout(){
const type=$('workoutType').value,duration=Number($('workoutDuration').value),days=Number($('workoutDays').value),when=$('workoutWhen').value;
const labels={morning:'After waking, before getting ready',after:'After school, once you have rested',evening:'Early evening, before it gets too late',flexible:'Choose a free time that does not reduce sleep'};
if(type==='rest'){$('workoutPlan').innerHTML='<b>Recovery plan</b><p>Take a rest day. A comfortable gentle walk is optional. No need to make up missed sessions.</p>';return}
const routine=plans[type];$('workoutPlan').innerHTML='<b>'+days+' days each week · '+duration+' minutes · '+labels[when]+'</b><ul>'+routine.map(x=>'<li>'+x+'</li>').join('')+'</ul><p><b>Weekly rhythm:</b> '+Array.from({length:7},(_,i)=>i<days?['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]:'').filter(Boolean).join(' · ')+'; other days are rest or gentle movement.</p><small>Scale the routine to your comfort. Do not train through pain or exhaustion.</small>';
}
$('buildWellnessPlan').addEventListener('click',buildWorkout);buildWorkout();
const videos={
study:{id:'1oDrJba2PSs',title:'Study With Me · Pomodoro focus session · Lofi Girl'},
science:{id:'74cOUSKXMz0',title:'3-hour study / learning focus session · iCanStudy'},
health:{id:'wYxDJOFgDw0',title:'Gentle study-break movement / session inspiration'},
money:{id:'wYxDJOFgDw0',title:'A calm focus session — use the break to learn budgeting basics'},
motivation:{id:'1oDrJba2PSs',title:'Build focus one session at a time · Lofi Girl'},
sports:{id:'74cOUSKXMz0',title:'Focus session — take a movement break and practise a sport'}
};
$('loadVideo').addEventListener('click',()=>{const v=videos[$('videoCategory').value];$('lifeVideoFrame').src='https://www.youtube-nocookie.com/embed/'+v.id+'?rel=0';$('videoCaption').textContent=v.title});
document.querySelectorAll('.life-music-choice').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.life-music-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('spotifyFrame').src='https://open.spotify.com/embed/playlist/'+b.dataset.playlist+'?utm_source=generator&theme=0'}));
})();