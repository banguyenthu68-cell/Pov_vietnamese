import Link from 'next/link'
import { Instagram, Mail, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-2xl font-bold mb-4">POV Vietnamese</h3>
            <p className="text-gray-400 mb-4">
              Learn Vietnamese language and culture with personalized lessons and engaging courses.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/pov_vietnamese"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://youtube.com/@pov_vietnamese"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <Youtube size={24} />
              </a>
              <a
                href="mailto:contact@povvietnamese.com"
                className="hover:text-white transition"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="text-white font-semibold mb-4">Learning</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="hover:text-white transition">
                  Video Courses
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white transition">
                  Book a Class
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition">
                  Free Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} POV Vietnamese. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
