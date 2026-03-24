const STORAGE_KEY = "salonflow_appointments_v2";
const PRICE_KEY = "salonflow_price_list_v1";

const STAFF = ["דנה", "רועי", "מיכל"];

const DEFAULT_PRICE_LIST = {
  "LADIES CUT": 59,
  "GIRLS CUT": 46,
  "MEN CUT": 29,
  "BLOWOUT": 46,
  "SINGLE PROCESS COLOR": 92,
  "PARTIAL HIGHLIGHT": 105,
  "OLAPLEX TREATMENT": 40,
  "BROW TINT": 17,
};

const DEMO_APPOINTMENTS = [
  {
    id: crypto.randomUUID(),
    clientName: "נועה כהן",
    clientPhone: "050-1112233",
    serviceType: "LADIES CUT",
    staffMember: "דנה",
    date: `${new Date().toISOString().slice(0, 10)}T09:00`,
    status: "confirmed",
    source: "office",
  },
  {
    id: crypto.randomUUID(),
    clientName: "עמית לוי",
    clientPhone: "050-2223344",
    serviceType: "SINGLE PROCESS COLOR",
    staffMember: "לא שובץ",
    date: `${new Date().toISOString().slice(0, 10)}T12:00`,
    status: "pending",
    source: "customer",
  },
];

function loadAppointments() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function loadPriceList() {
  const stored = JSON.parse(localStorage.getItem(PRICE_KEY) || "null");
  return stored || { ...DEFAULT_PRICE_LIST };
}

function savePriceList(priceList) {
  localStorage.setItem(PRICE_KEY, JSON.stringify(priceList));
}

function formatDate(date) {
  return new Date(date).toLocaleString("he-IL");
}

function hasConflict(candidate, appointments) {
  return appointments.some(
    (a) =>
      a.staffMember === candidate.staffMember &&
      a.date === candidate.date &&
      a.status !== "cancelled" &&
      candidate.staffMember !== "לא שובץ"
  );
}

function setActivePanel(panel) {
  const isCustomer = panel === "customer";
  document.getElementById("customerPanel").classList.toggle("active", isCustomer);
  document.getElementById("officePanel").classList.toggle("active", !isCustomer);
  document.getElementById("tabCustomer").classList.toggle("active", isCustomer);
  document.getElementById("tabOffice").classList.toggle("active", !isCustomer);
}

function fillServiceDropdowns() {
  const priceList = loadPriceList();
  const services = Object.keys(priceList);
  const customerSelect = document.getElementById("customerService");
  const officeSelect = document.getElementById("officeService");

  [customerSelect, officeSelect].forEach((select) => {
    const currentValue = select.value;
    select.innerHTML = '<option value="">בחר שירות</option>';
    services.forEach((service) => {
      const option = document.createElement("option");
      option.value = service;
      option.textContent = `${service} (${priceList[service]} ₪)`;
      select.appendChild(option);
    });
    select.value = currentValue;
  });
}

function renderPriceListEditor() {
  const container = document.getElementById("priceListEditor");
  const priceList = loadPriceList();
  container.innerHTML = Object.entries(priceList)
    .map(
      ([service, price]) => `
      <label>${service}
        <input type="number" min="0" data-service="${service}" value="${price}" />
      </label>
    `
    )
    .join("");
}

function renderOfficeAppointments() {
  const tbody = document.getElementById("officeAppointmentsTable");
  const priceList = loadPriceList();
  const appointments = loadAppointments().sort((a, b) => new Date(a.date) - new Date(b.date));

  tbody.innerHTML = appointments
    .map((a) => {
      const staffOptions = [a.staffMember, ...STAFF.filter((s) => s !== a.staffMember)]
        .map((s) => `<option ${s === a.staffMember ? "selected" : ""}>${s}</option>`)
        .join("");

      return `
      <tr>
        <td>${a.clientName}<br /><small>${a.clientPhone}</small></td>
        <td>${a.serviceType}</td>
        <td>${formatDate(a.date)}</td>
        <td>
          <select data-action="assign" data-id="${a.id}">${staffOptions}</select>
        </td>
        <td>${a.status}</td>
        <td>${priceList[a.serviceType] ?? 0} ₪</td>
        <td>
          <button type="button" data-action="confirm" data-id="${a.id}">אשר</button>
          <button type="button" data-action="cancel" data-id="${a.id}" class="danger">בטל</button>
          <button type="button" data-action="delete" data-id="${a.id}">מחק</button>
        </td>
      </tr>`;
    })
    .join("");
}

function renderKpis() {
  const priceList = loadPriceList();
  const appointments = loadAppointments();
  const pending = appointments.filter((a) => a.status === "pending").length;
  const potentialRevenue = appointments
    .filter((a) => a.status !== "cancelled")
    .reduce((sum, a) => sum + (priceList[a.serviceType] ?? 0), 0);

  document.getElementById("kpiTotal").textContent = appointments.length;
  document.getElementById("kpiPending").textContent = pending;
  document.getElementById("kpiRevenue").textContent = `${potentialRevenue} ₪`;
}

