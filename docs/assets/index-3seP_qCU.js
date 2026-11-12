(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`daybloom-habit-data-v1`,t=[{id:`dsa`,name:`Study DSA`,category:`Learning`,detail:`Practice problems · 45 min`,color:`sage`,icon:`⌘`},{id:`ml`,name:`Learn Machine Learning`,category:`Career`,detail:`Scikit-learn · 30 min`,color:`peach`,icon:`✎`},{id:`books`,name:`Read Books`,category:`Personal`,detail:`A few pages · 20 min`,color:`lilac`,icon:`▤`}];function n(e=new Date){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function r(){try{let t=JSON.parse(localStorage.getItem(e));if(t&&Array.isArray(t.habits)&&t.logs)return{habits:t.habits,logs:t.logs,benchmark:Number.isInteger(t.benchmark)?t.benchmark:80}}catch(e){console.warn(`Could not load saved data:`,e)}return{habits:t,logs:{},benchmark:80}}var i=r(),a=null;function o(){localStorage.setItem(e,JSON.stringify(i))}function s(e,t){return!!(i.logs[e]&&i.logs[e][t])}function c(e){let t=0;for(let n of i.habits)s(e,n.id)&&t++;return t}function l(){let e=new Date,t=e.getFullYear(),n=e.getMonth();return{year:t,month:n,daysInMonth:new Date(t,n+1,0).getDate(),daysCounted:e.getDate()}}function u(){let e=l(),t=0;for(let r=1;r<=e.daysCounted;r++){let i=new Date(e.year,e.month,r);t+=c(n(i))}let r=e.daysCounted*i.habits.length,a=0;return r>0&&(a=Math.round(t/r*100)),{completed:t,possible:r,percentage:a}}function d(e){let t=l(),r=0;for(let i=1;i<=t.daysCounted;i++)s(n(new Date(t.year,t.month,i)),e)&&r++;return t.daysCounted===0?0:Math.round(r/t.daysCounted*100)}function f(){if(i.habits.length===0)return 0;let e=new Date;c(n(e))!==i.habits.length&&e.setDate(e.getDate()-1);let t=0;for(;c(n(e))===i.habits.length;)t++,e.setDate(e.getDate()-1);return t}function p(e,t){let n=document.getElementById(e);n&&(n.textContent=t)}function m(){let e=u();p(`monthlyProgress`,`${e.percentage}%`),p(`completedCount`,`${e.completed} / ${e.possible}`),p(`currentStreak`,`${f()} days`),p(`benchmarkValue`,`${i.benchmark}%`);let t=document.getElementById(`monthlyProgressBar`);t&&(t.style.width=`${e.percentage}%`);let n=document.getElementById(`monthlyGoalText`);n&&(n.textContent=e.percentage>=i.benchmark?`You reached your monthly goal!`:`${i.benchmark-e.percentage}% away from your goal`)}function h(e){return String(e).replace(/[&<>"']/g,function(e){return{"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`}[e]})}function g(e){let t=s(n(),e.id),r=d(e.id),i={sage:{icon:`bg-[#E9EFE4]`,tag:`bg-[#F0F4ED] text-[#6E896F]`,bar:`bg-[#7D9B7D]`},peach:{icon:`bg-[#F5E9E1]`,tag:`bg-[#F8EEE8] text-[#B17E61]`,bar:`bg-[#D8A98D]`},lilac:{icon:`bg-[#F2EDF7]`,tag:`bg-[#F2EDF7] text-[#8875A5]`,bar:`bg-[#A99AC2]`},butter:{icon:`bg-[#F7F0D8]`,tag:`bg-[#F7F0D8] text-[#A58D4A]`,bar:`bg-[#D8C47C]`}},a=i[e.color]||i.sage;return`
    <article class="habit-row flex items-center gap-3 rounded-[22px] border border-[#E9EAE2] bg-white p-4 sm:gap-4 sm:p-5">
      <div class="grid h-12 w-12 shrink-0 place-items-center rounded-[17px] ${a.icon} text-[22px]">
        ${h(e.icon||`✿`)}
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-sm font-bold text-ink">
            ${h(e.name)}
          </h3>
          <span class="rounded-full ${a.tag} px-2 py-1 text-[9px] font-bold">
            ${h(e.category||`Personal`)}
          </span>
        </div>
        <p class="mt-1 text-[11px] text-[#9AA49A]">
          ${h(e.detail||`Daily habit`)}
        </p>
        <div class="mt-3 flex items-center gap-2">
          <div class="h-1 w-20 overflow-hidden rounded-full bg-[#EEF0E9] sm:w-24">
            <div
              class="h-full rounded-full ${a.bar}"
              style="width:${r}%"
            ></div>
          </div>
          <span class="text-[10px] text-[#89968A]">
            ${r}% this month
          </span>
        </div>
      </div>
      <label class="flex cursor-pointer items-center gap-2">
        <input
          class="habit-checkbox"
          type="checkbox"
          data-habit-id="${h(e.id)}"
          ${t?`checked`:``}
          aria-label="Mark ${h(e.name)} complete"
        >
        <span class="hidden text-[10px] font-semibold ${t?`text-[#66866D]`:`text-[#9AA49A]`} sm:inline">
          ${t?`Done`:`Mark done`}
        </span>
      </label>
      <button
        type="button"
        class="ml-1 text-xl leading-none text-[#A0AAA0] hover:text-[#496B52]"
        data-delete-habit="${h(e.id)}"
        title="Delete habit"
      >
        ×
      </button>
    </article>
  `}function _(){let e=document.getElementById(`habitList`);if(!e)return;if(i.habits.length===0){e.innerHTML=`
      <div class="rounded-[22px] border border-dashed border-[#D9E1D5] bg-white p-8 text-center">
        <p class="display text-xl text-ink">
          Your garden is waiting.
        </p>
        <p class="mt-2 text-xs text-[#9AA49A]">
          Add your first habit to get started.
        </p>
      </div>
    `;return}let t=``;for(let e of i.habits)t+=g(e);e.innerHTML=t}function v(){let e=document.getElementById(`calendarGrid`),t=document.getElementById(`calendarMonth`);if(!e)return;let r=l(),a=new Date(r.year,r.month,1).getDay(),o=n();t&&(t.textContent=new Date(r.year,r.month,1).toLocaleDateString(`en-US`,{month:`long`,year:`numeric`}));let s=[`S`,`M`,`T`,`W`,`T`,`F`,`S`],u=``;for(let e of s)u+=`
      <span class="py-2 text-[9px] font-bold uppercase text-[#AAB2A9]">
        ${e}
      </span>
    `;for(let e=0;e<a;e++)u+=`
      <span class="calendar-cell"></span>
    `;for(let e=1;e<=r.daysInMonth;e++){let t=n(new Date(r.year,r.month,e)),a=c(t),s=i.habits.length,l=``;s>0&&a===s?l=`done`:a>0&&(l=`partial`),t>o&&(l+=` future`),u+=`
      <span
        class="calendar-cell ${l} ${t===o?`today`:``}"
        title="${a} of ${s} habits completed"
      >
        ${e}
      </span>
    `}e.innerHTML=u}function y(){let e=document.getElementById(`weeklyChart`);if(!e||typeof Chart>`u`)return;let t=[],r=[];for(let e=6;e>=0;e--){let a=new Date;a.setDate(a.getDate()-e);let o=c(n(a)),s=0;i.habits.length>0&&(s=Math.round(o/i.habits.length*100)),t.push(a.toLocaleDateString(`en-US`,{weekday:`short`})),r.push(s)}a&&a.destroy(),a=new Chart(e,{type:`bar`,data:{labels:t,datasets:[{label:`Daily completion`,data:r,backgroundColor:r.map(function(e,t){return t===r.length-1?`#66866D`:`#A7BBA3`}),borderRadius:8,borderSkipped:!1,barThickness:25}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(e){return`${e.raw}% completed`}}}},scales:{x:{grid:{display:!1},border:{display:!1},ticks:{color:`#9AA49A`}},y:{beginAtZero:!0,max:100,ticks:{stepSize:25,callback:function(e){return`${e}%`},color:`#A0AAA0`},grid:{color:`#EEF0E9`},border:{display:!1}}}}})}function b(){_(),m(),v(),y()}function x(){let e=prompt(`What habit would you like to add?`);if(e===null||e.trim()===``)return;let t={id:`habit-${Date.now()}`,name:e.trim(),category:`Personal`,detail:`Daily habit`,color:`butter`,icon:`✿`};i.habits.push(t),o(),b()}function S(e){let t=i.habits.find(function(t){return t.id===e});if(t&&confirm(`Delete "${t.name}"? Its saved check-ins will also be removed.`)){i.habits=i.habits.filter(function(t){return t.id!==e});for(let t of Object.keys(i.logs))delete i.logs[t][e];o(),b()}}function C(){let e=prompt(`Set your monthly target percentage (0–100):`,String(i.benchmark));if(e===null)return;let t=Number(e);if(!Number.isInteger(t)||t<0||t>100){alert(`Please enter a whole number between 0 and 100.`);return}i.benchmark=t,o(),m()}document.addEventListener(`change`,function(e){if(!e.target.matches(`.habit-checkbox`))return;let t=e.target.dataset.habitId,r=n();i.logs[r]||(i.logs[r]={}),e.target.checked?i.logs[r][t]=!0:delete i.logs[r][t],o(),b()}),document.addEventListener(`click`,function(e){if(e.target.closest(`[data-add-habit]`)){x();return}let t=e.target.closest(`[data-delete-habit]`);if(t){S(t.dataset.deleteHabit);return}e.target.closest(`[data-change-benchmark]`)&&C()});function w(){let e=document.querySelectorAll(`.sidebar-link`);for(let t of e)t.addEventListener(`click`,function(){for(let t of e)t.classList.remove(`active`);t.classList.add(`active`)})}function T(){let e=document.getElementById(`todayDate`);e&&(e.textContent=new Date().toLocaleDateString(`en-US`,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`})),w(),b()}T();