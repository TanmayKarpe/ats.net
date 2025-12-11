import instrumentFesem from '@/assets/instrument-fesem.jpg';
import instrumentFtir from '@/assets/instrument-ftir.jpg';
import instrumentXrd from '@/assets/instrument-xrd.jpg';
import instrumentUvvis from '@/assets/instrument-uvvis.jpg';
import instrumentGcms from '@/assets/instrument-gcms.jpg';
import instrumentNmr from '@/assets/instrument-nmr.jpg';

export type Instrument = {
  id: string;
  name: string;
  category: string;
  summary: string;
  applications: string[];
  specs: string[];
  sampleRequirements: string[];
  pricingNote: string;
  contactEmail: string;
  image?: string;
};

export const instruments: Instrument[] = [
  {
    id: 'fe-sem',
    name: 'FE-SEM',
    category: 'Electron Microscopy',
    summary: 'Field Emission Scanning Electron Microscope for high-resolution surface imaging and elemental mapping (EDS).',
    applications: [
      'Surface imaging',
      'Morphology analysis',
      'Elemental mapping (EDS)'
    ],
    specs: [
      'Resolution: sub-nanometer to a few nanometers (application dependent)',
      'Accelerating voltage: 0.5 - 30 kV',
      'EDS detector for elemental analysis'
    ],
    sampleRequirements: [
      'Dry samples',
      'Conductive or coated (metal sputter-coating available)',
      'Max sample size: refer to facility guidelines'
    ],
    pricingNote: 'Hourly rates vary by user category. Contact for quote.',
    contactEmail: 'ats@nmu.ac.in',
    image: instrumentFesem
  },
  {
    id: 'ftir-spectrometer',
    name: 'FTIR Spectrometer',
    category: 'Spectroscopy',
    summary: 'Fourier Transform Infrared Spectrometer for molecular structure and functional group identification.',
    applications: [
      'Organic functional group identification',
      'Polymer analysis',
      'Surface contamination checks'
    ],
    specs: [
      'Wavenumber range: 4000 - 400 cm^-1',
      'ATR & transmission modes',
      'Resolution: up to 0.5 cm^-1'
    ],
    sampleRequirements: [
      'Thin films, solids (powders/pressed pellets), liquids (drops/cells)',
      'Minimal moisture for transmission measurements'
    ],
    pricingNote: 'Standard per-scan or per-sample pricing applies.',
    contactEmail: 'ats@nmu.ac.in',
    image: instrumentFtir
  },
  {
    id: 'xrd-system',
    name: 'XRD System',
    category: 'Diffraction',
    summary: 'X-Ray Diffractometer for crystal structure determination and phase identification.',
    applications: [
      'Phase identification',
      'Crystallinity and lattice parameter analysis',
      'Thin film & powder diffraction'
    ],
    specs: [
      'Radiation: Cu Kα',
      'Scan range: configurable for powder & thin film',
      'Goniometer with high angular resolution'
    ],
    sampleRequirements: [
      'Powders (flat mount), thin films (as mounted), minimal preferred moisture'
    ],
    pricingNote: 'Pricing depends on scan time and analysis complexity.',
    contactEmail: 'ats@nmu.ac.in',
    image: instrumentXrd
  },
  {
    id: 'uv-vis',
    name: 'UV-Vis Spectrophotometer',
    category: 'Spectroscopy',
    summary: 'UV-Visible Spectrophotometer for absorption spectroscopy and concentration measurements.',
    applications: [
      'Concentration determination',
      'Optical property measurements',
      'Kinetic studies'
    ],
    specs: [
      'Wavelength range: UV-Vis',
      'Cuvette-based measurements and plate-reader options',
      'High photometric accuracy'
    ],
    sampleRequirements: [
      'Liquid samples in cuvettes or microplates',
      'Clear, particle-free solutions preferred'
    ],
    pricingNote: 'Low-cost per-sample analysis; contact for bulk processing rates.',
    contactEmail: 'ats@nmu.ac.in',
    image: instrumentUvvis
  },
  {
    id: 'gc-ms',
    name: 'GC-MS',
    category: 'Chromatography / Mass Spectrometry',
    summary: 'Gas Chromatography — Mass Spectrometry for volatile and semi-volatile compound separation and identification.',
    applications: [
      'Volatile organic compound analysis',
      'Purity checks',
      'Trace detection'
    ],
    specs: [
      'GC separation coupled to MS detection',
      'Libraries available for compound ID',
      'High sensitivity detectors'
    ],
    sampleRequirements: [
      'Volatile or derivatizable samples',
      'Dissolved in appropriate solvent, filtered as required'
    ],
    pricingNote: 'Sample prep and instrument time billed separately.',
    contactEmail: 'ats@nmu.ac.in',
    image: instrumentGcms
  },
  {
    id: 'nmr',
    name: 'NMR',
    category: 'Spectroscopy',
    summary: 'Nuclear Magnetic Resonance Spectrometer for molecular structure elucidation (1H, 13C and 2D experiments).',
    applications: [
      'Structure elucidation',
      'Purity and impurity profiling',
      'Quantitative NMR'
    ],
    specs: [
      'Nucleus: 1H, 13C (500 MHz class example)',
      '2D experiments available (COSY, HSQC, HMBC)',
      'Variable temperature capability'
    ],
    sampleRequirements: [
      'Deuterated solvents where required',
      'Concentration dependent on nucleus and experiment'
    ],
    pricingNote: 'Pricing depends on experiment type and instrument time.',
    contactEmail: 'ats@nmu.ac.in',
    image: instrumentNmr
  }
];

export function getInstrumentById(id: string) {
  return instruments.find((i) => i.id === id) ?? null;
}
