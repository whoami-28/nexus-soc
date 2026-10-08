# 🚀 NEXUS — Мобильное приложение (Лабораторные работы 1–6)

Кроссплатформенный проект киберпанк-сообщества разработчиков **NEXUS**, объединяющий:
1. **Адаптивное веб-приложение (HTML5 / CSS3 / JS)** с поддержкой мобильных экранов и деплоем на **GitHub Pages**.
2. **Мобильное приложение на React Native (Expo SDK 57 / React 19)** с поддержкой:
   - **`WebView`** оболочки веб-приложения (Лабораторная работа №6).
   - **Нативных компонентов** всех 3 макетов интерфейса (Лента, Ветка обсуждения с кодом, Профиль с протоколом кармы).

---

## 🌐 Лабораторная работа №6: GitHub Pages и WebView в Expo Go

* **Репозиторий на GitHub:** [https://github.com/whoami-28/nexus-soc](https://github.com/whoami-28/nexus-soc)
* **URL опубликованного веб-приложения:** [https://whoami-28.github.io/nexus-soc/](https://whoami-28.github.io/nexus-soc/)
* **Основной экран Expo:** [`WebViewScreen.tsx`](react-native-nexus/src/screens/WebViewScreen.tsx) с компонентом `WebView` из пакета `react-native-webview`.

### Как включить публикацию на GitHub Pages (1 минута):
1. Откройте настройки репозитория: [https://github.com/whoami-28/nexus-soc/settings/pages](https://github.com/whoami-28/nexus-soc/settings/pages).
2. В блоке **Build and deployment**:
   - **Source:** выберите `Deploy from a branch`.
   - **Branch:** выберите ветку `main`, папку `/ (root)`.
   - Нажмите **Save**.
3. Через 1–2 минуты сайт станет доступен по адресу [https://whoami-28.github.io/nexus-soc/](https://whoami-28.github.io/nexus-soc/).

---

## ⚡ Быстрый запуск в 1 клик (Windows)

В корне проекта создан файл **[`run.bat`](run.bat)**. Просто запустите его двойным щелчком мыши:

```text
======================================================================
               NEXUS — React Native Mobile Application
                  (Expo SDK 57 / React 19 / Metro)
======================================================================

  [1] Телефон: Expo Go через облачный туннель (Рекомендуется ⭐)
      - Работает на любом телефоне (Android / iPhone)
      - Не зависит от Wi-Fi роутера, Radmin VPN и брандмауэра Windows

  [2] Телефон: Expo Go по локальной сети Wi-Fi
      - Телефон и компьютер должны быть в одной сети Wi-Fi

  [3] Компьютер: Мгновенный запуск в браузере (React Native Web)
      - Открывается на ПК в браузере с симулятором рамки смартфона

  [4] Проверка зависимостей и сборки (Expo Doctor)

  [0] Выход
======================================================================
```

---

## 📱 Способы запуска на телефоне

### Вариант 1: Через Expo Go с туннелем (Рекомендуется ⭐)
Работает независимо от сетевых настроек, изоляции Wi-Fi на роутере, брандмауэра Windows и VPN-адаптеров (Radmin / Hamachi).

1. Установите на телефон бесплатное приложение **Expo Go**:
   - **Android:** [Google Play → Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - **iPhone:** [App Store → Expo Go](https://apps.apple.com/app/expo-go/id982107779)
2. Запустите **[`run.bat`](run.bat)** и нажмите клавишу **`1`** (или введите в терминале):
   ```powershell
   cd d:\01_Temp\Projects\Mobilki\react-native-nexus
   npx expo start --tunnel -c
   ```
3. Отсканируйте появившийся QR-код:
   - **Android:** в приложении Expo Go нажмите **«Scan QR code»**.
   - **iOS:** наведите стандартную **камеру телефона** на QR-код и нажмите плашку *«Открыть в Expo Go»*.
4. На телефоне сразу откроется экран **`WebView`** с загруженным с GitHub Pages приложением NEXUS!

---

## 🧩 Экраны приложения в Expo

В верхней панели навигации приложения переключаются экраны:
1. **`🌐 ЛР 6: WebView (GitHub Pages)`** (стартовый экран по умолчанию):
   - Загружает живой сайт `https://whoami-28.github.io/nexus-soc/` через компонент `WebView`.
   - Индикатор загрузки с неоновой подсветкой и кнопка быстрого обновления `↻ Обновить`.
2. **`📱 1. Лента (Feed)`**:
   - Нативная лента: телеметрия, векторный график затухания задержки, карточки постов.
3. **`💬 2. Ветка (Thread)`**:
   - Терминал с подсветкой Python-кода `MESH_DISPATCHER.PY` и древовидные ветки комментариев.
4. **`👤 3. Профиль (Profile)`**:
   - Профиль Elena Rostova, карточка `Karma Protocol` (48,920 REP) и сетка метрик.

---

## 🛠 Структура файлов проекта

```text
Mobilki/
├── run.bat                         # Быстрый запуск в 1 клик для Windows (CMD лаунчер)
├── run.ps1                         # Интерактивное меню PowerShell (UTF-8, цветной вывод)
├── README.md                       # Главная документация проекта
├── .gitignore                      # Исключения Git (node_modules, .expo, dist)
├── index.html                      # Веб-приложение (HTML5, деплоится на GitHub Pages)
├── style.css                       # Адаптивные стили (Flexbox, Grid, Media Queries)
├── script.js                       # Интерактивная клиентская логика
├── assets/                         # Графика, аватары и превью для веб-версии
└── react-native-nexus/             # Мобильное приложение на React Native (Expo SDK 57)
    ├── run.bat                     # Локальный батник для запуска
    ├── run.ps1                     # Локальный скрипт PowerShell
    ├── App.tsx                     # Корневой компонент с WebView и нативными экранами
    ├── package.json                # Зависимости (Expo 57, React 19, react-native-webview)
    ├── src/
    │   ├── screens/
    │   │   ├── WebViewScreen.tsx   # Экран Лабораторной работы №6 (react-native-webview)
    │   │   ├── FeedScreen.tsx      # Экран 1: Главная лента
    │   │   ├── ThreadScreen.tsx    # Экран 2: Ветка обсуждения и код
    │   │   └── ProfileScreen.tsx   # Экран 3: Профиль Elena Rostova
    │   └── components/             # Компоненты навигации, шапки и SVG
    └── assets/                     # Графические ресурсы для React Native
```

---

## 📦 Технический стек и версии

* **Git / GitHub:** `git version 2.55.0`, репозиторий `whoami-28/nexus-soc`
* **Деплой веб:** GitHub Pages (ветка `main`, `/ (root)`)
* **Expo SDK:** `~57.0.27`
* **WebView:** `react-native-webview@13.16.1`
* **React Native:** `0.86.3` (New Architecture / Fabric)
* **React / React DOM:** `19.2.3`
* **TypeScript:** `~6.0.3`
