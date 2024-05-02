import { IoMdSettings } from "react-icons/io";
import PopoverBtn from "./Popover";
import { FaPlus } from "react-icons/fa";

const VerticalNav = () => {
  return (
    <nav className="w-64 h-screen px-16 text-white bg-transparent">
      <ul className="text-black">
        <li>
          <a href="/home" className="flex gap-2 px-2">
            <FaPlus />
            New Note
          </a>
        </li>
      </ul>

      <PopoverBtn />

      <button>
        <IoMdSettings />
        Settings
      </button>
    </nav>
  );
};

export default VerticalNav;
