import request from "supertest";
import mongoose from "mongoose";
import Text from '../src/services/texts/model';
import app from "../src/app";


// Mock Database Setup
beforeAll(async () => {
	await mongoose.connect("mongodb://localhost:27017/testdb");
});

// Cleanup after each test
afterEach(async () => {
	await Text.deleteMany({});
});

// Close the DB connection after all tests
afterAll(async () => {
	await mongoose.disconnect();
});

describe("Text Routes", () => {
	describe("GET /text", () => {
		test("Should return all texts (empty initially)", async () => {
			const res = await request(app).get("/api/v1/text");
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual([]);
		});
	});

	describe("POST /text", () => {
		test("Should add a new text", async () => {
			const res = await request(app).post("/api/v1/text").send({ text: "Sample text" });
			expect(res.statusCode).toBe(201);
			expect(res.body).toHaveProperty("id");
			expect(res.body.text).toBe("Sample text");
		});

		test("Should return 422 for validation error (missing text)", async () => {
			const res = await request(app).post("/api/v1/text").send({});
			expect(res.statusCode).toBe(422);
			expect(res.body).toHaveProperty("message", "Validation Error");
		});
	});

	describe("GET /text/:id", () => {
		test("Should return a specific text by ID", async () => {
			const newText = await Text.create({ text: "Test text" });
			const res = await request(app).get(`/api/v1/text/${newText.id}`);
			expect(res.statusCode).toBe(200);
			expect(res.body.text).toBe("Test text");
		});

		test("Should return 404 for non-existent text ID", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request(app).get(`/api/v1/text/${fakeId}`);
			expect(res.statusCode).toBe(404);
			expect(res.body.message).toBe("Text not found");
		});
	});

	describe("PATCH /text/:id", () => {
		test("Should update an existing text", async () => {
			const newText = await Text.create({ text: "Old text" });
			const res = await request(app).patch(`/api/v1/text/${newText.id}`).send({ text: "Updated text" });
			expect(res.statusCode).toBe(200);
			expect(res.body.text).toBe("Updated text");
		});

		test("Should return 404 for non-existent text ID", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request(app).patch(`/api/v1/text/${fakeId}`).send({ text: "New text" });
			expect(res.statusCode).toBe(404);
			expect(res.body.message).toBe("Text not found");
		});
	});

	describe("DELETE /text/:id", () => {
		test("Should delete a text by ID", async () => {
			const newText = await Text.create({ text: "Text to delete" });
			const res = await request(app).delete(`/api/v1/text/${newText.id}`);
			expect(res.statusCode).toBe(200);
			expect(res.body.message).toBe("Text deleted successfully");
		});

		test("Should return 404 for non-existent text ID", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request(app).delete(`/api/v1/text/${fakeId}`);
			expect(res.statusCode).toBe(404);
			expect(res.body.message).toBe("Text not found");
		});
	});

	describe("GET /text/:id/words", () => {
		test("Should return the word count of a text", async () => {
			const newText = await Text.create({ text: "The quick brown fox jumps over the lazy dog." });
			const res = await request(app).get(`/api/v1/text/${newText.id}/words`);
			expect(res.statusCode).toBe(200);
			expect(res.body.wordCount).toBe(9);
		});
	});

	describe("GET /text/:id/characters", () => {
		test("Should return the character count of a text", async () => {
			const newText = await Text.create({ text: "Hello world!" });
			const res = await request(app).get(`/api/v1/text/${newText.id}/characters`);
			expect(res.statusCode).toBe(200);
			expect(res.body.characterCount).toBe(11); // "Hello world" without spaces
		});
	});

	describe("GET /text/:id/sentences", () => {
		test("Should return the sentence count of a text", async () => {
			const newText = await Text.create({ text: "Hello world! This is a test. Let's count sentences." });
			const res = await request(app).get(`/api/v1/text/${newText.id}/sentences`);
			expect(res.statusCode).toBe(200);
			expect(res.body.sentenceCount).toBe(3);
		});
	});

	describe("GET /text/:id/paragraphs", () => {
		test("Should return the paragraph count of a text", async () => {
			const newText = await Text.create({ text: "Paragraph one.\n\nParagraph two." });
			const res = await request(app).get(`/api/v1/text/${newText.id}/paragraphs`);
			expect(res.statusCode).toBe(200);
			expect(res.body.paragraphCount).toBe(2);
		});
	});

	describe("GET /text/:id/longest-words", () => {
		test("Should return the longest words in a text", async () => {
			const newText = await Text.create({ text: "Supercalifragilisticexpialidocious is a long word." });
			const res = await request(app).get(`/api/v1/text/${newText.id}/longest-words`);
			expect(res.statusCode).toBe(200);
			expect(res.body.longestWords).toContain("Supercalifragilisticexpialidocious");
		});
	});
});
