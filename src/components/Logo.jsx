import { Image } from "@/components/ui/image";

const LOGO_URL =
  "https://media.base44.com/images/public/6a6c41544c562d8bc4335ef5/5d581112f_pdf.png";

export default function Logo({ className = "w-9 h-9 rounded-xl" }) {
  return (
    <Image
      src={LOGO_URL}
      fittingType="fill"
      className={className}
      alt="Yangi Hayot"
    />
  );
}