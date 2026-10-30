import { AIPlanType } from './schemas';

export interface EventInputContext {
  title: string;
  type: string;
  date?: string | Date | null;
  location: string;
  guestCount: number;
  budgetCeiling: number;
  currency: string;
  theme?: string | null;
  formality?: string | null;
  priorities?: string | null;
  notes?: string | null;
}

export function generateDeterministicPlan(input: EventInputContext): AIPlanType {
  const total = Math.max(1000, Math.round(input.budgetCeiling || 250000));
  const guests = Math.max(1, input.guestCount || 50);
  const type = (input.type || 'WEDDING').toUpperCase();

  // Template allocations per event type
  let allocationsConfig: Array<{ name: string; share: number; note: string }>;

  if (type === 'WEDDING') {
    allocationsConfig = [
      { name: 'Venue & Infrastructure', share: 0.25, note: 'Banquet hall/lawn, basic setup, lighting & generator backup' },
      { name: 'Catering & Dining', share: 0.32, note: `Multi-course seasonal menu for ${guests} guests including beverages & live counters` },
      { name: 'Decor, Mandap & Florals', share: 0.15, note: 'Stage setup, florals, entrance gate, table centerpieces & ambient lights' },
      { name: 'Photography & Videography', share: 0.10, note: 'Candid photographer, cinematic video coverage & pre-event shoots' },
      { name: 'Entertainment & Music', share: 0.06, note: 'DJ, sound equipment, sound permits & traditional music elements' },
      { name: 'Invitations & Favors', share: 0.04, note: 'Digital invitations, printed cards for elders, welcome hampers/sweets' },
      { name: 'Contingency Reserve', share: 0.08, note: 'Held in reserve for sudden weather protection, extra guests, or overtime' },
    ];
  } else if (type === 'BIRTHDAY') {
    allocationsConfig = [
      { name: 'Venue / Space Rental', share: 0.20, note: 'Party hall, rooftop, or clubhouse booking' },
      { name: 'Food, Snacks & Cake', share: 0.35, note: `Specialty themed cake, finger food, dinner & beverages for ${guests} people` },
      { name: 'Themed Decor & Balloons', share: 0.18, note: 'Backdrop photo-op, balloon arches, tableware, and lighting' },
      { name: 'Entertainment & Games', share: 0.12, note: 'Game host/emcee, magic show or musical activity, curated playlist' },
      { name: 'Photography & Keepsakes', share: 0.07, note: 'Candid event photos and custom return gifts / favors' },
      { name: 'Contingency & Incidentals', share: 0.08, note: 'Buffer for last-minute guest additions and service tips' },
    ];
  } else if (type === 'COMMUNITY' || type === 'WORKSHOP') {
    allocationsConfig = [
      { name: 'Auditorium / Hall Booking', share: 0.30, note: 'Accessible venue with seating, projector, stage, and audio system' },
      { name: 'Refreshments & High Tea', share: 0.28, note: `Welcome tea/coffee, snacks, water stations & lunch boxes for ${guests} attendees` },
      { name: 'AV, Microphones & Tech Support', share: 0.16, note: 'Podium mic, collar mics, screen display, sound technician' },
      { name: 'Signage, Badges & Kits', share: 0.12, note: 'Welcome banners, lanyard badges, agenda leaflets, registration desk setup' },
      { name: 'Volunteer Honorariums & Mementos', share: 0.06, note: 'Speaker appreciation gifts, volunteer support allowances' },
      { name: 'Contingency & Emergency', share: 0.08, note: 'First-aid, backup cables, extra chairs, and logistics buffer' },
    ];
  } else {
    // Corporate or Custom
    allocationsConfig = [
      { name: 'Conference Venue & Setup', share: 0.30, note: 'Main session hall with breakout zones and registration foyer' },
      { name: 'F&B & Delegate Catering', share: 0.30, note: `Breakfast buffet, continuous coffee/tea service & networking lunch` },
      { name: 'Stage, AV & Livestreaming', share: 0.18, note: 'LED video wall, professional audio, camera recording & internet line' },
      { name: 'Branding & Delegate Kits', share: 0.10, note: 'Standees, stage backdrop, notepad, pens & branded delegate badges' },
      { name: 'Host / Facilitator', share: 0.04, note: 'Professional MC or guest coordinator' },
      { name: 'Contingency & Permits', share: 0.08, note: 'Licensing, security, generator fuel, and emergency buffer' },
    ];
  }

  const budgetAllocations = allocationsConfig.map((item) => ({
    category: item.name,
    amount: Math.round(total * item.share),
    percentage: Math.round(item.share * 100),
    note: item.note,
    suggestedVendors: `Search recommended ${item.name.toLowerCase()} vendors in ${input.location || 'your city'}`,
  }));

  const contingencyAmount = Math.round(total * 0.08);

  const timeline = [
    {
      phase: 'Initial Alignment',
      timeframe: '8–12 weeks before',
      task: 'Finalize core event brief, target guest count, and maximum budget guardrails',
      priority: 'HIGH' as const,
      suggestedLeadDays: 60,
      category: 'Planning',
    },
    {
      phase: 'Vendor Sourcing',
      timeframe: '6–8 weeks before',
      task: 'Inspect short-listed venues, request itemized catering quotes, and confirm parking/capacity',
      priority: 'HIGH' as const,
      suggestedLeadDays: 45,
      category: 'Venue & Catering',
    },
    {
      phase: 'Creative & Production',
      timeframe: '3–4 weeks before',
      task: 'Lock decor color palette, theme moodboard, run-of-show schedule, and photographer shot list',
      priority: 'MEDIUM' as const,
      suggestedLeadDays: 25,
      category: 'Decor & Media',
    },
    {
      phase: 'Invitations & RSVP',
      timeframe: '2–3 weeks before',
      task: 'Dispatch formal invitations, set up RSVP tracking, and log dietary preferences',
      priority: 'HIGH' as const,
      suggestedLeadDays: 18,
      category: 'Guests',
    },
    {
      phase: 'Final Reconfirmation',
      timeframe: '1 week before',
      task: 'Conduct 15-minute briefing calls with all booked vendors; verify delivery windows and balance payments',
      priority: 'HIGH' as const,
      suggestedLeadDays: 7,
      category: 'Logistics',
    },
    {
      phase: 'Event Eve',
      timeframe: '1 day before',
      task: 'Check venue hall staging, sound check microphones, and assemble emergency logistics kit',
      priority: 'MEDIUM' as const,
      suggestedLeadDays: 1,
      category: 'Operations',
    },
    {
      phase: 'Event Day',
      timeframe: 'Day of Event',
      task: 'Designate on-ground point of contact for vendor queries; welcome guests and enjoy the gathering',
      priority: 'URGENT' as const,
      suggestedLeadDays: 0,
      category: 'Execution',
    },
  ];

  const vendorsNeeded = [
    {
      category: 'Venue & Banquet',
      description: `Accommodates ${guests} guests with proper air-conditioning, parking, and audio/power provisions`,
      estimatedCost: Math.round(total * 0.25),
      priority: 'HIGH' as const,
      keyQuestionsToAsk: [
        'What is the cutoff hour for loud music?',
        'Is power backup (generator) included in the rental price?',
        'Are outside catering or decor teams permitted without surcharge?',
      ],
    },
    {
      category: 'Catering Team',
      description: `Full F&B service tailored to guest count (${guests}) with live food stations and dietary accommodations`,
      estimatedCost: Math.round(total * 0.32),
      priority: 'HIGH' as const,
      keyQuestionsToAsk: [
        'Is cutlery, crockery, and clean drinking water included in per-plate pricing?',
        'What is the staff-to-guest ratio on the floor?',
        'Can you provide a tasting session prior to final contract signing?',
      ],
    },
    {
      category: 'Decor & Ambience',
      description: 'Theme execution, welcoming entrance arch, photo booth, and lighting',
      estimatedCost: Math.round(total * 0.15),
      priority: 'MEDIUM' as const,
      keyQuestionsToAsk: [
        'How many hours prior to the event will setup be completed?',
        'Are fresh florals or artificial floral installations used for the backdrop?',
      ],
    },
    {
      category: 'Photography & Video',
      description: 'Capturing candid guest moments, stage interactions, and memorable portraits',
      estimatedCost: Math.round(total * 0.10),
      priority: 'MEDIUM' as const,
      keyQuestionsToAsk: [
        'How many raw and edited photographs are guaranteed?',
        'What is the turnaround time for the digital album and highlight reel?',
      ],
    },
  ];

  const creativeIdeas = [
    {
      title: 'Interactive Memory Wall',
      category: 'Guest Experience',
      description:
        'A dedicated station where guests pin handwritten polaroid photos and heartfelt one-line notes, creating a tangible keepsake for the host.',
      estimatedCostImpact: 'Low' as const,
    },
    {
      title: 'Curated Welcome Beverage Bar',
      category: 'Catering',
      description:
        'A custom mocktail / infusion bar featuring locally inspired flavors (e.g., spiced kokum fizz, roasted mango panna, or elderflower lemonade).',
      estimatedCostImpact: 'Medium' as const,
    },
    {
      title: 'Golden Hour Timeline Optimization',
      category: 'Schedule',
      description:
        'Align key group photographs and outdoor rituals 45 minutes prior to sunset for optimal natural lighting and flattering portraits.',
      estimatedCostImpact: 'Low' as const,
    },
  ];

  const risksAndMitigations = [
    {
      risk: 'Unforeseen Weather or Sudden Temperature Spikes',
      severity: 'Medium' as const,
      mitigation: 'Verify indoor backup space or waterproof canopy options with the venue coordinator in writing.',
    },
    {
      risk: 'Guest Count Exceeding Capacity Estimates',
      severity: 'High' as const,
      mitigation: 'Establish an RSVP deadline 10 days before the event; instruct caterer to keep a 10% food buffer.',
    },
    {
      risk: 'Vendor Arrival Delays and Sound Check Bottlenecks',
      severity: 'Medium' as const,
      mitigation: 'Assign a dedicated stage manager and schedule vendor arrivals at least 3 hours before guests enter.',
    },
  ];

  return {
    summary: `A carefully designed ${input.type.toLowerCase()} plan for ${guests} guests in ${input.location || 'your chosen venue'} with an allocated budget of ${input.currency} ${total.toLocaleString('en-IN')}. Focuses on seamless guest hospitality, memorable aesthetics, and financial discipline.`,
    theme: {
      name: input.theme || 'Warm Modern Elegance',
      description: 'Harmonious blend of warm ambient lighting, clean lines, and inviting textures.',
      colorPalette: ['#4f46e5', '#8b5cf6', '#ede9fe', '#f5f3ff', '#1e1b4b'],
      decorVibe: 'Contemporary, warm, and photogenic with subtle cultural accents.',
    },
    budgetAllocations,
    contingencyReserve: contingencyAmount,
    timeline,
    vendorsNeeded,
    creativeIdeas,
    risksAndMitigations,
    isFallback: true,
  };
}
