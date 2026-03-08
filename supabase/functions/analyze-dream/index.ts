import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const I_CHING_HEXAGRAMS = [
  { name: "乾卦", element: "金", meaning: "創造力與天命" },
  { name: "坤卦", element: "土", meaning: "接納與養育" },
  { name: "震卦", element: "木", meaning: "驚動與覺醒" },
  { name: "巽卦", element: "木", meaning: "滲透與影響" },
  { name: "坎卦", element: "水", meaning: "深淵與智慧" },
  { name: "離卦", element: "火", meaning: "光明與依附" },
  { name: "艮卦", element: "土", meaning: "止息與沉思" },
  { name: "兌卦", element: "金", meaning: "喜悅與表達" },
];

const TAROT_CARDS = [
  { name: "愚者", meaning: "新開始與純真" },
  { name: "魔術師", meaning: "創造力與行動" },
  { name: "女祭司", meaning: "直覺與奧秘" },
  { name: "皇后", meaning: "豐饒與創造" },
  { name: "皇帝", meaning: "結構與權威" },
  { name: "教皇", meaning: "傳統與智慧" },
  { name: "戀人", meaning: "選擇與關係" },
  { name: "戰車", meaning: "意志與前進" },
  { name: "力量", meaning: "內在力量" },
  { name: "隱者", meaning: "內省與孤獨" },
  { name: "命運之輪", meaning: "循環與變化" },
  { name: "正義", meaning: "平衡與因果" },
  { name: "倒吊人", meaning: "犧牲與新視角" },
  { name: "死神", meaning: "轉變與結束" },
  { name: "節制", meaning: "平衡與調和" },
  { name: "惡魔", meaning: "束縛與欲望" },
  { name: "高塔", meaning: "突變與覺醒" },
  { name: "星星", meaning: "希望與靈感" },
  { name: "月亮", meaning: "潛意識與幻象" },
  { name: "太陽", meaning: "成功與喜悅" },
  { name: "審判", meaning: "重生與覺醒" },
  { name: "世界", meaning: "完成與圓滿" },
];

const CHINESE_ZODIAC = {
  rat: { name: "鼠", traits: "機敏、適應力強", element: "水" },
  ox: { name: "牛", traits: "踏實、堅毅", element: "土" },
  tiger: { name: "虎", traits: "勇敢、自信", element: "木" },
  rabbit: { name: "兔", traits: "溫和、謹慎", element: "木" },
  dragon: { name: "龍", traits: "雄心、創造力", element: "土" },
  snake: { name: "蛇", traits: "智慧、神秘", element: "火" },
  horse: { name: "馬", traits: "熱情、獨立", element: "火" },
  goat: { name: "羊", traits: "溫柔、藝術性", element: "土" },
  monkey: { name: "猴", traits: "聰明、靈活", element: "金" },
  rooster: { name: "雞", traits: "誠實、勤奮", element: "金" },
  dog: { name: "狗", traits: "忠誠、正直", element: "土" },
  pig: { name: "豬", traits: "善良、慷慨", element: "水" },
};

const MBTI_COGNITIVE_FUNCTIONS = {
  ENTP: { primary: "Ne", auxiliary: "Ti", description: "直覺爆發、邏輯分析" },
  INTJ: { primary: "Ni", auxiliary: "Te", description: "內在願景、系統執行" },
  INFP: { primary: "Fi", auxiliary: "Ne", description: "價值導向、可能性探索" },
  ENFP: { primary: "Ne", auxiliary: "Fi", description: "熱情探索、真實表達" },
  INTP: { primary: "Ti", auxiliary: "Ne", description: "邏輯架構、概念探索" },
  ENTJ: { primary: "Te", auxiliary: "Ni", description: "效率執行、長遠規劃" },
  INFJ: { primary: "Ni", auxiliary: "Fe", description: "深刻洞察、同理連結" },
  ENFJ: { primary: "Fe", auxiliary: "Ni", description: "人際和諧、願景領導" },
  ISTJ: { primary: "Si", auxiliary: "Te", description: "經驗累積、實務執行" },
  ISFJ: { primary: "Si", auxiliary: "Fe", description: "細節關懷、責任感" },
  ESTJ: { primary: "Te", auxiliary: "Si", description: "組織管理、傳統遵循" },
  ESFJ: { primary: "Fe", auxiliary: "Si", description: "社交協調、實際照顧" },
  ISTP: { primary: "Ti", auxiliary: "Se", description: "技術分析、即時應變" },
  ISFP: { primary: "Fi", auxiliary: "Se", description: "美感體驗、當下真實" },
  ESTP: { primary: "Se", auxiliary: "Ti", description: "行動導向、靈活思考" },
  ESFP: { primary: "Se", auxiliary: "Fi", description: "享受當下、真誠表達" },
};

