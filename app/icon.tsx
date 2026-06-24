import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050706",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c8a24a",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-1px",
        }}
      >
        K
      </div>
    ),
    { ...size }
  );
}
