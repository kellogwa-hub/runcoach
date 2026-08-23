import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'coach') {
    redirect('/pwa/home');
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Coach Dashboard Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-green-600 p-2 rounded-lg font-black text-xl tracking-wider">RC</span>
            <span className="font-bold text-lg hidden sm:inline">Dasbor Pelatih</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right text-xs sm:text-sm">
              <div className="font-semibold text-slate-200">{profile?.full_name}</div>
              <div className="text-green-400 font-mono text-xs">Pelatih Lari</div>
            </div>

            <form action="/auth/login">
              <button
                type="submit"
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
