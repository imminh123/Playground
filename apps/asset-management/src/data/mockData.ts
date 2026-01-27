import type { Tag, Asset, ExperienceInventory, Skill, Companion } from '../types';

export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Fair Program', color: 'violet' },
  { id: 'tag-2', name: 'Exhibitor', color: 'emerald' },
  { id: 'tag-3', name: 'FAQ', color: 'blue' },
  { id: 'tag-4', name: 'Boat Manual', color: 'cyan' },
  { id: 'tag-5', name: 'Event Schedule', color: 'amber' },
  { id: 'tag-6', name: 'Venue Info', color: 'rose' },
  { id: 'tag-7', name: 'Registration', color: 'pink' },
  { id: 'tag-8', name: 'Technical Specs', color: 'orange' },
];

export const mockAssets: Asset[] = [
  // Folders
  {
    id: 'folder-1',
    name: 'Saxdor Boat Manuals',
    type: 'folder',
    tags: ['tag-4', 'tag-8'],
    modifiedAt: new Date('2024-01-20T10:30:00'),
    size: 0,
    parentId: null,
  },
  {
    id: 'folder-2',
    name: 'Miami Boat Show 2024',
    type: 'folder',
    tags: ['tag-1', 'tag-5'],
    modifiedAt: new Date('2024-01-18T14:20:00'),
    size: 0,
    parentId: null,
  },
  // Documents in Saxdor folder
  {
    id: 'doc-1',
    name: 'Saxdor 320 GTO Owner Manual.pdf',
    type: 'pdf',
    tags: ['tag-4', 'tag-8'],
    modifiedAt: new Date('2024-01-19T11:45:00'),
    size: 4500000,
    parentId: 'folder-1',
  },
  {
    id: 'doc-2',
    name: 'Saxdor 270 GTO Technical Specifications.pdf',
    type: 'pdf',
    tags: ['tag-4', 'tag-8'],
    modifiedAt: new Date('2024-01-17T16:30:00'),
    size: 2800000,
    parentId: 'folder-1',
  },
  {
    id: 'doc-3',
    name: 'Saxdor Maintenance Schedule.xlsx',
    type: 'xlsx',
    tags: ['tag-4'],
    modifiedAt: new Date('2024-01-15T08:00:00'),
    size: 125000,
    parentId: 'folder-1',
  },
  // Documents in Miami Boat Show folder
  {
    id: 'doc-4',
    name: 'Exhibitor List 2024.csv',
    type: 'csv',
    tags: ['tag-2', 'tag-1'],
    modifiedAt: new Date('2024-01-22T15:00:00'),
    size: 89000,
    parentId: 'folder-2',
  },
  {
    id: 'doc-5',
    name: 'Event Schedule.pdf',
    type: 'pdf',
    tags: ['tag-5', 'tag-1'],
    modifiedAt: new Date('2024-01-21T10:00:00'),
    size: 1200000,
    parentId: 'folder-2',
  },
  {
    id: 'doc-6',
    name: 'Venue Layout Map.pdf',
    type: 'pdf',
    tags: ['tag-6', 'tag-1'],
    modifiedAt: new Date('2024-01-20T13:30:00'),
    size: 3400000,
    parentId: 'folder-2',
  },
  // Root level documents
  {
    id: 'doc-7',
    name: 'Fair Center FAQ.md',
    type: 'md',
    tags: ['tag-3', 'tag-6'],
    modifiedAt: new Date('2024-01-23T09:00:00'),
    size: 45000,
    parentId: null,
  },
  {
    id: 'doc-8',
    name: 'Exhibitor Registration Guide.pdf',
    type: 'pdf',
    tags: ['tag-2', 'tag-7'],
    modifiedAt: new Date('2024-01-22T11:00:00'),
    size: 890000,
    parentId: null,
  },
  {
    id: 'doc-9',
    name: 'Visitor Information Sheet.md',
    type: 'md',
    tags: ['tag-3', 'tag-6'],
    modifiedAt: new Date('2024-01-21T14:00:00'),
    size: 28000,
    parentId: null,
  },
  {
    id: 'doc-10',
    name: 'Booth Pricing 2024.xlsx',
    type: 'xlsx',
    tags: ['tag-2', 'tag-7'],
    modifiedAt: new Date('2024-01-19T16:00:00'),
    size: 156000,
    parentId: null,
  },
];

