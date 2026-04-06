// ============================================
// Mental Health JS Utils - Mood Tracking, Charts, Check-ins
// For student mental wellness features
// ============================================

// API base for mental endpoints
const MENTAL_API = '/api/mental';

// Mood emojis for UI (1-5 scale)
const MOOD_EMOJIS = {
  1: '😢', 2: '😞', 3: '😐', 4: '🙂', 5: '😊'
};

// India helplines display
const INDIA_HELPLINES = [
  { name: 'iCall (TISS)', number: '9152987821', desc: '24/7 counseling' },
  { name: 'Vandrevala', number: '1860-2662-345', desc: 'Crisis support' },
  { name: 'Kiran', number: '1800-599-0019', desc: 'Govt helpline' }
];

// ===== MOOD LOGGING =====
async function logMood(moodData) {
  try {
    const response = await fetch(`${MENTAL_API}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(moodData)
    });
    
    const data = await response.json();
    if (response.ok) {
      showToast(data.message || 'Mood logged! 💙', 'success');
      return data;
    } else {
      throw new Error(data.error || 'Log failed');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ===== DAILY CHECK-IN =====
async function checkDailyStatus() {
  try {
    const response = await fetch(`${MENTAL_API}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    console.error('Check-in status error:', error);
  }
}

// Show daily check-in popup (post-login or sidebar button)
function showCheckinPopup() {
  const popup = createModal(`
    <div style="text-align: center; padding: 2rem;">
      <h3>🌙 How are you feeling today?</h3>
      <p style="color: var(--text-secondary);">Daily wellness check-in</p>
      <div id="mood-picker" style="display: flex; gap: 1rem; justify-content: center; margin: 2rem 0; flex-wrap: wrap;">
        ${[1,2,3,4,5].map(score => `
          <button class="mood-btn" data-score="${score}" style="
            width: 70px; height: 70px; border-radius: 50%; 
            border: 3px solid var(--glass-border); background: var(--glass-bg);
            font-size: 1.5rem; cursor: pointer; transition: all 0.3s;
            ${score <= 2 ? 'border-color: #f87171; color: #f87171' : 
              score >= 4 ? 'border-color: #10b981; color: #10b981' : ''}">
            ${MOOD_EMOJIS[score]}
            <div style="font-size: 0.8rem; mt: 0.25rem;">${score}/5</div>
          </button>
        `).join('')}
      </div>
      <textarea id="mood-notes" placeholder="What's on your mind today? (optional)" 
                style="width: 100%; height: 80px; padding: 1rem; border-radius: 12px; 
                       border: 1px solid var(--glass-border); background: var(--glass-bg);
                       resize: vertical; color: var(--text-primary);"></textarea>
      <div style="display: flex; gap: 1rem; justify-content: center; mt: 1.5rem;">
        <button onclick="this.closest('.modal').remove()" class="btn btn-ghost">Skip</button>
        <button id="submit-checkin" class="btn btn-primary" disabled>Log Mood</button>
      </div>
    </div>
  `);

  // Event listeners
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.style.transform = 'scale(1)');
      btn.style.transform = 'scale(1.1)';
      document.getElementById('submit-checkin').disabled = false;
      document.getElementById('submit-checkin').dataset.score = btn.dataset.score;
    };
  });

  document.getElementById('submit-checkin').onclick = async () => {
    const score = parseInt(document.getElementById('submit-checkin').dataset.score);
    const notes = document.getElementById('mood-notes').value.trim();
    
    await logMood({
      moodScore: score,
      notes,
      checkinType: 'daily'
    });
    
    popup.remove();
    loadMoodStats(); // Refresh dashboard if open
  };
}

