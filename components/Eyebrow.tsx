import Scramble from "./Scramble";

/** Label de section façon plaquette de nav : code + libellé. */
export default function Eyebrow({ code, label }: { code: string; label: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted mb-6">
      <span className="lit inline-block size-1.5 rounded-full bg-accent" aria-hidden />
      <Scramble text={code} className="text-accent" />
      <span aria-hidden>/</span>
      <span>{label}</span>
    </p>
  );
}
