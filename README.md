# AuraCalc — Modern Glassmorphic Calculator

A modern, responsive web-based calculator built with vanilla **HTML5**, **CSS3**, and **JavaScript**. Featuring a dark glassmorphism design with ambient glowing backdrops, fluid micro-interactions, full keyboard accessibility, dual-line equation display, and a persistent calculation history drawer.

---

## ✨ Features

- **Sleek Glassmorphic Aesthetic**: Deep space color palette, frosted glass card with saturated backdrop blur, ambient floating particle glow, and custom typography (`Outfit` & `JetBrains Mono`).
- **Dual-Line Display**:
  - Top expression line showing the running calculation (`45 × 2 =`).
  - Active operator indicator badge (`+`, `−`, `×`, `÷`).
  - Dynamic font-scaling on the main display to accommodate large numbers without overflow.
- **Precision Floating-Point Arithmetic**: Prevents typical floating-point rounding quirks (e.g. `0.1 + 0.2 = 0.3`).
- **Comprehensive Calculator Operations**:
  - Basic arithmetic: Addition (`+`), Subtraction (`−`), Multiplication (`×`), Division (`÷`).
  - Sign inversion (`±`) and percentage calculations (`%`).
  - Clear All (`AC`) and Backspace / Delete (`DEL`).
  - Graceful division-by-zero handling.
- **Calculation History Drawer**:
  - Slide-in side panel recording prior equations and results.
  - One-click restore to load any previous result directly into the active calculation.
  - Persistent across page reloads via `localStorage`.
- **Keyboard Shortcuts**: Complete desktop keyboard navigation support with tactile visual key-press highlights.

---

## ⌨️ Keyboard Shortcuts

| Key(s) | Action |
| :--- | :--- |
| `0` – `9` | Number input |
| `.` or `,` | Decimal point |
| `+`, `-`, `*`, `/` | Arithmetic operators (`+`, `−`, `×`, `÷`) |
| `Enter` or `=` | Calculate result (Equals) |
| `Backspace` | Delete last digit (`DEL`) |
| `Escape` | Clear all (`AC`) / Close history drawer |
| `%` | Percent |
| `h` or `H` | Toggle History drawer |

---

## 🚀 Getting Started

No build steps or dependencies required! You can open the calculator directly in any modern browser:

### Option 1: Open Directly
Double-click `index.html` or open it with your browser:
```bash
open index.html   # On macOS
```

### Option 2: Run a Local Development Server
Using Python's built-in server:
```bash
python3 -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

---

## 📁 File Structure

```
ds3a/
├── index.html       # Semantic HTML5 markup, screen display, and keypad layout
├── style.css        # Vanilla CSS3 design system, glassmorphism tokens, and responsive styles
├── script.js        # Calculator class, arithmetic logic, history, and keyboard event bindings
└── README.md        # Documentation and user guide
```

---

## 🛠️ Built With

- **HTML5**: Semantic elements, accessible ARIA attributes, and SVG icons.
- **Vanilla CSS3**: CSS Custom Properties, Backdrop Filters, CSS Grid, Flexbox, and Keyframe Animations.
- **Vanilla JavaScript (ES6+)**: OOP class design pattern, precision rounding, and state management.