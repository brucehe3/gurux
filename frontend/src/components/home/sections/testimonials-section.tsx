"use client";

import { FadeIn, ScaleIn } from "@/components/ui/motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "GuruX transformed how I learn. The personalized approach helped me master complex topics in half the time it would've taken with traditional methods.",
    name: "Sarah J.",
    role: "Software Engineer",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=150&h=150"
  },
  {
    quote: "The AI tutor is like having a personal teacher available 24/7. It's patient, knowledgeable, and explains things in a way that just clicks for me.",
    name: "Michael R.",
    role: "Business Student",
    avatar: "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=150&h=150"
  },
  {
    quote: "I've tried many learning platforms, but none compare to GuruX. The way it adapts to my learning style and provides relevant resources is incredible.",
    name: "Priya K.",
    role: "Data Scientist",
    avatar: "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=150&h=150"
  },
  {
    quote: "As a teacher, I use GuruX to supplement my curriculum. My students are more engaged and showing better results than ever before.",
    name: "David L.",
    role: "High School Teacher",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=150&h=150"
  },
  {
    quote: "The progress tracking feature keeps me motivated. Seeing my growth visually mapped out pushes me to keep going even when topics get challenging.",
    name: "Emma S.",
    role: "Medical Student",
    avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=150&h=150"
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <FadeIn>
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Join thousands of satisfied learners who have accelerated their 
              education with our AI-powered platform.
            </p>
          </div>
        </FadeIn>

        <ScaleIn>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border bg-card">
                    <CardContent className="p-6 flex flex-col h-full">
                      <Quote className="h-6 w-6 text-chart-1 mb-4" />
                      <p className="text-muted-foreground flex-1 mb-4">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="relative static translate-y-0 translate-x-0" />
              <CarouselNext className="relative static translate-y-0 translate-x-0" />
            </div>
          </Carousel>
        </ScaleIn>
      </div>
    </section>
  );
}