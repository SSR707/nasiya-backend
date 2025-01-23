# Nasiya Savdo - Qarzlarni boshqarish tizimi

Bu loyiha do'konlar uchun qarzlarni boshqarish tizimi hisoblanadi. Do'konlar o'z mijozlarining qarzlarini oson boshqarishi va kuzatib borishi mumkin.

## Texnologiyalar

- NestJS (Backend framework)
- TypeScript
- PostgreSQL (Ma'lumotlar bazasi)
- TypeORM (ORM)

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
API_PORT=3010
NODE_ENV=dev
DEV_DB_URL=postgres://postgres:postgres@127.0.0.1:5432/nasiyasavdo_db
PROD_DB_URL=postgres://postgres:postgres@127.0.0.1:5432/nasiyasavdo_db
```

4. PostgreSQL ma'lumotlar bazasini yarating:
```bash
createdb nasiyasavdo_db
```

5. Loyihani ishga tushiring:
```bash
pnpm run start:dev
```

## API Endpointlar

### Store (Do'kon)

- `POST /api/v1/store` - Yangi do'kon qo'shish
- `GET /api/v1/store` - Barcha do'konlarni olish
- `GET /api/v1/store/:id` - Bitta do'konni ID bo'yicha olish
- `PATCH /api/v1/store/:id` - Do'kon ma'lumotlarini yangilash
- `DELETE /api/v1/store/:id` - Do'konni o'chirish

### Debt (Qarz)

- `POST /api/v1/debt` - Yangi qarz qo'shish
- `GET /api/v1/debt` - Barcha qarzlarni olish
- `GET /api/v1/debt/:id` - Bitta qarzni ID bo'yicha olish
- `PATCH /api/v1/debt/:id` - Qarz ma'lumotlarini yangilash
- `DELETE /api/v1/debt/:id` - Qarzni o'chirish

## Ma'lumotlar modeli

### Store (Do'kon)
- `id`: UUID
- `login`: string (do'kon nomi)
- `hashed_password`: string
- `wallet`: decimal (do'kon hisobi)
- `image`: string (do'kon rasmi)
- `is_active`: boolean

### Debtor (Qarzdor)
- `id`: UUID
- `full_name`: string
- `phone_number`: string
- `image`: string
- `address`: string
- `note`: string
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean

### Debt (Qarz)
- `id`: UUID
- `debtor`: Debtor (qarzdor)
- `debt_date`: timestamp
- `debt_period`: enum (qarz muddati)
- `debt_sum`: decimal (qarz summasi)
- `description`: string (izoh)

## Ishga tushirish

Loyiha http://localhost:3010 portida ishga tushadi. API endpointlarni test qilish uchun Postman yoki boshqa HTTP client dasturidan foydalanishingiz mumkin.
