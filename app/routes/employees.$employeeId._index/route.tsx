import { useLoaderData } from "react-router"
import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB"
import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { format } from "date-fns"
import { useParams } from "react-router";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export async function loader({ params }: { params: { employeeId: string } }) {
  const db = await getDB()
  console.log(params.employeeId)
  const employee = await db.get('SELECT * FROM employees WHERE id = ?;', [params.employeeId])
  console.log(employee)
  return { employee }
}
export const action: ActionFunction = async ({ request }) => {
  const db = await getDB();
  const { employeeId } = useParams();
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number");
  const DOB = formData.get("DOB");
  const role = formData.get("role");
  console.log(full_name)

  await db.run(
    'UPDATE employee SET full_name = ?,email = ?,phone_number = ?,DOB = ?,emp_role = ? WHERE id = ?;',
    [full_name,
      email,
      phone_number,
      DOB,
      role,
      employeeId
    ],

  );
  return redirect("/employees");
}
export default function EmployeePage() {
  const { employee } = useLoaderData() as { employee: any }
  const [getImg, setImg] = useState<string>("Hello, World!")
  function resizeFile(file: any) {
    //console.log(file)
    return (new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500,
        500,
        "JPEG",
        20,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    }))
  }

  const saveimg = async (file: any) => {
    try {
      var i = await resizeFile(file.target.files[0])
      setImg(`${i}`);
    } catch (err) {
      console.log(err);
    }
  }

  const onChange2: any = (date: any, dateString: string) => {
    console.log(date, dateString);
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-5"><i className="bi bi-person-gear me-3"></i>Update New Employee</h3>
      <Form method="put">
        <div>

          <div className="input-box">
            <input type="text" placeholder=" " defaultValue={employee.full_name} name="full_name" id="full_name" required />
            <label htmlFor="full_name">Full Name</label>
          </div>

          <div className="input-box">
            <input type="email" placeholder=" " defaultValue={employee.email} name="email" id="email" />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-box">
            <input type="text" placeholder=" " defaultValue={employee.phone_number} name="phone_number" id="phone_number" />
            <label htmlFor="phone_number">Phone Number</label>
          </div>

          <label htmlFor="DOB" className="me-3">Birthdate</label>
          <DatePicker name="DOB" id="DOB" defaultValue={dayjs(employee.DOB, "dd/MM/yyyy")} onChange={onChange2} />
          <br />

          <label htmlFor="role" className="me-3 mt-4">Role</label>
          <select name="role" defaultValue={employee.emp_role} id="role" >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full-Stack Developer">Full-Stack Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="UX/UI Designer">UX/UI Designer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Cybersecurity Engineer">Cybersecurity Engineer</option>
            <option value="Cloud Engineer">Cloud Engineer</option>
          </select>
          <br />

          <label htmlFor="cv" className="me-3 mt-4">Upload CV</label>
          <input type="file" name="cv" id="cv" accept=" .pdf" />
          <br />

          {getImg != "" ? <img src={getImg} /> : <img />}
          <label htmlFor="Avatar" className="me-3 mt-4">Upload Photo (optional)</label>
          <input type="file" onChange={e => { saveimg(e) }} name="Avatar" id="Avatar" accept=" .jpg, .jpeg, .png, .webp" />
          <br />


        </div>
        <button type="submit" className="btn btn-warning mt-3">Update Employee</button>
        <a className="btn btn-danger mt-3 ms-3" href="/employees" >Cancel</a>
      </Form>
    </div>
  );
}
