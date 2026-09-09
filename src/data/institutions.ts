export type InstitutionType = 'University' | 'Polytechnic' | 'College of Education' | 'Other';

export interface InstitutionItem {
  id: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  state?: string;
}

export const INSTITUTION_TYPES: InstitutionType[] = [
  'University',
  'Polytechnic',
  'College of Education',
  'Other',
];

export const ACADEMIC_LEVELS = [
  '100 Level',
  '200 Level',
  '300 Level',
  '400 Level',
  '500 Level',
  '600 Level',
  'ND 1',
  'ND 2',
  'HND 1',
  'HND 2',
  'NCE 1',
  'NCE 2',
  'NCE 3',
  'Postgraduate / Masters',
  'Other',
];

export const INSTITUTIONS: InstitutionItem[] = [
  // Universities
  { id: 'unilag', name: 'University of Lagos', shortName: 'UNILAG', type: 'University', state: 'Lagos' },
  { id: 'ui', name: 'University of Ibadan', shortName: 'UI', type: 'University', state: 'Oyo' },
  { id: 'oau', name: 'Obafemi Awolowo University', shortName: 'OAU', type: 'University', state: 'Osun' },
  { id: 'unilorin', name: 'University of Ilorin', shortName: 'UNILORIN', type: 'University', state: 'Kwara' },
  { id: 'unn', name: 'University of Nigeria, Nsukka', shortName: 'UNN', type: 'University', state: 'Enugu' },
  { id: 'abu', name: 'Ahmadu Bello University', shortName: 'ABU', type: 'University', state: 'Kaduna' },
  { id: 'futa', name: 'Federal University of Technology Akure', shortName: 'FUTA', type: 'University', state: 'Ondo' },
  { id: 'futminna', name: 'Federal University of Technology Minna', shortName: 'FUTMINNA', type: 'University', state: 'Niger' },
  { id: 'futo', name: 'Federal University of Technology Owerri', shortName: 'FUTO', type: 'University', state: 'Imo' },
  { id: 'uniben', name: 'University of Benin', shortName: 'UNIBEN', type: 'University', state: 'Edo' },
  { id: 'lasu', name: 'Lagos State University', shortName: 'LASU', type: 'University', state: 'Lagos' },
  { id: 'oou', name: 'Olabisi Onabanjo University', shortName: 'OOU', type: 'University', state: 'Ogun' },
  { id: 'eksu', name: 'Ekiti State University', shortName: 'EKSU', type: 'University', state: 'Ekiti' },
  { id: 'covenant', name: 'Covenant University', shortName: 'CU', type: 'University', state: 'Ogun' },
  { id: 'babcock', name: 'Babcock University', shortName: 'BU', type: 'University', state: 'Ogun' },
  { id: 'bowen', name: 'Bowen University', shortName: 'BOWEN', type: 'University', state: 'Osun' },
  { id: 'afe-babalola', name: 'Afe Babalola University', shortName: 'ABUAD', type: 'University', state: 'Ekiti' },
  { id: 'pan-atlantic', name: 'Pan-Atlantic University', shortName: 'PAU', type: 'University', state: 'Lagos' },
  { id: 'noun', name: 'National Open University of Nigeria', shortName: 'NOUN', type: 'University', state: 'National' },
  { id: 'kwasu', name: 'Kwara State University', shortName: 'KWASU', type: 'University', state: 'Kwara' },
  { id: 'uniabuja', name: 'University of Abuja', shortName: 'UNIABUJA', type: 'University', state: 'Abuja' },
  { id: 'unical', name: 'University of Calabar', shortName: 'UNICAL', type: 'University', state: 'Cross River' },
  { id: 'uniport', name: 'University of Port Harcourt', shortName: 'UNIPORT', type: 'University', state: 'Rivers' },
  { id: 'unijos', name: 'University of Jos', shortName: 'UNIJOS', type: 'University', state: 'Plateau' },
  { id: 'unimaid', name: 'University of Maiduguri', shortName: 'UNIMAID', type: 'University', state: 'Borno' },
  { id: 'bayero', name: 'Bayero University Kano', shortName: 'BUK', type: 'University', state: 'Kano' },
  { id: 'delsu', name: 'Delta State University', shortName: 'DELSU', type: 'University', state: 'Delta' },
  { id: 'aaue', name: 'Ambrose Alli University', shortName: 'AAU', type: 'University', state: 'Edo' },

  // Polytechnics
  { id: 'yabatech', name: 'Yaba College of Technology', shortName: 'YABATECH', type: 'Polytechnic', state: 'Lagos' },
  { id: 'fedpoly-ilaro', name: 'Federal Polytechnic, Ilaro', shortName: 'FPI', type: 'Polytechnic', state: 'Ogun' },
  { id: 'fedpoly-offa', name: 'Federal Polytechnic, Offa', shortName: 'FEDPOFFA', type: 'Polytechnic', state: 'Kwara' },
  { id: 'fedpoly-ede', name: 'Federal Polytechnic, Ede', shortName: 'FEDPOLEDE', type: 'Polytechnic', state: 'Osun' },
  { id: 'kadpoly', name: 'Kaduna Polytechnic', shortName: 'KADPOLY', type: 'Polytechnic', state: 'Kaduna' },
  { id: 'the-poly-ibadan', name: 'The Polytechnic, Ibadan', shortName: 'POLYIBADAN', type: 'Polytechnic', state: 'Oyo' },
  { id: 'laspotech', name: 'Lagos State Polytechnic (LASUSTECH)', shortName: 'LASPOTECH', type: 'Polytechnic', state: 'Lagos' },
  { id: 'auchi-poly', name: 'Auchi Polytechnic', shortName: 'AUCHIPOLY', type: 'Polytechnic', state: 'Edo' },
  { id: 'fedpoly-nekede', name: 'Federal Polytechnic, Nekede', shortName: 'FPNO', type: 'Polytechnic', state: 'Imo' },
  { id: 'fedpoly-oko', name: 'Federal Polytechnic, Oko', shortName: 'OKOPOLY', type: 'Polytechnic', state: 'Anambra' },
  { id: 'fedpoly-ado', name: 'Federal Polytechnic, Ado-Ekiti', shortName: 'FEDPOLYADO', type: 'Polytechnic', state: 'Ekiti' },
  { id: 'fedpoly-bida', name: 'Federal Polytechnic, Bida', shortName: 'FEDPOLYBIDA', type: 'Polytechnic', state: 'Niger' },

  // Colleges of Education
  { id: 'fce-akoka', name: 'Federal College of Education (Technical) Akoka', shortName: 'FCET Akoka', type: 'College of Education', state: 'Lagos' },
  { id: 'adeyemi', name: 'Adeyemi College of Education, Ondo', shortName: 'ACE Ondo', type: 'College of Education', state: 'Ondo' },
  { id: 'alvan-ikoku', name: 'Alvan Ikoku Federal College of Education', shortName: 'ALVAN', type: 'College of Education', state: 'Imo' },
  { id: 'fce-zaria', name: 'Federal College of Education, Zaria', shortName: 'FCE Zaria', type: 'College of Education', state: 'Kaduna' },
  { id: 'fce-kano', name: 'Federal College of Education, Kano', shortName: 'FCE Kano', type: 'College of Education', state: 'Kano' },
  { id: 'fce-abeokuta', name: 'Federal College of Education, Osiele Abeokuta', shortName: 'FCE Abeokuta', type: 'College of Education', state: 'Ogun' },
  { id: 'kwa-coe-ilorin', name: 'Kwara State College of Education, Ilorin', shortName: 'KWCOED', type: 'College of Education', state: 'Kwara' },
  { id: 'fce-pankshin', name: 'Federal College of Education, Pankshin', shortName: 'FCE Pankshin', type: 'College of Education', state: 'Plateau' },
];
