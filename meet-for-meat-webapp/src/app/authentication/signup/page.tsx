"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/app/hooks/usesignup";
import Link from "next/link";
import Image from "next/image";

type FormData = {
  full_name: string;
  phone_number: string;
  user_type: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error } = useSignup();

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    phone_number: "",
    user_type: "organizer",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);

  const validate = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.full_name.trim()) errors.full_name = "Full name is required";
    if (!data.phone_number.trim())
      errors.phone_number = "Phone number is required";
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email format";
    }
    if (!data.password) errors.password = "Password is required";
    if (!["organizer", "member"].includes(data.user_type))
      errors.user_type = "Invalid user type";
    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setMessage(null);
      try {
        await signup(formData);
        setMessage("User registered successfully!");
        setFormData({
          full_name: "",
          phone_number: "",
          user_type: "organizer",
          email: "",
          password: "",
        });
        setFormErrors({});
        router.push("/groups");
      } catch {
        setMessage(error ?? "Signup failed");
      }
    } else {
      setMessage("Please fix the errors above and try again.");
    }
  };

  return (
    <div className="max-h-screen flex flex-col md:flex-row bg-gray-50">
      <div
        className="
          relative w-full md:w-1/2
          flex items-center justify-center
          p-6 sm:p-8 md:p-12
          bg-cover bg-center bg-no-repeat bg-black/30
          2xl:p-12
        "
        style={{ backgroundImage: "url(/together4.jpg)" }}
      >
        <div className="absolute inset-0 bg-black opacity-70 pointer-events-none" />
        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="Logo"
            width={256}
            height={128}
            className="w-32 sm:w-40 md:w-48 lg:w-64 2xl:w-[440px] h-auto"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-white">
        <div
          className="
          w-full max-w-sm sm:max-w-md md:max-w-lg
          border border-red-600 rounded-lg shadow-lg
          p-6 sm:p-8 md:p-10
          2xl:max-w-lg 2xl:p-10 lg:px-5 lg:py-2
        "
        >
          <h1
            className="
            text-burgundy text-2xl sm:text-3xl md:text-4xl
            font-bold text-center mb-6 sm:mb-8 md:mb-10
            2xl:text-4xl 2xl:mb-10
          "
          >
            Create Account
          </h1>

          <form
            className=" space-y-4 sm:space-y-5 xl:space-y-4 lg:space-y-2 md:space-y-7 2xl:space-y-7 text-base sm:text-lg"
            onSubmit={handleSubmit}
            noValidate
          >
            <InputField
              id="full_name"
              label="Full Name"
              name="full_name"
              type="text"
              placeholder="enter full name"
              value={formData.full_name}
              onChange={handleChange}
              error={formErrors.full_name}
              required
            />
            <InputField
              id="phone_number"
              label="Phone Number"
              name="phone_number"
              type="tel"
              placeholder="enter phone number"
              value={formData.phone_number}
              onChange={handleChange}
              error={formErrors.phone_number}
              required
            />
            <SelectField
              id="user_type"
              label="User Type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              options={[
                { value: "organizer", label: "Organizer" },
                { value: "member", label: "Member" },
              ]}
              error={formErrors.user_type}
            />
            <InputField
              id="email"
              label="Email"
              name="email"
              type="email"
              placeholder="enter your email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
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
              error={formErrors.password}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 sm:py-4 rounded-md font-bold
                text-base sm:text-lg md:text-xl 2xl:text-xl
                transition bg-red-600 hover:bg-red-700 text-white
                shadow-md focus:outline-none  lg:py-2 
              "
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 sm:mt-8 text-red-600 underline text-sm sm:text-base">
            Already have an account?{" "}
            <Link href="/authentication/signin">
              <span className="cursor-pointer font-semibold">Sign In</span>
            </Link>
          </p>

          {message && (
            <p
              className={`mt-4 sm:mt-6 text-center text-sm sm:text-base ${
                error ? "text-red-700" : "text-black"
              }`}
            >
              {message}
            </p>
          )}
          {error && !message && (
            <p className="mt-3 text-center text-red-700 text-sm sm:text-base">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type Option = { value: string; label: string };

function InputField({
  id,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-black mb-1 sm:mb-2 text-sm sm:text-base 2xl:text-lg "
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-1
          border border-red-600 rounded-md focus:outline-none focus:ring-2
          ${error ? "focus:ring-red-200" : "focus:ring-red-100"}
          2xl:px-4 2xl:py-3 lg:px-2 
        `}
      />
      {error && (
        <p className="mt-1 sm:mt-2 text-red-600 text-xs sm:text-sm">{error}</p>
      )}
    </div>
  );
}

function SelectField({
  id,
  label,
  name,
  value,
  onChange,
  options,
  error,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-black mb-1 sm:mb-2 text-sm sm:text-base 2xl:text-xl"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-1
          border border-red-600 rounded-md focus:outline-none focus:ring-2
          ${error ? "focus:ring-red-200" : "focus:ring-red-100"}
          2xl:px-4 2xl:py-3
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 sm:mt-2 text-red-600 text-xs sm:text-sm">{error}</p>
      )}
    </div>
  );
}
