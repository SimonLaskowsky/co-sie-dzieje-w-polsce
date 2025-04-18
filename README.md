# ⬜🟥 Co się dzieje w Polsce
Co sie dzieje w Polsce is a web application that aggregates legislative acts from external APIs, stores them in a database, and displays them as beautifully tiled summaries. Powered by Next.js for the frontend and Python (FastAPI) for the backend, it leverages OpenAI to generate concise, human-readable summaries of legal documents.

## 🔧 Features

- Centralized Storage: Collects and organizes legislative acts in a single database.  
- AI-Powered Summaries: Uses OpenAI to create clear, concise descriptions of each act.  
- Tiled Display: Presents laws as visually appealing tiles using Next.js.  
- Hourly Updates: Automatically fetches new or updated acts via a scheduled backend process.  
- Static Site Generation (SSG): Ensures fast, cost-efficient hosting with Next.js and Vercel.  

## 🧑‍💻 Tech Stack

- Frontend: Next.js (SSG with getStaticProps, ISR for hourly updates)  
- Backend: Python (FastAPI), SQLite (lightweight database)  
- AI: OpenAI SDK (GPT-4o-mini for cost-effective summarization)  
- Scheduling: APScheduler (hourly API polling)  
- Hosting: Vercel (frontend), Fly.io (backend, free tier)  

## 📧 Contact

For questions, reach out via GitHub Issues.

Built with ❤️ by the Co się dzieje w Polsce team.