//route for a post method
import express from 'express';
const router = express.Router();
import { Book } from "../models/bookModel.js";
//adding a book     
router.post("/", async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: "Send all required fields!",
            });
        }

        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        const book = await Book.create(newBook);
        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route to get all books from the DB
router.get("/", async (request, response) => {
    try {
        const books = await Book.find({}); //to get a list of all the books in the DB
        return response.status(200).json({
            count: books.length,
            data: books,
        }); //send the books to the client
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//getting one book from the DB by its ID

router.get("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const book = await Book.findById(id); //to get a list of all the books in the DB
        return response.status(200).json(book); //send the books to the client
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route for updating a book
router.put("/:id", async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: "Send all required fields: title, author, publishYear",
            });
        }

        const { id } = request.params;

        const result = await Book.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: "Book not found" });
        }

        return response
            .status(200)
            .send({ message: "Book updated successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route for deleting a book
router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: "Book not found" });
        }

        return response
            .status(200)
            .send({ message: "Book deleted successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;