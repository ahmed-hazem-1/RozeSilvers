# Design System & Guidelines - Premium Jewelry Store

## 1. الألوان (Color Palette)
التصميم بيعتمد على ألوان هادية جداً ومحايدة عشان يخلي العين تركز على صور المنتجات نفسها، أي ألوان فاقعة هتسحب العين من الفضة.

* **Background Color (الخلفية الأساسية):** `#F9F9F9` 
  * *السبب:* أبيض مايل للرمادي الفاتح جداً، بيدي دفا أكتر من الأبيض الصريح ومبيرهقش العين في التصفح.
* **Card Background (خلفية كارت المنتج):** `#FFFFFF`
  * *السبب:* أبيض صريح عشان يعمل تباين خفيف جداً وشيك مع الخلفية الأساسية.
* **Primary Text (النصوص الأساسية والعناوين):** `#111111` أو `#1A1A1A`
  * *السبب:* أسود مطفي، أهدأ على العين وأكثر فخامة من الأسود الصريح `#000000`.
* **Secondary Text (النصوص الفرعية والماركات):** `#777777`
  * *السبب:* رمادي متوسط عشان يفصل بين العناوين والتفاصيل بدون ما يشتت الانتباه.
* **Buttons & Accents (الزراير):** 
  * *الخلفية:* `#111111` (سادة بالكامل).
  * *لون النص:* `#FFFFFF`.

---

## 2. الخطوط (Typography)
السر كله في دمج نوعين خطوط: واحد Serif (كلاسيكي بتموجات) للعناوين بيدي إحساس العراقة، وواحد Sans-Serif (مودرن وناعم) للتفاصيل عشان سهولة القراءة.

### **أ. عائلة الخطوط (Font Families):**
* **اللغة الإنجليزية:**
  * **Headings (العناوين):** `Playfair Display` أو `Cinzel`.
  * **Body/UI (النصوص والزراير):** `Inter` أو `Jost` (استخدم أوزان خفيفة 300 و 400 فقط).
* **اللغة العربية (البدائل البريميوم):**
  * **Headings (العناوين):** `Amiri` (خط أميري بيدي نفس الإحساس الكلاسيكي الفخم بتاع الفضة والمجوهرات).
  * **Body/UI (النصوص والزراير):** `Tajawal` أو `IBM Plex Sans Arabic`. (خطوط ناعمة جداً ولما بتصغر بتبان شيك ومقروءة).

### **ب. الأحجام والأوزان (Sizing & Weights):**
* *ملاحظة:* الحجم الصغير هو اللي بيدي الـ Premium Feel.
* **Hero Title (العنوان الرئيسي في أول صفحة):** `48px` لـ `56px` (وزن الخط: Normal أو 400، بلاش Bold خالص).
* **Section Title (عناوين الأقسام زي Best Selling):** `32px`.
* **Navigation (المنيو العلوية):** `13px` (صغير جداً وشيك).
* **Product Title (اسم المنتج جوه الكارت):** `14px` (وزن 500/Medium).
* **Product Brand/Subtitle (اسم المصمم أو الماركة):** `12px` (Italic - مائل).
* **Price (السعر):** `13px` (وزن 600/Semi-bold).

---

## 3. شكل الكارت (Product Card Structure)
الكارت هنا مفيش فيه أي "دوشة"، معتمد على النظافة التامة وإبراز المنتج:

* **Border-Radius (حواف الكارت):** `0px` (حادة تماماً) أو `2px` بالكتير. الزوايا الحادة بتدي إحساس بالفخامة والجدية أكتر من الزوايا المدورة.
* **Padding (المسافات الداخلية):** `16px` جوه الكارت حوالين الكلام.
* **Image Proportion (نسبة الصورة):** الصورة بتاخد حوالي `75%` من مساحة الكارت، ومساحة الكلام تحتها `25%`.
* **Icons (الأيقونات):** الأيقونات زي (القلب بتاع الـ Wishlist والنجمة بتاعت التقييم) تكون بحجم `16px` وخطوطها رفيعة جداً (Stroke 1px).

---

## 4. التأثيرات والحركة (Hover & Transitions)
الحركة لازم تكون ناعمة جداً وبطيئة نسبياً عشان تناسب الـ Premium Feel. الحركة السريعة بتدي إحساس رخيص.

* **Transition Time (التوقيت العام لأي حركة):** 
  `transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);`
  *(ده بيدي حركة سموث جداً بتبدأ سريعة وتبطأ في الآخر براحة).*

* **Product Card Hover (تأثير الوقوف على الكارت):**
  * **Before:** `box-shadow: none; transform: translateY(0);`
  * **After (Hover):** `box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.04); transform: translateY(-4px);`
  *(رفعة بسيطة جداً لفوق مع شادو خفيف أوي يكاد يكون مش متشاف بس بيحسسك بالعمق).*

