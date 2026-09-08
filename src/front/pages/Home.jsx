import React, { useState } from "react";
import { PriceTicker } from "../components/PriceTicker.jsx";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features.jsx";
import { HowItWorks } from "../components/HowItWorks.jsx";
import LearningPaths from "../components/LearningPaths";
import { ForWho } from "../components/ForWho.jsx";
import { CTA } from "../components/CTA.jsx";

export const Home = () => {

	const [user, setUser] = useState(null);

	const verifyUser = () => {
        const user = localStorage.getItem("user");
        if (user) return JSON.parse(user).role;
        return null;
    }

	return (
		<>
			<PriceTicker />
			<Hero />
			<Features />
			<HowItWorks />
			<LearningPaths />
			<ForWho />
			{verifyUser() === null ? <CTA /> : ""}
		</>
	);
};
