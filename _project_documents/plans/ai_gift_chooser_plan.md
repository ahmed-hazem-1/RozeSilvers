# Feature Plan: AI Jewelry & Gift Chooser Concierge (مساعد روز الذكي لاختيار القطع والهدايا)

> **Feature Status:** Active Plan / UI & Architecture Specification  
> **Target Goal:** Deliver an ultra-premium, interactive AI concierge experience that greets visitors, guides them through an elegant step-by-step quiz in a sliding side drawer, and communicates with a dedicated LLM Agent API (connected to the jewelry database) to recommend the exact matching pieces.

---

## 1. Complete User Journey & Flow

```
1. Entry Prompt (Welcome Invitation Modal / Banner)
   ┌────────────────────────────────────────────────────────────────────────┐
   │ "Allow our AI Concierge to assist you in discovering the ideal piece"  │
   │ "هل تودين أن يساعدك مستشارنا الذكي في اختيار القطعة الفضية المثالية؟"   │
   │                                                                        │
   │      [ Discover My Match / نعم، ساعدني ]    [ Not Now / ليس الآن ]      │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │ (User clicks "Discover My Match")
                                       ▼
2. Sliding Side Page / Luxury Drawer (Side Sheet Flow)
   ┌────────────────────────────────────────────────────────────────────────┐
   │ Header: AI Jewelry Concierge  [Step 1 of 4]                        [✕] │
   │ ────────────────────────────────────────────────────────────────────── │
   │ (Thin 1px progress bar showing step completion percentage)             │
   │                                                                        │
   │ Step 1: Who is this for & Occasion?                                    │
   │   • Selection chips (Self, Partner, Mother, Friend)                    │
   │   • Occasion (Everyday Luxury, Anniversary, Birthday, Special Gift)    │
   │   [ Back / السابق ]                                 [ Next → / التالي ]│
   ├────────────────────────────────────────────────────────────────────────┤
   │ Step 2: Jewelry Categories (Multi-select)                              │
   │   • [✓] Rings (خواتم)   [✓] Necklaces (سلاسل)   [ ] Bracelets (أساور)  │
   │   • [ ] Earrings (أقراط) [ ] Anklets (خلاخيل)                          │
   │   [ Back / السابق ]                                 [ Next → / التالي ]│
   ├────────────────────────────────────────────────────────────────────────┤
   │ Step 3: Aesthetic & Style Vibe                                         │
   │   • Minimal & Subtle (ناعم ورقيق)  • Classic & Timeless (كلاسيكي فخم)   │
   │   • Modern Statement (عصري وجريء)  • Sparkling Zircon (مرصع بالزركون)   │
   │   [ Back / السابق ]                                 [ Next → / التالي ]│
   ├────────────────────────────────────────────────────────────────────────┤
   │ Step 4: Budget Range                                                   │
   │   • Under 600 EGP  • 600 - 1,500 EGP  • 1,500+ EGP  • Any Budget       │
   │   [ Back / السابق ]                     [ Curate My Selection ✦ / ابحث ]│
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │ (Payload sent to LLM Agent API)
                                       ▼
3. AI Analysis & Curated Results Presentation
   ┌────────────────────────────────────────────────────────────────────────┐
   │ "Curating your tailored 925 silver selection..."                       │
   │ "جاري اختيار القطع الفضية الأنسب لذوقك بعناية..."                       │
   │                                                                        │
   │ ✦ Top Recommendation: "Luna Sterling Silver Necklace"                  │
   │   • Price: 850 EGP                                                     │
   │   • Rationale: "Matches your subtle minimalist everyday preference     │
   │     with timeless 925 sterling silver craftsmanship."                  │
   │   [ View Product / عرض القطعة ]        [ Add to Cart / أضيفي للسلة ]   │
   │                                                                        │
   │ ✦ Suggested Matching Pairing: "Solitaire Band Ring (650 EGP)"          │
   │   [ Add Complete Gift Set to Cart / إضافة الطقم بالكامل للسلة ]         │
   └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bilingual Support & RTL Localization (EN & AR)

### 2.1 UI & Layout Direction (Bi-directional Mirroring)
* **English (LTR):**
  * Drawer slides in smoothly from the **Right** (`transform: translateX(100%)` → `translateX(0)`).
  * Next arrow points right (`Next →`), Back arrow points left (`← Back`).
  * Typography: Headings in `Playfair Display`, Body/Buttons in `Inter`.
* **Arabic (RTL):**
  * Drawer slides in smoothly from the **Left** (`transform: translateX(-100%)` → `translateX(0)`).
  * Next arrow points left (`← التالي`), Back arrow points right (`السابق →`).
  * Typography: Headings in `Amiri`, Body/Buttons in `Tajawal`.
* **CSS Logical Properties:**
  * Uses `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `inset-inline-end`, and `text-align: start` to ensure automated flawless RTL flipping.

### 2.2 Complete Translation Dictionary Matrix (`messages/en.json` & `messages/ar.json`)

