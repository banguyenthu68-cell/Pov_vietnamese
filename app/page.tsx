import Link from 'next/link'
import { BookOpen, Video, Users, Calendar } from 'lucide-react'
import NewsletterForm from '@/components/NewsletterForm'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn Vietnamese with
              <span className="text-indigo-600"> POV Vietnamese</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Master Vietnamese language and culture through engaging lessons, interactive courses,
              and a supportive community of learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
              >
                Explore Courses
              </Link>
              <Link
                href="/booking"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-indigo-600"
              >
                Book a Class
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">15K+</div>
              <div className="text-gray-600">Instagram Followers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-gray-600">Students Taught</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">5★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Everything You Need to Learn Vietnamese
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Choose from multiple learning options tailored to your schedule and learning style
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">One-on-One Classes</h3>
              <p className="text-gray-600 mb-4">
                Personalized lessons tailored to your learning goals and pace
              </p>
              <Link href="/booking" className="text-indigo-600 font-medium hover:text-indigo-700">
                Book Now →
              </Link>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Video Courses</h3>
              <p className="text-gray-600 mb-4">
                Self-paced courses covering beginner to advanced topics
              </p>
              <Link href="/courses" className="text-indigo-600 font-medium hover:text-indigo-700">
                Browse Courses →
              </Link>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Community</h3>
              <p className="text-gray-600 mb-4">
                Connect with fellow learners and practice together
              </p>
              <Link href="/community" className="text-indigo-600 font-medium hover:text-indigo-700">
                Join Community →
              </Link>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Blog & Resources</h3>
              <p className="text-gray-600 mb-4">
                Free articles, tips, and cultural insights
              </p>
              <Link href="/blog" className="text-indigo-600 font-medium hover:text-indigo-700">
                Read Blog →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About Your Teacher
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Hi! I'm the founder of POV Vietnamese, and I'm passionate about helping people
                connect with Vietnamese language and culture. With over 15,000 followers on
                Instagram, I've helped thousands of students achieve their language learning goals.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                My teaching approach combines traditional methods with modern techniques, making
                learning Vietnamese accessible, engaging, and fun. Whether you're a complete beginner
                or looking to refine your skills, I'm here to guide you every step of the way.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                From one-on-one personalized lessons to comprehensive video courses, I offer
                flexible learning options that fit your schedule and learning style.
              </p>
              <Link
                href="/about"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Learn More About Me
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold">
                  POV
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Vietnamese Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students learning Vietnamese with personalized guidance and support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Courses
            </Link>
            <Link
              href="/booking"
              className="bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-800 transition border-2 border-white"
            >
              Schedule a Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Free Vietnamese Learning Tips
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to my newsletter for weekly lessons, cultural insights, and exclusive content
          </p>
          <NewsletterForm variant="inline" className="max-w-md mx-auto" />
        </div>
      </section>
    </div>
  )
}
