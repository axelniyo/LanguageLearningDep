// API service for connecting to Node.js backend with XAMPP MariaDB
const BASE_URL = 'https://languagelearningdep.onrender.com/';

interface Language {
  id: string;
  name: string;
  code: string;
  flag_emoji: string;
  description: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  language: Language;
}

interface Lesson {
  id: string;
  name: string;
  description: string;
  lesson_type: string;
  order_index: number;
  xp_reward: number;
}

interface Unit {
  id: string;
  name: string;
  description: string;
  order_index: number;
  xp_reward: number;
  lessons: Lesson[];
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API functions - now connecting to real Node.js backend
export const api = {
  // Get all languages
  getLanguages: async (): Promise<Language[]> => {
    console.log('API: Fetching languages from backend at:', `${BASE_URL}/languages`);
    try {
      const response = await fetch(`${BASE_URL}/languages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response status:', response.status);
      const data = await handleResponse(response);
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  },

  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    console.log('API: Fetching courses from backend at:', `${BASE_URL}/courses`);
    try {
      const response = await fetch(`${BASE_URL}/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response status:', response.status);
      const data = await handleResponse(response);
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get course by ID
  getCourse: async (courseId: string): Promise<Course | null> => {
    console.log('API: Fetching course:', courseId);
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching course:', error);
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  // Get units for a course
  getCourseUnits: async (courseId: string): Promise<Unit[]> => {
    console.log('API: Fetching units for course:', courseId);
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}/units`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching units:', error);
      throw error;
    }
  },

  // Get lesson by ID
  getLesson: async (lessonId: string): Promise<Lesson | null> => {
    console.log('API: Fetching lesson:', lessonId);
    try {
      const response = await fetch(`${BASE_URL}/lessons/${lessonId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  // Enroll in a course (NEW)
  enrollInCourse: async (courseId: string, userId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${BASE_URL}/courses/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, userId }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  },

  // Mark a lesson as completed for a user
  markLessonCompleted: async (lessonId: string, userId: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch('https://languagelearningdep.onrender.com/api/lessons/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, userId }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error marking lesson completed:', error);
      throw error;
    }
  },

  // Get user progress for a course
  getCourseProgress: async (userId: string, courseId: string): Promise<{ total:number, completed:number, xp:number }> => {
    try {
      const response = await fetch(`${BASE_URL}/lessons/progress/${userId}/${courseId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching course progress:", error);
      throw error;
    }
  }
};

export type { Language, Course, Unit, Lesson };
