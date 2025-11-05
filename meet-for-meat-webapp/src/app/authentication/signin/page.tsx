"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignin } from "../../hooks/useSignin";
import Link from "next/link";
import Image from "next/image";

export default function SigninPage() {
  const router = useRouter();
  const { signin, loading: signinLoading, error: signinError } = useSignin();
  const [formData, setFormData] = useState({ phone_number: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await (signin)(formData.phone_number, formData.password);
      setMessage("Signed in successfully!");
      router.push("/groups");
    } catch {
      setMessage(signinError || "Signin failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col xl:flex-row bg-gray-50">
      <div
        className="relative w-full xl:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 md:p-10 lg:p-12 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/together2.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[400px]">
          <Image src="/logo.png" alt="Logo" width={400} height={180} className="object-contain w-full h-auto" />
        </div>
      </div>
      <div className="w-full xl:w-1/2 flex justify-center items-center p-6 sm:p-8 md:p-10 lg:p-12 bg-white">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg border border-red-600 rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          <h1 className="text-burgundy text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
            Sign In
          </h1>

          <form className="space-y-5 sm:space-y-6 md:space-y-7 text-base sm:text-lg" onSubmit={handleSubmit} noValidate>
            <InputField
              id="phone_number"
              label="Phone Number"
              name="phone_number"
              type="tel"
              placeholder="enter your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
            <InputField
              id="password"
              label="Password"
              name="password"
              type="password"
              placeholder="enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={signinLoading}
              className="w-full py-3.5 sm:py-4 rounded-md font-bold text-base sm:text-lg md:text-xl transition bg-red-800 hover:bg-red-900 text-white shadow-md focus:outline-none"
            >
              {signinLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-6 sm:mt-7 md:mt-8 text-red-600 underline text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <Link href="/authentication/signup">
              <span className="cursor-pointer font-semibold">Sign Up</span>
            </Link>
          </p>

          {message && <p className="mt-5 text-center text-red-600">{message}</p>}
          {signinError && <p className="mt-3 text-center text-red-700">{signinError}</p>}
        </div>
      </div>
    </div>
  );
}

function InputField({
  id,
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1.5 sm:mb-2 text-sm sm:text-base">
        {label}
        <span className="text-red-600"> *</span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 border border-red-600 rounded-md focus:outline-none  focus:ring-offset-1 transition"
      />
    </div>
  );
}
