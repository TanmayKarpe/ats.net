export type Service = {
  id: string;
  name: string;
  category: string;
  summary: string;
  applications: string[];
  workflow: string[];
  pricingNote: string;
  turnaroundTime?: string;
  contactEmail: string;
};

export const services: Service[] = [
  {
    id: 'internal-users',
    name: 'Internal Users',
    category: 'Students & Faculty of KBCNMU',
    summary: 'Priority access with subsidized rates for all university members. Quick turnaround for academic research projects.',
    applications: [
      'Academic research',
      'Thesis and dissertation work',
      'Course project analysis',
      'Collaborative university research'
    ],
    workflow: [
      'Submit sample request form via portal',
      'Sample intake and preparation',
      'Analysis on scheduled date',
      'Data processing and QC',
      'Report generation and delivery'
    ],
    pricingNote: 'Subsidized tariff rates available for all KBCNMU students and faculty members',
    turnaroundTime: '3-5 working days',
    contactEmail: 'ats@nmu.ac.in'
  },
  {
    id: 'external-academic',
    name: 'External Academic',
    category: 'Other Universities & Institutes',
    summary: 'Collaborative access for researchers from other academic institutions across India and globally.',
    applications: [
      'Inter-institutional research',
      'National collaborative projects',
      'International research partnerships',
      'Network research programs'
    ],
    workflow: [
      'Submit request and institutional affiliation',
      'Quotation and approval',
      'Sample shipment or delivery',
      'Scheduled analysis',
      'Report and results delivery'
    ],
    pricingNote: 'Competitive academic rates with bulk discounts available for large projects',
    turnaroundTime: '5-7 working days',
    contactEmail: 'ats@nmu.ac.in'
  },
  {
    id: 'industry-rd-labs',
    name: 'Industry & R&D Labs',
    category: 'Corporate & Industrial Partners',
    summary: 'Premium analytical services for quality control, product development, and industrial research needs.',
    applications: [
      'Quality control and assurance',
      'Product development and testing',
      'Materials characterization',
      'Failure analysis',
      'Compliance and regulatory testing'
    ],
    workflow: [
      'Contact facility manager for custom package',
      'Confidentiality agreement and pricing',
      'Sample submission and tracking',
      'Priority express processing',
      'Dedicated technical support and reporting'
    ],
    pricingNote: 'Premium rates with express processing, confidential handling, and custom packages available',
    turnaroundTime: '1-3 working days (express available)',
    contactEmail: 'ats@nmu.ac.in'
  }
];

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}
