import { NextResponse } from "next/server";
import { runDiscoveryPipeline } from "@/lib/discovery";
import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * POST /api/cron/discover
 *
 * Triggers the MusicBrainz → Deezer discovery pipeline.
 * Writes results to src/data/sa-artists.json.
 *
 * Protected by CRON_SECRET env var so only authorized callers can trigger it.
 *
 * For Vercel Cron: add to vercel.json crons config.
 * For manual: POST with Authorization header or ?secret= param.
 * For local dev: POST http://localhost:3000/api/cron/discover?secret=dev
 */

export const maxDuration = 300; // 5 min timeout (Vercel Pro) — pipeline can take a while
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Auth check
  const secret = process.env.CRON_SECRET || "dev";
  const url = new URL(req.url);
  const providedSecret =
    url.searchParams.get("secret") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (providedSecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs: string[] = [];

  try {
    const result = await runDiscoveryPipeline((msg) => {
      logs.push(msg);
      console.log(msg);
    });

    // Write to the data file
    const filePath = join(process.cwd(), "src", "data", "sa-artists.json");
    await writeFile(filePath, JSON.stringify(result, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      totalScanned: result.totalScanned,
      totalMatched: result.totalMatched,
      generated: result.generated,
      logs,
    });
  } catch (err) {
    console.error("Discovery pipeline failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        logs,
      },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel Cron (it sends GET requests)
export async function GET(req: Request) {
  return POST(req);
}
