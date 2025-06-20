
import LocalStorageService from './local-storage.service';
import { Major } from '@/types/major';

class MajorService {
  // Get all majors
  async getAllMajors(): Promise<{ data: Major[] }> {
    LocalStorageService.initializeData();
    return { data: LocalStorageService.getMajors() };
  }

  // Get major statistics
  async getMajorStats(): Promise<{ data: any }> {
    LocalStorageService.initializeData();
    return { data: LocalStorageService.getMajorStats() };
  }

  // Create new major
  async createMajor(majorData: Partial<Major>): Promise<{ data: Major; message: string }> {
    const newMajor = LocalStorageService.createMajor(majorData);
    return {
      data: newMajor,
      message: 'Major created successfully'
    };
  }

  // Update major
  async updateMajor(id: string, majorData: Partial<Major>): Promise<{ data: Major; message: string }> {
    const updatedMajor = LocalStorageService.updateMajor(id, majorData);
    if (!updatedMajor) {
      throw new Error('Major not found');
    }
    return {
      data: updatedMajor,
      message: 'Major updated successfully'
    };
  }

  // Delete major
  async deleteMajor(id: string): Promise<{ message: string }> {
    const success = LocalStorageService.deleteMajor(id);
    if (!success) {
      throw new Error('Major not found');
    }
    return { message: 'Major deleted successfully' };
  }

  // Get major by ID
  async getMajorById(id: string): Promise<{ data: Major }> {
    LocalStorageService.initializeData();
    const majors = LocalStorageService.getMajors();
    const major = majors.find(m => m.id === id);
    if (!major) {
      throw new Error('Major not found');
    }
    return { data: major };
  }
}

export default new MajorService();
