import { clean, format, replaceTagsIdsToNames, replaceTagsNamesToIds } from "./cleaner";

test("clean <script>",(): void => {
	expect(clean("<script>alert();</script>")).toBe("&lt;script&gt;alert();&lt;/script&gt;");
});
