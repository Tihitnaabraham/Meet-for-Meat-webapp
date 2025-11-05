"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";

export default function GroupsPage() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex relative">
      <Link
        href="/authentication/signin"
        className="absolute top-10 left-10 p-6 rounded-full shadow transition"
        aria-label="Go back to groups"
      >
        <FaArrowLeft className="text-red-600 text-3xl" />
      </Link>

      <div
        className={`hidden md:flex fixed top-0 bottom-0 left-0 bg-red-700 rounded-l-lg z-20 transition-width duration-300 ${
          leftOpen ? "w-64" : "w-12"
        }`}
        onClick={() => setLeftOpen(!leftOpen)}
      />

      <div
        className={`hidden md:flex fixed top-0 bottom-0 right-0 bg-red-700 rounded-r-lg z-20 transition-width duration-300 ${
          rightOpen ? "w-64" : "w-12"
        }`}
        onClick={() => setRightOpen(!rightOpen)}
      />

      <div className="flex flex-col items-center p-8 space-y-16 w-full max-w-5xl mx-auto z-10">
        <div className="relative w-full flex justify-center">
          <div>
            <Image src="/logo.png" alt="Meet for Meat Logo" width={240} height={80} />
          </div>
        </div>

        <div className="text-center max-w-xl space-y-4" style={{ marginTop: "-2rem" }}>
          <p className="text-black text-lg leading-relaxed">
            Connect with your community to share quality, Assets Q + livestock and coordinate traditional feasts with trust and convenience.
          </p>
        </div>

        <div className="space-y-8 w-full max-w-xl">
          <Link
            href="/joingroups"
            className="flex items-center justify-center gap-4 bg-red-950 hover:bg-red-800 text-white font-bold py-7 rounded-lg shadow-md text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a4 4 0 00-3-3.87m-4-6a4 4 0 10-8 0 4 4 0 008 0zm6 8v2h-6v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h22v-2z"
              />
            </svg>
            Join Kircha Group
          </Link>

          <Link
            href="/creategroups"
            className="flex items-center justify-center gap-4 bg-red-600 hover:bg-red-800 text-white font-bold py-7 rounded-lg shadow-md text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Kircha Group
          </Link>

          <Link
            href="/joined"
            className="flex items-center justify-center gap-4 bg-red-800 hover:bg-red-900 text-white font-bold py-7 rounded-lg shadow-md text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a4 4 0 00-3-3.87m-4-6a4 4 0 10-8 0 4 4 0 008 0zm6 8v2h-6v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h22v-2z"
              />
            </svg>
            My Kircha Groups
          </Link>
        </div>

        <section className="w-full max-w-7xl text-black">
          <h2 className="text-center text-xl font-semibold mb-6 ">Why Choose Kircha Group?</h2>
          <div className="flex justify-between text-lg leading-relaxed">
            <div className="w-[30%]">
              <p className="font-bold">Verified Livestock</p>
              <p>All livestock verified for health and quality</p>
            </div>
            <div className="w-[30%]">
              <p className="font-bold">Secure Payments</p>
              <p>Safe and reliable payment processing</p>
            </div>
            <div className="w-[30%]">
              <p className="font-bold">Cultural Sensitivity</p>
              <p>Respectful of fasting days and traditions</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
