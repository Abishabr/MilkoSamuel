import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "portfolio-db.json");

// Helper simple hash function for admin password
export function hashPassword(password: string): string {
  // Simple deterministic non-secure hash for standard deployment demo
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Initial seed structures
const DEFAULT_SEED = {
  users: [
    {
      id: "1",
      email: "milkosamuel470@gmail.com",
      password: hashPassword("admin"),
      name: "Samuel Milko"
    }
  ],
  settings: {
    websiteTitle: "Samuel Milko | Portfolio",
    logo: "SAMUEL MILKO",
    favicon: "",
    themeColor: "#000000",
    footerText: "© 2026 Samuel Milko. All Rights Reserved.",
    biography: "I am Samuel Milko, a multidisciplinary graphic designer and digital visual director based in Addis Ababa, Ethiopia, specializing in high-fidelity experiences that bridge raw human intuition and mathematical precision.",
    heroText: "I create eye-catching designs and engaging videos that combine creativity and strategy to help brands stand out and connect with their audience.",
    profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDZ38TfxyqRb4zhdOToTHQ8R81gjtmltwGmQbLvq4Loe94oaP6YHB47rpSpGcUYbU2xsjiiFUrx8aQXIwMjVffL-I9LHa3gH65XaibsGFtPLN7VQ9uLT3Hz6I2KZFlPcLQT3e1r9GtdfRGhhZTvDc5JztDyGFnMmwSRlRUK1YvZ0Q-KNysyxRXKyNuOvRY6SMgMpnTfgNdDLJTvrdM-Rke6tY_IFPCSdU-MkRevFjXV4z0ko1yPzv7hCFWOY3mytZ19L01t3ZEujHy",
    resumeUrl: "",
    yearsExperience: "12+",
    projectsCompleted: "240",
    happyClients: "185"
  },
  categories: [
    { id: "branding", name: "Branding & Web Design", slug: "branding" },
    { id: "packaging", name: "Logo Design & Packaging", slug: "packaging" },
    { id: "video", name: "Video & Motion Graphics", slug: "video-motion" }
  ],
  projects: [
    {
      id: "aureo-studio",
      title: "Aureo Studio",
      slug: "aureo-studio",
      client: "Architecture Studio",
      projectDate: "2024",
      description: "High-contrast geometric brand identity and responsive web design built for an elite brutalist architecture studio.",
      technologies: ["BRANDING", "WEB DESIGN", "ART DIRECTION"],
      coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5ejyOewyOe4JNOu1b9uD4cZC5PcPqqtUMHCbqX3HwaAl2Vm4xPSnAQfct7QCxc50x1N5dVdImQRQRcwIcMaTnMMax6hmqA-7Foxf-zMRsYPtSP4ej9HaRSMDB8VR03Cg8u3a01lj2iGGM_Oo4y4xckeIrZxbBeqNv1zS1Q1nHevx_DEk7iYrTe-ERAcgJ2jchKwFCmW4Dq53nasr04XSEkw-l38pB9BoHmpSksqRie5nYKcq_znwFOBOLA0tjiDaivjb_owjygA",
      bannerImage: "",
      videoUrl: "",
      creativeProcess: "We designed a custom modular wordmark based on a strict spatial grid. For the digital portfolio, we crafted an immersive high-contrast dark experience utilizing fullscreen images, brutalist typography layouts, and motion-synchronized transitions that echo the experience of walking through physical concrete spaces.",
      challenges: "Aureo Studio needed a brand presence that reflected their uncompromising architectural philosophy—raw materials, absolute geometric precision, and functional honesty. Their previous identity felt overly corporate and soft, failing to attract high-end developers and institutions.",
      finalResult: "An award-winning identity that positioned Aureo Studio as a leading architectural visionary. The web launch saw a 140% increase in inquiries from premium developers and won several prestigious design awards for layout and typography.",
      isFeatured: true,
      featuredOrder: 1,
      categoryId: "branding"
    },
    {
      id: "vanta-skin",
      title: "Vanta Skin",
      slug: "vanta-skin",
      client: "Premium Skincare",
      projectDate: "2024",
      description: "Premium packaging suite and dark-themed visual identity for an obsidian-infused luxury skincare brand.",
      technologies: ["LOGO DESIGN", "PACKAGING", "VISUAL ID"],
      coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUlX8xWREO-wMCVu5W-cJZAeJsU6Uoohjjv_RviLkpLmCgHGHhq0Vv0ca8RqrES0lga9RT4UbBYHo67egMvgmWjgHCXw1-6DDi6NDCFTH_hN_Jk-GT__1ZJG1DS5EseEFoE0buawpVqqinCiBJWlc5UmK1WzsFNbMoX8lrQeUFiiyinOf_4ntu7pu32xl1rAp37yXOJc0eoLKS5LM9KvwJVQHszXTgI8TWptE3rvGo3OQtAT0grb3n-Pk2w5RgGaNyTcXOg95X0Q",
      bannerImage: "",
      videoUrl: "",
      creativeProcess: "We engineered custom matte-black containers with high-contrast gloss-varnish typography and a pure gold serif monogram. The digital launch campaign combined hyper-realistic macro product photography with liquid simulation video reels highlighting the texture and mineral purity of the formula.",
      challenges: "Entering a highly saturated luxury skincare market, Vanta Skin needed to stand out instantly on premium retail shelves. Their products feature rare activated obsidian minerals, requiring a packaging story that felt mysterious, scientific, and incredibly high-end.",
      finalResult: "Vanta Skin secured exclusive distribution deals with top-tier retailers in New York and Paris within three months of the design launch, exceeding initial retail targets by 210%.",
      isFeatured: true,
      featuredOrder: 2,
      categoryId: "packaging"
    },
    {
      id: "wildhorn",
      title: "Wildhorn",
      slug: "wildhorn",
      client: "Outdoor Apparel",
      projectDate: "2024",
      description: "Monochrome campaign design and adventurous outdoor art direction for a premium alpine technical apparel line.",
      technologies: ["GRAPHIC DESIGN", "PHOTOGRAPHY", "CAMPAIGN"],
      coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_1Jp4IN5CvlvFiEqkHOFSu2u7Jh9pEKrTKIRtczpefS3h98p5jBCGAY2E5goKiauDEp8fgJNBdP_iXGVOLSeMv5GPhAcOe6gcoEsk2cx2h2JiakerqqubnMumBz-iSXVVWLIzvI5MssqQ4hXBKHa5DI9ekTc-n7xA7cj3S1aL3xEhwUHhjfFnMpEvf111o3QEw7_i6QsB3Hz7gW1G8Nul929nsKr8GIP-JeLP6Mk12P3jrsgbL2rSQ-PvdHNm4LWQ1ftrQiBkRA",
      bannerImage: "",
      videoUrl: "",
      creativeProcess: "We designed a high-contrast monochrome print campaign paired with dramatic, low-angle aerial mountain photography. The layout paired technical specifications in microscopic monospaced typeface with massive, tracking-expanded displays of rugged peaks.",
      challenges: "Wildhorn was launching their extreme alpine technical gear. They wanted a campaign that eschewed traditional bright outdoor sports aesthetics in favor of a timeless, raw, mountain-shrouded editorial narrative that appealed to modern urban explorers.",
      finalResult: "The campaign drove a record-breaking winter pre-order cycle, completely selling out the technical outerwear collection in less than 3 weeks and establishing a highly distinct visual trademark for the brand.",
      isFeatured: true,
      featuredOrder: 3,
      categoryId: "branding"
    },
    {
      id: "nexus-finance",
      title: "Nexus Finance",
      slug: "nexus-finance",
      client: "Fintech Platform",
      projectDate: "2023",
      description: "Sleek, dark-mode financial analytics interface design and kinetic platform walkthrough animations.",
      technologies: ["UI/UX DESIGN", "MOTION GRAPHICS", "ANALYTICS"],
      coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdZ6uQszJ6CikccCa9ms7Pjxrfw4p93vvVQjgbpHOlZiYP3YhP7Yx0c-bQtRGA_nn9tEupwN2229NwxFPzeLR9koEk8GCvLkXX9I_3WMZBkWCaQV2hXdJFDDh8ZxC0fwTeC7HQc9nuKX3QyrhmUMpFcu7ckh_Z5BygA2QpqbwbdqGhhw1xHejQw5B8FXObGv8EgqQR8xPig3kPk5vA_4RkqSZCitNee_SzAD-J75_KaWP1HAxPfGC5jeDH2-LNVAu0Df_ahsHBuA",
      bannerImage: "",
      videoUrl: "",
      creativeProcess: "We completely redesigned the application around a minimalist, structured dashboard layout, utilizing custom dark-mode typography and adaptive neon metrics highlights. We added kinetic entry animations and interactive tooltips to ease users into the platform workflow seamlessly.",
      challenges: "Nexus Finance features highly complex real-time algorithmic market analytics. Users were overwhelmed by massive dashboards of raw data, resulting in low session times and an elevated churn rate on trial signups.",
      finalResult: "User retention increased by 65% in the first month following the redesign. Walkthrough completion rates spiked by 90% as the platform began to feel less like a complex terminal and more like an elegant instrument.",
      isFeatured: true,
      featuredOrder: 4,
      categoryId: "video"
    }
  ],
  project_images: [],
  services: [
    {
      id: "graphic-design",
      name: "Graphic Design",
      description: "High-impact visual communication and brand assets designed for absolute clarity, structure, and resonance.",
      icon: "PenTool",
      order: 1
    },
    {
      id: "brand-identity",
      name: "Brand Identity",
      description: "Comprehensive visual systems, typography rules, and grid-based guidelines that translate core values into a cohesive narrative.",
      icon: "Globe",
      order: 2
    },
    {
      id: "video-editing",
      name: "Video Editing",
      description: "Rhythmic storytelling through precise cuts, professional pacing, sound design, and compelling narrative-driven masterpieces.",
      icon: "Video",
      order: 3
    },
    {
      id: "motion-graphics",
      name: "Motion Graphics",
      description: "Bringing static brands to life with fluid animations, sophisticated physics, and sleek kinetic typography.",
      icon: "Zap",
      order: 4
    },
    {
      id: "editorial-design",
      name: "Editorial Design",
      description: "Premium publication layouts, digital journals, and book architectures that leverage generous whitespace and typography.",
      icon: "BookOpen",
      order: 5
    }
  ],
  skills: [
    { id: "1", name: "Graphic Design", percentage: 98, icon: "Paintbrush", order: 1 },
    { id: "2", name: "Video Editing", percentage: 96, icon: "Video", order: 2 },
    { id: "3", name: "Brand Identity Design", percentage: 94, icon: "Award", order: 3 },
    { id: "4", name: "Motion Graphics", percentage: 92, icon: "Zap", order: 4 },
    { id: "5", name: "Adobe Creative Suite", percentage: 97, icon: "Cpu", order: 5 }
  ],
  experiences: [
    {
      id: "exp-1",
      company: "Aura Creative Studio",
      position: "Lead Digital Visual Director",
      description: "Directed brand communication and package architectures for global luxury brands.",
      startDate: "2022",
      endDate: "Present",
      order: 1
    },
    {
      id: "exp-2",
      company: "Prime Motion Co.",
      position: "Senior Graphic Designer & Video Editor",
      description: "Edited commercial campaigns and structured promotional digital identity elements.",
      startDate: "2019",
      endDate: "2022",
      order: 2
    }
  ],
  messages: [],
  social_links: [
    { id: "soc-1", platform: "Telegram", url: "https://t.me/milkosamuel470" },
    { id: "soc-2", platform: "WhatsApp", url: "https://wa.me/251902782218" }
  ],
  process_steps: [
    {
      id: "step-1",
      number: "01",
      title: "Discover",
      description: "We start with an intensive, structured conversation to understand your business objectives, target audience demographics, and core creative challenges.",
      order: 1
    },
    {
      id: "step-2",
      number: "02",
      title: "Strategize",
      description: "I perform rigorous industry research, structure a tailored visual direction, and align a roadmap aligned with your brand positioning goals.",
      order: 2
    },
    {
      id: "step-3",
      number: "03",
      title: "Design",
      description: "I design with absolute intention and geometric rigor, crafting and refining multiple options down to a singular, cohesive masterpiece.",
      order: 3
    },
    {
      id: "step-4",
      number: "04",
      title: "Develop",
      description: "I build, optimize, and thoroughly test assets across physical and digital formats to ensure optimal performance, scaling, and clarity.",
      order: 4
    },
    {
      id: "step-5",
      number: "05",
      title: "Launch",
      description: "We deploy your project to the world. I continue to provide close support to monitor engagement, guide asset usage, and help your brand evolve.",
      order: 5
    }
  ],
  philosophy_items: [
    {
      id: "phil-1",
      title: "Clarity",
      description: "Simplicity is not minimalism. It is making the complex feel entirely effortless and transparent.",
      order: 1
    },
    {
      id: "phil-2",
      title: "Function",
      description: "Design must serve a strategic purpose first, removing friction and guiding user interaction naturally.",
      order: 2
    },
    {
      id: "phil-3",
      title: "Impact",
      description: "Great design leaves an indelible, lasting visual memory and drives measurable growth and outcomes.",
      order: 3
    }
  ]
};

class LocalJSONDatabase {
  private data: any = {};

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
        // Verify tables exist, backfill any missing tables from seed
        let updated = false;
        for (const [key, value] of Object.entries(DEFAULT_SEED)) {
          if (this.data[key] === undefined) {
            this.data[key] = value;
            updated = true;
          }
        }
        if (updated) {
          this.save();
        }
      } else {
        this.data = JSON.parse(JSON.stringify(DEFAULT_SEED));
        this.save();
      }
    } catch (e) {
      console.error("Database initialization failed. Using default in-memory fallback.", e);
      this.data = JSON.parse(JSON.stringify(DEFAULT_SEED));
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write to database file.", e);
    }
  }

  public getTable(tableName: string): any[] {
    this.init(); // Reload latest
    return this.data[tableName] || [];
  }

  public getSettings() {
    this.init();
    return this.data.settings || DEFAULT_SEED.settings;
  }

  public updateSettings(newSettings: any) {
    this.init();
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  public insert(tableName: string, record: any) {
    this.init();
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }
    const newRecord = {
      id: record.id || Math.random().toString(36).substring(2, 11),
      ...record
    };
    this.data[tableName].push(newRecord);
    this.save();
    return newRecord;
  }

  public update(tableName: string, id: string, record: any) {
    this.init();
    const table = this.data[tableName] || [];
    const index = table.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      table[index] = { ...table[index], ...record, id }; // keep ID unchanged
      this.data[tableName] = table;
      this.save();
      return table[index];
    }
    return null;
  }

  public delete(tableName: string, id: string): boolean {
    this.init();
    const table = this.data[tableName] || [];
    const initialLen = table.length;
    this.data[tableName] = table.filter((r: any) => r.id !== id);
    this.save();
    return this.data[tableName].length < initialLen;
  }
}

export const db = new LocalJSONDatabase();
