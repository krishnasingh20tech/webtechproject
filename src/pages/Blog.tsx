import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const posts = [
  { title: "10 Tips for Better Real Estate Photography", excerpt: "Learn how to capture properties in their best light with these essential photography techniques.", date: "Feb 20, 2025", category: "Real Estate", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { title: "The Art of Portrait Retouching: Less Is More", excerpt: "Why subtle retouching creates more impactful portraits than heavy-handed editing.", date: "Feb 15, 2025", category: "Portraits", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80" },
  { title: "Virtual Staging: The Future of Property Marketing", excerpt: "How digitally furnished rooms are revolutionizing real estate listings and boosting sales.", date: "Feb 10, 2025", category: "Virtual Staging", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" },
  { title: "Color Correction Basics Every Photographer Should Know", excerpt: "Understanding white balance, color grading, and exposure adjustment fundamentals.", date: "Feb 5, 2025", category: "Tutorials", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80" },
  { title: "How Product Photography Drives E-commerce Sales", excerpt: "The direct correlation between photo quality and conversion rates for online stores.", date: "Jan 28, 2025", category: "E-commerce", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
  { title: "RAW vs JPG: When to Use Each Format", excerpt: "A comprehensive guide to choosing the right file format for different photography scenarios.", date: "Jan 20, 2025", category: "Tutorials", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80" },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips, tutorials, and insights on photography and photo editing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <article key={i} className={`glass-card overflow-hidden hover:scale-[1.02] transition-all animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">{post.category}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="font-display font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <button className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
