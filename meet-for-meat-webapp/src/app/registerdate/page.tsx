"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdCalendarToday, MdAccessTime } from "react-icons/md";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

import { useRegisterDate } from "../hooks/useRegisterDate";
import { registerGroup } from "../utils/fetchRegisterDate";

export default function RegisterDatePage() {
  const router = useRouter();
  const {
    groupName, setGroupName,
    slaughterDate, setSlaughterDate,
    slaughterTime, setSlaughterTime,
    slaughterMethod, setSlaughterMethod,
    kirchaType,
    selectedLivestockId,
    priceHalf,
    priceFull,
  } = useRegisterDate();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (submitting) return;

    if (!kirchaType || !selectedLivestockId || !slaughterDate || !slaughterTime || !slaughterMethod) {
      alert("Please fill all fields and select slaughter method.");
      return;
    }

    setSubmitting(true);

    try {
      const isHalf = kirchaType === "half";
      const data = {
        current_members: 0,
        group_type: isHalf ? "Half Kircha" : "Full Kircha",
        max_members: isHalf ? 20 : 10,
        group_name: groupName,
        slaughter_date: slaughterDate,
        slaughter_time: slaughterTime,
        slaughter_method: slaughterMethod,
        status: "open",
        privacy: "private",
        price_half: isHalf ? priceHalf : null,
        price_full: isHalf ? null : priceFull,
        organizer: 3,
        livestock: selectedLivestockId,
      };

      const result = await registerGroup(data);

      const groupId = result.group_id ?? result.id;
      if (groupId) {
        localStorage.setItem("createdGroupId", groupId.toString());
        alert("Group created successfully! Group ID: " + groupId);
      } else {
        alert("Group created successfully, but no group ID returned.");
      }

      router.push("/create-and-pay");
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-start bg-white relative overflow-x-hidden">
      <Link
        href="/createtype"
        className="absolute top-8 left-4 sm:top-10 sm:left-10 p-5 sm:p-7 lg:p-10 rounded-full shadow transition"
        aria-label="Go back to groups"
      >
        <FaArrowLeft className="text-red-600 text-2xl sm:text-3xl lg:text-4xl" />
      </Link>

      <div className="fixed left-0 top-0 h-full w-16 bg-red-700 z-0 hidden [@media(max-width:800px)]:hidden [@media(min-width:1201px)]:block"></div>
      <div className="fixed right-0 top-0 h-full w-16 bg-red-700 z-0 hidden [@media(max-width:800px)]:hidden [@media(min-width:1201px)]:block"></div>

      <Image
        src="/logo.png"
        alt="Meet for Meat"
        width={240}
        height={48}
        className="mt-4 mb-6 z-10"
      />

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col lg:flex-row items-stretch w-full max-w-6xl px-8 gap-8 mb-20">
        <div className="bg-white border border-gray-300 rounded shadow-md flex-1 min-w-[320px] p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">Slaughter Schedule and Methode</h2>
            <p className="mb-8 text-black text-lg">Choose when and how do you want the livestock to be prepared</p>
          </div>
          <div className="flex flex-col gap-6">
            <label>
              <span className="font-semibold flex items-center mb-1 gap-2">
                <MdCalendarToday className="text-red-800 text-xl" />
                Slaughter Date
              </span>
              <input
                type="date"
                value={slaughterDate}
                onChange={e => setSlaughterDate(e.target.value)}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none w-full"
              />
            </label>
            <label>
              <span className="font-semibold flex items-center mb-1 gap-2">
                <MdAccessTime className="text-red-800 text-xl" />
                Slaughter Time
              </span>
              <input
                type="time"
                value={slaughterTime}
                onChange={e => setSlaughterTime(e.target.value)}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none w-full"
              />
            </label>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded shadow-md flex-1 min-w-[320px] p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 lowercase">slaughter method</h2>
            <p className="mb-8 text-black text-lg">How do you want the livestock to be handed</p>
          </div>
          <label>
            <span className="font-semibold mb-1">Group Name</span>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Enter group name"
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none w-full"
            />
          </label>
          <div className="flex flex-col gap-8 pt-0">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="slaughter_method"
                value="self-slaughter"
                checked={slaughterMethod === "self-slaughter"}
                onChange={e => setSlaughterMethod(e.target.value)}
                required
                className="w-6 h-6 accent-red-700"
                disabled={submitting}
              />
              <span className="ml-4 mr-auto">Self Slaughter</span>
              <span className="ml-4">2000 ETB Delivery Fee</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="slaughter_method"
                value="company-managed"
                checked={slaughterMethod === "company-managed"}
                onChange={e => setSlaughterMethod(e.target.value)}
                required
                className="w-6 h-6 accent-red-700"
                disabled={submitting}
              />
              <span className="ml-4 mr-auto">Company Managed</span>
              <span className="ml-4">5000 ETB Service + Delivery Fee</span>
            </label>
          </div>
        </div>
      </form>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-10 bg-red-700 text-white text-4xl font-bold px-50 py-5 rounded-lg shadow transition hover:bg-red-800 z-10 ${
          submitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {submitting ? "Submitting..." : "Continue"}
      </button>
    </div>
  );
}