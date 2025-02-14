import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { getDB } from "~/db/getDB";
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"

import '@schedule-x/theme-default/dist/index.css'
import CalendarApp from "../calendar/Calendar";

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name,employees.phone_number,employees.emp_role,employees.email, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );
  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [getTog, setTog] = useState<boolean>(true)
  const onTog = () => {
    const t = !getTog;
    setTog(t)
  }
  const Tevents = timesheetsAndEmployees.map((i: any) => ({ id: i.id.toString(), title: i.full_name, start: format(new Date(i.start_time), 'yyyy-MM-dd HH:mm'), end: format(new Date(i.end_time), 'yyyy-MM-dd HH:mm') }))
  console.log(Tevents)

  const DefaultColumns = [
    { field: "id", type: "string", headerName: "ID", width: 70, },
    { field: "full_name", type: "string", headerName: "Full Name", width: 140, },
    { field: "phone_number", headerName: "Phone Number", width: 120, type: "string", },
    { field: "email", headerName: "Email", width: 130, type: "string", },
    { field: "start_time", headerName: "Start Time", renderCell: (params: any) => (<div>{format(new Date(params.value), 'dd/MM/yyy hh:mm a')}</div>), width: 150, type: "Date", },
    { field: "end_time", headerName: "End Time", renderCell: (params: any) => (<div>{format(new Date(params.value), 'dd/MM/yyy hh:mm a')}</div>), width: 150, type: "Date", },
    { field: "emp_role", headerName: "Role", width: 150, type: "string", },
    {
      field: "action", headerName: "Action", width: 170, sortable: false, disableExport: true, renderCell: (params: any) => {
        return (
          <div className="action">
            <a href={"/timesheets/" + params.row.id} className="text-warning fs-5 me-2" title="Edit"><i className="bi bi-pencil-fill"></i></a>
          </div>
        );
      },
    }
  ];

  return (
    <div className="container mt-5">
      <div>
        {!getTog ? <button onClick={onTog} className="btn btn-info mb-3">Table View</button> : <button onClick={onTog} className="btn btn-info mb-3">Calendar View</button>}
        <a href="/timesheets/new" className="btn btn-success mb-3 ms-3">+ Add Timesheet</a>
      </div>
      {getTog ? (
        <div>
          <DataGrid
            rows={timesheetsAndEmployees}
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
      ) : (
        <div>
          <CalendarApp data={Tevents} />
        </div>
      )}
    </div>
  );
}
