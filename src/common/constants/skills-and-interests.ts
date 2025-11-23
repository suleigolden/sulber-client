import { 
  FaTools, FaBroom, FaCalculator, FaLeaf, FaUtensils, 
  FaHammer, FaLaptop, FaComments, FaPaw, FaCalendarAlt,
  FaBook, FaDumbbell, FaMusic, FaPlane, FaPaintBrush,
  FaCookie, FaGamepad, FaCamera, FaHandsHelping, FaUsers,
  FaHome 
} from "react-icons/fa";

export type Skill = {
  label: string;
  icon: React.ElementType;
  category: 'maintenance' | 'organization' | 'social' | 'technical';
};

export type Interest = {
  label: string;
  icon: React.ElementType;
  category: 'indoor' | 'outdoor' | 'creative' | 'social';
};

export const skills: Skill[] = [
  { label: "Home Maintenance & Repairs", icon: FaTools, category: 'maintenance' },
  { label: "Cleaning & Organization", icon: FaBroom, category: 'organization' },
  { label: "Budgeting & Financial Planning", icon: FaCalculator, category: 'organization' },
  { label: "Gardening & Landscaping", icon: FaLeaf, category: 'maintenance' },
  { label: "Cooking & Meal Prep", icon: FaUtensils, category: 'organization' },
  { label: "DIY & Home Projects", icon: FaHammer, category: 'maintenance' },
  { label: "Tech Savvy", icon: FaLaptop, category: 'technical' },
  { label: "Conflict Resolution", icon: FaComments, category: 'social' },
  { label: "Pet Care", icon: FaPaw, category: 'maintenance' },
  { label: "Event Planning", icon: FaCalendarAlt, category: 'social' },
];

export const interests: Interest[] = [
  { label: "Reading", icon: FaBook, category: 'indoor' },
  { label: "Fitness & Wellness", icon: FaDumbbell, category: 'outdoor' },
  { label: "Music", icon: FaMusic, category: 'creative' },
  { label: "Traveling", icon: FaPlane, category: 'outdoor' },
  { label: "Art & Design", icon: FaPaintBrush, category: 'creative' },
  { label: "Cooking & Baking", icon: FaCookie, category: 'indoor' },
  { label: "Gaming", icon: FaGamepad, category: 'indoor' },
  { label: "Photography & Videography", icon: FaCamera, category: 'creative' },
  { label: "Volunteering", icon: FaHandsHelping, category: 'social' },
  { label: "Socializing", icon: FaUsers, category: 'social' },
  { label: "Home Decor & Interior Design", icon: FaHome, category: 'creative' },
]; 