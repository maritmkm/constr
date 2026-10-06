import { Project } from '../types/project';

export const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    slug: 'desert-dune-residence',
    number: '01',
    title: 'Dune Sanctuary Residence',
    subtitle: 'Curved concrete villa sculpted into the desert topography',
    category: 'RESIDENTIAL',
    categoryLabel: 'Residential',
    location: 'Chennai, India',
    year: 2026,
    status: 'Completed',
    area: '6,800 sq.ft',
    scope: 'Full Architecture + Turnkey Construction',
    client: 'Private Owner',
    leadArchitect: 'ARCS Studio',
    coverImage: '/images/hero_architecture.jpg',
    gallery: [
      '/images/hero_architecture.jpg',
      '/images/project_dune_residence.jpg',
      '/images/project_coastal_sanctuary.jpg',
    ],
    description:
      'A subterranean luxury villa featuring sweeping plaster arches, subterranean warm LED lighting, and an ambient pool seamlessly integrated into natural rock formations.',
    story: {
      concept:
        'The vision was born from a desire to harmonize brutalist raw concrete forms with fluid organic curves. Rather than imposing structure on the land, Dune Sanctuary flows with the surrounding landscape.',
      architecture:
        'Monolithic barrel vaults engineered with custom cast-in-place concrete forms create dramatic sightlines toward the horizon while naturally cooling the living spaces.',
      materials:
        'Custom warm terracotta plastering, hand-poured micro-cement floors, oxidized bronze framing, and warm subterranean LED cove strip lighting.',
      execution:
        'Executed in 18 months using precision subterranean excavation, thermal insulation barrier systems, and bespoke architectural glazing.',
    },
    journey: [
      {
        stage: '01',
        title: 'Topographic Survey & Concept',
        detail: '3D Laser scanning of site contours to optimize thermal mass and natural airflow vectors.',
        image: '/images/hero_architecture.jpg',
      },
      {
        stage: '02',
        title: 'Subterranean Foundation',
        detail: 'Reinforced concrete piling and moisture-sealed waterproofing membrane beneath bedrock.',
        image: '/images/project_dune_residence.jpg',
      },
      {
        stage: '03',
        title: 'Curved Shell Construction',
        detail: 'Bespoke timber formwork created for the signature double-curved plaster arches.',
        image: '/images/project_coastal_sanctuary.jpg',
      },
      {
        stage: '04',
        title: 'Interior Handcrafting & Completion',
        detail: 'Seamless plastering, hand-finished brass detailing, and custom LED cove illumination.',
        image: '/images/hero_architecture.jpg',
      },
    ],
  },
  {
    id: '2',
    slug: 'coastal-cliffside-sanctuary',
    number: '02',
    title: 'Horizon Cliffside Sanctuary',
    subtitle: 'Cantilevered oceanfront villa with panoramic infinity waterscape',
    category: 'RESIDENTIAL',
    categoryLabel: 'Residential',
    location: 'Mahabalipuram, India',
    year: 2025,
    status: 'Completed',
    area: '8,200 sq.ft',
    scope: 'Architecture, Structural Engineering & Construction',
    client: 'Heritage Estate Group',
    leadArchitect: 'ARCS Studio',
    coverImage: '/images/project_coastal_sanctuary.jpg',
    gallery: [
      '/images/project_coastal_sanctuary.jpg',
      '/images/hero_architecture.jpg',
      '/images/project_interior_penthouse.jpg',
    ],
    description:
      'Perched atop a coastal cliff, this architectural residence features curved board-formed concrete slabs and a perimeter infinity pool overlooking the ocean.',
    story: {
      concept:
        'Designed to offer an uninterrupted dialogue between indoor spaces and the vast horizon. Every room framed by floor-to-ceiling glass paneling.',
      architecture:
        'Post-tensioned cantilevered slabs create lightweight open spans while maintaining hurricane-grade structural integrity against marine conditions.',
      materials:
        'Off-shutter architectural concrete, marine-grade teak decking, bronze anodized mullions, and custom terrazzo pool lining.',
      execution:
        'Constructed over high-salinity coastal terrain using deep anchor pilings and marine-resistant concrete mixes.',
    },
    journey: [
      {
        stage: '01',
        title: 'Site Engineering',
        detail: 'Deep rock anchors drilled 14 meters into coastal granite base.',
        image: '/images/project_coastal_sanctuary.jpg',
      },
      {
        stage: '02',
        title: 'Cantilever Frame',
        detail: 'Post-tensioned concrete slabs poured with zero deflection tolerances.',
        image: '/images/project_dune_residence.jpg',
      },
      {
        stage: '03',
        title: 'Glazing & Handshake',
        detail: 'Low-iron double-glazed acoustic glass facade installation.',
        image: '/images/project_coastal_sanctuary.jpg',
      },
    ],
  },
  {
    id: '3',
    slug: 'aethelred-commercial-headquarters',
    number: '03',
    title: 'Aethelred Corporate Headquarters',
    subtitle: 'Monolithic concrete corporate campus with solar-shading bronze louvers',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial',
    location: 'Bengaluru, India',
    year: 2026,
    status: 'Completed',
    area: '45,000 sq.ft',
    scope: 'Full Project Management & Turnkey Execution',
    client: 'Aethelred Tech Enterprise',
    leadArchitect: 'ARCS Studio',
    coverImage: '/images/project_commercial_hq.jpg',
    gallery: [
      '/images/project_commercial_hq.jpg',
      '/images/hero_architecture.jpg',
      '/images/project_dune_residence.jpg',
    ],
    description:
      'A landmark commercial campus featuring board-formed concrete massing, motorized solar bronze louvers, and a surrounding 300-meter reflecting basin.',
    story: {
      concept:
        'Reimagining corporate environments as tranquil, light-filled sanctuaries that boost creative productivity while reducing thermal solar heat gain by 40%.',
      architecture:
        'Interlocking cubic massing around a central landscaped atrium, allowing natural daylight penetration to all office workstations.',
      materials:
        'Board-formed architectural concrete, motorized bronze louvers, energy-efficient triple glazing, and natural slate paving.',
      execution:
        'Delivered on budget and 2 months ahead of schedule with zero-lost time safety incidents.',
    },
    journey: [
      {
        stage: '01',
        title: 'Master Planning',
        detail: 'Solar orientation modeling and rainwater recycling design.',
        image: '/images/project_commercial_hq.jpg',
      },
      {
        stage: '02',
        title: 'Structural Erection',
        detail: 'Pre-stressed concrete columns and vast open floor plates.',
        image: '/images/project_commercial_hq.jpg',
      },
    ],
  },
  {
    id: '4',
    slug: 'minimalist-travertine-penthouse',
    number: '04',
    title: 'Skyline Travertine Suite',
    subtitle: 'Luxury penthouse interior crafted with curved travertine and velvet oak',
    category: 'INTERIOR',
    categoryLabel: 'Interior Design',
    location: 'Chennai, India',
    year: 2025,
    status: 'Completed',
    area: '4,200 sq.ft',
    scope: 'Interior Architecture & High-End Fitout',
    client: 'Private Executive',
    leadArchitect: 'ARCS Studio',
    coverImage: '/images/project_interior_penthouse.jpg',
    gallery: [
      '/images/project_interior_penthouse.jpg',
      '/images/project_dune_residence.jpg',
      '/images/hero_architecture.jpg',
    ],
    description:
      'A serene penthouse interior featuring a continuous curved travertine fireplace wall, custom boucle furniture, and automated ambient warm lighting.',
    story: {
      concept:
        'To create an urban sanctuary above the bustling city skyline where tactile stone textures evoke warmth and quiet luxury.',
      architecture:
        'Open-plan fluid living zones delineated by subtle ceiling reveals and continuous stone joinery.',
      materials:
        'Navona Roman Travertine stone, wire-brushed European white oak, warm brass accents, and textured linen wall coverings.',
      execution:
        'Precision stone carving with 1mm tolerance joints and custom concealed HVAC linear slot diffusers.',
    },
    journey: [
      {
        stage: '01',
        title: 'Design & Slab Selection',
        detail: 'Hand-selecting travertine stone blocks directly from Italian quarries.',
        image: '/images/project_interior_penthouse.jpg',
      },
      {
        stage: '02',
        title: 'Custom Fitout',
        detail: 'Millwork and concealed smart home automation integration.',
        image: '/images/project_interior_penthouse.jpg',
      },
    ],
  },
];
