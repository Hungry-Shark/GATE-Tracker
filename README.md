<div align="center">

# <span style="font-family: 'Kregan', 'Space Grotesk', sans-serif; font-size: 3em; font-weight: 700; background: linear-gradient(135deg, #f97316, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">GATE Tracker</span>

### <span style="font-family: 'JetBrains Mono', monospace; color: #9ca3af;">Redefining the Future of GATE Preparation Tracking and Accountability</span>

---

</div>

<div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 2rem; border-radius: 1rem; border: 1px solid #374151; margin: 2rem 0;">

## <span style="color: #f97316; font-family: 'JetBrains Mono', monospace;">📋 Overview</span>

<span style="color: #d1d5db; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; line-height: 1.6;">
GATE Tracker is a next-generation accountability and progress tracking platform designed specifically for GATE 2026 aspirants. Built with cutting-edge technology, it empowers students with greater control, progress tracking, and study efficiency while providing educators with powerful tools to monitor and guide student progress.
</span>

</div>

---

<div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 2rem; border-radius: 1rem; border: 1px solid #374151; margin: 2rem 0;">

## <span style="color: #f59e0b; font-family: 'JetBrains Mono', monospace;">✨ Features</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">

<div style="background: #1f2937; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #374151;">
<h3 style="color: #f97316; font-family: 'JetBrains Mono', monospace; margin-top: 0;">🎯 Student Features</h3>
<ul style="color: #d1d5db; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; line-height: 1.8;">
<li>Personal study dashboard</li>
<li>Task management & tracking</li>
<li>Progress analytics & heatmaps</li>
<li>XP system & achievements</li>
<li>Reward redemption</li>
<li>Subject-wise progress tracking</li>
</ul>
</div>

<div style="background: #1f2937; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #374151;">
<h3 style="color: #f59e0b; font-family: 'JetBrains Mono', monospace; margin-top: 0;">👨‍🏫 Admin Features</h3>
<ul style="color: #d1d5db; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; line-height: 1.8;">
<li>Student management</li>
<li>Task assignment</li>
<li>Progress monitoring</li>
<li>Token-based access control</li>
<li>Real-time updates</li>
<li>Analytics dashboard</li>
</ul>
</div>

</div>

</div>

---

<div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 2rem; border-radius: 1rem; border: 1px solid #374151; margin: 2rem 0;">

## <span style="color: #f97316; font-family: 'JetBrains Mono', monospace;">🚀 Quick Start</span>

<div style="background: #0d1117; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #30363d; margin-top: 1rem;">

### <span style="color: #f59e0b; font-family: 'JetBrains Mono', monospace;">Prerequisites</span>

<span style="color: #c9d1d9; font-family: 'JetBrains Mono', monospace; font-size: 0.9em;">
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Git
</span>

</div>

<div style="background: #0d1117; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #30363d; margin-top: 1rem;">

### <span style="color: #f59e0b; font-family: 'JetBrains Mono', monospace;">Installation</span>

```bash
# Clone the repository
git clone <repository-url>
cd GATE-Tracker

# Install dependencies
npm install

# Create .env file with Firebase credentials
cp .env.example .env
# Add your Firebase config to .env

# Run development server
npm run dev
```

</div>

</div>

---

<div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 2rem; border-radius: 1rem; border: 1px solid #374151; margin: 2rem 0;">

## <span style="color: #f97316; font-family: 'JetBrains Mono', monospace;">⚙️ Configuration</span>

<div style="background: #0d1117; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #30363d; margin-top: 1rem;">

### <span style="color: #f59e0b; font-family: 'JetBrains Mono', monospace;">Firebase Setup</span>

<span style="color: #c9d1d9; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; line-height: 1.6;">
1. Create a Firebase project at <a href="https://console.firebase.google.com" style="color: #f97316;">Firebase Console</a>
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Add your credentials to `.env`:
</span>

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

</div>

<div style="background: #0d1117; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #30363d; margin-top: 1rem;">

