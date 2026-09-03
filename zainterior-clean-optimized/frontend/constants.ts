import { ProjectStage, StageStatus, Milestone, ArchitectProfile, GlobalState, ClientProjectData, BlockedSlot } from './types';

export const INITIAL_ARCHITECT_PROFILE: ArchitectProfile = {
  name: 'Arch. Zainab Al-Zaki',
  title: 'Lead Architect',
  avatar: 'https://picsum.photos/id/1027/200/200'
};

const getMilestonesForTier = (tier: string, activeStageIdx: number): Milestone[] => {
  let stages: { id: string, stage: ProjectStage, weight: number }[] = [];
  
  if (tier.includes('Essential')) {
    stages = [
      { id: 'm1', stage: ProjectStage.CONCEPT, weight: 30 },
      { id: 'm2', stage: ProjectStage.LAYOUTS, weight: 70 }
    ];
  } else if (tier.includes('Executive')) {
    stages = [
      { id: 'm1', stage: ProjectStage.CONCEPT, weight: 15 },
      { id: 'm2', stage: ProjectStage.LAYOUTS, weight: 25 },
      { id: 'm3', stage: ProjectStage.RENDERS, weight: 30 },
      { id: 'm4', stage: ProjectStage.SPECIFICATIONS, weight: 30 }
    ];
  } else {
    // VIP Signature
    stages = [
      { id: 'm1', stage: ProjectStage.CONCEPT, weight: 10 },
      { id: 'm2', stage: ProjectStage.LAYOUTS, weight: 15 },
      { id: 'm3', stage: ProjectStage.RENDERS, weight: 20 },
      { id: 'm4', stage: ProjectStage.SPECIFICATIONS, weight: 20 },
      { id: 'm5', stage: ProjectStage.CONSTRUCTION, weight: 25 },
      { id: 'm6', stage: ProjectStage.HANDOVER, weight: 10 }
    ];
  }

  return stages.map((s, idx) => ({
    ...s,
    status: activeStageIdx > idx ? StageStatus.COMPLETED : (activeStageIdx === idx ? StageStatus.IN_PROGRESS : StageStatus.UPCOMING),
    progress: activeStageIdx > idx ? 100 : (activeStageIdx === idx ? 50 : 0),
    date: activeStageIdx >= idx ? 'Oct 2023' : undefined
  }));
};

const calculateCompletion = (milestones: Milestone[]): number => {
  return Math.round(milestones.reduce((acc, m) => acc + (m.status === StageStatus.COMPLETED ? m.weight : (m.status === StageStatus.IN_PROGRESS ? m.weight * 0.5 : 0)), 0));
};

const createMockClient = (
  id: string, name: string, tier: string, project: string, area: string, location: string, style: string, activeStageIdx: number, avatarId: number, hasUnread: boolean, hasPending: boolean, hasTickets: boolean, status: 'Active' | 'Archived' = 'Active', freeConsultations: number = 2
): ClientProjectData => {
  const milestones = getMilestonesForTier(tier, activeStageIdx);
  const completion = calculateCompletion(milestones);

  return {
    profile: { id, name, tier, project, area, location, style, completion, avatar: `https://picsum.photos/id/${avatarId}/200/200`, status, freeConsultations },
    milestones,
    materials: [
      { id: 'mat1', title: 'Master Bedroom Flooring', type: 'Material Swatch', status: hasPending ? 'Pending' : 'Approved', img: '1015' },
      { id: 'mat2', title: 'Ground Floor MEP Layout', type: 'Blueprint (DWG/PDF)', status: 'Approved', img: '1016' }
    ],
    invoice: {
      id: `INV-2024-${Math.floor(Math.random() * 1000)}`,
      date: 'Oct 24, 2024',
      status: status === 'Archived' ? 'Paid' : 'Pending',
      items: [
        { id: 'inv1', desc: 'Stage 3: 3D High-Fidelity Modeling & Renders', amount: 4500 },
        { id: 'inv2', desc: 'Material Sourcing Retainer', amount: 2000 }
      ]
    },
    chatHistory: [
      { id: 'msg1', sender: 'ARCHITECT', text: "Good morning. I've uploaded the revised plans. Let me know your thoughts.", timestamp: '09:00 AM' },
      ...(hasUnread ? [{ id: 'msg2', sender: 'CLIENT' as const, text: "I have a question regarding the lighting fixtures.", timestamp: '10:30 AM' }] : [])
    ],
    contract: { isSignedByClient: status === 'Archived', isSealedByArchitect: status === 'Archived' },
    tickets: hasTickets ? [{
      id: 'tkt1',
      subject: 'Site Access Request',
      description: 'I would like to visit the site next week to see the progress on the MEP layout.',
      status: 'Under Review',
      date: 'Oct 20, 2024'
    }] : [],
    bookings: [],
    tasks: [
      { id: 'tsk1', title: 'Finalize Lighting Specs', dueDate: 'Oct 28, 2024', completed: status === 'Archived', priority: 'High' },
      { id: 'tsk2', title: 'Review MEP Drawings', dueDate: 'Nov 02, 2024', completed: true, priority: 'Medium' }
    ],
    hasUnreadMessages: hasUnread,
    hasPendingApprovals: hasPending,
    hasNewTickets: hasTickets
  };
};