* **Product Image Hover (تأثير الوقوف على صورة المنتج):**
  * **Before:** `transform: scale(1);`
  * **After (Hover):** `transform: scale(1.04);` 
  *(زوم إن خفيف جداً جوه الصورة من غير ما الكارت نفسه يكبر أو أبعاده تتغير).*

* **Buttons Hover (تأثير الوقوف على الزراير):**
  * **Before:** `background-color: #111111; color: #FFFFFF;`
  * **After (Hover):** `background-color: #333333;` (بيفتح درجة بسيطة) أو ممكن تعمل تأثير إن الزرار يملى بلون أبيض والنص يبقى أسود مع `border: 1px solid #111111`.

---

## 5. الترتيب والهيكلة (Layout Structure)

* **Header (المنيو العلوية):** 
  * اللوجو على الشمال (أو اليمين في النسخة العربية).
  * اللينكات في النص أو مترحلة شوية.
  * أيقونات (البحث، السلة، الحساب) على الطرف التاني، وتكون أيقونات بخطوط رفيعة (Light Icons) مش مليانة (Solid).
* **Hero Section (القسم الرئيسي):** 
  * تصميم Asymmetric (غير متماثل).
  * النص واخد مساحة كبيرة ومريح، والصور متوزعة بأحجام مختلفة (صورة كبيرة وصورة صغيرة متداخلة) عشان تكسر الملل.
* **Product Grid (شبكة المنتجات):**
  * المسافات (Gaps) بين الكروت لازم تكون واسعة: `gap: 24px` أو `32px`.
  * الـ Padding بتاع الـ Sections كلها لازم يكون كبير: `padding: 80px 0;` (المساحات الفاضية هي اللي بتعمل الفخامة).

---

## 6. أبعاد الموبايل (Mobile Responsiveness)

* **Container Padding:** `padding: 0 16px;` عشان المحتوى ميكونش لازق في حواف الشاشة.
* **Hero Section:** الصور هتنزل تحت بعض، والعنوان الرئيسي هيصغر لـ `36px` عشان مياخدش مساحة مبالغ فيها.
* **Product Grid (المنتجات على الموبايل):**
  * **الخيار الأول والأفضل:** كارت واحد في الصف (1 Column) عشان الصورة تبان بتفاصيلها وتفضل محتفظة بالبريميوم لوك.
  * **الخيار التاني:** لو أصريت على 2 كارت في الصف، قلل الـ Padding جوه الكارت لـ `8px` وصغر حجم الخطوط لـ `11px` لأسماء المنتجات و `12px` للسعر.
* **المنيو (Mobile Menu):** تتحول لـ Hamburger Icon (خطوط رفيعة)، ولما تفتح تاخد الشاشة كلها بخلفية بيضاء ولون المنيو أسود بحجم كبير وتتوسط الشاشة.

---

## 7. الممنوعات الصارمة (Negative Constraints - What NOT to do)
في التصميمات الـ Premium والـ High-end، اللي مش هتعمله أهم بكتير من اللي هتعمله. الغلطة البسيطة بتضرب إحساس الفخامة كله.

### **أ. المساحات والزحمة (Spacing & Layout):**
* ❌ **ممنوع حشر العناصر (No Tight Spacing):** إياك تستخسر المساحات الفاضية (White Space). المساحات دي هي اللي بتنطق التصميم وتديه فخامة. ممنوع الـ Margins والـ Paddings القليلة بين الأقسام أو جوه الكروت.
* ❌ **ممنوع التماثل الممل (Avoid 100% Symmetry):** بلاش كل السكاشن تكون عبارة عن شبكة (Grid) متساوية ومترصة زي بعض بالظبط. كسر التماثل بيدي إحساس فني أكتر.

### **ب. الألوان والظل (Colors & Shadows):**
* ❌ **ممنوع استخدام الأسود الصريح (`#000000`):** الأسود الصريح بيعمل تباين حاد جداً بيتعب العين ومش بيبان غالي. دايماً استخدم درجات الأسود المطفي زي `#111111` أو `#1A1A1A`.
* ❌ **ممنوع استخدام ألوان فاقعة (No Loud Accents):** حتى لو بتعمل زرار "خصم" أو "Sale"، إياك تستخدم الأحمر الفاقع أو الأخضر النيون. استخدم ألوان باهتة (Muted) أو باستيل.
* ❌ **ممنوع الشادو التقيل (No Dark Box-Shadows):** أي شادو بتعمله لازم يكون شفاف لدرجة إنك تشك إنه موجود (مثلاً `rgba(0,0,0, 0.04)`). الشادو التقيل بتاع الـ Default Bootstrap بيدي إحساس رخيص جداً.

