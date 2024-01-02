import Image from "next/image";
import logo from "./logoRailtel.png";

export default function LogoIcons() {
  return (
    <Image
      src={logo}
      alt="railtel logo"
      width={48}
      height={60}
      className="w-[48px] h-[60px] p-2"
    />
  );
}
