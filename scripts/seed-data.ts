/** Seed data for SkillGraph. Realistic career-intelligence graph. */

export const roles = [
  { id: "role-1", name: "Frontend Developer", slug: "frontend-developer", category: "Engineering", description: "Builds user interfaces and client-side applications using modern web technologies.", averageSalary: 105000 },
  { id: "role-2", name: "Backend Developer", slug: "backend-developer", category: "Engineering", description: "Designs and implements server-side logic, APIs, and database integrations.", averageSalary: 115000 },
  { id: "role-3", name: "Full Stack Developer", slug: "full-stack-developer", category: "Engineering", description: "Works across the entire stack from UI to server to database.", averageSalary: 120000 },
  { id: "role-4", name: "Data Scientist", slug: "data-scientist", category: "Data", description: "Analyzes complex datasets and builds statistical models to extract insights.", averageSalary: 130000 },
  { id: "role-5", name: "ML Engineer", slug: "ml-engineer", category: "Data", description: "Deploys and scales machine learning models in production systems.", averageSalary: 140000 },
  { id: "role-6", name: "DevOps Engineer", slug: "devops-engineer", category: "Infrastructure", description: "Automates infrastructure, CI/CD pipelines, and ensures system reliability.", averageSalary: 125000 },
  { id: "role-7", name: "Mobile Developer", slug: "mobile-developer", category: "Engineering", description: "Builds native and cross-platform mobile applications for iOS and Android.", averageSalary: 110000 },
  { id: "role-8", name: "Cloud Architect", slug: "cloud-architect", category: "Infrastructure", description: "Designs scalable cloud infrastructure and migration strategies.", averageSalary: 150000 },
];

export const skills = [
  { id: "skill-1", name: "JavaScript", slug: "javascript", category: "Language", difficulty: "intermediate" },
  { id: "skill-2", name: "TypeScript", slug: "typescript", category: "Language", difficulty: "intermediate" },
  { id: "skill-3", name: "React Development", slug: "react-development", category: "Frontend", difficulty: "intermediate" },
  { id: "skill-4", name: "CSS and Styling", slug: "css-and-styling", category: "Frontend", difficulty: "beginner" },
  { id: "skill-5", name: "REST API Design", slug: "rest-api-design", category: "Backend", difficulty: "intermediate" },
  { id: "skill-6", name: "Database Design", slug: "database-design", category: "Backend", difficulty: "intermediate" },
  { id: "skill-7", name: "System Design", slug: "system-design", category: "Architecture", difficulty: "advanced" },
  { id: "skill-8", name: "Git Version Control", slug: "git-version-control", category: "DevOps", difficulty: "beginner" },
  { id: "skill-9", name: "Testing", slug: "testing", category: "Quality", difficulty: "intermediate" },
  { id: "skill-10", name: "Python Programming", slug: "python-programming", category: "Language", difficulty: "intermediate" },
  { id: "skill-11", name: "Data Analysis", slug: "data-analysis", category: "Data", difficulty: "intermediate" },
  { id: "skill-12", name: "Machine Learning", slug: "machine-learning", category: "Data", difficulty: "advanced" },
  { id: "skill-13", name: "CI/CD Pipelines", slug: "ci-cd-pipelines", category: "DevOps", difficulty: "intermediate" },
  { id: "skill-14", name: "Cloud Infrastructure", slug: "cloud-infrastructure", category: "Infrastructure", difficulty: "advanced" },
  { id: "skill-15", name: "Containerization", slug: "containerization", category: "DevOps", difficulty: "intermediate" },
  { id: "skill-16", name: "Node.js Development", slug: "nodejs-development", category: "Backend", difficulty: "intermediate" },
  { id: "skill-17", name: "Mobile UI Development", slug: "mobile-ui-development", category: "Mobile", difficulty: "intermediate" },
  { id: "skill-18", name: "Performance Optimization", slug: "performance-optimization", category: "Quality", difficulty: "advanced" },
  { id: "skill-19", name: "Security Best Practices", slug: "security-best-practices", category: "Quality", difficulty: "advanced" },
  { id: "skill-20", name: "Agile Methodology", slug: "agile-methodology", category: "Process", difficulty: "beginner" },
  { id: "skill-21", name: "Data Visualization", slug: "data-visualization", category: "Data", difficulty: "intermediate" },
  { id: "skill-22", name: "Deep Learning", slug: "deep-learning", category: "Data", difficulty: "advanced" },
  { id: "skill-23", name: "Responsive Design", slug: "responsive-design", category: "Frontend", difficulty: "beginner" },
  { id: "skill-24", name: "State Management", slug: "state-management", category: "Frontend", difficulty: "intermediate" },
  { id: "skill-25", name: "API Integration", slug: "api-integration", category: "Backend", difficulty: "intermediate" },
];

