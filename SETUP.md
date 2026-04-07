# Saviour Mechatronics — Setup Guide

## Quick Start

```bash
# Install dependencies (already done)
npm install

# Reset database and re-seed with sample data
npx prisma migrate reset --force

# Start development server
npm run dev
```

Open http://localhost:3000

## Configuration

Edit `.env` to configure:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
WHATSAPP_NUMBER="256755888945"   # Your WhatsApp business number (no + prefix)
SELLER_NAME="Saviour Mechatronics"
```

## Admin Access

- URL: http://localhost:3000/admin
- Email: admin@saviour.com
- Password: admin123

**Change these credentials in production** — use Prisma Studio to update the password hash.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── (public)/                   # Public storefront
│   │   ├── layout.tsx              # Header + Footer wrapper
│   │   ├── products/               # Product catalog + search
│   │   ├── product/[slug]/         # Product detail page
│   │   ├── category/[slug]/        # Category listing
│   │   ├── cart/                   # Shopping cart
│   │   ├── inquiry/                # Inquiry checkout form
│   │   ├── inquiry/success/        # Success + WhatsApp redirect
│   │   ├── about/
│   │   └── contact/
│   ├── admin/                      # Admin panel
│   │   ├── layout.tsx              # Sidebar layout (auth-protected)
│   │   ├── page.tsx                # Dashboard
│   │   ├── products/               # Product CRUD
│   │   ├── categories/             # Category management
│   │   ├── brands/                 # Brand management
│   │   └── inquiries/              # Inquiry tracking
│   └── api/v1/                     # REST API
│       ├── categories/
│       ├── brands/
│       ├── products/
│       ├── inquiries/              # POST creates inquiry + WhatsApp URL
│       └── admin/                  # Protected admin endpoints
├── components/
│   ├── ui/                         # Button, Input, Badge, Card etc.
│   ├── layout/                     # Header, Footer, AdminSidebar
│   ├── catalog/                    # ProductCard, StockBadge, PriceDisplay
│   └── admin/                      # ProductForm, SessionProvider
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # NextAuth configuration
│   ├── whatsapp.ts                 # WhatsApp message generation
│   └── utils.ts                    # formatPrice, slugify, etc.
└── store/
    └── cart.ts                     # Zustand cart store (persisted)
```

## Key Business Logic

### Inquiry Flow
1. Customer fills inquiry form at `/inquiry`
2. POST to `/api/v1/inquiries` saves the inquiry to database FIRST
3. API returns `whatsapp_url` with pre-filled message
4. Customer is redirected to success page + WhatsApp opens

### WhatsApp Message Format
Defined in `src/lib/whatsapp.ts` — generates:
```
Hello Saviour Mechatronics,

I would like to request the following mechatronics components:

1. Arduino Uno R3
   SKU: MCU-001
   Quantity: 2

Customer Name: John Doe
Phone: 0755888945
Location: Kampala
Delivery Method: Pickup from store

Inquiry Reference: INQ-20260403-12345

Please confirm stock availability, final pricing, and shipping details.
```

### Price Visibility Modes
- `show_exact_price` → shows UGX amount
- `show_starting_from` → shows "From UGX X"
- `hide_price_request_quote` → shows "Request Quote" badge

### Stock Statuses
- `in_stock` (green)
- `limited_availability` (amber)
- `available_on_order` (blue)
- `out_of_stock` (red — blocks add to cart)

## Database Commands

```bash
npx prisma studio          # Visual database browser
npx prisma migrate reset   # Reset + reseed
npx prisma db push         # Push schema without migration
```

## Production Deployment Notes

1. Change `NEXTAUTH_SECRET` to a strong random string
2. Change admin password via Prisma Studio or a script
3. Replace `WHATSAPP_NUMBER` with your real business number
4. Configure `DATABASE_URL` for a production database (SQLite or PostgreSQL)
5. Enable image optimization with a CDN or cloud storage for product images
