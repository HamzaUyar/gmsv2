// Utility functions for fetching data from mock API endpoints

// Base URL for API calls
const API_BASE_URL = '/api/mock/ubys';

// Generic fetch function with error handling
async function fetchAPI(endpoint: string, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Auth-related functions
export async function loginUser(username: string) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
}

// Student-related functions
export async function getStudents(params?: {
  departmentUbysId?: string;
  facultyUbysId?: string;
  advisorUbysId?: string;
  classLevel?: number;
}) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.departmentUbysId) queryParams.append('departmentUbysId', params.departmentUbysId);
    if (params.facultyUbysId) queryParams.append('facultyUbysId', params.facultyUbysId);
    if (params.advisorUbysId) queryParams.append('advisorUbysId', params.advisorUbysId);
    if (params.classLevel) queryParams.append('classLevel', params.classLevel.toString());
  }
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/users/students?${queryString}` : '/users/students';
  
  return fetchAPI(endpoint);
}

// Faculty-related functions
export async function getFaculties() {
  return fetchAPI('/faculties');
}

// Department-related functions
export async function getDepartments(facultyUbysId?: string) {
  const queryParams = facultyUbysId ? `?facultyUbysId=${facultyUbysId}` : '';
  return fetchAPI(`/departments${queryParams}`);
}

// Staff-related functions (advisors, department secretaries, etc.)
export async function getStaff() {
  return fetchAPI('/users/staff');
}

// Transcript-related functions
export async function getStudentTranscript(studentUbysId: string) {
  return fetchAPI(`/transcripts/${studentUbysId}`);
} 