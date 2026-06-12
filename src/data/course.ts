import type { Topic } from "../domain/types";

export const topics: Topic[] = [
  {
    id: "visual-communication", section: "基本概念", title: "视觉传达设计", period: "20世纪60年代形成",
    summary: "利用视觉符号传达信息，为观众带来视觉心理满足的设计。",
    features: ["给人看的设计", "告知的设计", "涵盖字体、包装、标志、书籍、展示和网页等"], people: [], works: [],
  },
  {
    id: "neoclassicism", section: "工业革命前后", title: "新古典主义设计", period: "18世纪后期至19世纪上半期",
    summary: "工业革命发展时期欧美建筑和设计中的复古主义现象。",
    features: ["法国偏古典主义复古", "英国偏浪漫主义复古", "美国表现为折中主义"], people: [], works: [],
  },
  {
    id: "industrial-design", section: "基本概念", title: "工业设计", period: "工业化时代",
    summary: "面向机器大规模生产和消费市场的产品设计。",
    features: ["形式与使用性能", "人机工学与工程技术", "市场销售与品牌发展"], people: [], works: [],
  },
  {
    id: "arts-crafts", section: "工艺美术运动", title: "英国工艺美术运动", period: "19世纪50年代起",
    summary: "抵制工业化对传统手工艺的威胁，以中世纪和哥特精神寻求设计改革。",
    features: ["反对机器美学", "崇尚自然与传统", "强调民主思想和手工艺"], people: ["约翰·拉斯金", "威廉·莫里斯"], works: ["红屋"],
    compare: "比新艺术运动更强调哥特式的简单朴实。",
  },
  {
    id: "red-house", section: "工艺美术运动", title: "红屋", period: "1860年",
    summary: "莫里斯与菲利普·韦伯合作的住宅，体现建筑、室内和家具整体统一。",
    features: ["不对称L形", "红砖红瓦与材料诚实", "哥特细节", "花园作为外面的房间"], people: ["威廉·莫里斯", "菲利普·韦伯"], works: ["红屋"],
  },
  {
    id: "morris-limits", section: "工艺美术运动", title: "莫里斯思想的局限", period: "19世纪",
    summary: "追求为大众服务，却因排斥机器和复杂手工导致产品成本高昂。",
    features: ["理想与实际功用矛盾", "手工产品难以普及", "忠实于自然"], people: ["威廉·莫里斯"], works: ["红屋"],
  },
  {
    id: "art-nouveau", section: "新艺术运动", title: "新艺术运动", period: "约1895年至第一次世界大战",
    summary: "从法国兴起并席卷欧美，以探索新装饰和建筑风格为核心。",
    features: ["曲线型采用花卉、植物、昆虫", "直线型采用几何和中性色", "重视手工艺装饰"], people: ["亨利·凡·德·维尔德", "约瑟夫·霍夫曼"], works: [],
  },
  {
    id: "van-de-velde", section: "新艺术运动", title: "亨利·凡·德·维尔德", period: "19世纪末至20世纪初",
    summary: "支持新技术并提出功能第一，是现代主义设计思想奠基人之一。",
    features: ["早期曲线和枝蔓图案", "支持新技术", "反对标准化与批量化形成内在矛盾"], people: ["亨利·凡·德·维尔德"], works: ["魏玛工艺与实用美术学校"],
  },
  {
    id: "hoffmann", section: "新艺术运动", title: "约瑟夫·霍夫曼", period: "20世纪初",
    summary: "维也纳分离派创始人之一，以方格网和理性简洁著称。",
    features: ["传统与创新结合", "装饰与功能吻合", "纵横方格网"], people: ["约瑟夫·霍夫曼"], works: [],
  },
  {
    id: "jugendstil", section: "新艺术运动", title: "德国青年风格", period: "19世纪下半期至20世纪初",
    summary: "德国从自然主义曲线逐渐转向简单几何和直线的设计探索。",
    features: ["以《青年》杂志为核心", "恢复手工艺传统", "后期靠近格拉斯哥四人派"], people: [], works: ["《青年》杂志"],
  },
  {
    id: "art-deco-graphic", section: "装饰艺术运动", title: "装饰艺术平面设计", period: "20世纪20至30年代",
    summary: "以海报为中心的图画现代主义，吸收抽象、变形和立体主义手法。",
    features: ["色彩明快", "线条清晰", "曲折线与棱角面", "旅游和电影海报"], people: [], works: ["普莱斯特火柴广告"],
  },
  {
    id: "chrysler", section: "装饰艺术运动", title: "克莱斯勒大厦", period: "1926—1931年",
    summary: "纽约装饰艺术摩天楼，以汽车工业符号和金属几何装饰著称。",
    features: ["不锈钢几何尖顶", "汽车车轮象征", "交通主题壁画", "华丽材料"], people: ["威廉·凡·阿伦"], works: ["克莱斯勒大厦"],
  },
  {
    id: "modernism-centers", section: "现代主义萌起", title: "三个现代主义试验中心", period: "20世纪二三十年代",
    summary: "德国现代主义、俄国构成主义和荷兰风格派共同奠定现代设计基础。",
    features: ["德国搭建设计架构", "构成主义服务无产阶级", "风格派探索新美学"], people: [], works: [],
  },
  {
    id: "new-architecture", section: "新建筑运动", title: "新建筑运动", period: "19世纪末至20世纪",
    summary: "建筑先驱运用新材料、新技术和新观念推动建筑革新。",
    features: ["新材料", "新技术", "新观念"], people: ["勒·柯布西耶"], works: ["朗香教堂"],
  },
  {
    id: "ronchamp", section: "新建筑运动", title: "朗香教堂", period: "1950年",
    summary: "勒·柯布西耶后期个人表现主义作品，被塑造成混凝土雕塑。",
    features: ["不规则平面", "弯曲倾斜墙体", "厚重上翻屋顶", "彩色玻璃营造特殊光线"], people: ["勒·柯布西耶"], works: ["朗香教堂"],
  },
  {
    id: "bauhaus", section: "现代主义", title: "德国包豪斯", period: "1919—1933年",
    summary: "格罗皮乌斯在魏玛创建的现代设计学院，为现代设计教育奠定基础。",
    features: ["整合风格派和构成主义成果", "面向设计教育", "经历魏玛、德绍、柏林三个阶段"], people: ["沃尔特·格罗皮乌斯", "汉尼斯·迈耶", "密斯·凡·德·洛"], works: [],
  },
  {
    id: "bauhaus-stages", section: "现代主义", title: "包豪斯三个阶段", period: "1919—1933年",
    summary: "从魏玛理想主义，经德绍理性和工业化，再到政治化与关闭。",
    features: ["1919魏玛成立", "约1923—1927转向理性主义与工业生产", "1930迁柏林，1933关闭"], people: ["格罗皮乌斯", "汉尼斯·迈耶", "密斯·凡·德·洛"], works: [],
  },
  {
    id: "de-stijl", section: "现代主义", title: "荷兰风格派", period: "20世纪初",
    summary: "以几何构成、三原色和新美学原则为核心的运动。",
    features: ["纵横几何", "红黄蓝三原色", "构件视觉独立"], people: ["格利特·里特维德", "蒙德里安"], works: ["施罗德住宅", "红黄蓝椅"],
  },
  {
    id: "red-blue-chair", section: "现代主义", title: "红黄蓝椅", period: "1918年",
    summary: "里特维德以机制木条和木板构成、结构不加掩饰的设计经典。",
    features: ["13根机制木条和木板", "螺钉固定", "红黄蓝与黑", "标准化、可批量生产"], people: ["格利特·里特维德"], works: ["红黄蓝椅"],
  },
  {
    id: "constructivism", section: "现代主义", title: "俄国构成主义", period: "20世纪初",
    summary: "强调结构、技术和为无产阶级服务的现代设计探索。",
    features: ["结构外显", "政治与社会目标明确", "重视新材料和动态形式"], people: ["弗拉基米尔·塔特林"], works: ["第三国际纪念塔方案"],
  },
  {
    id: "streamlining", section: "工业设计", title: "流线型设计运动", period: "20世纪30年代美国",
    summary: "把动力学、速度和效率转化为鲜明的美国现代设计视觉语言。",
    features: ["强调速度与效率", "产品简洁有活力", "依靠展览和大众媒体传播"], people: [], works: [],
  },
  {
    id: "ergonomics", section: "工业设计", title: "人机工程学", period: "20世纪持续发展",
    summary: "研究人的自然尺度、工作能力和限度，使设计符合生理与心理特征。",
    features: ["生理性", "认知性", "组织性", "环境性"], people: [], works: [],
  },
  {
    id: "international-style", section: "战后设计", title: "国际主义设计", period: "二战后至20世纪80年代",
    summary: "欧洲现代主义与美国市场结合形成的战后设计风格。",
    features: ["钢铁玻璃混凝土", "标准化预制", "玻璃幕墙", "少则多走向极端"], people: ["密斯·凡·德·洛"], works: [],
    compare: "现代主义以功能目的为先；国际主义后期常让形式单纯性压倒功能。",
  },
  {
    id: "pop-design", section: "后现代主义", title: "英国波普设计", period: "20世纪60年代",
    summary: "源于美国大众消费文化，对现代主义和国际主义垄断的反叛。",
    features: ["通俗流行", "年轻诙谐", "刺激冒险", "吸收电影、广告、汽车和摇滚"], people: [], works: [],
  },
  {
    id: "memphis", section: "后现代主义", title: "孟菲斯设计", period: "1981年起",
    summary: "索扎斯在米兰组织的先锋团队，以戏谑、自由和反规则反对冷峻现代主义。",
    features: ["造型奇异", "色彩跳脱", "反对功能至上束缚", "多为手工制作"], people: ["埃托尔·索扎斯"], works: ["孟菲斯小组作品"],
  },
];

