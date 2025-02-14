import { useLoaderData, Form, redirect, useSearchParams } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { employees };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id"); // <select /> input with name="employee_id"
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");

  const db = await getDB();
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time,summary) VALUES (?, ?, ?,?)',
    [employee_id, start_time, end_time, summary]
  );

  return redirect("/timesheets");
}

export default function NewTimesheetPage() {
  const [searchParams] = useSearchParams();
  const empid = searchParams.get("empid"); // Get `empid` from URL
  const { employees } = useLoaderData(); // Used to create a select input
  return (
    <div className="container mt-5">
      <h3><i className="bi bi-calendar-date"></i>  Create New Timesheet</h3>
      <Form method="post">
        <div>
          <label htmlFor="employee_id">Employee</label>
          <select name="employee_id" id="employee_id" className="ms-3 mt-4 p-2 border-primary rounded" defaultValue={empid}>
            {employees.map((employee: any) => (
              <option value={employee.id}>{employee.id} - {employee.full_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input type="datetime-local" className="ms-3 mt-4 p-2 border-primary rounded" name="start_time" id="start_time" required />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input type="datetime-local" className="ms-3 mt-4 p-2 border-primary rounded" name="end_time" id="end_time" required />
        </div>
        <div className="input-box mt-5">
          <input type="text" name="summary" className="summary" placeholder=" " id="summary" />
          <label htmlFor="summary" >Summary (optional)</label>
        </div>
        <button type="submit" className="btn btn-success mt-4">Create Timesheet</button>
      </Form>
    </div>
  );
}
