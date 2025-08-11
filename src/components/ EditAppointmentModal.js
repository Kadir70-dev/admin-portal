import React from "react";

export default function EditAppointmentModal({ editingAppt, formData, setFormData, setEditingAppt, handleSave }) {
  if (!editingAppt) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Appointment</h2>

        <label className="block mb-4">
          <span className="block text-sm font-semibold mb-1 text-gray-700">Status</span>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.appointment_status || ""}
            onChange={(e) => setFormData({ ...formData, appointment_status: e.target.value })}
          >
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </label>

        <label className="block mb-6">
          <span className="block text-sm font-semibold mb-1 text-gray-700">Payment Status</span>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.payment_status || ""}
            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
          >
            <option>Paid</option>
            <option>Pending</option>
            <option>Unpaid</option>
          </select>
        </label>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setEditingAppt(null)}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
