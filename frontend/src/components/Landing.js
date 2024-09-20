import React from "react";
import { Link } from "react-router-dom";
import { FiEdit3, FiShare2, FiLock } from "react-icons/fi";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container px-6 py-12 mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-6xl">
            Capture Ideas, Collaborate Seamlessly
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Notemesh is your all-in-one solution for note-taking, idea
            organization, and team collaboration. Simple, secure, and designed
            for modern thinkers.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 mt-8 text-lg font-semibold text-white transition duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Get Started Free
          </Link>
        </div>

        <div className="grid gap-8 mb-12 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <FiEdit3 className="w-12 h-12 mb-4 text-indigo-600" />
            <h3 className="mb-2 text-xl font-semibold">
              Effortless Note-Taking
            </h3>
            <p className="text-gray-600">
              Jot down your thoughts quickly and easily with our intuitive
              interface.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <FiShare2 className="w-12 h-12 mb-4 text-indigo-600" />
            <h3 className="mb-2 text-xl font-semibold">Seamless Sharing</h3>
            <p className="text-gray-600">
              Collaborate with your team in real-time, share ideas, and boost
              productivity.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <FiLock className="w-12 h-12 mb-4 text-indigo-600" />
            <h3 className="mb-2 text-xl font-semibold">Secure and Private</h3>
            <p className="text-gray-600">
              Your notes are encrypted and protected. Your privacy is our top
              priority.
            </p>
          </div>
        </div>

        {/* <div className="p-8 text-center bg-gray-100 rounded-lg">
          <h2 className="mb-4 text-3xl font-bold">
            Join thousands of satisfied users
          </h2>
          <p className="mb-6 text-xl text-gray-600">
            "Notemesh has revolutionized the way our team collaborates. It's
            simple, powerful, and indispensable."
          </p>
          <p className="font-semibold">
            - Sarah Johnson, Product Manager at TechCorp
          </p>
        </div> */}
      </main>

      <footer className="py-8 text-white bg-gray-800">
        <div className="container px-6 mx-auto text-center">
          <p>&copy; 2024 Notemesh. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="mx-2 text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="mx-2 text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="mx-2 text-gray-400 hover:text-white">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
