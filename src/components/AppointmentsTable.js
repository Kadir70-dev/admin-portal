import React from "react";

export default function AppointmentsTable({ doctors, grouped, slots, handleEditClick, getSlotColor, statusColor, paymentColor }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-300 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 sticky top-0 z-20">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-100 border-r border-gray-300 z-30"
              style={{ minWidth: "100px" }}
            >
              Time
            </th>
            {doctors.map((doc) => (
              <th
                key={doc.id === null ? "unassigned" : doc.id}
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-300"
                style={{ minWidth: "180px" }}
              >
                {doc.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {slots.map((slot) => (
            <tr key={slot} className="hover:bg-gray-50 transition-colors duration-150">
              <td
                className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 border-r border-gray-300"
                style={{ minWidth: "100px" }}
              >
                {slot}
              </td>
              {doctors.map((doc) => {
                const key = doc.id === null ? "unassigned" : doc.id;
                const appts = grouped[slot]?.[key] || [];
                return (
                  <td
                    key={key}
                    className="px-6 py-4 align-top space-y-2 border-r border-gray-300"
                    style={{ minWidth: "180px" }}
                  >
                    {appts.length === 0 ? (
                      <span className="text-gray-400 italic text-sm">-</span>
                    ) : (
                      appts.map((appt, i) => {
                        const bgColor = getSlotColor(appt, i);
                        return (
                          <div
                            key={appt.id}
                            onClick={() => handleEditClick(appt)}
                            className="cursor-pointer rounded-md border border-gray-200 p-3 text-gray-900 shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg"
                            title={`Click to edit appointment: ${appt.full_name}`}
                            style={{ backgroundColor: bgColor, color: "#1a1a1a" }}
                          >
                            <div className="font-semibold text-sm truncate">{appt.full_name}</div>
                            <div className="text-xs truncate">File: {appt.file_number || "N/A"}</div>
                            <div className="text-xs truncate mt-1">
                              Date: {appt.date ? new Date(appt.date).toLocaleDateString() : "N/A"}
                            </div>
                            <div className="text-xs mt-1">
                              Service: <span className="font-semibold">{appt.description || "N/A"}</span>
                            </div>
                            <div className="text-xs">
                              Payment:{" "}
                              <span
                                className={`font-semibold px-1 rounded ${paymentColor(
                                  appt.payment_status
                                )}`}
                              >
                                {appt.payment_status}
                              </span>
                            </div>
                            <div className="text-xs truncate mt-1">Time: {appt.appointment_start_time}</div>
                            {appt.notes && (
                              <div className="text-xs italic truncate mt-1" title={appt.notes}>
                                Notes: {appt.notes.length > 30 ? appt.notes.slice(0, 30) + "..." : appt.notes}
                              </div>
                            )}
                            <div className="text-xs mt-1">
                              Status:{" "}
                              <span
                                className={`font-semibold px-1 rounded ${statusColor(
                                  appt.appointment_status
                                )}`}
                              >
                                {appt.appointment_status}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
