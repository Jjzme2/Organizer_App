interface MetaConfig {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  type?: string;
}

interface SeoConfig {
  default: MetaConfig;
  pages: {
    [key: string]: MetaConfig;
  };
}

const seoConfig: SeoConfig = {
  default: {
    title: 'ILYTAT Organizer - Your Personal Task Management Solution',
    description: 'Streamline your productivity with our intuitive task management app. Organize tasks, set reminders, and track progress with ease.',
    keywords: ['task management', 'productivity', 'organization', 'to-do list', 'reminders', 'project management'],
    image: '/meta/default-social.png',
    type: 'website'
  },
  pages: {
    home: {
      title: 'Welcome to ILYTAT Organizer - Smart Task Management',
      description: 'Get started with ILYTAT Organizer and transform the way you manage tasks. Features include task organization, reminders, and progress tracking.',
      keywords: ['task manager', 'getting started', 'productivity tool', 'organization app'],
      type: 'website'
    },
    tasks: {
      title: 'Manage Your Tasks - ILYTAT Organizer',
      description: 'View, create, and organize your tasks efficiently. Stay on top of your to-dos with our intuitive task management interface.',
      keywords: ['task list', 'to-do', 'task management', 'productivity'],
      type: 'website'
    },
    calendar: {
      title: 'Task Calendar - ILYTAT Organizer',
      description: 'View your tasks in a calendar format. Plan ahead and manage your schedule effectively with our calendar view.',
      keywords: ['calendar', 'schedule', 'planning', 'time management'],
      type: 'website'
    },
    profile: {
      title: 'Your Profile - ILYTAT Organizer',
      description: 'Manage your profile settings and preferences. Customize your ILYTAT Organizer experience.',
      keywords: ['profile', 'settings', 'preferences', 'account'],
      type: 'profile'
    },
    login: {
      title: 'Login - ILYTAT Organizer',
      description: 'Log in to your ILYTAT Organizer account to access your tasks and preferences.',
      keywords: ['login', 'sign in', 'account access'],
      type: 'website'
    },
    register: {
      title: 'Create Account - ILYTAT Organizer',
      description: 'Sign up for ILYTAT Organizer and start managing your tasks more effectively.',
      keywords: ['register', 'sign up', 'create account', 'new user'],
      type: 'website'
    },
    completedTasks: {
      title: 'Completed Tasks - ILYTAT Organizer',
      description: 'View your completed tasks and track your productivity progress.',
      keywords: ['completed tasks', 'achievements', 'task history', 'productivity tracking'],
      type: 'website'
    },
    incompleteTasks: {
      title: 'Active Tasks - ILYTAT Organizer',
      description: 'View and manage your active and pending tasks. Stay organized and on track.',
      keywords: ['active tasks', 'pending tasks', 'current tasks', 'to-do list'],
      type: 'website'
    }
  }
};

export const getMetaConfig = (pageName: string): MetaConfig => {
  return seoConfig.pages[pageName] || seoConfig.default;
};

export const generateMetaTags = (config: MetaConfig) => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://organizer-app.com';
  const imageUrl = config.image ? `${baseUrl}${config.image}` : `${baseUrl}${seoConfig.default.image}`;

  return [
    // Basic Meta Tags
    { name: 'title', content: config.title },
    { name: 'description', content: config.description },
    { name: 'keywords', content: config.keywords.join(', ') },
    
    // Open Graph Tags
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:type', content: config.type || 'website' },
    { property: 'og:url', content: baseUrl },
    { property: 'og:site_name', content: 'ILYTAT Organizer' },
    
    // Twitter Card Tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    { name: 'twitter:image', content: imageUrl },
    
    // Additional Meta Tags
    { name: 'application-name', content: 'ILYTAT Organizer' },
    { name: 'apple-mobile-web-app-title', content: 'ILYTAT Organizer' },
    { name: 'theme-color', content: '#4CAF50' }
  ];
};

export default seoConfig;
