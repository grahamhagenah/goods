import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserId } from "~/session.server";
import { getUserById, updateUserDetails } from "~/models/user.server";
import { useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const user = await getUserById(userId);
  return json({ userId, user});
}

export async function action({ request }: ActionArgs) {
  const userId = await getUserId(request);
  const formData = await request.formData();
  const name = formData.get("username");
  const surname = formData.get("surname");

  let { _action, ...values } = Object.fromEntries(formData);

  if(_action === "updateUserDetails") {
    await updateUserDetails(userId, name, surname);
  } 

  return null;
}

export default function AccountDetailsPage() {

  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="account-settings mx-auto w-full px-8">
        <h1 className="mb-8 text-2xl font-bold">Account Details</h1>
        <Form method="post" className="space-y-6">
          <div className="mt-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            <h3>First Name</h3>
          </label>
            <input
              id="username"
              required
              autoFocus={true}
              name="username"
              type="text"
              defaultValue={data.user.name}
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg mt-1"
            />
        </div>
        <div className="mt-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          <h3>Last Name</h3>
        </label>
          <input
            id="surname"
            required
            autoFocus={true}
            name="surname"
            type="text"
            defaultValue={data.user.surname}
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg mt-1"
          />
        </div>
          <button type="submit" name="_action" value="updateUserDetails" className="primary-button rounded py-2 px-4 text-white">Update Details</button>
      </Form>
    </div>
  </div>
  );
}