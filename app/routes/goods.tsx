import { LoaderArgs, ActionArgs, json} from "@remix-run/node";
import { Outlet, useLoaderData, useTransition, useFetcher, Form } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getAllIncompleteGoods, getAllCompleteGoods, createEmptyGood, clearGoods } from "~/models/good.server";
import { updateGood, createGood, deleteGood, markComplete, markIncomplete } from "~/models/good.server";
import IconMenu from "~/components/dropdown";
import React, { Component } from 'react'
import { getUserById } from "~/models/user.server";
import { SlGhost } from 'react-icons/sl';
import LongMenu from "~/components/dropdown";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  const groupId = await user.groupId
  const allIncompleteGoods = await getAllIncompleteGoods({ groupId });
  const allCompleteGoods = await getAllCompleteGoods({ groupId });

  return json({ userId, allIncompleteGoods, allCompleteGoods, user, groupId });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  const groupId = await user.groupId
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData) || "restore";
  let title = formData.get("title");
  const id = formData.get("id");

  if (typeof title !== "string" || title.length === 0) {
    title = "No title"
    
    // return json(
    //   { errors: { title: "Title is required" } },
    //   { status: 400 }
    // );
  }

  if(_action === "update") {
    await updateGood({ title, id, userId });
  } 
  else if(_action === "create") {
    await createGood({ title, userId, groupId });
  }
  else if(_action === "clear") {
    await clearGoods({ groupId });
  }
  else if(_action === "delete") {
    await deleteGood({ id });
  }
  else if(_action === "complete") {
    await markComplete({ id });
  }
  else if("restore") {
    await markIncomplete({ id });
  }
  
  return null;
}

export default function GoodsPage() {
  const data = useLoaderData<typeof loader>();
  let transition = useTransition();
  const fetcher = useFetcher();
  
  return (
    <div className="flex flex-col md:pt-0 lg:pt-16 mt-16">
      <main>
        <Outlet />
          <details className="incomplete-goods" open>
            <summary>
              <h2>Incomplete</h2>
              <span className="counter">{data.allIncompleteGoods.length}</span>
            </summary>
            {data.allIncompleteGoods.length === 0 ? (
              <p className="p-4 empty-list"><SlGhost className="empty-icon mr-3"/>Nothing is here!</p>
            ) : (
              <ol>
                {
                data.allIncompleteGoods.map((good) => 
                  <GoodItem key={good.id} good={good} />
                )}
              </ol>
            )}
          </details>
            {data.allCompleteGoods.length === 0 ? (
                <></>
              ) : (
              <>
                <details className="incomplete-goods" open>
                <summary>
                  <h2>Incomplete</h2>
                  <span className="counter">{data.allCompleteGoods.length}</span>
                  <fetcher.Form method="post" id="clear-items-form">
                    <button className="clear-all" name="_action" value="clear" type="submit">
                     Clear
                    </button>
                  </fetcher.Form>
                </summary>
                <ol>
                  {data.allCompleteGoods.map((good) => 
                    <GoodItem key={good.id} good={good} />
                  )}
                </ol>
                </details>
              </>
              )}
      </main>
    </div>
  );
}

function GoodItem ({ good }) {

  const userName = good.user.name
  const date = new Date(good.updatedAt)
  const updatedAt = date.toLocaleDateString() + ", " + date.toLocaleTimeString()

  const fetcher = useFetcher();

  const checked = fetcher.submission
    ? // use the optimistic version
      Boolean(fetcher.submission.formData.get("checked"))
    : // use the normal version
    good.completed || false;

  const actionValue = checked ? "restore" : "complete";

  return (
    <li>
      <fetcher.Form method="post" className="item-form">
          <input type="hidden" name="id" value={good.id}></input>
          <label className="form-control">
            <input
              type="checkbox"
              name="_action"
              value={actionValue}
              checked={checked}
              onChange={(e) => fetcher.submit(e.target.form)}
            />
          </label>
          <input name="title" type="text" defaultValue={good.title} className="goods-input"></input>
          <button name="_action" value="update" type="submit" className="update-button">Update</button>
          <LongMenu userName={userName} updatedAt={updatedAt} fetcher={fetcher} id={good.id}/>
      </fetcher.Form>
    </li>
)}