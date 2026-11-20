export type PurposeMode = 'family' | 'investment' | 'penthouse';

export type NeighborhoodId = 'all' | 'niavaran' | 'farmanieh' | 'elahieh' | 'shahrak';

export interface ExpertNote {
  role: 'architect' | 'legal' | 'investment';
  expertName: string;
  title: string;
  license: string;
  experienceYears: number;
  score: number;
  summary: string;
  highlights: string[];
}

export interface LuxuryProperty {
  id: string;
  title: string;
  subtitle: string;
  neighborhood: Exclude<NeighborhoodId, 'all'>;
  neighborhoodLabel: string;
  purpose: PurposeMode[];
  priceBillion: number;
  areaSqm: number;
  bedrooms: number;
  parkingSpaces: number;
  buildingAgeYears: number;
  matchScore: number;
  annualRoiPercent: number;
  belowMarketPercent: number;
  liquidityScore: number;
  imageUrl: string;
  galleryImages: string[];
  floorInfo: string;
  documentStatus: string;
  bmsSmart: boolean;
  amenities: string[];
  experts: ExpertNote[];
}

export interface AudioGuideTrack {
  id: Exclude<NeighborhoodId, 'all'>;
  neighborhoodLabel: string;
  title: string;
  narrator: string;
  durationSeconds: number;
  frequencyBase: number;
  highlights: string[];
  transcript: string;
}

export const HERO_PENTHOUSE_IMAGE = './hero_penthouse_zafaraniyeh.jpg';

export const HERO_BACKGROUNDS: Record<PurposeMode, string> = {
  family: './hero_family_niavaran.jpg',
  investment: './hero_investment_fereshteh.jpg',
  penthouse: './hero_penthouse_zafaraniyeh.jpg',
};

export interface HeroShot {
  id: string;
  shotNumber: 1 | 2;
  src: string;
  poster: string;
  title: string;
  subtitle: string;
  location: string;
  highlight: string;
}

export interface HeroSequence {
  mode: PurposeMode;
  modeLabel: string;
  headline: string;
  shots: [HeroShot, HeroShot];
}

export const HERO_SEQUENCES: Record<PurposeMode, HeroSequence> = {
  family: {
    mode: 'family',
    modeLabel: 'سکونت خانوادگی',
    headline: 'آرامش، نور طبیعی و اصالت شمیرانات',
    shots: [
      {
        id: 'family_shot1',
        shotNumber: 1,
        src: './hero_family_shot1.mp4',
        poster: './hero_family_shot1.jpg',
        title: 'شات ۱: باغ‌ویلاهای مدرن و عمارت مسکونی سرو',
        subtitle: 'آرامش، معماری معاصر، بافت سبز و نورگیری ایده‌آل',
        location: 'شهرک غرب و سعادت‌آباد، منطقه ۲',
        highlight: 'بافت ویلایی آرام و خلوت',
      },
      {
        id: 'family_shot2',
        shotNumber: 2,
        src: './hero_family_shot2.mp4',
        poster: './hero_family_shot2.jpg',
        title: 'شات ۲: پهنه باغ‌ویلاها و برج‌باغ‌های نیاوران',
        subtitle: 'محله‌های اصیل‌نشین با بافت سبز و درختان کهنسال',
        location: 'نیاوران و کامرانیه، منطقه ۱',
        highlight: 'بافت سبز و اختصاصی',
      },
    ],
  },
  investment: {
    mode: 'investment',
    modeLabel: 'سرمایه‌گذاری پربازده',
    headline: 'معماری پیشرو، ارزش‌آفرینی و نقدشوندگی',
    shots: [
      {
        id: 'investment_shot1',
        shotNumber: 1,
        src: './hero_investment_shot1.mp4',
        poster: './hero_investment_fereshteh.jpg',
        title: 'شات ۱: نمای شاهکار ساختمان توحید (هوبا دیزاین)',
        subtitle: 'ترکیب مدرن آجر و کاشی فیروزه‌ای اصیل ایرانی',
        location: 'تهران، منطقه دیپلماتیک',
        highlight: 'معماری برنده جوایز بین‌المللی',
      },
      {
        id: 'investment_shot2',
        shotNumber: 2,
        src: './hero_investment_shot2.mp4',
        poster: './hero_investment_shot2.jpg',
        title: 'شات ۲: سالن دوبلکس خانه شریفی‌ها (دروس)',
        subtitle: 'شومینه خطی، نورگیری ۳۶۰ درجه و اتاق‌های چرخان',
        location: 'دروس و فرمانیه، منطقه ۳ و ۱',
        highlight: 'طراحی داخلی کلکسیونی',
      },
    ],
  },
  penthouse: {
    mode: 'penthouse',
    modeLabel: 'پنت‌هاوس و اسکای‌ویلا',
    headline: 'زندگی اختصاصی بر فراز افق پایتخت',
    shots: [
      {
        id: 'penthouse_shot1',
        shotNumber: 1,
        src: './hero_penthouse_shot1.mp4',
        poster: './hero_penthouse_zafaraniyeh.jpg',
        title: 'شات ۱: افق شبانه برج‌های الهیه و جردن',
        subtitle: 'چراغ‌های درخشان شهر زیر دامنه رشته‌کوه البرز',
        location: 'الهیه و فرشته، منطقه ۱',
        highlight: 'افق ۳۶۰ درجه شبانه',
      },
      {
        id: 'penthouse_shot2',
        shotNumber: 2,
        src: './hero_penthouse_shot2.mp4',
        poster: './hero_penthouse_shot2.jpg',
        title: 'شات ۲: استخر آبگرم اختصاصی و اسکای‌اسپای شیشه‌ای',
        subtitle: 'تجربه نهایت آسایش، آرامش و ریلکسیشن اختصاصی',
        location: 'زعفرانیه و فرشته، منطقه ۱',
        highlight: 'اسپای اختصاصی معلق در نور',
      },
    ],
  },
};

