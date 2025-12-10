# PocketGuard 💰

Aplikasi pengatur keuangan pribadi yang dibuat dengan React Native CLI.

## 📋 Informasi Project

| Item | Detail |
|------|--------|
| **Platform** | iOS & Android |
| **React Native** | 0.82.1 |
| **React** | 19.1.1 |
| **Package Name (Android)** | com.pocketguard.app |
| **Bundle ID (iOS)** | com.pocketguard.app |

## 🚀 Menjalankan Aplikasi

### Prerequisites

Pastikan environment development sudah terkonfigurasi dengan benar:
- Node.js >= 20
- Watchman
- Xcode (untuk iOS)
- Android Studio + Android SDK (untuk Android)
- CocoaPods (untuk iOS)

### 1. Install Dependencies

```bash
npm install
```

### 2. Install iOS Pods

```bash
cd ios && pod install && cd ..
```

### 3. Menjalankan Metro Bundler

```bash
npm start
```

### 4. Menjalankan di iOS Simulator

```bash
npm run ios
# atau dengan simulator spesifik
npm run ios -- --simulator="iPhone 15 Pro"
```

### 5. Menjalankan di Android Emulator

Pastikan emulator Android sudah berjalan, kemudian:

```bash
npm run android
```

## 📁 Struktur Project

```
PocketGuard/
├── android/           # Native Android project
├── ios/               # Native iOS project
├── node_modules/      # Dependencies
├── __tests__/         # Test files
├── App.tsx            # Main application component
├── index.js           # Entry point
├── app.json           # App configuration
├── package.json       # Project dependencies
├── metro.config.js    # Metro bundler config
├── babel.config.js    # Babel configuration
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 🛠 Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm start` | Menjalankan Metro bundler |
| `npm run android` | Build & run di Android |
| `npm run ios` | Build & run di iOS |
| `npm run lint` | Menjalankan ESLint |
| `npm test` | Menjalankan Jest tests |

## 🎯 Roadmap Fitur

### Phase 1 - Foundation ✅
- [x] Setup React Native CLI project
- [x] Konfigurasi iOS & Android
- [x] Verifikasi build di kedua platform

### Phase 2 - Core Features (Coming Soon)
- [ ] Dashboard overview keuangan
- [ ] Input pemasukan & pengeluaran
- [ ] Kategori transaksi
- [ ] Riwayat transaksi

### Phase 3 - Advanced Features (Planned)
- [ ] Grafik & visualisasi data
- [ ] Budget planner
- [ ] Reminder pembayaran
- [ ] Export laporan (PDF/CSV)
- [ ] Backup & restore data

## 🔧 Troubleshooting

### iOS Build Error
```bash
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

### Android Build Error
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### Metro Bundler Issues
```bash
watchman watch-del-all
npm start -- --reset-cache
```

## 📝 License

MIT License - Feel free to use and modify.

---

**Created with ❤️ using React Native CLI**