function rerenderAll() {
  fillServiceDropdowns();
  renderPriceListEditor();
  renderOfficeAppointments();
  renderKpis();
}

document.getElementById("tabCustomer").addEventListener("click", () => setActivePanel("customer"));
document.getElementById("tabOffice").addEventListener("click", () => setActivePanel("office"));

document.getElementById("customerBookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const appointment = {
    id: crypto.randomUUID(),
    clientName: document.getElementById("customerName").value.trim(),
    clientPhone: document.getElementById("customerPhone").value.trim(),
    serviceType: document.getElementById("customerService").value,
    staffMember: "לא שובץ",
    date: document.getElementById("customerDate").value,
    status: "pending",
    source: "customer",
  };

  const appointments = loadAppointments();
  appointments.push(appointment);
  saveAppointments(appointments);
  document.getElementById("customerMessage").textContent = "הבקשה נשלחה בהצלחה וממתינה לאישור המספרה.";
  e.target.reset();
  rerenderAll();
});

document.getElementById("customerTrackBtn").addEventListener("click", () => {
  const phone = document.getElementById("customerTrackPhone").value.trim();
  const results = loadAppointments().filter((a) => a.clientPhone === phone);
  const container = document.getElementById("customerAppointments");

  if (!results.length) {
    container.innerHTML = "<p>לא נמצאו תורים עבור מספר זה.</p>";
    return;
  }

  container.innerHTML = `<ul>${results
    .map((r) => `<li>${formatDate(r.date)} | ${r.serviceType} | סטטוס: ${r.status}</li>`)
    .join("")}</ul>`;
});

document.getElementById("officeAppointmentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const appointment = {
    id: crypto.randomUUID(),
    clientName: document.getElementById("officeClientName").value.trim(),
    clientPhone: document.getElementById("officeClientPhone").value.trim(),
    serviceType: document.getElementById("officeService").value,
    staffMember: document.getElementById("officeStaff").value,
    date: document.getElementById("officeDate").value,
    status: "confirmed",
    source: "office",
  };

  const appointments = loadAppointments();
  if (hasConflict(appointment, appointments)) {
    alert("יש חפיפה: לסטייליסט כבר יש תור בשעה זו.");
    return;
  }

  appointments.push(appointment);
  saveAppointments(appointments);
  e.target.reset();
  rerenderAll();
});

document.getElementById("officeAppointmentsTable").addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;
  if (!action || !id) return;

  const appointments = loadAppointments();
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return;

  if (action === "confirm") appointments[idx].status = "confirmed";
  if (action === "cancel") appointments[idx].status = "cancelled";
  if (action === "delete") appointments.splice(idx, 1);

  saveAppointments(appointments);
  rerenderAll();
});

document.getElementById("officeAppointmentsTable").addEventListener("change", (e) => {
  if (e.target.dataset.action !== "assign") return;

  const id = e.target.dataset.id;
  const newStaff = e.target.value;
  const appointments = loadAppointments();
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return;

  const candidate = { ...appointments[idx], staffMember: newStaff };
  const others = appointments.filter((a) => a.id !== id);
  if (hasConflict(candidate, others)) {
    alert("אי אפשר לשבץ: קיימת חפיפה לסטייליסט זה.");
    rerenderAll();
    return;
  }

  appointments[idx].staffMember = newStaff;
  saveAppointments(appointments);
  rerenderAll();
});

document.getElementById("savePriceListBtn").addEventListener("click", () => {
  const inputs = [...document.querySelectorAll("#priceListEditor input[data-service]")];
  const updated = {};
  inputs.forEach((input) => {
    updated[input.dataset.service] = Number(input.value) || 0;
  });
  savePriceList(updated);
  fillServiceDropdowns();
  rerenderAll();
  alert("המחירון נשמר בהצלחה.");
});

document.getElementById("generateInvoiceBtn").addEventListener("click", () => {
  const phone = document.getElementById("invoicePhone").value.trim();
  const priceList = loadPriceList();
  const treatments = loadAppointments().filter(
    (a) => a.clientPhone === phone && a.status === "confirmed"
  );
  const total = treatments.reduce((sum, t) => sum + (priceList[t.serviceType] ?? 0), 0);

  document.getElementById("invoiceResult").innerHTML = treatments.length
    ? `<ul>${treatments
        .map((t) => `<li>${t.serviceType}: ${priceList[t.serviceType] ?? 0} ₪</li>`)
        .join("")}</ul><p><strong>סה"כ לתשלום: ${total} ₪</strong></p>`
    : "<p>אין טיפולים מאושרים ללקוח זה.</p>";
});

document.getElementById("loadDemoBtn").addEventListener("click", () => {
  saveAppointments(DEMO_APPOINTMENTS);
  savePriceList({ ...DEFAULT_PRICE_LIST });
  rerenderAll();
});

document.getElementById("clearDataBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PRICE_KEY);
  document.getElementById("customerMessage").textContent = "";
  document.getElementById("customerAppointments").innerHTML = "";
  document.getElementById("invoiceResult").innerHTML = "";
  rerenderAll();
});

setActivePanel("customer");
rerenderAll();
