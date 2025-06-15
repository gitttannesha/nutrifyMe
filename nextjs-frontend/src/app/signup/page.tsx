"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const stepImages = [
  "/images/signup1.png", // Step 1 (local image)
  "/images/signup4.jpg", // Step 2 (new image)
  "/images/signup3.jpg", // Step 3 (new image)
];

const steps = ["Account Info", "Personal Info", "Medical Info"];

// Helper for BMI color and label
const getBmiCategory = (bmi: number) => {
  if (bmi < 16) return { label: 'Severely Underweight', color: 'blue-900', bg: 'bg-blue-900', text: 'text-white', border: 'border-blue-900' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'blue-300', bg: 'bg-blue-300', text: 'text-blue-900', border: 'border-blue-300' };
  if (bmi < 25) return { label: 'Normal', color: 'green-400', bg: 'bg-green-400', text: 'text-green-900', border: 'border-green-400' };
  if (bmi < 30) return { label: 'Overweight', color: 'yellow-300', bg: 'bg-yellow-300', text: 'text-yellow-900', border: 'border-yellow-300' };
  if (bmi < 35) return { label: 'Obese', color: 'orange-400', bg: 'bg-orange-400', text: 'text-white', border: 'border-orange-400' };
  return { label: 'Severely Obese', color: 'red-500', bg: 'bg-red-500', text: 'text-white', border: 'border-red-500' };
};

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bmi: "",
    sugarLevel: "",
    diabetes: false,
    hypertension: false,
    cholesterol: false,
    activityLevel: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [errorToast, setErrorToast] = useState('');

  // Calculate BMI when height and weight are entered
  React.useEffect(() => {
    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);
    if (h > 0 && w > 0) {
      const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
      setForm((f) => ({ ...f, bmi }));
    }
  }, [form.height, form.weight]);

  // Validation for each step
  const validateStep = () => {
    let errs: any = {};
    if (step === 0) {
      if (!form.name) errs.name = "Name is required";
      if (!form.email) errs.email = "Email is required";
      if (!form.password) {
        errs.password = "Password is required";
      } else {
        if (form.password.length < 8) {
          errs.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*/.test(form.password)) {
          errs.password = "Password must contain at least one number and one special character";
        }
      }
      if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    } else if (step === 1) {
      if (!form.age) errs.age = "Age is required";
      if (!form.gender) errs.gender = "Gender is required";
      if (!form.height) errs.height = "Height is required";
      if (!form.weight) errs.weight = "Weight is required";
    } else if (step === 2) {
      if (!form.sugarLevel) errs.sugarLevel = "Sugar level is required";
      if (!form.activityLevel) errs.activityLevel = "Activity level is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle next
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) setStep((s) => s + 1);
  };
  // Handle back
  const handleBack = () => setStep((s) => s - 1);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: (target as HTMLInputElement).checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Handle signup (final submit)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const result = await res.json();
        if (result.success) {
          setTimeout(() => {
            router.push('/homepage?toast=1');
          }, 2000);
        } else {
          setErrorToast(result.error || 'Signup failed');
          setTimeout(() => setErrorToast(''), 2500);
        }
      } catch (err) {
        setErrorToast('Signup failed');
        setTimeout(() => setErrorToast(''), 2500);
      }
    }
  };

  return (
    // bg-gradient-to-br from-green-50 via-blue-50 to-white
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white  relative overflow-hidden">
      {/* Accent background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40 z-0" />
      {/* Main content split layout */}
      <div className="flex w-full max-w-4xl mx-auto z-10 rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-lg">
        {/* Left: Signup image (local) - revert to static image, no animation */}
        <div className="hidden md:block flex-1 bg-cover bg-center min-h-[600px] transition-all duration-500" style={{ backgroundImage: `url(${stepImages[step]})` }} />
        {/* Right: Signup Card */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
          {/* Logo above progress indicator */}
          <div className="flex flex-col items-center w-full">
            <span className="text-3xl font-extrabold text-zinc-900 drop-shadow mb-4">
              nutrify<span className="text-green-500">Me</span>
            </span>
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-6 w-full justify-center">
              {steps.map((label, idx) => (
                <React.Fragment key={label}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg ${step === idx ? 'bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-lg scale-110' : 'bg-zinc-200 text-zinc-500'}`}>{idx + 1}</div>
                  {idx < steps.length - 1 && <div className="w-8 h-1 bg-zinc-200 rounded" />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-zinc-900 text-center">Sign Up - {steps[step]}</h3>
          <form className="flex flex-col gap-4 w-full mt-2" onSubmit={step === 2 ? handleSignup : handleNext}>
            {/* Step 1: Account Info */}
            {step === 0 && (
              <>
                <div className="relative mb-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
                  <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className={`pl-10 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500 ${errors.name ? 'border-red-400' : ''}`} />
                  {errors.name && <span className="absolute left-10 top-full mt-1 text-red-500 text-xs whitespace-nowrap">{errors.name}</span>}
                </div>
                <div className="relative mb-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
                  <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={`pl-10 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500 ${errors.email ? 'border-red-400' : ''}`} />
                  {errors.email && <span className="absolute left-10 top-full mt-1 text-red-500 text-xs whitespace-nowrap">{errors.email}</span>}
                </div>
                <div className="relative mb-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} className={`pl-10 pr-10 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500 ${errors.password ? 'border-red-400' : ''}`} />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-green-500 transition" aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <span className="absolute left-10 top-full mt-1 text-red-500 text-xs whitespace-nowrap">{errors.password}</span>}
                </div>
                <div className="relative mb-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className={`pl-10 pr-10 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500 ${errors.confirmPassword ? 'border-red-400' : ''}`} />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-500 transition" aria-label="Toggle confirm password visibility">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && <span className="absolute left-10 top-full mt-1 text-red-500 text-xs whitespace-nowrap">{errors.confirmPassword}</span>}
                </div>
              </>
            )}
            {/* Step 2: Personal Info */}
            {step === 1 && (
              <>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} min={1} max={100} className="pl-4 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500" />
                    {errors.age && <span className="text-red-500 text-xs ml-2">{errors.age}</span>}
                  </div>
                  <div className="flex-1">
                    <select name="gender" value={form.gender} onChange={handleChange} className="pl-4 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black">
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <span className="text-red-500 text-xs ml-2">{errors.gender}</span>}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input type="number" name="height" placeholder="Height (cm)" value={form.height} onChange={handleChange} className="pl-4 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500" />
                    {errors.height && <span className="text-red-500 text-xs ml-2">{errors.height}</span>}
                  </div>
                  <div className="flex-1">
                    <input type="number" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} className="pl-4 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500" />
                    {errors.weight && <span className="text-red-500 text-xs ml-2">{errors.weight}</span>}
                  </div>
                </div>
                {/* BMI field with tag inside and border color */}
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    {(() => {
                      const bmi = parseFloat(form.bmi);
                      const cat = isNaN(bmi) ? null : getBmiCategory(bmi);
                      return (
                        <>
                          <input
                            type="text"
                            name="bmi"
                            placeholder="BMI"
                            value={form.bmi}
                            readOnly
                            className={`pl-4 pr-20 py-2 rounded-lg border w-full bg-zinc-100 text-black placeholder:text-gray-500 transition-colors duration-300 ${cat ? cat.border : 'border-zinc-200'}`}
                          />
                          {cat && (
                            <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded ${cat.bg} ${cat.text} shadow transition-colors duration-300`} style={{ pointerEvents: 'none' }}>
                              {cat.label}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}
            {/* Step 3: Medical Info */}
            {step === 2 && (
              <>
                <div className="relative mb-2">
                  <input type="number" name="sugarLevel" placeholder="Sugar Level (mg/dL)" value={form.sugarLevel} onChange={handleChange} className="pl-4 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500" />
                  {errors.sugarLevel && <span className="text-red-500 text-xs ml-2">{errors.sugarLevel}</span>}
                </div>
                <div className="flex gap-7 items-center mb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-700 font-medium ml-3">
                    <input type="checkbox" name="diabetes" checked={form.diabetes} onChange={handleChange} className="accent-green-500 w-5 h-5" />
                    <span>Diabetes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-700 font-medium ml-3">
                    <input type="checkbox" name="hypertension" checked={form.hypertension} onChange={handleChange} className="accent-blue-500 w-5 h-5" />
                    <span>Hypertension</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-700 font-medium ml-3">
                    <input type="checkbox" name="cholesterol" checked={form.cholesterol} onChange={handleChange} className="accent-yellow-400 w-5 h-5" />
                    <span>Cholesterol</span>
                  </label>
                </div>
                <div className="relative mb-2">
                  <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="pl-4 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black">
                    <option value="">Activity Level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                  {errors.activityLevel && <span className="text-red-500 text-xs ml-2">{errors.activityLevel}</span>}
                </div>
              </>
            )}
            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-4">
              {step > 0 && (
                <button type="button" onClick={handleBack} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-300 transition"><ArrowLeft className="w-4 h-4" />Back</button>
              )}
              {step < 2 && (
                <button type="submit" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold shadow-lg hover:from-green-500 hover:to-blue-500 transition ml-auto">Next<ArrowRight className="w-4 h-4" /></button>
              )}
              {step === 2 && (
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold shadow-lg hover:from-green-500 hover:to-blue-500 transition">Sign Up</button>
              )}
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-600">
            Already have an account? <Link href="/login" className="text-green-600 font-semibold no-underline hover:text-green-700">Log in</Link>
          </div>
        </div>
      </div>
      {/* Error Toast notification */}
      {errorToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg animate-fade-in">
          {errorToast}
        </div>
      )}
    </div>
  );
} 