### **ج. الخطوط (Typography):**
* ❌ **ممنوع استخدام الخطوط التقليدية:** زي (Arial, Tahoma, Times New Roman) في الإنجليزي، أو الخطوط الديفولت في العربي. دي بتقتل أي براندينج.
* ❌ **ممنوع الأوزان التقيلة (No Heavy Bold):** بلاش تستخدم Font-weight 700 و 800 و 900 عمال على بطال، بالذات في العناوين الكبيرة. الفخامة دايماً بتيجي من الأوزان الخفيفة والمتوسطة (300, 400, 500).

### **د. العناصر والحواف (UI Elements):**
* ❌ **ممنوع الزوايا المدورة بزيادة (No Big Border-Radius):** الزوايا المدورة (زي `12px` و `16px`) بتدي إحساس إن ده أبلكيشن SaaS أو حاجة تكنولوجي/أطفال. في المجوهرات، الحواف لازم تكون حادة (`0px`) أو ناعمة بشكل لا يذكر (`2px`) عشان تدي إحساس الكلاسيكية.
* ❌ **ممنوع الحدود السميكة (No Thick Borders):** لو احتجت تفصل بين عنصرين بـ Border، لازم يكون رفيع جداً `1px` ولونه رمادي فاتح جداً (Hairline border).

### **هـ. الحركة والتأثيرات (Animations & Transitions):**
* ❌ **ممنوع الحركة السريعة أو الخبط (No Bouncy/Fast Animations):** أي Hover Effect أو Transition بيحصل في أقل من `0.3s` أو فيه تأثير الـ Bounce (الارتداد) بيبان طفولي. الحركة لازم تكون بطيئة، ناعمة، وانسيابية (Smooth & Elegant).

### **و. الصور (Imagery Constraints):**
* ❌ **ممنوع اختلاف أبعاد الصور:** كل صور المنتجات في الـ Grid لازم تكون متقصوصة بنفس الأبعاد بالمللي (Aspect Ratio واحد). لو صورة مربعة وصورة مستطيلة في نفس الصف، الـ Grid هيبوظ وشكل المتجر هيبقى عشوائي.

---

## 8. نظام المسافات (Spacing Scale)
المسافات الكبيرة والمتسقة هي العمود الفقري لأي تصميم فخم. كل قيمة هنا مبنية على مضاعفات الـ `4px` عشان يكون في إيقاع بصري منتظم.

| Token | القيمة | الاستخدام |
|-------|--------|-----------|
| `--space-2xs` | `4px` | مسافة بين أيقونة ونص جنبها، أو بين نجوم التقييم |
| `--space-xs` | `8px` | مسافة بين اسم المنتج والسعر جوه الكارت |
| `--space-sm` | `12px` | مسافة بين عناصر صغيرة في صف واحد |
| `--space-md` | `16px` | Padding داخلي للكروت، ومسافة بين عناصر الفورم |
| `--space-lg` | `24px` | Gap بين الكروت في الـ Grid (موبايل) |
| `--space-xl` | `32px` | Gap بين الكروت في الـ Grid (ديسكتوب) |
| `--space-2xl` | `48px` | مسافة بين المحتوى والعنوان بتاع السكشن |
| `--space-3xl` | `64px` | Padding عمودي بين الأقسام (موبايل) |
| `--space-4xl` | `80px` | Padding عمودي بين الأقسام (ديسكتوب) |
| `--space-5xl` | `120px` | مسافة الـ Hero Section من فوق وتحت |

* *القاعدة الذهبية:* لو شكيت إنك محتاج مسافة أكبر أو أصغر — **اختار الأكبر دايماً**. المساحة الفاضية في تصميم المجوهرات مش فراغ، دي فخامة.

---

## 9. نقاط الكسر (Breakpoints)
التصميم Mobile-First، بمعنى إن الاستايل الأساسي بيكون للموبايل والـ Media Queries بتضيف التعديلات للشاشات الأكبر.

| Token | القيمة | الاستخدام |
|-------|--------|-----------|
| `--bp-sm` | `480px` | موبايل كبير (بنقسم الـ Grid لـ 2 columns لو اخترنا الخيار التاني) |
| `--bp-md` | `768px` | تابلت — المنيو بتتحول من Hamburger للمنيو الكاملة |
| `--bp-lg` | `1024px` | لابتوب — الـ Grid بيبقى 3 columns، الـ Hero بياخد الشكل الـ Asymmetric |
| `--bp-xl` | `1280px` | ديسكتوب — الـ Grid بيبقى 4 columns |
| `--bp-2xl` | `1440px` | ديسكتوب كبير — max-width بتاع الـ Container |

* **Max Container Width:** `1440px` مع `padding: 0 64px` على الشاشات الكبيرة، عشان المحتوى ميتمددش ويضيع الإحساس بالتركيز.
* **Container Padding (Mobile):** `0 16px` (زي ما اتذكر في سكشن 6).
* **Container Padding (Tablet):** `0 32px`.

---

