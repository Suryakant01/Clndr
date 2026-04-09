# Clndr 📅

A sleek, interactive **wall-calendar style** React application.  
Clndr combines clean design with practical features like date-range selection, monthly notes, customizable visuals, and responsive layouts.

---

## ✨ Features

- **Interactive Calendar Grid**  
  Intuitive date selection with range highlighting and hover feedback.

- **Dynamic Hero Images**  
  Automatically updates seasonal images per month. Users can upload custom images (stored locally).

- **Monthly Notes**  
  Built-in scratchpad for each month — add, toggle (strike-through), and delete notes.

- **Responsive 3D Flip UI**  
  - Desktop: Side-by-side layout  
  - Mobile: Smooth 3D card flip between calendar and notes

---

## 🛠️ Tech Stack

- **React 19 + Vite**  
  Fast build tooling with modern React capabilities.

- **Tailwind CSS v4**  
  Utility-first styling for rapid UI development and custom calendar aesthetics.

- **Framer Motion**  
  Handles animations like 3D card flips and layout transitions.

- **date-fns**  
  Lightweight, modular date utilities for calendar logic and calculations.

- **Calendarific API**  
  Provides real-time holiday and festival data.

- **Local Storage**  
  Persists user data (images and notes) entirely on the client — no backend required.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd suryakant01-clndr
```

### 2. Install dependencies
```bash
npm i
```

### 3. Set up Environment Variables
Clndr uses the Calendarific API to load festival data. 
Create a `.env` file in the root of the project and add your API key:
```env
VITE_CALENDARIFIC_API_KEY=your_api_key_here
```
*(Note: You can get a free API key from [calendarific.com](https://calendarific.com/). If you don't provide an API key, the calendar will still function perfectly, but festivals won't populate).*

### 4. Start the Development Server
```bash
npm run dev
```

### 5. Open the App
Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## 📦 Build for Production

To create a production-ready build:
```bash
npm run build
```
You can then preview the built application locally using:
```bash
npm run preview
```
