"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useCreateGroups, Group } from "../hooks/useCreateGroups";
import Image from "next/image";

const DEFAULT_IMAGE = "/default-animal.jpeg";
function AnimalCard({ animal }: { animal: Group }) {
  const [imgSrc, setImgSrc] = useState(animal.image || DEFAULT_IMAGE);

  const recordSelection = (id: number, priceTotal: string) => {
    if (typeof window === "undefined") return;
    let selection = { ids: [] as number[], prices: [] as string[] };
    const stored = localStorage.getItem("selectedLivestock");
    if (stored) {
      try {
        selection = JSON.parse(stored);
        if (!selection.ids || !selection.prices) {
          selection = { ids: [], prices: [] };
        }
      } catch {
        selection = { ids: [], prices: [] };
      }
    }
    if (!selection.ids.includes(id)) {
      selection.ids.push(id);
      selection.prices.push(priceTotal);
      localStorage.setItem("selectedLivestock", JSON.stringify(selection));
    }
    localStorage.setItem("selectedGroupPrice", priceTotal);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-5 relative transition-transform duration-300 hover:scale-[1.025] h-[520px]">
      <div className="relative w-full h-64 mb-4">
        <Image
          src={imgSrc}
          alt={animal.breed}
          fill
          className="object-cover rounded-md"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex justify-between text-lg mb-4 px-3 bg-red-900 text-white rounded-md">
        <span>{animal.weight_kg}kg</span>
        <span>{animal.availability_status}</span>
      </div>
      <div className="flex flex-wrap items-center text-lg gap-4 mb-1">
        <span className="text-red-700 font-extrabold text-lg">
          {Number(animal.price_total).toLocaleString("en-ET", { minimumFractionDigits: 0 })} ETB
        </span>
        <span className="text-black">{animal.price_per_kg} ETB/KG</span>
        {animal.health_status === "verified" && (
          <span className="text-green-500 flex items-center gap-1 font-semibold text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </span>
        )}
      </div>

      <button
        onClick={() => {
          recordSelection(animal.id, animal.price_total);
          window.location.href = "/createtype";
        }}
        className="mb-3 bg-red-700 rounded-full text-white px-6 py-1.5 shadow-md hover:bg-red-600 transition text-xl font-semibold"
      >
        Continue
      </button>
      <p className="text-black text-lg">Excellent health, vaccinated, no medical issues</p>
    </div>
  );
}


export default function CreateGroupsPage() {
  const { currentItems: livestocks, isLoading, error, currentPage, totalPages, goToPage } = useCreateGroups();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-700">Loading livestock...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-10 w-full">{error}</div>;
  }

  if (livestocks.length === 0) {
    return <div className="text-center text-gray-400 py-10 w-full">No livestock available.</div>;
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12 w-full max-w-full ">
      <Link href="/groups" className="absolute top-10 left-10 p-10 rounded-full shadow transition" aria-label="Go back to groups">
        <FaArrowLeft className="text-red-600 text-3xl" />
      </Link>

      <div className="flex justify-center mb-2">
        <Image
          src="/logo.png"
          alt="Meet for Meat"
          width={120}
          height={40}
          className="mb-2"
        />
      </div>

      <header className="text-center mb-8 w-full">
        <h2 className="text-4xl font-semibold">Choose Quality Livestock</h2>
        <p className="text-black text-lg mt-2">Select from verified farmers with healthy livestock</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-full px-1 md:px-8">
        {livestocks.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </div>

      <nav className="flex justify-center mt-3 gap-3">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-300 disabled:bg-gray-100 hover:bg-gray-400"
        >
          Previous
        </button>

        <button onClick={() => goToPage(currentPage)} className="px-4 py-2 rounded bg-red-600 text-white">
          {currentPage}
        </button>

        {currentPage + 1 <= totalPages && (
          <button onClick={() => goToPage(currentPage + 1)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            {currentPage + 1}
          </button>
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-300 disabled:bg-gray-100 hover:bg-gray-400"
        >
          Next
        </button>
      </nav>
    </div>
  );
}