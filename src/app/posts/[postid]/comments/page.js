import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function comments() {
  const comments = await db.query(`select * from usercomments`).rows;

  return (
    <div>
      <h2>Comments</h2>
      {comments.map(function (comment) {
        return (
          <div key={comment.id}>
            <p>{comment.comment}</p>
          </div>
        );
      })}

      <h2>Post comments below</h2>
      <form action={addComment}>
        <label htmlFor="username">Username</label>
        <input name="username" placeholder="Username" required />
        <label htmlFor="comment">Comment</label>
        <textarea name="content" placeholder="Comment" required></textarea>
        <input
          type="hidden"
          name="postid"
          placeholder="postid"
          value={params.id}
        />
        <button className={styles.button}>Post</button>
      </form>
    </div>
  );
}
async function addComment(formData) {
  "use server";
  console.log("Saving comment to the db");

  const username = formData.get("username");
  const content = formData.get("content");
  const postid = formData.get("postid");

  await db.query(
    `INSERT INTO comments(username, content, post_id) values($1, $2,$3)`,
    [username, content, postid]
  );
  console.log("Comment saved");
  revalidatePath(`/posts/${postid}`); // revalidate the posts page to ensure all the new posts are shown
  redirect(`/posts/${postid}`); //redirect to the page that show the list of comments
}