export const mockExperienceInventories: ExperienceInventory[] = [
  {
    id: 'inv-1',
    name: 'Fair Event Programs',
    type: 'experience-inventory',
    tags: ['tag-1', 'tag-5'],
    modifiedAt: new Date('2024-01-24T10:00:00'),
    size: 0,
    parentId: null,
    schema: [
      { id: 'col-1', name: 'Program Name', type: 'text', required: true },
      { id: 'col-2', name: 'Date', type: 'date', required: true },
      { id: 'col-3', name: 'Time', type: 'text', required: true },
      { id: 'col-4', name: 'Location', type: 'text', required: true },
      { id: 'col-5', name: 'Category', type: 'select', options: ['Seminar', 'Demo', 'Networking', 'Exhibition', 'Workshop'], required: true },
      { id: 'col-6', name: 'Capacity', type: 'number', required: false },
    ],
    entries: [
      { id: 'entry-1', 'col-1': 'Opening Ceremony', 'col-2': '2024-02-15', 'col-3': '09:00 AM', 'col-4': 'Main Hall A', 'col-5': 'Exhibition', 'col-6': 500 },
      { id: 'entry-2', 'col-1': 'Yacht Design Innovations', 'col-2': '2024-02-15', 'col-3': '11:00 AM', 'col-4': 'Conference Room 1', 'col-5': 'Seminar', 'col-6': 100 },
      { id: 'entry-3', 'col-1': 'Saxdor 320 GTO Live Demo', 'col-2': '2024-02-15', 'col-3': '02:00 PM', 'col-4': 'Marina Dock B', 'col-5': 'Demo', 'col-6': 50 },
      { id: 'entry-4', 'col-1': 'Industry Networking Mixer', 'col-2': '2024-02-15', 'col-3': '06:00 PM', 'col-4': 'Rooftop Terrace', 'col-5': 'Networking', 'col-6': 200 },
      { id: 'entry-5', 'col-1': 'Boat Maintenance Workshop', 'col-2': '2024-02-16', 'col-3': '10:00 AM', 'col-4': 'Workshop Area C', 'col-5': 'Workshop', 'col-6': 30 },
      { id: 'entry-6', 'col-1': 'Electric Propulsion Seminar', 'col-2': '2024-02-16', 'col-3': '01:00 PM', 'col-4': 'Conference Room 2', 'col-5': 'Seminar', 'col-6': 80 },
      { id: 'entry-7', 'col-1': 'VIP Exhibitor Preview', 'col-2': '2024-02-16', 'col-3': '04:00 PM', 'col-4': 'Hall B', 'col-5': 'Exhibition', 'col-6': 150 },
    ],
  },
  {
    id: 'inv-2',
    name: 'Exhibitor Directory',
    type: 'experience-inventory',
    tags: ['tag-2'],
    modifiedAt: new Date('2024-01-25T14:30:00'),
    size: 0,
    parentId: null,
    schema: [
      { id: 'col-1', name: 'Company Name', type: 'text', required: true },
      { id: 'col-2', name: 'Contact Email', type: 'email', required: true },
      { id: 'col-3', name: 'Booth Number', type: 'text', required: true },
      { id: 'col-4', name: 'Category', type: 'select', options: ['Boats', 'Engines', 'Accessories', 'Services', 'Electronics'], required: true },
      { id: 'col-5', name: 'Booth Size', type: 'select', options: ['Small', 'Medium', 'Large', 'Premium'], required: true },
    ],
    entries: [
      { id: 'entry-1', 'col-1': 'Saxdor Yachts', 'col-2': 'info@saxdor.com', 'col-3': 'A-101', 'col-4': 'Boats', 'col-5': 'Premium' },
      { id: 'entry-2', 'col-1': 'Mercury Marine', 'col-2': 'contact@mercurymarine.com', 'col-3': 'B-205', 'col-4': 'Engines', 'col-5': 'Large' },
      { id: 'entry-3', 'col-1': 'Garmin Marine', 'col-2': 'marine@garmin.com', 'col-3': 'C-112', 'col-4': 'Electronics', 'col-5': 'Medium' },
      { id: 'entry-4', 'col-1': 'West Marine', 'col-2': 'sales@westmarine.com', 'col-3': 'D-308', 'col-4': 'Accessories', 'col-5': 'Large' },
      { id: 'entry-5', 'col-1': 'BoatUS', 'col-2': 'info@boatus.com', 'col-3': 'E-401', 'col-4': 'Services', 'col-5': 'Medium' },
    ],
  },
];

export const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'Document Search',
    description: 'Search and retrieve information from tagged documents using RAG',
    type: 'knowledge-retrieval',
    enabled: true,
    config: {
      tagIds: ['tag-3', 'tag-4'],
    },
  },
  {
    id: 'skill-2',
    name: 'Event Planner',
    description: 'Plan and organize events based on fair program data',
    type: 'planning',
    enabled: true,
    config: {
      experienceInventoryId: 'inv-1',
    },
  },
];

export const mockCompanions: Companion[] = [
  {
    id: 'companion-1',
    name: 'Fair Assistant',
    description: 'Your guide to navigating fair events and exhibitor information',
    avatar: 'FA',
    systemPrompt: 'You are a helpful assistant for fair events. Help users find information about exhibitors, schedules, and venue details.',
    skillIds: ['skill-1', 'skill-2'],
  },
  {
    id: 'companion-2',
    name: 'Boat Expert',
    description: 'Technical support for Saxdor boats and marine equipment',
    avatar: 'BE',
    systemPrompt: 'You are a marine technical expert specializing in Saxdor boats. Help users with maintenance, specifications, and troubleshooting.',
    skillIds: ['skill-1'],
  },
  {
    id: 'companion-3',
    name: 'Exhibitor Support',
    description: 'Help exhibitors with registration and booth information',
    avatar: 'ES',
    systemPrompt: 'You are an exhibitor support assistant. Help exhibitors with registration, booth setup, and event logistics.',
    skillIds: ['skill-1'],
  },
];
