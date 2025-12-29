# PATH

This is the GitHub repository for the web app created for [PATH](https://epath.org/) by [LA Blueprint](https://lablueprint.org/).

## Setup

For Windows users, make sure to install and set up [WSL](https://learn.microsoft.com/en-us/windows/wsl/).

Install and set up [Docker Desktop](https://docs.docker.com/desktop).

Clone the GitHub repo and install the required packages.

```console
$ git clone https://github.com/lablueprint/path.git
$ cd path
$ npm install
```

## Starting the Local Database

With Docker Desktop running in the background, start the local database instance.

```console
$ npx supabase start
```

Copy the publishable key and the API URL from the terminal output. Create an `.env.local` file in the root directory of the project and add the values to the file.

```text
NEXT_PUBLIC_SUPABASE_URL=<API URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>
```

Open [http://localhost:54323](http://localhost:54323/) with your browser to view the local database with Supabase Studio.

## Running the Web App

Run the web app.

```console
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application locally.

## Stopping the Local Database

Stop the local database instance.

```console
$ npx supabase stop
```
