# SkillSync Frontend

Frontend web application for the SkillSync Academic Mentorship & Code Review Platform.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **TanStack Query**
- **React Router**
- **Axios**

## Features

- Modern responsive UI built with Tailwind CSS
- Role-based UI (Admin / Mentor / Student)
- Authentication flow with JWT (login/logout/session persistence)
- Mentor browsing and availability viewing
- Session booking interface (45-minute slots)
- Optimized server-state handling using TanStack Query
- Modular, feature-based architecture

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install Dependencies

```bash
npm install
````

### Run Locally

```bash
npm run dev
```

The app will run at:

```
http://localhost:5173
```

## Environment Variables

Create a `.env` file in the project root:

| Variable            | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL (e.g. [http://localhost:8080/api](http://localhost:8080/api)) |
| `VITE_APP_NAME`     | Application name                                                                   |

Example:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=SkillSync
```

## Project Structure

```
src/
├── assets/
├── components/
├── features/
│   ├── auth/
│   ├── mentor/
│   ├── student/
│   └── session/
├── hooks/
├── services/
├── lib/
├── routes/
├── styles/
├── App.tsx
└── main.tsx
```

## API Integration

The frontend communicates with the SkillSync backend REST API using Axios + TanStack Query.

Example API client:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

Example TanStack Query usage:

```ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const fetchMentors = async () => {
  const res = await api.get("/mentors");
  return res.data;
};

export const useMentors = () => {
  return useQuery({
    queryKey: ["mentors"],
    queryFn: fetchMentors,
  });
};
```

## Design Principles

* Feature-based architecture
* Separation of API, UI, and business logic
* Strong TypeScript typing across the app
* Scalable query management using TanStack Query
* Reusable and composable UI components