```json
// AI Chooser translations structure
"aiChooser": {
  "prompt": {
    "title": "AI Jewelry Concierge",
    "subtitle": "Allow our stylist to assist you in discovering the ideal silver jewelry or gift.",
    "ctaStart": "Discover My Match",
    "ctaDismiss": "Not Now"
  },
  "drawer": {
    "headerTitle": "AI Jewelry Concierge",
    "stepCounter": "Step {current} of {total}",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "submit": "Curate My Selection ✦",
    "loadingTitle": "Curating Your Selection",
    "loadingSubtitle": "Analyzing your preferences and matching with our 925 silver collection..."
  },
  "step1": {
    "title": "Who is this for?",
    "subtitle": "Select the recipient and the occasion",
    "recipientLabel": "Recipient",
    "occasionLabel": "Occasion",
    "options": {
      "self": "For Myself",
      "partner": "Partner / Wife",
      "mother": "Mother",
      "friend": "Friend",
      "everyday": "Everyday Luxury",
      "anniversary": "Anniversary",
      "birthday": "Birthday",
      "specialGift": "Special Surprise"
    }
  },
  "step2": {
    "title": "What pieces are you looking for?",
    "subtitle": "Choose one or more categories",
    "options": {
      "rings": "Rings",
      "necklaces": "Necklaces",
      "bracelets": "Bracelets",
      "earrings": "Earrings",
      "anklets": "Anklets"
    }
  },
  "step3": {
    "title": "Preferred Style & Aesthetic",
    "subtitle": "Select the aesthetic that best describes their taste",
    "options": {
      "minimal": "Minimal & Subtle",
      "classic": "Classic & Timeless",
      "statement": "Modern Statement",
      "zircon": "Sparkling Zircon Pavé"
    }
  },
  "step4": {
    "title": "Budget Range",
    "subtitle": "Choose your preferred price range in EGP",
    "options": {
      "under600": "Under 600 EGP",
      "600to1500": "600 – 1,500 EGP",
      "above1500": "1,500+ EGP",
      "any": "Explore All Budgets"
    }
  },
  "results": {
    "title": "Curated for You",
    "subtitle": "Based on your selections, our AI recommends these handcrafted pieces:",
    "matchScore": "{score}% Match",
    "whyWeChoseThis": "Why this fits",
    "viewProduct": "View Details",
    "addToCart": "ADD TO CART",
    "pairingTitle": "Perfect Pairing / Gift Set",
    "addBundle": "Add Complete Set to Cart",
    "retake": "Retake Quiz"
  },
  "errors": {
    "general": "Unable to curate selections at this time. Please try again.",
    "retry": "Try Again"
  }
}
```

```json
// Arabic Translation equivalent
"aiChooser": {
  "prompt": {
    "title": "مستشار روز الذكي",
    "subtitle": "دع مستشارنا يساعدك في اختيار القطعة الفضية المثالية أو الهدية المناسبة بكل دقة.",
    "ctaStart": "ابدأ الآن",
    "ctaDismiss": "ليس الآن"
  },
  "drawer": {
    "headerTitle": "مساعد روز الذكي للمجوهرات",
    "stepCounter": "خطوة {current} من {total}",
    "close": "إغلاق",
    "back": "السابق",
    "next": "التالي",
    "submit": "استكشف اختياراتي ✦",
    "loadingTitle": "جاري انتقاء القطع بعناية",
    "loadingSubtitle": "نقوم الآن بمطابقة تفضيلاتك مع أحدث تشكيلات الفضة عيار 925..."
  },
  "step1": {
    "title": "لمن هذه القطعة؟",
    "subtitle": "حددي المستلم ونوع المناسبة",
    "recipientLabel": "المستلم",
    "occasionLabel": "المناسبة",
    "options": {
      "self": "شراء شخصي (لنفسي)",
      "partner": "الشريكة / الزوجة",
      "mother": "الأم الغالية",
      "friend": "صديقة مقربة",
      "everyday": "إطلالة يومية راقية",
      "anniversary": "ذكرى سنوية / خطوبة",
      "birthday": "عيد ميلاد",
      "specialGift": "مفاجأة خاصة"
    }
  },
  "step2": {
    "title": "ما هي القطع المفضلة؟",
    "subtitle": "يمكنك اختيار فئة واحدة أو أكثر",
    "options": {
      "rings": "خواتم",
      "necklaces": "سلاسل وقلادات",
      "bracelets": "أساور وأنسيالات",
      "earrings": "أقراط وحلقان",
      "anklets": "خلاخيل"
    }
  },
  "step3": {
    "title": "الذوق والطابع المفضل",
    "subtitle": "اختاري الأسلوب الأقرب للذوق المطلوب",
    "options": {
      "minimal": "ناعم وهادئ (Minimal)",
      "classic": "كلاسيكي فخم (Timeless)",
      "statement": "عصري وجريء (Statement)",
      "zircon": "مرصع بالزركون اللامع"
    }
  },
  "step4": {
    "title": "نطاق الميزانية",
    "subtitle": "حددي النطاق السعري المناسب بالجنيه المصري",
    "options": {
      "under600": "أقل من 600 ج.م",
      "600to1500": "600 إلى 1,500 ج.م",
      "above1500": "أكثر من 1,500 ج.م",
      "any": "عرض جميع الخيارات"
    }
  },
  "results": {
    "title": "القطع المختارة لكِ بعناية",
    "subtitle": "بناءً على إجاباتك، يقترح عليك المستشار الذكي القطع التالية المصنوعة من الفضة 925:",
    "matchScore": "نسبة التطابق {score}%",
    "whyWeChoseThis": "لماذا تناسبك هذه القطعة؟",
    "viewProduct": "تفاصيل القطعة",
    "addToCart": "أضيفي للسلة",
    "pairingTitle": "تنسيق متكامل / طقم هدية",
    "addBundle": "إضافة الطقم بالكامل للسلة",
    "retake": "إعادة الاختيار"
  },
  "errors": {
    "general": "تعذر العثور على اقتراحات حالياً. يرجى المحاولة مرة أخرى.",
    "retry": "إعادة المحاولة"
  }
}
```

