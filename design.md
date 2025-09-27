# Jeressar High School - Design Style Guide

## Design Philosophy

### Visual Language
**Premium Educational Excellence**: The design embodies sophistication, trust, and academic achievement through clean minimalism with strategic use of premium morph animations. Every element communicates the school's commitment to shaping tomorrow's leaders.

### Color Palette
- **Primary**: Methylene Blue (#0080FF) - Trust, excellence, academic tradition
- **Secondary**: Pure White (#FFFFFF) - Clarity, openness, modernity  
- **Neutral**: Light Gray (#F5F5F5) - Balance, sophistication, readability
- **Accent**: Deep Navy (#003366) - Authority, depth, premium feel

### Typography
- **Display Font**: "Poppins" - Bold, modern, highly legible for headings
- **Body Font**: "Roboto" - Clean, professional, excellent readability
- **Hierarchy**: Large display headings (48px+), medium section headers (32px), body text (16px)

## Visual Effects & Animations

### Core Libraries Implementation
1. **Anime.js**: Smooth morph transitions, stagger animations, premium button effects
2. **Splitting.js**: Advanced text animations for hero headlines
3. **Typed.js**: Typewriter effect for dynamic content
4. **ECharts.js**: Data visualization for academic performance
5. **Splide.js**: Elegant image carousels and testimonial sliders
6. **p5.js**: Creative background effects and interactive elements
7. **Pixi.js**: Advanced visual effects for hero sections

### Animation Specifications
- **Hero Text**: Typewriter animation with gradient color cycling
- **Buttons**: 3D tilt hover effects with shadow morphing
- **Cards**: Smooth lift and glow on hover with stagger delays
- **Images**: Ken Burns pan/zoom effects with fade transitions
- **Navigation**: Smooth slide animations with blur backgrounds
- **Forms**: Focus states with blue accent animations

### Header Effects
- **Background**: Subtle particle system using p5.js with blue theme
- **Text**: Split-by-letter stagger animations using Splitting.js
- **CTA Buttons**: Morphing icons with elastic hover transitions

### Scroll Motion
- **Trigger**: Elements animate when entering top 50% of viewport
- **Duration**: 300ms for smooth, premium feel
- **Easing**: Custom cubic-bezier for natural motion
- **Stagger**: 100ms delays between elements for flowing animations

### Hover Effects
- **Cards**: 3D perspective tilt (5deg) with shadow expansion
- **Buttons**: Color morphing from blue to navy with glow
- **Images**: Slight zoom (1.05x) with overlay fade-in
- **Links**: Animated underlines with elastic timing
- **Icons**: Rotation and scale transforms with bounce easing

## Layout & Structure

### Grid System
- **Desktop**: 12-column grid with 1200px max-width
- **Tablet**: 8-column responsive grid
- **Mobile**: Single column with optimized touch targets

### Spacing
- **Section Padding**: 80px vertical, 20px horizontal
- **Element Margins**: 40px between major sections
- **Card Spacing**: 30px gap in grid layouts

### Navigation
- **Position**: Fixed header with blur background effect
- **Height**: 80px with centered logo and navigation
- **Mobile**: Hamburger menu with smooth slide animations

## Component Design

### Hero Section
- **Height**: 100vh with centered content
- **Background**: Generated abstract educational imagery
- **Content**: Large headline with typewriter effect, subtext, dual CTA buttons
- **Animation**: Staggered entrance with parallax scrolling

### Academic Cards
- **Style**: Clean white cards with subtle shadows
- **Hover**: Lift effect with blue accent border
- **Content**: Icon, title, description, and learn more link
- **Layout**: Responsive grid with consistent spacing

### Testimonial Carousel
- **Design**: Minimalist with focus on content
- **Navigation**: Dot indicators with smooth transitions
- **Animation**: Fade transitions between testimonials
- **Responsive**: Optimized for all screen sizes

### Contact Form
- **Fields**: Name, email, subject, message with validation
- **Style**: Floating labels with blue focus states
- **Button**: Premium morphing submit button
- **Feedback**: Success animations with checkmark icons

## Responsive Design

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px  
- **Mobile**: 320px - 767px

### Mobile Optimizations
- **Touch Targets**: Minimum 44px for all interactive elements
- **Typography**: Scaled font sizes for readability
- **Navigation**: Collapsible menu with smooth animations
- **Images**: Optimized loading with progressive enhancement

## Accessibility

### Color Contrast
- **Text on White**: 4.5:1 minimum ratio maintained
- **Blue on White**: 8.2:1 ratio for excellent readability
- **Interactive Elements**: Clear focus indicators

### Navigation
- **Keyboard**: Full keyboard navigation support
- **Screen Readers**: Semantic HTML with proper ARIA labels
- **Focus Management**: Clear focus indicators and logical tab order