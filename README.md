
# Quantum Task Dashboard

A robust, enterprise-grade project management and productivity tracking platform built entirely on client-side architecture. Designed for the Algonive Web Development Internship, this application utilizes a modern "Bento Box" UI grid, advanced data portability, and real-time visualization without the overhead of a backend server.

## 🚀 Key Features

* **Modern Bento Box UI & Theme Engine:** Engineered with a sleek, responsive CSS Grid architecture. Features a seamless Light/Dark mode toggle that instantly overrides CSS custom properties and updates chart rendering contexts.
* **Interactive Kanban Board:** Full Drag-and-Drop (DnD) API implementation allowing users to seamlessly transition tasks across 'To Do', 'In Progress', and 'Completed' lifecycle columns.
* **Advanced Task Architecture:** * **Rich Text Support:** Integrates `marked.js` to parse Markdown (`**bold**`, `*italic*`, lists) directly inside task descriptions.
  * **Subtask Engine:** Dynamic subtask checklists featuring inline progress bars that calculate and animate completion percentages in real-time.
  * **Base64 File Attachments:** Utilizes asynchronous `FileReader` APIs to convert image uploads into Base64 strings, saving visual attachments directly to local storage.
* **Built-in Pomodoro Focus Timer:** A dedicated productivity module featuring 25-minute focus blocks and 5-minute break intervals to optimize workflow pacing.
* **Data Portability (Export/Import):** Complete data sovereignty. Users can instantly serialize their entire workspace state into a `.json` backup file and download it to their local machine, or upload a backup to seamlessly restore their dashboard.
* **Live Analytics Engine:** Leverages `Chart.js` to render interactive Doughnut and Bar charts that dynamically track completion rates and workload distribution by priority levels.
* **System Activity Ledger:** A dedicated historical timeline panel that automatically logs chronological system activities (task creation, status shifts, deletions) with timestamped accuracy.

## 💻 Tech Stack

* **Frontend Structure:** HTML5, Vanilla JavaScript (ES6+), DOM Manipulation API
* **Styling Engine:** CSS3 (CSS Grid, Flexbox, Custom Variables, Fluid Animations)
* **Persistent Storage:** Browser `localStorage` API
* **External Libraries:** * `Chart.js` (Data Visualization)
  * `marked.js` (Markdown Parsing)
  * `FontAwesome` (Vector Iconography)

## 🛠️ Infrastructure Setup & Installation (Local Deployment)

Because the Quantum Task Dashboard utilizes an advanced client-side persistent storage model, there are no databases to configure or backend servers to spin up. 

1. **Clone the repository** to your local machine:
```bash
   git clone [https://github.com/your-username/quantum-task-dashboard.git](https://github.com/your-username/quantum-task-dashboard.git)
```

2. **Navigate into the project directory:**
```bash
cd quantum-task-dashboard

```


3. **Launch the Application:**
* **Option A (Standard):** Simply double-click the `index.html` file to open it in your default web browser.
* **Option B (Recommended for Devs):** Open the project in VS Code and use the **Live Server** extension to host it on a local development port (e.g., `http://127.0.0.1:5500/`).


---
*Developed by Darren Wilfred Geiles for Algonive*
