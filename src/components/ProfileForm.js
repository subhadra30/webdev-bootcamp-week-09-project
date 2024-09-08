import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ProfileForm() {
  const user = await currentUser();
  console.log(user);
  async function CreateProfile(formData) {
    "use server";
    console.log("Save profile details into profiles table");

    const username = user.username;
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const biography = formData.get("biography");
    console.log("User id:" + user.id);

    await db.query(
      `insert into profiles(clerk_id, username, firstname, lastname, biography) values($1, $2, $3, $4, $5)`,
      [user?.id, username, firstname, lastname, biography]
    );

    revalidatePath("/profile");
  }

  return (
    <div>
      <h2>Please create your profile here</h2>
      <form className="profile-form" action={CreateProfile}>
        <div className="firstname-box">
          <label>First Name</label>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            required
          />
        </div>
        <div className="lastname-box">
          <label>Last Name</label>
          <input type="text" name="lastname" placeholder="Last Name" required />
        </div>
        <div className="biography-box">
          <label>Biography</label>
          <input
            type="text"
            name="biography"
            placeholder="Biography"
            required
          />
        </div>
        <div className="button-box">
          <button>Create Profile</button>
        </div>
      </form>
    </div>
  );
}
