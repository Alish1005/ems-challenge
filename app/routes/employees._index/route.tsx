import { useLoaderData } from "react-router"
import { redirect } from "react-router";
import { getDB } from "~/db/getDB"
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useState, useEffect } from "react";
import { useDemoData } from '@mui/x-data-grid-generator';


export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")
  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData()
  console.log(employees)

  const DefaultColumns = [
    { field: "id", type: "string", headerName: "ID", width: 70, },
    { field: "full_name", type: "string", headerName: "Full Name", width: 170, },
    { field: "phone_number", headerName: "Phone Number", width: 120, type: "string", },
    { field: "email", headerName: "Email", width: 130, type: "string", },
    { field: "DOB", headerName: "Date of Birth", renderCell: (params: any) => (<div>{format(new Date(params.value), 'dd/MM/yyy')}</div>), width: 120, type: "Date", },
    { field: "emp_role", headerName: "Role", width: 150, type: "string", }, {
      field: "action", headerName: "Action", width: 170, sortable: false, disableExport: true, renderCell: (params: any) => {
        return (
          <div className="action">
            <a href={"/employees/" + params.row.id} className="text-warning fs-5 me-2" title="Edit"><i className="bi bi-pencil-fill"></i></a>
            <a href={"/timesheets/new?empid=" + params.row.id} className="text-info fs-5 ms-2" title="Add timesheet"><i className="bi bi-calendar-date"></i></a>
          </div>
        );
      },
    }
  ];

  return (
    <div className="container mt-5">
      <a href="/employees/new" className="btn btn-success">+ Add Employee</a>
      <div className="mt-5">
        <DataGrid
          rows={employees}
          columns={DefaultColumns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 30]}
          checkboxSelection
          //disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          disableVirtualization
          hideFooterPagination
        />
      </div>
    </div>
  )
}
