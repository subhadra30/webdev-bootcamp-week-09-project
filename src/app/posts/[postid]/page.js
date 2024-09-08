import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function SinglePostPage({ params }) {
  console.log(params.postid);

  const result = await db.query(
    `select profileposts.id,
    profileposts.content,
    profiles.username from profileposts 
    left join profiles on profileposts.profile_id = profiles.id
    where profileposts.id = ${params.postid}`
  );
  console.log(result);
  const singlepost = result.rows[0];

  const comments = (
    await db.query(
      `select * from usercomments where profilepost_id = ${params.postid}`
    )
  ).rows;

  console.log("Comments--->" + comments);
  const user = await currentUser();
  const profilequeryresult = await db.query(
    `select id from profiles where username = '${user.username}'`
  );
  const profile = profilequeryresult.rows[0];
  console.log("Profiles ->" + profile.id);

  return (
    <div>
      <p>
        <b>{singlepost.username} </b>posts
      </p>
      <p>{singlepost.content}</p>
      <h2>Comments</h2>
      {comments.map(function (comment) {
        return (
          <div key={comment.id}>
            <p key={comment.id}>{comment.comment}</p>

            {profile.id == comment.profile_id ? (
              <form action={deleteComment}>
                <input type="hidden" name="commentid" value={comment.id} />
                <input type="hidden" name="postid" value={params.postid} />
                <button>Delete</button>
              </form>
            ) : (
              ""
            )}
          </div>
        );
      })}

      <h2>Post comments below</h2>
      <form action={addComment}>
        <label htmlFor="comment">Comment</label>
        <textarea name="content" placeholder="Comment" required></textarea>
        <input
          type="hidden"
          name="postid"
          placeholder="postid"
          value={params.postid}
        />
        <button>Post</button>
      </form>
    </div>
  );
}

async function deleteComment(formData) {
  "use server";
  const user = await currentUser();
  const commentid = formData.get("commentid");
  const postid = formData.get("postid");
  await db.query(`delete from usercomments where id = ${commentid}`);
  revalidatePath(`/posts/${postid}`);
  redirect(`/posts/${postid}`);
}

async function addComment(formData) {
  "use server";
  console.log("Saving comment to the db");
  const user = await currentUser();
  const content = formData.get("content");
  const postid = formData.get("postid");

  const result = await db.query(
    `select id from profiles where username = '${user.username}'`
  );
  const profile = result.rows[0];
  console.log("Profiles ->" + profile.id);

  await db.query(
    `INSERT INTO usercomments(profile_id, comment, profilepost_id) values($1, $2, $3)`,
    [profile.id, content, postid]
  );
  console.log("Comment saved");
  revalidatePath(`/posts/${postid}`); // revalidate the posts page to ensure all the new posts are shown
  redirect(`/posts/${postid}`); //redirect to the page that show the list of comments
}
