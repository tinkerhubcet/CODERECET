'use client'
import React from 'react';
import { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Pill, 
  ShoppingCart, 
  FileText, 
  Activity, 
  Phone,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Doctor Appointment Automation",
      description: "Seamless scheduling and smart reminders through healthcare API integrations with n8n workflows."
    },
    {
      icon: Pill,
      title: "Smart Prescription Parsing",
      description: "AI-powered OCR and NLP models that extract, interpret, and validate prescription details automatically."
    },
    {
      icon: ShoppingCart,
      title: "Automated Medicine Ordering",
      description: "Integrated e-pharmacy platforms with real-time logistics tracking for hassle-free medication management."
    },
    {
      icon: FileText,
      title: "Health Report Intelligence",
      description: "ML-driven analysis generating personalized diet recommendations and predictive diagnostic insights."
    },
    {
      icon: Activity,
      title: "Adaptive Workout Planning",
      description: "Context-aware exercise suggestions tailored to individual health data and mobility constraints."
    },
    {
      icon: Phone,
      title: "Emergency Response System",
      description: "Instant multichannel notifications to caregivers and emergency services via SMS, calls, and app alerts."
    }
  ];

  const benefits = [
    "24/7 AI-powered health monitoring",
    "Reduced caregiver burden",
    "Improved medication adherence",
    "Proactive health management",
    "Emergency response coordination",
    "Personalized care recommendations"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Vitalis</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">Benefits</a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</a>
                <a href="#benefits" className="text-gray-600 hover:text-blue-600">Benefits</a>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                AI-Powered 
                <span className="text-blue-600 block">Wellness Care</span>
                for Seniors
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Comprehensive virtual care assistant that helps elderly individuals maintain their wellness through intelligent automation, health monitoring, and emergency response systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">HIPAA Compliant</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">24/7 Monitoring</span>
                </div>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Health Status</h3>
                    <p className="text-green-600">All systems normal</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Next Appointment</span>
                    <span className="font-semibold">Dr. Smith - Tomorrow 2PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Medications</span>
                    <span className="text-green-600 font-semibold">✓ On schedule</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Activity Goal</span>
                    <span className="text-blue-600 font-semibold">75% Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Care Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides complete wellness management through advanced automation and intelligent monitoring systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                      <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How Vitalis Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple setup, intelligent automation, and continuous care monitoring for complete peace of mind.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Setup & Integration</h3>
              <p className="text-gray-600">
                Connect your healthcare providers, pharmacies, and emergency contacts through our secure n8n workflow integration.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Learning</h3>
              <p className="text-gray-600">
                Our ML models learn your health patterns, preferences, and routines to provide personalized care recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Continuous Care</h3>
              <p className="text-gray-600">
                24/7 monitoring, automated reminders, and instant emergency response ensure comprehensive wellness management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Vitalis?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Empowering seniors with intelligent care management while providing families peace of mind through comprehensive health monitoring and automated assistance.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-3">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900">Trusted by 10,000+ Families</span>
                </div>
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.9/5 average rating</span>
                </div>
              </div>
            </div>

            <div className="lg:pl-12">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-2xl">
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Medication Adherence</span>
                      <span className="text-green-600 font-semibold">+47%</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Emergency Response Time</span>
                      <span className="text-blue-600 font-semibold">-73%</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Caregiver Stress Reduction</span>
                      <span className="text-purple-600 font-semibold">-56%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Elder Care?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of families who trust Vitalis for comprehensive wellness management and peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
              Start 30-Day Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required • HIPAA compliant • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Vitalis</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering seniors with AI-powered wellness management and providing families with peace of mind through comprehensive healthcare automation.
              </p>
              <div className="flex items-center space-x-4">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-400">HIPAA Compliant & Secure</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Vitalis. All rights reserved. Dedicated to improving senior wellness through intelligent automation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;