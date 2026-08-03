import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';
import { getAllProductsQuery } from '@/lib/shopify/queries';
import {
  AIChooserRequestPayload,
  AIChooserResponsePayload,
  AIChooserProductRecommendation,
  BudgetRange,
  JewelryCategory,
  OccasionType,
  RecipientType,
  StyleVibe,
} from '@/components/features/AIChooser/types';

// Helper to filter and match products from Shopify based on user choices
function scoreAndCurateProducts(
  shopifyProducts: any[],
  preferences: AIChooserRequestPayload['preferences'],
  locale: string
): AIChooserResponsePayload {
  const isAr = locale === 'ar';
  const { recipient, occasion, categories, style, budget } = preferences;

  // Filter budget limits in EGP
  const budgetLimits: Record<BudgetRange, { min: number; max: number }> = {
    under600: { min: 0, max: 600 },
    '600to1500': { min: 600, max: 1500 },
    above1500: { min: 1500, max: Infinity },
    any: { min: 0, max: Infinity },
  };

  const currentBudget = budget ? budgetLimits[budget] : budgetLimits.any;

  // Score each product
  const scored = shopifyProducts.map((p) => {
    const node = p.node || p;
    const title = (node.title || '').toLowerCase();
    const handle = node.handle || '';
    const productType = (node.productType || '').toLowerCase();
    const minPrice = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
    const currencyCode = node.priceRange?.minVariantPrice?.currencyCode || 'EGP';
    const compareAtPrice = node.compareAtPriceRange?.minVariantPrice;
    const imageUrl = node.images?.edges?.[0]?.node?.url || '';
    const variantId = node.variants?.edges?.[0]?.node?.id || '';

    let score = 70; // baseline

    // Category matching
    const catKeywords: Record<JewelryCategory, string[]> = {
      rings: ['ring', 'خاتم', 'خواتم', 'دبلة', 'محبس'],
      necklaces: ['necklace', 'pendant', 'chain', 'سلسلة', 'قلادة', 'دلاية', 'سلاسل'],
      bracelets: ['bracelet', 'bangle', 'سوار', 'اسورة', 'أساور', 'انسيال', 'أنسيالات'],
      earrings: ['earring', 'stud', 'hoop', 'حلق', 'اقراط', 'أقراط', 'حلقان'],
      anklets: ['anklet', 'خلخال', 'خلاخيل'],
    };

    let categoryMatched = false;
    if (categories && categories.length > 0) {
      for (const cat of categories) {
        const keywords = catKeywords[cat] || [];
        if (keywords.some((kw) => title.includes(kw) || productType.includes(kw) || handle.includes(kw))) {
          score += 15;
          categoryMatched = true;
          break;
        }
      }
    } else {
      categoryMatched = true;
    }

    // Budget matching
    if (minPrice >= currentBudget.min && minPrice <= currentBudget.max) {
      score += 10;
    } else if (currentBudget.max !== Infinity && minPrice > currentBudget.max * 1.5) {
      score -= 20;
    }

    // Style matching
    if (style === 'minimal') {
      if (title.includes('simple') || title.includes('slim') || title.includes('dainty') || title.includes('ناعم') || title.includes('رقيق')) {
        score += 5;
      }
    } else if (style === 'zircon') {
      if (title.includes('zircon') || title.includes('crystal') || title.includes('solitaire') || title.includes('زركون') || title.includes('سوليتير')) {
        score += 5;
      }
    } else if (style === 'statement') {
      if (title.includes('statement') || title.includes('bold') || title.includes('عصري') || title.includes('بارز')) {
        score += 5;
      }
    }

    // Clamp score between 80 and 99
    const finalScore = Math.min(99, Math.max(82, score));

    return {
      node,
      title: node.title,
      handle: node.handle,
      finalScore,
      price: { amount: minPrice.toString(), currencyCode },
      compareAtPrice: compareAtPrice ? { amount: compareAtPrice.amount, currencyCode: compareAtPrice.currencyCode } : null,
      imageUrl,
      variantId,
      productType,
      categoryMatched,
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.finalScore - a.finalScore);

  const topProduct = scored[0] || null;
  const secondaryProduct = scored.length > 1 ? scored[1] : null;

  // Generate localized reasoning
  const getReasoning = (
    itemTitle: string,
    recip: RecipientType,
    occ: OccasionType,
    sty: StyleVibe,
    isPrimary: boolean
  ) => {
    if (isAr) {
      if (isPrimary) {
        const adviceLead = 'بننصح حضرتك باقتناء هذه القطعة تحديداً كأفضل خيار، لأنها';
        const qualityLead = 'مصنوعة يدوياً من الفضة الإسترليني عيار 925 النقية المقاومة للبهتان مع بريق يدوم طويلاً.';
        
        let contextReason = '';
        if (recip === 'partner' && occ === 'anniversary') {
          contextReason = 'تصميمها الساحر يعبّر بدقة عن مشاعرك في الذكرى السنوية ويترك انطباعاً راقياً لا يُنسى.';
        } else if (recip === 'mother') {
          contextReason = 'تجمع بين الفخامة والوقار الذي يليق بمقام ست الحبايب لتكون هدية تُفرح قلبها يومياً.';
        } else if (recip === 'self') {
          contextReason = 'تمنح إطلالتك اليومية لمسة ثقة وجاذبية فائقة تتناغم مع مختلف ملابسك بأناقة وسهولة.';
        } else {
          contextReason = 'تجسّد التوازن المثالي بين القيمة العالية والذوق الرفيع، وتعتبر استثماراً مثالياً لأناقتك.';
        }

        return `${adviceLead} ${contextReason} بالإضافة إلى أنها ${qualityLead}`;
      } else {
        return `نصيحة لتنسيق طقم متكامل: ننصح حضرتك بإضافة "${itemTitle}" لأنها تكمل رونق القطعة الأساسية وتضاعف فخامة إطلالتك أو الهدية بخصم وقيمة لا تقارن.`;
      }
    } else {
      if (isPrimary) {
        return `We strongly recommend this piece as your optimal match. Handcrafted in genuine 925 sterling silver with tarnish-resistant shine, it strikes the ultimate balance between high-end elegance and timeless versatility for this occasion.`;
      } else {
        return `Stylist pairing tip: Adding "${itemTitle}" creates a cohesive, breathtaking luxury set that elevates the entire gift experience effortlessly.`;
      }
    }
  };

  // Gift card note suggestion
  const getGiftNote = (recip: RecipientType, occ: OccasionType) => {
    if (isAr) {
      if (recip === 'mother') {
        return 'إلى ست الحبايب وأغلى ما في الوجود.. كل الحب والامتنان لقلبك الطيب، صُنعت هذه الفضة النقية لتليق بجمالك الدائم.';
      }
      if (recip === 'partner' && occ === 'anniversary') {
        return 'كل عام وأنتِ النور الذي يزين أيامي.. فضة إسترليني 925 نقية تخلّد أجمل ذكرياتنا معاً.';
      }
      if (recip === 'partner') {
        return 'قطعة فضية نقية صُنعت بكل حب، لتكون تذكاراً دائماً لغلاوتك ومكانتك الخاصة في قلبي.';
      }
      if (recip === 'friend') {
        return 'للصديقة اللي وجودها بيهوّن كل حاجة، هدية رقيقة من الفضة النقية لتزيد أيامك لمعاناً وجمالاً.';
      }
      return 'صُنعت بحرفية من الفضة الإسترليني عيار 925 لتتألقي دائماً بأناقة وهدوء.';
    } else {
      if (recip === 'mother') {
        return 'To the most precious person in my life, thank you for your endless love. Handcrafted in 925 sterling silver to honor your grace.';
      }
      if (recip === 'partner') {
        return 'Pure 925 sterling silver crafted with love to celebrate you and the unforgettable moments we share.';
      }
      if (recip === 'friend') {
        return 'To a wonderful friend who brings sparkle to every moment. Enjoy this timeless silver piece!';
      }
      return 'Crafted from authentic 925 sterling silver to add timeless radiance to every moment.';
    }
  };

  const recommendationSummary = isAr
    ? 'بناءً على تفضيلات حضرتك الدقيقة، قمنا بانتقاء هذه القطعة الفضية عيار 925 لتكون خيار الشراء الأذكى والأكثر قيمة لأناقتك اليوم.'
    : 'Based on your specific answers, we curated this 925 sterling silver selection as the smartest, highest-value purchase for your style.';


  const curatedProducts: AIChooserProductRecommendation[] = [];

  if (topProduct) {
    let pairingProductRec: AIChooserProductRecommendation | null = null;
    if (secondaryProduct) {
      pairingProductRec = {
        handle: secondaryProduct.handle,
        title: secondaryProduct.title,
        matchScore: secondaryProduct.finalScore,
        reason: getReasoning(secondaryProduct.title, recipient, occasion, style, false),
        price: secondaryProduct.price,
        compareAtPrice: secondaryProduct.compareAtPrice,
        imageUrl: secondaryProduct.imageUrl,
        variantId: secondaryProduct.variantId,
      };
    }

    curatedProducts.push({
      handle: topProduct.handle,
      title: topProduct.title,
      matchScore: topProduct.finalScore,
      reason: getReasoning(topProduct.title, recipient, occasion, style, true),
      price: topProduct.price,
      compareAtPrice: topProduct.compareAtPrice,
      imageUrl: topProduct.imageUrl,
      variantId: topProduct.variantId,
      suggestedPairingHandle: secondaryProduct?.handle,
      suggestedPairing: pairingProductRec,
    });
  }

  return {
    recommendationSummary,
    products: curatedProducts,
    giftNoteSuggestion: getGiftNote(recipient, occasion),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: AIChooserRequestPayload = await req.json();
    const { locale = 'ar', preferences } = body || {};

    if (!preferences) {
      return NextResponse.json(
        { error: 'Missing preferences in request payload' },
        { status: 400 }
      );
    }

    const remoteAgentUrl = process.env.AI_AGENT_API_URL || process.env.NEXT_PUBLIC_AI_AGENT_API_URL;
    const remoteAgentKey = process.env.AI_AGENT_API_KEY;

    // 1. If an external AI Agent API is provided, attempt to call it
    if (remoteAgentUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(remoteAgentUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(remoteAgentKey ? { Authorization: `Bearer ${remoteAgentKey}` } : {}),
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data: AIChooserResponsePayload = await response.json();
          // Return the remote agent's response directly
          return NextResponse.json(data);
        } else {
          console.warn(`AI Agent API responded with status ${response.status}. Falling back to internal engine.`);
        }
      } catch (remoteError) {
        console.warn('AI Agent API request failed or timed out. Falling back to internal curation engine:', remoteError);
      }
    }

    // 2. Fallback / Internal Curation Engine using live Shopify catalog
    let shopifyProducts: any[] = [];
    try {
      const { body: shopifyBody } = await shopifyFetch<any>({
        query: getAllProductsQuery,
        variables: { first: 20 },
        cache: 'no-store',
      });
      shopifyProducts = shopifyBody?.data?.products?.edges || [];
    } catch (shopifyErr) {
      console.error('Error fetching Shopify products for AI Chooser:', shopifyErr);
    }

    // If Shopify returned products or empty, score and curate
    const curated = scoreAndCurateProducts(shopifyProducts, preferences, locale);

    return NextResponse.json(curated);
  } catch (err: any) {
    console.error('Unexpected error in /api/ai-chooser:', err);
    return NextResponse.json(
      { error: 'Internal server error processing AI concierge recommendation', details: err?.message },
      { status: 500 }
    );
  }
}
