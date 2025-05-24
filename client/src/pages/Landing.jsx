import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Icons (you can replace these with actual icons from your preferred library)
const FeatureCard = ({ icon, title, description }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 },
      }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-[#1c1c24] border border-[#3a3a43] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#4caf50]"
    >
      <div className="text-4xl mb-4 text-[#8c6dfd]">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-[#808191]">{description}</p>
    </motion.div>
  );
};

const Landing = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Section divider component
  const SectionDivider = () => (
    <div className="h-1 bg-gradient-to-r from-transparent via-[#8c6dfd] to-transparent my-16 w-full max-w-4xl mx-auto" />
  );

  return (
    <div className="min-h-screen bg-[#13131a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#1c1c24] border-b border-[#3a3a43]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8c6dfd] to-[#4caf50]">
                Devote
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="px-3 py-2 text-sm font-medium text-[#b2b3bd] hover:text-[#8c6dfd] transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="px-3 py-2 text-sm font-medium text-[#b2b3bd] hover:text-[#8c6dfd] transition-colors">
                  How It Works
                </a>
                <a href="#security" className="px-3 py-2 text-sm font-medium text-[#b2b3bd] hover:text-[#8c6dfd] transition-colors">
                  Security
                </a>
                <Link to="/app/home" className="px-3 py-2 text-sm font-medium text-[#b2b3bd] hover:text-[#8c6dfd] transition-colors">
                  Browse Campaigns
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/app"
                className="ml-4 px-6 py-2 rounded-full bg-gradient-to-r from-[#8c6dfd] to-[#4caf50] text-white font-medium hover:opacity-90 transition-all duration-300"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1c1c24] to-[#13131a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
            >
              Decentralized Voting Platform
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            >
              Secure, transparent, and community-driven voting solutions powered by blockchain technology.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/app/create-instance"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#8c6dfd] to-[#4caf50] text-white font-medium hover:opacity-90 transition-all duration-300 text-center hover:shadow-lg hover:shadow-[#8c6dfd]/30"
              >
                Create Campaign
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-center"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(40px)',
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to create, manage, and analyze decentralized voting campaigns
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔗"
              title="Decentralized Voting"
              description="Secure and transparent voting using blockchain technology with immutable records"
            />
            <FeatureCard
              icon="📊"
              title="Real-time Analytics"
              description="Track voting progress and results with our comprehensive analytics dashboard"
            />
            <FeatureCard
              icon="🔒"
              title="Secure & Private"
              description="End-to-end encryption and blockchain security to protect every vote"
            />
            <FeatureCard
              icon="📊"
              title="Real-time Analytics"
              description="Track voting progress and results with our comprehensive dashboard"
            />
            <FeatureCard
              icon="🌐"
              title="Decentralized"
              description="Powered by blockchain technology for transparent and tamper-proof voting"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#1c1c24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get started with decentralized voting in just a few simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '01', title: 'Connect Wallet', description: 'Link your Web3 wallet to get started' },
              { number: '02', title: 'Create Campaign', description: 'Set up your voting campaign with custom options' },
              { number: '03', title: 'Invite Voters', description: 'Share your campaign with participants' },
              { number: '04', title: 'Track Results', description: 'Monitor votes in real-time' },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 hover:border-indigo-400/30 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-300 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 backdrop-blur-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who trust our platform for secure and transparent voting.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Launch App
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Footer */}
      <footer className="bg-[#1c1c24] border-t border-[#3a3a43] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Devote</h3>
              <p className="text-[#808191]">Decentralized voting platform for secure and transparent decision making.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#b2b3bd] uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">How It Works</a></li>
                <li><Link to="/app/home" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">Browse Campaigns</Link></li>
                <li><Link to="/app" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">Launch App</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#b2b3bd] uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">About Us</a></li>
                <li><a href="#" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">Blog</a></li>
                <li><a href="#" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#b2b3bd] uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#3a3a43] flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#808191] text-sm"> 2023 Devote. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['twitter', 'github', 'discord', 'telegram'].map((social) => (
                <a key={social} href="#" className="text-[#808191] hover:text-[#8c6dfd] transition-colors">
                  <span className="sr-only">{social}</span>
                  <span className="text-xl">
                    {social === 'twitter' ? '𝕏' : 
                     social === 'github' ? '🐙' : 
                     social === 'discord' ? '💬' : '📨'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
