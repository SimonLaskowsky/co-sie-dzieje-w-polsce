# Co się dzieje w Polsce? 🇵🇱

[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Not%20specified-lightgrey)]()

## 📋 Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## 🎯 Project Description

**Co się dzieje w Polsce?** (What's happening in Poland?) is a civic engagement
platform that delivers clear, accessible summaries of the most important laws
and regulations published in Poland. The system fetches legal act metadata from
the government API, generates simplified summaries using LLM models, and
presents them to users with links to original PDF documents.

### Key Features

- 🔄 **Automated Data Ingestion**: Twice-daily automated fetching of legal acts
  from government APIs
- 🤖 **AI-Powered Summaries**: LLM-generated summaries with adjustable verbosity
  (TL;DR / bullet points / detailed)
- 👤 **User Access Management**: Anonymous users get 3 free reads
  (localStorage-based), authenticated users have unlimited access
- 👮 **Admin Panel**: Content verification and editing capabilities for
  administrators
- 📊 **Voting Insights**: Information on how political parties voted (when
  available)
- ⚠️ **Quality Control**: Low-confidence summaries are flagged for manual review
- 📧 **Email Notifications**: Automated alerts for administrators about
  low-confidence content

### Problem Statement

Citizens often struggle to quickly understand which legal changes affect them
and how political parties vote on legislation. This platform addresses:

- **Low transparency** in the legislative process
- **Difficulty in making informed civic decisions**
- **Lack of trust** in information sources due to complexity

## 🛠 Tech Stack

### Frontend (Vercel)

- **[Next.js 15](https://nextjs.org/)** - React framework with hybrid SSG + API
  routes
- **[React 19](https://reactjs.org/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn UI](https://ui.shadcn.com/)** - Accessible component library
- **[Clerk](https://clerk.com/)** - Authentication and authorization (roles:
  user, admin)
- **[Prisma 6](https://www.prisma.io/)** - ORM for database access during build
  time
- **[Stripe](https://stripe.com/)** - Payment processing (future feature)
- **[SWR](https://swr.vercel.app/)** - React hooks for data fetching
- **[Recharts](https://recharts.org/)** - Charting library

### Backend (Seohost)

- **Python 3.10+** - Programming language
- **[OpenAI SDK](https://github.com/openai/openai-python)** - LLM integration
  for text generation
- **[Requests](https://requests.readthedocs.io/)** - HTTP client for government
  API
- **[psycopg2](https://www.psycopg.org/)** - PostgreSQL adapter
- **[Tenacity](https://tenacity.readthedocs.io/)** - Retry logic with backoff
- **[PyMuPDF](https://pymupdf.readthedocs.io/)** - PDF parsing
- **[LangChain](https://www.langchain.com/)** - LLM orchestration framework
- **smtplib** - Email notifications

### Database

- **[Neon DB](https://neon.tech/)** - Serverless PostgreSQL

### Development Tools

**Python:**

- Black - Code formatter
- isort - Import sorting
- Flake8 - Linting
- Mypy - Type checking
- Pylint - Additional linting
- Pre-commit - Git hooks

**JavaScript/TypeScript:**

- ESLint - JavaScript/TypeScript linting
- Prettier - Code formatter

### CI/CD & Hosting

- **GitHub Actions** - Continuous integration
- **Vercel** - Frontend hosting (SSG + serverless functions)
- **Seohost** - Backend hosting with cron jobs (2×/day)

### Architecture

The project uses a hybrid architecture optimized for cost-efficiency:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Python Script │─────▶│   Neon DB        │◀─────│   Next.js App   │
│   (Seohost)     │      │   (PostgreSQL)   │      │   (Vercel)      │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                                                    │
        │                                                    │
        └──────────────────────────────────────────────────┘
                    Webhook triggers rebuild
```

- **Frontend**: Static generation (SSG) 2×/day + API routes for admin actions
- **Backend**: Cron-triggered Python script for data ingestion and LLM
  processing
- **Communication**: Python script triggers Vercel rebuild webhook after
  ingestion

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js** 20+ (check `package.json` for exact version)
- **pnpm** 10+ (or npm/yarn)
- **Python** 3.10+
- **PostgreSQL** (or Neon DB connection)
- **Git**

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/co-sie-dzieje-w-polsce.git
cd co-sie-dzieje-w-polsce
```

#### 2. Backend Setup (Python)

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
cd backend/app
pip install -r requirements.txt

# Install development tools
cd ../..
make install-dev

# Set up environment variables
cp backend/app/.env.example backend/app/.env
# Edit .env with your configuration
```

**Required Environment Variables (Backend):**

```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=your_openai_key
SMTP_HOST=your_smtp_host
SMTP_PORT=587
ADMIN_EMAIL=admin@example.com
CONFIDENCE_THRESHOLD=0.5
VERCEL_DEPLOY_HOOK=https://api.vercel.com/...
```

#### 3. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
pnpm install  # or npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up Prisma
pnpm prisma generate
pnpm prisma db push  # or prisma migrate dev
```

**Required Environment Variables (Frontend):**

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### 4. Run the Development Servers

**Frontend:**

```bash
cd frontend
pnpm dev  # or npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Backend (Manual Test):**

```bash
source .venv/bin/activate
cd backend/app
python main.py
```

### Setting Up Pre-commit Hooks

```bash
# Backend Python hooks
.venv/bin/pre-commit install

# Run hooks manually on all files
.venv/bin/pre-commit run --all-files
```

## 📜 Available Scripts

### Frontend (Next.js)

Located in `frontend/` directory:

```bash
# Development server
pnpm dev              # Start Next.js dev server on port 3000

# Production build
pnpm build            # Build for production
pnpm start            # Start production server

# Code quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors automatically
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Database
pnpm prisma generate  # Generate Prisma client
pnpm prisma studio    # Open Prisma Studio GUI
```

### Backend (Python)

Located in root directory:

```bash
# Code quality (requires virtual environment)
make format           # Format code with Black and isort
make lint             # Run Flake8 linting
make type-check       # Run Mypy type checking
make check            # Run all checks (format + lint + type-check)

# Development tools installation
make install-dev      # Install development dependencies

# Run ingestion manually
cd backend/app
python main.py        # Run data ingestion pipeline
```

### Database Management

```bash
# Prisma commands (from frontend/)
pnpm prisma migrate dev       # Create and apply migrations
pnpm prisma migrate reset     # Reset database
pnpm prisma db push           # Push schema without migration
pnpm prisma studio            # Open database GUI
```

## 🎯 Project Scope

### MVP Features (Current)

✅ **User Features:**

- List view of legal acts with summaries
- Detailed view with full summaries and original PDF links
- Anonymous access with 3 free reads (localStorage-based)
- Optional user registration and authentication (Clerk)
- Unlimited reads for authenticated users
- Simple issue reporting (mailto link)

✅ **Admin Features:**

- Content editing via textarea interface
- Low-confidence content flagging and badges
- Email notifications for low-confidence summaries
- Admin API routes for content updates

✅ **Backend Features:**

- Automated data ingestion (2×/day via cron)
- Government API integration
- LLM-powered summary generation with verbosity control
- Idempotent pipeline with retry/backoff logic
- Reprocessing queue for failed items
- Confidence scoring and quality control

✅ **Infrastructure:**

- Static site generation (SSG) for performance
- CDN hosting on Vercel
- Serverless API routes for admin actions
- PostgreSQL database (Neon DB)

### Future Enhancements (Post-MVP)

🔜 **Planned Features:**

- Premium subscription system with payment integration
- Advanced personalization and recommendations
- Social media content generation
- Full-text search with vector database
- Enhanced analytics dashboard
- Mobile application
- Push notifications
- User comments and discussions

### Technical Limitations (MVP)

⚠️ **Known Limitations:**

- **Access Control**: localStorage-based limits are easy to bypass (acceptable
  for MVP)
- **Data Freshness**: Content updates only 2×/day via cron (acceptable for MVP)
- **Admin Changes**: Require full site rebuild (~2-5 minutes) (acceptable for
  MVP)
- **PDF Storage**: Only links stored, not full documents (cost optimization)
- **Vote Data**: Not available for all acts (API limitation)

## 📊 Project Status

**Current Version:** 0.1.0 (MVP)

**Branch:** `feat/mvp`

**Status:** 🚧 **In Active Development**

### Roadmap

- [x] Project setup and architecture
- [x] Backend ingestion pipeline
- [x] LLM integration with OpenAI
- [x] Frontend basic layout and components
- [x] Clerk authentication integration
- [x] Admin panel for content editing
- [ ] Production deployment to Vercel
- [ ] Cron job setup on Seohost
- [ ] Testing and QA
- [ ] MVP launch
- [ ] User feedback collection
- [ ] Premium features (subscription system)

### Success Metrics

**Technical Metrics:**

- Ingestion success rate: Target >95%
- Average response time: Target <2s
- Low-confidence rate: Monitor trend

**Business Metrics:**

- Daily Active Users (DAU)
- Anonymous to registered conversion rate
- Average time on site
- Number of acts read per user

## 📄 License

License not yet specified. All rights reserved.

---

## 🤝 Contributing

This is currently a private project. Contribution guidelines will be added when
the project becomes open source.

## 📞 Contact

For questions or issues, please contact the project maintainers.

## 🙏 Acknowledgments

- Government of Poland for providing open legal data APIs
- OpenAI for LLM technology
- The open-source community for the amazing tools and frameworks

---

**Built with ❤️ for Polish citizens**
