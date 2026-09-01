export interface DestinationPhoto {
  url: string;
  title: string;
  location: string;
  category: 'landmark' | 'culture' | 'food' | 'nature' | 'heritage';
  credit?: string;
}

export const PHARAONIC_HERITAGE_GALLERY: DestinationPhoto[] = [
  {
    url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    title: 'أهرامات الجيزة العظيمة وأبو الهول الخالد',
    location: 'الجيزة، مصر',
    category: 'heritage',
    credit: 'Giza Pyramids'
  },
  {
    url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
    title: 'معبد الكرنك وصرح الأعمدة الأسطوري',
    location: 'الأقصر، طيبة القديمة',
    category: 'heritage',
    credit: 'Karnak Temple'
  },
  {
    url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
    title: 'معبد أبو سمبل العظيم لرمسيس الثاني',
    location: 'أسوان، النوبة',
    category: 'heritage',
    credit: 'Abu Simbel'
  },
  {
    url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    title: 'أزقة خان الخليلي وشارع المعز لدين الله الفاطمي',
    location: 'القاهرة التاريخية',
    category: 'culture',
    credit: 'Khan el-Khalili'
  },
  {
    url: 'https://images.unsplash.com/photo-1566192091743-5966a6079984?auto=format&fit=crop&w=1200&q=80',
    title: 'فلوكة النيل الشراعية وسحر غروب الشمس الأبدي',
    location: 'نهر النيل، أسوان والقاهرة',
    category: 'nature',
    credit: 'Nile River'
  },
  {
    url: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
    title: 'المتحف المصري الكبير (GEM) وكنوز الملك توت عنخ آمون',
    location: 'هضبة الأهرام، الجيزة',
    category: 'culture',
    credit: 'Grand Egyptian Museum'
  }
];

