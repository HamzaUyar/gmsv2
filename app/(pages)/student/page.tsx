"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getStudentTranscript } from '../../lib/api';

// Placeholder icons - replace with actual icons from a library like react-icons
const UserIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>;
const StatusIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>;
const TranscriptIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm5 2H5v1h2V8zm1 0h1v1H8V8zm2 0h2v1h-2V8zm5 0h-1v1h1V8zM4 12h12V6H4v6z"></path></svg>;

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTranscript() {
      const user = session?.user as User;
      if (user?.ubysId) {
        setLoading(true);
        try {
          const data = await getStudentTranscript(user.ubysId);
          setTranscript(data);
        } catch (err) {
          setError('Failed to load transcript');
          console.error('Transcript loading error:', err);
        } finally {
          setLoading(false);
        }
      }
    }

    if (status === 'authenticated') {
      loadTranscript();
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  const user = session?.user as User;

  // Extract GPA and credits from transcript data if available
  const gpa = transcript?.summary?.cumulativeGpa || 'N/A';
  const totalCredits = transcript?.summary?.totalCreditsEarned || 'N/A';
  const graduationStatus = transcript?.summary?.graduationStatusUBYS || 'Unknown';

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[rgb(var(--primary))]">Student Dashboard</h1>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
          <UserIcon /> Your Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">UBYS ID</p>
            <p className="text-lg font-medium text-gray-800">{user?.ubysId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium text-gray-800">{user?.role}</p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
              <StatusIcon /> Graduation Status
            </h2>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  graduationStatus === 'Eligible' ? 'bg-green-500' : 
                  graduationStatus === 'Potentially Eligible' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <p className="text-lg text-gray-800">
                  {graduationStatus === 'Eligible' ? 'Eligible for Graduation' : 
                   graduationStatus === 'Potentially Eligible' ? 'Pending Advisor Approval' : 'Not Eligible'}
                </p>
              </div>
              <p className="text-gray-600 text-base ml-7">
                {graduationStatus === 'Potentially Eligible' 
                  ? 'Your transcript is being reviewed by your advisor.'
                  : graduationStatus === 'Eligible'
                  ? 'Your graduation has been approved.'
                  : 'You have not completed all requirements.'}
              </p>
            </div>
          </div>
          <Button variant="primary" className="self-start mt-6">View Details</Button>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
              <TranscriptIcon /> Your Transcript
            </h2>
            {error ? (
              <div className="text-red-500 mb-4">{error}</div>
            ) : (
              <div className="space-y-3 mb-6">
                <p className="text-gray-600 text-base">GPA: <span className="font-semibold text-lg text-gray-800">{typeof gpa === 'number' ? gpa.toFixed(2) : gpa}</span></p>
                <p className="text-gray-600 text-base">Total Credits: <span className="font-semibold text-lg text-gray-800">{totalCredits}</span></p>
              </div>
            )}
          </div>
          <Button variant="primary" className="self-start mt-6">View Transcript</Button>
        </Card>
      </div>
    </div>
  );
} 