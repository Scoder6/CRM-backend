# CRM Backend

A Node.js backend API for the CRM application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crm-pro #Replace it with your actual mongodb srv
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=24h
```

3. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`
