import {
  Baby,
  Bone,
  Brain,
  HeartPulse,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  brain: Brain,
  bone: Bone,
  baby: Baby,
  stethoscope: Stethoscope,
  sparkles: Sparkles,
};

export function DepartmentIcon({
  icon,
  className = "h-6 w-6",
}: {
  icon: string;
  className?: string;
}) {
  const Icon = ICONS[icon] ?? Stethoscope;
  return <Icon className={className} strokeWidth={1.9} />;
}
