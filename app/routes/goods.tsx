import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useFetcher } from "react-router-dom";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getGoodListItems } from "~/models/good.server";
import { updateGood } from "~/models/good.server";
import { getCompletedGoodListItems } from "~/models/good.server";
import { getIncompleteGoodListItems } from "~/models/good.server";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const completedGoodListItems = await getGoodListItems({ userId });
  const incompleteGoodListItems = await getIncompleteGoodListItems({ userId });
  return json({ completedGoodListItems, incompleteGoodListItems });
}


export async function action({ request }: ActionArgs) {
  console.log("here");
  const formData = await request.formData();
  const title = formData.get("title");
  const id = formData.get("id");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  const good = await updateGood({ title, id });

  return null;
}

export default function GoodsPage() {
  const fetcher = useFetcher();
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
        <Outlet />
        <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
            {data.completedGoodListItems.length === 0 ? (
            <p className="p-4">No goods yet</p>
            ) : (
              <>
                <h2>Incomplete</h2>
                <ol>
                  {data.completedGoodListItems.map((good) => (
                     <GoodItem key={good.id} good={good}></GoodItem>
                  ))}
                 </ol>
              </>
              )}
              <>
              <h2>Completed</h2>
              <ol>
                {data.incompleteGoodListItems.map((good) => (
                  <GoodItem key={good.id} good={good}></GoodItem>
                ))}
              </ol>
            </>
          </div>
          <Form action="/logout" method="post">
            <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
            Logout
            </button>
          </Form>
        </main>

    </div>
  );
}

function GoodItem ({ good }) { 
  let fetcher = useFetcher();

  return (
    <li>
      <fetcher.Form>
        <input type="text" defaultValue={good.title}></input>
      </fetcher.Form>
    </li>
)}