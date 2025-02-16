import { useLoaderData, Form, redirect, useSearchParams } from "react-router";
import { getDB } from "~/db/getDB";
import { useParams } from "react-router";

export async function loader({ params }: { params: { timesheetId: string } }) {
  const db = await getDB();
  //const { timesheetId } = useParams();
  const timesheetsAndEmployees = await db.get(
    "SELECT timesheets.*, employees.full_name,employees.phone_number,employees.emp_role,employees.email, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id Where employee_id = ?", [params.timesheetId]
  );
  console.log(timesheetsAndEmployees)
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { timesheetsAndEmployees, employees };
}

export default function TimesheetPage() {
  const [searchParams] = useSearchParams();
  const empid = searchParams.get("empid"); // Get `empid` from URL
  const { timesheetsAndEmployees } = useLoaderData() as { timesheetsAndEmployees: any }; // Used to create a select input
  const { employees } = useLoaderData();
  return (
    <div className="container mt-5">
      <h3><i className="bi bi-calendar-date"></i>  Update Timesheet</h3>
      <Form method="post">
        <div>
          <label htmlFor="employee_id">Employee</label>
          <select name="employee_id" id="employee_id" className="ms-3 mt-4 p-2 border-primary rounded" defaultValue={timesheetsAndEmployees.employee_id}>
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
          <input type="text" name="summary" defaultValue={timesheetsAndEmployees.summary} className="summary" placeholder=" " id="summary" />
          <label htmlFor="summary" >Summary (optional)</label>
        </div>
        <button type="submit" className="btn btn-warning mt-4">Update Timesheet</button>
        <a className="btn btn-danger mt-4 ms-4" href="/employee">Cancel</a>
      </Form>
    </div>
  );
}
