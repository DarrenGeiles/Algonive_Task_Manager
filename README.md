# Algonive Internship: Advanced Task Manager

A robust, client-side web application designed to help users manage daily tasks, track productivity, and visualize workloads. Built for the Algonive Web Development Internship.

## 🎯 Core Requirements 

* **Task Management Operations:** Complete web-based system allowing users to smoothly add, edit, and delete tasks with specific deadlines.
* **Comprehensive Task Details:** Users can seamlessly create tasks complete with a designated title, detailed description, and an exact due date.
* **Interactive Status & Filtering:** Smooth functionality to mark tasks as complete or incomplete, alongside dynamic dropdowns to filter the dashboard accordingly.
* **Persistent Data Tracking:** Securely utilizes the browser's local storage to save tasks and activity persistently without relying on a backend database.
* **Deadline Reminders:** Proactive toast notification system that triggers actionable visual alerts for approaching task deadlines.
* **Responsive UI:** Designed with a clean, intuitive, and responsive interface utilizing modern HTML and CSS.

## 🚀 Advanced & Enterprise Features Added

* **Premium Theme Engine & UI/UX:** Engineered with a sleek, responsive CSS Grid "Bento Box" architecture. Features an instantaneous Dark / Light mode toggle that smoothly transitions CSS variables and updates chart rendering contexts.
* **Interactive Kanban Board:** Full Drag-and-Drop (DnD) API implementation allowing users to seamlessly transition tasks across *To Do*, *In Progress*, and *Completed* lifecycle columns.
* **Rich Text Formatting:** Integrates `marked.js` to parse Markdown (`**bold**`, `*italic*`, lists) directly inside task descriptions for professional-grade documentation.
* **Dynamic Subtask Engine:** Features inline visual progress bars calculating and animating completion percentages in real-time as users check off nested sub-items.
* **Base64 Image Attachments:** Utilizes asynchronous `FileReader` APIs to convert image uploads into Base64 strings, saving visual attachments directly to local storage alongside task data.
* **Integrated Pomodoro Focus Timer:** A dedicated productivity module featuring 25-minute focus blocks and 5-minute break intervals to optimize workflow pacing.
* **Data Portability (Export/Import):** Complete data sovereignty allowing users to serialize their entire workspace state into a `.json` backup file for local download, or upload a backup to instantly restore their dashboard.
* **Live Analytics Engine:** Leverages `Chart.js` to render interactive Doughnut and Bar charts that dynamically track completion rates and workload distribution by priority levels.
* **System Activity Ledger:** A slide-out chronological timeline drawer that automatically logs every system action (task creation, status shifts, deletions) with timestamped accuracy.

## 💻 Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Storage:** Browser `localStorage` API
* **Libraries:** Chart.js, marked.js, FontAwesome

## 🛠️ How to Run Locally

1. Clone this repository to your local machine.
2. Navigate into the project directory on your computer.
3. Simply double-click the `index.html` file to launch the application directly in your default web browser (no server required).
4. **Alternative:** Open the project directory in your IDE (e.g., VS Code) and run it via a Live Server extension for hot-reloading.

---
*Developed by Darren Wilfred Geiles for Algonive*