# Mental Health Features Implementation Plan - CureChat AI (Student Focus)
🚀 **Priority: 4 Core Features** - AI Mood Detection, Daily Check-ins, Mood Progress Dashboard, India Emergency Helplines
*Estimated: 2-4 hours implementation + testing*

## ✅ Phase 1: Database & Backend Foundations (Current Step)
### 1.1 Create MoodHistory Model
- ✅ `backend/models/MoodHistory.js`: date, userId, moodScore(1-5), notes, detectedSentiment, triggers[]
### 1.2 Update Existing Models
- [ ] `backend/models/User.js`: Add `lastCheckinDate`, `moodStats.summary`
- [ ] `backend/models/ChatHistory.js`: Add `moodDetected` (positive/neutral/negative/crisis)
### 1.3 New Mental Health Controller
- ✅ `backend/controllers/mentalHealthController.js`: moodLog, dailyCheckin, getMoodTrends, crisisHelplines
### 1.4 New Routes
- ✅ `backend/routes/mentalHealthRoutes.js`: POST /mood/log, GET /mood/trends, POST /checkin, GET /helplines
### 1.5 Update ChatController
- ✅ `backend/controllers/chatController.js`: Mood detection in sendMessage (Gemini sentiment), crisis flags, India helplines

## 🔄 Phase 2: Frontend Integration
### 2.1 Chat UI Updates
- ✅ `frontend/chat.html`: Mood Tracker sidebar section, quick check-in button, crisis alert modal
### 2.2 Dashboard Enhancements
- ✅ `frontend/dashboard.html`: Mood trends chart (Chart.js), weekly stats, check-in reminder
### 2.3 New JS Utilities
- ✅ `frontend/js/mental.js`: Mood logging, charts, check-in popup logic
### 2.4 Login Flow
- ✅ `frontend/login.html` + `js/auth.js`: Daily check-in popup post-login if >24h since last

## 🧪 Phase 3: Integration & Polish
### 3.1 Server Integration
- ✅ `backend/server.js`: Mount mentalHealthRoutes
- [ ] Update SYSTEM_PROMPT for student mental health focus
### 3.2 UI Improvements
- [ ] Supportive suggestions in chat (negative mood → coping tips)
- [ ] Responsive mood picker (emoji selectors 1-5)
- [ ] Toast notifications for check-ins logged
### 3.3 Data Seeding
- [ ] `backend/seed/seedMentalHelplines.js`: iCall (9152987821), Vandrevala (1860-2662-345), etc.

## ✅ Phase 4: Testing & Completion
### 4.1 Test Scenarios
- [ ] Send sad message → mood detected negative + coping suggestion
- [ ] Daily check-in → popup + log mood
- [ ] Dashboard → trends chart over 7 days
- [ ] Crisis keywords → immediate helplines display
### 4.2 Edge Cases
- [ ] No moods yet → empty state with encouragement
- [ ] Anonymous check-ins option
- [ ] Mobile responsive mood picker
### 4.3 Completion
- [ ] Update README.md with new features
- [ ] attempt_completion with demo commands

**Next Immediate Step**: Phase 3.1 - Server integration & final polish
**Dependencies**: None (new file)
**Commands needed**: `npm i chart.js` (Phase 2), MongoDB running

**Progress Tracking**: Update this file after each major step ✓

