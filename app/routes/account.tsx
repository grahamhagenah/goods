import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createUserSession, getUserId } from "~/session.server";
import { getUserById, verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import { useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { updateGroup } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const user = await getUserById(userId);

  return json({ userId, user });
}

export async function action({ request }: ActionArgs) {
  const userId = await getUserId(request);
  const formData = await request.formData();
  const groupId = formData.get("groupId");
  // const redirectTo = safeRedirect(formData.get("redirectTo"), "/goods");
  let { _action, ...values } = Object.fromEntries(formData);

  if(_action === "updateGroup") {
    await updateGroup({ userId, groupId });
  } 

  return null;
}

export default function AccountDetailsPage() {

  const data = useLoaderData<typeof loader>();

  console.log(data.user.groupId)

  return (
    <div className="flex min-h-full flex-col justify-center pt-16 mt-16">
      <div className="mx-auto w-full max-w-md px-8">
      <h1>Account</h1>
      <Form method="post" className="">
        <h3>Your Group ID: {data.user.groupId}</h3>
        <input name="groupId" type="text" className=""></input>
        <button name="_action" value="updateGroup" type="submit" className="primary-button">Update</button>
      </Form>
      </div>
    </div>
  );
}

// Graham Hagenah group id: "cld298oas000qtsmdv1jxbhpu"
//Jenny group Id: "cld2bc02900029reirvgummph"