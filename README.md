Full-stack Next.js Project with Convex
This is a full-stack Next.js project bootstrapped with create-next-app. It utilizes Convex as its database and backend, and integrates Clerk for authentication.

Features
This project includes the following core features:

Products
Categories
Types
Admin Console
Notes
Before running the project locally, please review the following resources:

Next.js Documentation – Learn about Next.js features and API.
Convex Documentation – Understand what Convex is and how it works.
Clerk Auth – A modern Next.js authentication tool.
Running the Project Locally
After cloning the repository, follow these steps to run the project locally:

Create Environment File

Create a .env file at the root of the project.
Visit the Clerk website to create an account and set up the required environment variables.
Visit the Convex website to create an account and set up the required environment variables.
Copy the values for NEXT_PUBLIC_CLERK_SIGN_IN_URL and NEXT_PUBLIC_CLERK_SIGN_UP_URL from the .env.example file into your .env file.
Install Dependencies

Choose your preferred package manager and install dependencies:

bash
Copy code
npm install
# or
yarn install
# or
pnpm install
# or
bun install
Start Convex Development Server

Start the Convex development server and sync the schema:

bash
Copy code
npx convex dev
Run the Local Development Server

Start the Next.js development server:

bash
Copy code
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
View in Browser

Open http://localhost:3000 in your browser to see the result.

Admin Sign-In

To sign in as an admin using your Clerk credentials, visit: http://localhost:3000/sign-in
