# Campus Code Labs (Learnovate)

**Innovation Through Learning**

A MERN stack internship management and certification platform for students.

## Features

- Public internship application (no login required)
- Manual UPI/bank payment with admin verification
- Automatic offer letter PDF generation & email
- Certificate PDF generation with embedded QR code
- Google Drive storage for certificates (optional)
- Public certificate verification via QR scan or ID lookup
- Admin dashboard for applications, payments, and certificates
- Premium EdTech UI with dark mode

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt (admin only) |
| Payments | Manual UTR + screenshot verification |
| Email | Nodemailer |
| PDF | PDFKit |
| Storage | Google Drive (certificates) / Supabase / local uploads |

## Project Structure

```
campus-code-labs/
├── client/          # React frontend
├── server/          # Express API
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Cloud service account (optional — for certificate storage on Drive)
- SMTP credentials (optional — emails log to console without SMTP)

### 1. Backend

```bash
cd server
# Edit .env with your credentials
npm install
npm run seed    # Seeds courses + admin user
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

### Default Admin Login



## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret for JWT signing |
| GOOGLE_DRIVE_* | Google Drive service account (certificates) |
| SMTP_* | Email configuration |
| EMAIL_FROM | Sender address for emails |
| CLIENT_URL | Frontend URL for QR codes & emails |
| SERVER_URL | Backend URL for absolute file links |

## User Flow

1. **Browse internships** → Student selects a program at `/internships`
2. **Apply** → Fills form at `/apply/:slug` (name, college, dates, project, resume)
3. **Pay manually** → UPI/bank transfer at `/apply/payment/:applicationId` with UTR + screenshot
4. **Admin verifies** → Admin approves payment in dashboard
5. **Auto-issued** → Offer letter + certificate PDF generated, emailed, stored on Drive
6. **Verify** → QR on certificate links to `/verify/:certificateId?open=certificate`

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
4. Add all env variables to `server/.env`
5. Set `CLIENT_URL` to your Vercel URL

## Deployment checklist

### Backend (Render / Railway / VPS)

1. Set `NODE_ENV=production`
2. Set a strong `JWT_SECRET` (32+ random characters)
3. Set `CLIENT_URL` to your live frontend URL (comma-separate multiple origins if needed)
4. Set `SERVER_URL` to your live API URL
5. Configure MongoDB, SMTP, and Google Drive env vars
6. Run `npm run seed` once on first deploy

### Frontend (Vercel / Netlify)

1. Set `VITE_API_URL=https://your-api.example.com/api`
2. Build command: `npm run build` (from `client/` folder)
3. Output directory: `dist`

### Security (already in codebase)

- Helmet security headers
- MongoDB query sanitization (NoSQL injection protection)
- Rate limits on login, applications, and payment submissions
- Input validation on application and login routes
- Regex escaping on admin search fields
- Stack traces hidden in production errors
- JWT secret enforced in production startup

## License

MIT
