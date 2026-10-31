import { SubjectConfig, SubjectId, CurriculumDatabase, ImportantDate } from '../types';

export const SUBJECT_CONFIGS: Record<SubjectId, SubjectConfig> = {
  matematik: {
    id: 'matematik',
    name: 'Matematik',
    shortName: 'MAT',
    themeColor: {
      bg: 'bg-sky-50 hover:bg-sky-100',
      border: 'border-sky-300',
      text: 'text-sky-900',
      accent: 'bg-sky-500',
      cardBg: 'bg-sky-50 border-sky-200 text-sky-900',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
      lightBg: '#f0f9ff',
    },
    icon: 'Calculator',
  },
  fen: {
    id: 'fen',
    name: 'Fen Bilimleri',
    shortName: 'FEN',
    themeColor: {
      bg: 'bg-emerald-50 hover:bg-emerald-100',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      accent: 'bg-emerald-500',
      cardBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      lightBg: '#ecfdf5',
    },
    icon: 'Atom',
  },
  turkce: {
    id: 'turkce',
    name: 'Türkçe',
    shortName: 'TÜR',
    themeColor: {
      bg: 'bg-rose-50 hover:bg-rose-100',
      border: 'border-rose-300',
      text: 'text-rose-900',
      accent: 'bg-rose-500',
      cardBg: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      lightBg: '#fff1f2',
    },
    icon: 'BookOpen',
  },
  sosyal: {
    id: 'sosyal',
    name: 'Sosyal / T.C. İnkılap Tarihi',
    shortName: 'İNK',
    themeColor: {
      bg: 'bg-amber-50 hover:bg-amber-100',
      border: 'border-amber-300',
      text: 'text-amber-900',
      accent: 'bg-amber-500',
      cardBg: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      lightBg: '#fffbeb',
    },
    icon: 'Landmark',
  },
  ingilizce: {
    id: 'ingilizce',
    name: 'Yabancı Dil (İngilizce)',
    shortName: 'İNG',
    themeColor: {
      bg: 'bg-purple-50 hover:bg-purple-100',
      border: 'border-purple-300',
      text: 'text-purple-900',
      accent: 'bg-purple-500',
      cardBg: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      lightBg: '#faf5ff',
    },
    icon: 'Globe',
  },
  din: {
    id: 'din',
    name: 'Din Kültürü ve Ahlak Bilgisi',
    shortName: 'DİN',
    themeColor: {
      bg: 'bg-indigo-50 hover:bg-indigo-100',
      border: 'border-indigo-300',
      text: 'text-indigo-900',
      accent: 'bg-indigo-500',
      cardBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      lightBg: '#eef2ff',
    },
    icon: 'HeartHandshake',
  },
  genel: {
    id: 'genel',
    name: 'Genel Çalışma',
    shortName: 'GENEL',
    themeColor: {
      bg: 'bg-teal-50 hover:bg-teal-100',
      border: 'border-teal-300',
      text: 'text-teal-900',
      accent: 'bg-teal-500',
      cardBg: 'bg-teal-50 border-teal-200 text-teal-900',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
      lightBg: '#f0fdfa',
    },
    icon: 'Layers',
  },
  diger: {
    id: 'diger',
    name: 'Ders Dışı Aktivite',
    shortName: 'DİĞER',
    themeColor: {
      bg: 'bg-slate-100 hover:bg-slate-200',
      border: 'border-slate-300',
      text: 'text-slate-800',
      accent: 'bg-slate-500',
      cardBg: 'bg-slate-100 border-slate-300 text-slate-800',
      badgeBg: 'bg-slate-200 text-slate-700 border-slate-300',
      lightBg: '#f8fafc',
    },
    icon: 'Coffee',
  },
};

export const IMPORTANT_DATES: ImportantDate[] = [
  {
    id: 'imp-0',
    title: '📝 1. Dönem 1. Ortak Sınavları',
    startDate: '2026-10-26',
    endDate: '2026-11-06',
    type: 'sinav',
    badgeColor: 'bg-rose-600 text-white border-rose-700',
    description: 'MEB 1. Dönem 1. İl & Ülke Geneli Ortak Yazılı Sınav Haftaları',
  },
  {
    id: 'imp-1',
    title: '🇹🇷 29 Ekim Cumhuriyet Bayramı',
    startDate: '2026-10-29',
    endDate: '2026-10-29',
    type: 'tatil',
    badgeColor: 'bg-red-600 text-white border-red-700',
    description: 'Cumhuriyet Bayramı Resmi Tatili',
  },
  {
    id: 'imp-2',
    title: '🏖️ 1. Dönem Ara Tatili',
    startDate: '2026-11-09',
    endDate: '2026-11-13',
    type: 'tatil',
    badgeColor: 'bg-amber-600 text-white border-amber-700',
    description: 'Kasım Ara Tatili - Eksik Tamamlama ve Kamp Haftası',
  },
  {
    id: 'imp-3',
    title: '📝 1. Dönem 2. Ortak Sınavları',
    startDate: '2026-12-21',
    endDate: '2027-01-08',
    type: 'sinav',
    badgeColor: 'bg-rose-600 text-white border-rose-700',
    description: '1. Dönem Sonu Ortak ve Okul Yazılı Sınav Dönemi',
  },
  {
    id: 'imp-4',
    title: '❄️ Yarıyıl Tatili (15 Tatil)',
    startDate: '2027-01-18',
    endDate: '2027-01-29',
    type: 'tatil',
    badgeColor: 'bg-blue-600 text-white border-blue-700',
    description: 'Sömestr Tatili ve LGS 1. Dönem Genel Tarama Kampı',
  },
  {
    id: 'imp-5',
    title: '📝 2. Dönem 1. Ortak Sınavları',
    startDate: '2027-03-22',
    endDate: '2027-04-02',
    type: 'sinav',
    badgeColor: 'bg-rose-600 text-white border-rose-700',
    description: '2. Dönem 1. Yazılı Sınav Haftası',
  },
  {
    id: 'imp-6',
    title: '🌸 2. Dönem Ara Tatili',
    startDate: '2027-04-05',
    endDate: '2027-04-09',
    type: 'tatil',
    badgeColor: 'bg-emerald-600 text-white border-emerald-700',
    description: 'Nisan Ara Tatili - Seri Deneme & Branş Denemeleri',
  },
  {
    id: 'imp-7',
    title: '🇹🇷 23 Nisan Çocuk Bayramı',
    startDate: '2027-04-23',
    endDate: '2027-04-23',
    type: 'tatil',
    badgeColor: 'bg-red-600 text-white border-red-700',
    description: 'Ulusal Egemenlik ve Çocuk Bayramı',
  },
  {
    id: 'imp-8',
    title: '🇹🇷 19 Mayıs Gençlik ve Spor Bayramı',
    startDate: '2027-05-19',
    endDate: '2027-05-19',
    type: 'tatil',
    badgeColor: 'bg-red-600 text-white border-red-700',
    description: 'Atatürk’ü Anma, Gençlik ve Spor Bayramı',
  },
  {
    id: 'imp-9',
    title: '📝 2. Dönem 2. Ortak Sınavları',
    startDate: '2027-05-24',
    endDate: '2027-06-04',
    type: 'sinav',
    badgeColor: 'bg-rose-600 text-white border-rose-700',
    description: 'Yıl Sonu Ortak Yazılı Sınavları',
  },
  {
    id: 'imp-10',
    title: '🎯 LGS 2027 Merkezi Sınavı',
    startDate: '2027-06-06',
    endDate: '2027-06-06',
    type: 'lgs',
    badgeColor: 'bg-purple-600 text-white ring-2 ring-purple-300 animate-pulse',
    description: 'Milli Eğitim Bakanlığı LGS 2027 Merkezi Sınavı (09:30)',
  },
];

// Helper to check if a specific date string (YYYY-MM-DD) falls into an important date range
export function getImportantDatesForDate(dateStr: string): ImportantDate[] {
  return IMPORTANT_DATES.filter((d) => dateStr >= d.startDate && dateStr <= d.endDate);
}

