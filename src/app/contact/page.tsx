'use client';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <section className="min-h-screen py-20 bg-gray-50 dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Contact Me
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
} 