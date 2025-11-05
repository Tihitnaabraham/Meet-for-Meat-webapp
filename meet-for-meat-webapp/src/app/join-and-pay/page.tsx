"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useJoinAndPay } from "../hooks/useJoinAndPay";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

function JoinGroupContent() {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [priceFull, setPriceFull] = useState<number | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [errors, setErrors] = useState({ fullName: "", phoneNumber: "", deliveryAddress: "" });
  
  const { loading, errorMsg, successMsg, joinAndPay } = useJoinAndPay();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedGroupId = localStorage.getItem("selectedGroupId");
      const storedPrice = localStorage.getItem("selectedGroupPrice");
      if (storedGroupId) setGroupId(Number(storedGroupId));
      if (storedPrice) setPriceFull(Number(storedPrice));
    }
  }, []);

  function validateForm() {
    let isValid = true;
    const errorsCopy = { fullName: "", phoneNumber: "", deliveryAddress: "" };

    if (!fullName.trim()) {
      errorsCopy.fullName = "Full name is required.";
      isValid = false;
    }
    if (!phoneNumber.trim()) {
      errorsCopy.phoneNumber = "Phone number is required.";
      isValid = false;
    } else if (!/^(\+2547\d{8}|07\d{8})$/.test(phoneNumber.trim())) {
      errorsCopy.phoneNumber = "Enter a valid Kenyan phone number.";
      isValid = false;
    }
    if (!deliveryAddress.trim()) {
      errorsCopy.deliveryAddress = "Delivery address is required.";
      isValid = false;
    }

    setErrors(errorsCopy);
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fix errors in the form.");
      return;
    }
    if (!groupId) {
      alert("Group information is missing. Please select a group.");
      return;
    }
    if (!priceFull || priceFull <= 0) {
      alert("Price information is missing or invalid.");
      return;
    }
let formattedPhone = phoneNumber.trim();
if (!formattedPhone.startsWith("+254")) {
  if (formattedPhone.startsWith("0")) formattedPhone = `254${formattedPhone.substring(1)}`; 
  else if (formattedPhone.startsWith("7")) formattedPhone = `254${formattedPhone}`;
  else {
    alert("Phone number format not recognized for Kenya.");
    return;
  }
}

    await joinAndPay({
      groupId,
      fullName: fullName.trim(),
      phoneNumber: formattedPhone,
      deliveryAddress: deliveryAddress.trim(),
      amount: priceFull,
    });
  }

  return (
    <div className="min-h-screen bg-[#4b0000] flex flex-col items-center px-4 pt-10">
      <Link href="/joined" className="absolute top-10 left-10  p-10 rounded-full shadow transition" aria-label="Go back to groups">
       <FaArrowLeft className="text-red-600 text-2xl" />
     </Link>
      <Image src="/logo.png" alt="Meet for Meat" width={200} height={50} className="mb-5 w-50" />
      <h2 className="text-white  mb-5 text-xl">Enter your details for delivery coordination</h2>
      <form onSubmit={handleSubmit} className="w-200 max-w-full space-y-6">
        <div>
          <label htmlFor="fullNameInput" className="block text-white text-lg font-semibold mb-1">Full name</label>
          <input
            id="fullNameInput"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded px-4 py-4 text-white text-lg border border-white outline-none"
            required
          />
          {errors.fullName && <p className="text-red-400">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="phoneInput" className="block text-white text-lg font-semibold mb-1">Phone number</label>
          <input
            id="phoneInput"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded px-4 py-4 text-white text-lg border border-white outline-none"
            required
            pattern="(\+2547\d{8}|07\d{8})"
            title="Valid Kenyan phone number starting with +2547 or 07"
          />
          {errors.phoneNumber && <p className="text-red-400">{errors.phoneNumber}</p>}
        </div>
        <div>
          <label htmlFor="addressInput" className="block text-white text-lg font-semibold mb-1">Delivery Address</label>
          <input
            id="addressInput"
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full rounded px-4 py-4 text-white text-lg border border-white outline-none"
            required
          />
          {errors.deliveryAddress && <p className="text-red-400">{errors.deliveryAddress}</p>}
        </div>
        {errorMsg && <p className="text-red-400 text-center text-lg font-semibold">{errorMsg}</p>}
        {successMsg && <p className="text-white text-center text-lg font-semibold">{successMsg}</p>}
        <button 
          type="submit"
          disabled={loading || !groupId || !priceFull}
          className="w-full bg-red-600 text-white py-4 rounded font-bold hover:bg-red-700 transition text-xl mt-20"
        >
          {loading ? "Processing..." : "Pay M-Pesa"} 
        </button>
      </form>
    </div>
  );
}

export default function JoinGroupPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JoinGroupContent />
    </Suspense>
  );
}
