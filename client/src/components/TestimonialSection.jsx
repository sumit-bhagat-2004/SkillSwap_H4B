import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "SkillSwap helped me learn graphic design in exchange for teaching Python. The matching algorithm found me the perfect partner!",
    author: "Alex Johnson",
    role: "Software Developer",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    content:
      "I've always wanted to learn photography but couldn't afford classes. Through SkillSwap, I exchanged my marketing expertise for photography lessons.",
    author: "Maya Patel",
    role: "Marketing Specialist",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    content:
      "The platform is intuitive and the skill matching is spot on. I've been able to expand my skill set without spending a dime!",
    author: "Carlos Rodriguez",
    role: "UX Designer",
    avatar:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

const TestimonialSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-teal-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Hear from our community
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how SkillSwap has helped people learn new skills and make
            meaningful connections.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={testimonial.avatar}
                  alt={testimonial.author}
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    {testimonial.author}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
