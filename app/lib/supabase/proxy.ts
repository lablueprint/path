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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and supabase.auth.getClaims()
  // IMPORTANT: if remove getClaims() and use server-side rendering with Supabase client, users may be randomly logged out

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // If unauthenticated user tries to access a page other than /sign-up or /sign-in, redirect to /sign-in
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/sign-in') &&
    !request.nextUrl.pathname.startsWith('/sign-up')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }
  // If authenticated user tries to access /sign-up or /sign-in, redirect to /home
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/sign-in') ||
      request.nextUrl.pathname.startsWith('/sign-up'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }
  // Restrict access to /profile
  if (request.nextUrl.pathname.startsWith('/profile')) {
    const allowedRoles = ['requestor', 'admin', 'superadmin', 'owner'];
    if (!user || !allowedRoles.includes(user.user_role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }
  }

  // Refresh auth token
  await supabase.auth.getUser();

  return supabaseResponse;
}
