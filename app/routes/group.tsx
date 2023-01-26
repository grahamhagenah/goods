import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserId } from "~/session.server";
import { getGroupById, getUserById, updateGroupName } from "~/models/user.server";
import { useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { updateGroup } from "~/models/user.server";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const user = await getUserById(userId);

  let group = null

  if(user) {
    group = await getGroupById(user.groupId);
  }

  return json({ userId, user, group});
}

export async function action({ request }: ActionArgs) {
  const userId = await getUserId(request);
  const formData = await request.formData();
  const groupId = formData.get("groupId");
  const groupName = formData.get("groupName");

  let { _action, ...values } = Object.fromEntries(formData);

  if(_action === "updateGroupId") {
    await updateGroup({ userId, groupId });
  } 

  if(_action === "updateGroupName") {
    await updateGroupName({ groupId, groupName });
  } 

  return null;
}

export default function AccountDetailsPage() {

  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-full flex-col justify-center pt-16 mt-16">
      <div className="mx-auto w-full max-w-md px-8">
        <h1 className="mb-8 text-2xl font-bold">{data.group.name}</h1>
        <ul className="user-list mb-8 mt-0">
          <h3 className="block text-sm font-medium text-gray-700 mb-2">Group Users</h3>
          {data.group.users.map((user) =>
            <li key={user.name} className="user">
              <AccountCircleIcon className="p-1 pl-0"/>
              {user.name + " " + user.surname}
            </li>
          )}
        </ul>
      <Form method="post" className="space-y-6">
      <div className="mb-8 mt-0">
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
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg mb-5"
            />
            <button type="submit" name="_action" value="updateGroupId" className="primary-button w-full rounded py-2 px-4 text-white">Update Group ID</button>
          </div>
        </div>
        <div className="mb-8 mt-0">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          <h3>Group Name </h3>
        </label>
        <div className="mt-1">
          <input
            id="groupName"
            required
            autoFocus={true}
            name="groupName"
            type="text"
            defaultValue={data.group.name}
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg mb-5"
          />
          <button type="submit" name="_action" value="updateGroupName" className="primary-button w-full rounded py-2 px-4 text-white">Update Group Name</button>
        </div>
      </div>
    </Form>
    </div>
  </div>
  );
}