// Wordmark logo for the landing page. Renders "index" + a lime accent square to
// match the brand mark, with no image dependency (the in-app logo still uses
// /sweem.png until the dashboard is rebranded separately).
export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#home" aria-label="index — home" className="flex items-end gap-[3px]">
      <span
        className={`text-[21px] font-bold lowercase leading-none tracking-[-0.04em] ${
          dark ? "text-white" : "text-[#101828]"
        }`}
      >
        index
      </span>
      <span aria-hidden className="mb-[3px] inline-block size-[7px] rounded-[1.5px] bg-[#c4f56b]" />
    </a>
  );
}
