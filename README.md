# To-Do Internship App

Full-stack React Native assignment built with:

- React Native CLI + TypeScript mobile app
- React + TypeScript web app for browser demo
- NestJS + TypeScript backend API
- MongoDB for task storage
- JWT authentication with bcrypt password hashing

## Features

- Email/password registration and login
- JWT token storage on mobile
- Create tasks with title, description, date-time, deadline, priority, and category
- View all tasks with status, deadline labels, and priority badges
- Mark tasks complete/incomplete
- Delete tasks
- Filter by all, pending, completed
- Smart sorting by completion status, priority, and deadline urgency

## Project Structure

```text
todo-internship-app/
  backend/   NestJS API
  web/       Browser demo frontend
  mobile/    React Native TypeScript app source
```

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run start:dev
```

Or from the project root:

```bash
npm run install:backend
npm run backend
```

## Web App Setup

Open a second terminal:

```bash
cd todo-internship-app
npm run install:web
npm run web
```

Then open:

```text
http://localhost:5173
```

Set `MONGODB_URI` in `.env`. Local MongoDB example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/todo_internship
JWT_SECRET=change_this_secret
PORT=3000
```

## Mobile Setup

Create a React Native CLI TypeScript project, then use the included `src/` and config files:

```bash
npx @react-native-community/cli init mobile --template react-native-template-typescript
cd mobile
npm install @react-navigation/native @react-navigation/native-stack @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens
```

For Android emulator, set the API URL in `src/api/client.ts`:

```ts
const API_BASE_URL = 'http://10.0.2.2:3000';
```

Then run:

```bash
npm run android
```

## API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/complete`

## Submission Checklist

- Push this repository to GitHub
- Add screenshots of login, task list, and add task screens
- Include a short demo video or APK if possible
- Mention bonus features: smart sorting, filters, category, overdue labels
