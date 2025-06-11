# Moyo Mzuri

A modern donation platform built with SvelteKit for supporting social projects in Kenya.

## Features

### 🎨 Enhanced User Interface
- **Beautiful Hero Section**: Eye-catching gradient background with pattern overlay and compelling call-to-action buttons
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Complete dark/light theme toggle with smooth transitions
- **Sticky Navigation**: Static/sticky navbar that remains visible while scrolling through any part of the page
- **Clean Design**: Icon-free interface with clean text-based navigation and buttons

### 📱 Homepage Sections
- **Hero Section**: Inspiring banner with background patterns and clear value proposition
- **How It Works**: Step-by-step guide explaining the donation process
- **Featured Projects**: Showcase of active social projects seeking funding
- **Enhanced Footer**: Comprehensive footer with contact information and social media links

### 📄 About Us Page
- **Mission Statement**: Clear explanation of the platform's purpose and values
- **Impact Statistics**: Visual representation of platform achievements
- **Donation Process**: Detailed step-by-step guide for new donors
- **Core Values**: Transparency, accountability, and maximum impact principles
- **Call-to-Action**: Encouraging users to start donating

### 🔧 Technical Enhancements
- **Smooth Scrolling**: Enhanced user experience with smooth page navigation
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Performance**: Optimized loading and responsive images
- **SEO Friendly**: Proper meta tags and structured content

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Customization

### Background Images
To add a custom hero background image:
1. Add your image to the `static/` folder (e.g., `hero-bg.jpg`)
2. Uncomment and update the image tag in `src/routes/+page.svelte`:
   ```html
   <img src="/hero-bg.jpg" alt="Hero Background" class="w-full h-full object-cover" />
   ```

### Contact Information
Update the contact details in `src/routes/+layout.svelte` footer section:
- Email address
- Phone number
- Physical address
- Social media links

### Branding
Customize the app name and description in your environment variables or directly in the components.

## Pages

- **Homepage** (`/`): Hero section, how it works, and featured projects
- **About Us** (`/about`): Comprehensive information about the platform and donation process
- **Admin Dashboard** (`/admin`): Project and donation management (password protected)

## Technologies Used

- **SvelteKit**: Full-stack web framework
- **TailwindCSS**: Utility-first CSS framework
- **SQLite**: Lightweight database
- **M-Pesa API**: Mobile payment integration
- **Drizzle ORM**: Type-safe database operations

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
