/**
 * Font-related constants
 */

import type { FontPair } from "@workspace/types/font";

/**
 * Predefined font pairings based on best practices
 */
export const FONT_PAIRINGS: FontPair[] = [
  {
    heading: {
      name: "Playfair Display",
      family: "'Playfair Display', serif",
      category: "Serif",
    },
    body: {
      name: "Source Sans Pro",
      family: "'Source Sans Pro', sans-serif",
      category: "Sans-serif",
    },
    description: "Classic serif heading with modern sans-serif body",
    css: "font-family: 'Playfair Display', serif; /* Heading */\nfont-family: 'Source Sans Pro', sans-serif; /* Body */",
  },
  {
    heading: {
      name: "Montserrat",
      family: "'Montserrat', sans-serif",
      category: "Sans-serif",
    },
    body: {
      name: "Merriweather",
      family: "'Merriweather', serif",
      category: "Serif",
    },
    description: "Modern sans-serif heading with readable serif body",
    css: "font-family: 'Montserrat', sans-serif; /* Heading */\nfont-family: 'Merriweather', serif; /* Body */",
  },
  {
    heading: {
      name: "Oswald",
      family: "'Oswald', sans-serif",
      category: "Sans-serif",
    },
    body: {
      name: "Lato",
      family: "'Lato', sans-serif",
      category: "Sans-serif",
    },
    description: "Bold sans-serif heading with clean sans-serif body",
    css: "font-family: 'Oswald', sans-serif; /* Heading */\nfont-family: 'Lato', sans-serif; /* Body */",
  },
  {
    heading: {
      name: "Raleway",
      family: "'Raleway', sans-serif",
      category: "Sans-serif",
    },
    body: {
      name: "Open Sans",
      family: "'Open Sans', sans-serif",
      category: "Sans-serif",
    },
    description: "Elegant sans-serif pairing with excellent readability",
    css: "font-family: 'Raleway', sans-serif; /* Heading */\nfont-family: 'Open Sans', sans-serif; /* Body */",
  },
  {
    heading: {
      name: "Roboto Slab",
      family: "'Roboto Slab', serif",
      category: "Serif",
    },
    body: {
      name: "Roboto",
      family: "'Roboto', sans-serif",
      category: "Sans-serif",
    },
    description: "Modern serif heading with Google's Roboto body",
    css: "font-family: 'Roboto Slab', serif; /* Heading */\nfont-family: 'Roboto', sans-serif; /* Body */",
  },
  {
    heading: {
      name: "Poppins",
      family: "'Poppins', sans-serif",
      category: "Sans-serif",
    },
    body: {
      name: "Inter",
      family: "'Inter', sans-serif",
      category: "Sans-serif",
    },
    description: "Contemporary sans-serif pairing popular in modern web design",
    css: "font-family: 'Poppins', sans-serif; /* Heading */\nfont-family: 'Inter', sans-serif; /* Body */",
  },
  {
    heading: {
      name: "Bebas Neue",
      family: "'Bebas Neue', cursive",
      category: "Display",
    },
    body: {
      name: "Roboto",
      family: "'Roboto', sans-serif",
      category: "Sans-serif",
    },
    description: "Bold display font for headings with readable body",
    css: "font-family: 'Bebas Neue', cursive; /* Heading */\nfont-family: 'Roboto', sans-serif; /* Body */",
  },
  {
    heading: {
      name: "Libre Baskerville",
      family: "'Libre Baskerville', serif",
      category: "Serif",
    },
    body: {
      name: "Lato",
      family: "'Lato', sans-serif",
      category: "Sans-serif",
    },
    description: "Traditional serif heading with modern sans-serif body",
    css: "font-family: 'Libre Baskerville', serif; /* Heading */\nfont-family: 'Lato', sans-serif; /* Body */",
  },
];

