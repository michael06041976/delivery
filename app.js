const STORAGE_KEY = "salonflow_appointments_v1";

function loadAppointments() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString("he-IL");
}

function renderAppointments() {
  const list = document.getElementById("appointmentsList");
  const appointments = loadAppointments().sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  list.innerHTML = "";

  if (appointments.length === 0) {
    list.innerHTML = "<li>אין תורים עדיין.</li>";
    return;
  }

  appointments.forEach((a, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${a.clientName}</strong> — ${a.serviceType}<br />
      ${a.staffMember} | ${formatDate(a.date)}<br />
      ${a.clientPhone}
      <div><button data-index="${index}" class="delete-btn">מחק</button></div>
    `;
    list.appendChild(li);
  });
}

function hasConflict(newAppointment, appointments) {
  return appointments.some(
    (a) => a.staffMember === newAppointment.staffMember && a.date === newAppointment.date
  );
}

function getClientHistory(phone) {
  const appointments = loadAppointments();
  return appointments
    .filter((a) => a.clientPhone.trim() === phone.trim())
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

document.getElementById("appointmentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const appointment = {
    clientName: document.getElementById("clientName").value.trim(),
    clientPhone: document.getElementById("clientPhone").value.trim(),
    serviceType: document.getElementById("serviceType").value,
    staffMember: document.getElementById("staffMember").value,
    date: document.getElementById("appointmentDate").value,
  };

  const appointments = loadAppointments();
  if (hasConflict(appointment, appointments)) {
    alert("יש חפיפה: לסטייליסט יש כבר תור בזמן הזה.");
    return;
  }

  appointments.push(appointment);
  saveAppointments(appointments);
  e.target.reset();
  renderAppointments();
});

document.getElementById("appointmentsList").addEventListener("click", (e) => {
  if (!e.target.classList.contains("delete-btn")) {
    return;
  }

  const index = Number(e.target.dataset.index);
  const appointments = loadAppointments().sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  appointments.splice(index, 1);
  saveAppointments(appointments);
  renderAppointments();
});

document.getElementById("searchButton").addEventListener("click", () => {
  const phone = document.getElementById("searchPhone").value;
  const history = getClientHistory(phone);
  const historyDiv = document.getElementById("clientHistory");

  if (history.length === 0) {
    historyDiv.innerHTML = "<p>לא נמצאו טיפולים ללקוח זה.</p>";
    return;
  }

  historyDiv.innerHTML = `
    <h3>היסטוריה</h3>
    <ul>
      ${history
        .map(
          (h) =>
            `<li>${formatDate(h.date)} — ${h.serviceType} אצל ${h.staffMember}</li>`
        )
        .join("")}
    </ul>
  `;
});

document.getElementById("generateReport").addEventListener("click", () => {
  const reportDiv = document.getElementById("dailyReport");
  const appointments = loadAppointments();
  const today = new Date().toISOString().slice(0, 10);

  const todayAppointments = appointments.filter((a) => a.date.startsWith(today));
  const byService = todayAppointments.reduce((acc, curr) => {
    acc[curr.serviceType] = (acc[curr.serviceType] || 0) + 1;
    return acc;
  }, {});

  reportDiv.innerHTML = `
    <p>סה"כ תורים היום: <strong>${todayAppointments.length}</strong></p>
    <p>פירוט לפי שירות:</p>
    <ul>
      ${Object.entries(byService)
        .map(([service, count]) => `<li>${service}: ${count}</li>`)
        .join("") || "<li>אין נתונים</li>"}
    </ul>
  `;
});

renderAppointments();
