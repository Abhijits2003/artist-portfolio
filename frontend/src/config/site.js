// ============================================================
//  EDIT THIS FILE to make the website yours.
//  Everything below is placeholder content.
// ============================================================

export const SITE = {
  artistName: 'Artist Name', // shown in the navbar and footer
  email: 'YOUR_EMAIL_ADDRESS', // hidden on the contact page until you replace it
  tagline: 'Exploring nature, imagination and emotion through hand-drawn art.',
};

// Replace each url with your real profile link. Remove an entry to hide it everywhere.
export const SOCIALS = [
  { key: 'instagram', label: 'Instagram', url: 'YOUR_INSTAGRAM_URL' },
  { key: 'facebook', label: 'Facebook', url: 'YOUR_FACEBOOK_URL' },
  { key: 'pinterest', label: 'Pinterest', url: 'YOUR_PINTEREST_URL' },
  { key: 'youtube', label: 'YouTube', url: 'YOUR_YOUTUBE_URL' },
  { key: 'x', label: 'X', url: 'YOUR_X_URL' },
  { key: 'linkedin', label: 'LinkedIn', url: 'YOUR_LINKEDIN_URL' },
];

export const CATEGORIES = ['All', 'Nature', 'Sketch', 'Traditional', 'Painting', 'Illustration', 'Other'];

export const SERVICES = [
  { key: 'nature', icon: 'leaf', title: 'Custom Nature Art', type: 'Custom Nature Art', description: 'Forests, flowers, water and light, drawn around a place or feeling that matters to you.' },
  { key: 'landscape', icon: 'map', title: 'Custom Landscape', type: 'Custom Landscape', description: 'A landscape of a real location or an imagined one, in the atmosphere you describe.' },
  { key: 'portrait', icon: 'user', title: 'Portrait Drawing', type: 'Portrait Drawing', description: 'A portrait of a person you love, drawn from your reference and your description.' },
  { key: 'illustration', icon: 'pen', title: 'Custom Illustration', type: 'Custom Illustration', description: 'A one-of-a-kind illustration for a gift, a story, a space or a project.' },
  { key: 'special', icon: 'star', title: 'Special Request', type: 'Special Request', description: 'Something that does not fit the other options? Describe it and we will work it out.' },
];
// Starting prices are placeholders. Replace with your real prices.
export const STARTING_PRICE = 'Starting from ₹XXXX';

export const ARTWORK_TYPES = SERVICES.map((s) => s.type);
export const STYLES = ['Digital', 'Pencil / Graphite', 'Ink', 'Watercolour', 'Acrylic / Oil', 'Not sure yet'];

// About page content: replace all of it with your own words.
export const ABOUT = {
  artist: 'Write a few sentences introducing yourself and your art here.',
  journey: [
    { title: 'Beginning', text: 'Describe how you started making art.' },
    { title: 'Exploration', text: 'Describe the subjects and materials you explored.' },
    { title: 'Learning', text: 'Describe what you studied or taught yourself.' },
    { title: 'Finding My Style', text: 'Describe how your style took shape.' },
    { title: 'Creating', text: 'Describe how you work today.' },
    { title: 'Sharing', text: 'Describe what sharing your art means to you.' },
  ],
  style: 'Describe your artistic style: the lines, colours, moods and subjects people can expect.',
  inspiration: 'Describe what inspires your work.',
  mediums: 'List the mediums and techniques you use.',
  message: 'Write a personal message to the people who visit your site.',
};

export const HOME_ARTIST_NOTE =
  'Every artwork begins with a feeling, an observation or a small idea. I use art to turn those moments into something others can experience.';
