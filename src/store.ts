import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'basic' | 'premium';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
}

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  description: string;
  type: string;
  accessLevel: 'basic' | 'premium';
  codeSnippet: string;
}

interface AppState {
  users: User[];
  endpoints: Endpoint[];
  currentUser: User | null;
  theme: 'light' | 'dark';

  // Actions
  login: (username: string, password?: string, isAdmin?: boolean) => boolean;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Admin Actions
  addUser: (user: Omit<User, 'id'>) => void;
  updateUserRole: (id: string, role: Role) => void;
  deleteUser: (id: string) => void;

  addEndpoint: (endpoint: Omit<Endpoint, 'id'>) => void;
  updateEndpoint: (id: string, endpoint: Partial<Endpoint>) => void;
  deleteEndpoint: (id: string) => void;
}

const initialEndpoints: Endpoint[] = [
  {
    id: '1',
    name: 'Get User Profile',
    url: '/api/v1/profile',
    description: 'Fetch basic user profile information.',
    type: 'API Endpoint',
    accessLevel: 'basic',
    codeSnippet: 'fetch("/api/v1/profile")\n  .then(res => res.json())\n  .then(console.log);'
  },
  {
    id: '2',
    name: 'WhatsApp Auto Reply Plugin',
    url: 'plugin/autoreply.js',
    description: 'Advanced auto-reply plugin with regex matching.',
    type: 'Plugin',
    accessLevel: 'premium',
    codeSnippet: 'export default function AutoReply(msg) {\n  if (msg.body.match(/hello/i)) return "Hi there!";\n}'
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [],
      endpoints: initialEndpoints,
      currentUser: null,  // persisted — auto-login saat refresh
      theme: 'light',

      login: (username, password, isAdmin) => {
        if (isAdmin) {
          if (password === 'NEV1980') {
            set({ currentUser: { id: 'admin', username: 'Administrator', role: 'admin' } });
            return true;
          }
          return false;
        }

        const user = get().users.find(
          u => u.username === username && u.password === password
        );
        if (user) {
          // Simpan tanpa field password di currentUser (keamanan)
          set({ currentUser: { id: user.id, username: user.username, role: user.role } });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      addUser: (user) => set((state) => ({
        users: [...state.users, { ...user, id: crypto.randomUUID() }]
      })),

      updateUserRole: (id, role) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, role } : u)
      })),

      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),

      addEndpoint: (endpoint) => set((state) => ({
        endpoints: [...state.endpoints, { ...endpoint, id: crypto.randomUUID() }]
      })),

      updateEndpoint: (id, endpoint) => set((state) => ({
        endpoints: state.endpoints.map(e => e.id === id ? { ...e, ...endpoint } : e)
      })),

      deleteEndpoint: (id) => set((state) => ({
        endpoints: state.endpoints.filter(e => e.id !== id)
      }))
    }),
    {
      name: 'nnevv-storage',
      // Persist semua state termasuk currentUser, users, endpoints, theme
    }
  )
);
