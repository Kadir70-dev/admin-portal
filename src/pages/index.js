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

const generateTimeSlots = () => {
  const slots = [];
  const startHour = 12;
  const endHour = 19;
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(formatTime(hour, 0));
    if (hour !== endHour) slots.push(formatTime(hour, 30));
  }
  return slots;
};

const formatTime = (hour24, minute) => {
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  const minStr = minute === 0 ? "00" : "30";
  return `${hour12}:${minStr} ${period}`;
};

export default function Home() {
  const [appointments, setAppointments] = useState([]);
  const [editingAppt, setEditingAppt] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const groupedAppointments = () => {
    const grouped = {};
    const slots = generateTimeSlots();

    slots.forEach((slot) => {
      grouped[slot] = {};
      doctors.forEach((doc) => {
        grouped[slot][doc.id === null ? "unassigned" : doc.id] = [];
      });
    });

    appointments.forEach((appt) => {
      const time = appt.appointment_start_time;
      const docId = appt.doctor_id ?? "unassigned";

      if (grouped[time]) {
        const key = docId === null ? "unassigned" : docId;
        if (grouped[time][key]) {
          grouped[time][key].push(appt);
        }
      }
    });

    return grouped;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
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

  const grouped = groupedAppointments();
  const slots = generateTimeSlots();

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Appointments Schedule</h1>

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
