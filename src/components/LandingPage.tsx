import { DarkLandingPage } from './DarkLandingPage';
import { SEO } from './SEO';

interface LandingPageProps {
  user?: any;
}

export const LandingPage = ({ user }: LandingPageProps) => {
  return (
    <>
      <SEO 
        title="CallGenie - AI-Powered Voice Assistant | Transform Your Phone Communications"
        description="Get your AI phone assistant in 60 seconds. CallGenie provides intelligent voice conversations, 24/7 availability, and natural language processing. Try free for 7 days - no credit card required."
        keywords="AI voice assistant, phone automation, voice AI, call handling, business phone system, artificial intelligence, voice recognition, automated calling, customer service AI, phone bot"
        url="https://callgenie.ai"
      />
      <DarkLandingPage user={user} />
    </>
  );
};