export const technologies = [
  { id: "tech-1", name: "React", slug: "react", category: "Frontend Framework", icon: "⚛️" },
  { id: "tech-2", name: "Next.js", slug: "nextjs", category: "Frontend Framework", icon: "▲" },
  { id: "tech-3", name: "TypeScript", slug: "typescript-lang", category: "Language", icon: "🔷" },
  { id: "tech-4", name: "Node.js", slug: "nodejs", category: "Runtime", icon: "🟢" },
  { id: "tech-5", name: "Python", slug: "python", category: "Language", icon: "🐍" },
  { id: "tech-6", name: "PostgreSQL", slug: "postgresql", category: "Database", icon: "🐘" },
  { id: "tech-7", name: "Docker", slug: "docker", category: "DevOps", icon: "🐳" },
  { id: "tech-8", name: "AWS", slug: "aws", category: "Cloud", icon: "☁️" },
  { id: "tech-9", name: "TensorFlow", slug: "tensorflow", category: "ML Framework", icon: "🧠" },
  { id: "tech-10", name: "Git", slug: "git", category: "Version Control", icon: "📋" },
  { id: "tech-11", name: "Jest", slug: "jest", category: "Testing", icon: "🃏" },
  { id: "tech-12", name: "MongoDB", slug: "mongodb", category: "Database", icon: "🍃" },
  { id: "tech-13", name: "Redis", slug: "redis", category: "Database", icon: "🔴" },
  { id: "tech-14", name: "Kubernetes", slug: "kubernetes", category: "DevOps", icon: "⎈" },
  { id: "tech-15", name: "GitHub Actions", slug: "github-actions", category: "CI/CD", icon: "🔄" },
  { id: "tech-16", name: "React Native", slug: "react-native", category: "Mobile", icon: "📱" },
  { id: "tech-17", name: "Tailwind CSS", slug: "tailwind-css", category: "CSS", icon: "🎨" },
  { id: "tech-18", name: "PyTorch", slug: "pytorch", category: "ML Framework", icon: "🔥" },
  { id: "tech-19", name: "Terraform", slug: "terraform", category: "Infrastructure", icon: "🏗️" },
  { id: "tech-20", name: "GraphQL", slug: "graphql", category: "API", icon: "◈" },
];

