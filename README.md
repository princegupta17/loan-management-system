# Loan Management System

Full-stack Loan Management System

## 1. Seed Script

Run:

```bash
cd backend
npm run seed
```

Seeded credentials:

| Role         | Email                | Password     |
| ------------ | -------------------- | ------------ |
| Admin        | admin@lms.com        | Password@123 |
| Sales        | sales@lms.com        | Password@123 |
| Sanction     | sanction@lms.com     | Password@123 |
| Disbursement | disbursement@lms.com | Password@123 |
| Collection   | collection@lms.com   | Password@123 |
| Borrower     | borrower@lms.com     | Password@123 |

## 2. Env Example

Backend `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/loan_management_system
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Frontend `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 3. Run Steps

1. Start MongoDB locally.
2. Install backend dependencies:

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

4. Open `http://localhost:3000`.

## 4. Testing Flow

1. Borrower logs in or signs up.
2. Submit invalid personal details to verify BRE rejection:
   - age outside 23-50
   - salary below Rs. 25,000
   - invalid PAN
   - employment mode `Unemployed`
3. Submit valid personal details:
   - PAN example: `ABCDE1234F`
   - employment: `Salaried` or `Self-Employed`
4. Upload salary slip as PDF, JPG, or PNG under 5 MB.
5. Use loan sliders to select amount and tenure; verify live simple-interest calculation.
6. Apply for loan; status becomes `APPLIED`.
7. Login as Sanction and approve or reject an applied loan.
8. Login as Disbursement and mark sanctioned loan as `DISBURSED`.
9. Login as Collection and record payments:
   - duplicate UTR is rejected
   - zero or negative amount is rejected
   - overpayment is rejected
   - exact final payment auto-closes the loan
10. Login as Borrower and verify loan status, paid amount, and outstanding balance.
