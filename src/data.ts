import { Project, Service, ProcessStep, Stat, SoftwareItem } from "./types";

export const projects: Project[] = [
  {
    id: "aureo-studio",
    title: "Aureo Studio",
    client: "Architecture Studio",
    year: "2024",
    category: "Branding & Web Design",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5ejyOewyOe4JNOu1b9uD4cZC5PcPqqtUMHCbqX3HwaAl2Vm4xPSnAQfct7QCxc50x1N5dVdImQRQRcwIcMaTnMMax6hmqA-7Foxf-zMRsYPtSP4ej9HaRSMDB8VR03Cg8u3a01lj2iGGM_Oo4y4xckeIrZxbBeqNv1zS1Q1nHevx_DEk7iYrTe-ERAcgJ2jchKwFCmW4Dq53nasr04XSEkw-l38pB9BoHmpSksqRie5nYKcq_znwFOBOLA0tjiDaivjb_owjygA",
    description: "High-contrast geometric brand identity and responsive web design built for an elite brutalist architecture studio.",
    tags: ["BRANDING", "WEB DESIGN", "ART DIRECTION"],
    duration: "3 months",
    challenge: "Aureo Studio needed a brand presence that reflected their uncompromising architectural philosophy—raw materials, absolute geometric precision, and functional honesty. Their previous identity felt overly corporate and soft, failing to attract high-end developers and institutions.",
    solution: "We designed a custom modular wordmark based on a strict spatial grid. For the digital portfolio, we crafted an immersive high-contrast dark experience utilizing fullscreen images, brutalist typography layouts, and motion-synchronized transitions that echo the experience of walking through physical concrete spaces.",
    outcome: "An award-winning identity that positioned Aureo Studio as a leading architectural visionary. The web launch saw a 140% increase in inquiries from premium developers and won several prestigious design awards for layout and typography.",
    testimonial: {
      quote: "Samuel captured the weight, texture, and silence of our architectural work and translated it perfectly into a digital language. The client inquiries we receive now are on an entirely different level.",
      author: "Elena Rostova",
      role: "Principal Architect, Aureo Studio"
    }
  },
  {
    id: "vanta-skin",
    title: "Vanta Skin",
    client: "Premium Skincare",
    year: "2024",
    category: "Logo Design & Packaging",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUlX8xWREO-wMCVu5W-cJZAeJsU6Uoohjjv_RviLkpLmCgHGHhq0Vv0ca8RqrES0lga9RT4UbBYHo67egMvgmWjgHCXw1-6DDi6NDCFTH_hN_Jk-GT__1ZJG1DS5EseEFoE0buawpVqqinCiBJWlc5UmK1WzsFNbMoX8lrQeUFiiyinOf_4ntu7pu32xl1rAp37yXOJc0eoLKS5LM9KvwJVQHszXTgI8TWptE3rvGo3OQtAT0grb3n-Pk2w5RgGaNyTcXOg95X0Q",
    description: "Premium packaging suite and dark-themed visual identity for an obsidian-infused luxury skincare brand.",
    tags: ["LOGO DESIGN", "PACKAGING", "VISUAL ID"],
    duration: "4 months",
    challenge: "Entering a highly saturated luxury skincare market, Vanta Skin needed to stand out instantly on premium retail shelves. Their products feature rare activated obsidian minerals, requiring a packaging story that felt mysterious, scientific, and incredibly high-end.",
    solution: "We engineered custom matte-black containers with high-contrast gloss-varnish typography and a pure gold serif monogram. The digital launch campaign combined hyper-realistic macro product photography with liquid simulation video reels highlighting the texture and mineral purity of the formula.",
    outcome: "Vanta Skin secured exclusive distribution deals with top-tier retailers in New York and Paris within three months of the design launch, exceeding initial retail targets by 210%.",
    testimonial: {
      quote: "The branding Samuel created is more than just packaging—it is a physical experience of luxury. Our customers often post unboxing videos purely because of how stunning the design looks.",
      author: "Marcus Vance",
      role: "Founder, Vanta Skin"
    }
  },
  {
    id: "wildhorn",
    title: "Wildhorn",
    client: "Outdoor Apparel",
    year: "2024",
    category: "Graphic Design & Photography",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_1Jp4IN5CvlvFiEqkHOFSu2u7Jh9pEKrTKIRtczpefS3h98p5jBCGAY2E5goKiauDEp8fgJNBdP_iXGVOLSeMv5GPhAcOe6gcoEsk2cx2h2JiakerqqubnMumBz-iSXVVWLIzvI5MssqQ4hXBKHa5DI9ekTc-n7xA7cj3S1aL3xEhwUHhjfFnMpEvf111o3QEw7_i6QsB3Hz7gW1G8Nul929nsKr8GIP-JeLP6Mk12P3jrsgbL2rSQ-PvdHNm4LWQ1ftrQiBkRA",
    description: "Monochrome campaign design and adventurous outdoor art direction for a premium alpine technical apparel line.",
    tags: ["GRAPHIC DESIGN", "PHOTOGRAPHY", "CAMPAIGN"],
    duration: "2 months",
    challenge: "Wildhorn was launching their extreme alpine technical gear. They wanted a campaign that eschewed traditional bright outdoor sports aesthetics in favor of a timeless, raw, mountain-shrouded editorial narrative that appealed to modern urban explorers.",
    solution: "We designed a high-contrast monochrome print campaign paired with dramatic, low-angle aerial mountain photography. The layout paired technical specifications in microscopic monospaced typeface with massive, tracking-expanded displays of rugged peaks.",
    outcome: "The campaign drove a record-breaking winter pre-order cycle, completely selling out the technical outerwear collection in less than 3 weeks and establishing a highly distinct visual trademark for the brand.",
    testimonial: {
      quote: "Samuel brought a cinematic gravity to our campaign. He didn't just take photos; he captured the rugged soul of alpine exploration in high contrast.",
      author: "Clara Theron",
      role: "Creative Director, Wildhorn Co."
    }
  },
  {
    id: "nexus-finance",
    title: "Nexus Finance",
    client: "Fintech Platform",
    year: "2023",
    category: "UI/UX Design & Motion Graphics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdZ6uQszJ6CikccCa9ms7Pjxrfw4p93vvVQjgbpHOlZiYP3YhP7Yx0c-bQtRGA_nn9tEupwN2229NwxFPzeLR9koEk8GCvLkXX9I_3WMZBkWCaQV2hXdJFDDh8ZxC0fwTeC7HQc9nuKX3QyrhmUMpFcu7ckh_Z5BygA2QpqbwbdqGhhw1xHejQw5B8FXObGv8EgqQR8xPig3kPk5vA_4RkqSZCitNee_SzAD-J75_KaWP1HAxPfGC5jeDH2-LNVAu0Df_ahsHBuA",
    description: "Sleek, dark-mode financial analytics interface design and kinetic platform walkthrough animations.",
    tags: ["UI/UX DESIGN", "MOTION GRAPHICS", "ANALYTICS"],
    duration: "5 months",
    challenge: "Nexus Finance features highly complex real-time algorithmic market analytics. Users were overwhelmed by massive dashboards of raw data, resulting in low session times and an elevated churn rate on trial signups.",
    solution: "We completely redesigned the application around a minimalist, structured dashboard layout, utilizing custom dark-mode typography and adaptive neon metrics highlights. We added kinetic entry animations and interactive tooltips to ease users into the platform workflow seamlessly.",
    outcome: "User retention increased by 65% in the first month following the redesign. Walkthrough completion rates spiked by 90% as the platform began to feel less like a complex terminal and more like an elegant instrument.",
    testimonial: {
      quote: "The interface Samuel designed is incredibly fast and readable. He solved the hardest problem in fintech: making dense data look absolutely beautiful.",
      author: "David Chen",
      role: "VP of Product, Nexus Fintech"
    }
  }
];

