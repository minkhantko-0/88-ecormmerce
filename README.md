This is a Full-stack [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), utilizing [Convex](https://convex.dev) as its database and backend.

## Features

This projects include following features at its core:

- Products
- Categories
- Types
- Admin Console


## Notes

Before trying to run this project locally, first you should look up on the following:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Convex Documention](https://docs.convex.dev/home) - what is Convex?
- [Clerk Auth](https://clerk.com) -a modern Next.js Authentication tool.


## Running the Project Locally

After cloning the project from this repository, you should do these steps before trying to run the project locally.

- create a `.env` file at the root folder. 
- go to [Clerk Website](https://clerk.com) to create an account and follow the instructions to set up env variables.
- go to [Convex Website](https://convex.dev) to create an account and follow the instructions to set up env variables.
- copy and paste `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` as provided in `.env.example` file.
- install dependencies
  ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
  ```
- start convex development server and sync schema by running
  ```bash
    npx convex dev
  ```
- then you can start the local development server by
  run the development server:
 ```bash
 npm run dev
 # or
 yarn dev
 # or
 pnpm dev
 # or
 bun dev
 ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To sign in as an admin using your clerk credentials, open [http://localhost:3000/sign-in](http://localhost:3000/sign-in) 