## 10. الروابط والنصوص التفاعلية (Links & Anchor Styles)
الروابط لازم تكون واضحة بس مش صارخة. الفكرة إنها تندمج مع النص وتبان بس لما تركز عليها.

* **لون الرابط الأساسي:** `#111111` (نفس لون النص الأساسي).
* **Underline:**
  * **Default:** `text-decoration: none;` (مفيش خط تحت).
  * **Hover:** `text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px;`
  *(خط رفيع جداً بيظهر تحت النص بمسافة مريحة لما تقف عليه).*
* **Transition:** `transition: text-decoration-color 0.3s ease;`
* **Footer Links / Secondary Links:**
  * **اللون:** `#777777`.
  * **Hover:** بيتحول لـ `#111111`.
* **Breadcrumb Links:**
  * **اللون:** `#999999` بحجم `12px`.
  * **Separator:** `/` بلون `#CCCCCC`.
  * **Active (الصفحة الحالية):** `#111111` بدون رابط.

---

## 11. عناصر الإدخال (Form Inputs & Search)
الفورم إلمنتس لازم تكون نظيفة وشبه مخفية لحد ما المستخدم يتفاعل معاها.

### **أ. الحقول النصية (Text Inputs):**
* **Border:** `1px solid #E0E0E0` (رمادي فاتح، يكاد يكون مش متشاف).
* **Border-Radius:** `0px` (حاد تماماً زي باقي التصميم).
* **Padding:** `12px 16px`.
* **Font:** `Inter` أو `Jost` بحجم `14px` ووزن `400`.
* **Placeholder Color:** `#BBBBBB`.
* **Focus State:**
  * `border-color: #111111;`
  * `outline: none;`
  * `transition: border-color 0.3s ease;`
  *(البوردر بيغمق بنعومة لما تضغط على الحقل).*

### **ب. شريط البحث (Search Bar):**
* **التصميم:** بيظهر كـ Modal بيغطي الصفحة كلها (Full-screen overlay) بخلفية `rgba(255,255,255, 0.97)`.
* **الحقل جوه:** كبير بحجم `24px` من غير بوردر، بس خط تحتي رفيع `1px solid #E0E0E0`.
* **أيقونة البحث:** `20px` بلون `#777777`.
* **إغلاق:** أيقونة X رفيعة في الزاوية.

### **ج. الأزرار الثانوية (Secondary Buttons):**
* **التصميم:** `background: transparent; border: 1px solid #111111; color: #111111;`
* **Hover:** `background: #111111; color: #FFFFFF;`
* **Padding:** `12px 32px`.
* **Font:** `13px` وزن `500`، حروف متباعدة `letter-spacing: 1.5px; text-transform: uppercase;`

### **د. حقول الاختيار (Select / Dropdown):**
* نفس استايل الـ Text Input بالظبط.
* السهم (Arrow) يكون أيقونة SVG رفيعة بلون `#777777` بدل السهم الديفولت بتاع المتصفح.

---

## 12. الفواصل والخطوط (Dividers & Separators)
الفواصل بتساعد تنظم المحتوى بس لازم تكون خفيفة لدرجة إنها تحس بيها أكتر ما تشوفها.

* **Horizontal Divider (خط أفقي بين الأقسام):**
  * `border-top: 1px solid #EEEEEE;`
  * `margin: 48px 0;` (نفس الـ `--space-2xl`).
* **Card Divider (فاصل داخلي جوه الكارت لو محتاج):**
  * `border-top: 1px solid #F2F2F2;`
  * `margin: 12px 0;`
* **Footer Divider (فاصل فوق الفوتر):**
  * `border-top: 1px solid #E5E5E5;`
* **Vertical Divider (فاصل عمودي بين عناصر في صف):**
  * `border-left: 1px solid #EEEEEE; height: 16px;`

* *القاعدة:* لو الفاصل بان أوي — لونه غامق أوي. دايماً اختبر على شاشة حقيقية مش بس في الكود.

---

## 13. دليل الموبايل الشامل (Comprehensive Mobile Guide)
الموبايل مش مجرد "نفس التصميم بس أصغر". كل عنصر بيتعامل بشكل مختلف على الشاشة الصغيرة. السكشن ده بيغطي **كل حاجة** محتاج تعرفها عشان الموبايل يطلع بنفس الفخامة بتاعت الديسكتوب.

### **أ. الهيدر والنافيجيشن (Mobile Header & Navigation)**

#### **الهيدر نفسه:**
* **Height:** `56px` (أقل من الديسكتوب اللي بيكون `72px` - `80px`).
* **Position:** `position: sticky; top: 0; z-index: 100;` (الهيدر بيفضل ثابت في الأعلى وانت بتعمل سكرول).
* **Background:** `rgba(249, 249, 249, 0.95); backdrop-filter: blur(12px);` (خلفية شبه شفافة مع بلور عشان تحس بالمحتوى ورا).
* **الترتيب:** Hamburger Icon (شمال) ← اللوجو (في النص) ← أيقونات السلة والبحث (يمين).
* **أيقونات الهيدر:** `20px` (أكبر شوية من الديسكتوب عشان الـ Touch Target).
* **Border-bottom:** `1px solid #F0F0F0` (خط رفيع جداً يفصل الهيدر عن المحتوى).

