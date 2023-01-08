import { LoaderArgs, json} from "@remix-run/node";
import { Form, Outlet, useLoaderData, useTransition, useFetcher, useSubmit } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getCompletedGoodListItems, getIncompleteGoodListItems } from "~/models/good.server";
import { updateGood, createGood, deleteGood, markComplete, markIncomplete } from "~/models/good.server";
import { useState } from "react";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const completedGoodListItems = await getCompletedGoodListItems({ userId });
  const incompleteGoodListItems = await getIncompleteGoodListItems({ userId });
  return json({ completedGoodListItems, incompleteGoodListItems });
}

export default function GoodsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const fetcher = useFetcher();
  const submit = useSubmit();
  let transition = useTransition();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Outlet />
      <main className="flex h-full bg-white">
      <div className="">
          {data.incompleteGoodListItems.length === 0 ? (
          <p className="p-4">No incomplete goods yet</p>
          ) : (
            <div className="w-80">
              <h2 className="text-xl">Incomplete</h2>
              <ol>
                {data.incompleteGoodListItems.map((good) => (
                  <GoodItem key={good.id} good={good} fetcher={fetcher} />
                ))}
                </ol>
            </div>
            )}
            {data.completedGoodListItems.length === 0 ? (
              <p className="p-4">No complete goods yet</p>
              ) : (
              <div className="w-80">
                <h2 className="text-xl">Completed</h2>
                <ol>
                  {data.completedGoodListItems.map((good) => (
                    <GoodItem key={good.id} good={good} fetcher={fetcher} submit={submit} />
                  ))}
                </ol>
              </div>
            )}
          <Form action="/logout" method="post">
            <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
            Logout
            </button>
          </Form>
        </div>
      </main>
    </div>
  );
}

function GoodItem ({ good, fetcher }) {

  // const toggleStatus = () => {  
  //   submit(null, { method: "post" });
  // }
 
  return (
    <li>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={good.id}></input>
        <input type="checkbox"></input>
        <input name="title" type="text" defaultValue={good.title}></input>
        <button name="_action" value="update" type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
        <button name="_action" value="delete" type="submit" className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Delete</button>
        <button name="_action" value="complete" type="submit" className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Complete</button>
        <button name="_action" value="restore" type="submit" className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Restore</button>
      </fetcher.Form>
    </li>
)}