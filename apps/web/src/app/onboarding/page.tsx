"use client";

import { useState } from "react";
import { Shield, ChevronRight, Search, Globe, Clock, User } from "lucide-react";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Bangladesh", "Brazil",
  "Canada", "China", "Colombia", "Egypt", "Ethiopia", "France", "Germany", "Ghana",
  "India", "Indonesia", "Iran", "Iraq", "Italy", "Japan", "Kenya", "Malaysia", "Mexico",
  "Morocco", "Nepal", "Netherlands", "Nigeria", "Pakistan", "Peru", "Philippines",
  "Poland", "Romania", "Russia", "Saudi Arabia", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sweden", "Thailand", "Turkey", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Vietnam",
];

const TIMEZONES = [
  "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00 (PST)", "UTC-07:00 (MST)",
  "UTC-06:00 (CST)", "UTC-05:00 (EST)", "UTC-04:00", "UTC-03:00", "UTC-02:00", "UTC-01:00",
  "UTC+00:00 (GMT)", "UTC+01:00 (CET)", "UTC+02:00 (EET)", "UTC+03:00", "UTC+04:00",
  "UTC+05:00 (PKT)", "UTC+05:30 (IST)", "UTC+06:00", "UTC+07:00", "UTC+08:00",
  "UTC+09:00 (JST)", "UTC+10:00", "UTC+11:00", "UTC+12:00",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [handle, setHandle] = useState("");
  const [country, setCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [timezone, setTimezone] = useState("");
  const [role, setRole] = useState<"client" | "freelancer" | "">("");

  const steps = ["Handle", "Country", "Timezone", "Role"];
  const isValid = [
    handle.length >= 3,
    country.length > 0,
    timezone.length > 0,
    role.length > 0,
  ];

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold">klyrn</span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i <= step ? "bg-[#00D395] text-black" : "bg-[#18181B] text-[#71717A]"
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 rounded-full transition-all ${
                  i < step ? "bg-[#00D395]" : "bg-[#27272A]"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          {/* Step 1: Handle */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#00D395]" />
                <h2 className="text-lg font-bold">Choose your handle</h2>
              </div>
              <p className="text-xs text-[#71717A] mb-6">This is your public username on Klyrn.</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A] text-sm">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="your_handle"
                  className="w-full bg-[#111113] border border-[#27272A] rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50"
                />
              </div>
              {handle.length > 0 && handle.length < 3 && (
                <p className="text-[10px] text-[#EF4444] mt-2">Handle must be at least 3 characters</p>
              )}
            </div>
          )}

          {/* Step 2: Country */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-[#00D395]" />
                <h2 className="text-lg font-bold">Where are you based?</h2>
              </div>
              <p className="text-xs text-[#71717A] mb-4">Used for timezone detection and compliance.</p>
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full bg-[#111113] border border-[#27272A] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {filteredCountries.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCountry(c)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                      country === c ? "bg-[#00D395]/10 text-[#00D395] border border-[#00D395]/30" : "text-[#A1A1AA] hover:bg-[#18181B] hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Timezone */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#00D395]" />
                <h2 className="text-lg font-bold">Your timezone</h2>
              </div>
              <p className="text-xs text-[#71717A] mb-4">For auto-approval deadline calculations.</p>
              <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                {TIMEZONES.map((tz) => (
                  <button
                    key={tz}
                    onClick={() => setTimezone(tz)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                      timezone === tz ? "bg-[#00D395]/10 text-[#00D395] border border-[#00D395]/30" : "text-[#A1A1AA] hover:bg-[#18181B] hover:text-white"
                    }`}
                  >
                    {tz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Role */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold mb-2">Confirm your role</h2>
              <p className="text-xs text-[#71717A] mb-6">You can always change this later in settings.</p>
              <div className="space-y-3">
                <button
                  onClick={() => setRole("client")}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    role === "client" ? "border-[#00D395] bg-[#00D395]/5" : "border-[#27272A] hover:border-[#3F3F46]"
                  }`}
                >
                  <p className="text-sm font-semibold">I&apos;m hiring</p>
                  <p className="text-xs text-[#71717A] mt-1">Create contracts, fund escrow, review deliverables.</p>
                </button>
                <button
                  onClick={() => setRole("freelancer")}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    role === "freelancer" ? "border-[#00D395] bg-[#00D395]/5" : "border-[#27272A] hover:border-[#3F3F46]"
                  }`}
                >
                  <p className="text-sm font-semibold">I&apos;m freelancing</p>
                  <p className="text-xs text-[#71717A] mt-1">Accept contracts, submit work, get paid instantly.</p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="text-xs text-[#71717A] hover:text-white disabled:opacity-30 px-4 py-2 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (step < 3) setStep(step + 1);
            }}
            disabled={!isValid[step]}
            className="flex items-center gap-1 bg-[#00D395] hover:bg-[#00B37E] disabled:opacity-30 disabled:cursor-not-allowed text-black text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
          >
            {step === 3 ? "Complete" : "Continue"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
