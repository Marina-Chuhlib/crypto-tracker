# Crypto Tracker

Мобільний додаток для відстеження курсів криптовалют.

## Стек та архітектура

- **React Native CLI** + **TypeScript**
- **Redux Toolkit** — управління станом (coins, favorites)
- **React Navigation v6** (Native Stack)
- **AsyncStorage** — збереження обраного між сесіями
- **CoinGecko API** — безкоштовне публічне API

**Архітектурний підхід:** Feature-slice з поділом на шари:

- `api/` — мережевий шар (fetch + обробка помилок)
- `store/` — бізнес-логіка (RTK slice + async thunks)
- `screens/` — UI (тільки відображення + виклик actions)
- `components/` — перевикористовувані UI-компоненти

## Як запустити

```bash
# Встановити залежності
yarn install

# iOS
cd ios && pod install && cd ..
yarn ios

# Android
yarn android
```

## Що реалізовано

- [x] App icon — іконка додатку
- [x] Список 20 монет з іконками, назвою, ціною, зміною за 24г
- [x] Підсвітка зеленим/червоним для зміни ціни
- [x] Пошук по назві та тікеру (локальна фільтрація)
- [x] Pull-to-refresh
- [x] Екран деталей: капіталізація, High/Low 24h, ранг
- [x] Кнопка "Обране" зі збереженням через AsyncStorage
- [x] Анімація при додаванні в обране
- [x] Обробка помилок (немає інтернету / API недоступний)
- [x] Empty state при відсутності результатів пошуку

<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 17 - 2026-06-29 at 12 40 34" src="https://github.com/user-attachments/assets/f92a4788-83e2-40d2-b702-dacaa73e72b5" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 17 - 2026-06-29 at 12 40 16" src="https://github.com/user-attachments/assets/69a4ea19-b5d9-474d-b90d-2fa59001ca86" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 17 - 2026-06-29 at 12 40 26" src="https://github.com/user-attachments/assets/65c6bcfd-3568-419b-8e26-a81b1ccd35ef" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 17 - 2026-06-29 at 12 41 04" src="https://github.com/user-attachments/assets/9d7c9a44-b8bf-4a8b-b58b-fbed5e2de84f" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 17 - 2026-06-29 at 12 40 44" src="https://github.com/user-attachments/assets/c526e72f-69d4-424a-b86a-35a8c37b43a0" />


## Що не встигла / можна покращити

- Графік ціни (sparkline) — потребує додаткового поля з API
- Реальний текстовий опис монети (потрібен окремий запит `/coins/{id}`)
- Skeleton loading замість ActivityIndicator