#### **المنيو المفتوحة (Mobile Menu - Full Screen Overlay):**
* **Background:** `#FFFFFF` (أبيض صريح).
* **Animation:** بتدخل من الشمال بـ `transform: translateX(-100%)` → `translateX(0)` في `0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
* **حجم لينكات المنيو:** `28px` - `32px` (كبيرة ومريحة للضغط).
* **وزن الخط:** `300` (خفيف وأنيق).
* **المسافة بين اللينكات:** `24px` عمودي.
* **محاذاة:** اللينكات تتوسط الشاشة عمودياً وأفقياً.
* **الـ Close Button:** أيقونة X بحجم `24px` في الزاوية العلوية اليمنى، بعيدة عن الحافة بـ `16px`.
* **محتوى إضافي:** تحت اللينكات الأساسية، ممكن تحط لينكات ثانوية (زي About, Contact) بحجم `14px` ولون `#777777`.
* **لغة:** لو في Language Switcher، يكون في أسفل المنيو.

---

### **ب. قسم الهيرو (Mobile Hero Section)**
* **التخطيط:** بيتحول من Asymmetric (ديسكتوب) لـ **عمودي بالكامل (Stacked)**.
* **ترتيب العناصر:** النص أولاً ← الصورة/الصور تحت.
* **حجم العنوان:** يصغر من `48px-56px` (ديسكتوب) لـ `32px` - `36px`.
* **وزن العنوان:** يفضل `400` (Normal).
* **النص الفرعي (Subtitle):** `15px` بوزن `300`.
* **الزرار (CTA Button):**
  * `width: 100%;` (بياخد عرض الشاشة كله مع الـ Padding).
  * `padding: 16px 0;` (أطول من الديسكتوب عشان مريح للضغط).
  * `font-size: 13px; letter-spacing: 2px; text-transform: uppercase;`
* **الصورة:** 
  * تاخد `100%` من عرض الشاشة (بدون padding، Edge-to-edge).
  * `aspect-ratio: 4/5;` أو `3/4;` (طولية أحسن من المربعة على الموبايل).
  * `object-fit: cover;`
* **المسافات:**
  * بين العنوان والنص الفرعي: `16px`.
  * بين النص والزرار: `24px`.
  * بين الزرار والصورة: `32px`.
  * Padding عمودي للسكشن كله: `48px 0` (أقل من الديسكتوب).

---

### **ج. شبكة المنتجات (Mobile Product Grid)**

#### **الخيار الأول (الموصى به - Premium):**
* **الشكل:** كارت واحد في الصف (1 Column).
* **عرض الكارت:** `100%` من الـ Container.
* **الصورة:** `aspect-ratio: 4/5;` عشان تبان المنتج بتفاصيله.
* **Gap بين الكروت:** `32px` (مسافة كبيرة عشان كل كارت يتنفس).

#### **الخيار التاني (لو عايز كثافة أكتر):**
* **الشكل:** كارتين في الصف (2 Columns) يبدأ من `480px`.
* **Gap:** `12px` بين الكروت.
* **الصورة:** `aspect-ratio: 1/1;` (مربعة عشان توفر مساحة).
* **حجم اسم المنتج:** `11px` (وزن `500`).
* **حجم السعر:** `12px` (وزن `600`).
* **Padding جوه الكارت:** `8px`.
* **أيقونة الـ Wishlist:** `14px` بدل `16px`.

#### **العنوان بتاع السكشن (Section Title):**
* حجمه يصغر من `32px` (ديسكتوب) لـ `24px`.
* المسافة بينه وبين أول كارت: `24px`.
* ممكن يكون محاذاته `text-align: center;` أو `text-align: start;` (الاتنين شيك).

---

### **د. كارت المنتج على الموبايل (Mobile Product Card)**

* **Border-Radius:** يفضل `0px` (نفس الديسكتوب).
* **Shadow:** `none` — على الموبايل مفيش Hover فالشادو مش محتاجه.
* **الصورة:**
  * `overflow: hidden;` عشان أي Zoom ميطلعش بره الكارت.
  * لو بتستخدم Image Swipe (سحب بين صور المنتج)، حط Dots Indicator تحت الصورة بحجم `6px` بلون `#CCCCCC` والـ Active Dot بلون `#111111`.
* **معلومات المنتج:**
  * **اسم المنتج:** `14px` (وزن `500`) — لو 2 Columns: `11px`.
  * **اسم الماركة:** `11px` (Italic, لون `#777777`).
  * **السعر:** `13px` (وزن `600`) — لو 2 Columns: `12px`.
  * **Padding:** `12px` (بدل `16px` على الديسكتوب).