export const INITIAL_BLOCKED_SLOTS: BlockedSlot[] = [
  { id: 'blk1', date: 18, time: 'ALL_DAY', durationHours: 24, reason: 'Site Visits' },
  { id: 'blk2', date: 22, time: '10:00 AM', durationHours: 2, reason: 'Internal Meeting' }
];

export const INITIAL_STATE: GlobalState = {
  architectProfile: INITIAL_ARCHITECT_PROFILE,
  activeClientId: 'client1',
  blockedSlots: INITIAL_BLOCKED_SLOTS,
  clients: {
    'client1': createMockClient('client1', 'Ahmad Bin Jassim', 'VIP Signature Tier', 'Diyar Al Muharraq Villa', '840 m²', 'Muharraq, Bahrain', 'Warm Minimalism', 3, 1005, true, true, true, 'Active', 2),
    'client2': createMockClient('client2', 'Sheikha Mariam Al-Khalifa', 'Executive Residence', 'Riffa Golf Estate Villa', '1,250 m²', 'Riffa, Bahrain', 'Modern Classical / Biophilic', 2, 1025, false, true, false, 'Active', 0),
    'client3': createMockClient('client3', 'Faisal Al-Ghanim', 'VIP Signature Tier', 'Amwaj Oceanfront Villa', '680 m²', 'Amwaj Islands, Bahrain', 'Contemporary Coastal Luxury', 5, 1012, true, false, false, 'Active', 1),
    'client4': createMockClient('client4', 'Dr. Tariq Al-Mansoor', 'Essential Concept', 'Saar Equestrian Residence', '950 m²', 'Saar, Bahrain', 'Brutalist Warm Stone', 1, 1042, false, false, true, 'Active', 0),
    'client5': createMockClient('client5', 'Khalid Al-Fadhel', 'VIP Signature Tier', 'Seef Luxury Penthouse', '450 m²', 'Seef, Bahrain', 'Modern Minimalist', 6, 1050, false, false, false, 'Archived', 0),
  }
};

export const PACKAGES = [
  { id: 'p1', name: 'Essential Concept', price: '2,500 BHD', features: ['Space Planning', 'Moodboards', '2D Layouts'] },
  { id: 'p2', name: 'Executive Residence', price: '6,800 BHD', features: ['3D Renders', 'Material Selection', 'MEP Drawings', 'Project Management'] },
  { id: 'p3', name: 'VIP Signature Atelier', price: '15,000 BHD', features: ['Turnkey Solution', 'Bespoke Furniture', 'VR Walkthroughs', 'Priority Support', 'Post-Handover Care'], recommended: true }
];

export const PORTFOLIO_ITEMS = [
  { id: 'pf1', title: 'Diyar Al Muharraq Estate', location: 'Muharraq', image: 'https://picsum.photos/id/1048/800/600' },
  { id: 'pf2', title: 'Riffa Views Mansion', location: 'Riffa', image: 'https://picsum.photos/id/1031/800/600' },
  { id: 'pf3', title: 'Saar Modern Villa', location: 'Saar', image: 'https://picsum.photos/id/1015/800/600' },
  { id: 'pf4', title: 'Amwaj Penthouse', location: 'Amwaj Islands', image: 'https://picsum.photos/id/1016/800/600' }
];
