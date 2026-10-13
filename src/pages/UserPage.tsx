import { useEffect, useState } from 'react';
import { supabase, type Profile } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/PageHeader';
import {
  UserCog,
  Loader2,
  Shield,
  Stethoscope,
  User as UserIcon,
  Mail,
  Calendar,
} from 'lucide-react';

const roleConfig: Record<string, { label: string; icon: typeof Shield; className: string }> = {
  admin: { label: 'Admin', icon: Shield, className: 'bg-teal-50 text-teal-600' },
  staff: { label: 'Staff', icon: UserIcon, className: 'bg-blue-50 text-blue-600' },
  doctor: { label: 'Doctor', icon: Stethoscope, className: 'bg-emerald-50 text-emerald-600' },
};

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

export default function UsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Fetch emails from auth - we can't directly query auth.users,
      // so we use the profiles + a join approach via supabase auth admin
      // Since we can't access auth.users from the client, we'll show what we have
      const profiles = (data ?? []) as Profile[];
      const userRows: UserRow[] = profiles.map((p) => ({
        id: p.id,
        email: '—',
        full_name: p.full_name,
        role: p.role,
        created_at: p.created_at,
      }));

      setUsers(userRows);
      setLoading(false);
    }
    load();
  }, []);

  const isAdmin = profile?.role === 'admin';

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${users.length} user${users.length !== 1 ? 's' : ''} with dashboard access`}
        action={
          !isAdmin && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-2 rounded-xl">
              Admin access required to manage users
            </div>
          )
        }
      />

      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <p className="font-semibold">View-only access</p>
            <p className="mt-0.5">
              You are signed in as <span className="font-semibold capitalize">{profile?.role}</span>.
              Only admin users can create new accounts or change roles. New user accounts are created
              through the sign-up page.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <UserCog className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-50">
            {users.map((user) => {
              const role = roleConfig[user.role] ?? roleConfig.staff;
              const RoleIcon = role.icon;
              const isCurrentUser = user.id === profile?.id;

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-600 font-semibold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800 truncate">{user.full_name}</h3>
                      {isCurrentUser && (
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${role.className}`}
                    >
                      <RoleIcon className="w-3.5 h-3.5" />
                      {role.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
