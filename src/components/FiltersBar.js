import React from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function FiltersBar({ filters, setFilters }) {
  const doctors = ["Unassigned", "Ouhoud amer kawas", "Sherry susan philip", "Laila", "Treesa jose bbin"];
  const statuses = ["Confirmed", "Pending", "Rejected"];

  return (
    <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
      <TextField
        select
        label="Doctor or Nurse"
        value={filters.doctor}
        onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
        style={{ minWidth: "200px" }}
      >
        <MenuItem value="">- doctor or nurse -</MenuItem>
        {doctors.map((doc, i) => (
          <MenuItem key={i} value={doc}>{doc}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Select Status"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        style={{ minWidth: "150px" }}
      >
        <MenuItem value="">- select status -</MenuItem>
        {statuses.map((status, i) => (
          <MenuItem key={i} value={status}>{status}</MenuItem>
        ))}
      </TextField>

      <TextField
        label="File number..."
        value={filters.fileNumber}
        onChange={(e) => setFilters({ ...filters, fileNumber: e.target.value })}
      />

      <Button variant="contained" color="primary">Search</Button>

      <DatePicker
        label="Date"
        value={filters.date}
        onChange={(newValue) => setFilters({ ...filters, date: newValue })}
      />
    </div>
  );
}
