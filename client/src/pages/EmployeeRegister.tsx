import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { employeeService } from '../services/employee.service';
import { Location, JobType } from '../types';
import { toast } from 'sonner';

export const EmployeeRegister: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternativePhoneNumber, setAlternativePhoneNumber] = useState('');
  const [locationId, setLocationId] = useState('');
  const [jobTypeId, setJobTypeId] = useState('');
  const [address, setAddress] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch Public Options
  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const res = await employeeService.getPublicOptions();
      if (res.success && res.data) {
        setLocations(res.data.locations || []);
        setJobTypes(res.data.jobTypes || []);
      }
    } catch (err) {
      toast.error('Failed to load registration options');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 7) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }
    if (!locationId) {
      setErrorMessage('Please select your preferred working location');
      return;
    }
    if (!jobTypeId) {
      setErrorMessage('Please select your skilled trade / job type');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await employeeService.publicRegister({
        name,
        phoneNumber,
        alternativePhoneNumber,
        locationId,
        jobTypeId,
        address,
      });

      if (res.success) {
        setIsSuccess(true);
        toast.success('Registration submitted successfully!');
      } else {
        setErrorMessage(res.message || 'Failed to submit registration');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit registration';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhoneNumber('');
    setAlternativePhoneNumber('');
    setLocationId('');
    setJobTypeId('');
    setAddress('');
    setErrorMessage(null);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full lg:w-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden font-sans selection:bg-[#2872A1] selection:text-white">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#2872A1]/30 blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Compact Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#2872A1] to-sky-400 flex items-center justify-center shadow-lg shadow-[#2872A1]/40 ring-2 ring-white/10">
            <HardHat className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-sky-400">
              BUILDWORK
            </span>
            <span className="block text-[9px] tracking-widest font-semibold text-slate-400 uppercase leading-none">
              Workforce Registration Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center overflow-y-auto lg:overflow-hidden z-10">
        
        {/* LEFT COLUMN: ANIMATED PROJECT & WORKFORCE GRAPHIC */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-center max-h-full">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Direct Worker Recruitment
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Join Our Verified Construction Workforce
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Register your trade skills and locations today. Get assigned to premier construction projects across major industrial companies.
            </p>
          </div>

          {/* PROJECT & CONSTRUCTION WORKING ANIMATION SVG BOX */}
          <div className="relative rounded-2xl p-4 bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-sky-400 tracking-wider uppercase flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Deployment System
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                  v2.4 ACTIVE
                </span>
              </div>

              {/* ANIMATED SVG CONSTRUCTION SCENE */}
              <div className="w-full h-44 sm:h-48 flex items-center justify-center relative my-1">
                <svg viewBox="0 0 400 220" className="w-full h-full max-h-full">
                  <defs>
                    <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2872A1" />
                      <stop offset="50%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#2872A1" />
                    </linearGradient>
                    <linearGradient id="buildingGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#0F172A" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                  </defs>

                  {/* Ground base */}
                  <line x1="20" y1="200" x2="380" y2="200" stroke="#334155" strokeWidth="4" strokeDasharray="6 6" />

                  {/* Rising Building Skeleton Frame */}
                  <g>
                    {/* Main Building Frame */}
                    <rect x="180" y="70" width="100" height="130" fill="url(#buildingGrad)" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.6" rx="4" />
                    <line x1="230" y1="70" x2="230" y2="200" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                    <line x1="180" y1="110" x2="280" y2="110" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                    <line x1="180" y1="150" x2="280" y2="150" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />

                    {/* Window Nodes Glow Animation */}
                    <circle cx="205" cy="90" r="4" fill="#38BDF8" className="animate-pulse" />
                    <circle cx="255" cy="90" r="4" fill="#38BDF8" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <circle cx="205" cy="130" r="4" fill="#38BDF8" className="animate-pulse" style={{ animationDelay: '1s' }} />
                    <circle cx="255" cy="130" r="4" fill="#38BDF8" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                  </g>

                  {/* Tower Crane Animation */}
                  <g className="origin-bottom">
                    {/* Crane Tower */}
                    <line x1="80" y1="200" x2="80" y2="30" stroke="#F59E0B" strokeWidth="3" />
                    <line x1="80" y1="40" x2="220" y2="40" stroke="#F59E0B" strokeWidth="2.5" />
                    <line x1="80" y1="40" x2="40" y2="50" stroke="#F59E0B" strokeWidth="2" />
                    {/* Diagonal Supports */}
                    <line x1="80" y1="80" x2="95" y2="60" stroke="#F59E0B" strokeWidth="1" />
                    <line x1="80" y1="120" x2="95" y2="100" stroke="#F59E0B" strokeWidth="1" />

                    {/* Swinging Crane Trolley & Cable Payload */}
                    <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                      <rect x="140" y="37" width="12" height="6" fill="#F59E0B" />
                      <line x1="146" y1="43" x2="146" y2="95" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />

                      {/* Suspended Steel Beam */}
                      <g transform="translate(116, 95)">
                        <rect x="0" y="0" width="60" height="10" rx="3" fill="url(#beamGradient)" className="shadow-lg" />
                        <circle cx="10" cy="5" r="2" fill="#FFFFFF" />
                        <circle cx="50" cy="5" r="2" fill="#FFFFFF" />
                      </g>
                    </g>
                  </g>

                  {/* Rotating Industrial Gear 1 */}
                  <g transform="translate(320, 160)" className="animate-spin" style={{ animationDuration: '10s' }}>
                    <circle cx="0" cy="0" r="22" fill="none" stroke="#2872A1" strokeWidth="3" strokeDasharray="8 4" />
                    <circle cx="0" cy="0" r="10" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                  </g>

                  {/* Rotating Industrial Gear 2 */}
                  <g transform="translate(350, 130)" className="animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}>
                    <circle cx="0" cy="0" r="15" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 3" />
                    <circle cx="0" cy="0" r="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                  </g>

                  {/* Animated Worker Avatar Icon on Base */}
                  <g transform="translate(100, 175)">
                    <circle cx="12" cy="12" r="16" fill="#2872A1" fillOpacity="0.2" className="animate-ping" />
                    <circle cx="12" cy="12" r="12" fill="#2872A1" />
                    <path d="M7 10 L17 10 C17 6 7 6 7 10 Z" fill="#F59E0B" />
                  </g>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="p-1.5 rounded-lg bg-slate-800/40">
                  <p className="text-xs font-bold text-white">500+</p>
                  <p className="text-[9px] text-slate-400">Assigned Workers</p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800/40">
                  <p className="text-xs font-bold text-sky-400">50+ Companies</p>
                  <p className="text-[9px] text-slate-400">Client Network</p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800/40">
                  <p className="text-xs font-bold text-emerald-400">100% Verified</p>
                  <p className="text-[9px] text-slate-400">Direct Placement</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Safe & Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-sky-400" /> Skilled Trade Matching
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM / SUCCESS CARD */}
        <div className="lg:col-span-6 flex flex-col justify-center max-h-full overflow-hidden">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl relative max-h-[calc(100vh-80px)] overflow-y-auto sidebar-scroll">
            
            {isSuccess ? (
              /* SUCCESS CONFIRMATION VIEW AFTER REGISTRATION */
              <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Registration Submitted Successfully!
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                    Thank you for registering with us! Our team will review your details and <span className="text-sky-400 font-extrabold">will contact you shortly</span> regarding upcoming project deployments.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#2872A1] to-sky-500 hover:from-[#1f5c83] hover:to-sky-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#2872A1]/30 cursor-pointer"
                  >
                    Register Another Employee
                  </button>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="border-b border-slate-800 pb-2.5">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-[#2872A1]" /> Employee Registration Form
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fill in your official worker information below.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2872A1] focus:border-transparent transition-all"
                    />
                    <User className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Phone & Alt Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2872A1] focus:border-transparent transition-all"
                      />
                      <Phone className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Alternative Phone (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="e.g. Alternate mobile"
                        value={alternativePhoneNumber}
                        onChange={(e) => setAlternativePhoneNumber(e.target.value)}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2872A1] focus:border-transparent transition-all"
                      />
                      <Phone className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Job Type & Location Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Skilled Trade / Job Type *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={jobTypeId}
                        onChange={(e) => setJobTypeId(e.target.value)}
                        disabled={loadingOptions}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2872A1] focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900 text-slate-400">Select Skilled Trade...</option>
                        {jobTypes.map((j) => (
                          <option key={j._id} value={j._id} className="bg-slate-900 text-white">
                            {j.name}
                          </option>
                        ))}
                      </select>
                      <Briefcase className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Preferred Working Location *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        disabled={loadingOptions}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2872A1] focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900 text-slate-400">Select Location...</option>
                        {locations.map((l) => (
                          <option key={l._id} value={l._id} className="bg-slate-900 text-white">
                            {l.name}
                          </option>
                        ))}
                      </select>
                      <MapPin className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Residential Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter full address details..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2872A1] focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#2872A1] to-sky-500 hover:from-[#1f5c83] hover:to-sky-600 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#2872A1]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Submitting Registration...
                    </span>
                  ) : (
                    <>
                      Submit Worker Registration <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </main>

      {/* Compact Bottom Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-2 text-center text-[10px] text-slate-500 border-t border-slate-800/60 shrink-0 z-10">
        © {new Date().getFullYear()} BuildWork Workforce Management Platform. All rights reserved.
      </footer>
    </div>
  );
};
