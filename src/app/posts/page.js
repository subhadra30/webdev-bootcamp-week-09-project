import { db } from "@/lib/db";
import { SignedIn } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Posts() {
  const user = await currentUser();
  console.log(user);

  const result = await db.query(`SELECT
    profileposts.id,
    profileposts.content,
    profiles.username
    FROM profileposts
    LEFT JOIN profiles ON profileposts.profile_id = profiles.id`);
  console.log(result);
  const posts = result.rows;

  return (
    <div>
      <form action={addNewPost}>
        <textarea type="text" name="content" placeholder="Post"></textarea>
        <button>Post</button>
      </form>

      <h2>See all the posts here</h2>
      {posts.map(function (post) {
        return (
          <div key={post.id}>
            <h3>{post.username}</h3>
            <Link href={`/posts/${post.id}`}>{post.content}</Link>
            {user.username === post.username ? (
              <form action={deletePost}>
                <input type="hidden" name="profilepostid" value={post.id} />
                <button>Delete</button>
              </form>
            ) : (
              ""
            )}
          </div>
        );
      })}
    </div>
  );
}
async function addNewPost(formData) {
  "use server";

  // get content from form

  const content = formData.get("content");

  //to get the profile id of the currently signed in user

  const user = await currentUser();
  const profileIdSingleUser = await db.query(
    `select id from profiles where clerk_id = $1`,
    [user.id]
  );
  const profile = profileIdSingleUser.rows[0];

  const profile_id = profile.id;
  console.log("Saving post to the db-->>" + profile.id);

  //add post to db
  await db.query(
    `insert into profileposts(profile_id, content) values($1, $2)`,
    [profile_id, content]
  );
  revalidatePath("/posts");
}

async function deletePost(formData) {
  "use server";
  console.log("Delete post from the db");
  const profilepostid = formData.get("profilepostid");

  await db.query(`delete from profileposts where id = ${profilepostid}`);
  revalidatePath("/posts");
  redirect("/posts");
}
