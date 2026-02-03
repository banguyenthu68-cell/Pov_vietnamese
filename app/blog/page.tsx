import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

// This will be replaced with actual database queries
const blogPosts = [
  {
    id: 1,
    title: "10 Essential Vietnamese Phrases for Beginners",
    excerpt: "Start your Vietnamese journey with these must-know phrases that will help you navigate daily conversations with confidence.",
    category: "Beginner",
    author: "POV Vietnamese",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    imageUrl: "/blog/phrases.jpg"
  },
  {
    id: 2,
    title: "Understanding Vietnamese Tones: A Complete Guide",
    excerpt: "Master the six tones of Vietnamese with practical tips and audio examples to improve your pronunciation.",
    category: "Pronunciation",
    author: "POV Vietnamese",
    publishedAt: "2024-01-10",
    readTime: "8 min read",
    imageUrl: "/blog/tones.jpg"
  },
  {
    id: 3,
    title: "Vietnamese Food Culture: Learn Through Cuisine",
    excerpt: "Explore Vietnamese culture through its delicious cuisine and learn essential food-related vocabulary.",
    category: "Culture",
    author: "POV Vietnamese",
    publishedAt: "2024-01-05",
    readTime: "6 min read",
    imageUrl: "/blog/food.jpg"
  },
  {
    id: 4,
    title: "Common Mistakes English Speakers Make in Vietnamese",
    excerpt: "Avoid these common pitfalls and accelerate your Vietnamese learning journey.",
    category: "Tips",
    author: "POV Vietnamese",
    publishedAt: "2023-12-28",
    readTime: "7 min read",
    imageUrl: "/blog/mistakes.jpg"
  },
  {
    id: 5,
    title: "How to Practice Vietnamese Listening Skills",
    excerpt: "Effective strategies to improve your Vietnamese listening comprehension with recommended resources.",
    category: "Learning Tips",
    author: "POV Vietnamese",
    publishedAt: "2023-12-20",
    readTime: "6 min read",
    imageUrl: "/blog/listening.jpg"
  },
  {
    id: 6,
    title: "Vietnamese Festivals and Traditions Explained",
    excerpt: "Discover the rich cultural heritage of Vietnam through its festivals and traditional celebrations.",
    category: "Culture",
    author: "POV Vietnamese",
    publishedAt: "2023-12-15",
    readTime: "10 min read",
    imageUrl: "/blog/festivals.jpg"
  }
]

const categories = ["All", "Beginner", "Pronunciation", "Culture", "Tips", "Learning Tips"]

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Blog & Resources</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Free articles, learning tips, and cultural insights to help you master Vietnamese
          </p>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-indigo-600 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Weekly Vietnamese Learning Tips
          </h2>
          <p className="text-indigo-100 mb-6">
            Join 5,000+ learners receiving exclusive lessons and cultural insights
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="submit"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  category === "All"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {/* Placeholder Image */}
                <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">POV</span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
                  >
                    Read More <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              Load More Posts
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
