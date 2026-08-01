import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Upload from '../components/Upload';
import RoleSelect from '../components/RoleSelect';
import { analyzeResume as apiAnalyze } from '../api';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Target } from 'lucide-react';

const Home = ({ onAnalyzeStart, onAnalyzeComplete }) => {
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('frontend');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!file) {
            alert("Please upload a resume first.");
            return;
        }

        setLoading(true);
        onAnalyzeStart();

        try {
            const response = await apiAnalyze(file, role);
            onAnalyzeComplete(response.data);
        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Failed to analyze resume. Please try again.");
            onAnalyzeStart(false); // Reset loading state in parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 font-bold text-sm tracking-widest uppercase"
                    >
                        <Sparkles size={16} /> AI-Powered Recruiting
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                    >
                        Analyze your <span className="text-blue-500">Resume</span> in seconds.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
                    >
                        Get instant feedback on your resume based on live job market data. Find gaps, improve your score, and land your dream role.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
                    <div className="space-y-8">
                        <RoleSelect activeRole={role} onRoleSelect={setRole} />
                        <Upload onFileSelect={setFile} />
                        
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyze}
                            disabled={loading || !file}
                            className={`w-full py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all ${
                                loading || !file 
                                    ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5" 
                                    : "bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:bg-blue-500"
                            }`}
                        >
                            {loading ? "Analyzing..." : "Analyze Resume"}
                            {!loading && <ArrowRight size={24} />}
                        </motion.button>
                    </div>

                    <div className="space-y-6">
                        <FeatureCard 
                            icon={<Target className="text-blue-400" />}
                            title="Role-Specific Match"
                            desc="We compare your skills against thousands of backend and frontend job requirements."
                        />
                        <FeatureCard 
                            icon={<Zap className="text-amber-400" />}
                            title="Instant Feedback"
                            desc="No waiting in line. Get your score and suggestions in under 3 seconds."
                        />
                        <FeatureCard 
                            icon={<ShieldCheck className="text-green-400" />}
                            title="Privacy First"
                            desc="Your personal data stays with you. We only process what's needed for analysis."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div 
        whileHover={{ x: 10 }}
        className="glass-card p-6 border-white/5 hover:border-white/10 transition-colors"
    >
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
        <p className="text-white/40 text-sm">{desc}</p>
    </motion.div>
);

export default Home;
