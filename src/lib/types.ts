export type ProjectStatus = 'shipped' | 'in-progress' | 'experiment' | 'archived';
export type ProjectType = 'game' | 'ai-ml' | 'web' | 'systems' | 'tool';

export interface Project {
  id: string;
  title: string;
  year: number;
  type: ProjectType;
  status: ProjectStatus;
  tagline: string;
  stack: string[];
  previewImage?: string;
  previewVideo?: string;
  href?: string;
  repoHref?: string;
}

export interface WordPair {
  jp: string;
  en: string;
}

export interface IconItem {
  jp: string;
  en: string;
  icon?: string; // devicon class, e.g. "devicon-github-original"
}

export interface Capability {
  id: string;
  label: string;
  detail: string;
  jp?: string;
  wordPairs?: WordPair[];
  iconItems?: IconItem[];
  proficiency?: number;
}

export interface SystemReadout {
  key: string;
  value: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle?: string;
}

export const projects: Project[] = [
  {
    id: 'red-block-survival',
    title: 'RED_BLOCK_SURVIVAL',
    year: 2026,
    type: 'game',
    status: 'experiment',
    tagline:
      'A survival game built entirely on Tkinter canvas — drag-based control, collision pressure, difficulty ramps, and short invincibility windows. No game engine, no external rendering library.',
    stack: ['Python'],
  },
  {
    id: 'wall-calendar',
    title: 'WALL_CALENDAR',
    year: 2026,
    type: 'web',
    status: 'in-progress',
    tagline:
      'A calendar interface built with Vite + TypeScript, structured as a monorepo-style layout with the app isolated in wall-calendar/ and root-level scripts wrapping dev/build/preview.',
    stack: ['TypeScript', 'Vite', 'Vercel'],
    previewVideo: '/videos/wall-calendar.mp4',
  },
  {
    id: 'deltatime-3',
    title: 'GRAVESTONE_EDITOR',
    year: 2026,
    type: 'game',
    status: 'shipped',
    tagline:
      '1st place, DeltaTime Game Jam — built in Godot 4.6 under a hard time constraint. Scoped, built, and shipped inside the jam window.',
    stack: ['Godot'],
    repoHref: 'https://github.com/ShalikS-74/DeltaTime-3.O',
  },
  {
    id: 'beyond-iou',
    title: 'BEYOND_IOU',
    year: 2026,
    type: 'ai-ml',
    status: 'in-progress',
    tagline:
      'C3I Hub research internship — investigating why segmentation masks with identical IoU can have very different building-count reliability.',
    stack: ['PyTorch'],
  },
];

export const capabilities: Capability[] = [
  {
    id: 'languages',
    label: 'Languages',
    detail: 'Python, C, JavaScript, TypeScript, Java, HTML, Ruby',
    jp: 'パイソン, C, ジャバスクリプト, タイプスクリプト, ジャヴァ, HTML, ルビー',
    iconItems: [
      { jp: 'パイソン', en: 'Python', icon: 'devicon-python-plain' },
      { jp: 'C', en: 'C', icon: 'devicon-c-plain' },
      { jp: 'ジャバスクリプト', en: 'JavaScript', icon: 'devicon-javascript-plain' },
      { jp: 'タイプスクリプト', en: 'TypeScript', icon: 'devicon-typescript-plain' },
      { jp: 'ジャヴァ', en: 'Java', icon: 'devicon-java-plain' },
      { jp: 'HTML', en: 'HTML', icon: 'devicon-html5-plain' },
      { jp: 'ルビー', en: 'Ruby', icon: 'devicon-ruby-plain' },
    ],
    proficiency: 76,
  },
  {
    id: 'web-dev',
    label: 'Web Dev',
    detail: 'React, Tailwind CSS, Node.js, Express, Vercel',
    jp: 'リアクト, テールウィンド シーエスエス, ノードジェエス, エクスプレス, ヴァーセル',
    iconItems: [
      { jp: 'リアクト', en: 'React', icon: 'devicon-react-original' },
      { jp: 'テールウィンド シーエスエス', en: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain' },
      { jp: 'ノードジェエス', en: 'Node.js', icon: 'devicon-nodejs-plain' },
      { jp: 'エクスプレス', en: 'Express', icon: 'devicon-express-original' },
      { jp: 'ヴァーセル', en: 'Vercel', icon: 'devicon-vercel-original' },
    ],
    proficiency: 70,
  },
  {
    id: 'tools',
    label: 'Tools',
    detail: 'GitHub, GitLab, Godot, VS Code, Arch Linux',
    jp: 'ギットハブ, ギットラブ, ゴドウ, VSコード, アーチリナックス',
    iconItems: [
      { jp: 'ギットハブ', en: 'GitHub', icon: 'devicon-github-original' },
      { jp: 'ギットラブ', en: 'GitLab', icon: 'devicon-gitlab-plain' },
      { jp: 'ゴドウ', en: 'Godot', icon: 'devicon-godot-plain' },
      { jp: 'VSコード', en: 'VS Code', icon: 'devicon-vscode-plain' },
      { jp: 'アーチリナックス', en: 'Arch Linux', icon: 'devicon-archlinux-plain' },
    ],
    proficiency: 72,
  },
  {
    id: 'ai-ml',
    label: 'AI / ML',
    detail: 'PyTorch, scikit-learn, TensorFlow, OpenCV',
    jp: 'パイトルッチ, シーキットラーニ, テンソアフロー, オープンシーヴィー',
    iconItems: [
      { jp: 'パイトルッチ', en: 'PyTorch', icon: 'devicon-pytorch-original' },
      { jp: 'シーキットラーニ', en: 'scikit-learn', icon: 'devicon-scikitlearn-plain' },
      { jp: 'テンソアフロー', en: 'TensorFlow', icon: 'devicon-tensorflow-original' },
      { jp: 'オープンシーヴィー', en: 'OpenCV', icon: 'devicon-opencv-plain' },
    ],
    proficiency: 58,
  },
];

export const readouts: SystemReadout[] = [
  { key: 'LOCATION', value: 'SYSTEM / INDIA' },
  { key: 'ROLE', value: 'AI + GAME DEV LEARNER' },
  { key: 'STACK', value: 'PY / TS / REACT' },
  { key: 'STATUS', value: 'ONLINE' },
];

export const socials: SocialLink[] = [
  {
    label: 'LINKEDIN',
    href: 'https://www.linkedin.com/in/shalik-sahul-43aaa0378/',
    handle: 'shalik-sahul',
  },
  {
    label: 'GITHUB',
    href: 'https://github.com/',
    handle: 'github',
  },
];
