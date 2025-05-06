"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { SessionUser } from '../../types';

export default function Header() {
  const { data: session } = useSession();
  
  // Access our custom user data from the session
  const user = session?.user as SessionUser | undefined;
  
  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user?.role) return '/';
    
    switch (user.role) {
      case 'STUDENT':
        return '/student';
      case 'ADVISOR':
        return '/advisor';
      case 'DEPARTMENT_SECRETARY':
        return '/department';
      case 'FACULTY_SECRETARY':
        return '/faculty';
      case 'STUDENT_AFFAIRS':
        return '/student-affairs';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white text-gray-800 shadow-md border-b-4 border-[rgb(var(--iyte-red))]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Image src="/images/iyte_logo.png" alt="IYTE Logo" width={40} height={40} />
          <span className="text-xl font-bold text-[rgb(var(--iyte-red))]">
            University GMS
          </span>
        </Link>
        
        <nav>
          <ul className="flex space-x-6 items-center">
            {user ? (
              <>
                <li>
                  <Link href={getDashboardLink()} className="hover:text-[rgb(var(--iyte-red))] transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="hover:text-[rgb(var(--iyte-red))] transition-colors"
                  >
                    Sign Out
                  </button>
                </li>
                <li className="font-semibold text-sm text-gray-700">
                  {user.firstName} {user.lastName} <span className="text-xs text-gray-500">({user.role})</span>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="bg-[rgb(var(--iyte-red))] hover:bg-opacity-80 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
} 