// ============================================
// Chat Controller - Vectorax Healthcare
// Integrates with Google Gemini AI + Fallback
// ============================================

const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/ChatHistory');
const MoodHistory = require('../models/MoodHistory');
const mentalHealthController = require('./mentalHealthController');


// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for healthcare context
const STUDENT_SYSTEM_PROMPT = `You are "StudentMind AI" - empathetic mental health companion for students. 

**Student Focus Areas:**
1. **Academic Stress** - Exam anxiety, study pressure, burnout
2. **Symptom Analysis** - Ask follow-up questions, assess severity (mild/moderate/severe)
3. **Medicine Reminders** - Track schedules, dosage, missed doses  
4. **Personalized Tips** - Mood-based health/wellness, breathing exercises
5. **Daily Check-ins** - Mood tracking, progress insights

**NEW CAPABILITIES:**
- Analyze sentiment & log moods automatically
- Crisis detection → India helplines (iCall 9152987821, Vandrevala 1860-2662-345)
- Follow-up symptom questions (duration, triggers, severity)
- Personalized coping strategies (student life context)

**CRISIS KEYWORDS** (immediate helplines): suicide, self-harm, hopeless, can't take it, ending it

**Rules:**
- STUDENT CONTEXT: Exams, assignments, hostel life, peer pressure
- Severity assessment: Mild/Moderate/Severe + next steps
- Always empathetic, non-judgmental
- Return JSON mood analysis when asked
- Markdown formatting, emojis, bullet points

**India Helplines:** Always mention for crisis/severely negative moods`;

const SYSTEM_PROMPT = STUDENT_SYSTEM_PROMPT;

