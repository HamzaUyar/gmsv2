import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface CustomToken {
  user?: {
    role?: string;
  };
}

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = ["/", "/login"];

  // API routes that should be excluded from middleware checks
  const excludedApiRoutes = [
    "/api/auth",
    "/api/mock/ubys"
  ];
  
  // Check if the path is an excluded API route
  const isExcludedApiRoute = excludedApiRoutes.some(route => path.startsWith(route));
  
  // Role-specific path prefixes
  const rolePathMapping = {
    STUDENT: "/student",
    ADVISOR: "/advisor",
    DEPARTMENT_SECRETARY: "/department",
    FACULTY_SECRETARY: "/faculty",
    STUDENT_AFFAIRS: "/student-affairs",
  };
  
  // Check if the path is public or an excluded API route
  const isPublicPath = publicPaths.includes(path) || isExcludedApiRoute || path.startsWith("/_next");
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Check if there's already a redirect count in the URL to prevent redirect loops
  const url = new URL(request.url);
  const redirectCount = parseInt(url.searchParams.get('redirectCount') || '0');
  
  // If we've redirected too many times, just proceed to prevent a loop
  if (redirectCount > 2) {
    console.log("Too many redirects detected, proceeding with the request");
    return NextResponse.next();
  }
  
  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  }) as CustomToken | null;
  
  // If there's no token and the user tried to access a protected route
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }
  
  // Get the user role from token
  const userRole = token.user?.role;
  
  // Check if user is trying to access a role-specific area
  // that doesn't match their role
  let isAccessingForbiddenRoute = false;
  
  Object.entries(rolePathMapping).forEach(([role, pathPrefix]) => {
    if (path.startsWith(pathPrefix) && userRole !== role) {
      isAccessingForbiddenRoute = true;
    }
  });
  
  // Redirect to appropriate dashboard if trying to access forbidden route
  if (isAccessingForbiddenRoute) {
    // Find the user's allowed path based on their role
    const allowedPath = userRole ? rolePathMapping[userRole as keyof typeof rolePathMapping] : "/";
    const redirectUrl = new URL(allowedPath, request.url);
    
    // Increment redirect count to prevent loops
    redirectUrl.searchParams.set('redirectCount', (redirectCount + 1).toString());
    
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

// Apply middleware to all routes except public assets and auth API
export const config = {
  matcher: [
    // Apply to all paths except:
    "/((?!api/auth|api/mock|_next/static|_next/image|favicon.ico).*)",
    // But include these specific paths
    "/"
  ],
}; 