import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('doctor');
  const [password, setPassword] = useState('doctor123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(username, password);
      loginUser(
        { username: data.username, role: data.role, full_name: data.full_name },
        data.access_token
      );
      navigate('/consent');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <div className="bg-medical-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-center font-bold text-2xl tracking-wider">
            CG
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          MEDSAFE
        </h2>
        <p className="mt-1 text-center text-sm text-medical-300 font-medium">
          Medication Safety & Clinical Decision Support
        </p>

        {/* Demo Notice Badge */}
        <div className="mt-3 flex justify-center">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
            <AlertCircle size={14} className="mr-1.5" />
            SYNTHETIC DATA DEMO ENVIRONMENT
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-medical-700 hover:bg-medical-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Clinical Workstation'}
              <ArrowRight size={16} className="ml-2" />
            </button>
          </form>

          {/* Quick Demo User Selectors */}
          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Quick Select Demo Persona
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('doctor', 'doctor123')}
                className="py-2 px-2 bg-slate-100 hover:bg-medical-50 hover:border-medical-300 border border-slate-200 rounded-lg text-center text-xs font-semibold text-slate-800 transition"
              >
                <div className="font-bold text-medical-800">Doctor</div>
                <div className="text-[10px] text-slate-500">doctor / doctor123</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('nurse', 'nurse123')}
                className="py-2 px-2 bg-slate-100 hover:bg-medical-50 hover:border-medical-300 border border-slate-200 rounded-lg text-center text-xs font-semibold text-slate-800 transition"
              >
                <div className="font-bold text-medical-800">Nurse</div>
                <div className="text-[10px] text-slate-500">nurse / nurse123</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('admin', 'admin123')}
                className="py-2 px-2 bg-slate-100 hover:bg-medical-50 hover:border-medical-300 border border-slate-200 rounded-lg text-center text-xs font-semibold text-slate-800 transition"
              >
                <div className="font-bold text-medical-800">Admin</div>
                <div className="text-[10px] text-slate-500">admin / admin123</div>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          MEDSAFE Decision Support Prototype • University Research Evaluation
        </p>
      </div>
    </div>
  );
};
