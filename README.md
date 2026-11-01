# ApexPortal | Next-Gen Multi-Step Registration Wizard

A state-of-the-art, accessible, and responsive multi-step registration experience built with modern HTML5, CSS3, and Vanilla JavaScript. Features dark/light theme switching, live password complexity validation, dynamic age calculation, drag-and-drop file upload, simulated 2FA OTP verification, and a celebration success modal.

---

## ✨ Key Features

- 🌓 **Dynamic Theme Switcher**: Full Dark & Light mode toggle with automatic system preference detection and `localStorage` persistence.
- 🧙‍♂️ **Multi-Step Wizard**:
  - **Step 1: Account Credentials** — Full name, work/personal email, password with toggle visibility, and password confirmation.
  - **Step 2: Profile & Details** — Phone with country code selector, date of birth with auto-calculated age (18+ verification), gender pill selectors, primary domain, interactive experience slider, and drag-and-drop avatar/resume uploader with live thumbnail preview.
  - **Step 3: Security & Verification** — Interactive skill chips, live account summary card, simulated 4-digit OTP verification (with auto-focus, backspace navigation, paste support, and code refresh), and terms & privacy agreement.
- 🔐 **Real-Time Password Strength Meter & Live Checklist**: 4-level security evaluation (Length, Uppercase, Number, Special character) with dynamic meter bars and live checkmark status.
- 📱 **Modern Accessible Design**: Built with semantic HTML, fluid CSS custom properties, glassmorphism cards, and `:user-valid` / `:user-invalid` constraints for distraction-free user experience.
- 🎉 **Celebration Success Modal**: Interactive modal with floating confetti particle simulation and account verification badges upon submission.
- 📂 **Pure Vanilla Stack**: Zero external runtime framework dependencies. Fast, lightweight, and modern.

---

## 📁 Project Structure

```
REGISTRATION FORM/
├── index.html       # Semantic multi-step HTML structure & accessibility
├── style.css        # CSS custom properties, glassmorphism, responsive styles
├── script.js        # Wizard navigation, validation, theme switch & OTP logic
└── README.md        # Documentation and feature guide
```

---

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/sobhit56/Registrstion-form.git
   ```
2. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge). No build step required!

---

## 🎨 Interactive Features in Detail

### 1. Step 1: Account Credentials
- **Name Validation**: Requires minimum 3 characters.
- **Email Validation**: Checks standard email formats with `autocomplete="username"`.
- **Password Strength**: Real-time evaluation against length (8+), uppercase, digit, and special characters.
- **Show/Hide Password**: Quick visibility toggle button for both password and confirm password inputs.

### 2. Step 2: Personal & Professional Profile
- **Country Prefix**: Selectable country codes (`+1`, `+91`, `+44`, `+61`, `+49`, etc.).
- **Auto Age Calculation**: Automatically calculates and displays the user's age from their date of birth, enforcing a minimum age of 18.
- **Pill Radio Buttons**: Intuitive gender selection cards with icons.
- **Experience Slider**: Smooth slider updating a badge display in real-time.
- **Drag & Drop Uploader**: Drag and drop images (PNG, JPG, WEBP) or PDFs (up to 5MB) with instant thumbnail preview and remove capability.

### 3. Step 3: Security & Verification
- **Skill Chips**: Selectable tag pills for technologies and disciplines.
- **Two-Factor OTP Simulator**: 4-digit pin input with automatic forward/backward tabbing, clipboard paste support, and a demo code generator.
- **Summary Review Card**: Real-time summary of the applicant's entered data before final commitment.
- **Terms Agreement**: Custom checkbox with legal links.

---

## 🛠️ Browser Support

| Browser | Support |
| :--- | :--- |
| Google Chrome | ✅ Supported |
| Mozilla Firefox | ✅ Supported |
| Apple Safari | ✅ Supported |
| Microsoft Edge | ✅ Supported |
| Mobile & Tablet Browsers | ✅ Supported |

---

### 👨‍💻 Author
Sobhit Kumar — [GitHub Profile](https://github.com/sobhit56)
