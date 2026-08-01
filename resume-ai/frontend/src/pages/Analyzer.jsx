import React from 'react';
import { motion } from 'framer-motion';
import ResultCard from '../components/ResultCard';
import { Sparkles, Trophy, Target, ShieldCheck } from 'lucide-react';

const Analyzer = ({ results, onReset }) => {
    return (
        <div className="min-h-screen py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 mb-6 font-bold text-sm tracking-widest uppercase"
                    >
                        <Trophy size={16} /> Analysis Complete
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    >
                        Your <span className="text-blue-500">Resume</span> Score Breakdown
                    </motion.h1>
                </div>

                <div className="mt-12">
                    <ResultCard results={results} onReset={onReset} />
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
                    <div className="text-center p-6 border-r border-white/5 last:border-0">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 text-blue-400">
                            <Target size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">Technical Gap</h4>
                        <p className="text-white/40 text-sm">Identifying missing tech stack keywords for your role.</p>
                    </div>
                    <div className="text-center p-6 border-r border-white/5 last:border-0">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 text-amber-400">
                            <Sparkles size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">Impact Score</h4>
                        <p className="text-white/40 text-sm">Measuring the strength of your achievement statements.</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 text-green-400">
                            <ShieldCheck size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">ATS Readiness</h4>
                        <p className="text-white/40 text-sm">Ensuring your format is readable by modern systems.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analyzer;
