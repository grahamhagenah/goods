import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteGood, getGood } from "~/models/good.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.goodId, "goodId not found");

  const good = await getGood({ userId, id: params.goodId });
  if (!good) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ good });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.goodId, "goodId not found");

  await deleteGood({ userId, id: params.goodId });

  return redirect("/goods");
}

export default function GoodDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.good.title}</h3>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Good not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
