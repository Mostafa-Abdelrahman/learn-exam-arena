
import API from "./api.service";

const MajorService = {
  // Get all majors
  getAllMajors() {
    return API.get("/majors");
  },

  // Get a specific major
  getMajor(id: number) {
    return API.get(`/majors/${id}`);
  },

  // Create a new major (admin only)
  createMajor(majorData: any) {
    return API.post("/majors", majorData);
  },

  // Update a major (admin only)
  updateMajor(id: number, majorData: any) {
    return API.put(`/majors/${id}`, majorData);
  },

  // Delete a major (admin only)
  deleteMajor(id: number) {
    return API.delete(`/majors/${id}`);
  },
};

export default MajorService;
