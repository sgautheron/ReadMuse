import React, { useRef, useEffect, useState } from "react";
import WordCloud from "react-d3-cloud";

const fontSizeMapper = (word) => Math.max(20, Math.log2(word.value) * 10);
const rotate = () => 0;

export default function WordCloudCompact({ words }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
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
    .map((mot) => ({
      text: mot.text.trim(),
      value: mot.value,
    }));

  if (motsNettoyes.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>Aucun mot-clé à afficher.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "600px", marginBottom: "2rem" }}>
      <WordCloud
        data={motsNettoyes}
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
        padding={1}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
