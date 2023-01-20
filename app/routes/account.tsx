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

  return (
    <div className="flex min-h-full flex-col justify-center pt-16 mt-16">
      <div className="mx-auto w-full max-w-md px-8">
      <Form method="post" className="space-y-6">
      {/* <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            required
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            aria-describedby="email-error"
            defaultValue={data.user.email}
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
        </div>
      </div> */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          <h3>Group ID </h3>
          <p className="mb-3">Share this Group ID with someone or update your ID</p>
        </label>
        <div className="mt-1">
          <input
            id="group"
            required
            autoFocus={true}
            name="groupId"
            type="text"
            defaultValue={data.user.groupId}
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
        </div>
      </div>
      <button type="submit" name="_action" value="updateGroup" className="primary-button w-full rounded py-2 px-4 text-white">Update Group</button>
    </Form>
    </div>
  </div>
  );
}