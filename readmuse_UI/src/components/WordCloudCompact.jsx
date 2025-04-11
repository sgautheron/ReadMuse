import React, { useRef, useEffect, useState } from "react";
import WordCloud from "react-d3-cloud";

const fontSizeMapper = (word) => {
  return Math.max(40, Math.log2(word.value + 1) * 18); // tu peux augmenter 18 si tu veux plus gros
};

const rotate = () => 0; // pas de rotation du tout

export default function WordCloudCompact({ words }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1400, height: 1200 }); // taille initiale plus grande

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setDimensions({
          width: Math.max(width, 1000),
          height: Math.max(height, 1000),
        });
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const motsNettoyes = (words || [])
    .filter(
      (mot) =>
        mot &&
        typeof mot.text === "string" &&
        typeof mot.value === "number" &&
        mot.text.trim().length > 2
    )
    .map((mot, i) => ({
      text: mot.text.trim(),
      value: mot.value,
      key: `${mot.text}-${i}`,
    }));

  if (motsNettoyes.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>Aucun mot-clé à afficher.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "200vh", marginBottom: "2rem" }} // 200% de la hauteur visible
    >
      <WordCloud
        data={motsNettoyes}
        font="sans-serif"
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
        padding={2}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
