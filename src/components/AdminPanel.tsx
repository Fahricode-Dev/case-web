import { useState } from 'react';
import { useAppStore, Role } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, User as UserIcon, Settings, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminPanel() {
  const { endpoints, users, addEndpoint, deleteEndpoint, addUser, deleteUser, updateUserRole } = useAppStore();
  const [activeTab, setActiveTab] = useState<'endpoints' | 'users'>('endpoints');

  // Endpoint Form State
  const [epName, setEpName] = useState('');
  const [epUrl, setEpUrl] = useState('');
  const [epDesc, setEpDesc] = useState('');
  const [epType, setEpType] = useState('Plugin');
  const [epAccess, setEpAccess] = useState<'basic' | 'premium'>('basic');
  const [epCode, setEpCode] = useState('');

  // User Form State
  const [uName, setUName] = useState('');
  const [uPass, setUPass] = useState('');
  const [uRole, setURole] = useState<Role>('basic');
  const [showFormPass, setShowFormPass] = useState(false);

  // Per-user password visibility map
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const toggleUserPass = (id: string) =>
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    addEndpoint({ name: epName, url: epUrl, description: epDesc, type: epType, accessLevel: epAccess, codeSnippet: epCode });
    setEpName(''); setEpUrl(''); setEpDesc(''); setEpCode('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (uName && uPass) {
      addUser({ username: uName, password: uPass, role: uRole });
      setUName(''); setUPass(''); setURole('basic');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <Settings size={28} /> System Administration
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage platform content and user access.</p>
        </div>

        <div className="flex bg-neutral-200/50 dark:bg-neutral-800/50 p-1 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={cn("flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === 'endpoints' ? "bg-white dark:bg-neutral-700 shadow-sm" : "hover:text-neutral-900 dark:hover:text-neutral-100")}
          >
            Endpoints ({endpoints.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={cn("flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === 'users' ? "bg-white dark:bg-neutral-700 shadow-sm" : "hover:text-neutral-900 dark:hover:text-neutral-100")}
          >
            Users ({users.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'endpoints' ? (
          <motion.div key="endpoints" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <form onSubmit={handleAddEndpoint} className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm sticky top-24">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Plus size={18} /> Add New Endpoint</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-neutral-500">Name</label>
                    <input type="text" required value={epName} onChange={e => setEpName(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Sticker Plugin" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-neutral-500">URL / Path</label>
                    <input type="text" required value={epUrl} onChange={e => setEpUrl(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. /plugin/sticker.js" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-neutral-500">Type</label>
                      <select value={epType} onChange={e => setEpType(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                        <option>Plugin</option><option>Case</option><option>Script</option><option>API</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-neutral-500">Access Level</label>
                      <select value={epAccess} onChange={e => setEpAccess(e.target.value as any)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                        <option value="basic">Basic</option><option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-neutral-500">Description</label>
                    <textarea required value={epDesc} onChange={e => setEpDesc(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none h-20" placeholder="Brief description..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-neutral-500">Code Snippet</label>
                    <textarea required value={epCode} onChange={e => setEpCode(e.target.value)} className="w-full px-3 py-2 text-sm font-mono bg-neutral-900 text-green-400 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-y h-32" placeholder="console.log('Hello');" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm">Create Endpoint</button>
                </div>
              </form>
            </div>

            <div className="md:col-span-2 space-y-4">
              {endpoints.map((ep) => (
                <div key={ep.id} className="bg-white/40 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-purple-500/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{ep.name}</h4>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full uppercase font-bold", ep.accessLevel === 'premium' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400")}>{ep.accessLevel}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase font-bold">{ep.type}</span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono text-xs">{ep.url}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 line-clamp-1">{ep.description}</p>
                  </div>
                  <button onClick={() => deleteEndpoint(ep.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <form onSubmit={handleAddUser} className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm sticky top-24">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><UserIcon size={18} /> Add New User</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-neutral-500">Username</label>
                    <input type="text" required value={uName} onChange={e => setUName(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-neutral-500">Password</label>
                    <div className="relative">
                      <input
                        type={showFormPass ? 'text' : 'password'}
                        required
                        value={uPass}
                        onChange={e => setUPass(e.target.value)}
                        className="w-full px-3 py-2 pr-10 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFormPass(v => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                      >
                        {showFormPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-neutral-500">Role</label>
                    <select value={uRole} onChange={e => setURole(e.target.value as Role)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                      <option value="basic">Basic (Member)</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm">Create User</button>
                </div>
              </form>
            </div>

            <div className="md:col-span-2 space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white/40 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", user.role === 'premium' ? "bg-amber-500" : "bg-indigo-500")}>
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{user.username}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-neutral-500 font-mono">
                          {visiblePasswords[user.id] ? user.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleUserPass(user.id)}
                          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                        >
                          {visiblePasswords[user.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                      className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer appearance-none text-center",
                        user.role === 'premium' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800" : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                      )}
                    >
                      <option value="basic">BASIC</option>
                      <option value="premium">PREMIUM</option>
                    </select>
                    <button onClick={() => deleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
                  No users created yet. Add one from the sidebar.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
