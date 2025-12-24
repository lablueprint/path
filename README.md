# PATH

This is the GitHub repository for the web app created for [PATH](https://epath.org/) by [LA Blueprint](https://lablueprint.org/).

## Setup

Clone the GitHub repo and install the required packages.

```bash
git clone https://github.com/lablueprint/path.git
cd path
npm install
```

Follow the [official guide](https://docs.docker.com/desktop) to install and configure Docker Desktop.

For MacOS users:

![MacOS Docker configuration](https://supabase.com/docs/_next/image?url=%2Fdocs%2Fimg%2Fguides%2Fcli%2Fdocker-mac.png&w=3840&q=75)

For Windows users:

![Windows Docker configuration](https://supabase.com/docs/_next/image?url=%2Fdocs%2Fimg%2Fguides%2Fcli%2Fdocker-win.png&w=3840&q=75)

For Windows users, make sure to install and set up WSL.

## Starting the Local Database

Start the local database instance.

```bash
npx supabase start
```

Copy the publishable key and the API URL from the terminal output. Create an `.env.local` file in the root directory of the project and add the values to the file.

```text
NEXT_PUBLIC_SUPABASE_URL=<API URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>
```

Open [http://localhost:54323](http://localhost:54323/) with your browser to view the local database with Supabase Studio.

## Running the Web App

Run the web app.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application locally.

## Stopping the Local Database

Stop the local database instance.

```bash
npx supabase stop
```
