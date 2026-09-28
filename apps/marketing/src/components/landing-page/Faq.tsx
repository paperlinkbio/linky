'use client';

import { buildFaqSchema, serializeJsonLd } from '@trylinky/seo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@trylinky/ui';

const landingPageQuestions = [
  {
    question: 'What is Linky?',
    answer:
      'Linky is an open-source link-in-bio builder. You get one link, like lin.ky/yourname, for your Instagram, TikTok or YouTube bio. It opens a page built from blocks: links, plus live content such as what you are playing on Spotify and your latest Instagram and TikTok posts. It is free to start, and Premium ($4 per month) adds custom domains, analytics and unlimited blocks.',
  },
  {
    question: 'What does link in bio mean?',
    answer:
      "A link in bio is a single link that you can use to house all of the links that you want to share with your audience. Whether you're a creator sharing links to your social media profiles, or a business sharing links to your products and services, a link in bio is a great way to share all your content in one place.",
  },
  {
    question: 'Why do I need Linky?',
    answer:
      'Linky is a singular link solution designed to bridge your audience to every aspect of your digital presence-encompassing who you are, what you do, and what matters to you. It simplifies the sharing process by consolidating multiple links into one, ensuring that your followers, visitors, and customers can effortlessly access all they need in a single location.',
  },
  {
    question: 'Is it free?',
    answer:
      'Yes. Every account starts with 14 days of Premium, no card needed. After that your page stays live on the Free plan with one page and up to five blocks. Premium is $4 per month and adds unlimited pages and blocks, analytics, private pages, a verified badge and custom domains.',
  },
  {
    question: 'Can I use my own domain?',
    answer:
      'Yes. Custom domains are included in Premium ($4 per month) and Team. Email team@lin.ky with your page and domain and we will connect it for you, and your lin.ky link will redirect to it.',
  },
];

const pricingQuestions = [
  {
    question: 'What is Linky?',
    answer:
      'Linky is an open-source link-in-bio builder. You get one link, like lin.ky/yourname, for your Instagram, TikTok or YouTube bio. It opens a page built from blocks: links, plus live content such as what you are playing on Spotify and your latest Instagram and TikTok posts. It is free to start, and Premium ($4 per month) adds custom domains, analytics and unlimited blocks.',
  },
  {
    question: 'Do you offer yearly pricing?',
    answer:
      'For teams that require a more tailored solution, we are happy to offer a more custom billing solution. Please reach out to us to discuss your needs.',
  },
  {
    question: 'I am an agency, can I use Linky for my clients?',
    answer:
      "Yes, you can use Linky for your clients. You would be best suited for the team plan where you can invite your teammates to manage your clients' pages. We also offer the ability to create separate team spaces for each of your clients, where you can manage their pages. Please reach out to us to discuss your needs.",
  },
  {
    question: 'What methods of payment do you support?',
    answer:
      'We use Stripe as our payment processor. They support all major credit cards, as well as a number of other country specific payment methods.',
  },
];

const questionSets: Record<string, typeof landingPageQuestions> = {
  'landing-page': landingPageQuestions,
  pricing: pricingQuestions,
};

export function FrequentlyAskedQuestions({
  questionSet,
}: {
  questionSet: 'landing-page' | 'pricing';
}) {
  const questions = questionSets[questionSet];

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {questions.map((question) => {
          return (
            <AccordionItem key={question.question} value={question.question}>
              <AccordionTrigger className="text-lg font-medium">
                {question.question}
              </AccordionTrigger>
              <AccordionContent forceMount className="text-lg text-black/60">
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildFaqSchema(questions)),
        }}
      />
    </>
  );
}
