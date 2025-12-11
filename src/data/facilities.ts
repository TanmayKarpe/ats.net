export type Facility = {
  id: string;
  name: string;
  summary: string;
  capabilities: string[];
  majorInstruments: string[];
  sampleTypes: string[];
  contactEmail: string;
};

export const facilities: Facility[] = [
  {
    id: 'advanced-instrumentation',
    name: 'Advanced Instrumentation',
    summary: 'Comprehensive suite of analytical instruments including scanning electron microscopy, X-ray diffraction, spectroscopy systems, and more. Each instrument is maintained to the highest standards by trained technical staff.',
    capabilities: [
      'High-resolution imaging and surface analysis',
      'Crystal structure determination',
      'Molecular and functional group analysis',
      'Elemental composition mapping',
      'Volatile compound separation and identification',
      'Quantitative and qualitative analysis'
    ],
    majorInstruments: [
      'FE-SEM (Field Emission Scanning Electron Microscope)',
      'XRD System (X-Ray Diffractometer)',
      'FTIR Spectrometer (Fourier Transform Infrared)',
      'UV-Vis Spectrophotometer',
      'GC-MS (Gas Chromatography - Mass Spectrometry)',
      'NMR (Nuclear Magnetic Resonance)'
    ],
    sampleTypes: [
      'Solids and powders',
      'Thin films and coatings',
      'Liquids and solutions',
      'Polymers and composites',
      'Minerals and crystals'
    ],
    contactEmail: 'ats@nmu.ac.in'
  },
  {
    id: 'technical-support',
    name: 'Technical Support',
    summary: 'Our experienced team of scientists and technical staff provide expert guidance on sample preparation, methodology, data interpretation, and troubleshooting to ensure successful analysis and meaningful results.',
    capabilities: [
      'Expert consultation on analysis design',
      'Sample preparation guidance',
      'Methodology optimization',
      'Data interpretation and analysis',
      'Troubleshooting and problem-solving',
      'Technical training and mentoring'
    ],
    majorInstruments: [
      'Trained technical staff (24+ years experience)',
      'PhD-level scientists',
      'Specialized expertise in materials science',
      'Support for multiple research domains'
    ],
    sampleTypes: [
      'Organic materials',
      'Inorganic compounds',
      'Biological samples',
      'Industrial products',
      'Environmental samples'
    ],
    contactEmail: 'ats@nmu.ac.in'
  },
  {
    id: 'sample-preparation-labs',
    name: 'Sample Preparation Labs',
    summary: 'Complete sample preparation facilities are available, including areas for grinding, mixing, dissolution, and other pre-analysis treatments required for different types of samples.',
    capabilities: [
      'Wet chemical preparation',
      'Mechanical grinding and mixing',
      'Dissolution and extraction',
      'Filtration and purification',
      'Coating and mounting',
      'Temperature-controlled processing'
    ],
    majorInstruments: [
      'Grinding mills and mortars',
      'Dissolution chambers',
      'Filtration systems',
      'Coating equipment',
      'Sample mounts and holders'
    ],
    sampleTypes: [
      'Powders and granules',
      'Bulk materials',
      'Small specimens',
      'Liquid and solution samples',
      'Delicate biological samples'
    ],
    contactEmail: 'ats@nmu.ac.in'
  },
  {
    id: 'training-programs',
    name: 'Training Programs',
    summary: 'Regular hands-on training workshops and seminars are conducted to help users understand instrument operation, best practices, and advanced techniques for optimal results.',
    capabilities: [
      'Hands-on instrument training',
      'Best practices workshops',
      'Advanced technique seminars',
      'Data analysis training',
      'Research methodology courses',
      'Customized training programs'
    ],
    majorInstruments: [
      'All ATS instruments available for training',
      'Training lab with sample instruments',
      'Documentation and manuals',
      'Video tutorial materials'
    ],
    sampleTypes: [
      'Standard reference materials',
      'Training samples',
      'Real research samples',
      'Quality control samples'
    ],
    contactEmail: 'ats@nmu.ac.in'
  }
];

export function getFacilityById(id: string): Facility | undefined {
  return facilities.find((f) => f.id === id);
}
