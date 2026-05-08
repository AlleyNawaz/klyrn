"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, DollarSign,
  Plus, Trash2, Shield, Info
} from "lucide-react";

interface MilestoneInput {
  title: string;
  description: string;
  amountUsdc: number;
  dueDate: string;
}

const STEPS = [
  { num: 1, title: "Who", desc: "Freelancer details" },
  { num: 2, title: "What", desc: "Project brief" },
  { num: 3, title: "How Much", desc: "Budget & milestones" },
  { num: 4, title: "Review", desc: "Confirm & pay" },
];

export default function ContractCreationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freelancerEmail, setFreelancerEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [briefMarkdown, setBriefMarkdown] = useState("");
  const [totalBudget, setTotalBudget] = useState(500);
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { title: "Full Delivery", description: "Complete deliverable", amountUsdc: 500, dueDate: "" },
  ]);

  const milestoneSum = milestones.reduce((s, m) => s + m.amountUsdc, 0);
  const isBalanced = Math.abs(milestoneSum - totalBudget) < 0.01;

  function addMilestone() {
    if (milestones.length >= 10) return;
    setMilestones([...milestones, { title: "", description: "", amountUsdc: 0, dueDate: "" }]);
  }

  function removeMilestone(idx: number) {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== idx));
  }

  function updateMilestone(idx: number, field: keyof MilestoneInput, value: string | number) {
    const updated = [...milestones];
    const m = updated[idx];
    if (m) {
      (m as Record<string, string | number>)[field] = value;
      setMilestones(updated);
    }
  }

  function autoBalance() {
    if (milestones.length === 0) return;
    const perMilestone = Math.floor(totalBudget / milestones.length);
    const remainder = totalBudget - perMilestone * milestones.length;
    setMilestones(milestones.map((m, i) => ({
      ...m,
      amountUsdc: perMilestone + (i === 0 ? remainder : 0),
    })));
  }

  async function handleFundAndCreate() {
    setIsSubmitting(true);
    // Simulate contract creation (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Navigate to the newly created contract
    router.push("/contracts/demo-logo-contract");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[#27272A]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Link>
          <span className="text-sm font-semibold">New Contract</span>
          <span className="text-xs text-[#71717A]">Step {step}/4</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6">
        <div className="flex gap-1 py-4">
          {STEPS.map((s) => (
            <div key={s.num} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${s.num <= step ? "bg-[#00D395]" : "bg-[#27272A]"}`} />
              <p className={`text-[10px] mt-1 ${s.num <= step ? "text-[#00D395]" : "text-[#3F3F46]"}`}>{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl font-bold mb-1">Who are you hiring?</h2>
              <p className="text-sm text-[#A1A1AA]">Enter the freelancer&apos;s email. They&apos;ll get an invitation to join.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">Freelancer email</label>
                <input type="email" value={freelancerEmail} onChange={(e) => setFreelancerEmail(e.target.value)} placeholder="freelancer@example.com" className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">Project title</label>
                <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. Logo Design for Klyrn" className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50 transition-colors" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl font-bold mb-1">Describe the project</h2>
              <p className="text-sm text-[#A1A1AA]">This brief is the <span className="text-white font-medium">ground truth</span> for AI arbitration. Be specific.</p>
            </div>
            <div className="flex items-start gap-2 bg-[#00D395]/5 border border-[#00D395]/20 rounded-lg p-3">
              <Info className="w-4 h-4 text-[#00D395] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#00D395]">If there&apos;s ever a dispute, the AI judge will read this brief word for word. Ambiguity is your risk. Be clear about deliverables, quality expectations, and deadlines.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">Project brief (200-5,000 characters)</label>
              <textarea value={briefMarkdown} onChange={(e) => setBriefMarkdown(e.target.value)} placeholder="Describe what you need in detail..." rows={12} className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50 transition-colors resize-none font-mono" />
              <p className="text-[10px] text-[#3F3F46] mt-1 text-right">{briefMarkdown.length}/5,000</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl font-bold mb-1">Set the budget</h2>
              <p className="text-sm text-[#A1A1AA]">Break the project into milestones. Sum must equal total budget.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">Total budget (USD)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input type="number" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} min={20} max={50000} className="w-full bg-[#111113] border border-[#27272A] rounded-lg pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D395]/50 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-[#A1A1AA]">Milestones</label>
                <button onClick={autoBalance} className="text-[10px] text-[#00D395] hover:underline">Auto-balance amounts</button>
              </div>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={i} className="glass-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#00D395]">Milestone {i + 1}</span>
                      {milestones.length > 1 && (<button onClick={() => removeMilestone(i)} className="text-[#EF4444] hover:text-[#EF4444]/70"><Trash2 className="w-3.5 h-3.5" /></button>)}
                    </div>
                    <input value={m.title} onChange={(e) => updateMilestone(i, "title", e.target.value)} placeholder="Milestone title" className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50" />
                    <textarea value={m.description} onChange={(e) => updateMilestone(i, "description", e.target.value)} placeholder="What should be delivered?" rows={2} className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50 resize-none" />
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <DollarSign className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
                        <input type="number" value={m.amountUsdc} onChange={(e) => updateMilestone(i, "amountUsdc", Number(e.target.value))} className="w-full bg-[#09090B] border border-[#27272A] rounded-lg pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D395]/50" />
                      </div>
                      <div className="flex-1">
                        <input type="date" value={m.dueDate} onChange={(e) => updateMilestone(i, "dueDate", e.target.value)} className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D395]/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {milestones.length < 10 && (<button onClick={addMilestone} className="mt-3 flex items-center gap-1 text-xs text-[#00D395] hover:underline"><Plus className="w-3 h-3" /> Add milestone</button>)}
              <div className={`mt-4 flex items-center justify-between text-xs px-3 py-2 rounded-lg ${isBalanced ? "bg-[#00D395]/5 border border-[#00D395]/20" : "bg-[#EF4444]/5 border border-[#EF4444]/20"}`}>
                <span className={isBalanced ? "text-[#00D395]" : "text-[#EF4444]"}>{isBalanced ? "✓ Milestones match budget" : `✗ Milestones total $${milestoneSum}, budget is $${totalBudget}`}</span>
                <span className="font-mono font-semibold" style={{ color: isBalanced ? "#00D395" : "#EF4444" }}>${milestoneSum} / ${totalBudget}</span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl font-bold mb-1">Review & Fund</h2>
              <p className="text-sm text-[#A1A1AA]">Confirm everything looks correct, then deposit funds into escrow.</p>
            </div>
            <div className="glass-card p-5 space-y-4">
              <div className="flex justify-between text-sm"><span className="text-[#71717A]">Freelancer</span><span>{freelancerEmail || "Not set"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#71717A]">Project</span><span>{projectTitle || "Not set"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#71717A]">Total Budget</span><span className="font-semibold">${totalBudget}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#71717A]">Milestones</span><span>{milestones.length}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#71717A]">Platform Fee</span><span className="text-[#00D395]">${Math.min(totalBudget * 0.01, 50).toFixed(2)} (1%)</span></div>
              <div className="border-t border-[#27272A] pt-3 flex justify-between text-sm font-semibold"><span>Total to deposit</span><span className="text-[#00D395]">${(totalBudget + Math.min(totalBudget * 0.01, 50)).toFixed(2)}</span></div>
            </div>
            <div className="flex items-start gap-2 bg-[#111113] border border-[#27272A] rounded-lg p-3">
              <Shield className="w-4 h-4 text-[#00D395] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#A1A1AA]">Funds are held in a secure on-chain escrow. They can only be released when you approve the work, or by AI/jury arbitration if disputed. Neither party, including Klyrn, can access them otherwise.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < 4 ? (
            <button onClick={() => setStep(Math.min(4, step + 1))} className="flex items-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black font-medium text-sm px-6 py-2.5 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,211,149,0.3)]">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleFundAndCreate} disabled={isSubmitting} className="flex items-center gap-2 bg-[#00D395] hover:bg-[#00B37E] disabled:opacity-60 text-black font-semibold text-sm px-8 py-3 rounded-lg transition-all hover:shadow-[0_0_30px_rgba(0,211,149,0.3)]">
              {isSubmitting ? (<><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Creating...</>) : (<><DollarSign className="w-4 h-4" /> Fund & Create Contract</>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
