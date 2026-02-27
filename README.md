# Vaani AI – Deployment Guide

## ⚠️ PEHLE YEH KARO

`package.json` file mein `YOUR_GITHUB_USERNAME` ki jagah apna actual GitHub username likho:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/vaani-ai"
```

---

## Step 1 – Node.js Install Karo
https://nodejs.org se LTS version download karo

## Step 2 – Project Folder Mein Jao
Command Prompt/Terminal mein:
```
cd vaani-ai
```

## Step 3 – Dependencies Install Karo
```
npm install
```

## Step 4 – Test Karo (Optional)
```
npm run dev
```
Browser mein http://localhost:5173 kholo

## Step 5 – GitHub Repository Banao
- github.com pe jao
- New repository banao → naam rakho: `vaani-ai`
- Public select karo

## Step 6 – GitHub Se Connect Karo
```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vaani-ai.git
git push -u origin main
```

## Step 7 – Deploy Karo
```
npm run deploy
```

## Step 8 – GitHub Pages Enable Karo
- Repository Settings → Pages
- Branch: `gh-pages` select karo → Save

## ✅ Done!
2-3 minute baad tumhari website live hogi:
https://YOUR_USERNAME.github.io/vaani-ai

---

## Aage Update Karna Ho Toh?
Sirf yeh ek command:
```
npm run deploy
```
