# 🎵 Beat Box X — Premium Cloud Music Player & 3D Audio Experience

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=vercel)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-gold?style=for-the-badge)

> **A futuristic, ad-free, high-performance web music player with interactive 3D WebGL background animations, native mobile ergonomics, and cloud playlist sync.**

🌐 **Live Demo**: [https://beat-box-x.vercel.app/](https://beat-box-x.vercel.app/)

---

## 📌 Executive Overview

**Beat Box X** is a modern, web-based cloud music player engineered for seamless audio playback across mobile and desktop devices. Built with performance, privacy, and visual elegance in mind, Beat Box X combines an iOS-inspired glassmorphism UI with low-latency WebGL graphics, native mobile app touch ergonomics, and instant cloud dataset synchronization.

### Key Highlights
* **Zero-Ad Listening**: Streamlined playback without disruptive popups or audio ads.
* **Native App UX on Mobile**: Bottom navigation bar, sticky top bar, 48x48px touch targets, and native sliding bottom sheet modals.
* **Immersive 3D Graphics**: Asynchronously loaded Three.js particle cloud and dynamic wave mesh reacting softly to user touch and mouse movements.
* **Volume 200% Booster**: Integrated volume controller offering precise gain adjustments.
* **Lock-Screen Controls**: Full integration with the browser's `MediaSession` API for seamless background audio control on iOS and Android.

---

## 🏗 System Architecture

Beat Box X follows an unbundled, lightweight client-side architecture that minimizes initial bundle overhead while maintaining high GPU efficiency.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BEAT BOX X FRONTEND UI                                │
│  - Sticky Top App Bar & Fixed Bottom Navigation Bar                             │
│  - Main Content Area (100dvh, overflow-y: auto, overscroll-behavior: none)      │
│  - Safe Area Inset Handling (env(safe-area-inset-bottom/top))                   │
└───────────────────┬────────────────────┬────────────────────┬───────────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────────┐
│   3D WEBGL ENGINE     │  │   AUDIO & MEDIA CORE  │  │   CLOUD DATASET SYNC      │
│  - Three.js (r128)    │  │  - HTML5 Audio API    │  │  - JSON Playlist Streamer │
│  - Low-Poly Mesh Wave │  │  - MediaSession Metadata│ │  - Real-Time Search Filter│
│  - Capped DPR (Max 2) │  │  - 200% Volume Boost  │  │  - Shayari/Quote Engine   │
│  - Idle Lazy Loader   │  │  - Lock-Screen Handler│  │  - Zero CLS Skeletons     │
└───────────────────────┘  └───────────────────────┘  └───────────────────────────┘
```

---

## ✨ Key Technical Features

### 🎨 High-Performance 3D WebGL Background (`three-bg.js`)
* **Asynchronous Deferral**: Loaded dynamically via `requestIdleCallback` after DOM layout completion to ensure unblocked main thread initialization.
* **GPU & Battery Optimizations**: Capped `devicePixelRatio` at `Math.min(window.devicePixelRatio, 2)` to prevent hardware strain on retina displays.
* **Interactive Parallax**: Smooth lerped rotation and tilt reacting to mouse position on desktop and touch drag on mobile.
* **Memory Sanitation**: Complete `.dispose()` teardown routine for geometries, materials, and WebGL renderers during lifecycle cleanup.

### 📱 Native Mobile App-Like Architecture
* **Bottom Navigation Routing**: Bottom fixed tab navigation bar (`Player`, `Search`, `Playlist`) designed for single-thumb ergonomics.
* **Touch Target Standard**: Enforces minimum `48x48px` touch bounds with active touch feedback (`:active` scale animations).
* **Bottom Sheet Modals**: Converts playlist search overlays into native iOS/Android bottom sheets sliding up smoothly with a top drag indicator pill.
* **Zero CLS Skeleton Loaders**: Structured CSS shimmer placeholders (`.skeleton-card`, `.skeleton-disc`) matching exact player bounds before track meta loads.

### 🎵 Advanced Audio & Telemetry Features
* **MediaSession API Integration**: Exposes track title, artist, high-res album art, and hardware play/pause/next/prev controls to native mobile lock screens and smartwatch notifications.
* **200% Volume Control**: Custom popover vertical slider supporting up to 2.0x gain expansion.
* **Shuffle & Auto-Play**: Built-in state management for random track selection and uninterrupted continuous playback.

---

## 🛠 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core UI** | HTML5 / Vanilla JS (ES6+) | Lightweight, dependency-free application logic |
| **Styling** | Vanilla CSS3 | Glassmorphism, CSS Custom Properties, Safe Area Insets |
| **3D Graphics** | Three.js (r128) / WebGL | Custom particle system and animated low-poly wave grid |
| **Fonts** | Google Fonts | `Cinzel` (Logo/Headers), `Quicksand` (App Body UI) |
| **Analytics & Deployment** | Vercel / Speed Insights / GA4 | Cloud hosting, continuous integration, web vitals monitoring |

---

## 🚀 Local Setup & Installation

### Prerequisites
To run Beat Box X locally, you only need a modern web browser or a local web server (e.g., Python `http.server`, VS Code Live Server, or `serve`).

### Step-by-Step Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DhruvilThummar/BeatBox-X.git
   cd BeatBox-X
   ```

2. **Launch via Python Local Server**:
   ```bash
   python -m http.server 8000
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:8000` in your web browser.

---

## 🔑 Environment & Vercel Configuration

For Vercel deployment, the repository includes a pre-configured `vercel.json` file:

```json
{
  "version": 2,
  "name": "beat-box-x",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=86400" }
      ]
    }
  ]
}
```

---

## 📁 Data Schema (`playlist.json`)

The playlist data pipeline consumes a clean JSON array structure located at `playlist.json`:

```json
[
  {
    "title": "Kesariya",
    "artist": "Arijit Singh",
    "src": "https://example.com/audio/kesariya.mp3",
    "cover": "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&q=80"
  }
]
```

---

## 🛡 License & Author

This project is licensed under the **MIT License**.

Designed & Developed with ❤️ by **[Dhruvil Thummar](https://github.com/DhruvilThummar)**.