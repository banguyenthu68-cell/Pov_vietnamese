import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'

// This will be replaced with actual database queries
const getBlogPost = (id: string) => {
  return {
    id,
    title: "10 Essential Vietnamese Phrases for Beginners",
    content: `
      <p>Learning a new language can be overwhelming, but starting with essential phrases makes the journey much more manageable. Here are 10 Vietnamese phrases that will help you navigate daily conversations with confidence.</p>

      <h2>1. Xin chào (Sin chow) - Hello</h2>
      <p>This is the most basic and important greeting in Vietnamese. You can use it at any time of day, in any situation. It's polite, friendly, and universally understood.</p>

      <h2>2. Cảm ơn (Gahm uhn) - Thank you</h2>
      <p>Showing gratitude is important in Vietnamese culture. Use this phrase whenever someone helps you or does something nice for you.</p>

      <h2>3. Xin lỗi (Sin loy) - Sorry/Excuse me</h2>
      <p>This versatile phrase can be used to apologize or to politely get someone's attention. It's an essential part of Vietnamese etiquette.</p>

      <h2>4. Tên tôi là... (Ten toy la...) - My name is...</h2>
      <p>Introducing yourself is one of the first things you'll do when meeting new people. This phrase helps you make a great first impression.</p>

      <h2>5. Bạn có nói tiếng Anh không? (Ban gaw noy tyeng Ang kong?) - Do you speak English?</h2>
      <p>While it's great to practice Vietnamese, sometimes you might need help. This phrase can be a lifesaver when you're stuck.</p>

      <h2>6. Bao nhiêu tiền? (Bow nyew tyen?) - How much does it cost?</h2>
      <p>Essential for shopping and dining out. Knowing this phrase helps you understand prices and budget accordingly.</p>

      <h2>7. Toilet ở đâu? (Toilet uh dow?) - Where is the bathroom?</h2>
      <p>A practical phrase that you'll definitely need at some point during your travels or stay in Vietnam.</p>

      <h2>8. Tôi không hiểu (Toy kong hyu) - I don't understand</h2>
      <p>Don't be afraid to admit when you don't understand something. This phrase shows you're learning and willing to try.</p>

      <h2>9. Giúp tôi với (Joop toy voy) - Help me please</h2>
      <p>In case of emergency or when you need assistance, this phrase is crucial to know.</p>

      <h2>10. Rất vui được gặp bạn (Rat voo-ee duoc gap ban) - Nice to meet you</h2>
      <p>A polite phrase to use when meeting someone for the first time. It shows respect and friendliness.</p>

      <h2>Practice Makes Perfect</h2>
      <p>Remember, learning these phrases is just the beginning. The key to mastering Vietnamese is consistent practice and immersion. Try to use these phrases in real conversations, even if you make mistakes. Vietnamese people are generally very patient and appreciative when foreigners try to speak their language.</p>

      <h2>Next Steps</h2>
      <p>Now that you know these essential phrases, consider:</p>
      <ul>
        <li>Practicing pronunciation with native speakers</li>
        <li>Watching Vietnamese videos to hear these phrases in context</li>
        <li>Joining language exchange groups to practice regularly</li>
        <li>Taking structured lessons to build on this foundation</li>
      </ul>

      <p>Want to learn more? Check out my comprehensive Vietnamese courses or book a one-on-one lesson to accelerate your learning!</p>
    `,
    category: "Beginner",
    author: "POV Vietnamese",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    tags: ["beginner", "phrases", "pronunciation", "basics"]
  }
}

const relatedPosts = [
  {
    id: 2,
    title: "Understanding Vietnamese Tones: A Complete Guide",
    category: "Pronunciation"
  },
  {
    id: 4,
    title: "Common Mistakes English Speakers Make in Vietnamese",
    category: "Tips"
  },
  {
    id: 5,
    title: "How to Practice Vietnamese Listening Skills",
    category: "Learning Tips"
  }
]

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = getBlogPost(params.id)

  return (
    <div className="min-h-screen pt-16">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/blog" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-medium">{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={18} />
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={18} />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex gap-4 mb-8 pb-8 border-b">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <Share2 size={18} />
            Share
          </button>
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              P
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
              <p className="text-gray-600 mb-4">
                Passionate Vietnamese language teacher with 15K+ Instagram followers.
                Helping students worldwide master Vietnamese through engaging lessons and cultural insights.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/courses"
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  View Courses
                </Link>
                <Link
                  href="/booking"
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Book a Lesson
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.id}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                  {relatedPost.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-4">
                  {relatedPost.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-indigo-600 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want More Learning Tips?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Get weekly Vietnamese lessons and exclusive content delivered to your inbox
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
    </div>
  )
}
