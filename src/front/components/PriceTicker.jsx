import React, { useState, useEffect } from "react";
import { getPrices } from "../services/pricesService.js";

export const PriceTicker = () => {
    const [precios, setPrecios] = useState([]);

    useEffect(() => {
        const cargar = () => {
            getPrices()
                .then((data) => setPrecios(data))
                .catch((err) => console.log("Error cargando precios:", err));
        };

        cargar();
        const intervalo = setInterval(cargar, 60000);
        return () => clearInterval(intervalo);
    }, []);

    if (precios.length === 0) return null;

    // Se duplica la lista para que el bucle se vea continuo
    const lista = [...precios, ...precios];

    return (
        <div className="overflow-hidden py-2 border-bottom" style={{ backgroundColor: "#111827" }}>
            <div className="d-flex ticker-track" style={{ width: "max-content" }}>
                {lista.map((coin, i) => (
                    <div key={i} className="d-flex align-items-center px-4 text-white small">
                        <span className="fw-bold me-2">{coin.symbol}</span>
                        <span className="me-2">
                            ${coin.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </span>
                        <span className={coin.change >= 0 ? "text-success" : "text-danger"}>
                            {coin.change >= 0 ? "▲" : "▼"} {Math.abs(coin.change).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};