import { useState, useEffect } from "react";
import AppointmentsTable from "../components/AppointmentsTable";
import EditAppointmentModal from "../components/ EditAppointmentModal";

const doctors = [
  { id: 1, name: "Ouhoud amer kawas" },
  { id: 2, name: "Sherry susan philip" },
  { id: 3, name: "Kadir" },
  { id: 4, name: "Treesa jose bbin" },
  { id: null, name: "Unassigned" },
];

// Format time in strict 12-hour format with leading zero hour, e.g. 01:30 PM
const formatTime = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return null;
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
};

// Generate half-hour slots between noon and 7pm
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 12;
  const endHour = 19;
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(formatTime(new Date(2025, 0, 1, hour, 0)));
    if (hour !== endHour) slots.push(formatTime(new Date(2025, 0, 1, hour, 30)));
  }
  return slots;
};

// Convert backend ISO timestamp to slot label
const convertBackendTimeToSlot = (isoString) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return null;
  return formatTime(date);
};

// Normalize slot keys for safe comparison
const normalizeSlot = (slot) => (slot ? slot.trim().toUpperCase() : slot);

export default function Home() {
  const [appointments, setAppointments] = useState([]);
  const [editingAppt, setEditingAppt] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const groupedAppointments = () => {
    const grouped = {};
    const slots = generateTimeSlots().map(normalizeSlot);

    // Initialize empty slots per doctor
    slots.forEach((slot) => {
      grouped[slot] = {};
      doctors.forEach((doc) => {
        grouped[slot][doc.id === null ? "UNASSIGNED" : doc.id] = [];
      });
    });

    // Place each appointment in correct slot
    appointments.forEach((appt) => {
      // Use backend formatted time12 if present
      const rawSlotTime = appt.time12 || convertBackendTimeToSlot(appt.appointment_start_time);
      const slotTime = normalizeSlot(rawSlotTime);
      const docId = appt.doctor_id === null ? "UNASSIGNED" : appt.doctor_id;

      if (grouped[slotTime]) {
        grouped[slotTime][docId].push(appt);
      } else {
        console.warn(`[groupedAppointments] No slot found for appointment time: "${slotTime}" (raw: "${rawSlotTime}")`);
      }
    });


    return grouped;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login...");
      window.location.href = "/auth/login";
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`;
    console.log("Fetching appointments from:", url);

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched appointments data:", data);
        setAppointments(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setIsLoading(false);
      });
  }, []);

  const handleEditClick = (appt) => {
    setEditingAppt(appt);
    setFormData(appt);
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${editingAppt.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        setAppointments((prev) =>
          prev.map((a) => (a.id === editingAppt.id ? { ...a, ...formData } : a))
        );
        setEditingAppt(null);
      })
      .catch((err) => console.error("Error updating appointment:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  const grouped = groupedAppointments();
  const slots = generateTimeSlots();

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-center flex-grow">
          Appointments Schedule
        </h1>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading appointments...</p>
      ) : (
        <AppointmentsTable
          doctors={doctors}
          grouped={grouped}
          slots={slots}
          handleEditClick={handleEditClick}
          getSlotColor={(appt, i) => {
            const slotColors = [
              "#FFE066",
              "#FF6B6B",
              "#6BCB77",
              "#4D96FF",
              "#FF9F1C",
              "#9D4EDD",
              "#00B8A9",
            ];
            const id = appt.id ?? i;
            return slotColors[id % slotColors.length];
          }}
          statusColor={(status) => {
            switch (status) {
              case "Scheduled":
                return "bg-green-100 text-green-800";
              case "Completed":
                return "bg-blue-100 text-blue-800";
              case "Cancelled":
                return "bg-red-100 text-red-800";
              default:
                return "bg-gray-100 text-gray-700";
            }
          }}
          paymentColor={(payment) => {
            switch (payment) {
              case "Paid":
                return "bg-green-200 text-green-900";
              case "Pending":
                return "bg-yellow-200 text-yellow-900";
              case "Unpaid":
                return "bg-red-200 text-red-900";
              default:
                return "bg-gray-200 text-gray-800";
            }
          }}
        />
      )}

      <EditAppointmentModal
        editingAppt={editingAppt}
        formData={formData}
        setFormData={setFormData}
        setEditingAppt={setEditingAppt}
        handleSave={handleSave}
      />
    </div>
  );
}
