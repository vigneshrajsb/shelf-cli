import { describe, test, expect } from "bun:test";
import { $ } from "bun";

describe("CLI", () => {
  test("shows help", async () => {
    const result = await $`bun run src/index.ts --help`.text();
    expect(result).toContain("ril");
    expect(result).toContain("add");
    expect(result).toContain("reading");
    expect(result).toContain("bookmarks");
  });

  test("shows version info in help", async () => {
    const result = await $`bun run src/index.ts`.text();
    expect(result).toContain("USAGE");
    expect(result).toContain("COMMANDS");
  });

  test("db command shows path in production mode", async () => {
    // Explicitly unset test mode to show real path
    const result = await $`RIL_TEST= bun run src/index.ts db`.text();
    expect(result).toContain("shelf.db");
  });

  test("db command in test mode shows :memory:", async () => {
    const result = await $`RIL_TEST=1 bun run src/index.ts db`.text();
    expect(result).toContain(":memory:");
  });

  test("tags command runs without error", async () => {
    const result = await $`RIL_TEST=1 bun run src/index.ts tags`.text();
    // Should not throw, output can be empty
    expect(result).toBeDefined();
  });

  test("list command runs without error", async () => {
    const result = await $`RIL_TEST=1 bun run src/index.ts list`.text();
    expect(result).toBeDefined();
  });
});