export const services: Service[] = [
  {
    id: "graphic-design",
    title: "Graphic Design",
    description: "High-impact visual communication and brand assets designed for absolute clarity, structure, and resonance.",
    iconName: "PenTool"
  },
  {
    id: "brand-identity",
    title: "Brand Identity",
    description: "Comprehensive visual systems, typography rules, and grid-based guidelines that translate core values into a cohesive narrative.",
    iconName: "Globe"
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description: "Rhythmic storytelling through precise cuts, professional pacing, sound design, and compelling narrative-driven masterpieces.",
    iconName: "Video"
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    description: "Bringing static brands to life with fluid animations, sophisticated physics, and sleek kinetic typography.",
    iconName: "Zap"
  },
  {
    id: "editorial-design",
    title: "Editorial Design",
    description: "Premium publication layouts, digital journals, and book architectures that leverage generous whitespace and typography.",
    iconName: "BookOpen"
  }
];

export const capabilitiesExtended: Service[] = [
  {
    id: "logo-design",
    title: "Logo Design",
    description: "The absolute cornerstone of your visual identity. We craft minimalist, enduring marks that communicate core values instantly and leave a lasting impression.",
    iconName: "Fingerprint"
  },
  {
    id: "brand-identity",
    title: "Brand Identity",
    description: "A holistic visual language. We define meticulous color palettes, typography systems, and responsive grid rules for absolute brand consistency across physical and digital mediums.",
    iconName: "Maximize2"
  },
  {
    id: "social-media",
    title: "Social Media",
    description: "Curated digital presence. High-impact post layouts, visual grids, and custom motion templates optimized for modern platforms to engage, inspire, and expand your audience.",
    iconName: "Layout"
  },
  {
    id: "poster-design",
    title: "Poster Design",
    description: "Architectural layout meets informational hierarchy. We create striking physical and digital prints that demand attention through bold typography and deliberate negative space.",
    iconName: "Square"
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    description: "Bringing static elements to life. Fluid logo intros, transition states, and kinetic typography that add a dimension of premium sophistication to your digital products.",
    iconName: "Activity"
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description: "Rhythmic editorial design for screen. We transform raw footage into compelling narrative-driven masterpieces with polished sound designs and structural cuts.",
    iconName: "Film"
  },
  {
    id: "promotional",
    title: "Promotional",
    description: "High-conversion visual content. Dynamic product showcases, trailer structures, or digital event reels designed specifically to capture interest and drive measurable conversion.",
    iconName: "Megaphone"
  },
  {
    id: "color-grading",
    title: "Color Grading",
    description: "The soul of cinema. We apply precise tonal adjustments, specialized color-correction look-up-tables, and contrast balancing to create depth and professional-grade visual consistency.",
    iconName: "Palette"
  }
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    description: "We start with an intensive, structured conversation to understand your business objectives, target audience demographics, and core creative challenges."
  },
  {
    step: "02",
    title: "Strategize",
    description: "I perform rigorous industry research, structure a tailored visual direction, and align a roadmap aligned with your brand positioning goals."
  },
  {
    step: "03",
    title: "Design",
    description: "I design with absolute intention and geometric rigor, crafting and refining multiple options down to a singular, cohesive masterpiece."
  },
  {
    step: "04",
    title: "Develop",
    description: "I build, optimize, and thoroughly test assets across physical and digital formats to ensure optimal performance, scaling, and clarity."
  },
  {
    step: "05",
    title: "Launch",
    description: "We deploy your project to the world. I continue to provide close support to monitor engagement, guide asset usage, and help your brand evolve."
  }
];

export const stats: Stat[] = [
  { value: "12+", label: "YEARS OF EXPERIENCE" },
  { value: "240", label: "PROJECTS COMPLETED" },
  { value: "185", label: "HAPPY CLIENTS" },
  { value: "12", label: "DESIGN AWARDS" }
];

export const softwareEcosystem: SoftwareItem[] = [
  { name: "FIGMA", iconName: "Grid" },
  { name: "PHOTOSHOP", iconName: "Image" },
  { name: "ILLUSTRATOR", iconName: "Sparkles" },
  { name: "PREMIERE PRO", iconName: "Video" },
  { name: "AFTER EFFECTS", iconName: "Play" },
  { name: "DAVINCI RESOLVE", iconName: "Sliders" }
];
