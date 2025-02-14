import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { DatePicker } from 'antd';

export const action: ActionFunction = async ({ request }) => {
  const db = await getDB();
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number");
  const DOB = formData.get("DOB");
  const rg = Date.now();
  const role = formData.get("role");


  await db.run(
    'INSERT INTO employees (full_name,email,phone_number,DOB,Reg_date,emp_role) VALUES (?,?,?,?,?,?)',
    [full_name,
      email,
      phone_number,
      DOB,
      rg,
      role
    ],

  );
  return redirect("/employees");
}

export default function NewEmployeePage() {
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
      <h3 className="mb-5"><i className="bi bi-person-add me-3"></i>Create New Employee</h3>
      <Form method="post">
        <div>

          <div className="input-box">
            <input type="text" placeholder=" " name="full_name" id="full_name" required />
            <label htmlFor="full_name">Full Name</label>
          </div>

          <div className="input-box">
            <input type="email" placeholder=" " name="email" id="email" />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-box">
            <input type="text" placeholder=" " name="phone_number" id="phone_number" />
            <label htmlFor="phone_number">Phone Number</label>
          </div>

          <label htmlFor="DOB" className="me-3">Birthdate</label>
          <DatePicker name="DOB" id="DOB" onChange={onChange2} />
          <br />

          <label htmlFor="role" className="me-3 mt-4">Role</label>
          <select name="role" id="role" >
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
        <button type="submit" className="btn btn-success mt-3">Create Employee</button>
      </Form>
    </div>
  );
}


