import {
  FaWifi,
  FaTv,
  FaParking,
  FaCar,
  FaSnowflake,
  FaBriefcase,
  FaSwimmer,
  FaHotTub,
  FaUmbrellaBeach,
  FaFireAlt,
  FaDumbbell,
  FaShower,
  FaFireExtinguisher,
  FaFirstAid,
  FaSmog,
  FaDoorOpen,
} from "react-icons/fa";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import {
  GiFireplace,
  GiBarbecue,
  GiGamepadCross,
  GiLift,
  GiWaterfall,
  GiGrandPiano,
  GiCookingPot,
} from "react-icons/gi";
import { BiHome } from "react-icons/bi";

export type Amenity = {
  label: string;
  icon: React.ElementType;
  category: 'favorites' | 'standouts' | 'safety';
};

export const amenities: Amenity[] = [
  { label: "Wifi", icon: FaWifi, category: 'favorites' },
  { label: "TV", icon: FaTv, category: 'favorites' },
  { label: "Kitchen", icon: GiCookingPot, category: 'favorites' },
  { label: "Washer", icon: MdOutlineLocalLaundryService, category: 'favorites' },
  { label: "Free parking on premises", icon: FaCar, category: 'favorites' },
  { label: "Paid parking on premises", icon: FaParking, category: 'favorites' },
  { label: "Air conditioning", icon: FaSnowflake, category: 'favorites' },
  { label: "Free parking on garage", icon: FaCar, category: 'favorites' },
  { label: "Free parking on street", icon: FaCar, category: 'favorites' },
  { label: "Free parking on driveway", icon: FaCar, category: 'favorites' },
  { label: "Dedicated workspace", icon: FaBriefcase, category: 'favorites' },
  { label: "Pool", icon: FaSwimmer, category: 'standouts' },
  { label: "Hot tub", icon: FaHotTub, category: 'standouts' },
  { label: "Patio", icon: FaUmbrellaBeach, category: 'standouts' },
  { label: "BBQ grill", icon: GiBarbecue, category: 'standouts' },
  { label: "Outdoor dining area", icon: BiHome, category: 'standouts' },
  { label: "Fire pit", icon: FaFireAlt, category: 'standouts' },
  { label: "Pool table", icon: GiGamepadCross, category: 'standouts' },
  { label: "Indoor fireplace", icon: GiFireplace, category: 'standouts' },
  { label: "Piano", icon: GiGrandPiano, category: 'standouts' },
  { label: "Exercise equipment", icon: FaDumbbell, category: 'standouts' },
  { label: "Lake access", icon: GiWaterfall, category: 'standouts' },
  { label: "Beach access", icon: FaUmbrellaBeach, category: 'standouts' },
  { label: "Ski-in/Ski-out", icon: GiLift, category: 'standouts' },
  { label: "Outdoor shower", icon: FaShower, category: 'standouts' },
  { label: "Smoke alarm", icon: FaSmog, category: 'safety' },
  { label: "First aid kit", icon: FaFirstAid, category: 'safety' },
  { label: "Fire extinguisher", icon: FaFireExtinguisher, category: 'safety' },
  { label: "Carbon monoxide alarm", icon: FaDoorOpen, category: 'safety' },
]; 