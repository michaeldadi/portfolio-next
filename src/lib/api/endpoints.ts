// lib/api/endpoints.ts

// Base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const GITHUB_API = 'https://api.github.com';

// API Endpoints
export const endpoints = {
  // Analytics
  analytics: {
    track: '/analytics/track',
    pageView: '/analytics/page-view',
    projectView: (id: string) => `/analytics/project/${id}/view`,
  },

  // External APIs
  github: {
    user: (username: string) => `${GITHUB_API}/users/${username}`,
    repos: (username: string) => `${GITHUB_API}/users/${username}/repos`,
    stats: (owner: string, repo: string) => `${GITHUB_API}/repos/${owner}/${repo}`,
  },

  // Resume
  resume: {
    download: '/resume/download',
    view: '/resume/view',
  },
} as const;

// Helper to build full URLs
export const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean>) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

// Type-safe API caller
export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}
