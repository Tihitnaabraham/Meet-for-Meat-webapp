"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

export default function ChooseGroupSizePage() {
  const [selectedGroupPrice, setSelectedGroupPrice] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const priceStr = localStorage.getItem("selectedGroupPrice");
      if (priceStr) {
        const priceNum = Number(priceStr);
        if (!isNaN(priceNum)) {
          setSelectedGroupPrice(priceNum);
        }
      }
    }
  }, []);

  const getPerMember = (members: number) => {
    if (!selectedGroupPrice) return "-";
    return `${Math.round(selectedGroupPrice / members).toLocaleString("en-ET")} ETB`;
  };

  function handleContinue(type: "half" | "full") {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedKirchaType", type);
      router.push("/registerdate");
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col relative overflow-x-hidden">
      <Link
        href="/creategroups"
        prefetch={false}
        className="absolute top-8 left-4 sm:top-10 sm:left-10 p-5 sm:p-7 lg:p-10 rounded-full shadow transition"
        aria-label="Go back to groups"
      >
        <FaArrowLeft className="text-red-600 text-2xl sm:text-3xl lg:text-4xl" />
      </Link>

      <div className="fixed left-0 top-0 h-full w-16 bg-red-700 z-0 hidden 2xl:block" />
      <div className="fixed right-0 top-0 h-full w-16 bg-red-700 z-0 hidden 2xl:block" />

      <div className="flex flex-col items-center pt-4 w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-10 w-full max-w-7xl">
          <Image
            src="/logo.png"
            alt="Meet for Meat"
            width={256}
            height={128}
            className="w-36 sm:w-44 md:w-52 xl:w-64 mt-4 mb-2"
          />
        </div>

        <div className="w-full max-w-7xl">
          <h2 className="font-bold text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-4xl mb-2 text-center md:text-left">
            Choose Group Size
          </h2>
          <p className="mb-5 text-black text-sm sm:text-sm md:text-base lg:text-base xl:text-lg text-center md:text-left">
            Select how many members can join your group
          </p>

          <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 w-full mb-16">
            <div className="rounded-lg p-6 sm:p-8 flex-1 min-w-0 sm:min-w-[280px] md:min-w-[400px] bg-white shadow-2xl border border-gray-100 mb-8 xl:mb-0 xl:mr-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">Half Kircha</span>
                <span className="bg-red-700 text-white px-3 py-1 rounded-full text-sm sm:text-base font-bold">
                  Up to 20 Members
                </span>
              </div>
              <p className="mb-5 text-black text-xs sm:text-sm md:text-base lg:text-base">Perfect for large community gatherings</p>
              <span className="block text-red-600 text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold mb-1">
                {getPerMember(20)}
              </span>
              <span className="text-red-900 font-bold text-xs sm:text-sm md:text-base lg:text-base">per member</span>
            </div>

            <div className="rounded-lg p-6 sm:p-8 flex-1 min-w-0 sm:min-w-[280px] md:min-w-[400px] bg-white shadow-2xl border border-gray-100 xl:ml-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">Full Kircha</span>
                <span className="bg-red-700 text-white px-3 py-1 rounded-full text-sm sm:text-base font-bold">
                  Up to 10 Members
                </span>
              </div>
              <p className="mb-5 text-black text-xs sm:text-sm md:text-base lg:text-base">Perfect for small community gatherings</p>
              <span className="block text-red-600 text-lg sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold mb-1">
                {getPerMember(10)}
              </span>
              <span className="text-red-900 font-bold text-xs sm:text-sm md:text-base lg:text-base">per member</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center w-full mt-8">
            <button
              className="bg-red-700 hover:bg-red-800 text-white text-base sm:text-lg md:text-xl font-bold rounded-lg flex-1 py-3 px-5 shadow-lg transition-colors duration-200 md:mr-4"
              onClick={() => handleContinue("half")}
            >
              Continue Half
            </button>
            <button
              className="bg-red-700 hover:bg-red-800 text-white text-base sm:text-lg md:text-xl font-semibold rounded-lg flex-1 py-3 px-5 shadow-lg transition-colors duration-200 md:ml-4"
              onClick={() => handleContinue("full")}
            >
              Continue Full
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
