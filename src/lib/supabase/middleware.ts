import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Protected routes check
  if (!user && (path.startsWith('/dashboard') || path.startsWith('/pwa') || path.startsWith('/onboarding'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // If user is authenticated, check role for routing
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // If profile has no role set and user is not on onboarding/role, redirect to role selection
    if (!profile?.role && !path.startsWith('/onboarding/role') && !path.startsWith('/auth')) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding/role';
      return NextResponse.redirect(url);
    }

    // Role-based route protection
    if (profile?.role === 'coach' && path.startsWith('/pwa')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (profile?.role === 'runner' && path.startsWith('/dashboard')) {
      const url = request.nextUrl.clone();
      url.pathname = '/pwa/home';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
