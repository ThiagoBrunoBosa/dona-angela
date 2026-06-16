import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dona Angela — Caderno de Receitas Digitais";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fcfbfa",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontStyle: "italic",
            color: "#5c2c16",
          }}
        >
          Dona Angela
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#a67c52",
            marginTop: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Caderno de Receitas Digitais
        </div>
      </div>
    ),
    { ...size },
  );
}
