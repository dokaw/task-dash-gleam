
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, DollarSign, MessageSquare, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

// Demo data for offers
const demoOffers = [
  {
    id: "1",
    task: {
      title: "Logo Design for Tech Startup",
      category: "Design"
    },
    profiles: {
      full_name: "Sarah Johnson",
      email: "sarah.j@example.com"
    },
    amount: 150,
    timeline: "1-week",
    message: "I'm a professional graphic designer with 5+ years of experience in logo design. I've worked with numerous startups and understand the importance of creating a memorable brand identity. I'll provide 3 initial concepts and unlimited revisions until you're satisfied.",
    status: "pending",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    task: {
      title: "Website Development for Restaurant",
      category: "Web Development"
    },
    profiles: {
      full_name: "Mike Chen",
      email: "mike.chen@example.com"
    },
    amount: 800,
    timeline: "2-weeks",
    message: "Full-stack developer with expertise in React and Node.js. I'll create a responsive website with online ordering system, menu management, and customer reviews. Includes hosting setup and 3 months of free support.",
    status: "accepted",
    created_at: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    task: {
      title: "Content Writing for Blog",
      category: "Writing"
    },
    profiles: {
      full_name: "Emily Rodriguez",
      email: "emily.r@example.com"
    },
    amount: 75,
    timeline: "1-3-days",
    message: "Experienced content writer specializing in tech and business topics. I'll deliver 10 well-researched blog posts (800-1000 words each) with SEO optimization and engaging headlines.",
    status: "rejected",
    created_at: "2024-01-13T09:20:00Z"
  },
  {
    id: "4",
    task: {
      title: "Mobile App UI/UX Design",
      category: "Design"
    },
    profiles: {
      full_name: "Alex Thompson",
      email: "alex.t@example.com"
    },
    amount: 450,
    timeline: "1-month",
    message: "UI/UX designer with a focus on mobile applications. I'll create wireframes, user journey maps, and high-fidelity mockups for your iOS and Android app. Includes interactive prototype and design system.",
    status: "pending",
    created_at: "2024-01-12T14:10:00Z"
  }
];

const DemoOffers = () => {
  const getTimelineDisplay = (timeline: string) => {
    const timelineMap: { [key: string]: string } = {
      'asap': 'As soon as possible',
      '1-3-days': '1-3 days',
      '1-week': 'Within 1 week',
      '2-weeks': 'Within 2 weeks',
      '1-month': 'Within 1 month',
      'flexible': 'Flexible'
    };
    return timelineMap[timeline] || timeline;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const proposalDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - proposalDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Demo: Offers & Proposals</h1>
          <p className="text-gray-600 mt-2">Preview of how proposals from interested taskers appear ({demoOffers.length} sample offers)</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Demo Page:</strong> This shows sample proposal data. In the real app, this data comes from your actual tasks and submitted proposals.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {demoOffers.map((offer) => (
            <Card key={offer.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {offer.profiles.full_name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {offer.profiles.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(offer.status)}
                    <span className="text-sm text-gray-500">{getTimeAgo(offer.created_at)}</span>
                  </div>
                </div>
                
                {/* Task Information */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span className="font-medium">Task:</span>
                    <span>{offer.task.title}</span>
                    <Badge variant="outline" className="ml-2">
                      {offer.task.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">${offer.amount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{getTimelineDisplay(offer.timeline)}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Proposal Message:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {offer.message}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {offer.status === 'pending' && (
                    <div className="flex space-x-3">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Accept Proposal
                      </Button>
                      <Button variant="outline">
                        Reject
                      </Button>
                    </div>
                  )}
                  {offer.status === 'accepted' && (
                    <div className="text-green-600 font-medium">
                      ✓ This proposal has been accepted
                    </div>
                  )}
                  {offer.status === 'rejected' && (
                    <div className="text-red-600 font-medium">
                      ✗ This proposal was rejected
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoOffers;