export const DESTINATION_PHOTOS_MAP: Record<string, DestinationPhoto[]> = {
  // Egypt & Cairo
  'مصر': PHARAONIC_HERITAGE_GALLERY,
  'القاهرة': [
    {
      url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
      title: 'أهرامات الجيزة وأبو الهول',
      location: 'الجيزة / القاهرة',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
      title: 'حي خان الخليلي وشارع المعز التاريخي',
      location: 'القاهرة القديمة',
      category: 'culture'
    },
    {
      url: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
      title: 'كنوز الفراعنة والمتحف المصري الكبير',
      location: 'القاهرة والجيزة',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1566192091743-5966a6079984?auto=format&fit=crop&w=1200&q=80',
      title: 'غروب النيل وكورنيش الزمالك',
      location: 'نيل القاهرة',
      category: 'nature'
    }
  ],
  'الأقصر': [
    {
      url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
      title: 'صرح الأعمدة بمعبد الكرنك',
      location: 'الأقصر، مصر',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
      title: 'وادي الملوك ومعبد حتشبسوت',
      location: 'البر الغربي، الأقصر',
      category: 'heritage'
    }
  ],
  'أسوان': [
    {
      url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
      title: 'معبد أبو سمبل الشامخ',
      location: 'أسوان، النوبة',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1566192091743-5966a6079984?auto=format&fit=crop&w=1200&q=80',
      title: 'فلوكة النيل والشلال الأول بالقرية النوبية',
      location: 'أسوان، مصر',
      category: 'culture'
    }
  ],
  'الإسكندرية': [
    {
      url: 'https://images.unsplash.com/photo-1580835845971-a393b73bf370?auto=format&fit=crop&w=1200&q=80',
      title: 'قلعة قايتباي التاريخية وبحر الإسكندرية',
      location: 'كورنيش الإسكندرية',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
      title: 'مكتبة الإسكندرية وصرح المعرفة العالمي',
      location: 'الإسكندرية، مصر',
      category: 'culture'
    }
  ],

  // Saudi Arabia
  'الرياض': [
    {
      url: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
      title: 'حي الطريف التاريخي والدرعية العريقة',
      location: 'الدرعية، الرياض',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1200&q=80',
      title: 'مركز الملك عبدالله المالي (KAFD) وأفق العاصمة الحديث',
      location: 'الرياض، السعودية',
      category: 'landmark'
    },
    {
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      title: 'برج المملكة وبوليفارد سيتي الفاتن',
      location: 'العليا، الرياض',
      category: 'landmark'
    }
  ],
  'العلا': [
    {
      url: 'https://images.unsplash.com/photo-1628172909405-b04aa294a2fa?auto=format&fit=crop&w=1200&q=80',
      title: 'جبل الفيل الشاهق وتشكيلات الرمال الساحرة',
      location: 'العلا، السعودية',
      category: 'nature'
    },
    {
      url: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
      title: 'مقابر الحجر الأثرية (مدائن صالح) ومسرح مرايا',
      location: 'موقع الحجر التراثي، العلا',
      category: 'heritage'
    }
  ],
  'جدة': [
    {
      url: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80',
      title: 'حي البلد التاريخي ورواشين الحجاز التراثية',
      location: 'جدة التاريخية، السعودية',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      title: 'كورنيش جدة والواجهة البحرية على البحر الأحمر',
      location: 'كورنيش جدة',
      category: 'nature'
    }
  ],

  // UAE
  'دبي': [
    {
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      title: 'برج خليفة ونافورة دبي الراقصة',
      location: 'داون تاون دبي',
      category: 'landmark'
    },
    {
      url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
      title: 'متحف المستقبل والتحفة المعمارية',
      location: 'شارع الشيخ زايد، دبي',
      category: 'landmark'
    },
    {
      url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
      title: 'دبي مارينا واليخوت الفاخرة',
      location: 'مارينا دبي',
      category: 'landmark'
    }
  ],

  // Japan
  'طوكيو': [
    {
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      title: 'تقاطع شيبويا وأضواء نيون طوكيو الساحرة',
      location: 'شيبويا، طوكيو',
      category: 'landmark'
    },
    {
      url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80',
      title: 'معبد سينسوجي التاريخي في أساكوسا',
      location: 'أساكوسا، طوكيو',
      category: 'heritage'
    }
  ],
  'كيوتو': [
    {
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      title: 'بوابات فوشيمي إيناري الحمراء الأيقونية',
      location: 'كيوتو، اليابان',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      title: 'غابة خيزران أراشيياما وأحياء غيون',
      location: 'أراشيياما، كيوتو',
      category: 'nature'
    }
  ],

  // Europe
  'باريس': [
    {
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      title: 'برج إيفل وسحر نهر السين الباريسي',
      location: 'باريس، فرنسا',
      category: 'landmark'
    },
    {
      url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
      title: 'متحف اللوفر وهرمه الزجاجي الأيقوني',
      location: 'قلب باريس',
      category: 'culture'
    }
  ],
  'روما': [
    {
      url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      title: 'مدرج الكولوسيوم الروماني الخالد',
      location: 'روما، إيطاليا',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',
      title: 'نافورة تريفي وساحات روما العتيقة',
      location: 'روما التاريخية',
      category: 'culture'
    }
  ],
  'إسطنبول': [
    {
      url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
      title: 'جامع آيا صوفيا ومضيق البوسفور الخلاب',
      location: 'السلطان أحمد، إسطنبول',
      category: 'heritage'
    },
    {
      url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80',
      title: 'برج غلاطة والغروب الساحر على القرن الذهبي',
      location: 'بيوغلو، إسطنبول',
      category: 'landmark'
    }
  ],
  'لندن': [
    {
      url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      title: 'ساعة بيغ بن وجسر البرج على نهر التايمز',
      location: 'لندن، بريطانيا',
      category: 'landmark'
    }
  ],
  'بالي': [
    {
      url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      title: 'مدرجات الأرز الخضراء في أوبود ومعابد المياه',
      location: 'بالي، إندونيسيا',
      category: 'nature'
    }
  ]
};

/**
 * Returns a list of curated or high-res photos for any destination.
 */
export function getPhotosForDestination(destination: string): DestinationPhoto[] {
  if (!destination) return PHARAONIC_HERITAGE_GALLERY;

  const destLower = destination.toLowerCase().trim();

  for (const [key, photos] of Object.entries(DESTINATION_PHOTOS_MAP)) {
    if (destLower.includes(key.toLowerCase()) || key.toLowerCase().includes(destLower)) {
      return photos;
    }
  }

  // Dynamic fallback photos with reliable travel themes
  const encoded = encodeURIComponent(destination);
  return [
    {
      url: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80`,
      title: `معالم واستكشافات ${destination}`,
      location: destination,
      category: 'landmark'
    },
    {
      url: `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80`,
      title: `تجارب سياحية وثقافية فريدة في ${destination}`,
      location: destination,
      category: 'culture'
    },
    {
      url: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80`,
      title: `المناظر الطبيعية والمسارات في ${destination}`,
      location: destination,
      category: 'nature'
    }
  ];
}

/**
 * Gets a single hero banner image for a destination
 */
export function getDestinationHeroImage(destination: string): string {
  const photos = getPhotosForDestination(destination);
  return photos[0]?.url || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80';
}
