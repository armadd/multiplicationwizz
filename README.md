# Math Mania

Math Mania is an interactive web application designed to help users learn and practice multiplication tables in a fun and engaging way. Built with Next.js and TypeScript, this project offers a gamified approach to mastering basic math skills.

## Features

- Interactive multiplication quiz
- Progress tracking
- Memorization aids
- User authentication
- Responsive design

## Tech Stack

- Next.js 15.0.1
- React 18.3.1
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication
- Vercel Postgres for database
- Vercel KV for caching

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Vercel account (for deployment and database)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/math-mania.git
   cd math-mania
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   POSTGRES_URL=your_postgres_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run database migrations:
   ```
   npm run migrate
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Next.js app router pages and API routes
- `src/components`: React components
- `src/lib`: Utility functions and shared logic
- `scripts`: Database migration scripts

## Deployment

This project is designed to be deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
