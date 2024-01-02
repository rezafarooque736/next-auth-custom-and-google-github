import Image from "next/image";
import logo from "./logoRailtel.png";

export default function LogoIcons() {
  return (
    <Image
      src={logo}
      alt="railtel logo"
      width={50}
      height={64}
      className="w-[50px] h-[64px]"
    />
  );
}
