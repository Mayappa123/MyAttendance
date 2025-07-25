const tableBody = document.querySelector("#attendanceTable tbody");
const monthYearText = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const saveBtn = document.getElementById("saveBtn");

let currentDate = new Date();
let attendanceData = JSON.parse(localStorage.getItem("attendance")) || {};

function renderTable() {
  tableBody.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  monthYearText.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateObj = new Date(year, month, day);
    const dayName = dateObj.toLocaleString('default', { weekday: 'long' });
    const dateStr = dateObj.toISOString().split('T')[0];

    const tr = document.createElement("tr");
    if (dayName === "Thursday") tr.classList.add("holiday");

    const status = attendanceData[dateStr]?.status || "";
    const lastEdit = attendanceData[dateStr]?.edited || "";

    tr.innerHTML = `
      <td>${dateStr}</td>
      <td>${dayName}</td>
      <td class="status-cell ${status.toLowerCase()}">${status || "Click to Mark"}
        ${lastEdit ? `<div class="tooltip">Edited: ${lastEdit}</div>` : ""}
      </td>
    `;

    const statusCell = tr.querySelector(".status-cell");

    if (dayName !== "Thursday") {
      statusCell.addEventListener("click", () => {
        const newStatus = statusCell.textContent.includes("Present")
          ? "Absent"
          : statusCell.textContent.includes("Absent")
          ? ""
          : "Present";

        if (newStatus === "") {
          delete attendanceData[dateStr];
        } else {
          attendanceData[dateStr] = {
            status: newStatus,
            edited: new Date().toLocaleString()
          };
        }

        renderTable();
      });
    }

    tableBody.appendChild(tr);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderTable();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderTable();
});

saveBtn.addEventListener("click", () => {
  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  alert("Attendance saved successfully!");
});

renderTable();
