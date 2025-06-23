import { IconPeopleLike } from "@central-icons-react/round-filled-radius-2-stroke-1.5/IconPeopleLike";
import Image from "next/image";
import * as React from "react";
import { Card } from "~/components/ui/card";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="p-5 flex flex-col gap-8 h-fit">
      <p className="text-white/70 text-base leading-6 tracking-[0.16px]">
        {testimonial.content}
      </p>
      <div className="bg-white/12 rounded-[40px] px-2.5 py-[3px] pl-[3px] w-fit">
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-[18px] relative">
            <Image
              src={testimonial.author.avatar}
              alt={testimonial.author.name}
              width={19}
              height={19}
              className="rounded-full"
            />
          </div>
          <span className="text-white text-sm font-normal tracking-[-0.14px]">
            {testimonial.author.name}
          </span>
        </div>
      </div>
    </Card>
  );
};

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      content:
        '"NotCMS rocks! 🚀 Effortless setup, seamless integration, and top-notch performance. The perfect solution for modern content management."',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "2",
      content:
        '"Loving NotCMS! Headless, flexible, and easy to use. Makes managing content a breeze. Highly recommend!"',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "3",
      content:
        '"NotCMS rocks! 🚀 Effortless setup, seamless integration, and top-notch performance. The perfect solution for modern content management. Would highly recommend for anyone who has a small team and website."',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "4",
      content:
        '"NotCMS rocks! 🚀 Effortless setup, seamless integration, and top-notch performance. The perfect solution for modern content management. Would highly recommend for anyone who has a small team and website."',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "5",
      content:
        '"Loving NotCMS! Headless, flexible, and easy to use. Makes managing content a breeze. Highly recommend!"',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "6",
      content:
        '"Loving NotCMS! Headless, flexible, and easy to use. Makes managing content a breeze. Highly recommend!"',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "7",
      content:
        '"NotCMS rocks! 🚀 Effortless setup, seamless integration, and top-notch performance. The perfect solution for modern content management."',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "8",
      content:
        '"Loving NotCMS! Headless, flexible, and easy to use. Makes managing content a breeze. Highly recommend!"',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "9",
      content:
        '"NotCMS rocks! 🚀 Effortless setup, seamless integration, and top-notch performance. The perfect solution for modern content management. Would highly recommend for anyone who has a small team and website."',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "10",
      content:
        '"NotCMS rocks! 🚀 Effortless setup, seamless integration, and top-notch performance. The perfect solution for modern content management."',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "11",
      content:
        '"Loving NotCMS! Headless, flexible, and easy to use. Makes managing content a breeze. Highly recommend!"',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
    {
      id: "12",
      content:
        '"NotCMS rocks! 🚀 Effortless setup, seamless integration, and top-notch performance. The perfect solution for modern content management. Would highly recommend for anyone who has a small team and website."',
      author: {
        name: "Jason Tennyson",
        avatar: "/img/home/sample-profile-icon.png",
      },
    },
  ];

  // Split testimonials into 4 columns
  const columns = [
    testimonials.slice(0, 3),
    testimonials.slice(3, 6),
    testimonials.slice(6, 9),
    testimonials.slice(9, 12),
  ];

  return (
    <Section
      className="relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(255, 255, 255, 0.02) 80%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <SectionHeader>
        <SectionPreTitle>
          <IconPeopleLike className="size-3" />
          Testimonials
        </SectionPreTitle>
        <SectionTitle>Writers & teams love us!</SectionTitle>
      </SectionHeader>

      {/* Testimonials Grid */}
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={`flex flex-col gap-5 ${
                columnIndex === 0 ? "justify-center" : ""
              } ${columnIndex === 1 ? "justify-start" : ""} ${
                columnIndex === 2 ? "justify-center" : ""
              } ${columnIndex === 3 ? "justify-center" : ""}`}
            >
              {column.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
