import React from "react";
import { PriceTicker } from "../components/PriceTicker.jsx";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features.jsx";
import { HowItWorks } from "../components/HowItWorks.jsx";
import LearningPaths from "../components/LearningPaths";
import { ForWho } from "../components/ForWho.jsx";
import { CTA } from "../components/CTA.jsx";

export const Home = () => {
	return (
		<>
			<PriceTicker />
			<Hero />
			<Features />
			<HowItWorks />
			<LearningPaths />
			<ForWho />
			<CTA />
		</>
	);
};
