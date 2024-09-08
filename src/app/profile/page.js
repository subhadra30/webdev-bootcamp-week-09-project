import { NoUser } from "@/components/NoUser";
import ProfileForm from "@/components/ProfileForm";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import styles from "./profilepage.module.css";

// Here, import Profileform, NoUser from Components folder

export default async function ProfilePage() {
  const user = await currentUser();
  console.log(user);

  //If the user hasn't signed in with Clerk, prompt the user to sign

  if (!user) {
    return <NoUser />;
  }
  //Check the database to check whether there is a profile with the clerk id

  const result = await db.query(`select * from profiles where clerk_id=$1`, [
    user.id,
  ]);
  console.log(result);

  //If there is no profile associated with that clerk_id, user is provided with a profile form to fill in

  console.log("Profile query ->>>>" + result.rowCount);
  if (result.rowCount === 0) {
    return <ProfileForm />;
  }
  //if the profile already exists, display the profile

  const profile = result.rows[0];
  console.log(profile);
  return (
    <div className={styles.outlinebox}>
      <ul className={styles.profiledisplaybox}>
        <li>
          <h3>Profile of {profile.username}</h3>
        </li>
        <li>
          <p>First Name: {profile.firstname}</p>
        </li>
        <li>
          <p>Last Name: {profile.lastname}</p>
        </li>
        <li>
          <p>Bio: {profile.biography}</p>
        </li>
      </ul>
    </div>
  );
}