export const projects = [
  { id: "proj-1", name: "E-Commerce Dashboard", slug: "ecommerce-dashboard", description: "Real-time analytics dashboard for an e-commerce platform with charts and filters.", difficulty: "intermediate", estimatedHours: 40 },
  { id: "proj-2", name: "Real-Time Chat App", slug: "realtime-chat-app", description: "WebSocket-based messaging app with rooms, typing indicators, and message history.", difficulty: "intermediate", estimatedHours: 35 },
  { id: "proj-3", name: "REST API Microservice", slug: "rest-api-microservice", description: "Production-grade REST API with auth, rate limiting, and comprehensive tests.", difficulty: "intermediate", estimatedHours: 30 },
  { id: "proj-4", name: "ML Prediction Pipeline", slug: "ml-prediction-pipeline", description: "End-to-end machine learning pipeline from data ingestion to model serving.", difficulty: "advanced", estimatedHours: 60 },
  { id: "proj-5", name: "CI/CD Platform", slug: "ci-cd-platform", description: "Automated build, test, and deployment pipeline with Docker and cloud integration.", difficulty: "advanced", estimatedHours: 45 },
  { id: "proj-6", name: "Mobile Fitness Tracker", slug: "mobile-fitness-tracker", description: "Cross-platform mobile app tracking workouts, nutrition, and health metrics.", difficulty: "intermediate", estimatedHours: 50 },
  { id: "proj-7", name: "Portfolio Website", slug: "portfolio-website", description: "Responsive personal portfolio with animations, project showcases, and a blog.", difficulty: "beginner", estimatedHours: 20 },
  { id: "proj-8", name: "Data Visualization Tool", slug: "data-viz-tool", description: "Interactive data exploration tool with customizable charts and export features.", difficulty: "intermediate", estimatedHours: 35 },
  { id: "proj-9", name: "Cloud Migration Toolkit", slug: "cloud-migration-toolkit", description: "Infrastructure-as-code templates and scripts for cloud migration projects.", difficulty: "advanced", estimatedHours: 55 },
  { id: "proj-10", name: "Sentiment Analysis API", slug: "sentiment-analysis-api", description: "NLP-powered API that analyzes text sentiment with confidence scoring.", difficulty: "advanced", estimatedHours: 40 },
];

