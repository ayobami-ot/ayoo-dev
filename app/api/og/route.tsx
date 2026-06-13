import { ImageResponse } from "next/og";
import { content } from "@/lib/content";

const BG_DARK = "#0e0e0a";
const FG = "#e8e8e2";
const FG_MUTED = "#888880";
const ACCENT = "#c8943a";
const BORDER = "#222220";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  let title = "Ayo Owolabi";
  let subtitle = "Technical founder. Building products. Writing about tech.";

  if (slug) {
    const post = await content.getPostBySlug(slug);
    if (post) {
      title = post.title;
      subtitle = post.description || post.tags.join(" · ");
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          backgroundColor: BG_DARK,
          fontFamily: "monospace",
          border: `1px solid ${BORDER}`,
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            backgroundColor: ACCENT,
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "14px",
              color: ACCENT,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            ayoo.dev
          </div>
          <div
            style={{
              fontSize: slug ? "40px" : "52px",
              fontWeight: 600,
              color: FG,
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "20px",
                color: FG_MUTED,
                lineHeight: 1.5,
                maxWidth: "800px",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
