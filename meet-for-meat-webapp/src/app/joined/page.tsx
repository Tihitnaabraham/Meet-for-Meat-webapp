
"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useJoined, JoinedGroup } from "../hooks/useJoined"; 
import { createInvitation } from "../utils/fetchInvitation";

interface GroupCardProps {
  groupData: JoinedGroup;
  onInvite: (id: number, price: number) => Promise<void>;
  inviteLinks: { [groupId: number]: string };
  inviteError: string | null;
  inviteSuccess: string | null;
  onInviteLinkClick: (groupId: number) => void;
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button onClick={handleCopy} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md transition-colors text-lg font-medium">
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${progress}%` }}></div>
    </div>
  );
}

function GroupCard({ groupData, onInvite, inviteLinks, inviteError, inviteSuccess, onInviteLinkClick }: GroupCardProps) {
  const { 
    id, 
    slaughter_date, 
    slaughter_time, 
    location, 
    privacy,
    livestock = {}, 
    payment = {}, 
    memberProgress = 0, 
    paymentProgress = 0, 
    max_members = 1
  } = groupData;

  const safeMemberProgress = Math.min(Math.max(memberProgress, 0), 100);
  const safePaymentProgress = Math.min(Math.max(paymentProgress, 0), 100);
  let price = 0;

  const livestockDetails = livestock as { price_total?: number | string };
  const paymentDetails = payment as { amount?: number };

  if (typeof paymentDetails.amount === "number") {
    price = paymentDetails.amount;
  } else if (typeof livestockDetails.price_total === "number" && max_members > 0) {
    price = livestockDetails.price_total / max_members;
  } else if (typeof livestockDetails.price_total === "string" && !isNaN(+livestockDetails.price_total)) {
    price = +livestockDetails.price_total / max_members;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">Group Status (ID: {id})</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Payment Progress</span>
              <span className="font-semibold">{safePaymentProgress.toFixed(2)}%</span>
            </div>
            <ProgressBar progress={safePaymentProgress} color="bg-red-500" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Member Progress</span>
              <span className="font-semibold">{safeMemberProgress.toFixed(2)}%</span>
            </div>
            <ProgressBar progress={safeMemberProgress} color="bg-red-700" />
          </div>
          <p className="font-medium mb-4">Share the group with friends or family:</p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium mb-2">Contact Information</p>
            <p>Meet for Meat company manager <br /> +215976403580 <br /> +215976403580</p>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">Event Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-xl">📅</span>
              <div>
                <p className="font-medium">Slaughter Date</p>
                <p>{slaughter_date || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-xl">🕒</span>
              <div>
                <p className="font-medium">Slaughter Time</p>
                <p>{slaughter_time || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-xl">📍</span>
              <div>
                <p className="font-medium">Location</p>
                <p>{location || "Addis Ababa"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">Payment Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Your Share</span>
              <span className="font-semibold">{price ? `${price.toFixed(2)} ETB` : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Status</span>
              <span className={`font-semibold ${
                groupData.payment_status === "Success" || groupData.payment_status === "Paid"
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {groupData.payment_status || "Pending"}
              </span>
            </div>
          </div>
          {privacy === "private" ? (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <p className="font-medium mb-3">Invite to Private Group</p>
              <button
                onClick={() => onInvite(Number(id), price)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Generate Invite Link
              </button>
              {inviteLinks[Number(id)] && (
                <div className="mt-3">
                  <p className="text-lg mb-2">Invite Link:</p>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onInviteLinkClick(Number(id));
                    }}
                    className="text-red-700 underline break-all text-lg block"
                  >
                    {inviteLinks[Number(id)]}
                  </Link>
                  <div className="mt-2">
                    <CopyButton textToCopy={inviteLinks[Number(id)]} />
                  </div>
                </div>
              )}
              {inviteSuccess && <p className="text-red-900 mt-2 text-lg">{inviteSuccess}</p>}
              {inviteError && <p className="text-red-600 mt-2 text-lg">{inviteError}</p>}
            </div>
          ) : (
            <p className="mt-6 text-gray-600 italic text-lg">This is a public group; no invitation needed.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JoinedPage() {
  const { groups, loading, error } = useJoined();
  const [currentPage, setCurrentPage] = useState(1);
  const [inviteLinks, setInviteLinks] = useState<{ [groupId: number]: string }>({});
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const groupsPerPage = 1;
  const router = useRouter();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-700">Loading your groups...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-bold text-lg mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
        <p className="text-gray-600 text-lg">No joined groups found.</p>
      </div>
    );
  }

  const totalGroups = groups.length;
  const totalPages = Math.ceil(totalGroups / groupsPerPage);
  const startIndex = (currentPage - 1) * groupsPerPage;
  const currentGroups = groups.slice(startIndex, startIndex + groupsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleInvite = async (groupId: number, price: number) => {
    try {
      setInviteError(null);
      setInviteSuccess(null);
      const response = await createInvitation(groupId);
      localStorage.setItem("createdGroupId", groupId.toString());
      localStorage.setItem("selectedGroupPrice", price.toString());
      setInviteLinks((prev) => ({ ...prev, [groupId]: response.invite_link }));
      setInviteSuccess("Invitation link generated! Share it with the user.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create invitation.";
      setInviteError(errorMessage);
    }
  };
  const handleInviteLinkClick = (_groupId: number) => {
    router.push(`/create-and-pay`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block w-12 bg-red-600 flex-shrink-0"></div>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/groups" className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" aria-label="Go back to groups">
              <FaArrowLeft className="text-red-600 text-3xl" />
            </Link>
            <Image src="/logo.png" alt="Meet for Meat Logo" width={160} height={40} />
            <div className="w-8"></div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="bg-red-900 text-white rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <span className="text-5xl">✔</span>
              <div>
                <h2 className="text-2xl font-bold mb-2">Successfully Joined Groups!</h2>
                <p className="text-red-100">
                  If you have groups, details about the slaughter schedule, delivery, group status, and payment will appear here.
                </p>
              </div>
            </div>
          </div>

          {currentGroups.map((groupData) => (
            <GroupCard
              key={groupData.id}
              groupData={groupData}
              onInvite={handleInvite}
              inviteLinks={inviteLinks}
              inviteError={inviteError}
              inviteSuccess={inviteSuccess}
              onInviteLinkClick={handleInviteLinkClick}
            />
          ))}

          {totalGroups > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
      <div className="hidden lg:block w-12 bg-red-600 flex-shrink-0"></div>
    </div>
  );
}