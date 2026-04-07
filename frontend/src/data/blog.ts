// Blog post data and types

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'news' | 'column' | 'property' | 'lifestyle';
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featured?: boolean;
}

export const blogCategories = {
  news: { label: 'お知らせ', color: '#06756d' },
  column: { label: 'コラム', color: '#e67e22' },
  property: { label: '物件情報', color: '#3498db' },
  lifestyle: { label: '暮らし', color: '#9b59b6' },
} as const;

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'housing-loan-guide-2024',
    title: '2024年版 住宅ローン金利の選び方完全ガイド',
    excerpt: '変動金利と固定金利、どちらを選ぶべき？最新の金利動向と、あなたに合った住宅ローンの選び方を詳しく解説します。',
    content: `
      <h2>はじめに</h2>
      <p>住宅購入を検討する際、多くの方が悩むのが住宅ローンの選び方です。特に金利タイプの選択は、返済総額に大きく影響するため、慎重に検討する必要があります。</p>
      
      <h2>変動金利のメリット・デメリット</h2>
      <p>変動金利は、市場金利の変動に応じて適用金利が変わるタイプです。現在は低金利が続いているため、固定金利よりも低い金利で借りられることが多いです。</p>
      <ul>
        <li><strong>メリット:</strong> 低金利時は返済額を抑えられる</li>
        <li><strong>デメリット:</strong> 金利上昇リスクがある</li>
      </ul>
      
      <h2>固定金利のメリット・デメリット</h2>
      <p>固定金利は、借入時に決まった金利が一定期間または全期間適用されるタイプです。将来の返済計画が立てやすいのが特徴です。</p>
      <ul>
        <li><strong>メリット:</strong> 返済額が安定する</li>
        <li><strong>デメリット:</strong> 変動金利より金利が高め</li>
      </ul>
      
      <h2>まとめ</h2>
      <p>住宅ローンの選び方に正解はありません。ご自身のライフプランや収入状況、リスク許容度を考慮して選択することが大切です。当社では、お客様一人ひとりに合った住宅ローンのご提案も行っておりますので、お気軽にご相談ください。</p>
    `,
    category: 'column',
    tags: ['住宅ローン', '金利', '資金計画', 'マイホーム'],
    author: {
      name: '山田 太郎',
      role: '代表取締役',
    },
    coverImage: '/images/blog/housing-loan.jpg',
    publishedAt: '2024-03-15',
    readingTime: 8,
    featured: true,
  },
  {
    id: '2',
    slug: 'spring-campaign-2024',
    title: '春の新生活応援キャンペーン開催中！',
    excerpt: '4月末まで、賃貸物件の仲介手数料が半額に。新生活をお得にスタートしましょう。',
    content: `
      <h2>キャンペーン概要</h2>
      <p>春の新生活シーズンに合わせて、賃貸物件をお探しの方へお得なキャンペーンを実施中です。</p>
      
      <h3>キャンペーン内容</h3>
      <ul>
        <li>仲介手数料：通常1ヶ月分 → <strong>0.5ヶ月分</strong></li>
        <li>対象：当社取扱いの賃貸物件全て</li>
        <li>期間：2024年4月30日まで</li>
      </ul>
      
      <h3>ご利用条件</h3>
      <p>ご来店時に「ホームページを見た」とお伝えください。</p>
      
      <h2>おすすめ物件も多数</h2>
      <p>駅近物件から広々ファミリー向けまで、多彩なラインナップをご用意しております。ぜひこの機会にご来店ください。</p>
    `,
    category: 'news',
    tags: ['キャンペーン', '賃貸', '新生活'],
    author: {
      name: '佐藤 花子',
      role: '営業部',
    },
    coverImage: '/images/blog/spring-campaign.jpg',
    publishedAt: '2024-03-10',
    readingTime: 3,
    featured: true,
  },
  {
    id: '3',
    slug: 'iwaki-life-guide',
    title: 'いわき市で暮らす魅力 | 移住者が語るリアルな声',
    excerpt: '東京からいわき市へ移住した3家族にインタビュー。暮らしやすさ、子育て環境、地域コミュニティの魅力をお伝えします。',
    content: `
      <h2>いわき市ってどんな街？</h2>
      <p>福島県いわき市は、太平洋に面した温暖な気候と豊かな自然が魅力の街です。東京から特急で約2時間半、車でも常磐自動車道を利用して約3時間とアクセスも良好です。</p>
      
      <h2>移住者インタビュー</h2>
      
      <h3>Aさんご家族（40代/会社員）</h3>
      <blockquote>「子どもたちがのびのび遊べる環境が何よりの魅力。週末は海や山で自然を満喫しています。」</blockquote>
      
      <h3>Bさんご家族（30代/リモートワーク）</h3>
      <blockquote>「住居費が東京の半分以下。生活にゆとりができ、趣味の時間も増えました。」</blockquote>
      
      <h3>Cさんご家族（50代/自営業）</h3>
      <blockquote>「地域の方々が温かく迎えてくれました。今では地元のお祭りにも参加しています。」</blockquote>
      
      <h2>移住支援制度も充実</h2>
      <p>いわき市では、移住者向けの様々な支援制度が用意されています。当社では移住に関するご相談も承っておりますので、お気軽にお問い合わせください。</p>
    `,
    category: 'lifestyle',
    tags: ['移住', 'いわき市', '暮らし', '子育て'],
    author: {
      name: '鈴木 一郎',
      role: '移住サポート担当',
    },
    coverImage: '/images/blog/iwaki-life.jpg',
    publishedAt: '2024-03-05',
    readingTime: 10,
    featured: true,
  },
  {
    id: '4',
    slug: 'new-mansion-iwaki-station',
    title: '【新着】いわき駅徒歩5分！新築マンション販売開始',
    excerpt: '駅近の好立地に誕生する全36戸の新築マンション。最新設備と充実の共用施設で、快適な暮らしを。',
    content: `
      <h2>物件概要</h2>
      <ul>
        <li><strong>所在地:</strong> 福島県いわき市平字○○</li>
        <li><strong>交通:</strong> JRいわき駅より徒歩5分</li>
        <li><strong>総戸数:</strong> 36戸</li>
        <li><strong>間取り:</strong> 2LDK〜4LDK</li>
        <li><strong>専有面積:</strong> 58.5㎡〜92.3㎡</li>
        <li><strong>入居開始:</strong> 2024年10月予定</li>
      </ul>
      
      <h2>設備・仕様</h2>
      <ul>
        <li>オール電化</li>
        <li>床暖房（LDK）</li>
        <li>食器洗い乾燥機</li>
        <li>浴室乾燥機</li>
        <li>宅配ボックス</li>
      </ul>
      
      <h2>モデルルーム見学受付中</h2>
      <p>現地モデルルームにて、実際のお部屋をご覧いただけます。ご予約はお電話またはWebフォームより承っております。</p>
    `,
    category: 'property',
    tags: ['新築', 'マンション', 'いわき駅', '販売中'],
    author: {
      name: '田中 健太',
      role: '売買営業部',
    },
    coverImage: '/images/blog/new-mansion.jpg',
    publishedAt: '2024-03-01',
    readingTime: 5,
  },
  {
    id: '5',
    slug: 'renovation-tips',
    title: '中古物件×リノベーションで理想の住まいを実現',
    excerpt: '新築より自由度が高い中古+リノベという選択肢。費用感やメリット・デメリット、成功のポイントを解説。',
    content: `
      <h2>中古+リノベーションとは</h2>
      <p>中古住宅を購入し、自分好みにリノベーションする方法が注目されています。新築よりも費用を抑えながら、間取りや内装を自由にカスタマイズできるのが魅力です。</p>
      
      <h2>費用の目安</h2>
      <table>
        <tr>
          <th>工事内容</th>
          <th>費用目安（㎡あたり）</th>
        </tr>
        <tr>
          <td>フルリノベーション</td>
          <td>15〜25万円</td>
        </tr>
        <tr>
          <td>水回りのみ</td>
          <td>5〜10万円</td>
        </tr>
        <tr>
          <td>内装のみ</td>
          <td>3〜8万円</td>
        </tr>
      </table>
      
      <h2>成功のポイント</h2>
      <ol>
        <li>構造・設備の状態をしっかり確認</li>
        <li>リノベーション費用も含めた資金計画を</li>
        <li>実績のある施工会社を選ぶ</li>
      </ol>
      
      <h2>当社のリノベーションサポート</h2>
      <p>物件探しから設計・施工まで、ワンストップでサポートいたします。リノベーションに適した物件のご紹介も可能です。</p>
    `,
    category: 'news',
    tags: ['リノベーション', '中古物件', '費用', 'DIY'],
    author: {
      name: '山田 太郎',
      role: '代表取締役',
    },
    coverImage: '/images/blog/renovation.jpg',
    publishedAt: '2024-02-25',
    readingTime: 7,
  },
  {
    id: '6',
    slug: 'gw-holiday-notice',
    title: 'GW期間の営業日のお知らせ',
    excerpt: 'ゴールデンウィーク期間中の営業日をご案内いたします。',
    content: `
      <h2>GW期間中の営業について</h2>
      <p>平素より当社をご利用いただき、誠にありがとうございます。ゴールデンウィーク期間中の営業日をご案内いたします。</p>
      
      <h3>営業カレンダー</h3>
      <ul>
        <li>4月27日（土）: 通常営業</li>
        <li>4月28日（日）: 通常営業</li>
        <li>4月29日（月・祝）: <strong>休業</strong></li>
        <li>4月30日（火）: 通常営業</li>
        <li>5月1日（水）: <strong>定休日</strong></li>
        <li>5月2日（木）: 通常営業</li>
        <li>5月3日（金・祝）: <strong>休業</strong></li>
        <li>5月4日（土・祝）: <strong>休業</strong></li>
        <li>5月5日（日・祝）: <strong>休業</strong></li>
        <li>5月6日（月・祝）: <strong>休業</strong></li>
      </ul>
      
      <p>5月7日（火）より通常営業となります。休業期間中のお問い合わせは、Webフォームよりお願いいたします。</p>
    `,
    category: 'news',
    tags: ['営業日', 'GW', 'お知らせ'],
    author: {
      name: '福縁西不動産',
    },
    coverImage: '/images/blog/gw-notice.jpg',
    publishedAt: '2024-02-20',
    readingTime: 2,
  },
];

// Helper functions
export function getLatestPosts(count: number = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getRelatedPosts(currentPost: BlogPost, count: number = 3): BlogPost[] {
  return blogPosts
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        (post.category === currentPost.category || post.tags.some((tag) => currentPost.tags.includes(tag)))
    )
    .slice(0, count);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