### <span style="color: #f59e0b; font-family: 'JetBrains Mono', monospace;">Firestore Security Rules</span>

<span style="color: #c9d1d9; font-family: 'JetBrains Mono', monospace; font-size: 0.9em;">
Configure your Firestore security rules to allow authenticated users to read/write their own data and admins to manage their students.
</span>

</div>

</div>

---

<div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 2rem; border-radius: 1rem; border: 1px solid #374151; margin: 2rem 0;">

## <span style="color: #f97316; font-family: 'JetBrains Mono', monospace;">🛠️ Tech Stack</span>

<div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem;">

<span style="background: #1f2937; color: #f97316; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #374151; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">React</span>
<span style="background: #1f2937; color: #f59e0b; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #374151; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">TypeScript</span>
<span style="background: #1f2937; color: #f97316; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #374151; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">Firebase</span>
<span style="background: #1f2937; color: #f59e0b; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #374151; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">Firestore</span>
<span style="background: #1f2937; color: #f97316; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #374151; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">Tailwind CSS</span>
<span style="background: #1f2937; color: #f59e0b; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #374151; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">Framer Motion</span>
<span style="background: #1f2937; color: #f97316; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #374151; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">Recharts</span>

</div>

</div>

---

<div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 2rem; border-radius: 1rem; border: 1px solid #374151; margin: 2rem 0;">

## <span style="color: #f97316; font-family: 'JetBrains Mono', monospace;">📱 Usage</span>

<div style="background: #0d1117; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #30363d; margin-top: 1rem;">

### <span style="color: #f59e0b; font-family: 'JetBrains Mono', monospace;">For Students</span>

<span style="color: #c9d1d9; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; line-height: 1.6;">
1. Sign up as a student with your admin's token
2. Access your personalized dashboard
3. View assigned tasks and track progress
4. Earn XP and unlock achievements
5. Monitor your study analytics
</span>

</div>

<div style="background: #0d1117; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #30363d; margin-top: 1rem;">

### <span style="color: #f59e0b; font-family: 'JetBrains Mono', monospace;">For Admins</span>

<span style="color: #c9d1d9; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; line-height: 1.6;">
1. Sign up as an admin to receive your unique token
2. Share your token with students
3. Assign tasks to individual students
4. Monitor student progress in real-time
5. Track overall performance metrics
</span>

</div>

</div>

---

<div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 2rem; border-radius: 1rem; border: 1px solid #374151; margin: 2rem 0;">

## <span style="color: #f97316; font-family: 'JetBrains Mono', monospace;">🎨 Design</span>

<span style="color: #d1d5db; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; line-height: 1.6;">
The application features a modern, dark-themed UI with vibrant orange/amber gradient accents. It includes:
</span>

<ul style="color: #d1d5db; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; line-height: 1.8;">
<li>✨ Smooth theme transitions with radial animations</li>
<li>🌓 Light/Dark mode support</li>
<li>📊 Interactive analytics and visualizations</li>
<li>🎯 Clean, intuitive interface</li>
<li>📱 Fully responsive design</li>
<li>🔤 Kregan font for headings (with Space Grotesk fallback)</li>
<li>⌨️ Monospace fonts for UI elements</li>
</ul>

<div style="background: #0d1117; padding: 1rem; border-radius: 0.5rem; border: 1px solid #30363d; margin-top: 1rem;">

### <span style="color: #f59e0b; font-family: 'JetBrains Mono', monospace;">📝 Note on Kregan Font</span>

<span style="color: #c9d1d9; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; line-height: 1.6;">
The main heading uses the <strong>Kregan</strong> font. If you have the Kregan font file, add it to your project and update the font import in <code>index.html</code>. Otherwise, the site will use <strong>Space Grotesk</strong> as a fallback, which provides a similar geometric aesthetic.
</span>

</div>

</div>

---

<div align="center" style="margin-top: 3rem; padding: 2rem; border-top: 1px solid #374151;">

<span style="color: #9ca3af; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">
Built with ❤️ for GATE 2026 Aspirants
</span>

</div>