// ===== MOOD TRENDS CHART (Dashboard) =====
function renderMoodChart(canvasId, trends) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: trends.map(t => new Date(t.createdAt).toLocaleDateString()),
      datasets: [{
        label: 'Mood Score',
        data: trends.map(t => t.moodScore),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: trends.map(t => 
          t.moodScore <= 2 ? '#f87171' : t.moodScore >= 4 ? '#10b981' : '#fbbf24'
        )
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 1, max: 5, ticks: { stepSize: 1 } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${MOOD_EMOJIS[ctx.parsed.y]} ${ctx.parsed.y}/5`
          }
        }
      }
    }
  });
}

// Load and render mood trends
async function loadMoodTrends(days = 30) {
  try {
    const response = await fetch(`${MENTAL_API}/trends?days=${days}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await response.json();
    
    if (data.trends.length > 0) {
      renderMoodChart('mood-chart', data.trends);
      updateMoodStats(data.stats);
    } else {
      document.querySelector('#mood-section').innerHTML = `
        <div class="empty-state">
          <div style="font-size: 3rem;">🌱</div>
          <p>No mood data yet. Start your first check-in!</p>
          <button class="btn btn-primary" onclick="showCheckinPopup()">Start Tracking</button>
        </div>
      `;
    }
  } catch (error) {
    console.error('Trends load error:', error);
  }
}

// Update dashboard stats
function updateMoodStats(stats) {
  document.getElementById('stat-mood').textContent = `${MOOD_EMOJIS[Math.round(stats.averageMood)]} ${stats.averageMood}`;
  document.getElementById('stat-checkins').textContent = stats.totalCheckins;
  document.getElementById('mood-consistency').textContent = `${stats.consistency.toFixed(0)}%`;
}

// ===== CRISIS HELPLINES MODAL =====
function showCrisisHelplines() {
  createModal(`
    <div style="text-align: center; max-width: 500px;">
      <h3>🚨 Need Help Right Now?</h3>
      <p style="color: var(--text-secondary);">India 24/7 Mental Health Helplines</p>
      ${INDIA_HELPLINES.map(h => `
        <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); 
                    border-radius: 12px; padding: 1rem; margin: 0.75rem 0; text-align: left;">
          <h4 style="color: #f87171; margin: 0 0 0.25rem;">${h.name}</h4>
          <div style="font-size: 1.1rem; font-weight: 600;">📞 ${h.number}</div>
          <p style="margin: 0.25rem 0 0; font-size: 0.9rem;">${h.desc}</p>
        </div>
      `).join('')}
      <p style="font-size: 0.9rem; mt: 1.5rem; color: var(--text-muted);">
        You're not alone. Reach out - help is available 💙
      </p>
    </div>
  `);
}

// ===== SYMPTOM CHECKER MODAL =====
MentalUtils.showSymptomChecker = function() {
  let step = 0;
  const steps = [
    'What symptoms are you experiencing?',
    'How long have you had these symptoms?',
    'Rate severity: Mild/Moderate/Severe?',
    'Any known triggers or patterns?',
    'Current stress level 1-10?'
  ];

  function nextStep() {
    step++;
    if (step < steps.length) {
      symptomInput.placeholder = steps[step];
    } else {
      analyzeSymptoms();
    }
  }

  const symptomData = [];
  const modal = createModal(`
    <div style="max-width: 500px;">
      <h3>🔍 Smart Symptom Checker</h3>
      <p>AI analysis with severity assessment</p>
      <textarea id="symptom-input" placeholder="${steps[0]}" 
                style="width: 100%; height: 120px; margin: 1rem 0; padding: 1rem; 
                       border-radius: 12px; border: 1px solid var(--glass-border); 
                       background: var(--glass-bg); color: var(--text-primary);"></textarea>
      <div style="text-align: right; gap: 1rem;">
        <button onclick="this.closest('.modal').remove()" class="btn btn-ghost">Cancel</button>
        <button id="next-symptom" onclick="MentalUtils.nextSymptomStep()" class="btn btn-primary" disabled>Next</button>
      </div>
    </div>
  `);

  document.getElementById('symptom-input').oninput = function() {
    document.getElementById('next-symptom').disabled = !this.value.trim();
  };

  MentalUtils.nextSymptomStep = function() {
    symptomData.push(document.getElementById('symptom-input').value);
    nextStep();
  };
};

async function analyzeSymptoms() {
  try {
    const prompt = `Analyze student symptoms step-by-step:
    ${symptomData.join('\\n')}
    
    Return JSON: {
      "likelyIssues": ["stress", "anxiety"],
      "severity": "mild|moderate|severe",
      "recommendations": ["tips"],
      "urgency": "low|medium|high",
      "helplinesNeeded": true/false
    }`;
    
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ message: prompt, category: 'symptom-checker' })
    });
    
    const result = await response.json();
    showSymptomResults(result.response);
  } catch (error) {
    showToast('Analysis failed', 'error');
  }
}