// FULL TÜRKİYE YÜZYILI MAARİF MODELİ CURRICULUM DATABASE (6, 7 ve 8. SINIFLAR)
export const CURRICULUM_DATA: CurriculumDatabase = {
  // ==========================================
  // 8. SINIF (LGS HEDEF SINIFI) TÜM MÜFREDAT
  // ==========================================
  '8': [
    {
      subjectId: 'matematik',
      units: [
        {
          id: '8-mat-u1',
          name: '1. Ünite: Çarpanlar ve Katlar & Üslü İfadeler',
          topics: [
            { id: '8-mat-1', name: 'Pozitif Tam Sayıların Pozitif Tam Sayı Çarpanları ve Asal Çarpanlar', recommendedQuestions: 120 },
            { id: '8-mat-2', name: 'İki Doğal Sayının En Büyük Ortak Böleni (EBOB) ve Uygulamaları', recommendedQuestions: 150 },
            { id: '8-mat-3', name: 'İki Doğal Sayının En Küçük Ortak Katı (EKOK) ve Problemleri', recommendedQuestions: 150 },
            { id: '8-mat-4', name: 'Aralarında Asal Sayılar ve Özellikleri', recommendedQuestions: 90 },
            { id: '8-mat-5', name: 'Tam Sayıların Tam Sayı Kuvvetleri ve Negatif Üs', recommendedQuestions: 130 },
            { id: '8-mat-6', name: 'Üslü İfadelerde Çarpma, Bölme ve Üssün Üssü Kuralları', recommendedQuestions: 160 },
            { id: '8-mat-7', name: 'Ondalık Gösterimlerin 10’un Kuvvetleriyle Çözümlenmesi', recommendedQuestions: 90 },
            { id: '8-mat-8', name: 'Çok Büyük ve Çok Küçük Sayılar ile Bilimsel Gösterim', recommendedQuestions: 110 },
          ],
        },
        {
          id: '8-mat-u2',
          name: '2. Ünite: Kareköklü İfadeler ve Veri Analizi',
          topics: [
            { id: '8-mat-9', name: 'Tam Kare Pozitif Tam Sayılar ve Karekök İlişkisi', recommendedQuestions: 100 },
            { id: '8-mat-10', name: 'Tam Kare Olmayan Sayıların Karekök Değerini Tahmin Etme', recommendedQuestions: 90 },
            { id: '8-mat-11', name: 'Kareköklü İfadeyi a√b Şeklinde Yazma ve Katsayıyı Kök İçine Alma', recommendedQuestions: 130 },
            { id: '8-mat-12', name: 'Kareköklü İfadelerde Çarpma ve Bölme İşlemleri', recommendedQuestions: 140 },
            { id: '8-mat-13', name: 'Kareköklü İfadelerde Toplama ve Çıkarma İşlemleri', recommendedQuestions: 140 },
            { id: '8-mat-14', name: 'Doğal Sayı Yapan Çarpanlar ve İrrasyonel Sayı Kavramı', recommendedQuestions: 90 },
            { id: '8-mat-15', name: 'Ondalık İfadelerin Karekökleri ve Gerçek Sayılar (Rasyonel/İrrasyonel)', recommendedQuestions: 110 },
            { id: '8-mat-16', name: 'Veri Analizi: Çizgi, Sütun ve Daire Grafikleri Arası Dönüşümler', recommendedQuestions: 150 },
          ],
        },
        {
          id: '8-mat-u3',
          name: '3. Ünite: Basit Olayların Olma Olasılığı ve Cebirsel İfadeler',
          topics: [
            { id: '8-mat-17', name: 'Olası Durumlar, Örnek Uzay ve Olay Çeşitleri', recommendedQuestions: 90 },
            { id: '8-mat-18', name: 'Eşit, Daha Fazla ve Daha Az Olasılıklı Olaylar', recommendedQuestions: 90 },
            { id: '8-mat-19', name: 'Kesin Olay, İmkânsız Olay ve Olasılık Hesabı (P = İstenen / Tüm Durumlar)', recommendedQuestions: 130 },
            { id: '8-mat-20', name: 'Cebirsel İfadelerin Terimleri, Katsayıları ve Sabit Terimi', recommendedQuestions: 90 },
            { id: '8-mat-21', name: 'Cebirsel İfadelerde Çarpma İşlemi ve Alan Modelleri', recommendedQuestions: 120 },
            { id: '8-mat-22', name: 'Özdeşlikler: İki Terimin Toplamının ve Farkının Karesi', recommendedQuestions: 150 },
            { id: '8-mat-23', name: 'Özdeşlikler: İki Kare Farkı Özdeşliği ve Geometrik Modeller', recommendedQuestions: 140 },
            { id: '8-mat-24', name: 'Çarpanlara Ayırma: Ortak Çarpan Parantezine Alma', recommendedQuestions: 120 },
            { id: '8-mat-25', name: 'Çarpanlara Ayırma: Özdeşliklerden Yararlanarak Ayırma', recommendedQuestions: 130 },
          ],
        },
        {
          id: '8-mat-u4',
          name: '4. Ünite: Doğrusal Denklemler ve Eşitsizlikler',
          topics: [
            { id: '8-mat-26', name: 'Birinci Dereceden Bir Bilinmeyenli Rasyonel Katsayılı Denklemler', recommendedQuestions: 140 },
            { id: '8-mat-27', name: 'Koordinat Sistemi, Bölgeler ve Sıralı İkililer', recommendedQuestions: 90 },
            { id: '8-mat-28', name: 'Doğrusal İlişkiler ve Tablo/Grafik Yorumlama', recommendedQuestions: 120 },
            { id: '8-mat-29', name: 'Doğrusal Denklemlerin Grafiği (Orijinden Geçen ve Eksenleri Kesen Doğrular)', recommendedQuestions: 140 },
            { id: '8-mat-30', name: 'Doğrunun Eğimi (m = Dikey Değişim / Yatay Değişim) ve Pozitif/Negatif Eğim', recommendedQuestions: 150 },
            { id: '8-mat-31', name: 'Birinci Dereceden Bir Bilinmeyenli Eşitsizlikler ve Sayı Doğrusunda Gösterimi', recommendedQuestions: 120 },
            { id: '8-mat-32', name: 'Eşitsizliklerin Çözümü ve Gerçek Yaşam Problemleri', recommendedQuestions: 130 },
          ],
        },
        {
          id: '8-mat-u5',
          name: '5. Ünite: Üçgenler ve Dönüşüm Geometrisi',
          topics: [
            { id: '8-mat-33', name: 'Üçgende Kenarortay, Açıortay ve Yükseklik Çizimi', recommendedQuestions: 100 },
            { id: '8-mat-34', name: 'Üçgen Eşitsizliği (Kenarlar Arasındaki Bağıntılar)', recommendedQuestions: 130 },
            { id: '8-mat-35', name: 'Üçgenin Açı Ölçüleri ile Kenar Uzunlukları Arasındaki İlişki', recommendedQuestions: 110 },
            { id: '8-mat-36', name: 'Yeterli Elemanı Verilen Üçgenlerin Çizimi (Pergel, Cetvel, Açıölçer)', recommendedQuestions: 90 },
            { id: '8-mat-37', name: 'Pisagor Bağıntısı ve Uygulamaları (Özel Dik Üçgenler)', recommendedQuestions: 160 },
            { id: '8-mat-38', name: 'Nokta ve Şekillerin Öteleme Dönüşümü', recommendedQuestions: 90 },
            { id: '8-mat-39', name: 'Yansıma Dönüşümü ve Simetri Doğrusu', recommendedQuestions: 90 },
            { id: '8-mat-40', name: 'Eşlik ve Benzerlik, Benzerlik Oranı ve Çevre/Alan Bağıntısı', recommendedQuestions: 130 },
          ],
        },
        {
          id: '8-mat-u6',
          name: '6. Ünite: Geometrik Cisimler',
          topics: [
            { id: '8-mat-41', name: 'Dik Prizmaların Temel Elemanları ve Açınımları', recommendedQuestions: 100 },
            { id: '8-mat-42', name: 'Dik Dairesel Silindirin Açınımı, Yüzey Alanı ve Hacim Hesabı', recommendedQuestions: 130 },
            { id: '8-mat-43', name: 'Dik Piramidin Temel Elemanları ve Açınımı', recommendedQuestions: 90 },
            { id: '8-mat-44', name: 'Dik Koninin Temel Elemanları, Açınımı ve Ana Doğrusu', recommendedQuestions: 100 },
          ],
        },
      ],
    },
    {
      subjectId: 'fen',
      units: [
        {
          id: '8-fen-u1',
          name: '1. Ünite: Mevsimler ve İklim',
          topics: [
            { id: '8-fen-1', name: 'Mevsimlerin Oluşumu (Eksen Eğikliği, Dönme ve Dolanma Hareketi)', recommendedQuestions: 120 },
            { id: '8-fen-2', name: 'İklim ve Hava Hareketleri (Rüzgar, Nem, Alçak/Yüksek Basınç Alanları)', recommendedQuestions: 110 },
            { id: '8-fen-3', name: 'Küresel İklim Değişikliği, Sera Gazları ve Alınacak Önlemler', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-fen-u2',
          name: '2. Ünite: DNA ve Genetik Kod',
          topics: [
            { id: '8-fen-4', name: 'DNA’nın Yapısı, Nükleotidler ve DNA’nın Kendini Eşlemesi', recommendedQuestions: 110 },
            { id: '8-fen-5', name: 'Kalıtım (Mendel İlkeleri, Genotip, Fenotip, Saf ve Melez Döl)', recommendedQuestions: 140 },
            { id: '8-fen-6', name: 'Tek Karakter Çaprazlamaları ve İnsanda Cinsiyet Belirlenmesi', recommendedQuestions: 130 },
            { id: '8-fen-7', name: 'Mutasyon ve Modifikasyon Arasındaki Farklar ve Örnekleri', recommendedQuestions: 90 },
            { id: '8-fen-8', name: 'Adaptasyon (Çevreye Uyum) ve Doğal Seçilim', recommendedQuestions: 90 },
            { id: '8-fen-9', name: 'Biyoteknoloji, Genetik Mühendisliği, Klonlama ve Islah Çalışmaları', recommendedQuestions: 90 },
          ],
        },
        {
          id: '8-fen-u3',
          name: '3. Ünite: Basınç',
          topics: [
            { id: '8-fen-10', name: 'Katı Basıncı (Kuvvet ve Yüzey Alanı İlişkisi)', recommendedQuestions: 120 },
            { id: '8-fen-11', name: 'Sıvı Basıncı (Derinlik ve Sıvı Yoğunluğu İlişkisi)', recommendedQuestions: 140 },
            { id: '8-fen-12', name: 'Pascal Prensibi ve Günlük Hayattaki Uygulamaları (Hidrolik Sistemler)', recommendedQuestions: 110 },
            { id: '8-fen-13', name: 'Gaz Basıncı, Açık Hava Basıncı (Toriçelli Deneyi) ve Kapalı Kap Basıncı', recommendedQuestions: 120 },
          ],
        },
        {
          id: '8-fen-u4',
          name: '4. Ünite: Madde ve Endüstri',
          topics: [
            { id: '8-fen-14', name: 'Periyodik Sistemin Tarihsel Gelişimi, Grup ve Periyotlar', recommendedQuestions: 100 },
            { id: '8-fen-15', name: 'Metaller, Ametaller, Yarı Metaller ve Soygazların Özellikleri', recommendedQuestions: 110 },
            { id: '8-fen-16', name: 'Fiziksel ve Kimyasal Değişimlerin Ayırt Edilmesi', recommendedQuestions: 90 },
            { id: '8-fen-17', name: 'Kimyasal Tepkimeler ve Kütlenin Korunumu Kanunu', recommendedQuestions: 120 },
            { id: '8-fen-18', name: 'Asitler ve Bazlar, pH Skalası ve Ayıraçlar', recommendedQuestions: 130 },
            { id: '8-fen-19', name: 'Asit Yağmurları ve Çevreye Etkileri', recommendedQuestions: 80 },
            { id: '8-fen-20', name: 'Maddenin Isı ile Etkileşimi ve Özısı Kavramı', recommendedQuestions: 110 },
            { id: '8-fen-21', name: 'Hal Değişimi Isısı (Erime, Donma, Buharlaşma) ve Isınma-Soğuma Grafikleri', recommendedQuestions: 130 },
            { id: '8-fen-22', name: 'Türkiye’de Kimya Endüstrisi ve Meslek Alanları', recommendedQuestions: 70 },
          ],
        },
        {
          id: '8-fen-u5',
          name: '5. Ünite: Basit Makineler',
          topics: [
            { id: '8-fen-23', name: 'Basit Makinelerin Temel Prensipleri (Kuvvetten Kazanç, İşten Kazanç Olmaz)', recommendedQuestions: 100 },
            { id: '8-fen-24', name: 'Makaralar: Sabit Makara, Hareketli Makara ve Palanga Sistemleri', recommendedQuestions: 130 },
            { id: '8-fen-25', name: 'Kaldıraçlar: Çift Taraflı ve Tek Taraflı Kaldıraç Çeşitleri', recommendedQuestions: 120 },
            { id: '8-fen-26', name: 'Eğik Düzlem ve Çıkrık Mekanizmaları', recommendedQuestions: 120 },
            { id: '8-fen-27', name: 'Dişli Çarklar, Kasnaklar, Vida ve Bileşik Makineler', recommendedQuestions: 100 },
          ],
        },
        {
          id: '8-fen-u6',
          name: '6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi',
          topics: [
            { id: '8-fen-28', name: 'Besin Zinciri ve Enerji Akışı (Üretici, Tüketici, Ayrıştırıcı)', recommendedQuestions: 110 },
            { id: '8-fen-29', name: 'Ekoloji Piramidi ve Biyolojik Birikim (Zehir Miktarı)', recommendedQuestions: 100 },
            { id: '8-fen-30', name: 'Fotosentez Mekanizması ve Hızını Etkileyen Faktörler', recommendedQuestions: 130 },
            { id: '8-fen-31', name: 'Solunum (Oksijenli Solunum, Oksijensiz Solunum ve Fermantasyon)', recommendedQuestions: 120 },
            { id: '8-fen-32', name: 'Madde Döngüleri (Su, Karbon, Oksijen, Azot Döngüleri)', recommendedQuestions: 100 },
            { id: '8-fen-33', name: 'Sürdürülebilir Kalkınma, Geri Dönüşüm ve Ekolojik Ayak İzi', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-fen-u7',
          name: '7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi',
          topics: [
            { id: '8-fen-34', name: 'Elektriklenme Çeşitleri (Sürtünme, Dokunma ve Etki ile Elektriklenme)', recommendedQuestions: 110 },
            { id: '8-fen-35', name: 'Elektroskop ve Cisimlerin Yük Durumunun Tespiti', recommendedQuestions: 100 },
            { id: '8-fen-36', name: 'Topraklama, Şimşek, Yıldırım ve Paratoner', recommendedQuestions: 90 },
            { id: '8-fen-37', name: 'Elektrik Enerjisinin Isı, Işık ve Hareket Enerjisine Dönüşümü', recommendedQuestions: 100 },
            { id: '8-fen-38', name: 'Elektrik Güvenliği, Sigorta ve Enerji Tasarrufu', recommendedQuestions: 80 },
          ],
        },
      ],
    },
    {
      subjectId: 'turkce',
      units: [
        {
          id: '8-tur-u1',
          name: '1. Ünite: Sözcükte ve Söz Öbeklerinde Anlam',
          topics: [
            { id: '8-tur-1', name: 'Gerçek, Mecaz ve Terim Anlamlı Sözcükler', recommendedQuestions: 100 },
            { id: '8-tur-2', name: 'Eş, Zıt, Eş Sesli ve Yakın Anlamlı Sözcükler', recommendedQuestions: 80 },
            { id: '8-tur-3', name: 'Deyimler, Atasözleri ve Özdeyişler (Vecizeler)', recommendedQuestions: 110 },
            { id: '8-tur-4', name: 'Sözcük Öbekleri, İkilemeler ve Söz Sanatları Temeli', recommendedQuestions: 90 },
          ],
        },
        {
          id: '8-tur-u2',
          name: '2. Ünite: Cümlede Anlam ve Kavramlar',
          topics: [
            { id: '8-tur-5', name: 'Öznel ve Nesnel Anlatımlı Cümleler', recommendedQuestions: 90 },
            { id: '8-tur-6', name: 'Neden-Sonuç, Amaç-Sonuç ve Koşul-Sonuç Cümleleri', recommendedQuestions: 120 },
            { id: '8-tur-7', name: 'Cümlede Anlam İlişkileri (Karşılaştırma, Örtülü Anlam, Doğrudan/Dolaylı Anlatım)', recommendedQuestions: 110 },
            { id: '8-tur-8', name: 'Cümleye Hâkim Olan Duygu ve Düşünceler (Ön Yargı, Varsayım, Eleştiri, Pişmanlık)', recommendedQuestions: 100 },
          ],
        },
        {
          id: '8-tur-u3',
          name: '3. Ünite: Fiilimsiler (Eylemsiler)',
          topics: [
            { id: '8-tur-9', name: 'İsim-Fiil (Mastar) Ekleri (-ma, -ış, -mak) ve Kalıcı İsimler', recommendedQuestions: 110 },
            { id: '8-tur-10', name: 'Sıfat-Fiil (Ortaç) Ekleri (-an, -ası, -mez, -ar, -dik, -ecek, -miş) ve Adlaşmış Sıfat-Fiil', recommendedQuestions: 130 },
            { id: '8-tur-11', name: 'Zarf-Fiil (Ulaç/Bağ-Fiil) Ekleri ve Cümleye Kattığı Zaman/Durum Anlamı', recommendedQuestions: 130 },
            { id: '8-tur-12', name: 'Fiilimsilerin Cümle İçindeki Görevleri ve Karma Fiilimsi Analizi', recommendedQuestions: 140 },
          ],
        },
        {
          id: '8-tur-u4',
          name: '4. Ünite: Paragrafta Anlam, Yapı ve Metin Türleri',
          topics: [
            { id: '8-tur-13', name: 'Paragrafın Ana Düşüncesi ve Konusu', recommendedQuestions: 160 },
            { id: '8-tur-14', name: 'Paragrafta Yardımcı Düşünceler ve Çıkarımlar', recommendedQuestions: 150 },
            { id: '8-tur-15', name: 'Paragrafın Yapısı (Giriş, Gelişme, Sonuç Cümleleri, Akışı Bozan Cümle, Paragraf Bölme)', recommendedQuestions: 140 },
            { id: '8-tur-16', name: 'Anlatım Biçimleri (Açıklama, Tartışma, Öyküleme, Betimleme)', recommendedQuestions: 110 },
            { id: '8-tur-17', name: 'Düşünceyi Geliştirme Yolları (Tanımlama, Örnekleme, Tanık Gösterme, Karşılaştırma, Sayısal Veriler)', recommendedQuestions: 110 },
            { id: '8-tur-18', name: 'Metin Türleri (Makale, Deneme, Fıkra, Söyleşi, Anı, Günlük, Biyografi)', recommendedQuestions: 100 },
            { id: '8-tur-19', name: 'Söz Sanatları (Benzetme, Kişileştirme, Konuşturma, Karşıtlık, Abartma)', recommendedQuestions: 90 },
          ],
        },
        {
          id: '8-tur-u5',
          name: '5. Ünite: Cümlenin Ögeleri ve Cümle Türleri',
          topics: [
            { id: '8-tur-20', name: 'Temel Ögeler: Yüklem ve Özne (Gerçek, Gizli, Sözde Özne)', recommendedQuestions: 130 },
            { id: '8-tur-21', name: 'Yardımcı Ögeler: Nesne (Belirtili/Belirtisiz), Yer Tamlayıcısı ve Zarf Tamlayıcısı', recommendedQuestions: 140 },
            { id: '8-tur-22', name: 'Cümle Dışı Unsurlar, Ara Sözler ve Cümlede Vurgu', recommendedQuestions: 100 },
            { id: '8-tur-23', name: 'Fiilde Çatı: Öznesine Göre (Etken - Edilgen) ve Nesnesine Göre (Geçişli - Geçişsiz)', recommendedQuestions: 130 },
            { id: '8-tur-24', name: 'Cümle Türleri: Yüklemin Türüne Göre (İsim / Fiil Cümlesi)', recommendedQuestions: 90 },
            { id: '8-tur-25', name: 'Cümle Türleri: Yüklemin Yerine Göre (Kurallı / Devrik / Eksiltili Cümle)', recommendedQuestions: 90 },
            { id: '8-tur-26', name: 'Cümle Türleri: Yapısına Göre (Tek Yüklemli, Fiilimsili, Birden Çok Yüklemli, Bağlaçlı Cümle)', recommendedQuestions: 130 },
          ],
        },
        {
          id: '8-tur-u6',
          name: '6. Ünite: Yazım Kuralları, Noktalama ve Sözel Mantık',
          topics: [
            { id: '8-tur-27', name: 'Büyük Harflerin Yazımı, Kısaltmalar ve Sayıların Yazımı', recommendedQuestions: 110 },
            { id: '8-tur-28', name: '"de", "ki" ve "mi"nin Yazımı, Birleşik Sözcüklerin Yazımı', recommendedQuestions: 120 },
            { id: '8-tur-29', name: 'Noktalama İşaretleri (Nokta, Virgül, Noktalı Virgül, İki Nokta, vb.)', recommendedQuestions: 130 },
            { id: '8-tur-30', name: 'Anlatım Bozuklukları (Anlamsal ve Yapısal Bozukluklar)', recommendedQuestions: 100 },
            { id: '8-tur-31', name: 'LGS Sözel Mantık ve Muhakeme Tabloları', recommendedQuestions: 180 },
            { id: '8-tur-32', name: 'Grafik, Tablo ve İnfografik Okuma/Yorumlama', recommendedQuestions: 140 },
          ],
        },
      ],
    },
    {
      subjectId: 'sosyal',
      units: [
        {
          id: '8-sos-u1',
          name: '1. Ünite: Bir Kahraman Doğuyor',
          topics: [
            { id: '8-sos-1', name: '19. ve 20. Yüzyılda Osmanlı Devleti ve Avrupa (Sanayi İnkılabı, Fransız İhtilali)', recommendedQuestions: 80 },
            { id: '8-sos-2', name: 'Mustafa Kemal’in Çocukluk, Öğrenim Hayatı ve Okuduğu Okullar', recommendedQuestions: 80 },
            { id: '8-sos-3', name: 'Mustafa Kemal’in Fikir Hayatını Etkileyen Şehirler ve Yazarlar', recommendedQuestions: 90 },
            { id: '8-sos-4', name: 'Mustafa Kemal’in Askerlik Hayatı (Trablusgarp, Balkan Savaşları, Çanakkale)', recommendedQuestions: 100 },
          ],
        },
        {
          id: '8-sos-u2',
          name: '2. Ünite: Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar',
          topics: [
            { id: '8-sos-5', name: 'I. Dünya Savaşı’nın Sebepleri, Bloklar ve Osmanlı’nın Savaştığı Cepheler', recommendedQuestions: 100 },
            { id: '8-sos-6', name: 'Mondros Ateşkes Antlaşması ve İşgaller', recommendedQuestions: 80 },
            { id: '8-sos-7', name: 'Kuvâ-yı Millîye Ruhu ve Zararlı/Yararlı Cemiyetler', recommendedQuestions: 90 },
            { id: '8-sos-8', name: 'Milli Mücadele Hazırlık Dönemi: Havza ve Amasya Genelgeleri', recommendedQuestions: 110 },
            { id: '8-sos-9', name: 'Erzurum ve Sivas Kongreleri, Amasya Görüşmeleri', recommendedQuestions: 110 },
            { id: '8-sos-10', name: 'Son Osmanlı Mebusan Meclisi ve Misak-ı Millî Kararları', recommendedQuestions: 90 },
            { id: '8-sos-11', name: 'B.M.M.’nin Açılması, Çıkan İsyanlar ve Hıyanet-i Vataniye Kanunu', recommendedQuestions: 100 },
            { id: '8-sos-12', name: 'Geçersiz Bir Belge: Sevr Antlaşması', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-sos-u3',
          name: '3. Ünite: Milli Bir Destan: Ya İstiklal Ya Ölüm! (Cepheler)',
          topics: [
            { id: '8-sos-13', name: 'Doğu Cephesi (Ermeniler ile Mücadele ve Gümrü Antlaşması)', recommendedQuestions: 80 },
            { id: '8-sos-14', name: 'Güney Cephesi (Maraş, Urfa, Antep Direnişleri ve Ankara Antlaşması)', recommendedQuestions: 90 },
            { id: '8-sos-15', name: 'Batı Cephesi: I. İnönü Zaferi, Londra Konferansı, İstiklal Marşı, Moskova Antlaşması', recommendedQuestions: 120 },
            { id: '8-sos-16', name: 'II. İnönü Muharebesi ve Kütahya-Eskişehir Savaşları', recommendedQuestions: 90 },
            { id: '8-sos-17', name: 'Maarif Kongresi ve Tekâlif-i Milliye Emirleri', recommendedQuestions: 100 },
            { id: '8-sos-18', name: 'Sakarya Meydan Muharebesi ve Kars Antlaşması', recommendedQuestions: 110 },
            { id: '8-sos-19', name: 'Büyük Taarruz ve Başkomutanlık Meydan Muharebesi', recommendedQuestions: 110 },
            { id: '8-sos-20', name: 'Mudanya Ateşkesi ve Bağımsızlık Belgesi: Lozan Barış Antlaşması', recommendedQuestions: 120 },
          ],
        },
        {
          id: '8-sos-u4',
          name: '4. Ünite: Atatürkçülük ve Çağdaşlaşan Türkiye',
          topics: [
            { id: '8-sos-21', name: 'Atatürk İlkeleri: Cumhuriyetçilik ve Milliyetçilik', recommendedQuestions: 110 },
            { id: '8-sos-22', name: 'Atatürk İlkeleri: Halkçılık ve Devletçilik', recommendedQuestions: 100 },
            { id: '8-sos-23', name: 'Atatürk İlkeleri: Laiklik ve İnkılapçılık', recommendedQuestions: 110 },
            { id: '8-sos-24', name: 'Siyasal Alanda İnkılaplar (Saltanatın Kaldırılması, Cumhuriyetin İlanı, Halifeliğin Kaldırılması)', recommendedQuestions: 120 },
            { id: '8-sos-25', name: 'Hukuk Alanında İnkılaplar ve Türk Medeni Kanunu', recommendedQuestions: 90 },
            { id: '8-sos-26', name: 'Eğitim ve Kültür Alanında İnkılaplar (Tevhid-i Tedrisat, Harf İnkılabı, TTK, TDK)', recommendedQuestions: 110 },
            { id: '8-sos-27', name: 'Toplumsal Alanda İnkılaplar (Kılık-Kıyafet, Tekke-Zaviye, Soyadı Kanunu, Takvim/Saat)', recommendedQuestions: 90 },
            { id: '8-sos-28', name: 'Ekonomi Alanında Gelişmeler (İzmir İktisat Kongresi, Kabotaj Kanunu, Tarım/Sanayi Hamleleri)', recommendedQuestions: 100 },
          ],
        },
        {
          id: '8-sos-u5',
          name: '5. Ünite: Demokratikleşme Çabaları ve Dış Politika',
          topics: [
            { id: '8-sos-29', name: 'Çok Partili Hayata Geçiş Denemeleri (CHF, TCF, SCF)', recommendedQuestions: 90 },
            { id: '8-sos-30', name: 'Rejime Yönelik Tehditler (Şeyh Sait İsyanı, Menemen Olayı, Suikast Girişimi)', recommendedQuestions: 90 },
            { id: '8-sos-31', name: 'Türk Dış Politikasının Temel İlkeleri ve Yabancı Okullar Meselesi', recommendedQuestions: 80 },
            { id: '8-sos-32', name: 'Musul Sorunu, Nüfus Mübadelesi ve Milletler Cemiyeti’ne Giriş', recommendedQuestions: 90 },
            { id: '8-sos-33', name: 'Balkan Antantı, Montrö Boğazlar Sözleşmesi ve Sadabat Paktı', recommendedQuestions: 100 },
            { id: '8-sos-34', name: 'Hatay’ın Anavatana Katılması ve Mustafa Kemal’in Vefatı', recommendedQuestions: 90 },
            { id: '8-sos-35', name: 'II. Dünya Savaşı ve Türkiye’nin Tutumu, Çok Partili Hayata Geçiş', recommendedQuestions: 90 },
          ],
        },
      ],
    },
    {
      subjectId: 'ingilizce',
      units: [
        {
          id: '8-ing-u1',
          name: 'Unit 1: Friendship',
          topics: [
            { id: '8-ing-1', name: 'Accepting, Refusing and Making Excuses', recommendedQuestions: 90 },
            { id: '8-ing-2', name: 'Personal Traits and Qualities of a Good Friend', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-ing-u2',
          name: 'Unit 2: Teen Life',
          topics: [
            { id: '8-ing-3', name: 'Daily Routines and Teen Activities', recommendedQuestions: 80 },
            { id: '8-ing-4', name: 'Expressing Preferences (Prefer, Like, Hate, Can’t Stand)', recommendedQuestions: 90 },
          ],
        },
        {
          id: '8-ing-u3',
          name: 'Unit 3: In The Kitchen',
          topics: [
            { id: '8-ing-5', name: 'Cooking Process Words (First, Next, Then, After that, Finally)', recommendedQuestions: 90 },
            { id: '8-ing-6', name: 'Kitchen Tools, Ingredients and Cooking Methods (Bake, Fry, Boil)', recommendedQuestions: 90 },
          ],
        },
        {
          id: '8-ing-u4',
          name: 'Unit 4: On The Phone',
          topics: [
            { id: '8-ing-7', name: 'Telephone Language and Phoning Conversations', recommendedQuestions: 90 },
            { id: '8-ing-8', name: 'Leaving and Taking a Message', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-ing-u5',
          name: 'Unit 5: The Internet',
          topics: [
            { id: '8-ing-9', name: 'Internet Safety Rules and Habits', recommendedQuestions: 80 },
            { id: '8-ing-10', name: 'Internet Vocabulary, Acronyms and Browsing', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-ing-u6',
          name: 'Unit 6: Adventures',
          topics: [
            { id: '8-ing-11', name: 'Extreme Sports and Comparison (Comparatives)', recommendedQuestions: 80 },
            { id: '8-ing-12', name: 'Expressing Opinions (Would Rather / Prefer)', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-ing-u7',
          name: 'Unit 7: Tourism',
          topics: [
            { id: '8-ing-13', name: 'Tourist Attractions, Historical Sites and Architecture', recommendedQuestions: 80 },
            { id: '8-ing-14', name: 'Describing Vacations and Weather Conditions', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-ing-u8',
          name: 'Unit 8: Chores',
          topics: [
            { id: '8-ing-15', name: 'Household Chores and Responsibilities', recommendedQuestions: 80 },
            { id: '8-ing-16', name: 'Expressing Obligations (Must / Have to / Need to)', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-ing-u9',
          name: 'Unit 9: Science',
          topics: [
            { id: '8-ing-17', name: 'Scientific Inventions, Famous Scientists and Discoveries', recommendedQuestions: 80 },
            { id: '8-ing-18', name: 'Laboratory Equipment and Present Continuous in Science', recommendedQuestions: 80 },
          ],
        },
        {
          id: '8-ing-u10',
          name: 'Unit 10: Natural Forces',
          topics: [
            { id: '8-ing-19', name: 'Natural Disasters (Earthquake, Flood, Avalanche, Drought)', recommendedQuestions: 80 },
            { id: '8-ing-20', name: 'Making Predictions and Warnings (Will, Should)', recommendedQuestions: 80 },
          ],
        },
      ],
    },
    {
      subjectId: 'din',
      units: [
        {
          id: '8-din-u1',
          name: '1. Ünite: Kader İnancı',
          topics: [
            { id: '8-din-1', name: 'Kader ve Kaza Kavramları, Evrenin Yasaları (Fiziksel, Biyolojik, Toplumsal)', recommendedQuestions: 90 },
            { id: '8-din-2', name: 'İnsanın İradesi ve Kader, Sorumluluk', recommendedQuestions: 80 },
            { id: '8-din-3', name: 'Kaderle İlgili Kavramlar (Ömür, Ecel, Rızık, Tevekkül, Başarı, Sağlık)', recommendedQuestions: 90 },
            { id: '8-din-4', name: 'Hz. Musa’nın Hayatı, Âyetel-Kürsî ve Anlamı', recommendedQuestions: 70 },
          ],
        },
        {
          id: '8-din-u2',
          name: '2. Ünite: Zekât ve Sadaka',
          topics: [
            { id: '8-din-5', name: 'İslam’ın Paylaşma ve Yardımlaşmaya Verdiği Önem', recommendedQuestions: 80 },
            { id: '8-din-6', name: 'Zekât ve Sadaka İbadeti (Nisap Miktarı, Kimlere Verilir)', recommendedQuestions: 90 },
            { id: '8-din-7', name: 'Sadaka-i Cariye ve İnfak Kavramı', recommendedQuestions: 70 },
            { id: '8-din-8', name: 'Hz. Şuayb’ın Hayatı, Mâûn Suresi ve Anlamı', recommendedQuestions: 70 },
          ],
        },
        {
          id: '8-din-u3',
          name: '3. Ünite: Din ve Hayat',
          topics: [
            { id: '8-din-9', name: 'Din, Birey ve Toplum İlişkisi', recommendedQuestions: 70 },
            { id: '8-din-10', name: 'Dinin Temel Gayesi: Can, Nesil, Akıl, Mal ve Din Emniyeti', recommendedQuestions: 90 },
            { id: '8-din-11', name: 'Hz. Yusuf’un Hayatı, Asr Suresi ve Anlamı', recommendedQuestions: 70 },
          ],
        },
        {
          id: '8-din-u4',
          name: '4. Ünite: Hz. Muhammed’in Örnekliği',
          topics: [
            { id: '8-din-12', name: 'Hz. Muhammed’in Doğruluğu ve Güvenilirliği (El-Emin)', recommendedQuestions: 80 },
            { id: '8-din-13', name: 'Merhametli ve Affedici Oluşu, İstişareye Verdiği Önem', recommendedQuestions: 80 },
            { id: '8-din-14', name: 'Davasındaki Kararlılığı ve Cesareti, Kureyş Suresi ve Anlamı', recommendedQuestions: 70 },
          ],
        },
        {
          id: '8-din-u5',
          name: '5. Ünite: Kur’an-ı Kerim ve Özellikleri',
          topics: [
            { id: '8-din-15', name: 'İslam Dininin Temel Kaynakları ve Kur’an-ı Kerim’in Özellikleri', recommendedQuestions: 80 },
            { id: '8-din-16', name: 'Kur’an-ı Kerim’in Ana Konuları (İnanç, İbadet, Ahlak, Muamelat, Kıssalar)', recommendedQuestions: 80 },
            { id: '8-din-17', name: 'Hz. Nuh’un Hayatı', recommendedQuestions: 60 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // 7. SINIF TÜM MÜFREDAT
  // ==========================================
  '7': [
    {
      subjectId: 'matematik',
      units: [
        {
          id: '7-mat-u1',
          name: '1. Ünite: Tam Sayılarla İşlemler',
          topics: [
            { id: '7-mat-1', name: 'Tam Sayılarda Toplama ve Çıkarma İşlemleri, Sayı Doğrusu ve Sayma Pulları', recommendedQuestions: 110 },
            { id: '7-mat-2', name: 'Tam Sayılarda Çarpma ve Bölme İşlemleri', recommendedQuestions: 120 },
            { id: '7-mat-3', name: 'Tam Sayıların Kendisi ile Tekrarlı Çarpımı ve Kuvvetleri', recommendedQuestions: 100 },
            { id: '7-mat-4', name: 'Tam Sayılarla İlgili Dört İşlem Problemleri', recommendedQuestions: 120 },
          ],
        },
        {
          id: '7-mat-u2',
          name: '2. Ünite: Rasyonel Sayılar ve İşlemler',
          topics: [
            { id: '7-mat-5', name: 'Rasyonel Sayıları Tanıma, Sayı Doğrusunda Gösterme ve Ondalık Gösterim', recommendedQuestions: 100 },
            { id: '7-mat-6', name: 'Devirli Ondalık Gösterimleri Rasyonel Sayıya Dönüştürme', recommendedQuestions: 90 },
            { id: '7-mat-7', name: 'Rasyonel Sayıları Karşılaştırma ve Sıralama', recommendedQuestions: 100 },
            { id: '7-mat-8', name: 'Rasyonel Sayılarla Dört İşlem (Toplama, Çıkarma, Çarpma, Bölme)', recommendedQuestions: 140 },
            { id: '7-mat-9', name: 'Rasyonel Sayıların Kare ve Küpleri, Çok Adımlı İşlemler', recommendedQuestions: 130 },
            { id: '7-mat-10', name: 'Rasyonel Sayı Problemleri', recommendedQuestions: 120 },
          ],
        },
        {
          id: '7-mat-u3',
          name: '3. Ünite: Cebirsel İfadeler, Eşitlik ve Denklem',
          topics: [
            { id: '7-mat-11', name: 'Cebirsel İfadelerle Toplama ve Çıkarma İşlemleri', recommendedQuestions: 100 },
            { id: '7-mat-12', name: 'Bir Doğal Sayı ile Bir Cebirsel İfadeyi Çarpma ve Örüntüler', recommendedQuestions: 100 },
            { id: '7-mat-13', name: 'Eşitliğin Korunumu İlkesi ve Birinci Dereceden Bir Bilinmeyenli Denklemler', recommendedQuestions: 120 },
            { id: '7-mat-14', name: 'Birinci Dereceden Bir Bilinmeyenli Denklem Kurma ve Çözme Problemleri', recommendedQuestions: 140 },
          ],
        },
        {
          id: '7-mat-u4',
          name: '4. Ünite: Oran, Orantı ve Yüzdeler',
          topics: [
            { id: '7-mat-15', name: 'Oranda Çokluklardan Biri 1 Olduğunda Diğerinin Değerini Bulma', recommendedQuestions: 80 },
            { id: '7-mat-16', name: 'Doğru Orantı, Ters Orantı ve Orantı Sabiti (k)', recommendedQuestions: 130 },
            { id: '7-mat-17', name: 'Doğru ve Ters Orantı Problemleri', recommendedQuestions: 130 },
            { id: '7-mat-18', name: 'Bir Çokluğun Belirtilen Yüzdesini ve Yüzdesi Verilen Çokluğu Bulma', recommendedQuestions: 120 },
            { id: '7-mat-19', name: 'Yüzde ile Artırma, Azaltma ve Yüzde Problemleri (Kâr, Zarar, İndirim, KDV)', recommendedQuestions: 140 },
          ],
        },
        {
          id: '7-mat-u5',
          name: '5. Ünite: Doğrular, Açılar, Çokgenler ve Çember',
          topics: [
            { id: '7-mat-20', name: 'Açıortay Kavramı ve Çizimi', recommendedQuestions: 80 },
            { id: '7-mat-21', name: 'İki Paralel Doğruyla Bir Kesenin Oluşturduğu Açılar (Yöndeş, İç Ters, Dış Ters)', recommendedQuestions: 130 },
            { id: '7-mat-22', name: 'Düzgün Çokgenlerin İç ve Dış Açıları, Köşegen Sayısı', recommendedQuestions: 120 },
            { id: '7-mat-23', name: 'Özel Dörtgenler (Yamuk, Paralelkenar, Eşkenar Dörtgen, Dikdörtgen)', recommendedQuestions: 110 },
            { id: '7-mat-24', name: 'Eşkenar Dörtgen ve Yamuğun Alanı ve Alan Problemleri', recommendedQuestions: 120 },
            { id: '7-mat-25', name: 'Çemberde Merkez Açı ve Gördüğü Yayın Ölçüsü/Uzunluğu', recommendedQuestions: 110 },
            { id: '7-mat-26', name: 'Dairenin ve Daire Diliminin Alanı', recommendedQuestions: 120 },
          ],
        },
        {
          id: '7-mat-u6',
          name: '6. Ünite: Veri Analizi ve Cisimlerin Görünümleri',
          topics: [
            { id: '7-mat-27', name: 'Çizgi Grafiği Oluşturma ve Yorumlama', recommendedQuestions: 90 },
            { id: '7-mat-28', name: 'Merkezi Eğilim ve Yayılım Ölçüleri: Aritmetik Ortalama, Ortanca (Medyan), Tepe Değer (Mod)', recommendedQuestions: 110 },
            { id: '7-mat-29', name: 'Daire Grafiği Oluşturma ve Veri Uygunluğu', recommendedQuestions: 100 },
            { id: '7-mat-30', name: 'Üç Boyutlu Cisimlerin Farklı Yönlerden Görünümleri', recommendedQuestions: 80 },
          ],
        },
      ],
    },
    {
      subjectId: 'fen',
      units: [
        {
          id: '7-fen-u1',
          name: '1. Ünite: Güneş Sistemi ve Ötesi',
          topics: [
            { id: '7-fen-1', name: 'Uzay Araştırmaları, Roketler, Yapay Uydular ve Uzay Kirliliği', recommendedQuestions: 80 },
            { id: '7-fen-2', name: 'Teleskop Çeşitleri ve Rasathaneler', recommendedQuestions: 70 },
            { id: '7-fen-3', name: 'Güneş Sistemi Ötesi: Yıldızlar, Takımyıldızları, Bulutsular (Nebula)', recommendedQuestions: 90 },
            { id: '7-fen-4', name: 'Galaksiler (Samanyolu vb.) ve Evrenin Oluşumu (Big Bang)', recommendedQuestions: 80 },
          ],
        },
        {
          id: '7-fen-u2',
          name: '2. Ünite: Hücre ve Bölünmeler',
          topics: [
            { id: '7-fen-5', name: 'Hücrenin Temel Kısımları ve Organelleri', recommendedQuestions: 100 },
            { id: '7-fen-6', name: 'Bitki ve Hayvan Hücresi Arasındaki Farklar', recommendedQuestions: 90 },
            { id: '7-fen-7', name: 'Hücre - Doku - Organ - Sistem - Organizma İlişkisi', recommendedQuestions: 80 },
            { id: '7-fen-8', name: 'Mitoz Bölünme ve Aşamaları, Önemi', recommendedQuestions: 120 },
            { id: '7-fen-9', name: 'Mayoz Bölünme ve Aşamaları, Mitoz-Mayoz Karşılaştırması', recommendedQuestions: 130 },
          ],
        },
        {
          id: '7-fen-u3',
          name: '3. Ünite: Kuvvet ve Enerji',
          topics: [
            { id: '7-fen-10', name: 'Kütle ve Ağırlık İlişkisi (Dinamometre ve Eşit Kollu Terazi)', recommendedQuestions: 90 },
            { id: '7-fen-11', name: 'Fiziksel Anlamda İş ve Güç Kavramı', recommendedQuestions: 100 },
            { id: '7-fen-12', name: 'Kinetik Enerji ve Yer Çekimi Potansiyel Enerjisi, Esneklik Potansiyel Enerjisi', recommendedQuestions: 120 },
            { id: '7-fen-13', name: 'Enerjinin Korunumu ve Dönüşümleri (Sürtünme Kuvveti ve Isı)', recommendedQuestions: 110 },
          ],
        },
        {
          id: '7-fen-u4',
          name: '4. Ünite: Saf Madde ve Karışımlar',
          topics: [
            { id: '7-fen-14', name: 'Maddenin Tanecikli Yapısı, Atom, Proton, Nötron, Elektron', recommendedQuestions: 100 },
            { id: '7-fen-15', name: 'Moleküller, Elementler (İlk 18 Element ve Sembolleri) ve Bileşikler', recommendedQuestions: 110 },
            { id: '7-fen-16', name: 'Homojen ve Heterojen Karışımlar (Çözeltiler, Çözücü ve Çözünen)', recommendedQuestions: 100 },
            { id: '7-fen-17', name: 'Çözünme Hızına Etki Eden Faktörler', recommendedQuestions: 90 },
            { id: '7-fen-18', name: 'Karışımların Ayrılması (Buharlaştırma, Damıtma, Yoğunluk Farkı vb.)', recommendedQuestions: 110 },
          ],
        },
        {
          id: '7-fen-u5',
          name: '5. Ünite: Işığın Madde ile Etkileşimi',
          topics: [
            { id: '7-fen-19', name: 'Işığın Soğrulması ve Cisimlerin Renkli Görünmesi, Beyaz Işık', recommendedQuestions: 90 },
            { id: '7-fen-20', name: 'Düzlem, Çukur ve Tümsek Aynalar ve Görüntü Özellikleri', recommendedQuestions: 120 },
            { id: '7-fen-21', name: 'Işığın Kırılması ve Kırılma Kanunları, Yoğunluk İlişkisi', recommendedQuestions: 120 },
            { id: '7-fen-22', name: 'İnce ve Kalın Kenarlı Mercekler, Odak Noktası ve Göz Kusurları', recommendedQuestions: 110 },
          ],
        },
        {
          id: '7-fen-u6',
          name: '6. Ünite: Canlılarda Üreme, Büyüme ve Gelişme & Devreler',
          topics: [
            { id: '7-fen-23', name: 'İnsanda Üreme, Büyüme ve Gelişme (Sperm, Yumurta, Zigot, Fetüs)', recommendedQuestions: 90 },
            { id: '7-fen-24', name: 'Hayvanlarda Üreme ve Başkalaşım (Kurbağa, Kelebek)', recommendedQuestions: 90 },
            { id: '7-fen-25', name: 'Bitkilerde Eşeyli ve Eşeysiz Üreme, Çimlenme Şartları', recommendedQuestions: 100 },
            { id: '7-fen-26', name: 'Ampullerin Bağlanma Şekilleri (Seri ve Paralel Bağlama)', recommendedQuestions: 120 },
            { id: '7-fen-27', name: 'Elektrik Akımı, Gerilim (Ohm Kanunu) ve Direnç İlişkisi', recommendedQuestions: 130 },
          ],
        },
      ],
    },
    {
      subjectId: 'turkce',
      units: [
        {
          id: '7-tur-u1',
          name: '1. Ünite: Sözcükte ve Cümlede Anlam',
          topics: [
            { id: '7-tur-1', name: 'Sözcükte Anlam Özellikleri ve Deyimler / Atasözleri', recommendedQuestions: 100 },
            { id: '7-tur-2', name: 'Cümlede Anlam: Neden, Amaç, Koşul ve Örtülü Anlam', recommendedQuestions: 110 },
          ],
        },
        {
          id: '7-tur-u2',
          name: '2. Ünite: Fiiller (Eylemler)',
          topics: [
            { id: '7-tur-3', name: 'Fiillerde Anlam: İş (Kılış), Durum ve Oluş Fiilleri', recommendedQuestions: 100 },
            { id: '7-tur-4', name: 'Fiillerde Kip: Haber (Bildirme) ve Dilek (Tasarlama) Kipleri', recommendedQuestions: 120 },
            { id: '7-tur-5', name: 'Fiillerde Kişi (Şahıs) Ekleri ve Fiil Çekimi', recommendedQuestions: 100 },
            { id: '7-tur-6', name: 'Fiillerde Anlam (Zaman) Kayması', recommendedQuestions: 90 },
            { id: '7-tur-7', name: 'Ek Fiil (Ek Eylem) ve Görevleri (İsimleri Yüklem Yapma, Birleşik Zaman Oluşturma)', recommendedQuestions: 130 },
          ],
        },
        {
          id: '7-tur-u3',
          name: '3. Ünite: Zarflar ve Sözcükte Yapı',
          topics: [
            { id: '7-tur-8', name: 'Zarflar (Belirteçler): Durum, Zaman, Miktar, Yer-Yön ve Soru Zarfları', recommendedQuestions: 120 },
            { id: '7-tur-9', name: 'Fiillerde Yapı: Basit, Türemiş ve Birleşik Fiiller', recommendedQuestions: 110 },
          ],
        },
        {
          id: '7-tur-u4',
          name: '4. Ünite: Paragrafta Anlam, Yazım ve Noktalama',
          topics: [
            { id: '7-tur-10', name: 'Paragrafın Ana Düşüncesi, Konusu ve Yardımcı Düşünceleri', recommendedQuestions: 140 },
            { id: '7-tur-11', name: 'Anlatım Biçimleri ve Düşünceyi Geliştirme Yolları', recommendedQuestions: 110 },
            { id: '7-tur-12', name: 'Yazım Kuralları ve Noktalama İşaretleri', recommendedQuestions: 120 },
          ],
        },
      ],
    },
    {
      subjectId: 'sosyal',
      units: [
        {
          id: '7-sos-u1',
          name: '1. Ünite: Birey ve Toplum (İletişim ve İnsan İlişkileri)',
          topics: [
            { id: '7-sos-1', name: 'İletişimin Gücü, Olumlu İletişim Dili (Ben Dili, Sen Dili, Etkin Dinleme)', recommendedQuestions: 80 },
            { id: '7-sos-2', name: 'Hızlı İletişim, Medya Okuryazarlığı ve İletişim Özgürlüğü', recommendedQuestions: 80 },
          ],
        },
        {
          id: '7-sos-u2',
          name: '2. Ünite: Türk Tarihinde Yolculuk (Osmanlı Devleti)',
          topics: [
            { id: '7-sos-3', name: 'Beylikten Cihan Devletine: Osmanlı Kuruluş Dönemi ve İskân Politikası', recommendedQuestions: 100 },
            { id: '7-sos-4', name: 'Fetihler ve Kültür: İstanbul’un Fethi ve Yükselme Dönemi', recommendedQuestions: 110 },
            { id: '7-sos-5', name: 'Osmanlı Toplum Yapısı, Hoşgörü (İstimalet) ve Vakıf Kültürü', recommendedQuestions: 90 },
            { id: '7-sos-6', name: 'Avrupa’daki Gelişmeler (Rönesans, Reform, Aydınlanma) ve Osmanlı’ya Etkileri', recommendedQuestions: 100 },
            { id: '7-sos-7', name: 'Osmanlı Islahat ve Yenileşme Hareketleri (Lale Devri, Tanzimat, Meşrutiyet)', recommendedQuestions: 100 },
          ],
        },
        {
          id: '7-sos-u3',
          name: '3. Ünite: Ülkemizde Nüfus, Ekonomi ve Yaşayan Demokrasi',
          topics: [
            { id: '7-sos-8', name: 'Türkiye’de Nüfusun Dağılışı ve Nüfusu Etkileyen Faktörler', recommendedQuestions: 90 },
            { id: '7-sos-9', name: 'Göçlerin Nedenleri ve Sonuçları, Yerleşme Hürriyeti', recommendedQuestions: 90 },
            { id: '7-sos-10', name: 'Kil Tabletlerden Akıllı Tabletlere Bilimsel Gelişmeler', recommendedQuestions: 80 },
            { id: '7-sos-11', name: 'Toprak, Üretim, Meslek Ahlakı (Ahilik Sistemi) ve Demokrasinin Serüveni', recommendedQuestions: 90 },
          ],
        },
      ],
    },
    {
      subjectId: 'ingilizce',
      units: [
        {
          id: '7-ing-u1',
          name: 'Unit 1 & 2: Appearance, Personality & Biographies',
          topics: [
            { id: '7-ing-1', name: 'Describing Characters & Physical Appearance (Comparatives)', recommendedQuestions: 80 },
            { id: '7-ing-2', name: 'Biographies (Talking about Past Events - Simple Past Tense)', recommendedQuestions: 90 },
          ],
        },
        {
          id: '7-ing-u2',
          name: 'Unit 3 & 4: Sports & Wild Animals',
          topics: [
            { id: '7-ing-3', name: 'Sports (Indoor/Outdoor Activities, Adverbs of Frequency)', recommendedQuestions: 80 },
            { id: '7-ing-4', name: 'Wild Animals (Extinct/Endangered Animals, Giving Advice: Should/Shouldn’t)', recommendedQuestions: 90 },
          ],
        },
        {
          id: '7-ing-u3',
          name: 'Unit 5 & 6: Television & Celebrations',
          topics: [
            { id: '7-ing-5', name: 'Television Programs and Preferences', recommendedQuestions: 80 },
            { id: '7-ing-6', name: 'Party Planning and Suggestions (Why don’t we, Let’s, Shall we)', recommendedQuestions: 80 },
          ],
        },
        {
          id: '7-ing-u4',
          name: 'Unit 7 to 10: Dreams, Public Buildings, Environment & Planets',
          topics: [
            { id: '7-ing-7', name: 'Dreams & Future Predictions (Will / Won’t)', recommendedQuestions: 80 },
            { id: '7-ing-8', name: 'Public Buildings and Purposes (In order to)', recommendedQuestions: 80 },
            { id: '7-ing-9', name: 'Environment and Planets (Superlatives)', recommendedQuestions: 90 },
          ],
        },
      ],
    },
    {
      subjectId: 'din',
      units: [
        {
          id: '7-din-u1',
          name: '1. Ünite: Melek ve Ahiret İnancı',
          topics: [
            { id: '7-din-1', name: 'Görülen ve Görülemeyen Varlıklar, Meleklerin Özellikleri ve Görevleri', recommendedQuestions: 80 },
            { id: '7-din-2', name: 'Ahiret Hayatının Aşamaları (Kıyamet, Ba’s, Haşr, Mizan, Cennet/Cehennem)', recommendedQuestions: 90 },
            { id: '7-din-3', name: 'Hz. İsa’nın Hayatı, Nâs Suresi ve Anlamı', recommendedQuestions: 70 },
          ],
        },
        {
          id: '7-din-u2',
          name: '2. Ünite: Hac ve Kurban İbadeti',
          topics: [
            { id: '7-din-4', name: 'İslam’da Hac İbadeti ve Önemi (İhram, Tavaf, Sa’y, Vakfe)', recommendedQuestions: 80 },
            { id: '7-din-5', name: 'Umre ve Kurban İbadeti', recommendedQuestions: 80 },
            { id: '7-din-6', name: 'Hz. İsmail’in Hayatı', recommendedQuestions: 70 },
          ],
        },
        {
          id: '7-din-u3',
          name: '3. Ünite: Ahlaki Davranışlar ve Peygamberimiz',
          topics: [
            { id: '7-din-7', name: 'Güzel Ahlaki Tutum ve Davranışlar (Adalet, Dürüstlük, Sabır)', recommendedQuestions: 80 },
            { id: '7-din-8', name: 'Hz. Muhammed’in İnsani ve Peygamberlik Yönü, Felak Suresi', recommendedQuestions: 80 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // 6. SINIF TÜM MÜFREDAT
  // ==========================================
  '6': [
    {
      subjectId: 'matematik',
      units: [
        {
          id: '6-mat-u1',
          name: '1. Ünite: Doğal Sayılarla İşlemler ve Çarpanlar',
          topics: [
            { id: '6-mat-1', name: 'Üslü İfadeler ve Doğal Sayıların Kuvveti', recommendedQuestions: 100 },
            { id: '6-mat-2', name: 'İşlem Önceliği (Parantez, Üs, Çarpma/Bölme, Toplama/Çıkarma)', recommendedQuestions: 110 },
            { id: '6-mat-3', name: 'Doğal Sayılarda Ortak Çarpan Parantezi ve Dağılma Özelliği', recommendedQuestions: 90 },
            { id: '6-mat-4', name: 'Doğal Sayı Problemleri (Dört İşlem Problemleri)', recommendedQuestions: 120 },
            { id: '6-mat-5', name: 'Çarpanlar ve Katlar, Bölünebilme Kuralları (2, 3, 4, 5, 6, 9, 10)', recommendedQuestions: 120 },
            { id: '6-mat-6', name: 'Asal Sayılar ve Doğal Sayıları Asal Çarpanlarına Ayırma', recommendedQuestions: 110 },
            { id: '6-mat-7', name: 'Ortak Bölenler ve Ortak Katlar', recommendedQuestions: 110 },
            { id: '6-mat-8', name: 'Kümeler Kavramı, Gösterimi (Liste, Venn Şeması) ve Kesişim/Birleşim', recommendedQuestions: 90 },
          ],
        },
        {
          id: '6-mat-u2',
          name: '2. Ünite: Tam Sayılar ve Kesirlerle İşlemler',
          topics: [
            { id: '6-mat-9', name: 'Tam Sayıları Tanıma, Yönlü Sayılar ve Sayı Doğrusunda Gösterme', recommendedQuestions: 100 },
            { id: '6-mat-10', name: 'Mutlak Değer Kavramı ve Tam Sayılarda Sıralama', recommendedQuestions: 100 },
            { id: '6-mat-11', name: 'Kesirleri Karşılaştırma, Sıralama ve Sayı Doğrusunda Gösterme', recommendedQuestions: 100 },
            { id: '6-mat-12', name: 'Kesirlerle Toplama ve Çıkarma İşlemleri', recommendedQuestions: 120 },
            { id: '6-mat-13', name: 'Kesirlerle Çarpma ve Bölme İşlemleri', recommendedQuestions: 130 },
            { id: '6-mat-14', name: 'Kesir Problemleri', recommendedQuestions: 120 },
          ],
        },
        {
          id: '6-mat-u3',
          name: '3. Ünite: Ondalık Gösterim ve Oran',
          topics: [
            { id: '6-mat-15', name: 'Bölme İşlemi ile Kesir İlişkisi ve Ondalık Gösterim', recommendedQuestions: 90 },
            { id: '6-mat-16', name: 'Ondalık Gösterimleri Yuvarlama (Basamak Değerine Göre)', recommendedQuestions: 90 },
            { id: '6-mat-17', name: 'Ondalık Gösterimlerle Çarpma ve Bölme İşlemleri (10, 100, 1000 ile Pratik Çarpma/Bölme)', recommendedQuestions: 130 },
            { id: '6-mat-18', name: 'Ondalık Gösterim Problemleri', recommendedQuestions: 110 },
            { id: '6-mat-19', name: 'Oran Kavramı, Birimli ve Birimsiz Oran', recommendedQuestions: 100 },
          ],
        },
        {
          id: '6-mat-u4',
          name: '4. Ünite: Cebirsel İfadeler ve Veri Toplama',
          topics: [
            { id: '6-mat-20', name: 'Cebirsel İfadelerin Anlamı ve Değişken Kavramı', recommendedQuestions: 90 },
            { id: '6-mat-21', name: 'Cebirsel İfadenin Değerini Hesaplama', recommendedQuestions: 90 },
            { id: '6-mat-22', name: 'İki Gruba Ait Araştırma Soruları Üretme ve Sıklık Tablosu / Sütun Grafiği', recommendedQuestions: 90 },
            { id: '6-mat-23', name: 'Aritmetik Ortalama ve Açıklık Hesaplama', recommendedQuestions: 100 },
          ],
        },
        {
          id: '6-mat-u5',
          name: '5. Ünite: Açılar ve Alan Ölçme',
          topics: [
            { id: '6-mat-24', name: 'Açı Kavramı, Komşu, Tümler, Bütünler ve Ters Açılar', recommendedQuestions: 120 },
            { id: '6-mat-25', name: 'Üçgende Yükseklik ve Üçgenin Alanı', recommendedQuestions: 120 },
            { id: '6-mat-26', name: 'Paralelkenarın Alanı ve Alan Problemleri', recommendedQuestions: 110 },
            { id: '6-mat-27', name: 'Alan Ölçme Birimleri ($m^2, cm^2, mm^2, km^2$) ve Arazi Ölçüleri (Ar, Dekar, Hektar)', recommendedQuestions: 110 },
          ],
        },
        {
          id: '6-mat-u6',
          name: '6. Ünite: Çember, Geometrik Cisimler ve Sıvı Ölçme',
          topics: [
            { id: '6-mat-28', name: 'Çemberin Temel Elemanları ve Çevre Uzunluğu ($2\\pi r$)', recommendedQuestions: 110 },
            { id: '6-mat-29', name: 'Dikdörtgenler Prizmasının Hacmi ve Hacim Ölçme Birimleri', recommendedQuestions: 120 },
            { id: '6-mat-30', name: 'Sıvı Ölçme Birimleri (Litre, Desilitre, Santilitre, Mililitre) ve Hacim İlişkisi', recommendedQuestions: 110 },
          ],
        },
      ],
    },
    {
      subjectId: 'fen',
      units: [
        {
          id: '6-fen-u1',
          name: '1. Ünite: Güneş Sistemi ve Tutulmalar',
          topics: [
            { id: '6-fen-1', name: 'Güneş Sistemi Gezegenleri (İç ve Dış Gezegenler, Asteroidler ve Meteorlar)', recommendedQuestions: 90 },
            { id: '6-fen-2', name: 'Güneş Tutulması ve Ay Tutulması Olayları ve Modellenmesi', recommendedQuestions: 90 },
          ],
        },
        {
          id: '6-fen-u2',
          name: '2. Ünite: Vücudumuzdaki Sistemler',
          topics: [
            { id: '6-fen-3', name: 'Destek ve Hareket Sistemi (Kemikler, Eklemler, Kas Çeşitleri)', recommendedQuestions: 90 },
            { id: '6-fen-4', name: 'Sindirim Sistemi (Fiziksel ve Kimyasal Sindirim, Emilim, Karaciğer, Pankreas)', recommendedQuestions: 100 },
            { id: '6-fen-5', name: 'Dolaşım Sistemi (Kalbin Yapısı, Küçük ve Büyük Kan Dolaşımı, Kan Grupları)', recommendedQuestions: 110 },
            { id: '6-fen-6', name: 'Solunum Sistemi (Akciğerler, Alveoller, Diyafram ve Soluk Alıp Verme)', recommendedQuestions: 90 },
            { id: '6-fen-7', name: 'Boşaltım Sistemi (Böbrekler, Nefron, Üreter, İdrar Kesesi)', recommendedQuestions: 90 },
          ],
        },
        {
          id: '6-fen-u3',
          name: '3. Ünite: Kuvvet ve Hareket',
          topics: [
            { id: '6-fen-8', name: 'Bileşke Kuvvet (Net Kuvvet) ve Dengelenmiş / Dengelenmemiş Kuvvetler', recommendedQuestions: 110 },
            { id: '6-fen-9', name: 'Sabit Süratli Hareket, Yol-Zaman ve Sürat-Zaman Grafikleri', recommendedQuestions: 110 },
          ],
        },
        {
          id: '6-fen-u4',
          name: '4. Ünite: Madde ve Isı & Ses',
          topics: [
            { id: '6-fen-10', name: 'Maddenin Tanecikli, Boşluklu ve Hareketli Yapısı', recommendedQuestions: 80 },
            { id: '6-fen-11', name: 'Yoğunluk ve Yoğunluğun Hesaplanması ($d = m/V$)', recommendedQuestions: 110 },
            { id: '6-fen-12', name: 'Isı İletkenliği, Isı Yalıtımı ve Binalarda Yalıtımın Önemi', recommendedQuestions: 90 },
            { id: '6-fen-13', name: 'Sesin Yayılması ve Farklı Ortamlarda Farklı Duyulması', recommendedQuestions: 90 },
            { id: '6-fen-14', name: 'Sesin Sürati, Sesin Yansıması (Yankı), Soğrulması ve Ses Yalıtımı', recommendedQuestions: 90 },
          ],
        },
        {
          id: '6-fen-u5',
          name: '5. Ünite: Sistemlerin Sağlığı ve Elektriğin İletimi',
          topics: [
            { id: '6-fen-15', name: 'Denetleyici ve Düzenleyici Sistemler (Sinir Sistemi ve İç Salgı Bezleri)', recommendedQuestions: 100 },
            { id: '6-fen-16', name: 'Duyu Organları (Göz, Kulak, Burun, Dil, Deri) ve Kusurları', recommendedQuestions: 110 },
            { id: '6-fen-17', name: 'İletken ve Yalıtkan Maddeler, Elektriksel Direnç ve Bağlı Olduğu Faktörler', recommendedQuestions: 100 },
          ],
        },
      ],
    },
    {
      subjectId: 'turkce',
      units: [
        {
          id: '6-tur-u1',
          name: '1. Ünite: Sözcükte ve Cümlede Anlam',
          topics: [
            { id: '6-tur-1', name: 'Sözcükte Anlam, Mecaz, Terim ve Deyimler', recommendedQuestions: 90 },
            { id: '6-tur-2', name: 'Cümlede Anlam: Öznel-Nesnel, Neden-Sonuç, Amaç-Sonuç', recommendedQuestions: 100 },
          ],
        },
        {
          id: '6-tur-u2',
          name: '2. Ünite: Sözcük Türleri (İsim, Sıfat, Zamir)',
          topics: [
            { id: '6-tur-3', name: 'İsimler (Adlar), Varlıklara Verilişine Göre ve İsim Tamlamaları', recommendedQuestions: 110 },
            { id: '6-tur-4', name: 'Sıfatlar (Ön Adlar): Niteleme ve Belirtme Sıfatları, Sıfat Tamlamaları', recommendedQuestions: 110 },
            { id: '6-tur-5', name: 'Zamirler (Adıllar): Kişi, İşaret, Belgisiz ve Soru Zamirleri', recommendedQuestions: 110 },
            { id: '6-tur-6', name: 'Edat (İlgeç), Bağlaç ve Ünlem', recommendedQuestions: 100 },
          ],
        },
        {
          id: '6-tur-u3',
          name: '3. Ünite: Paragraf, Yazım ve Noktalama',
          topics: [
            { id: '6-tur-7', name: 'Paragrafın Ana Düşüncesi, Konusu ve Başlığı', recommendedQuestions: 130 },
            { id: '6-tur-8', name: 'Yazım Kuralları ve Noktalama İşaretleri', recommendedQuestions: 110 },
          ],
        },
      ],
    },
    {
      subjectId: 'sosyal',
      units: [
        {
          id: '6-sos-u1',
          name: '1. Ünite: Biz ve Değerlerimiz',
          topics: [
            { id: '6-sos-1', name: 'Toplumda Rollerimiz, Hak ve Sorumluluklarımız', recommendedQuestions: 80 },
            { id: '6-sos-2', name: 'Bizi Bir Araya Getiren Değerler, Kültürel Zenginliğimiz ve Ön Yargılar', recommendedQuestions: 80 },
          ],
        },
        {
          id: '6-sos-u2',
          name: '2. Ünite: Tarihe Yolculuk (İlk Türk Devletleri ve İslamiyet)',
          topics: [
            { id: '6-sos-3', name: 'Orta Asya İlk Türk Devletleri (Asya Hun, Kök Türk, Uygurlar)', recommendedQuestions: 90 },
            { id: '6-sos-4', name: 'İslamiyet’in Doğuşu ve Dört Halife Dönemi', recommendedQuestions: 90 },
            { id: '6-sos-5', name: 'Türklerin İslamiyet’i Kabulü (Karahanlı, Gazneli, Büyük Selçuklu)', recommendedQuestions: 90 },
            { id: '6-sos-6', name: 'Anadolu’nun Türkleşmesi ve Tarihi Ticaret Yolları (İpek ve Baharat Yolu)', recommendedQuestions: 90 },
          ],
        },
        {
          id: '6-sos-u3',
          name: '3. Ünite: Yeryüzünde Yaşam ve Üretiyorum Tüketiyorum',
          topics: [
            { id: '6-sos-7', name: 'Dünyanın Neresindeyiz? (Paralel, Meridyen, Kıtalar ve Okyanuslar)', recommendedQuestions: 80 },
            { id: '6-sos-8', name: 'Türkiye’nin Coğrafi Konumu, İklimleri ve Bitki Örtüsü', recommendedQuestions: 90 },
            { id: '6-sos-9', name: 'Kaynaklarımız Kazanca Dönüşüyor (Tarım, Hayvancılık, Orman, Madenler)', recommendedQuestions: 80 },
            { id: '6-sos-10', name: 'Vergilerimizle Büyüyoruz, Nitelikli İnsan Gücü ve Etkin Vatandaşlık', recommendedQuestions: 80 },
          ],
        },
      ],
    },
    {
      subjectId: 'ingilizce',
      units: [
        {
          id: '6-ing-u1',
          name: 'Unit 1 & 2: Life & Yummy Breakfast',
          topics: [
            { id: '6-ing-1', name: 'Daily Routines, Dates and Telling The Time', recommendedQuestions: 70 },
            { id: '6-ing-2', name: 'Food & Drinks, Expressing Likes and Dislikes', recommendedQuestions: 70 },
          ],
        },
        {
          id: '6-ing-u2',
          name: 'Unit 3 & 4: Downtown & Weather and Emotions',
          topics: [
            { id: '6-ing-3', name: 'City Life vs Country Life (Present Continuous & Comparatives)', recommendedQuestions: 80 },
            { id: '6-ing-4', name: 'Weather Conditions and Expressing Emotions', recommendedQuestions: 70 },
          ],
        },
        {
          id: '6-ing-u3',
          name: 'Unit 5 to 10: At The Fair, Occupations, Holidays & Saving The Planet',
          topics: [
            { id: '6-ing-5', name: 'At The Fair (Fairs, Rides, Opinions)', recommendedQuestions: 70 },
            { id: '6-ing-6', name: 'Occupations (Jobs, Simple Past Was/Were)', recommendedQuestions: 80 },
            { id: '6-ing-7', name: 'Holidays (Past Activities - Regular/Irregular Verbs)', recommendedQuestions: 80 },
            { id: '6-ing-8', name: 'Saving The Planet (Must / Mustn’t, Eco-Friendly Actions)', recommendedQuestions: 80 },
          ],
        },
      ],
    },
    {
      subjectId: 'din',
      units: [
        {
          id: '6-din-u1',
          name: '1. Ünite: Peygamber ve İlahi Kitap İnancı',
          topics: [
            { id: '6-din-1', name: 'Peygamberlerin Nitelikleri ve Görevleri (Sıdk, Emanet, İsmet, Fetanet, Tebliğ)', recommendedQuestions: 80 },
            { id: '6-din-2', name: 'İlahi Kitaplar ve Sayfalar (Suhuf)', recommendedQuestions: 70 },
            { id: '6-din-3', name: 'Hz. Âdem’in Hayatı, Kunut Duaları', recommendedQuestions: 60 },
          ],
        },
        {
          id: '6-din-u2',
          name: '2. Ünite: Namaz İbadeti',
          topics: [
            { id: '6-din-4', name: 'İslam’da Namazın Önemi ve Çeşitleri', recommendedQuestions: 80 },
            { id: '6-din-5', name: 'Namazın Kılınışı ve Şartları (İçindeki ve Dışındaki Şartlar)', recommendedQuestions: 90 },
            { id: '6-din-6', name: 'Cemaatle Namaz, Cuma ve Bayram Namazları', recommendedQuestions: 80 },
          ],
        },
        {
          id: '6-din-u3',
          name: '3. Ünite: Zararlı Alışkanlıklar ve Değerlerimiz',
          topics: [
            { id: '6-din-7', name: 'İslam’ın Yasakladığı Zararlı Alışkanlıklar (Alkol, Kumar vb.)', recommendedQuestions: 70 },
            { id: '6-din-8', name: 'Hz. Yahya’nın Hayatı, Tebbet Suresi ve Anlamı', recommendedQuestions: 60 },
          ],
        },
      ],
    },
  ],
};
