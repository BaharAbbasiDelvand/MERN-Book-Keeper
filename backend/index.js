import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";

import { Book } from "./models/bookModel.js";

import mongoose from "mongoose";
import { send } from "express/lib/response.js";
const app = express();

//to parse the request body, we use a middleware
app.use(express.json());

app.get("/", (request, response) => {
    console.log(request);
    return response.status(234).send("Helicopter");
}); //using the get method

//route for a post method

app.post("/books", async (request, response) => {
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
app.get("/books", async (request, response) => {
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

app.get("/books/:id", async (request, response) => {
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
app.put("/books/:id", async (request, response) => {
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
app.delete("/books/:id", async (request, response) => {
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

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("app is connected to the database");
        //making sure the server only runs if the connection is successful
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
//to handle different situations of success and failure
