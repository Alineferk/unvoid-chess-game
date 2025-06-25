# 🧩 Unvoid Chess Game

This is a **Next.js (TypeScript)** project that implements **Unvoid Chess**, a custom board game inspired by a technical front-end and logic challenge.

The goal was to create a playable web version, following specific custom rules, without using external chess libraries like `chess.js`.

---

## ♟️ About the Game

**Unvoid Chess** is a strategic board game with 3 unique piece types:

### ✅ Pieces:

- **Product Owner (PO):**  
Moves **1 square per turn**, in any direction.

- **Developer (Dev):**  
Moves **up to 3 squares per turn**, in any direction (horizontal, vertical, diagonal), and can jump over other pieces.

- **Designer (Des):**  
Moves like a **knight** in traditional chess (L-shape).

---

### ✅ How to Win:
To win the game, you must **capture your opponent's Product Owner (PO)**.

---

### ✅ Board Size:
Before the game starts, the player can select a board size between **6x6 and 12x12 squares**.

---

## 🚀 Technologies Used

- **Next.js (App Router)**
- **TypeScript**
- **React**
- **CSS Modules**
- **Framer Motion** (animations)
- **GitHub Pages / Vercel** (deployment)

---

## 🖼️ Project Images

### 📍 Board Example

*(Preview of the board with 6x6 scale)*

![Board](./public/Desktop%20(1).png)

---

### 📍 Rules Document

*(Official challenge rules for Unvoid Chess)*

![Rules](./public/%F0%9F%93%9C%20README.png)

---

## ▶️ Running Locally

```bash
npm install
npm run dev
