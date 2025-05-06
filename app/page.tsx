import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to University Graduation Management System</h1>
        
        <div className="bg-white shadow-xl rounded-lg p-8 mb-10">
          <h2 className="text-3xl font-semibold mb-6 text-[rgb(var(--iyte-red))]">Streamlining the Graduation Process</h2>
          <p className="mb-6 text-lg text-gray-700">
            The Graduation Management System (GMS) is designed to simplify the graduation approval workflow
            from student eligibility checks to diploma generation.
          </p>
          
          <div className="flex justify-center mt-8">
            <Link 
              href="/login"
              className="bg-[rgb(var(--iyte-red))] hover:bg-opacity-80 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Role-Based Workflow"
            description="Different roles with specific responsibilities in the graduation approval process."
          />
          <FeatureCard
            title="Transcript Evaluation"
            description="Automated eligibility checks and multi-level approval system."
          />
          <FeatureCard
            title="Document Generation"
            description="Digital diploma and certificate generation with approval workflow."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="font-semibold text-xl mb-3 text-[rgb(var(--iyte-red))]">{title}</h3>
      <p className="text-gray-600 text-base">{description}</p>
    </div>
  );
} 