* **الأيقونات (Wishlist / Quick Add):**
  * لازم تكون بحجم `20px` على الأقل عشان الـ Touch Target يكون كويس.
  * الـ Touch Area الفعلية: `44px × 44px` (حتى لو الأيقونة أصغر، المنطقة اللي بتستجيب للمس لازم تكون `44px` — ده معيار Apple و Google).

---

### **هـ. مقاس الخطوط على الموبايل (Mobile Typography Scale)**

| العنصر | ديسكتوب | موبايل |
|--------|---------|--------|
| Hero Title | `48px` - `56px` | `32px` - `36px` |
| Section Title | `32px` | `24px` |
| Navigation Links | `13px` | Menu: `28px` - `32px` |
| Product Title (1 Col) | `14px` | `14px` (مبيتغيرش) |
| Product Title (2 Col) | — | `11px` |
| Product Brand | `12px` | `11px` |
| Price (1 Col) | `13px` | `13px` (مبيتغيرش) |
| Price (2 Col) | — | `12px` |
| Body Text | `15px` - `16px` | `15px` |
| Small / Caption | `12px` | `11px` |
| Button Text | `13px` | `13px` (مبيتغيرش) |

* *ملاحظة:* على الموبايل الـ `line-height` بيزيد شوية: `1.6` - `1.7` بدل `1.5` عشان القراية تبقى مريحة أكتر.

---

### **و. الأزرار على الموبايل (Mobile Buttons)**

* **Primary Button (الزرار الأساسي):**
  * `width: 100%;` (بياخد عرض الـ Container كله).
  * `padding: 16px 0;` (أطول من الديسكتوب اللي بيكون `12px 32px`).
  * `min-height: 48px;` (عشان الـ Touch Target).
  * `font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;`
* **Secondary Button (الزرار الثانوي):**
  * نفس الكلام: `width: 100%;` و `min-height: 48px;`.
* **أزرار جنب بعض (Side by Side):**
  * لو في أزرار جنب بعض (زي "Add to Cart" و "Buy Now")، على الموبايل ينزلوا تحت بعض (Stack) بـ `gap: 12px;`.
* **Floating Action (زرار عائم):**
  * لو في زرار "Add to Cart" ثابت في أسفل شاشة صفحة المنتج:
  * `position: fixed; bottom: 0; left: 0; right: 0;`
  * `padding: 16px; background: #FFFFFF; border-top: 1px solid #F0F0F0;`
  * `z-index: 50;`
  * الصفحة تحتها بتحتاج `padding-bottom: 80px;` عشان المحتوى ميتخبيش وراه.

---

### **ز. عناصر الإدخال على الموبايل (Mobile Form Inputs)**

* **Text Input:**
  * `font-size: 16px;` (مهم جداً — لو أقل من `16px` الـ iOS هيعمل Auto-Zoom على الحقل وده مزعج جداً).
  * `padding: 14px 16px;` (أكبر شوية من الديسكتوب).
  * `border-radius: 0px;` (نفس النظام).
  * `-webkit-appearance: none;` (عشان تشيل الستايل الديفولت بتاع iOS).
* **Select / Dropdown:**
  * على الموبايل، سيب الـ Native Select بتاع النظام يشتغل (أحسن UX من أي Custom Dropdown).
  * بس غير شكل الحقل نفسه ليكون زي الـ Text Input.
* **Search:**
  * الـ Full-screen overlay بيفضل نفسه.
  * حجم الحقل: `20px` بدل `24px`.
  * بيكون في Focus تلقائي لما الـ Overlay يفتح.
* **Textarea:**
  * `min-height: 120px;`
  * نفس استايل الـ Text Input.

---

### **ح. الفوتر على الموبايل (Mobile Footer)**

* **التخطيط:** كل الأعمدة (Links, About, Newsletter) بتنزل تحت بعض (1 Column Stack).
* **الأقسام:** كل قسم ممكن يكون Accordion (بيفتح ويقفل بضغطة) عشان يوفر مساحة.
  * **عنوان القسم:** `13px` وزن `600`، `text-transform: uppercase; letter-spacing: 1.5px;`.
  * **سهم الـ Accordion:** أيقونة `+` أو سهم `▾` بحجم `12px` بلون `#777777`.
  * **الحركة:** الفتح والقفل في `0.3s ease`.
* **اللينكات جوه كل قسم:** `14px` وزن `400` بلون `#777777` مع `padding: 10px 0;` عشان مريحة للضغط.
* **Newsletter Input + Button:**
  * ينزلوا تحت بعض (Stack).
  * الـ Input بياخد `width: 100%;`.
  * الـ Button تحته بياخد `width: 100%;`.
  * `gap: 12px;` بينهم.
