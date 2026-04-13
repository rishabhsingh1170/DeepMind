import { ShieldCheck, Crosshair, FolderUp } from "lucide-react";
import { Upload, LockKeyhole, MessageSquareQuote } from "lucide-react";
import { Shield } from "lucide-react";

export const features = [
  {
    title: "Multi-Tenant Data Isolation",
    description:
      "Company A can never access Company B knowledge because retrieval is hard-filtered by tenant metadata before generation.",
    icon: ShieldCheck,
  },
  {
    title: "Zero Hallucinations",
    description:
      "A strict similarity threshold blocks weak matches, so the assistant answers only when grounded in trusted enterprise documents.",
    icon: Crosshair,
  },
  {
    title: "Admin-Controlled Knowledge Base",
    description:
      "Securely upload and manage document folders manually. Ensure your AI only answers from verified, admin-approved company data.",
    icon: FolderUp,
  },
];

export const securityPoints = [
  "Role-Based Access Control (RBAC) for admins and users.",
  "Enterprise-grade inference powered by the secure Mistral API, ensuring your data is never used for model training.",
  "Encrypted ChromaDB vector storage with tenant-scoped retrieval.",
];

export const steps = [
  {
    title: "Admin Uploads Documents",
    description:
      "Ingest HR policies, SOPs, manuals, and team knowledge from approved company sources.",
    icon: Upload,
  },
  {
    title: "System encrypts and vectorizes",
    description:
      "Content is securely processed, embedded, and isolated by tenant for private retrieval.",
    icon: LockKeyhole,
  },
  {
    title: "Employees get instant, cited answers",
    description:
      "Users ask in natural language and receive grounded responses with document references.",
    icon: MessageSquareQuote,
  },
];

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "How it Works", href: "#how-it-works" },
];
