
declare interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "doctor" | "admin";
  gender?: "male" | "female" | "other";
  major_id?: string;
  created_at?: string;
  updated_at?: string;
  major?: {
    id: string;
    name: string;
  };
}

declare interface Student extends User {
  role: "student";
  student_id?: string;
  enrollment_date?: string;
}

declare interface Doctor extends User {
  role: "doctor";
  doctor_id?: string;
  department?: string;
  specialization?: string;
}

declare interface Admin extends User {
  role: "admin";
}
