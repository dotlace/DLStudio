# Viewport Testing Guide

Use these exact CSS viewport sizes to test responsive layouts across all device categories.

---

## 📱 PHONES — PORTRAIT

| Width × Height | Device Label |
|----------------|--------------|
| 320 × 568      | Small phone / iPhone SE |
| 360 × 640      | Small Android baseline |
| 375 × 667      | Classic iPhone |
| 390 × 844      | Modern iPhone baseline |
| 412 × 915      | Large Android |
| 428 × 926      | iPhone Pro Max class |

---

## 📱 PHONES — LANDSCAPE

| Width × Height | Device Label |
|----------------|--------------|
| 568 × 320      | iPhone SE landscape |
| 640 × 360      | Small Android landscape |
| 667 × 375      | Classic iPhone landscape |
| 844 × 390      | Modern iPhone landscape |
| 915 × 412      | Large Android landscape |
| 926 × 428      | iPhone Pro Max landscape |

---

## 📱 TABLETS — PORTRAIT

| Width × Height | Device Label |
|----------------|--------------|
| 744 × 1133     | iPad Mini |
| 768 × 1024     | iPad 9–10th gen |
| 810 × 1080     | iPad Air |
| 834 × 1194     | iPad Pro 11" |
| 1024 × 1366    | iPad Pro 12.9" |

---

## 📱 TABLETS — LANDSCAPE

| Width × Height | Device Label |
|----------------|--------------|
| 1133 × 744     | iPad Mini landscape |
| 1024 × 768     | iPad 9–10th gen landscape |
| 1080 × 810     | iPad Air landscape |
| 1194 × 834     | iPad Pro 11" landscape |
| 1366 × 1024    | iPad Pro 12.9" landscape |

---

## 💻 LAPTOPS

| Width × Height | Device Label |
|----------------|--------------|
| 1366 × 768     | Common Windows laptop |
| 1440 × 900     | Small laptop / older Mac |
| 1512 × 982     | **MacBook Pro 14" default scaled** |
| 1536 × 864     | 1080p laptop with scaling |
| 1728 × 1117    | **Large MacBook default scaled** |

---

## 🖥️ DESKTOP / MONITORS

| Width × Height | Device Label |
|----------------|--------------|
| 1680 × 1050    | 24" monitor scaled |
| 1920 × 1080    | **Full HD desktop (your 24")** |
| 2560 × 1440    | 27" QHD monitor |
| 2880 × 1800    | Large high-DPI workspace |
| 3200 × 1800    | Wide desktop workspace |

---

## 🖥️ ULTRAWIDE

| Width × Height | Device Label |
|----------------|--------------|
| 2560 × 1080    | Ultrawide FHD |
| 3440 × 1440    | 34" Ultrawide QHD |

---

## 🎯 Testing Strategy

### Priority Breakpoints for This Project

1. **Mobile First**: 390 × 844 (Modern iPhone baseline)
2. **Tablet Portrait**: 810 × 1080 (iPad Air)
3. **Tablet Landscape**: 1194 × 834 (iPad Pro 11" landscape)
4. **Laptop (Mac 14")**: 1512 × 982 ⚠️ *Current layout issue*
5. **Desktop (24")**: 1920 × 1080 ✅ *Working correctly*
6. **Large Desktop**: 2560 × 1440 (27" QHD)

### Critical Comparison for Your Issue

| Screen Type | Viewport | Tailwind Breakpoint | Issue Status |
|-------------|----------|---------------------|--------------|
| MacBook Pro 14" | 1512 × 982 | `xl` (1280px+) | ⚠️ Content overlapping |
| Desktop 24" | 1920 × 1080 | `xl` (1280px+) | ✅ Layout perfect |

**Both hit the same `xl` breakpoint but need different styling!**

---

## 🔧 How to Test

### Browser DevTools
1. Open DevTools (F12 or Cmd+Option+I)
2. Toggle device toolbar (Cmd+Shift+M)
3. Set "Responsive" mode
4. Enter exact dimensions: Width × Height
5. Test each viewport in the list

### Quick Test Checklist
- [ ] Phase indicators don't overlap text
- [ ] All text is readable (not too small/large)
- [ ] Spacing feels natural
- [ ] No horizontal scrolling
- [ ] Animations work smoothly

---

## 📊 Tailwind Default Breakpoints vs Real Devices

| Tailwind | Min Width | Matches These Viewports |
|----------|-----------|------------------------|
| `sm:`    | 640px     | Large phones landscape, small tablets |
| `md:`    | 768px     | Tablets portrait, some laptops |
| `lg:`    | 1024px    | Tablets landscape, most laptops |
| `xl:`    | 1280px    | **Laptops + Desktops mixed!** ⚠️ |
| `2xl:`   | 1536px    | Large laptops + large monitors |

### The Problem
- **1512px (Mac 14")** → hits `xl`
- **1920px (Desktop 24")** → hits `xl`
- Both get the same styles despite needing different layouts!

---

## 💡 Recommended Solution

Add a **custom breakpoint** between `xl` and `2xl` to separate laptops from desktops:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'laptop': '1280px',   // Standard laptops
        'desktop': '1680px',  // Desktop monitors start here
      },
    },
  },
}
```

Then use:
- `laptop:` for MacBook Pro 14"/15" (1512-1728px)
- `desktop:` for 24"+ monitors (1920px+)

---

**Last Updated**: Jan 2026