// ========================================
// SMART FALLBACK RESPONSES
// When Gemini API is unavailable
// ========================================
function getSmartFallbackResponse(message) {
  const msg = message.toLowerCase();

  // Greetings
  if (msg.match(/^(hi|hello|hey|namaste|good morning|good evening|good afternoon)/)) {
    return `👋 **Hello! Welcome to CureChat AI!**

I'm your AI Health Assistant, here to help you with:

- 🔍 **Symptom Checking** — Describe your symptoms and I'll help analyze them
- 💊 **Medicine Information** — Get details about medications and dosages
- 💡 **Health Tips** — Personalized wellness and nutrition advice
- 🩺 **Doctor Guidance** — Find the right specialist for your needs
- ⏰ **Medicine Reminders** — Set up your medication schedule

**How can I help you today?** Just type your health question or concern! 😊

> ⚠️ *Disclaimer: I provide general health information only. Always consult a qualified healthcare professional for medical decisions.*`;
  }

  // Headache
  if (msg.match(/headache|head pain|head ache|migraine|head hurt/)) {
    return `🤕 **I understand you're experiencing headaches. Let me help you assess this.**

**Common causes of headaches include:**
- **Tension headaches** — caused by stress, poor posture, or eye strain
- **Migraines** — often one-sided, with sensitivity to light/sound
- **Dehydration** — not drinking enough water
- **Sinus headaches** — due to congestion or infection
- **Eye strain** — from extended screen time

**Immediate relief tips:**
1. 💧 Drink plenty of water (at least 2-3 glasses)
2. 🛏️ Rest in a quiet, dark room
3. 🧊 Apply a cold compress to your forehead
4. 🧘 Practice deep breathing to reduce tension
5. 📱 Take a break from screens

**When to see a doctor:**
- Headache lasts more than 3 days
- Severe sudden headache ("worst headache of your life")
- Accompanied by fever, stiff neck, confusion, or vision changes
- Getting worse over time

**Would you like to tell me more about your headache?** For example:
- How long have you had it?
- Is it one-sided or all over?
- Any other symptoms?

> ⚠️ *If you're experiencing a sudden, severe headache with neck stiffness or confusion, please seek emergency medical attention immediately.*`;
  }

  // Fever
  if (msg.match(/fever|temperature|hot|chills|shivering/)) {
    return `🌡️ **Let me help you with your fever concern.**

**Understanding fever:**
- Normal body temperature: **97°F to 99°F (36.1°C to 37.2°C)**
- Low-grade fever: **99°F to 100.3°F**
- Fever: **100.4°F (38°C) and above**

**Common causes:**
- Viral infections (cold, flu, COVID-19)
- Bacterial infections
- Inflammatory conditions
- Heat exhaustion

**Home care for fever:**
1. 💧 **Stay hydrated** — water, ORS, coconut water, soups
2. 🛏️ **Rest** — your body needs energy to fight infection
3. 🧣 **Light clothing** — don't bundle up too much
4. 🧊 **Cool compress** on forehead
5. 🍲 **Light, nutritious food** — khichdi, soup, fruits

**Seek immediate medical help if:**
- Temperature exceeds **103°F (39.4°C)**
- Fever persists for more than **3 days**
- Accompanied by severe headache, rash, or difficulty breathing
- In infants under 3 months with any fever

**Can you tell me your current temperature and how long you've had the fever?**

> ⚠️ *This is general guidance. Please consult a doctor for proper diagnosis and treatment.*`;
  }

  // Cold/Cough/Flu
  if (msg.match(/cold|cough|flu|sneez|runny nose|sore throat|throat pain|congestion/)) {
    return `🤧 **I can see you're dealing with cold/flu symptoms. Here's what might help:**

**Common cold vs flu:**
| | Common Cold | Flu |
|---|---|---|
| Onset | Gradual | Sudden |
| Fever | Rare/mild | High (102-104°F) |
| Body aches | Mild | Severe |
| Duration | 7-10 days | 1-2 weeks |

**Home remedies that work:**
1. 🍵 **Warm liquids** — ginger tea with honey, turmeric milk, warm soup
2. 🧂 **Salt water gargle** — for sore throat (½ tsp salt in warm water)
3. 💨 **Steam inhalation** — add eucalyptus oil for better relief
4. 🍯 **Honey** — natural cough suppressant (1-2 tsp)
5. 💧 **Stay hydrated** — at least 8-10 glasses of water daily
6. 🛏️ **Adequate rest** — sleep 8+ hours
7. 🍊 **Vitamin C** — oranges, amla, lemon water

**When to see a doctor:**
- Symptoms last more than 10 days
- High fever (above 103°F)
- Difficulty breathing or chest pain
- Symptoms improve then worsen again

**Would you like more specific advice?** Tell me which symptoms are bothering you most.

> ⚠️ *Consult a healthcare professional if symptoms are severe or persistent.*`;
  }

  // Stomach/Digestion
  if (msg.match(/stomach|digest|nausea|vomit|diarr|constipat|acidity|gas|bloat|abdomen|belly|tummy/)) {
    return `🤢 **Let me help you with your digestive concern.**

**Common digestive issues and remedies:**

**For Acidity/Heartburn:**
- Drink cold milk or buttermilk
- Avoid spicy, oily, and acidic foods
- Don't lie down right after eating
- Eat smaller, frequent meals

**For Nausea/Vomiting:**
- Sip ginger tea or chew on ginger
- Eat bland foods (crackers, toast, rice)
- Stay hydrated with ORS or electrolyte drinks
- Avoid strong smells

**For Constipation:**
- Increase fiber intake (fruits, vegetables, whole grains)
- Drink warm water in the morning
- Exercise regularly
- Include yogurt/curd in your diet

**For Gas/Bloating:**
- Drink ajwain (carom seeds) water
- Avoid carbonated drinks
- Eat slowly and chew properly
- Walk for 15-20 mins after meals

**See a doctor if:**
- Severe abdominal pain
- Blood in stool or vomit
- Symptoms last more than a week
- Unexplained weight loss

**Which specific issue are you facing?** I can give more targeted advice.

> ⚠️ *This is general guidance. Please consult a gastroenterologist for persistent issues.*`;
  }

  // Stress/Mental Health/Anxiety
  if (msg.match(/stress|anxi|depress|mental|sleep|insomnia|worry|tension|sad|lonely|panic/)) {
    return `🧠 **Your mental health matters. I'm here to help.**

**Managing Stress & Anxiety:**

1. 🧘 **Deep Breathing (4-7-8 technique):**
   - Inhale for 4 seconds
   - Hold for 7 seconds
   - Exhale for 8 seconds
   - Repeat 4-5 times

2. 🏃 **Physical Activity:**
   - 30 minutes of walking daily
   - Yoga or stretching
   - Any exercise you enjoy

3. 📱 **Digital Detox:**
   - Limit social media to 30 mins/day
   - No screens 1 hour before bed
   - Set boundaries for work messages

4. 🛏️ **Better Sleep:**
   - Fixed sleep schedule (same time daily)
   - Dark, cool room
   - Avoid caffeine after 2 PM
   - Relaxation techniques before bed

5. 🍎 **Nutrition for Mental Health:**
   - Omega-3 rich foods (fish, walnuts)
   - Dark chocolate (in moderation)
   - Green vegetables
   - Reduce sugar and processed foods

6. 🤝 **Social Connection:**
   - Talk to friends or family
   - Join support groups
   - Don't hesitate to seek professional help

**Please reach out for professional help if:**
- Feeling hopeless or having thoughts of self-harm
- Anxiety interfering with daily life
- Persistent sadness for more than 2 weeks

**You're not alone. Would you like to talk more about what you're feeling?** 💙

> 🆘 *If you're in crisis, please contact a mental health helpline: iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345*`;
  }

  // Medicine/Medication
  if (msg.match(/medicine|medication|tablet|drug|dose|dosage|paracetamol|ibuprofen|antibiotic/)) {
    return `💊 **Let me help you with medicine information.**

**Important Medicine Safety Tips:**

1. **Always follow your doctor's prescription** — never self-medicate
2. **Read the label** — check dosage, frequency, and expiry date
3. **Take at the right time** — some medicines work better with food, some without
4. **Complete the course** — especially antibiotics, don't stop mid-course
5. **Store properly** — cool, dry place away from sunlight

**Common OTC Medicines (General Info Only):**

| Medicine | Used For | Note |
|----------|----------|------|
| Paracetamol (500mg) | Fever, mild pain | Max 4g/day |
| ORS | Dehydration | Mix in clean water |
| Antacids | Acidity | Take after meals |
| Cetirizine | Allergies | May cause drowsiness |

**Setting Up Medicine Reminders:**
I can help you organize your medication schedule! Just tell me:
- Medicine name
- Dosage
- How many times per day
- With or without food

**⚠️ Important:**
- Never share prescription medicines
- Don't mix medicines without consulting a doctor
- Report any side effects to your doctor immediately

**What specific medicine information do you need?**

> ⚠️ *I provide general information only. Always consult your doctor or pharmacist for medical advice.*`;
  }

  // Doctor/Specialist
  if (msg.match(/doctor|specialist|consult|appointment|hospital|clinic|which doctor/)) {
    return `🩺 **Let me help you find the right doctor!**

**Common Specialists & When to Visit:**

| Specialist | Visit For |
|------------|-----------|
| **General Physician** | Fever, cold, general checkup |
| **Cardiologist** | Chest pain, heart issues, BP |
| **Dermatologist** | Skin problems, acne, rashes |
| **Orthopedic** | Bone/joint pain, fractures |
| **Pediatrician** | Children's health issues |
| **Gynecologist** | Women's health, pregnancy |
| **Neurologist** | Headaches, nerve issues |
| **Psychiatrist** | Mental health, anxiety, depression |
| **ENT Specialist** | Ear, nose, throat problems |
| **Ophthalmologist** | Eye problems, vision issues |
| **Dentist** | Tooth/gum problems |
| **Gastroenterologist** | Digestive issues |

**You can browse our doctors list!** 👉 Visit the **[Doctors Page](/doctors)** to:
- Search by specialization
- View doctor profiles and ratings
- Book appointments directly

**You can also book an appointment** 👉 Visit the **[Appointment Page](/appointment)**

**What symptoms are you experiencing?** I can suggest the right specialist for you!

> ⚠️ *For emergencies, please call 108 (ambulance) or go to the nearest hospital immediately.*`;
  }

  // Health Tips
  if (msg.match(/health tip|healthy|fitness|diet|nutrition|exercise|wellness|lifestyle|weight/)) {
    return `💡 **Here are some personalized health tips for you!**

**🍎 Nutrition:**
- Eat 5 servings of fruits and vegetables daily
- Reduce sugar and processed foods
- Include protein in every meal
- Drink 3-4 liters of water daily
- Add nuts and seeds to your diet

**🏃 Exercise:**
- 30 minutes of moderate exercise daily
- Mix cardio + strength training
- Take 10,000 steps daily
- Stretch every 2 hours if sitting
- Find an activity you enjoy!

**🛏️ Sleep:**
- Get 7-8 hours of quality sleep
- Fixed sleep and wake times
- No screens 1 hour before bed
- Keep bedroom cool and dark

**🧠 Mental Wellness:**
- Practice mindfulness for 10 mins daily
- Take breaks during work
- Connect with friends and family
- Limit social media usage
- Do something you love daily

**🏥 Preventive Care:**
- Annual health checkup
- Regular dental visits
- Stay updated on vaccinations
- Monitor BP and blood sugar
- Maintain healthy BMI

**Want specific tips on any area?** Just ask about:
- Weight management
- Heart health
- Immunity boosting
- Skin care
- Eye care

> 💪 *Small daily habits lead to big health improvements!*`;
  }

  // Thank you / Bye
  if (msg.match(/thank|thanks|bye|goodbye|see you|take care/)) {
    return `😊 **You're welcome! Take care of your health!**

Remember:
- 💧 Stay hydrated
- 🛏️ Get enough sleep
- 🍎 Eat healthy
- 🏃 Stay active
- 😊 Stay positive

Feel free to come back anytime you have health questions. **CureChat AI** is always here for you! 🏥

**Stay healthy! 💙**`;
  }

  // Default response for anything else
  return `🤖 **I'm CureChat AI Health Assistant!**

Thank you for your message. I'm here to help you with health-related questions.

**I can assist you with:**

- 🔍 **Symptom Checking** — Tell me your symptoms (e.g., "I have a headache and fever")
- 💊 **Medicine Information** — Ask about medications and dosages
- 💡 **Health Tips** — Get wellness, nutrition, and fitness advice
- 🩺 **Doctor Guidance** — Find the right specialist
- ⏰ **Medicine Reminders** — Set up your medication schedule
- 🧠 **Mental Health** — Stress management and wellness tips

**Try asking me something like:**
- "I've been having headaches for 2 days"
- "What are some good health tips?"
- "Which doctor should I see for back pain?"
- "Help me set up a medicine reminder"

**How can I help you today?** 😊

> ⚠️ *I provide general health guidance. For emergencies, call 108 or visit the nearest hospital.*`;
}

