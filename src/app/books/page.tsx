"use client";

import { debounce } from "lodash";
import { useEffect, useState } from "react";
import {
  getBooks,
  getBooksByUser,
  publishBook,
  searchBooks,
  unpublishBook,
} from "../api";

export default function BooksPage() {
  const [pubNew, setPubNew] = useState(false);
  const [books, setBooks] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    getBooks()
      .then((d) => setBooks(d.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen max-w-[60rem] mx-auto p-[1rem]">
      <input
        type="search"
        className="w-full px-[1rem] py-[0.5rem] rounded-md"
        placeholder="Search Books"
        onChange={debounce((e) => {
          const title = e.target.value;

          if (title) {
            searchBooks(title)
              .then((d) => setBooks(d.data || []))
              .catch(console.error);
          } else {
            getBooks()
              .then((d) => setBooks(d.data || []))
              .catch(console.error);
          }
        }, 500)}
      />

      <div
        className={[`flex items-center justify-between`, `pt-[1rem]`].join(` `)}
      >
        <button
          onClick={() =>
            getBooksByUser()
              .then((d) => setBooks(d.data || []))
              .catch(console.error)
          }
        >
          My Books
        </button>
        <button onClick={() => setPubNew(true)}>Publish New</button>
      </div>

      {pubNew && (
        <>
          <form
            className="mt-[1rem] flex flex-col gap-[0.4rem]"
            onSubmit={(ev) => {
              const form = new FormData(ev.currentTarget);
              const payload = Object.fromEntries(form.entries()) as Record<
                string,
                any
              >;

              payload.price = Number(payload.price);
              payload.publicationYear = Number(payload.publicationYear);

              ev.preventDefault();
              publishBook(payload).then(() => {
                setPubNew(false);
                getBooks()
                  .then((d) => setBooks(d.data || []))
                  .catch(console.error);
              }).catch(console.error);
            }}
          >
            <input
              type="text"
              placeholder="Title"
              name="title"
              required
              className="w-full px-[1rem] py-[0.5rem] rounded-md"
            />
            <input
              type="text"
              placeholder="ISBN"
              name="isbn"
              required
              maxLength={13}
              className="w-full px-[1rem] py-[0.5rem] rounded-md"
            />
            <input
              min={1900}
              max={2024}
              minLength={4}
              maxLength={4}
              type="number"
              name="publicationYear"
              placeholder="Publication Year"
              required
              className="w-full px-[1rem] py-[0.5rem] rounded-md"
            />
            <input
              type="text"
              placeholder="Genre"
              name="genre"
              required
              className="w-full px-[1rem] py-[0.5rem] rounded-md"
            />
            <input
              type="text"
              placeholder="Price"
              name="price"
              required
              className="w-full px-[1rem] py-[0.5rem] rounded-md"
            />
            <input
              type="text"
              placeholder="Description"
              name="description"
              required
              className="w-full px-[1rem] py-[0.5rem] rounded-md"
            />

            <div className="flex gap-[0.8rem] mt-[0.5rem]">
              <button
                type="reset"
                className="w-full px-[1rem] py-[0.5rem] rounded-md bg-red-700 text-white"
                onClick={() => setPubNew(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-[1rem] py-[0.5rem] rounded-md bg-green-700 text-white"
              >
                Publish!
              </button>
            </div>
          </form>
        </>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[1rem] md:gap-[2rem] mt-[1rem] md:mt-[2rem]">
        {books.map((b) => ({ ...b, setBooks })).map(BookCard)}
      </div>

      {books.length === 0 && (
        <>
          <div className="mt-[6rem] text-center">
            <h2 className="text-[1.2em]">No Books Found</h2>
            <p className="text-[0.8em]">Try searching for a book</p>
          </div>
        </>
      )}
    </div>
  );
}

function BookCard(props: Record<string, any>) {
  return (
    <div
      className={[
        `py-[0.5rem]`,
        `flex flex-col justify-end`,
        `aspect-[3/4] w-full bg-white`,
        `text-center rounded-md`,
        `relative overflow-hidden shadow-md`,
      ].join(` `)}
      style={{
        backgroundSize: `cover`,
        backgroundImage: `url('${props.picture}')`,
      }}
    >
      <div
        className={[
          `absolute inset-0`,
          `bg-gradient-to-t from-white/90 to-white/0`,
        ].join(` `)}
      />

      <div className="z-10 flex flex-col">
        <h2 className="px-[0.7rem] text-[1.1em] leading-[1]">{props.title}</h2>
        <code className="text-[0.8em] pt-[0.4rem] uppercase">{props.isbn}</code>
        <strong>₿{props.price}/-</strong>
        <button
          className="underline"
          onClick={() =>
            unpublishBook(props.id).then(() => {
              getBooks()
                .then((d) => props.setBooks(d.data || []))
                .catch(console.error);
            })
          }
        >
          unpublish
        </button>
      </div>
    </div>
  );
}