function getChineseZodiac(birthday: string): string {
  const year = new Date(birthday).getFullYear();
  const zodiacCycle = ["monkey", "rooster", "dog", "pig", "rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat"];
  const zodiacIndex = (year - 1900) % 12;
  return zodiacCycle[zodiacIndex];
}

function generateHexagram(stressLevel: number): typeof I_CHING_HEXAGRAMS[0] {
  const index = Math.floor((stressLevel - 1) * (I_CHING_HEXAGRAMS.length / 10));
  return I_CHING_HEXAGRAMS[Math.min(index, I_CHING_HEXAGRAMS.length - 1)];
}

function drawTarotCard(): typeof TAROT_CARDS[0] {
  return TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
}

function generateAnalysis(params: {
  dreamContent: string;
  stressLevel: number;
  energyLevel: number;
  stimulants: string[];
  profile: {
    name: string;
    birthday: string;
    mbti_type: string;
    zodiac_sign: string;
    blood_type: string;
  };
  hexagram: typeof I_CHING_HEXAGRAMS[0];
  tarot: typeof TAROT_CARDS[0];
  zodiac: keyof typeof CHINESE_ZODIAC;
}): string {
  const { dreamContent, stressLevel, energyLevel, stimulants, profile, hexagram, tarot, zodiac } = params;

  const mbtiInfo = MBTI_COGNITIVE_FUNCTIONS[profile.mbti_type as keyof typeof MBTI_COGNITIVE_FUNCTIONS] ||
                   { primary: "", auxiliary: "", description: "多元認知模式" };
  const zodiacInfo = CHINESE_ZODIAC[zodiac];

  const stressContext = stressLevel > 7 ? "高壓狀態下" : stressLevel > 4 ? "適度張力中" : "平靜狀態裡";
  const energyContext = energyLevel > 7 ? "精力充沛" : energyLevel > 4 ? "能量平衡" : "能量低潮";

  let stimulantEffect = "";
  if (stimulants.includes("coffee")) stimulantEffect += "咖啡因激發了思維的快速流動。";
  if (stimulants.includes("alcohol")) stimulantEffect += "酒精鬆開了潛意識的閥門。";
  if (stimulants.includes("spicy")) stimulantEffect += "辛辣感官刺激喚醒了原始本能。";

  const analysis = `${stressContext}，${energyContext}。${stimulantEffect}

${hexagram.name}（${hexagram.element}）與${tarot.name}的交織，顯現了此刻意識場域的特殊狀態。${hexagram.meaning}的本質，呼應著${tarot.meaning}的能量流動。

作為${profile.mbti_type}，你的${mbtiInfo.primary}主導功能在夢境中展開其獨特敘事。${mbtiInfo.description}的認知模式，將夢境元素轉譯為：

${dreamContent.includes("黑") || dreamContent.includes("暗") ?
  `黑暗不是恐懼的象徵，而是未知的孕育之地。在${zodiacInfo.name}年出生的你，${zodiacInfo.element}元素的親和性，使得這種神秘感成為能量的源泉，而非威脅。` :
  `夢境中的意象，是內在智慧的顯化。${zodiacInfo.traits}的本質特性，為這場潛意識劇場提供了底色。`}

${stressLevel > 7 ?
  "當前的高壓並非負擔，而是靈魂正在進行深度重組的訊號。這個夢境是系統的自我修復機制。" :
  energyLevel < 4 ?
  "能量低潮時，潛意識更容易浮現。這是靈魂向你提供補給與指引的時刻。" :
  "在平衡的狀態中，夢境成為純粹的創造性表達，不帶防衛，直指核心。"}

${zodiacInfo.element === hexagram.element ?
  `${zodiacInfo.element}元素的共鳴，加強了這個夢境的訊息強度。你的本命能量與當前意識狀態高度契合，這是靈性成長的關鍵節點。` :
  `${zodiacInfo.element}與${hexagram.element}的交織，創造了元素間的動態平衡，這種張力孕育著轉化的可能。`}

這不是警示，而是邀請。邀請你允許潛意識的智慧，以其獨特的語言，為清醒的意識帶來補給與更新。`;

  return analysis;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { entryId, dreamContent, stressLevel, energyLevel, stimulants, profile } = await req.json();

    if (!entryId || !dreamContent || !profile) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const hexagram = generateHexagram(stressLevel);
    const tarot = drawTarotCard();
    const zodiac = getChineseZodiac(profile.birthday);

    const analysis = generateAnalysis({
      dreamContent,
      stressLevel,
      energyLevel,
      stimulants,
      profile,
      hexagram,
      tarot,
      zodiac,
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/dream_entries?id=eq.${entryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
        "apikey": supabaseKey!,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        hexagram: hexagram.name,
        tarot_card: tarot.name,
        analysis: analysis,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error("Failed to update entry");
    }

    return new Response(
      JSON.stringify({
        hexagram: hexagram.name,
        tarot: tarot.name,
        analysis: analysis,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
