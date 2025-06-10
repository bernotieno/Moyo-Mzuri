# Moyo Mzuri - Social Projects Donation Platform

**Moyo Mzuri** (meaning "Good Heart" in Swahili) is a modern donation platform built with SvelteKit that enables communities to support meaningful social projects through secure M-Pesa payments.

## 🌟 Features

### Public Features
- **Project Discovery**: Browse active social projects with detailed descriptions and funding goals
- **Secure Donations**: Make donations using M-Pesa STK Push integration
- **Real-time Updates**: Live tracking of donation progress and project funding status
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Progress Tracking**: Visual progress bars showing funding milestones

### Admin Dashboard
- **Project Management**: Create, edit, and manage social projects
- **Donation Tracking**: Monitor all donations with detailed transaction history
- **Analytics**: View donation statistics and project performance
- **Secure Access**: Password-protected admin interface
- **Real-time Data**: Live updates of donation status and project totals

### Technical Features
- **M-Pesa Integration**: Full STK Push implementation for seamless payments
- **Database Management**: SQLite with Drizzle ORM for reliable data storage
- **File Upload**: Image upload functionality for project photos
- **API-First**: RESTful API design for easy integration
- **Modern Stack**: Built with SvelteKit 2.0, TailwindCSS 4.0, and modern JavaScript

## 🏗️ Architecture

### Technology Stack
- **Frontend**: SvelteKit 2.0 with Svelte 5
- **Styling**: TailwindCSS 4.0 with custom components
- **Database**: SQLite with Drizzle ORM
- **Payment**: M-Pesa Daraja API integration
- **Deployment**: Node.js compatible (Vercel, Netlify, etc.)

### Database Schema

