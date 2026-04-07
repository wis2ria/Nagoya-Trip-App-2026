export const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockData = {
  "tripInfo": {
    "title": "✈️ 名古屋6天5夜放鬆之旅",
    "dates": "2026/04/21 - 2026/04/26",
    "themeColor": "#773690",
    "accentColor": "#A39D78"
  },
  "documents": [
    { title: "機票 (CHENG)", url: "https://drive.google.com/file/d/1m9BJ5Pdmh1uPSz1dFAdeRJhzz6MMH8qn/view?usp=drive_link", icon: "Plane" },
    { title: "機票 (CHEN)", url: "https://drive.google.com/file/d/15jhI5oWsA0yBXIwlgvwkoeXow6rMtRDK/view?usp=drive_link", icon: "Plane" },
    { title: "訂房 4/21-22", url: "https://drive.google.com/file/d/1AYxaJnuCWRs_tV-ZsTK1caoZGHBWEBXj/view?usp=sharing", icon: "Bed" },
    { title: "訂房 4/23-26", url: "https://drive.google.com/file/d/18VdPgAmOhLsfweGzor8N934oQbQUxVYG/view?usp=sharing", icon: "Bed" },
    { title: "兩日遊 4/22-23", url: "https://drive.google.com/file/d/1HeTP2KsnJpLL1FJvTzozuD0pf6sYMx0i/view?usp=sharing", icon: "MapPin" },
    { title: "吉卜力門票", url: "https://quickticket.moala.fun/books?id=ae3e6476-22f0-42c2-bbff-31677328cfcb", icon: "Ticket" }
  ],
  "itinerary": [
    {
      "day": "Day 1",
      "dateInfo": "4/21 (二) 抵達與安頓",
      "weatherHint": "氣溫約 15-20°C",
      "clothingHint": "春季薄外套＋舒適休閒服",
      "mapKeyword": "名古屋車站",
      "places": [
        {
          "id": generateId(),
          "type": "攻略", 
          "name": "🎫 機場出關 & μ-SKY 搭乘攻略", 
          "description": "• 出關動線：第 1 航廈入境 (2F) ➔ 往「交通廣場」 ➔ 左轉見名鐵剪票口與售票處。\n• 購票須知：搭乘 μ-SKY 需額外加購 ¥450「μ-ticket (特別車輛券)」。建議連同基本車票、回程 μ-ticket 一併買好。\n• 進站方式：刷 IC 卡或將基本乘車券投入閘門進站。μ-ticket 不用過閘門，上車後插在前方座位票夾供驗票。\n• 乘車月台：1 號月台", 
          "duration": "下機必讀", 
          "badges": ["實用指南"]
        },
        {
          "id": generateId(),
          "type": "交通", 
          "name": "搭乘 μ-SKY 前往市區", 
          "description": "搭乘 17:55 抵達的班機。辦理入境手續後，搭乘名鐵特急（μ-SKY）直達名鐵名古屋站。", 
          "duration": "約 40 分鐘", 
          "badges": ["交通"]
        },
        {
          "id": generateId(),
          "type": "活動", 
          "name": "🚶 車站穿越戰略：往新幹線口", 
          "description": "從名鐵名古屋站出站後，請一路跟著「新幹線」或「太閤通口」的指標走。\n穿過 JR 名古屋站的中央穿堂，一直走到穿堂盡頭（看到銀之鐘），走出去才是飯店所在的西側區域！", 
          "duration": "約 10-15 分", 
          "badges": ["步行", "迷宮破解"]
        },
        {
          "id": generateId(),
          "type": "酒店", 
          "name": "名鉄イン名古屋駅新幹線口", 
          "description": "辦理入住並放下行李。先讓自己安頓下來，準備迎接明天的早起行程。", 
          "duration": "Check-in", 
          "badges": [],
          "bookingInfo": "Agoda / 預訂編號：1712328365"
        },
        {
          "id": generateId(),
          "type": "食物", 
          "name": "車站周邊輕鬆晚餐", 
          "description": "在名古屋車站共構的地下街或商場找間喜歡的餐廳簡單吃個晚餐，早點休息。", 
          "duration": "約 1.5 小時", 
          "badges": ["必吃", "放鬆"]
        }
      ]
    },
    {
      "day": "Day 2",
      "dateInfo": "4/22 (三) 跟團D1：小京都與合掌村",
      "weatherHint": "山區氣溫偏涼約 8-15°C",
      "clothingHint": "防風外套＋保暖內搭",
      "mapKeyword": "白川鄉合掌村",
      "places": [
        { "id": generateId(), "type": "交通", "name": "JR名古屋站西口 Esca 地下街集合", "description": "08:15 集合，尋找接待處報到，08:30 準時搭乘專用巴士出發。", "duration": "準時抵達", "badges": ["注意時間"] },
        { "id": generateId(), "type": "景點", "name": "飛驒高山 (小京都)", "description": "在充滿江戶時代風情的老街自由散步，午餐自理。", "duration": "約 120 分鐘", "badges": ["必吃"] },
        { "id": generateId(), "type": "景點", "name": "白川鄉合掌村", "description": "漫步於世界遺產合掌造村落，感受童話般的寧靜氛圍。", "duration": "約 90 分鐘", "badges": ["必拍"] },
        { "id": generateId(), "type": "酒店", "name": "富山 Manten 飯店", "description": "晚上入住設有大型公共浴場的飯店，洗去一天的疲憊。晚餐需在飯店內或附近餐廳自理。", "duration": "過夜", "badges": ["放鬆"] }
      ]
    },
    {
      "day": "Day 3",
      "dateInfo": "4/23 (四) 跟團D2：大雪谷絕景",
      "weatherHint": "雪谷氣溫極低約 0-5°C",
      "clothingHint": "厚羽絨衣＋防滑雪靴＋毛帽墨鏡",
      "mapKeyword": "立山黑部 阿爾卑斯路線",
      "places": [
        { "id": generateId(), "type": "活動", "name": "立山黑部阿爾卑斯山脈路線", "description": "飯店早餐後出發。連續轉乘立山纜車、高原巴士抵達海拔 2450m 的室堂站。", "duration": "上午", "badges": ["交通體驗"] },
        { "id": generateId(), "type": "景點", "name": "大雪谷 (雪之大谷) 漫步", "description": "阿爾卑斯路線的最高潮！親自走在期間限定的巨大雪牆之間。", "duration": "約 1-2 小時", "badges": ["必拍", "絕景"] },
        { "id": generateId(), "type": "景點", "name": "黑部水壩", "description": "轉乘隧道電動巴士與纜車，從黑部湖步行參觀壯觀的黑部水壩。", "duration": "下午", "badges": ["景點"] },
        { "id": generateId(), "type": "交通", "name": "返回名古屋站", "description": "從扇澤站換乘專用巴士，預計 18:30 返抵名古屋站，結束豐富的兩天一夜行程。", "duration": "傍晚", "badges": [] },
        { "id": generateId(), "type": "酒店", "name": "名鉄イン名古屋駅新幹線口", "description": "結束兩天一夜的立山黑部行程，回到熟悉的飯店辦理入住並好好休息。", "duration": "Check-in", "badges": [], "bookingInfo": "Trip.com / 預訂編號：1688896815519009" }
      ]
    },
    {
      "day": "Day 4",
      "dateInfo": "4/24 (五) 吉卜力童話一日遊",
      "weatherHint": "氣溫約 15-22°C",
      "clothingHint": "好走的鞋子＋洋蔥式穿搭",
      "parkMapUrl": "https://jioujiou.tw/wp-content/uploads/2025/05/吉卜力公園地圖-1.jpg",
      "mapKeyword": "吉卜力公園",
      "places": [
        { "id": generateId(), "type": "交通", "name": "出發與步行", "duration": "08:00", "description": "從你下榻的「名鉄イン名古屋駅新幹線口」出發。由於飯店在車站西口，而地鐵東山線在偏東側的地下，請預留約 10 到 15 分鐘的步行時間穿越名古屋車站。", "badges": ["注意時間", "交通"] },
        { "id": generateId(), "type": "交通", "name": "【去程】地鐵 + Linimo", "duration": "08:33 - 09:28", "description": "車資共 670 円。\n• 08:33 搭乘 名古屋市營地鐵東山線（往藤丘方向）。\n• 09:01 抵達 藤丘站，跟著指標前往轉乘 Linimo。\n• 09:08 搭乘 Linimo（往八草方向）。\n• 09:21 抵達 愛·地球博紀念公園站。\n• 步行約 7 分鐘，於 09:28 抵達吉卜力公園。", "badges": ["交通", "乘換1回"] },
        { "id": generateId(), "type": "活動", "name": "入園與移動", "duration": "09:28 - 09:45", "description": "出站後，直接穿越戶外的電梯塔，沿著指標往最深處的「魔女之谷 (Valley of Witches)」入口前進。這段路程大約需要 10 到 15 分鐘。", "badges": ["步行"] },
        { "id": generateId(), "type": "活動", "name": "魔女之谷門口待命", "duration": "09:45 - 10:00", "description": "平日園區 10:00 開門，此時抵達剛好可以跟著排隊人潮，準備成為第一批進入魔女之谷的遊客。", "badges": ["重要", "準備入園"] },
        { "id": generateId(), "type": "購物", "name": "魔女之谷：領取兌換券", "duration": "10:00", "description": "一進入魔女之谷，立刻鎖定「售票車 (Ticket Truck)」領取《霍爾的移動城堡》購票兌換券！", "badges": ["必搶", "重要"] },
        { "id": generateId(), "type": "活動", "name": "移動至大倉庫", "duration": "10:30 - 10:45", "description": "帶著兌換券離開魔女之谷，悠閒散步前往「吉卜力大倉庫」門口排隊，準備迎接 11:00 的專屬入場時段。", "badges": ["注意時間"] },
        { "id": generateId(), "type": "景點", "name": "吉卜力大倉庫", "duration": "11:00 - 13:30", "description": "準時驗票入場。這兩個半小時完全專注於館內設施：直奔最熱門的「吉卜力動畫人物名場面展」拍無臉男車廂，參觀天空之城機器人兵、借物少女房間，並在「冒險飛行團」商店採買紀念品。", "badges": ["必拍", "必買"] },
        { "id": generateId(), "type": "食物", "name": "魔女之谷：飛天烤箱午餐", "duration": "13:30 - 14:30", "description": "離開大倉庫，重返魔女之谷。直奔「飛天烤箱」餐廳。此時剛好避開正午最尖峰人潮。點招牌肉餡派或魔女風鹹派。", "badges": ["必吃", "備案提醒"] },
        { "id": generateId(), "type": "景點", "name": "魔女之谷：進入霍爾城堡", "duration": "14:30 - 15:30", "description": "帶著早上的兌換券回到售票車，支付 ¥1,000 購買實體「當日入場券」。正式走進《霍爾的移動城堡》內部，親眼見證火惡魔卡西法的暖爐！", "badges": ["必拍", "絕景"] },
        { "id": generateId(), "type": "景點", "name": "魔法之里", "duration": "15:30 - 16:15", "description": "順路前往旁邊的「魔法之里」，看一眼巨大的乙事主溜滑梯與充滿日式風情的達達拉城。", "badges": ["景點"] },
        { "id": generateId(), "type": "景點", "name": "青春之丘", "duration": "16:15 - 17:00", "description": "慢慢往園區出口的方向移動，傍晚時分來到靠近入口處的「青春之丘」。", "badges": ["放鬆", "必拍"] },
        { "id": generateId(), "type": "交通", "name": "吉卜力公園 ➔ 榮商圈", "duration": "17:00 之後", "description": "從吉卜力公園搭乘 Linimo 回到地鐵「藤丘站」後，直接轉乘地鐵東山線就可以直達「榮 (Sakae)」站。", "badges": ["交通", "順路"] },
        { "id": generateId(), "type": "購物", "name": "綠洲 21 (Oasis 21) & 榮商圈", "description": "傍晚抵達市區，在榮商圈一帶吃晚餐。可以在宇宙船造型的玻璃屋頂上散步，欣賞名古屋電視塔夜景。", "duration": "晚上", "badges": ["必買", "放鬆"] },
        { "id": generateId(), "type": "交通", "name": "榮站 ➔ 名古屋站", "description": "抵達後，再次穿過名古屋車站的中央穿堂（櫻通口往太閣通口方向），步行約 10 分鐘回到位於西口的飯店休息。", "duration": "晚上", "badges": ["交通", "步行"] }
      ]
    },
    {
      "day": "Day 5",
      "dateInfo": "4/25 (六) 國寶犬山城與大須尋寶",
      "weatherHint": "氣溫約 16-21°C",
      "clothingHint": "春季薄外套＋舒適休閒服",
      "mapKeyword": "犬山城",
      "ticketGuide": {
        "title": "🎫 犬山城下町套票攻略",
        "description": "• 購買地：名鐵有站務員的窗口（彌富、赤池站除外）。\n• 名古屋站服務中心：平日 10:00-19:00 / 假日 09:00-18:00。\n• 內容物：名鐵來回車票、犬山城兌換券 (需至售票口換實體票)、有樂苑折價券、優惠券 (可蓋章用 3 次)。",
        "links": [
          { "text": "套票內容", "url": "https://www.meitetsu.co.jp/plan/campaign/detail/__icsFiles/afieldfile/2026/02/28/inuyamaticket.jpg", "type": "image" },
          { "text": "犬山優惠券", "url": "https://www.meitetsu.co.jp/plan/campaign/detail/__icsFiles/afieldfile/2026/02/19/2026A4tc.pdf", "type": "pdf" }
        ]
      },
      "places": [
        { "id": generateId(), "type": "交通", "name": "名鐵名古屋 → 犬山遊園", "description": "08:30 從飯店出發。08:46 於名鐵名古屋站 1 號月台搭車。出站後尋找指標，沿著木曾川散步約 15 分鐘。", "duration": "08:30 - 09:15", "badges": ["注意時間", "交通"] },
        { "id": generateId(), "type": "景點", "name": "三光稻荷神社 & 針綱神社", "description": "步行至天守閣途中的必經之地，人潮尚少。\n到「錢洗受付處」奉納 100 日圓，洗錢祈求財運。", "duration": "上午", "badges": ["必拍", "放鬆"], "goshuins": [{ "name": "三光稲荷神社", "price": "500円" }, { "name": "猿田彦神社", "price": "500円" }, { "name": "針綱神社", "price": "500円" }] },
        { "id": generateId(), "type": "景點", "name": "國寶犬山城天守閣", "description": "09:00 開門，此時抵達能完美避開 10:30 後的團體客！登上最頂層，享受木曾川微風並俯瞰城下町。", "duration": "09:30 - 11:00", "badges": ["絕景", "必拍"], "gojoins": [{ "name": "御城印", "price": "300円" }, { "name": "專屬御城印帳", "price": "2400円" }], "extraImages": [{ "title": "車站步行路線", "url": "https://inuyamajo.jp/wp-content/uploads/2020/03/route-from-station-en-1.png" }, { "title": "三條登山路線", "url": "https://inuyamajo.jp/wp-content/uploads/2020/03/three-routes-en-1.png" }] },
        { "id": generateId(), "type": "食物", "name": "犬山城下町散策：山田五平餅店", "description": "這棟建築本身是日本登錄有形文化財。品嚐現點現烤的傳統「五平餅」配上一杯熱茶。", "duration": "中午", "badges": ["必吃", "放鬆"] },
        { "id": generateId(), "type": "交通", "name": "犬山 → 上前津", "description": "路線：犬山站 →（名鐵犬山線直通運轉）→ 上小田井站（系統切換點）→（地下鐵鶴舞線）→ 上前津站。免下車即可直達！", "duration": "下午", "badges": ["交通", "順路"] },
        { "id": generateId(), "type": "攻略", "name": "🎫 大須商店街攻略", "description": "準備進入名古屋最熱鬧的商店街！您可以搭配這份官方地圖，輕鬆找到想去的街道與店家。", "duration": "參考", "badges": ["實用地圖"], "links": [{ "text": "大須官方地圖 (PDF)", "url": "https://osu.nagoya/images/osumap/01-02.pdf", "type": "pdf" }] },
        { "id": generateId(), "type": "購物", "name": "大須商店街尋寶散策", "description": "從上前津站 8 號出口出發，建議的精華散步路線：\n新天地通 ➔ 巨大招財貓地標 ➔ 三輪神社 ➔ 赤門通 ➔ 大須觀音通 ➔ 大須觀音寺", "duration": "下午", "badges": ["必買", "尋寶"] },
        { "id": generateId(), "type": "景點", "name": "三輪神社", "openHours": "09:00 - 17:00", "description": "祭祀大物主神，神話中的「因幡白兔」被視為神祇使者，境內有大量兔子元素。", "duration": "傍晚", "badges": ["放鬆", "必拍"], "goshuins": [{ "name": "三輪神社", "price": "400円" }] },
        { "id": generateId(), "type": "景點", "name": "大須觀音寺", "openHours": "09:00 - 17:00", "description": "正式名稱為北野山真福寺寶生院，與淺草觀音、津觀音並列為日本三大觀音。", "duration": "傍晚", "badges": ["景點"], "goshuins": [{ "name": "大須觀音寺", "price": "500円" }] },
        { "id": generateId(), "type": "交通", "name": "大須觀音站 ➔ 名古屋站", "description": "搭乘地下鐵鶴舞線至「伏見站」，轉乘東山線回到「名古屋站」。出站後步行返回飯店休息。", "duration": "晚上", "badges": ["交通", "順路"] }
      ]
    },
    {
      "day": "Day 6",
      "dateInfo": "4/26 (日) 準備返家",
      "weatherHint": "氣溫約 16-21°C",
      "clothingHint": "輕鬆好活動的機場穿搭",
      "mapKeyword": "中部國際機場",
      "places": [
        { "id": generateId(), "type": "交通", "name": "前往中部國際機場", "description": "因為要搭乘 10:40 的早班機，建議 07:30 左右出發搭乘名鐵前往機場。", "duration": "約 40 分鐘", "badges": ["注意時間", "交通"] },
        { "id": generateId(), "type": "購物", "name": "機場免稅店最後採買", "description": "抵達機場並完成報到手續後，把握時間在免稅店補齊伴手禮，帶著滿滿的回憶準備登機。", "duration": "約 1.5 小時", "badges": ["必買"] }
      ]
    }
  ]
};

export const defaultPackingList = {
  carryOn: [
    { id: 'c1', text: '隨身背包 / 護照與影本', checked: false },
    { id: 'c2', text: '錢包 (日幣/信用卡)', checked: false },
    { id: 'c3', text: '手機、行動電源、充電線', checked: false },
    { id: 'c4', text: '實體網卡或開通 eSIM', checked: false },
  ],
  checked: [
    { id: 'b1', text: '換洗衣物 (洋蔥式穿搭)', checked: false },
    { id: 'b2', text: '盥洗用品 / 保養品', checked: false },
    { id: 'b3', text: '常備藥品 (腸胃/感冒/暈車)', checked: false },
    { id: 'b4', text: '折疊大容量環保袋 (裝戰利品)', checked: false },
  ],
  shopping: [
    { id: 's1', text: '休足時間 (每晚必備)', checked: false },
    { id: 's2', text: '合掌村限定伴手禮', checked: false },
  ]
};
