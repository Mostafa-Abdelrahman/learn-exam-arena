
import API from "./api.service";

const UserService = {
  // Get all users (admin only)
  getAllUsers() {
    return API.get("/users");
  },

  // Get a specific user
  getUser(id: number) {
    return API.get(`/users/${id}`);
  },

  // Create a new user (admin only)
  createUser(userData: any) {
    return API.post("/users", userData);
  },

  // Update a user (admin only)
  updateUser(id: number, userData: any) {
    return API.put(`/users/${id}`, userData);
  },

  // Delete a user (admin only)
  deleteUser(id: number) {
    return API.delete(`/users/${id}`);
  },

  // Reset user password (admin only)
  resetUserPassword(id: number) {
    return API.post(`/users/${id}/reset-password`);
  },

  // Get all students (admin only)
  getAllStudents() {
    return API.get("/students");
  },

  // Get all doctors (admin only)
  getAllDoctors() {
    return API.get("/doctors");
  },

  // Get all admins (admin only)
  getAllAdmins() {
    return API.get("/admins");
  },

  // Get student details
  getStudent(studentId: number) {
    return API.get(`/students/${studentId}`);
  },

  // Get doctor details
  getDoctor(doctorId: number) {
    return API.get(`/doctors/${doctorId}`);
  },

  // Create student (admin only)
  createStudent(studentData: any) {
    return API.post("/students", studentData);
  },

  // Create doctor (admin only)
  createDoctor(doctorData: any) {
    return API.post("/doctors", doctorData);
  },

  // Get system statistics (admin only)
  getSystemStats() {
    return API.get("/stats");
  },
};

export default UserService;