* **Social Media Icons:**
  * حجم `20px` مع Touch Area `44px × 44px`.
  * `gap: 16px;` بين الأيقونات.
  * محاذاة: `center`.
* **Copyright / Bottom Bar:**
  * `font-size: 11px; color: #999999; text-align: center;`
  * `padding: 24px 0;`
* **Safe Area (الهواتف الحديثة):**
  * `padding-bottom: env(safe-area-inset-bottom);` عشان الـ Home Indicator بتاع iPhone ميغطيش المحتوى.

---

### **ط. المودالز والبوب أبز (Mobile Modals & Popups)**

* **المودال بيكون Full-screen دايماً** على الموبايل (مش Centered Box زي الديسكتوب).
* **الخلفية:** `#FFFFFF`.
* **الدخول:** بيطلع من تحت `transform: translateY(100%)` → `translateY(0)` في `0.4s`.
* **الهيدر بتاع المودال:**
  * `position: sticky; top: 0;`
  * العنوان (شمال) ← زرار الإغلاق X (يمين).
  * `border-bottom: 1px solid #F0F0F0;`
  * `padding: 16px;`
* **المحتوى:** `padding: 16px; overflow-y: auto;`
* **Body Scroll Lock:** لما المودال مفتوح، الصفحة ورا متعملش سكرول (`overflow: hidden` على الـ body).

#### **أمثلة المودالز:**
* **Quick View (عرض سريع للمنتج):** صورة فوق + معلومات تحت + زرار Add to Cart ثابت في الأسفل.
* **Size Guide:** جدول أحجام بيتقرأ أفقياً مع `overflow-x: auto;`.
* **Filter / Sort:** فلاتر البحث بتكون في مودال Full-screen مع زرار "Apply" ثابت في الأسفل.

---

### **ي. المسافات على الموبايل (Mobile Spacing Overrides)**

| Token | ديسكتوب | موبايل |
|-------|---------|--------|
| Container Padding | `0 64px` | `0 16px` |
| Section Padding (عمودي) | `80px 0` | `48px 0` |
| Grid Gap | `32px` | `24px` (1 Col) / `12px` (2 Col) |
| Card Internal Padding | `16px` | `12px` (1 Col) / `8px` (2 Col) |
| Hero Top/Bottom | `120px` | `48px` |
| Between Section Title & Content | `48px` | `24px` |
| Footer Section Gaps | `32px` | `24px` |

---

### **ك. الـ Touch Targets والتفاعل (Touch Interaction Rules)**

* **الحد الأدنى لأي عنصر تفاعلي:** `44px × 44px` (معيار Apple HIG و Material Design).
  * حتى لو الأيقونة `16px`، المنطقة اللي بتستجيب للمس لازم تكون `44px`.
  * استخدم `padding` إضافي أو `::before` pseudo-element عشان توسع الـ Hit Area.
* **المسافة بين العناصر التفاعلية:** `8px` على الأقل عشان ميحصلش ضغط غلط (Accidental Tap).
* **لا يوجد Hover على الموبايل:**
  * أي معلومة بتظهر بالـ Hover على الديسكتوب (زي Quick Add أو Tooltip) لازم يكون ليها بديل على الموبايل:
    * إما تبقى ظاهرة دايماً.
    * إما تظهر بضغطة (Tap).
    * إما تتشال من الموبايل لو مش أساسية.
* **Swipe Gestures (حركة السحب):**
  * صور المنتج في الكارت: ممكن Swipe بين الصور (مع Dots Indicator).
  * صور المنتج في صفحة التفاصيل: Swipe بين الصور.
  * القسم الـ Featured أو الـ Collections: ممكن Horizontal Scroll (سحب أفقي) مع `scroll-snap-type: x mandatory;`.

---

### **ل. العناصر الثابتة (Sticky & Fixed Elements)**

* **الهيدر:** `position: sticky; top: 0;` — دايماً ظاهر.
* **زرار Add to Cart (صفحة المنتج):** `position: fixed; bottom: 0;` — ثابت في الأسفل.
* **الـ Back to Top Button:**
  * بيظهر بعد ما المستخدم يعمل سكرول `500px` لتحت.
  * `position: fixed; bottom: 24px; right: 16px;`
  * `width: 40px; height: 40px; background: #111111; color: #FFFFFF;`
  * `border-radius: 0px;` (حاد — نفس البراند).
  * `opacity: 0` → `opacity: 1` في `0.3s ease;`
* **الـ Cookie Banner / Notification:**
  * من تحت: `position: fixed; bottom: 0; left: 0; right: 0;`
  * `padding: 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom));`

---

### **م. الأنيميشنز على الموبايل (Mobile Animation Adjustments)**