export const HERO_VIDEOS: Record<PurposeMode, string> = {
  family: './hero_family_shot1.mp4',
  investment: './hero_investment_shot1.mp4',
  penthouse: './hero_penthouse_shot1.mp4',
};

export const NEIGHBORHOOD_OPTIONS: { id: NeighborhoodId; label: string; avgPricePerSqm: string }[] = [
  { id: 'all', label: 'همه محله‌های برتر تهران', avgPricePerSqm: '۲۶۰ تا ۴۹۰ میلیون' },
  { id: 'niavaran', label: 'نیاوران (کاشانک و یاسر)', avgPricePerSqm: '۳۱۰ تا ۴۴۰ میلیون' },
  { id: 'farmanieh', label: 'فرمانیه (سنبل و اندرزگو)', avgPricePerSqm: '۳۳۰ تا ۴۶۰ میلیون' },
  { id: 'elahieh', label: 'الهیه (فرشته و مریم)', avgPricePerSqm: '۳۹۰ تا ۵۲۰ میلیون' },
  { id: 'shahrak', label: 'شهرک غرب (فاز ۱ و ۴)', avgPricePerSqm: '۲۵۰ تا ۳۷۰ میلیون' },
];

export const LUXURY_PROPERTIES: LuxuryProperty[] = [
  {
    id: 'arka-niavaran-01',
    title: 'برج‌باغ یاسر نیاوران',
    subtitle: 'چشم‌انداز ابدی کوهستان و ۶۵ متر تراس چهارفصل مشجر',
    neighborhood: 'niavaran',
    neighborhoodLabel: 'نیاوران · یاسر',
    purpose: ['family', 'penthouse'],
    priceBillion: 74,
    areaSqm: 265,
    bedrooms: 3,
    parkingSpaces: 3,
    buildingAgeYears: 1,
    matchScore: 96,
    annualRoiPercent: 28,
    belowMarketPercent: 7,
    liquidityScore: 92,
    imageUrl: './images/property_niavaran_garden.jpg',
    galleryImages: [
      './images/property_niavaran_garden.jpg',
      './images/property_niavaran_view.jpg',
      './images/property_niavaran_balcony.jpg',
      './images/property_niavaran_night.jpg',
    ],
    floorInfo: 'طبقه هفتم از هشت · تک‌واحدی',
    documentStatus: 'سند تک‌برگ ششدانگ شخصی بدون ریشه',
    bmsSmart: true,
    amenities: ['تراس گاردن اختصاصی', 'استخر و اسپا مشاع', 'سیستم هوشمند KNX', 'لابی‌من ۲۴ ساعته'],
    experts: [
      {
        role: 'architect',
        expertName: 'مهندس آرمان کاظمی',
        title: 'کارشناس ارشد سازه و معماری',
        license: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
        experienceYears: 17,
        score: 95,
        summary:
          'سازه بتنی پس‌کشیده با عایق صوتی سه‌لایه و پنجره‌های ترمال‌بریک آلمانی. تفکیک فضای نشیمن و خصوصی کاملاً مهندسی است.',
        highlights: ['نورگیری مستقیم جنوب و شمال', 'ارتفاع سقف خالص ۳٫۶۰ متر', 'متریال تراورتن اسلب حاجی‌آباد'],
      },
      {
        role: 'legal',
        expertName: 'دکتر سارا متین‌فر',
        title: 'مشاور حقوقی و ارزیابی اسناد ملکی',
        license: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
        experienceYears: 14,
        score: 100,
        summary:
          'استعلام ثبتی، پایان‌کار شهرداری منطقه ۱ و عدم خلافی به صورت کامل احراز شده و آماده انتقال قطعی در دفترخانه است.',
        highlights: ['سند تک‌برگ بدون بازداشت یا رهن', 'پایان‌کار ۱۴۰۳ تاییدشده', 'تضمین انتقال بی‌ریسک'],
      },
      {
        role: 'investment',
        expertName: 'مهرداد فرهادی',
        title: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
        license: 'تحلیلگر مالی CFA سطح ۳',
        experienceYears: 12,
        score: 93,
        summary:
          'قیمت اعلامی ۷٪ پایین‌تر از میانگین معاملات اخیر یاسر است. نرخ تقاضای رهن کامل بالای ۹ میلیارد تومان نقدشوندگی بالایی ایجاد می‌کند.',
        highlights: ['رشد تخمینی ۵ ساله: ۲۸٪ سالانه', 'زمان میانگین فروش مجدد: ۴۵ روز', 'حاشیه امنیت تورمی بالا'],
      },
    ],
  },
  {
    id: 'arka-elahieh-02',
    title: 'پنت‌هاوس دوبلکس مریم شرقی',
    subtitle: 'سقف دوبل‌هیت ۶ متری با شومینه برنز دست‌ساز و ووید معلق',
    neighborhood: 'elahieh',
    neighborhoodLabel: 'الهیه · فرشته',
    purpose: ['penthouse', 'investment'],
    priceBillion: 118,
    areaSqm: 340,
    bedrooms: 4,
    parkingSpaces: 4,
    buildingAgeYears: 0,
    matchScore: 94,
    annualRoiPercent: 31,
    belowMarketPercent: 5,
    liquidityScore: 89,
    imageUrl: './images/property_elahieh_residence.jpg',
    galleryImages: [
      './images/property_elahieh_residence.jpg',
      './images/property_elahieh_facade.jpg',
      './images/property_elahieh_atrium.jpg',
      './images/property_elahieh_pool.jpg',
    ],
    floorInfo: 'طبقه یازدهم و دوازدهم · آسانسور اختصاصی',
    documentStatus: 'سند تک‌برگ ششدانگ آماده انتقال',
    bmsSmart: true,
    amenities: ['روف‌گاردن اختصاصی', 'آشپزخانه فرنیش Gaggenau', 'سینمای خانگی آکوستیک', '۴ پارکینگ سندی باکس'],
    experts: [
      {
        role: 'architect',
        expertName: 'مهندس آرمان کاظمی',
        title: 'کارشناس ارشد سازه و معماری',
        license: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
        experienceYears: 17,
        score: 98,
        summary:
          'یکی از کم‌نظیرترین پلان‌های دوبل‌هیت در بافت فرشته با دید ۳۶۰ درجه بدون مشرف و جزئیات اجرایی در سطح اقامتگاه‌های مدرن سوئیس.',
        highlights: ['دید پانورامیک بی‌رقیب', 'شیرآلات و تجهیزات تمام اروپایی', 'سیستم تهویه VRF مستقل'],
      },
      {
        role: 'legal',
        expertName: 'دکتر سارا متین‌فر',
        title: 'مشاور حقوقی و ارزیابی اسناد ملکی',
        license: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
        experienceYears: 14,
        score: 99,
        summary:
          'تمامی استعلامات دارایی، شهرداری و انشعابات اختصاصی تسویه شده و تفکیک عرصه و اعیان بدون نقص ثبتی انجام گرفته است.',
        highlights: ['مالکیت تک‌شخصی', 'انشعابات مستقل برق سه‌فاز', 'قرارداد رسمی با تعهد تحویل آنی'],
      },
      {
        role: 'investment',
        expertName: 'مهرداد فرهادی',
        title: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
        license: 'تحلیلگر مالی CFA سطح ۳',
        experienceYears: 12,
        score: 95,
        summary:
          'محدودیت عرضه پنت‌هاوس نوساز در خیابان مریم باعث رشد پایدار ارزش دلاری این کلاس دارایی طی یک دهه گذشته بوده است.',
        highlights: ['بازدهی ترکیبی تخمینی ۳۱٪ سالانه', 'حفظ ارزش ارزی ممتاز', 'پتانسیل اجاره دیپلماتیک'],
      },
    ],
  },
  {
    id: 'arka-farmanieh-03',
    title: 'آپارتمان مینیمال باغ سنبل',
    subtitle: 'روف‌گاردن چهارفصل با شیدرهای چوبی و آرامش کوچه دنج',
    neighborhood: 'farmanieh',
    neighborhoodLabel: 'فرمانیه · سنبل',
    purpose: ['family', 'investment'],
    priceBillion: 52,
    areaSqm: 195,
    bedrooms: 3,
    parkingSpaces: 2,
    buildingAgeYears: 2,
    matchScore: 95,
    annualRoiPercent: 26,
    belowMarketPercent: 9,
    liquidityScore: 96,
    imageUrl: './images/property_farmanieh_villa.jpg',
    galleryImages: [
      './images/property_farmanieh_villa.jpg',
      './images/property_farmanieh_terrace.jpg',
      './images/property_farmanieh_interior.jpg',
      './images/property_farmanieh_facade_top.jpg',
    ],
    floorInfo: 'طبقه پنجم از شش · دوواحدی بدون دیوار مشترک',
    documentStatus: 'سند تک‌برگ ششدانگ شخصی',
    bmsSmart: true,
    amenities: ['روف‌گاردن چهارفصل', 'سالن ورزش و بیلیارد', 'کفپوش چوب بلوط اتریشی', 'دسترسی سریع به اتوبان صدر'],
    experts: [
      {
        role: 'architect',
        expertName: 'مهندس آرمان کاظمی',
        title: 'کارشناس ارشد سازه و معماری',
        license: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
        experienceYears: 17,
        score: 92,
        summary:
          'پلان بدون پرتی با نشیمن خصوصی مجزا و سه خواب مستر. استفاده هوشمندانه از آجر مهندسی و شیدرهای چوبی، آسایش اقلیمی کم‌نظیری دارد.',
        highlights: ['عدم وجود دیوار مشترک', '۳ خواب مستر با کلوزت', 'سیستم تصفیه هوای مرکزی'],
      },
      {
        role: 'legal',
        expertName: 'دکتر سارا متین‌فر',
        title: 'مشاور حقوقی و ارزیابی اسناد ملکی',
        license: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
        experienceYears: 14,
        score: 100,
        summary:
          'پروانه ساخت، صورت‌مجلس تفکیکی و سند تک‌برگ کاملاً منطبق بوده و سهم‌العرصه ارزشمندی در زمین ۱٬۱۰۰ متری دارد.',
        highlights: ['سهم‌العرصه ممتاز', 'صورت‌مجلس تفکیکی کامل', 'بدون معارض و ریشه اوقاف'],
      },
      {
        role: 'investment',
        expertName: 'مهرداد فرهادی',
        title: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
        license: 'تحلیلگر مالی CFA سطح ۳',
        experienceYears: 12,
        score: 97,
        summary:
          'در بازه ۵۰ تا ۶۰ میلیارد تومان، این واحد بالاترین شاخص نقدشوندگی منطقه فرمانیه را دارد و ۹٪ زیر ارزش کارشناسی قیمت‌گذاری شده است.',
        highlights: ['۹٪ زیر قیمت کارشناسی منطقه', 'شاخص نقدشوندگی ۹۶ از ۱۰۰', 'مناسب سرمایه‌گذاری کم‌ریسک'],
      },
    ],
  },
  {
    id: 'arka-shahrak-04',
    title: 'ویلای مدرن حیاط‌دار مهستان',
    subtitle: 'معماری بتن و چوب ساج با استخر روباز اختصاصی و احجام کنسولی',
    neighborhood: 'shahrak',
    neighborhoodLabel: 'شهرک غرب · فاز ۱',
    purpose: ['family', 'investment'],
    priceBillion: 68,
    areaSqm: 310,
    bedrooms: 4,
    parkingSpaces: 3,
    buildingAgeYears: 3,
    matchScore: 91,
    annualRoiPercent: 25,
    belowMarketPercent: 6,
    liquidityScore: 90,
    imageUrl: './images/property_shahrak_modern.jpg',
    galleryImages: [
      './images/property_shahrak_modern.jpg',
      './images/property_shahrak_pods.jpg',
      './images/property_shahrak_pool.jpg',
      './images/property_shahrak_neighborhood.jpg',
    ],
    floorInfo: 'دوبلکس مستقل با حیاط اختصاصی ۱۸۰ متری',
    documentStatus: 'سند تک‌برگ عرصه و اعیان',
    bmsSmart: true,
    amenities: ['استخر چهارفصل در حیاط', 'لوورهای چوب ترموود', 'نگهبانی محله ۲۴ ساعته', 'آسانسور هیدرولیک داخلی'],
    experts: [
      {
        role: 'architect',
        expertName: 'مهندس آرمان کاظمی',
        title: 'کارشناس ارشد سازه و معماری',
        license: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
        experienceYears: 17,
        score: 94,
        summary:
          'طراحی برون‌گرا با حفظ کامل حریم خصوصی از طریق لوورهای متحرک چوب ساج. ارتباط سیال پذیرایی با حیاط و استخر بی‌نقص است.',
        highlights: ['حریم خصوصی کامل', 'تاسیسات استخر تمام‌اتوماتیک', 'نمای مقاوم در برابر اقلیم تهران'],
      },
      {
        role: 'legal',
        expertName: 'دکتر سارا متین‌فر',
        title: 'مشاور حقوقی و ارزیابی اسناد ملکی',
        license: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
        experienceYears: 14,
        score: 98,
        summary:
          'سند تک‌برگ عرصه و اعیان بدون بازداشت و عدم خلاف شهرداری منطقه ۲ کاملاً اخذ شده است.',
        highlights: ['انتقال قطعی در دفتر اسناد رسمی', 'پایان‌کار بدون بدهی عوارض', 'فاقد هرگونه تعارض ثبتی'],
      },
      {
        role: 'investment',
        expertName: 'مهرداد فرهادی',
        title: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
        license: 'تحلیلگر مالی CFA سطح ۳',
        experienceYears: 12,
        score: 89,
        summary:
          'تقاضای بسیار بالا برای بافت ویلایی فاز یک شهرک غرب موجب شده ارزش این ملک در برابر نوسانات بازار کاملاً محفوظ بماند.',
        highlights: ['تقاضای سنتی و پایدار', 'شاخص نقدشوندگی ممتاز در املاک ویلایی', 'پتانسیل افزایش ارزش پس از ارتقای دکوراسیون'],
      },
    ],
  },
  {
    id: 'arka-zafaraniyeh-05',
    title: 'اسکای‌ویلا تریپلکس آصف زعفرانیه',
    subtitle: 'چشم‌انداز پانورامیک شهر و کوهستان با اسپا و سالن ورزشی اختصاصی',
    neighborhood: 'elahieh',
    neighborhoodLabel: 'زعفرانیه · آصف',
    purpose: ['penthouse', 'family'],
    priceBillion: 148,
    areaSqm: 420,
    bedrooms: 4,
    parkingSpaces: 5,
    buildingAgeYears: 0,
    matchScore: 97,
    annualRoiPercent: 33,
    belowMarketPercent: 4,
    liquidityScore: 88,
    imageUrl: './images/property_zafaraniyeh_skyvilla.jpg',
    galleryImages: [
      './images/property_zafaraniyeh_skyvilla.jpg',
      './images/property_zafaraniyeh_living.jpg',
      './images/property_zafaraniyeh_wellness.jpg',
      './images/property_zafaraniyeh_view.jpg',
    ],
    floorInfo: 'طبقات ۱۳ و ۱۴ و ۱۵ (تریپلکس اختصاصی)',
    documentStatus: 'سند تک‌برگ ششدانگ اعیان آماده محضر',
    bmsSmart: true,
    amenities: ['استخر اختصاصی در تراز بالا', 'هلی‌پد دسترسی برج', 'سالن بیلیارد و سینما اختصاصی', 'سوئیت مجزای خدمه و مهمان'],
    experts: [
      {
        role: 'architect',
        expertName: 'مهندس آرمان کاظمی',
        title: 'کارشناس ارشد سازه و معماری',
        license: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
        experienceYears: 17,
        score: 99,
        summary:
          'شاهکار مهندسی سازه فولادی با میراگرهای زلزله تا ۹ ریشتر. تراس‌های معلق با دید ابدی رشته‌کوه توچال و تهران.',
        highlights: ['ارتفاع سقف ۴٫۲۰ متر', 'آکوستیک صوتی کلاس A', 'سنگ‌های بوک‌مچ یکپارچه ایتالیایی'],
      },
      {
        role: 'legal',
        expertName: 'دکتر سارا متین‌فر',
        title: 'مشاور حقوقی و ارزیابی اسناد ملکی',
        license: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
        experienceYears: 14,
        score: 100,
        summary:
          'تفکیک ثبتی قطعی انجام شده و تضمین سلامت کامل سند توسط وکلای ارشد آرکا استیت تایید گردیده است.',
        highlights: ['سند آماده انتقال فوری', 'تسویه حساب کامل شهرداری و نظام مهندسی', 'بدون ریشه اوقاف یا مصادره'],
      },
      {
        role: 'investment',
        expertName: 'مهرداد فرهادی',
        title: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
        license: 'تحلیلگر مالی CFA سطح ۳',
        experienceYears: 12,
        score: 94,
        summary:
          'پنت‌هاوس‌های تریپلکس خیابان آصف بالاترین حفظ ارزش ارزی و دلاری را در کل بازار مسکن پایتخت ثبت کرده‌اند.',
        highlights: ['دارایی فوق‌لوکس کلکسیونی', 'بازدهی ترکیبی سالانه ۳۳٪', 'نرخ اجاره دلاری به سفارتخانه‌ها'],
      },
    ],
  },
  {
    id: 'arka-kamranieh-06',
    title: 'برج‌باغ هوشمند دیپلمات کامرانیه',
    subtitle: 'پلان تفکیکی بدون پرتی، تراس مبله ۳۵ متری با دید ابدی جنوب پایتخت',
    neighborhood: 'farmanieh',
    neighborhoodLabel: 'کامرانیه شمالی',
    purpose: ['investment', 'family'],
    priceBillion: 88,
    areaSqm: 290,
    bedrooms: 3,
    parkingSpaces: 3,
    buildingAgeYears: 1,
    matchScore: 93,
    annualRoiPercent: 29,
    belowMarketPercent: 8,
    liquidityScore: 94,
    imageUrl: './images/property_kamranieh_tower.jpg',
    galleryImages: [
      './images/property_kamranieh_tower.jpg',
      './images/property_kamranieh_facade.jpg',
      './images/property_kamranieh_terrace.jpg',
      './images/property_kamranieh_skyline.jpg',
    ],
    floorInfo: 'طبقه نهم از یازده · پاگرد اختصاصی',
    documentStatus: 'سند تک‌برگ شخصی آزاد',
    bmsSmart: true,
    amenities: ['لابی دوبل به ارتفاع ۶ متر', 'مشاعات آبی مجهز و سالن اسپا', 'سیستم مدیریت هوشمند اشنایدر', '۳ پارکینگ سندی'],
    experts: [
      {
        role: 'architect',
        expertName: 'مهندس آرمان کاظمی',
        title: 'کارشناس ارشد سازه و معماری',
        license: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
        experienceYears: 17,
        score: 93,
        summary:
          'ترکیب حجمی فوق‌العاده با پنجره‌های قدی بدون ستون در نشیمن. عایق‌بندی کامل حرارتی و صوتی با دیوارهای دولایه کناف.',
        highlights: ['دید باز و بدون مشرف', 'تراس قابل چیدمان با انشعابات کامل', 'شیرآلات توکار Grohe آلمان'],
      },
      {
        role: 'legal',
        expertName: 'دکتر سارا متین‌فر',
        title: 'مشاور حقوقی و ارزیابی اسناد ملکی',
        license: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
        experienceYears: 14,
        score: 100,
        summary:
          'پایان‌کار جدید، صورت‌جلسه تفکیکی مصوب و استعلام ثبت منطقه کاملاً دریافت و بایگانی شده است.',
        highlights: ['آماده محضر', 'بدون هرگونه ادعای ثالث', 'تضمین کتبی انتقال در مهلت مقرر'],
      },
      {
        role: 'investment',
        expertName: 'مهرداد فرهادی',
        title: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
        license: 'تحلیلگر مالی CFA سطح ۳',
        experienceYears: 12,
        score: 96,
        summary:
          '۸٪ زیر قیمت میانگین معاملات منطقه کامرانیه شمالی عرضه شده که بازدهی نقدی و سرمایه‌ای بالایی تضمین می‌کند.',
        highlights: ['۸٪ زیر قیمت کارشناسی', 'نقدشوندگی ۹۴ از ۱۰۰', 'پیش‌بینی بازدهی ۲۹٪ سالانه'],
      },
    ],
  },
  {
    id: 'arka-shahrak-07',
    title: 'عمارت هوشمند فاز ۴ خوارزم',
    subtitle: 'معماری احجام کنسولی شناور با محوطه‌سازی اختصاصی و استخر سرپوشیده',
    neighborhood: 'shahrak',
    neighborhoodLabel: 'شهرک غرب · فاز ۴',
    purpose: ['family', 'penthouse'],
    priceBillion: 135,
    areaSqm: 450,
    bedrooms: 5,
    parkingSpaces: 4,
    buildingAgeYears: 2,
    matchScore: 92,
    annualRoiPercent: 27,
    belowMarketPercent: 5,
    liquidityScore: 91,
    imageUrl: './images/property_shahrak_khwarazm.jpg',
    galleryImages: [
      './images/property_shahrak_khwarazm.jpg',
      './images/property_shahrak_cubes.jpg',
      './images/property_shahrak_spa.jpg',
      './images/property_shahrak_park.jpg',
    ],
    floorInfo: 'تریپلکس مستقل ویلایی با آسانسور هیدرولیک شیشه‌ای',
    documentStatus: 'سند تک‌برگ عرصه و اعیان شخصی',
    bmsSmart: true,
    amenities: ['استخر سرپوشیده شیشه‌ای و جکوزی', 'روف‌گاردن ۳۶۰ درجه', 'سیستم صوتی Bose در تمام طبقات', 'ژنراتور برق اضطراری مستقل'],
    experts: [
      {
        role: 'architect',
        expertName: 'مهندس آرمان کاظمی',
        title: 'کارشناس ارشد سازه و معماری',
        license: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
        experienceYears: 17,
        score: 95,
        summary:
          'معماری آوانگارد با ترکیب بتن شیشه‌ای، لوورهای متحرک چوبی و سقف‌های بلند دکوراتیو. ارتباط فضایی کم‌نظیر میان طبقات.',
        highlights: ['پلان ویلایی کاملاً سفارشی', 'نورگیری طبیعی از ۴ جهت', 'محوطه‌سازی با درختان زینتی هلندی'],
      },
      {
        role: 'legal',
        expertName: 'دکتر سارا متین‌فر',
        title: 'مشاور حقوقی و ارزیابی اسناد ملکی',
        license: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
        experienceYears: 14,
        score: 99,
        summary:
          'سند ششدانگ عرصه و اعیان فاقد هرگونه بدهی بانکی یا شهرداری بوده و صحت اسناد مالکیت تایید گردیده است.',
        highlights: ['مالکیت کاملاً شخصی', 'فاقد ریشه بنیادی یا اوقافی', 'استعلام اداره ثبت منطقه ۲ پاک'],
      },
      {
        role: 'investment',
        expertName: 'مهرداد فرهادی',
        title: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
        license: 'تحلیلگر مالی CFA سطح ۳',
        experienceYears: 12,
        score: 91,
        summary:
          'کلاس دارایی ویلایی در خیابان‌های مرغوب فاز ۴ خوارزم از بیشترین تقاضای انحصاری و کمترین نوسان منفی برخوردار است.',
        highlights: ['حفظ ارزش کم‌ریسک', 'نقدشوندگی سریع در بازار املاک لوکس', 'رشد سالانه ۲۷٪'],
      },
    ],
  },
  {
    id: 'arka-niavaran-08',
    title: 'عمارت مشجر بوستان باهنر',
    subtitle: 'ترکیب معماری ارگانیک با باغ اصیل شمیرانات و تراس‌های معلق سراسری',
    neighborhood: 'niavaran',
    neighborhoodLabel: 'نیاوران · باهنر',
    purpose: ['family', 'investment'],
    priceBillion: 98,
    areaSqm: 330,
    bedrooms: 4,
    parkingSpaces: 4,
    buildingAgeYears: 1,
    matchScore: 95,
    annualRoiPercent: 30,
    belowMarketPercent: 7,
    liquidityScore: 93,
    imageUrl: './images/property_niavaran_mansion.jpg',
    galleryImages: [
      './images/property_niavaran_mansion.jpg',
      './images/property_niavaran_garden_path.jpg',
      './images/property_niavaran_hall.jpg',
      './images/property_niavaran_alborz.jpg',
    ],
    floorInfo: 'طبقه ششم از هشت · دوواحدی با آسانسورهای مجزا',
    documentStatus: 'سند تک‌برگ ششدانگ بدون ریشه',
    bmsSmart: true,
    amenities: ['باغ اختصاصی ۲٬۰۰۰ متری با چنارهای کهنسال', 'سالن اجتماعات مجلل و لابی‌من ۲۴ ساعته', 'سالن اسکواش و جیم', 'سیستم ایمنی ضدحریق پیشرفته'],
    experts: [
      {
        role: 'architect',
        expertName: 'مهندس آرمان کاظمی',
        title: 'کارشناس ارشد سازه و معماری',
        license: 'پروانه پایه یک نظام مهندسی · ۲۸۴۱۱',
        experienceYears: 17,
        score: 96,
        summary:
          'طراحی احترام‌آمیز به طبیعت شمیران، دیوارهای پوشیده از گیاهان رونده و سنگ‌های طبیعی کوهپایه البرز.',
        highlights: ['دید ابدی باغ و کوهستان', 'تراس‌های وسیع با سقف چوبی', 'متریال پایدار و دوستدار محیط‌زیست'],
      },
      {
        role: 'legal',
        expertName: 'دکتر سارا متین‌فر',
        title: 'مشاور حقوقی و ارزیابی اسناد ملکی',
        license: 'وکیل پایه یک دادگستری · ۴۹۱۲۰',
        experienceYears: 14,
        score: 100,
        summary:
          'سند تک‌برگ شخصی با حدود اربعه مشخص، پایان‌کار ۱۴۰۳ و تاییدیه رسمی شهرداری منطقه ۱.',
        highlights: ['انتقال بی‌دغدغه و فوری', 'عرصه وسیع با قدرالسهم ممتاز', 'بدون هیچ‌گونه معارض'],
      },
      {
        role: 'investment',
        expertName: 'مهرداد فرهادی',
        title: 'تحلیلگر ارشد سرمایه‌گذاری املاک',
        license: 'تحلیلگر مالی CFA سطح ۳',
        experienceYears: 12,
        score: 95,
        summary:
          'ملک‌های باغی در نیاوران به دلیل کمیابی زمین، بیشترین ضریب افزایش قیمت در شمال تهران را به خود اختصاص می‌دهند.',
        highlights: ['رشد سرمایه ۳۰٪ سالانه', 'حاشیه امن در برابر تورم مسکن', 'تقاضای بسیار بالا جهت سکونت'],
      },
    ],
  },
];

