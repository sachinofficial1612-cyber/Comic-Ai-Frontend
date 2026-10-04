import {
  Project,
  CreateProjectPayload,
  Panel,
  GenerationStatus,
} from '../types/comic';

/**
 * ComicCraft API configuration
 *
 * Vercel:
 *   VITE_API_BASE_URL=https://YOUR-RENDER-BACKEND.onrender.com
 *
 * Local development:
 *   VITE_API_BASE_URL=http://127.0.0.1:8000
 *
 * The backend already exposes /api, so this file adds /api automatically.
 */

const configuredApiUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  import.meta.env.VITE_API_URL?.trim() ||
  '';

const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, '');

const API_BASE = normalizedApiUrl
  ? `${normalizedApiUrl}/api`
  : '/api';

console.log('[ComicCraft] API base URL:', API_BASE);

async function fetchJSON<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to connect to the backend server.';

    throw new Error(
      `Backend connection failed: ${message}`
    );
  }

  const contentType =
    response.headers.get('content-type') || '';

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;

    if (contentType.includes('application/json')) {
      try {
        const errorData = await response.json();

        if (typeof errorData?.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (typeof errorData?.error === 'string') {
          errorMessage = errorData.error;
        } else if (typeof errorData?.message === 'string') {
          errorMessage = errorData.message;
        }
      } catch {
        // Keep default HTTP error.
      }
    } else {
      try {
        const text = await response.text();

        if (text.trim()) {
          errorMessage =
            `HTTP ${response.status}: ${text
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 300)}`;
        }
      } catch {
        // Keep default HTTP error.
      }
    }

    throw new Error(errorMessage);
  }

  if (!contentType.includes('application/json')) {
    let responsePreview = '';

    try {
      responsePreview = (await response.text())
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 300);
    } catch {
      // Ignore parsing error.
    }

    throw new Error(
      `Backend returned a non-JSON response.${
        responsePreview
          ? ` Response: ${responsePreview}`
          : ''
      }`
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error('Backend returned invalid JSON.');
  }
}

export const api = {
  // ============================================================
  // HEALTH
  // ============================================================

  getHealth: () =>
    fetchJSON<{
      status: string;
      gemini_configured: boolean;
    }>(`${API_BASE}/health`),

  getAIHealth: () =>
    fetchJSON<{
      configured: boolean;
      text_model: string;
      image_model: string;
    }>(`${API_BASE}/health/ai`),

  // ============================================================
  // PROJECTS
  // ============================================================

  createProject: (payload: CreateProjectPayload) =>
    fetchJSON<Project>(`${API_BASE}/projects`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listProjects: () =>
    fetchJSON<Project[]>(`${API_BASE}/projects`),

  getProject: (id: string) =>
    fetchJSON<Project>(
      `${API_BASE}/projects/${encodeURIComponent(id)}`
    ),

  getDemoProject: () =>
    fetchJSON<Project>(`${API_BASE}/projects/demo`, {
      method: 'POST',
    }),

  updateProject: (
    id: string,
    updates: Partial<Project>
  ) =>
    fetchJSON<Project>(
      `${API_BASE}/projects/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    ),

  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE}/projects/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
  },

  // ============================================================
  // AI COMIC GENERATION
  // ============================================================

  generateComic: (id: string) =>
    fetchJSON<Project>(
      `${API_BASE}/projects/${encodeURIComponent(id)}/generate`,
      {
        method: 'POST',
      }
    ),

  getProjectStatus: (id: string) =>
    fetchJSON<GenerationStatus>(
      `${API_BASE}/projects/${encodeURIComponent(id)}/status`
    ),

  // ============================================================
  // PANELS
  // ============================================================

  updatePanel: (
    projectId: string,
    panelId: string,
    updates: Partial<Panel>
  ) =>
    fetchJSON<Panel>(
      `${API_BASE}/projects/${encodeURIComponent(
        projectId
      )}/panels/${encodeURIComponent(panelId)}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    ),

  regeneratePanelImage: (
    projectId: string,
    panelId: string
  ) =>
    fetchJSON<Panel>(
      `${API_BASE}/projects/${encodeURIComponent(
        projectId
      )}/panels/${encodeURIComponent(
        panelId
      )}/regenerate-image`,
      {
        method: 'POST',
      }
    ),

  regeneratePanelStory: (
    projectId: string,
    panelId: string
  ) =>
    fetchJSON<Panel>(
      `${API_BASE}/projects/${encodeURIComponent(
        projectId
      )}/panels/${encodeURIComponent(
        panelId
      )}/regenerate-story`,
      {
        method: 'POST',
      }
    ),

  regeneratePanelBoth: (
    projectId: string,
    panelId: string
  ) =>
    fetchJSON<Panel>(
      `${API_BASE}/projects/${encodeURIComponent(
        projectId
      )}/panels/${encodeURIComponent(
        panelId
      )}/regenerate-both`,
      {
        method: 'POST',
      }
    ),

  deletePanel: (
    projectId: string,
    panelId: string
  ) =>
    fetchJSON<{
      message: string;
      remaining_panels: number;
    }>(
      `${API_BASE}/projects/${encodeURIComponent(
        projectId
      )}/panels/${encodeURIComponent(panelId)}`,
      {
        method: 'DELETE',
      }
    ),

  addPanel: (projectId: string) =>
    fetchJSON<Panel>(
      `${API_BASE}/projects/${encodeURIComponent(
        projectId
      )}/panels`,
      {
        method: 'POST',
      }
    ),

  // ============================================================
  // EXPORTS
  // ============================================================

  exportPDF: (projectId: string) =>
    fetchJSON<{
      download_url: string;
      filename: string;
    }>(
      `${API_BASE}/projects/${encodeURIComponent(
        projectId
      )}/export/pdf`,
      {
        method: 'POST',
      }
    ),

  exportPNG: (projectId: string) =>
    fetchJSON<{
      pages: {
        download_url: string;
        filename: string;
      }[];
    }>(
      `${API_BASE}/projects/${encodeURIComponent(
        projectId
      )}/export/png`,
      {
        method: 'POST',
      }
    ),
};