---

## 3. Theme & Quiet Luxury Styling Compliance (`design.md`)

| Element | Design Token / Value | Strict Rules & Negative Constraints |
|---------|----------------------|-------------------------------------|
| **Background (Drawer / Modal)** | `#FFFFFF` | No loud gradients, patterns, or glass blur behind text. Solid clean white. |
| **Backdrop Overlay** | `rgba(17, 17, 17, 0.4)` + `backdrop-filter: blur(8px)` | High-end frosted feel focusing attention on the drawer. |
| **Primary Text** | `#111111` | Pure black (`#000000`) is **strictly forbidden**. |
| **Muted Subtitles** | `#777777` | 14px / 12px with ample line-height (`1.6`). |
| **Border Radius** | `0px` (or `2px` max) | **No rounded pills / SaaS round buttons**. Sharp luxury edges only. |
| **Hairline Borders** | `1px solid #E0E0E0` (unselected) / `1px solid #111111` (selected) | Unselected options feel light and unobtrusive; selected options gain a crisp solid dark frame. |
| **Action Buttons** | Background `#111111`, Text `#FFFFFF`, uppercase, `letter-spacing: 1.5px` | Hover: `#333333` (smooth `0.4s` transition). |
| **Transitions & Animations** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` with `0.4s` | No bouncy, spring, or jumpy movements. |
| **Mobile Responsiveness** | Full-width `100vw`, `padding-bottom: env(safe-area-inset-bottom)` | Touch targets minimum `44px × 44px`. |

---

## 4. LLM Agent API Integration

### 4.1 Environment Configuration (`.env.local`)
```env
# AI Concierge Agent API
NEXT_PUBLIC_AI_AGENT_API_URL=https://api.your-custom-agent-endpoint.com/v1/recommend
AI_AGENT_API_KEY=your_agent_api_key_here
```

### 4.2 Request Payload
```json
{
  "locale": "ar",
  "preferences": {
    "recipient": "partner",
    "occasion": "anniversary",
    "categories": ["necklaces", "earrings"],
    "style": "minimal",
    "budget": "600-1500_egp"
  }
}
```

### 4.3 Response Payload
```json
{
  "recommendationSummary": "طقم فضة إسترليني 925 ناعم يناسب إطلالة المناسبات والذكرى السنوية بلمسة مينيمال راقية.",
  "products": [
    {
      "handle": "luna-sterling-necklace",
      "title": "قلادة لونا فضة إسترليني 925",
      "matchScore": 98,
      "reason": "سلسلة رقيقة مع دلاية هلالية ناعمة تعكس البساطة والفخامة بدون تكلف.",
      "suggestedPairingHandle": "solitaire-silver-earrings"
    }
  ],
  "giftNoteSuggestion": "صُنعت من الفضة الإسترليني عيار 925 لتخليد أجمل اللحظات معاً."
}
```

---

## 5. Component Implementation Architecture

```
src/components/features/AIChooser/
├── AIChooserLauncher.tsx         # Floating luxury trigger button ("AI Stylist / مستشار روز")
├── WelcomePromptModal.tsx        # Initial subtle invitation modal
├── WelcomePromptModal.module.css # Entry prompt luxury styling
├── AIChooserDrawer.tsx           # Sliding side-sheet drawer container (RTL / LTR aware)
├── AIChooserDrawer.module.css    # Responsive styles, logical properties, transitions
├── steps/
│   ├── StepHeader.tsx            # Step title, subtitle, and thin progress bar
│   ├── StepRecipient.tsx         # Step 1: Recipient & occasion chips
│   ├── StepCategories.tsx        # Step 2: Multi-select jewelry categories
│   ├── StepStyle.tsx             # Step 3: Style & aesthetic chips
│   ├── StepBudget.tsx            # Step 4: Budget range selector
│   └── ResultsView.tsx           # Step 5: Curated recommendations & gift set bundles
├── hooks/
│   └── useAIChooser.ts           # State machine managing active step & answers
├── services/
│   └── aiAgentClient.ts          # API client communicating with LLM agent endpoint
└── types.ts                      # TypeScript interfaces for quiz questions and API payload
```