export const AUDIO_GUIDE_TRACKS: AudioGuideTrack[] = [
  {
    id: 'niavaran',
    neighborhoodLabel: 'نیاوران · یاسر و کاشانک',
    title: 'نیاوران؛ تلفیق نبض کاخ‌ها با نسیم ابدی توچال',
    narrator: 'مهندس آرمان کاظمی · کارشناس ارشد معماری',
    durationSeconds: 12,
    frequencyBase: 196,
    highlights: [
      'اختلاف دمای ۳ درجه‌ای با مرکز شهر به دلیل دالان بادی دره دارآباد',
      'بافت غالب برج‌باغ با سرانه فضای سبز بالای ۴۵ مترمربع به ازای هر واحد',
      'دسترسی سریع به مسیرهای پیاده‌روی کلک‌چال و بوستان جمشیدیه',
    ],
    transcript:
      '«سلام. اگر در جستجوی سکونتی هستید که صبح‌ها با صدای وزش نسیم در میان برگ چنارهای کهنسال بیدار شوید، محدوده یاسر و بوستان نیاوران انتخابی بی‌همتاست. این پهنه با حفظ حریم باغ‌های تاریخی، شاخص‌ترین برج‌باغ‌های مدرن تهران را در خود جای داده است.»',
  },
  {
    id: 'farmanieh',
    neighborhoodLabel: 'فرمانیه · سنبل و دیباجی',
    title: 'فرمانیه؛ اصالت بن‌بست‌های دنج با دسترسی ممتاز صدر',
    narrator: 'دکتر سارا متین‌فر · وکیل پایه یک و ارزیاب املاک',
    durationSeconds: 11,
    frequencyBase: 220,
    highlights: [
      'ثبات سندی و عرصه شخصی بدون هرگونه ریشه اوقافی در خیابان‌های اصلی سنبل',
      'نزدیکی ایده‌آل به شریان‌های اصلی ارتباطی پایتخت بدون قرارگیری در ترافیک محلی',
      'بافت سکونتی خلوت، اصیل و گزیده‌نشین با امنیت محلی ممتاز',
    ],
    transcript:
      '«فرمانیه غربی و خیابان سنبل، از نادرترین نقاط شمال تهران هستند که توانسته‌اند آرامش بن‌بست‌های پهن و مشجر را با استانداردهای شهرسازی مدرن تلفیق کنند. از منظر ثبتی و حقوقی، اسناد این محدوده بالاترین شاخص سلامت معاملاتی را در شمیران دارند.»',
  },
  {
    id: 'elahieh',
    neighborhoodLabel: 'الهیه · فرشته و چناران',
    title: 'الهیه؛ پایتخت معماری های‌تک و پرچمدار ارزش ارزی',
    narrator: 'مهرداد فرهادی · تحلیلگر ارشد سرمایه‌گذاری املاک',
    durationSeconds: 13,
    frequencyBase: 246.94,
    highlights: [
      'بالاترین همبستگی ارزش املاک با نوسانات نرخ ارز و حفظ قدرت خرید ارزی',
      'تمرکز برترین سازه‌ها و پنت‌هاوس‌های برندینگ ایران با معماری آرشیتکت‌های بین‌المللی',
      'تقاضای پایدار اجاره دلاری برای هیئت‌های دیپلماتیک و مدیران ارشد خارجی',
    ],
    transcript:
      '«خیابان فرشته و محله الهیه، نبض تپنده املاک فوق‌لوکس تهران است. خرید پنت‌هاوس در این منطقه صرفاً تهیه یک مسکن نیست؛ بلکه تملک یک کلاس دارایی بین‌المللی است که در بحران‌های اقتصادی، همواره بیشترین بازدهی دلاری را رقم زده است.»',
  },
  {
    id: 'shahrak',
    neighborhoodLabel: 'شهرک غرب · فازهای ۱ تا ۴',
    title: 'شهرک غرب؛ شهرسازی مهندسی‌شده با آسمان بی‌کران',
    narrator: 'مهندس آرمان کاظمی · کارشناس ارشد معماری',
    durationSeconds: 12,
    frequencyBase: 174.61,
    highlights: [
      'خیابان‌های عریض ۲۰ تا ۳۰ متری با شیب ملایم و سیستم دسترسی مشبک بدون بن‌بست',
      'بهترین بهره‌مندی از دالان باد شهری غرب تهران و هوای عاری از وارونگی زمستانه',
      'تنوع منحصر‌به‌فرد از ویلاهای دوبلکس حیاط‌دار تا پنت‌هاوس‌های بافت مدرن',
    ],
    transcript:
      '«شهرک غرب نمونه بی‌نظیر شهرسازی استاندارد در پایتخت است. نبود سایه‌انداز ساختمان‌های بلند بر ویلاها، حیاط‌های دلباز و آرامش فازهای مسکونی، این محله را به مقصدی ایده‌آل برای خانواده‌هایی بدل کرده که خواهان سکونتی دلباز و آرام هستند.»',
  },
];

