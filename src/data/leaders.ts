export type Leader = {
  id: string;
  name: string;
  role: string;
  qualifications?: string;
  bio: string;
  email?: string[];
  phone?: string[];
  achievements?: string;
  dob?: string;
  image?: string;
};

export const leaders: Leader[] = [
  {
    id: 'governor',
    name: 'Shri Acharya Devvrat',
    role: 'Governor of Maharashtra & Gujarat (Chancellor)',
    qualifications: 'Graduate; Postgraduate; B.Ed.; Diploma in Yoga Science; Doctor of Naturopathy and Yogic Science',
    bio: 'Experienced educationist with 45+ years in teaching and administration. Former Governor of Himachal Pradesh and current Governor of Gujarat. Appointed to discharge duties of the Governor of Maharashtra in September 2025. Known for promoting natural farming, Vedic culture, social harmony, and youth development.',
    achievements: 'Distinguished career spanning decades in education and public service; advocate for Vedic culture and natural farming; champion of youth development and social harmony',
    dob: '18 January 1959',
    image: '/governor.png',
  },
  {
    id: 'vice-chancellor',
    name: 'Prof. V. L. Maheshwari',
    role: 'Vice-Chancellor',
    qualifications: 'M.Sc. (Biochemistry), Ph.D.',
    bio: 'Biochemistry expert serving as Vice-Chancellor of KBCNMU, Jalgaon.',
    email: ['vco@nmu.ac.in', 'vc@nmu.ac.in'],
    phone: ['+91-257-2257204', '+91-257-2257206'],
    image: '/vice-chancellor.png',
  },
  {
    id: 'pro-vice-chancellor',
    name: 'Prof. S. T. Ingle',
    role: 'Pro-Vice-Chancellor',
    qualifications: 'M.Sc. (Environmental Science), Ph.D.',
    bio: 'Senior professor with major contributions in Environmental Science, NAAC accreditation, and university administration. Took office as Pro-Vice-Chancellor on 05 July 2022.',
    email: ['pvc@nmu.ac.in', 'pvcresearch@nmu.ac.in'],
    image: '/pro-vc.png',
  },
  {
    id: 'registrar',
    name: 'Dr. Vinod Patil',
    role: 'Registrar',
    qualifications: 'Ph.D.',
    bio: 'Serving as Registrar of KBCNMU, responsible for administrative coordination and university operations.',
    email: ['registrar@nmu.ac.in'],
    phone: ['+91-257-2257215'],
    image: '/registrar.png',
  },
];

export function getLeaderById(id: string): Leader | undefined {
  return leaders.find((leader) => leader.id === id);
}
