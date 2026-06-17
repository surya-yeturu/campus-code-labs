# Learnovate

**Innovation Through Learning**

A fully automated MERN stack Internship Management & Certification Platform.

## Features

- Student registration & JWT authentication
- 8 internship courses with enrollment flow
- Razorpay payment integration with webhooks
- Automatic offer letter PDF generation & email
- Internship completion form with auto certificate generation
- QR code certificate verification
- Admin dashboard with analytics
- Premium EdTech UI with dark mode

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
| Payments | Razorpay |
| Email | Nodemailer |
| PDF | PDFKit |
| Storage | Cloudinary |

## Project Structure

```
startup/
├── client/          # React frontend
├── server/          # Express API
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Razorpay test keys
- Cloudinary account (optional for PDF storage)
- SMTP credentials (optional — emails log to console without SMTP)

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run seed    # Seeds courses + admin user
npm run dev
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

### Default Admin Login

- Email: `admin@learnovate.com`
- Password: `Admin@123456`

### Email setup (required for approval/welcome emails)

Emails are **not sent** until you configure a provider in `server/.env`.

**Option A — Resend (recommended)**

1. Create a free account at [resend.com](https://resend.com)
2. Copy your API key → set `RESEND_API_KEY=re_xxxx` in `server/.env`
3. For testing, use `EMAIL_FROM=Campus Code Labs <onboarding@resend.dev>`
4. Restart the server (`npm run dev`)

> Resend test mode only delivers to the email you signed up with until you verify a domain.

**Option B — Gmail SMTP**

1. Enable 2FA on your Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Set in `server/.env`:
   ```
   SMTP_USER=your@gmail.com
   SMTP_PASS=your_16_char_app_password
   EMAIL_FROM=Campus Code Labs <your@gmail.com>
   ```
4. Restart the server

Without either option, emails are logged to the **server console** only (mock mode).

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret for JWT signing |
| RAZORPAY_KEY_ID | Razorpay key |
| RAZORPAY_KEY_SECRET | Razorpay secret |
| CLOUDINARY_* | Cloudinary credentials |
| SMTP_* | Email configuration |
| RESEND_API_KEY | Resend API key (recommended for email) |
| EMAIL_FROM | Sender address for emails |
| CLIENT_URL | Frontend URL for QR codes & emails |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |
| VITE_RAZORPAY_KEY_ID | Razorpay public key |

## User Flow

1. **Register** → Welcome email
2. **Browse courses** → Apply for internship
3. **Pay via Razorpay** → Offer letter auto-generated & emailed
4. **Complete internship** → Submit completion form
5. **Certificate** → Auto-generated with QR, emailed
6. **Verify** → Anyone can verify at `/verify/:certificateId`

## Deployment

### Frontend (Vercel)

1. Push `client/` to GitHub
2. Import project in Vercel
3. Root directory: `client`
4. Build: `npm run build`
5. Output: `dist`
6. Env: `VITE_API_URL=https://your-api.onrender.com/api`

### Backend (Render)

1. Create Web Service from `server/`
2. Build: `npm install`
3. Start: `npm start`
4. Add all env variables from `.env.example`
5. Set `CLIENT_URL` to your Vercel URL

### MongoDB Atlas

1. Create free cluster
2. Add database user & whitelist IP (0.0.0.0/0 for cloud)
3. Copy connection string to `MONGODB_URI`
4. Run seed on production: `npm run seed`

### Razorpay Webhook

Set webhook URL: `https://your-api.onrender.com/api/payments/webhook`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register student |
| POST | /api/auth/login | Login |
| GET | /api/courses | List courses |
| POST | /api/internships | Create application |
| POST | /api/payments/create-order | Create Razorpay order |
| POST | /api/payments/verify | Verify payment |
| POST | /api/certificates/complete | Submit completion |
| GET | /api/certificates/verify/:id | Verify certificate |
| GET | /api/admin/stats | Admin analytics |

## Testing Tips

- Use Razorpay test mode cards for payments
- Set internship end date in the past to test completion flow
- Without Cloudinary, PDFs still generate but may use fallback URLs
- Without SMTP, check server console for email mock logs

## License

MIT
