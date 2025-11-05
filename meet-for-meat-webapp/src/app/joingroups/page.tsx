"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useJoinGroups } from "../hooks/useJoinGroups";
import { Group } from "../hooks/useCreateGroups"; 
import { FaCalendarAlt, FaClock, FaTags, FaUserFriends, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface AnimalDetails {
  id: string | number;
  weight_kg: string;
  breed: string;
  image: string;
}

interface JoinableGroup extends Group {
  slaughter_date?: string;
}

export default function JoinGroupPage() {
  const {
    groups,
    animals,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useJoinGroups();

  const router = useRouter();

  function getAnimalForGroup(animalId: number): AnimalDetails | undefined {
    const found = animals.find((a) => Number(a.id) === animalId);
    if (!found) return undefined;
    return {
      id: found.id,
      weight_kg: found.weight_kg ?? "N/A",
      breed: found.breed ?? "Unknown",
      image: found.image ?? "/default-animal.jpeg",
    };
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  if (error) {
    return <div className="text-red-600 text-center text-lg mt-8">{error}</div>;
  }

  const pageButtons: number[] = [];
  for (let i = currentPage - 4; i <= currentPage + 4; i++) {
    if (i > 0 && i <= totalPages) {
      pageButtons.push(i);
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-10 pt-8 relative">
      <Link
        href="/groups"
        className="absolute top-10 left-10 p-6 rounded-full shadow transition"
        aria-label="Go back to groups"
      >
        <FaArrowLeft className="text-red-600 text-3xl" />
      </Link>

      <div className="w-full flex flex-col items-center mb-6">
        <Image src="/logo.png" alt="Meet for Meat" width={160} height={40} className="mb-2" />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 px-10">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen col-span-3">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-700">Loading groups...</p>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-gray-400">No groups available.</div>
        ) : (
          groups.map((group: JoinableGroup) => { 
            const animal = getAnimalForGroup(Number(group.livestock)) || {
              weight_kg: "N/A",
              image: "/default-animal.jpeg",
              breed: "Unknown",
            };

            const displayPrice = group.price_full ?? group.price_half ?? "Price not available";

            return (
              <div
                key={group.id}
                className="bg-white rounded-xl shadow-md p-4 relative flex flex-col transition-transform duration-300 hover:scale-[1.03] text-lg"
              >
                <div className="relative flex flex-col">
                  <h2 className="text-lg font-semibold mb-1">{group.group_name || "Unnamed Group"}</h2>
                  <p className="text-lg text-gray-600 mb-2">Type: {group.group_type}</p>

                  <div className="absolute top-3 right-3 hidden lg:block text-lg text-right">
                    <span className="font-semibold text-gray-700">{animal.weight_kg}kg</span>
                    <br />
                    <span className="text-red-600">{animal.breed} breed</span>
                  </div>

                  <div className="block lg:hidden mt-2 text-sm text-gray-700">
                    <div>{animal.weight_kg}kg</div>
                    <div className="text-red-600">{animal.breed} breed</div>
                  </div>
                </div>
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={animal.image}
                    alt={animal.breed}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className="space-y-2 w-full px-1">
                  <div className="text-lg text-gray-400 mb-1">
                    Created On: {new Date(group.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center text-black gap-1 text-lg">
                    <FaCalendarAlt className="text-red-600" />
                    <span>Slaughter Date: {group.slaughter_date || "N/A"}</span>
                  </div>

                  <div className="flex items-center text-black gap-1 text-lg">
                    <FaClock className="text-red-600" />
                    <span>Slaughter Time: {group.slaughter_time || "N/A"}</span>
                  </div>

                  <div className="flex items-center text-black gap-1 text-lg">
                    <FaTags className="text-red-600" />
                    <span>Price: {displayPrice}</span>
                  </div>

                  <div className="flex items-center text-black gap-1 text-lg">
                    <FaUserFriends className="text-red-600" />
                    <span>
                      {group.current_members}/{group.max_members} members
                    </span>
                  </div>
                </div>

                <div className="w-full px-1 mt-3 space-y-3">
                  <div>
                    <label className="block text-lg text-gray-500 mb-1">Payment progress</label>
                    <div className="relative w-full h-2 rounded-full bg-gray-200">
                      <div
                        className="absolute top-0 left-0 h-2 rounded-full bg-red-500"
                        style={{ width: `${group.payment_progress}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg text-gray-500 mb-1">Member progress</label>
                    <div className="relative w-full h-2 rounded-full bg-gray-200">
                      <div
                        className="absolute top-0 left-0 h-2 rounded-full bg-red-900"
                        style={{ width: `${group.member_progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={group.current_members >= group.max_members}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("selectedGroupId", group.id.toString());
                      localStorage.setItem(
                        "selectedGroupPrice",
                        (group.price_full ?? group.price_half ?? "").toString()
                      );
                      router.push("/join-and-pay");
                    }
                  }}
                  className={`mt-4 w-full py-2 rounded text-white text-lg font-semibold ${
                    group.current_members < group.max_members ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Join Group
                </button>
                <span className="text-lg text-center mt-2 text-gray-400">Company managed</span>
              </div>
            );
          })
        )}
      </div>

      <nav className="flex justify-center mt-3 gap-3">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-300 disabled:bg-gray-100 hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => goToPage(currentPage)}
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          {currentPage}
        </button>

        {currentPage + 1 <= totalPages && (
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
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