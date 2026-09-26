# How to Manage Your Portfolio Projects

This guide explains how to add, edit, or remove projects in your portfolio.

## 1. Local Data Management (Recommended)

All project data is stored in `src/data/projects.ts`. This is the easiest way to manage your portfolio without needing a complex backend.

### Adding a New Project
1. Open `src/data/projects.ts`.
2. Scroll to the end of the `projectsData` array.
3. Copy an existing project object and paste it below.
4. Update the `slug` (ensure it's unique), `title`, `fullDesc`, and other details.

### Changing Images
We use **Unsplash** for high-quality engineering stock photos. To change an image:
1. Go to [Unsplash.com](https://unsplash.com/).
2. Search for terms like "Thermal Engineering", "Data Center", "CPU", or "Mechanical Design".
3. Right-click the image and select "Copy Image Address".
4. Replace the `image` or `specs[].image` URL in `projectsData` with your new link.
   - **Tip:** Add `?auto=format&fit=crop&q=80&w=1200` to the end of Unsplash URLs to optimize performance.

### Adding More Detail Images
The "Technical Deep Dive" timeline automatically supports images. Each entry in the `specs` array can have an optional `image` property:

```typescript
specs: [
  { 
    title: 'Your Feature Name', 
    text: 'Description of the engineering challenge...',
    image: 'https://images.unsplash.com/...' // Your image URL here
  },
  // ... more specs
]
```

---

## 2. Dynamic Management (Firebase)

We have already provisioned a **Firebase Firestore** database for you. 

### Why use Firebase?
If you want to manage projects from a dashboard without touching code, you can transition this app to fetch from Firestore.

### Current Setup:
- **Firestore Region:** asia-south1
- **Database initialized:** See `src/lib/firebase.ts`
- **Rules Deployed:** Secure public-read, private-write rules are active.

### How to transition to dynamic data:
1. Create a "projects" collection in your [Firebase Console](https://console.firebase.google.com/).
2. Import your static JSON data into Firestore.
3. Update `src/components/ProjectDetail.tsx` to use `getDoc(doc(db, 'projects', id))` instead of searching the local array.

---

## 3. Sharing with Recruiters

### Firebase Hosting
Your app is already configured for high-performance hosting via the AI Studio preview environment. 
- **Share Link:** Click the "Share" button in the AI Studio top bar to get a permanent link for your resume.
- **Custom Domain:** You can export this project to GitHub and connect it to Vercel or Netlify for a custom `.com` domain.
