"use client";

import Image from "next/image";

export default function CertificationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Certification</h1>
      <p className="mb-4 text-gray-600">
        This certificate verifies the authenticity and validity of our Company.
      </p>
      <div className="border rounded-lg shadow-lg bg-white p-4">
        <Image
          src="/certification.png"
          alt=" Certification"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
    </div>
  );
}