# 📱 Mobile-First Student Fee Reminder System

A lightweight, fully responsive web application designed for school teachers, tutors, and institutions to manage student fees and send automated WhatsApp reminders directly from their smartphones. 

Built with a mobile-first approach, this system runs entirely in the browser without requiring a backend server or paid database.

## ✨ Key Features

* **📱 Native Mobile Feel:** Card-based UI designed with Tailwind CSS for smooth touch targets and clear readability on smartphone screens.
* **💬 Automated WhatsApp Integration:** 
  * One-click generation of pre-filled WhatsApp due reminders.
  * One-click payment receipts sent instantly when a status is marked as "Paid".
* **💾 Serverless Local Storage:** All student data is securely saved directly in the browser's `localStorage`. No login, API keys, or cloud hosting required.
* **📊 Dashboard Analytics:** Instantly track total active students, pending amounts, and collected revenue.
* **🔍 Instant Search & Filters:** Quickly locate students by name/phone or filter records by month, year, and payment status.

## 🛠️ Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript (ES6+)
* **Styling:** Tailwind CSS (via CDN)
* **Icons:** FontAwesome
* **Storage:** Browser `localStorage`
* **Hosting:** GitHub Pages

## 🚀 Live Demo

[Link to your GitHub Pages URL - e.g., https://shushil-m.github.io/mobile-fee-manager]

## 📖 How to Use

1. Open the application link on your mobile browser.
2. Tap **Add Student** to create a new fee record (Name, Phone, Month, Amount).
3. Use the green **Send Reminder** button to notify parents of pending dues via WhatsApp.
4. Once paid, click the edit icon (✏️), change the status to **Paid**, and use the blue **Send Receipt** button to confirm payment.
5. *Note: Because this uses Local Storage, do not clear your browser cache if you want to keep your data, and always use the same device/browser.*

## 👨‍💻 About the Developer

Developed by **Shushil R. Maddeshiya** 
* GitHub: [@Shushil.M](https://github.com/Shushil.M)
* Built and tested for mobile-first deployment.

---
*If you find this project helpful, feel free to give it a ⭐ on GitHub!*