#### Projects Table
- `id` - Primary key (auto-increment)
- `title` - Project name
- `description` - Detailed project description
- `targetAmount` - Funding goal amount
- `totalRaised` - Current amount raised
- `imageUrl` - Project image URL
- `isActive` - Project status (active/inactive)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### Donations Table
- `id` - Primary key (auto-increment)
- `projectId` - Foreign key to projects
- `amount` - Donation amount
- `phoneNumber` - Donor's phone number
- `mpesaReceiptNumber` - M-Pesa transaction receipt
- `mpesaTransactionId` - M-Pesa transaction ID
- `status` - Transaction status (pending/completed/failed)
- `createdAt` - Creation timestamp
- `completedAt` - Completion timestamp

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- M-Pesa Daraja API credentials (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bernotieno/Moyo-Mzuri.git
   cd Moyo-Mzuri
   ```

2. **Navigate to the project directory**
   ```bash
   cd moyo-mzuri
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the moyo-mzuri directory and this content to it:
   ```env
   # Database
   DATABASE_URL="file:storage/storage.db"
   
   # M-Pesa Configuration
   MPESA_ENVIRONMENT="sandbox"
   MPESA_CONSUMER_KEY="your_consumer_key"
   MPESA_CONSUMER_SECRET="your_consumer_secret"
   MPESA_BUSINESS_SHORT_CODE="your_shortcode"
   MPESA_PASSKEY="your_passkey"
   MPESA_CALLBACK_URL="https://yourdomain.com/api/mpesa/callback"
   
   # Admin Configuration
   ADMIN_PASSWORD="your_secure_admin_password"
   
   # App Configuration (Optional)
   PUBLIC_APP_NAME="Moyo Mzuri"
   PUBLIC_APP_DESCRIPTION="Supporting social projects in our community"
   ```

5. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📱 How It Works

### For Donors (Public Interface)

1. **Browse Projects**: Visit the homepage to see all active social projects
2. **Select Project**: Click on any project card to view details
3. **Make Donation**: 
   - Click "Donate Now" button
   - Enter donation amount and M-Pesa phone number
   - Confirm payment on your phone when prompted
   - Receive confirmation once payment is processed

### For Administrators

1. **Access Admin Panel**: Navigate to `/admin` and login with admin password
2. **Manage Projects**:
   - Create new projects with title, description, target amount, and image
   - Edit existing project details
   - Activate/deactivate projects
3. **Monitor Donations**:
   - View all donations across all projects
   - Track payment status and transaction details
   - Export donation data for reporting

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio

# Code Quality
npm run format       # Format code with Prettier
npm run lint         # Lint code with ESLint
```

### Project Structure

```
Moyo-Mzuri/
├── moyo-mzuri/                  # Main application directory
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/      # Reusable Svelte components
│   │   │   │   ├── DonationModal.svelte
│   │   │   │   ├── ProjectCard.svelte
│   │   │   │   ├── LoadingSpinner.svelte
│   │   │   │   └── ThemeToggle.svelte
│   │   │   ├── server/
│   │   │   │   ├── db/          # Database configuration
│   │   │   │   │   ├── index.js # Database connection
│   │   │   │   │   └── schema.js# Database schema
│   │   │   │   └── mpesa.js     # M-Pesa API integration
│   │   │   ├── stores/          # Svelte stores
│   │   │   └── utils/           # Utility functions
│   │   ├── routes/
│   │   │   ├── admin/           # Admin dashboard routes
│   │   │   │   ├── projects/    # Project management
│   │   │   │   ├── donations/   # Donation management
│   │   │   │   └── login/       # Admin authentication
│   │   │   ├── api/             # API endpoints
│   │   │   │   ├── projects/    # Project CRUD operations
│   │   │   │   ├── donations/   # Donation management
│   │   │   │   └── mpesa/       # M-Pesa integration
│   │   │   ├── +layout.svelte   # Main layout
│   │   │   └── +page.svelte     # Homepage
│   │   ├── app.html             # HTML template
│   │   └── app.css              # Global styles
│   ├── static/                  # Static assets
│   ├── drizzle.config.js       # Database configuration
│   ├── package.json            # Dependencies and scripts
│   ├── svelte.config.js        # SvelteKit configuration
│   └── vite.config.js          # Vite configuration
├── README.md                   # This file
└── LICENSE                     # License file
```

### API Endpoints

#### Projects API
- `GET /api/projects` - Fetch all active projects
- `POST /api/projects` - Create new project (admin only)
- `PUT /api/projects` - Update project (admin only)
- `DELETE /api/projects` - Delete project (admin only)

#### Donations API
- `GET /api/donations` - Fetch donations (with optional project filter)
- `POST /api/donations` - Create donation record
- `PUT /api/donations` - Update donation status

#### M-Pesa API
- `POST /api/mpesa/stk-push` - Initiate STK Push payment
- `POST /api/mpesa/callback` - Handle M-Pesa payment callbacks
- `POST /api/mpesa/query` - Query payment status

#### Admin API
- `POST /admin/login` - Admin authentication
- `POST /admin/logout` - Admin logout

## 🔐 Security Features

- **Admin Authentication**: Password-protected admin access with secure cookies
- **Input Validation**: Comprehensive validation for all user inputs
- **SQL Injection Protection**: Parameterized queries using Drizzle ORM
- **CSRF Protection**: Built-in SvelteKit CSRF protection
- **Secure Headers**: Production-ready security headers
- **Environment Variables**: Sensitive data stored in environment variables

## 💳 M-Pesa Integration

The platform integrates with Safaricom's M-Pesa Daraja API for secure mobile payments:

### Features
- **STK Push**: Automatic payment prompts sent to donor's phone
- **Real-time Callbacks**: Instant payment confirmation
- **Transaction Tracking**: Complete audit trail of all transactions
- **Sandbox Support**: Full testing environment support

### Setup Requirements
1. Register for M-Pesa Daraja API access
2. Obtain Consumer Key and Consumer Secret
3. Configure Business Short Code and Passkey
4. Set up callback URL for payment notifications

## 🎨 Customization

### Theming
- Built with TailwindCSS for easy customization
- Dark/light theme support with system preference detection
- Responsive design optimized for all devices
- Custom color schemes and branding support


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
