# Nasiya Savdo - Qarzlarni boshqarish tizimi

Bu loyiha do'konlar uchun qarzlarni boshqarish tizimi hisoblanadi. Do'konlar o'z mijozlarining qarzlarini oson boshqarishi va kuzatib borishi mumkin.

## Texnologiyalar

- NestJS (Backend framework)
- TypeScript
- PostgreSQL (Ma'lumotlar bazasi)
- TypeORM (ORM)
- JWT (Authentication)
- Swagger (API documentation)

## O'rnatish

1. Loyihani clone qiling:
```bash
git clone <repository_url>
cd nasiyasavdo_team2
```

2. Kerakli paketlarni o'rnating:
```bash
pnpm install
```

3. `.env` faylini sozlang:
```env
API_PORT=3000
NODE_ENV=dev
DEV_DB_URL=postgres://postgres:postgres@127.0.0.1:5432/nasiyasavdo_db
PROD_DB_URL=postgres://postgres:postgres@127.0.0.1:5432/nasiyasavdo_db
ACCESS_TOKEN_KEY=your_access_token_key
ACCESS_TOKEN_TIME=24h
REFRESH_TOKEN_KEY=your_refresh_token_key
REFRESH_TOKEN_TIME=7d
```

4. PostgreSQL ma'lumotlar bazasini yarating:
```bash
createdb nasiyasavdo_db
```

5. Migratsiyalarni ishga tushiring:
```bash
pnpm run migration:run
```

6. Loyihani ishga tushiring:
```bash
pnpm run start:dev
```

## API Documentation (Swagger)

API dokumentatsiyasini ko'rish uchun loyiha ishga tushgandan so'ng quyidagi URL ga kiring:
```
http://localhost:3000/api/docs
```

## API Endpointlar

### Authentication
- `POST /api/v1/auth/login` - Tizimga kirish
- `POST /api/v1/auth/register` - Ro'yxatdan o'tish
- `POST /api/v1/auth/refresh` - Access tokenni yangilash

### Debtor (Qarzdor)
- `POST /api/v1/debtors` - Yangi qarzdor qo'shish
- `GET /api/v1/debtors` - Barcha qarzdorlarni olish
- `GET /api/v1/debtors/:id` - Qarzdorni ID bo'yicha olish
- `PATCH /api/v1/debtors/:id` - Qarzdor ma'lumotlarini yangilash
- `POST /api/v1/debtors/upload/:id` - Qarzdor rasmini yuklash
- `POST /api/v1/debtors/phone` - Qarzdorga telefon raqam qo'shish
- `DELETE /api/v1/debtors/phone/:id` - Qarzdor telefon raqamini o'chirish

### Messages
- `POST /api/v1/messages` - Yangi xabar yuborish
- `GET /api/v1/messages` - Barcha xabarlarni olish
- `GET /api/v1/messages/:id` - Xabarni ID bo'yicha olish
- `DELETE /api/v1/messages/:id` - Xabarni o'chirish

## Ma'lumotlar modeli

### Debtor (Qarzdor)
```typescript
{
  id: UUID,
  full_name: string,
  phone_number: string,
  image: string,
  address: string,
  note: string,
  created_at: timestamp,
  updated_at: timestamp,
  is_active: boolean
}
```

### DebtorPhone (Qarzdor telefon raqamlari)
```typescript
{
  id: UUID,
  debtor_id: UUID,
  phone_number: string,
  is_active: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Message (Xabarlar)
```typescript
{
  id: UUID,
  debtor_id: UUID,
  message: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

## Postman Collection

Loyiha bilan birga `Nasiya_Savdo.postman_collection.json` fayli ham mavjud. API ni test qilish uchun:

1. Postman dasturini oching
2. Import -> File -> `Nasiya_Savdo.postman_collection.json` ni tanlang
3. Environmentni sozlang:
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: Login qilgandan keyin olingan JWT token

## Xavfsizlik

- Barcha endpointlar JWT authentication talab qiladi (login va register bundan mustasno)
- Tokenlar 24 soatdan keyin eskiradi
- Refresh token orqali yangi access token olish mumkin

## Error Handling

API barcha xatolarni quyidagi formatda qaytaradi:
```json
{
  "statusCode": number,
  "message": string,
  "error": string
}
```

## Transactional Operations

Barcha muhim operatsiyalar (create, update, delete) transactional ravishda bajariladi, ya'ni:
- Agar operatsiya muvaffaqiyatli bajarilsa, barcha o'zgarishlar saqlanadi
- Agar xatolik yuz bersa, barcha o'zgarishlar bekor qilinadi

## Test qilish

```bash
# unit testlarni ishga tushirish
pnpm run test

# e2e testlarni ishga tushirish
pnpm run test:e2e

# test qamrovini tekshirish
pnpm run test:cov
