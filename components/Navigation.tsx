'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              POV Vietnamese
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition">
              About
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-indigo-600 transition">
              Blog
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-indigo-600 transition">
              Courses
            </Link>
            <Link href="/booking" className="text-gray-700 hover:text-indigo-600 transition">
              Book a Class
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-indigo-600 transition">
              Community
            </Link>
            <Link
              href="/auth/signin"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-700 hover:text-indigo-600 transition py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-indigo-600 transition py-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-indigo-600 transition py-2"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/courses"
                className="text-gray-700 hover:text-indigo-600 transition py-2"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/booking"
                className="text-gray-700 hover:text-indigo-600 transition py-2"
                onClick={() => setIsOpen(false)}
              >
                Book a Class
              </Link>
              <Link
                href="/community"
                className="text-gray-700 hover:text-indigo-600 transition py-2"
                onClick={() => setIsOpen(false)}
              >
                Community
              </Link>
              <Link
                href="/auth/signin"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
