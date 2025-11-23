import { BsHouseDoor, BsBuilding, BsHouse } from "react-icons/bs";
import { FaHome, FaBed, FaUsers } from "react-icons/fa";
import { MdApartment, MdLandscape, MdMoreHoriz } from "react-icons/md";

export const PropertyTypes = [
    {
      value: "Entire place",
      icon: FaHome,
      description: "Guests have the whole place to themselves",
    },
    {
      value: "Private room",
      icon: FaBed,
      description: "Guests have their own room in a shared space",
    },
    {
      value: "Shared room",
      icon: FaUsers,
      description: "Guests share a room with others",
    },
];
  
export const BuildingTypes = [
    { value: "Single Family", icon: BsHouseDoor },
    { value: "Building", icon: BsBuilding },
    { value: "Apartment", icon: MdApartment },
    { value: "Condo", icon: BsHouse },
    { value: "Land", icon: MdLandscape },
    { value: "Other", icon: MdMoreHoriz },
]; 