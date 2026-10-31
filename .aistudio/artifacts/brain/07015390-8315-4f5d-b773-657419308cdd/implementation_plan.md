# MaarifPlan - Veri Saklama Mimarisi & Firebase Bulut Entegrasyonu

Bu plan, kullanıcının kişisel kullanımında çalışma verilerinin (görevler, deneme sınavı sonuçları, haftalık hedefler ve müfredat ilerlemesi) asla kaybolmaması için sunulan **2. seçenek (Dosya / Bulut Tabanlı Kalıcı Saklama)** kapsamında **Firebase Cloud Firestore** ve **JSON Dosya Yedeği** alternatiflerini detaylandırır ve sisteme entegrasyon yol haritasını sunar.

---

## Kullanıcı Değerlendirmesi & Kritik Kararlar

> [!IMPORTANT]
> Kullanıcı "2. seçenek" üzerinde durmakta ve **Firebase Bulut Veritabanı** hakkında detaylı bilgi talep etmektedir. Aşağıdaki mimari karar matrisi, uygulamanın hangi bulut veya dosya mimarisiyle çalışacağına karar vermek üzere hazırlanmıştır.

| Kriter | 1. Yerel Depolama (Mevcut LocalStorage) | 2. Dosya Yedeği (Mevcut JSON Export/Import) | 3. Firebase Bulut (Önerilen Firestore & Auth) |
| :--- | :--- | :--- | :--- |
| **Kayıt Yeri** | Cihazdaki tarayıcı hafızası | Bilgisayar/Telefon dosyası (.json) | Google Firebase Bulut Veritabanı (Firestore) |
| **Cihazlar Arası Senkronizasyon** | ❌ Yalnızca tek cihazda geçerli | ⚠️ Dosyayı diğer cihaza aktarmak gerekir | ✅ **Otomatik & Anlık (Telefonda yaz, bilgisayarda gör)** |
| **Giriş / Hesap İhtiyacı** | Yok (Hemen başlar) | Yok (Hemen başlar) | Google ile Giriş Yap veya E-posta |
| **Tarayıcı Geçmişi Temizlenirse** | ⚠️ Veri kaybolabilir | ✅ Dosya güvenle sizde kalır | ✅ **Bulutta güvende kalır, asla silinmez** |
| **Maliyet / Kota** | Tamamen ücretsiz | Tamamen ücretsiz | **Firebase Spark Planı (Bireysel kullanım için %100 ücretsiz)** |
| **İnternetsiz (Offline) Çalışma** | ✅ Tam çevrimdışı | ✅ Tam çevrimdışı | ✅ **Firestore Offline Cache sayesinde internetsiz de çalışır** |

---

## 1. Firebase Bulut Veritabanı Nedir ve Nasıl Çalışır?

Firebase, Google tarafından sunulan modern, güvenli ve kurumsal düzeyde bir bulut altyapısıdır:
1. **Google ile Tek Tıkla Giriş (Firebase Authentication):**
   - Öğrenci veya veli tek bir butonla (örneğin Google hesabı ile) güvenle giriş yapar. Şifre ezberlemeye gerek kalmaz.
2. **Kişiye Özel Güvenli Veri Alanı (Cloud Firestore NoSQL Database):**
   - Her kullanıcının verisi sadece kendi kimliğine (`userId`) bağlı özel bir klasörde (`users/{userId}/tasks` ve `users/{userId}/mockExams`) tutulur. Başka kimse bu verilere erişemez (`firestore.rules` ile kilitlenir).
3. **Anında Çift Yönlü Senkronizasyon (Real-time Sync):**
   - Cep telefonunuzdan takvime bir LGS deneme sonucu girdiğinizde, evdeki tabletinizde veya dizüstü bilgisayarınızda sayfayı yenilemeye bile gerek kalmadan veriler anında güncellenir.
4. **Çevrimdışı Dayanıklılık (Offline Persistence):**
   - İnternetiniz kesse bile uygulama çalışmaya devam eder. İnternet tekrar geldiğinde arkada sessizce buluta eşitlenir.

---

## 2. Kullanıcı Deneyimi & Arayüz Akışı

### A. Giriş & Profil Durumu (Header Entegrasyonu)
- Üst çubukta (Header) kullanıcının profil avatarı ve adı görünecektir.
- Giriş yapılmadığında: *"Bulut Senkronizasyonu: Kapalı (Yerel Mod)"* veya *"Google ile Giriş Yap"* butonu yer alır.
- Giriş yapıldığında: *"Bulut Senkron: Aktif"* yeşil rozeti ve oturum bilgisi görüntülenir.

### B. Yedekleme & Dosya İndirme (Hibrit Koruma)
- Firebase eklense dahi **JSON İndir / Yükle** özelliği korunur. İsteyen kullanıcı dilediğinde verilerini kendi bilgisayarına tek dosya olarak indirip saklayabilir.

```
┌────────────────────────────────────────────────────────┐
│  MaarifPlan Bulut & Yerel Veri Mimarisi                │
└────────────────────────────────────────────────────────┘
          │                                  │
          ▼                                  ▼
 ┌───────────────────┐             ┌───────────────────┐
 │ Tarayıcı Hafızası │             │  Firebase Bulut   │
 │   (LocalStorage)  │             │ (Cloud Firestore) │
 └───────────────────┘             └───────────────────┘
          │                                  │
          │                                  ▼
          │                        ┌───────────────────┐
          │                        │ Google Hesabı ile │
          │                        │  Güvenli Oturum   │
          │                        └───────────────────┘
          │                                  │
          └───────────────┬──────────────────┘
                          ▼
              ┌───────────────────────┐
              │  Her Cihazdan Erişim  │
              │  + JSON Dosya Yedeği  │
              └───────────────────────┘
```

---

## 3. Teknik Mimari & Veri Modeli

### Veri Şeması (`Cloud Firestore`):
- `/users/{userId}`: Kullanıcı profil ayarları ve hedef sınıf (6, 7, 8).
- `/users/{userId}/tasks/{taskId}`: Takvim görevleri, tarih, saat, süre, soru hedefleri, çözülen soru sayıları ve tamamlanma durumu.
- `/users/{userId}/mockExams/{examId}`: Deneme sınavı sonuçları, ders bazlı netler ve yüzdelik başarılar.

### Güvenlik Kuralları (`firestore.rules`):
```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 4. Sonraki Adımlar & Uygulama Sırası

1. **Onayınız Halinde:** AI Studio Firebase Kurulum UI arayüzü açılarak projenize Firebase Authentication ve Cloud Firestore sağlanır.
2. `src/lib/firebase.ts` servisi oluşturularak Google Giriş ve veritabanı dinleyicileri bağlanır.
3. Kullanıcı giriş yaptığında tüm yerel veriler otomatik olarak kullanıcının bulut hesabına aktarılır.
