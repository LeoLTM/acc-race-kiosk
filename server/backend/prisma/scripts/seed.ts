import { PrismaClient } from "../../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Create adapter with database URL from environment
const adapter = new PrismaLibSql({
	url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

// Helper to format milliseconds as mm:ss.SSS
function formatLapTime(ms: number): string {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	const milliseconds = ms % 1000;
	return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}

// Generate random lap time between 48-55 seconds (in milliseconds)
function randomLapTimeMs(): number {
	const minMs = 48 * 1000; // 48 seconds
	const maxMs = 55 * 1000; // 55 seconds
	return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

async function main() {
	console.log("🌱 Seeding database with sample lap times...");

	const samplePlayers = [
		"Player 1",
		"Player 2",
		"Player 3",
		"Player 4",
		"Player 5",
		"SpeedDemon",
		"RacingKing",
		"DriftMaster",
		"TurboTom",
		"FastLane",
	];

	for (const nickName of samplePlayers) {
		const bestLapTimeMs = randomLapTimeMs();
		const formattedTime = formatLapTime(bestLapTimeMs);

		await prisma.lapTime.upsert({
			where: { nickName },
			update: { bestLapTimeMs, formattedTime },
			create: { nickName, bestLapTimeMs, formattedTime },
		});

		console.log(`  ✓ ${nickName}: ${formattedTime}`);
	}

	console.log("\n✅ Seeding complete!");
}

main()
	.catch((e) => {
		console.error("❌ Seeding failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