export interface NewDevelopmentProject {
  id: string;
  title: string;
  subtitle: string;
  architect: string;
  neighborhood: Exclude<NeighborhoodId, 'all'>;
  neighborhoodLabel: string;
  progressPercent: number;
  deliveryDate: string;
  totalUnits: number;
  availableUnits: number;
  pricePerSqmRange: string;
  imageUrl: string;
  tags: string[];
  paymentPlan: string;
}

export const NEW_DEVELOPMENTS: NewDevelopmentProject[] = [
  {
    id: 'dev-niavaran-sapphire',
    title: 'برج‌باغ یاقوت نیاوران',
    subtitle: 'طراحی دیکانستراکتیو با تراس‌های معلق و چشم‌انداز ۳۶۰ درجه البرز',
    architect: 'استودیو معماری دلیری و همکاران',
    neighborhood: 'niavaran',
    neighborhoodLabel: 'نیاوران · یاسر',
    progressPercent: 82,
    deliveryDate: 'پاییز ۱۴۰۵',
    totalUnits: 14,
    availableUnits: 3,
    pricePerSqmRange: '۳۳۰ تا ۴۲۰ میلیون',
    imageUrl: './images/dev_niavaran_sapphire.jpg',
    tags: ['بتن عیار ۵۰۰ پوزولانی', 'استخر معلق طبقه دهم', 'سیستم BMS اروپایی'],
    paymentPlan: '۴۰٪ پیش‌پرداخت، ۵۰٪ اقساط ۳۰ ماهه همگام با پیشرفت، ۱۰٪ تحویل و سند',
  },
  {
    id: 'dev-elahieh-mirage',
    title: 'اقامتگاه مدرن سراب الهیه',
    subtitle: 'شاهکار مینیمال تمام‌شیشه با شیدرهای برنزی متحرک و ارتفاع سقف ۴٫۲۰ متر',
    architect: 'دفتر معماری علیرضا تغابنی',
    neighborhood: 'elahieh',
    neighborhoodLabel: 'الهیه · مریم شرقی',
    progressPercent: 68,
    deliveryDate: 'بهار ۱۴۰۶',
    totalUnits: 9,
    availableUnits: 2,
    pricePerSqmRange: '۴۱۰ تا ۵۶۰ میلیون',
    imageUrl: './images/property_elahieh_facade.jpg',
    tags: ['سنگ اسلب بوک‌مچ کالاتاکا', 'فضای ورزشی و سالن اسکواش', 'روف‌گاردن چهارفصل'],
    paymentPlan: '۳۵٪ پیش‌پرداخت، ۵۵٪ اقساط ۳۶ ماهه، ۱۰٪ انتقال قطعی سند',
  },
  {
    id: 'dev-farmanieh-botanical',
    title: 'عمارت بوستان فرمانیه',
    subtitle: 'ترکیب هوشمندانه باغ ایرانی با معماری پایدار و لابی مجلل به ارتفاع ۱۲ متر',
    architect: 'استودیو معماری هادی تهرانی',
    neighborhood: 'farmanieh',
    neighborhoodLabel: 'فرمانیه · سنبل',
    progressPercent: 91,
    deliveryDate: 'اسفند ۱۴۰۴',
    totalUnits: 18,
    availableUnits: 4,
    pricePerSqmRange: '۳۵۰ تا ۴۵۰ میلیون',
    imageUrl: './images/dev_farmanieh_botanical.jpg',
    tags: ['سازه ضدزلزله میراگر', 'لابی‌من و نگهبانی ۲۴ ساعته', '۳ پارکینگ سندی برای هر واحد'],
    paymentPlan: '۵۰٪ پیش‌پرداخت، ۴۰٪ اقساط تا زمان تحویل، ۱۰٪ انتقال سند در دفترخانه',
  },
  {
    id: 'dev-shahrak-avantgarde',
    title: 'پروژه هرم‌های مدرن خوارزم',
    subtitle: 'تراس‌های پلکانی معلق با دید کامل پایتخت و معماری همگام با دالان باد غرب',
    architect: 'مهندسان مشاور شارستان و همکاران',
    neighborhood: 'shahrak',
    neighborhoodLabel: 'شهرک غرب · فاز ۴',
    progressPercent: 74,
    deliveryDate: 'زمستان ۱۴۰۵',
    totalUnits: 12,
    availableUnits: 3,
    pricePerSqmRange: '۲۸۰ تا ۳۹۰ میلیون',
    imageUrl: './images/dev_shahrak_avantgarde.jpg',
    tags: ['طراحی بیوکلیماتیک', 'اسپا و استخر سرپوشیده اختصاصی', 'ژنراتور برق خورشیدی'],
    paymentPlan: '۴۰٪ پیش‌پرداخت، ۵۰٪ اقساط ۲۴ ماهه، ۱۰٪ تحویل کلید و سند',
  },
  {
    id: 'dev-zafaraniyeh-solitude',
    title: 'مجموعه مسکونی آصف زعفرانیه',
    subtitle: 'عمارت مشجر بر فراز شیب‌های زعفرانیه با سنگ‌های طبیعی و وویدهای گیاهی',
    architect: 'استودیو معماری افشارمنش',
    neighborhood: 'elahieh',
    neighborhoodLabel: 'زعفرانیه · آصف',
    progressPercent: 88,
    deliveryDate: 'تابستان ۱۴۰۵',
    totalUnits: 8,
    availableUnits: 2,
    pricePerSqmRange: '۴۲۰ تا ۶۰۰ میلیون',
    imageUrl: './images/dev_zafaraniyeh_solitude.jpg',
    tags: ['متریال سفارشی وارداتی', 'سیستم هوشمند تهویه VRF', 'روف‌گاردن و فضای آتشدان اختصاصی'],
    paymentPlan: '۴۵٪ پیش‌پرداخت، ۴۵٪ اقساط ۱۸ ماهه، ۱۰٪ انتقال قطعی سند در محضر',
  },
];