* **Respect `prefers-reduced-motion`:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
* **تقليل الأنيميشن:**
  * الـ `translateY(-4px)` Hover Effect على الكروت → **يتشال** على الموبايل (مفيش Hover).
  * الـ Image Scale Effect → ممكن يتشال أو يتحول لـ Tap Effect.
  * الـ Page Transitions → تفضل بس تكون أسرع: `0.3s` بدل `0.4s`.
* **الأنيميشنز اللي تفضل:**
  * فتح المنيو (Slide from left).
  * فتح المودالز (Slide from bottom).
  * الـ Skeleton Loading (لو في تحميل صور).
  * Fade-in عند الـ Scroll (بس بـ `IntersectionObserver`، مش بحسابات الـ Scroll Position).

---

### **ن. صفحة المنتج على الموبايل (Mobile Product Detail Page)**

* **صور المنتج:**
  * Swipeable Gallery بياخد عرض الشاشة الكامل (Edge-to-edge).
  * `aspect-ratio: 4/5;`
  * Dots Indicator تحت: `6px` dots مع `8px` gap.
  * يدعم Pinch-to-Zoom.
* **معلومات المنتج:**
  * `padding: 24px 16px;`
  * **اسم المنتج:** `20px` وزن `400` (Serif font).
  * **السعر:** `16px` وزن `600`.
  * **الوصف:** `14px` وزن `300` لون `#555555` مع `line-height: 1.7`.
  * **الوصف الطويل:** يتقص عند 3 سطور مع زرار "Read More" بحجم `12px`.
* **اختيار المقاس / اللون:**
  * أزرار بجنب بعض (Chips) بحجم `40px × 40px` مع `gap: 8px;`.
  * الـ Selected: `border: 1.5px solid #111111;`.
  * الـ Unselected: `border: 1px solid #E0E0E0;`.
* **زرار Add to Cart:**
  * ثابت في الأسفل (Fixed Bottom Bar).
  * `height: 56px;`
  * بجنبه السعر أو الكمية.
* **الأقسام الإضافية (Details, Shipping, Reviews):**
  * Accordion Style (بيفتح ويقفل).
  * بوردر رفيع `1px solid #F0F0F0` بين كل قسم.
* **منتجات مشابهة (Related Products):**
  * Horizontal Scroll بـ `scroll-snap-type: x mandatory;`.
  * كل كارت عرضه `65vw` عشان جزء من الكارت اللي بعده يبان (بيشجع على السحب).

---

### **س. الـ Cart والـ Checkout على الموبايل (Mobile Cart & Checkout)**

* **الـ Mini Cart:** بيكون Drawer بيطلع من اليمين (أو من تحت) بعرض `100%` من الشاشة.
* **كارت المنتج جوه السلة:**
  * صورة مصغرة `80px × 80px` (شمال) ← المعلومات (يمين).
  * `gap: 12px;` بينهم.
  * Quantity Selector: `−` [العدد] `+` بحجم `32px` لكل زرار.
  * زرار الحذف: أيقونة سلة بحجم `16px` بلون `#999999`.
* **الـ Checkout Steps:**
  * Step Indicator في الأعلى (خطوط متتالية أو أرقام) بحجم `12px`.
  * كل Step في صفحة لوحدها (مش كلهم تحت بعض).
  * الزرار "Continue" / "Place Order" ثابت في الأسفل.

---

### **ع. إعتبارات عامة للموبايل (General Mobile Considerations)**

* **الأداء (Performance):**
  * استخدم `loading="lazy"` على كل الصور ماعدا أول صورة في الـ Hero (اللي فوق الـ Fold).
  * الصور تكون بـ `srcset` مع أحجام مختلفة: `400w`, `800w`, `1200w`.
  * الفونتات تتحمل بـ `font-display: swap;` عشان المحتوى ميستناش تحميل الخط.
* **الـ Safe Areas (الهواتف الحديثة):**
  * كل العناصر الثابتة في الأسفل لازم تراعي الـ Home Indicator:
    `padding-bottom: env(safe-area-inset-bottom);`
  * الـ Viewport Meta Tag:
    `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
* **الـ Orientation (أفقي / عمودي):**
  * التصميم مُحسن للـ Portrait (عمودي) بشكل أساسي.
  * في الـ Landscape: الـ Grid يتحول لـ 2-3 Columns والـ Hero يقصر ارتفاعه.
* **الـ Pull-to-Refresh:**
  * لو التطبيق PWA، ممكن تدعم Pull-to-Refresh بشكل Native.
  * الأنيميشن: Spinner بسيط بلون `#111111` على خلفية بيضاء.
* **الـ Scroll Behavior:**
  * `scroll-behavior: smooth;` (بس بيتلغى مع `prefers-reduced-motion`).
  * `overscroll-behavior: none;` على الـ body عشان تمنع الـ Bounce Effect بتاع المتصفح.
  * `-webkit-overflow-scrolling: touch;` للـ Smooth Scrolling على iOS.
