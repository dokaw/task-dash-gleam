
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Shield, 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Globe,
  Heart
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  const { user } = useAuth();

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "Found an amazing handyman within hours! The platform made it so easy to compare proposals and choose the right person.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Mike Chen",
      role: "Freelance Designer",
      content: "As a tasker, this platform has been incredible for finding consistent work. The payment system is reliable and clients are great.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Emma Davis",
      role: "Small Business Owner",
      content: "Saved me hours of searching for reliable help. The quality of taskers on this platform is outstanding!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: ["Post up to 3 tasks/month", "Basic support", "Standard matching"],
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99/mo",
      description: "For regular task posters",
      features: ["Unlimited tasks", "Priority support", "Advanced matching", "Featured listings"],
      popular: true
    },
    {
      name: "Business",
      price: "$29.99/mo",
      description: "For businesses and teams",
      features: ["Everything in Pro", "Team management", "Analytics dashboard", "Custom branding"],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How do I get started?",
      answer: "Simply sign up, post your task with details, and start receiving proposals from qualified taskers in your area."
    },
    {
      question: "Is payment secure?",
      answer: "Yes! We use industry-standard encryption and secure payment processing. Money is held in escrow until work is completed."
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer: "We offer a satisfaction guarantee. If you're not happy with the completed work, we'll help resolve the issue or provide a refund."
    },
    {
      question: "How are taskers vetted?",
      answer: "All taskers go through identity verification, background checks, and skill assessments before joining our platform."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section - Enhanced */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
              🚀 Trusted by 50,000+ users worldwide
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              Your Tasks, Our Experts
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with skilled professionals in your area. From home repairs to digital services, 
              get quality work done quickly and affordably.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/browse">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg group">
                  <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Explore Tasks
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              {user ? (
                <Link to="/post-task">
                  <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Post Your Task
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">1M+</div>
                <div className="text-gray-600">Tasks Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Redesigned */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TaskHub?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the easiest way to get things done with our innovative platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Smart Matching</CardTitle>
              <CardDescription className="text-lg">
                Our AI-powered system connects you with the perfect tasker based on skills, location, and availability
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Secure & Safe</CardTitle>
              <CardDescription className="text-lg">
                All taskers are verified with background checks, insurance coverage, and secure payment protection
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Lightning Fast</CardTitle>
              <CardDescription className="text-lg">
                Get proposals within minutes and have your task completed in record time with our efficient process
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <Clock className="h-6 w-6 text-blue-600" />
            <span className="font-medium">24/7 Support</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <Users className="h-6 w-6 text-green-600" />
            <span className="font-medium">Verified Professionals</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <Globe className="h-6 w-6 text-purple-600" />
            <span className="font-medium">Global Coverage</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <Heart className="h-6 w-6 text-red-600" />
            <span className="font-medium">100% Satisfaction</span>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who trust TaskHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${
              plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''
            }`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-blue-600 my-4">{plan.price}</div>
                <CardDescription className="text-lg">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* User Dashboard Quick Links */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back, {user.email}!</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/post-task">
                <Card className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <Plus className="h-12 w-12 text-white mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-white mb-2">Post New Task</h3>
                    <p className="text-blue-100">Get help with your next project</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/offers">
                <Card className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-white mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-white mb-2">View Offers</h3>
                    <p className="text-blue-100">Review proposals from taskers</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/browse">
                <Card className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <Search className="h-12 w-12 text-white mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-white mb-2">Find Work</h3>
                    <p className="text-blue-100">Browse available tasks</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and start getting things done today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Sign Up Free
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg">
                Browse Tasks
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
