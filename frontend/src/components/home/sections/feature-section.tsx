import { SectionHeader } from '@/components/home/section-header';
import { Feature as FeatureComponent } from '@/components/home/ui/feature-slideshow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";
import { 
  Brain, 
  BarChart, 
  BookOpen, 
  Calendar, 
  Compass, 
  MessageSquare, 
  Sparkles, 
  Target 
} from "lucide-react";
import { siteConfig } from '@/lib/home';

export function FeatureSection() {
  const { title, description, items } = siteConfig.featureSection;


  const features = [
    {
      icon: <Brain className="h-10 w-10 text-chart-1" />,
      title: "Personalized Learning",
      description: "AI creates custom learning paths based on your goals, interests, and learning style."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-chart-2" />,
      title: "Resource Curation",
      description: "Hand-picked articles, videos, and exercises from the best educational sources."
    },
    {
      icon: <Sparkles className="h-10 w-10 text-chart-3" />,
      title: "Interactive Exercises",
      description: "Practice what you learn with AI-generated exercises tailored to your skill level."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-chart-4" />,
      title: "AI Tutoring",
      description: "Get help anytime with our AI tutor that explains concepts clearly and answers questions."
    },
    {
      icon: <BarChart className="h-10 w-10 text-chart-5" />,
      title: "Progress Tracking",
      description: "Visualize your learning journey with detailed analytics and milestone tracking."
    },
    {
      icon: <Compass className="h-10 w-10 text-chart-1" />,
      title: "Discovery Mode",
      description: "Explore related topics and expand your knowledge beyond your initial learning goals."
    },
    {
      icon: <Target className="h-10 w-10 text-chart-2" />,
      title: "Goal Setting",
      description: "Set specific learning objectives and track your progress toward achieving them."
    },
    {
      icon: <Calendar className="h-10 w-10 text-chart-3" />,
      title: "Study Scheduling",
      description: "AI creates optimal study schedules based on your availability and learning preferences."
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <FadeIn>
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Features to Accelerate Your Learning
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Our platform combines AI technology with proven learning methodologies to
              help you master any subject efficiently.
            </p>
          </div>
        </FadeIn>
        <FadeInStagger>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FadeInStaggerItem key={index}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="p-2 w-fit rounded-lg bg-primary/5">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </FadeInStaggerItem>
            ))}
          </div>

        </FadeInStagger>
      </div>
    </section>

  );
}