// ===== MEDICINE REMINDER MODAL =====
function showMedicineModal() {
  createModal(`
    <div style="max-width: 500px;">
      <h3>💊 Medicine Reminder</h3>
      <form id="medicine-form">
        <div class="form-group">
          <label>Medicine Name</label>
          <input id="med-name" placeholder="Paracetamol 500mg" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Dosage</label>
            <input id="med-dosage" placeholder="1 tablet" required>
          </div>
          <div class="form-group">
            <label>Time</label>
            <input id="med-time" type="time" required>
          </div>
        </div>
        <div class="form-group">
          <label>Frequency</label>
          <select id="med-frequency" required>
            <option value="once-daily">Once Daily</option>
            <option value="twice-daily">Twice Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <textarea id="med-instructions" placeholder="Instructions (optional)"></textarea>
        <button type="submit" class="btn btn-primary w-full mt-3">Add Reminder</button>
      </form>
    </div>
  `);

  document.getElementById('medicine-form').onsubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: document.getElementById('med-name').value,
      dosage: document.getElementById('med-dosage').value,
      time: document.getElementById('med-time').value,
      frequency: document.getElementById('med-frequency').value,
      instructions: document.getElementById('med-instructions').value
    };

    try {
      await fetch('/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(formData)
      });
      showToast('Reminder added!', 'success');
    } catch (error) {
      showToast('Add failed', 'error');
    }
  };
}

// ===== HEALTH TIPS CAROUSEL =====
MentalUtils.showHealthTips = function() {
  const tips = [
    '🧘 4-7-8 Breathing: Inhale 4s, hold 7s, exhale 8s',
    '💧 Drink water - dehydration worsens anxiety',
    '📚 Pomodoro: 25min study, 5min break',
    '🌙 No screens 1hr before bed',
    '🍎 Walk 10min after meals'
  ];
  
  let tipIndex = 0;
  
  const modal = createModal(`
    <div style="max-width: 400px; text-align: center;">
      <h3>💡 Tip of the Day</h3>
      <div id="tip-content" style="font-size: 1.2rem; padding: 2rem; min-height: 100px; display: flex; align-items: center; justify-content: center;">
        ${tips[0]}
      </div>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button onclick="MentalUtils.prevTip()" class="btn btn-ghost">← Previous</button>
        <button onclick="MentalUtils.nextTip()" class="btn btn-primary">Next Tip →</button>
      </div>
      <button onclick="MentalUtils.saveTipToNotes()" class="btn btn-outline mt-3 w-full">Save to Notes</button>
    </div>
  `);

  MentalUtils.nextTip = () => {
    tipIndex = (tipIndex + 1) % tips.length;
    document.getElementById('tip-content').textContent = tips[tipIndex];
  };
  
  MentalUtils.prevTip = () => {
    tipIndex = (tipIndex - 1 + tips.length) % tips.length;
    document.getElementById('tip-content').textContent = tips[tipIndex];
  };
  
  MentalUtils.saveTipToNotes = () => {
    // Save to localStorage or send to chat history
    showToast('Tip saved!', 'success');
    modal.remove();
  };
}

// ===== UTILITY: Create Modal =====
function createModal(content) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(4px);
  `;
  modal.innerHTML = `
    <div class="modal" style="  
      background: var(--glass-bg); border-radius: 20px; padding: 2rem; max-width: 90vw; max-height: 90vh; overflow-y: auto;
      border: 1px solid var(--glass-border); box-shadow: var(--shadow-xl);
    ">${content}</div>
  `;
  document.body.appendChild(modal);
  
  modal.onclick = (e) => e.target === modal && modal.remove();
  return modal;
}


// ===== INIT & EXPORTS =====
document.addEventListener('DOMContentLoaded', () => {
  // Auto-check daily status on mental pages
  if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('chat')) {
    setTimeout(checkDailyNeed, 1000);
  }
});

async function checkDailyNeed() {
  const status = await checkDailyStatus();
  if (!status.alreadyChecked) {
    showToast('🌙 Time for your daily check-in!', 'info');
    // Don't auto-popup to avoid annoyance - use sidebar button instead
  }
}

// Export for other JS files
window.MentalUtils = {
  logMood, showCheckinPopup, loadMoodTrends, showCrisisHelplines,
  MOOD_EMOJIS, checkDailyStatus
};

