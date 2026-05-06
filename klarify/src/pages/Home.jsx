import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, BookOpen, Target, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

const PersonaCard = ({ icon: Icon, title, description, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={`
        relative overflow-hidden p-6 rounded-2xl border text-left transition-all duration-300 h-full flex flex-col
        ${active 
          ? 'bg-white border-slate-200 hover:border-orange-500 hover:shadow-lg group' 
          : 'bg-slate-50 border-transparent opacity-60 cursor-not-allowed'
        }
      `}
    >
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors shrink-0
        ${active ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white' : 'bg-slate-200 text-slate-400'}
      `}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 flex-1">{description}</p>
      
      {!active && (
        <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] uppercase font-bold px-2 py-1 rounded-md">
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

  return (
    <Layout noPadding={true}>
      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            AI-Powered Recommendations
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Find the Right <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Academic Path</span> for You
          </h1>
          
          <p className="text-lg text-slate-600 mb-12 max-w-2xl">
            Get personalized university and career recommendations based on your subjects and interests. Select your profile to begin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <PersonaCard 
              icon={GraduationCap}
              title="A/L Student"
              description="High school students preparing for university entrance and selecting degree programs."
              active={true}
              onClick={() => navigate('/flow')}
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
      </section>

      {/* Why Use Klarify Section */}
      <section className="bg-slate-900 py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why use Klarify?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We take the guesswork out of your future by using advanced AI to map your current skills to the perfect opportunities.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">A simple, 3-step process to discover your ideal academic journey.</p>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to find your path?</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already discovered their ideal university programs and careers with Klarify.
          </p>
          <button 
            onClick={() => navigate('/flow')}
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