// Send message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    const { message, chatId, category } = req.body;
    const userId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    let chat;
    
    if (chatId) {
      // Continue existing chat
      chat = await ChatHistory.findOne({ _id: chatId, userId });
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found.' });
      }
    } else {
      // Create new chat
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      chat = new ChatHistory({
        userId,
        title,
        category: category || 'general',
        messages: []
      });
    }

    // Add user message
    chat.messages.push({ role: 'user', content: message });

    // Build conversation history for Gemini
    const conversationHistory = chat.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Try Gemini AI first, fallback to smart responses
    let aiResponse = null;

    // Attempt Gemini API
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite'];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: {
            role: 'user',
            parts: [{ text: SYSTEM_PROMPT }]
          }
        });
        
        const chatSession = model.startChat({
          history: conversationHistory.slice(0, -1),
        });

        const result = await chatSession.sendMessage(message);
        aiResponse = result.response.text();
        console.log(`✅ AI response from ${modelName}`);
        break;
      } catch (modelError) {
        console.log(`⚠️ Model ${modelName} failed: ${modelError.status || modelError.message}`);
        if (modelError.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // If Gemini fails, use smart fallback
    if (!aiResponse) {
      console.log('🔄 Using smart fallback response');
      aiResponse = getSmartFallbackResponse(message);
    }

    // AI Mood Detection - Analyze message sentiment
    const moodPrompt = `Analyze this user message for mental health indicators and return ONLY JSON:
    \`\`\`
    {
      "moodDetected": "positive|neutral|negative|crisis",
      "severity": "mild|moderate|severe",
      "confidence": 0.0-1.0,
      "suggestions": "array of 1-3 coping tips",
      "helplinesNeeded": true/false
    }
    Message: "${message}"
    \`\`\``;

    let moodAnalysis = { moodDetected: 'neutral', severity: 'mild' };
    let isCrisis = false;
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(moodPrompt);
      const analysisText = result.response.text();
      moodAnalysis = JSON.parse(analysisText);
    } catch (analysisError) {
      console.log('Mood analysis fallback');
    }

    // Update chat with mood tag
    chat.moodDetected = moodAnalysis.moodDetected || 'neutral';
    
    // Auto-log mood if negative/crisis
    if (moodAnalysis.moodDetected === 'negative' || moodAnalysis.moodDetected === 'crisis') {
      await mentalHealthController.logMood({
        body: {
          moodScore: moodAnalysis.moodDetected === 'crisis' ? 1 : 2,
          notes: `Chat-triggered: ${message.substring(0, 100)}`,
          sentiment: moodAnalysis.moodDetected,
          checkinType: 'chat-triggered',
          detectedMood: moodAnalysis.moodDetected
        },
        user: { _id: userId }
      }, { json: () => {} });
      
      if (moodAnalysis.helplinesNeeded) {
        aiResponse += `\n\n🆘 **Immediate Support**: Contact iCall (9152987821) or Vandrevala (1860-2662-345) - 24/7 helplines`;
        isCrisis = true;
      }
    }

    // Add AI response to chat
    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();


    res.json({
      chatId: chat._id,
      response: aiResponse,
      title: chat.title
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
};

// Get all chats for user
exports.getChats = async (req, res) => {
  try {
    const chats = await ChatHistory.find({ userId: req.user._id, isActive: true })
      .select('title category createdAt updatedAt messages')
      .sort({ updatedAt: -1 });

    const chatList = chats.map(chat => ({
      id: chat._id,
      title: chat.title,
      category: chat.category,
      messageCount: chat.messages.length,
      lastMessage: chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1].content.substring(0, 80) 
        : '',
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    }));

    res.json({ chats: chatList });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats.' });
  }
};

// Get single chat with messages
exports.getChat = async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ 
      _id: req.params.id, 
      userId: req.user._id,
      isActive: true 
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    res.json({ chat });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat.' });
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  try {
    const chat = await ChatHistory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    res.json({ message: 'Chat deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat.' });
  }
};
