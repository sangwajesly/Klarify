import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  BookOpen,
  Target,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Layout from "../components/Layout";
import heroBg from "../assets/hero.jpg";

const PersonaCard = ({ icon: Icon, title, description, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={`
        relative overflow-hidden p-6 rounded-2xl border text-left transition-all duration-300 h-full flex flex-col backdrop-blur-sm
        ${
          active
            ? "bg-white/10 border-white/30 hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-500/20 group hover:bg-white/15"
            : "bg-white/5 border-white/10 opacity-60 cursor-not-allowed"
        }
      `}
    >
      <div
        className={`
        w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors shrink-0
        ${active ? "bg-orange-500/30 text-orange-300 group-hover:bg-orange-500 group-hover:text-white" : "bg-white/10 text-white/40"}
      `}
      >
        <Icon size={24} />
      </div>
      <h3
        className={`text-lg font-bold mb-2 ${active ? "text-white" : "text-slate-300"}`}
      >
        {title}
      </h3>
      <p
        className={`text-sm flex-1 ${active ? "text-slate-200" : "text-slate-400"}`}
      >
        {description}
      </p>

      {!active && (
        <div className="absolute top-4 right-4 bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md backdrop-blur-sm">
          Coming Soon
        </div>
      )}
    </button>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
    <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

const StepComponent = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center relative">
    <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold mb-6 z-10 relative border-4 border-white shadow-sm">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [text, setText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [loopNum, setLoopNum] = React.useState(0);
  const [typingSpeed, setTypingSpeed] = React.useState(150);

  const words = ["Academic", "Career"];

  React.useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1),
      );

      setTypingSpeed(isDeleting ? 80 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <Layout noPadding={true}>
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background with gradient and shapes */}
        <div className="absolute inset-0 z-0">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundAttachment: "fixed",
            }}
          ></div>

          {/* Main gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/92 via-slate-900/88 to-slate-900/92"></div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/25 via-transparent to-blue-500/15 opacity-80"></div>

          {/* Decorative blobs */}
          <div className="absolute top-20 -left-40 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-12 py-16 md:py-24 max-w-5xl mx-auto w-full">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 hover:bg-white/15 transition-all">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Klarify Your Future
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight min-h-[3.5em] md:min-h-0">
              Find the Right <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
                {text}
              </span>
              <span className="text-orange-400 animate-pulse font-light">
                |
              </span>
              <br className="md:hidden" /> Path for You
            </h1>

            <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl leading-relaxed">
              Get personalized university and career recommendations based on
              your subjects and interests. Select your profile to begin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <PersonaCard
                icon={GraduationCap}
                title="A/L Student"
                description="High school students preparing for university entrance and selecting degree programs."
                active={true}
                onClick={() => navigate("/flow")}
              />
              
              <PersonaCard
                icon={User}
                title="University Student"
                description="Current undergrads looking for masters programs or career paths."
                active={false}
              />
              <PersonaCard
                icon={BookOpen}
                title="Self Learner"
                description="Professionals looking to switch careers or learn new skills independently."
                active={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* GCE Results CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-accent-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Check Your GCE Results In Seconds
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
            Whether O/L or A/L or TVE, get your results instantly and see how they align with your academic and career goals.
          </p>
          <button
            onClick={() => navigate("/gce-results")}
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-orange-500/20"
          >
            Check Results Now
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Why Use Klarify Section */}
      <section className="bg-slate-900 py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why use Klarify?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We take the guesswork out of your future by using advanced AI to
              map your current skills to the perfect opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Target}
              title="Highly Accurate"
              description="Our recommendation engine matches your unique A/L subjects and personal interests with real-world university programs."
            />
            <FeatureCard
              icon={Zap}
              title="Fast & Guided"
              description="No more scrolling through endless university prospectuses. Get tailored results in less than 2 minutes."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Comprehensive"
              description="We don't just suggest degrees. We provide the exam details, certifications, and books you need to succeed."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              A simple, 3-step process to discover your ideal academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-orange-100 z-0"></div>

            <StepComponent
              number="1"
              title="Tell us your background"
              description="Select the A/L subjects you have studied or are currently studying."
            />
            <StepComponent
              number="2"
              title="Share your interests"
              description="Describe what fields, careers, or topics you are passionate about."
            />
            <StepComponent
              number="3"
              title="Get your path"
              description="Instantly receive a curated list of degrees, certifications, and resources."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to find your path?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already discovered their ideal
            university programs and careers with Klarify.
          </p>
          <button
            onClick={() => navigate("/flow")}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-slate-900/20"
          >
            Start Your Free Assessment
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
