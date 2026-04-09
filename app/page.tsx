import { comments } from "@/src/schema";

export default function Page() {
  async function create(formData: FormData) {
    "use server";
    const { db } = await import("@/src/db");
    const comment = formData.get("comment");
    if (typeof comment !== "string" || comment.trim() === "") {
      return;
    }
    await db.insert(comments).values({ comment });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Comment
        </h1>
        <form action={create} className="flex flex-col gap-4">
          <input
            type="text"
            name="comment"
            placeholder="write a comment"
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