export const resources = [
  { id: "res-1", name: "React Official Docs", url: "https://react.dev", type: "documentation", platform: "React", isFree: true },
  { id: "res-2", name: "Next.js Learn Course", url: "https://nextjs.org/learn", type: "course", platform: "Vercel", isFree: true },
  { id: "res-3", name: "TypeScript Handbook", url: "https://typescriptlang.org/docs", type: "documentation", platform: "Microsoft", isFree: true },
  { id: "res-4", name: "Python for Data Science", url: "https://coursera.org/python-data", type: "course", platform: "Coursera", isFree: false },
  { id: "res-5", name: "Docker Getting Started", url: "https://docs.docker.com/get-started", type: "tutorial", platform: "Docker", isFree: true },
  { id: "res-6", name: "AWS Cloud Practitioner", url: "https://aws.amazon.com/training", type: "course", platform: "AWS", isFree: false },
  { id: "res-7", name: "Jest Testing Guide", url: "https://jestjs.io/docs/getting-started", type: "documentation", platform: "Jest", isFree: true },
  { id: "res-8", name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "tutorial", platform: "GitHub", isFree: true },
  { id: "res-9", name: "Fast.ai Deep Learning", url: "https://fast.ai", type: "course", platform: "fast.ai", isFree: true },
  { id: "res-10", name: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials", type: "tutorial", platform: "CNCF", isFree: true },
  { id: "res-11", name: "CSS for JS Developers", url: "https://css-for-js.dev", type: "course", platform: "Josh Comeau", isFree: false },
  { id: "res-12", name: "Git Pro Book", url: "https://git-scm.com/book", type: "book", platform: "Git", isFree: true },
];

// ── Relationships ─────────────────────────────────────────────────────
// Format: [sourceId, targetId, properties?]

export const requiresSkill: Array<[string, string, { importance: string }]> = [
  // Frontend Developer
  ["role-1", "skill-1", { importance: "core" }],
  ["role-1", "skill-2", { importance: "core" }],
  ["role-1", "skill-3", { importance: "core" }],
  ["role-1", "skill-4", { importance: "core" }],
  ["role-1", "skill-8", { importance: "preferred" }],
  ["role-1", "skill-9", { importance: "preferred" }],
  ["role-1", "skill-23", { importance: "core" }],
  ["role-1", "skill-24", { importance: "preferred" }],
  ["role-1", "skill-18", { importance: "bonus" }],
  // Backend Developer
  ["role-2", "skill-1", { importance: "preferred" }],
  ["role-2", "skill-2", { importance: "preferred" }],
  ["role-2", "skill-5", { importance: "core" }],
  ["role-2", "skill-6", { importance: "core" }],
  ["role-2", "skill-7", { importance: "preferred" }],
  ["role-2", "skill-8", { importance: "core" }],
  ["role-2", "skill-9", { importance: "core" }],
  ["role-2", "skill-16", { importance: "core" }],
  ["role-2", "skill-19", { importance: "preferred" }],
  // Full Stack Developer
  ["role-3", "skill-1", { importance: "core" }],
  ["role-3", "skill-2", { importance: "core" }],
  ["role-3", "skill-3", { importance: "core" }],
  ["role-3", "skill-5", { importance: "core" }],
  ["role-3", "skill-6", { importance: "preferred" }],
  ["role-3", "skill-7", { importance: "preferred" }],
  ["role-3", "skill-8", { importance: "core" }],
  ["role-3", "skill-9", { importance: "preferred" }],
  ["role-3", "skill-16", { importance: "preferred" }],
  ["role-3", "skill-24", { importance: "preferred" }],
  // Data Scientist
  ["role-4", "skill-10", { importance: "core" }],
  ["role-4", "skill-11", { importance: "core" }],
  ["role-4", "skill-12", { importance: "core" }],
  ["role-4", "skill-6", { importance: "preferred" }],
  ["role-4", "skill-21", { importance: "core" }],
  ["role-4", "skill-8", { importance: "preferred" }],
  // ML Engineer
  ["role-5", "skill-10", { importance: "core" }],
  ["role-5", "skill-12", { importance: "core" }],
  ["role-5", "skill-22", { importance: "core" }],
  ["role-5", "skill-7", { importance: "preferred" }],
  ["role-5", "skill-15", { importance: "preferred" }],
  ["role-5", "skill-14", { importance: "preferred" }],
  ["role-5", "skill-5", { importance: "preferred" }],
  ["role-5", "skill-8", { importance: "core" }],
  // DevOps Engineer
  ["role-6", "skill-13", { importance: "core" }],
  ["role-6", "skill-14", { importance: "core" }],
  ["role-6", "skill-15", { importance: "core" }],
  ["role-6", "skill-8", { importance: "core" }],
  ["role-6", "skill-19", { importance: "preferred" }],
  ["role-6", "skill-7", { importance: "preferred" }],
  ["role-6", "skill-10", { importance: "bonus" }],
  // Mobile Developer
  ["role-7", "skill-1", { importance: "core" }],
  ["role-7", "skill-2", { importance: "preferred" }],
  ["role-7", "skill-17", { importance: "core" }],
  ["role-7", "skill-24", { importance: "core" }],
  ["role-7", "skill-8", { importance: "preferred" }],
  ["role-7", "skill-9", { importance: "preferred" }],
  ["role-7", "skill-25", { importance: "core" }],
  // Cloud Architect
  ["role-8", "skill-14", { importance: "core" }],
  ["role-8", "skill-7", { importance: "core" }],
  ["role-8", "skill-19", { importance: "core" }],
  ["role-8", "skill-15", { importance: "preferred" }],
  ["role-8", "skill-13", { importance: "preferred" }],
  ["role-8", "skill-6", { importance: "preferred" }],
  ["role-8", "skill-20", { importance: "bonus" }],
];

export const usesTechnology: Array<[string, string, { frequency: string }]> = [
  // Frontend Developer
  ["role-1", "tech-1", { frequency: "daily" }],
  ["role-1", "tech-2", { frequency: "daily" }],
  ["role-1", "tech-3", { frequency: "daily" }],
  ["role-1", "tech-11", { frequency: "daily" }],
  ["role-1", "tech-17", { frequency: "weekly" }],
  ["role-1", "tech-10", { frequency: "daily" }],
  // Backend Developer
  ["role-2", "tech-4", { frequency: "daily" }],
  ["role-2", "tech-3", { frequency: "daily" }],
  ["role-2", "tech-6", { frequency: "daily" }],
  ["role-2", "tech-13", { frequency: "weekly" }],
  ["role-2", "tech-10", { frequency: "daily" }],
  ["role-2", "tech-7", { frequency: "weekly" }],
  // Full Stack Developer
  ["role-3", "tech-1", { frequency: "daily" }],
  ["role-3", "tech-2", { frequency: "daily" }],
  ["role-3", "tech-3", { frequency: "daily" }],
  ["role-3", "tech-4", { frequency: "daily" }],
  ["role-3", "tech-6", { frequency: "weekly" }],
  ["role-3", "tech-10", { frequency: "daily" }],
  ["role-3", "tech-12", { frequency: "weekly" }],
  // Data Scientist
  ["role-4", "tech-5", { frequency: "daily" }],
  ["role-4", "tech-9", { frequency: "weekly" }],
  ["role-4", "tech-6", { frequency: "weekly" }],
  ["role-4", "tech-10", { frequency: "daily" }],
  // ML Engineer
  ["role-5", "tech-5", { frequency: "daily" }],
  ["role-5", "tech-9", { frequency: "daily" }],
  ["role-5", "tech-18", { frequency: "daily" }],
  ["role-5", "tech-7", { frequency: "weekly" }],
  ["role-5", "tech-8", { frequency: "weekly" }],
  ["role-5", "tech-10", { frequency: "daily" }],
  // DevOps Engineer
  ["role-6", "tech-7", { frequency: "daily" }],
  ["role-6", "tech-14", { frequency: "daily" }],
  ["role-6", "tech-15", { frequency: "daily" }],
  ["role-6", "tech-8", { frequency: "daily" }],
  ["role-6", "tech-19", { frequency: "weekly" }],
  ["role-6", "tech-10", { frequency: "daily" }],
  // Mobile Developer
  ["role-7", "tech-16", { frequency: "daily" }],
  ["role-7", "tech-3", { frequency: "daily" }],
  ["role-7", "tech-10", { frequency: "daily" }],
  ["role-7", "tech-11", { frequency: "weekly" }],
  // Cloud Architect
  ["role-8", "tech-8", { frequency: "daily" }],
  ["role-8", "tech-19", { frequency: "daily" }],
  ["role-8", "tech-14", { frequency: "weekly" }],
  ["role-8", "tech-7", { frequency: "weekly" }],
  ["role-8", "tech-10", { frequency: "daily" }],
];

export const implementedWith: Array<[string, string]> = [
  ["skill-1", "tech-1"], ["skill-1", "tech-4"], ["skill-1", "tech-2"],
  ["skill-2", "tech-3"],
  ["skill-3", "tech-1"], ["skill-3", "tech-2"],
  ["skill-4", "tech-17"],
  ["skill-5", "tech-4"], ["skill-5", "tech-20"],
  ["skill-6", "tech-6"], ["skill-6", "tech-12"],
  ["skill-8", "tech-10"],
  ["skill-9", "tech-11"],
  ["skill-10", "tech-5"],
  ["skill-12", "tech-9"], ["skill-12", "tech-18"],
  ["skill-13", "tech-15"], ["skill-13", "tech-7"],
  ["skill-14", "tech-8"], ["skill-14", "tech-19"],
  ["skill-15", "tech-7"], ["skill-15", "tech-14"],
  ["skill-16", "tech-4"],
  ["skill-17", "tech-16"],
  ["skill-22", "tech-9"], ["skill-22", "tech-18"],
  ["skill-23", "tech-17"],
  ["skill-24", "tech-1"],
  ["skill-25", "tech-20"], ["skill-25", "tech-4"],
];

export const demonstrates: Array<[string, string]> = [
  ["proj-1", "skill-3"], ["proj-1", "skill-1"], ["proj-1", "skill-4"], ["proj-1", "skill-21"],
  ["proj-2", "skill-1"], ["proj-2", "skill-16"], ["proj-2", "skill-5"],
  ["proj-3", "skill-5"], ["proj-3", "skill-6"], ["proj-3", "skill-9"], ["proj-3", "skill-16"],
  ["proj-4", "skill-10"], ["proj-4", "skill-12"], ["proj-4", "skill-22"], ["proj-4", "skill-11"],
  ["proj-5", "skill-13"], ["proj-5", "skill-15"], ["proj-5", "skill-14"],
  ["proj-6", "skill-17"], ["proj-6", "skill-1"], ["proj-6", "skill-24"], ["proj-6", "skill-25"],
  ["proj-7", "skill-4"], ["proj-7", "skill-23"], ["proj-7", "skill-1"],
  ["proj-8", "skill-21"], ["proj-8", "skill-10"], ["proj-8", "skill-11"],
  ["proj-9", "skill-14"], ["proj-9", "skill-7"], ["proj-9", "skill-19"],
  ["proj-10", "skill-12"], ["proj-10", "skill-10"], ["proj-10", "skill-5"],
];

export const builtWith: Array<[string, string]> = [
  ["proj-1", "tech-1"], ["proj-1", "tech-2"], ["proj-1", "tech-3"],
  ["proj-2", "tech-4"], ["proj-2", "tech-1"], ["proj-2", "tech-12"],
  ["proj-3", "tech-4"], ["proj-3", "tech-6"], ["proj-3", "tech-11"],
  ["proj-4", "tech-5"], ["proj-4", "tech-9"], ["proj-4", "tech-7"],
  ["proj-5", "tech-7"], ["proj-5", "tech-15"], ["proj-5", "tech-8"],
  ["proj-6", "tech-16"], ["proj-6", "tech-3"],
  ["proj-7", "tech-2"], ["proj-7", "tech-17"], ["proj-7", "tech-3"],
  ["proj-8", "tech-5"], ["proj-8", "tech-1"],
  ["proj-9", "tech-19"], ["proj-9", "tech-8"], ["proj-9", "tech-14"],
  ["proj-10", "tech-5"], ["proj-10", "tech-18"], ["proj-10", "tech-7"],
];

export const teaches: Array<[string, string]> = [
  ["res-1", "skill-3"], ["res-1", "skill-24"],
  ["res-2", "skill-3"], ["res-2", "skill-5"],
  ["res-3", "skill-2"],
  ["res-4", "skill-10"], ["res-4", "skill-11"],
  ["res-5", "skill-15"],
  ["res-6", "skill-14"],
  ["res-7", "skill-9"],
  ["res-8", "skill-7"],
  ["res-9", "skill-22"], ["res-9", "skill-12"],
  ["res-10", "skill-15"], ["res-10", "skill-14"],
  ["res-11", "skill-4"], ["res-11", "skill-23"],
  ["res-12", "skill-8"],
];

export const relatedTo: Array<[string, string, { similarity: number }]> = [
  ["role-1", "role-3", { similarity: 0.8 }],
  ["role-1", "role-7", { similarity: 0.6 }],
  ["role-2", "role-3", { similarity: 0.8 }],
  ["role-2", "role-6", { similarity: 0.5 }],
  ["role-3", "role-1", { similarity: 0.8 }],
  ["role-3", "role-2", { similarity: 0.8 }],
  ["role-4", "role-5", { similarity: 0.7 }],
  ["role-5", "role-4", { similarity: 0.7 }],
  ["role-5", "role-6", { similarity: 0.4 }],
  ["role-6", "role-8", { similarity: 0.7 }],
  ["role-8", "role-6", { similarity: 0.7 }],
];

// Prerequisite chains: skill-4 → skill-23 → skill-3 → skill-24 → skill-18
// Also: skill-10 → skill-11 → skill-12 → skill-22
// Also: skill-8 → skill-13
export const prerequisiteOf: Array<[string, string]> = [
  ["skill-4", "skill-23"],   // CSS → Responsive Design
  ["skill-23", "skill-3"],   // Responsive → React Development
  ["skill-3", "skill-24"],   // React → State Management
  ["skill-24", "skill-18"],  // State Management → Performance Optimization
  ["skill-10", "skill-11"],  // Python → Data Analysis
  ["skill-11", "skill-12"],  // Data Analysis → Machine Learning
  ["skill-12", "skill-22"],  // Machine Learning → Deep Learning
  ["skill-8", "skill-13"],   // Git → CI/CD
  ["skill-15", "skill-14"],  // Containerization → Cloud Infrastructure
  ["skill-1", "skill-2"],    // JavaScript → TypeScript
];
