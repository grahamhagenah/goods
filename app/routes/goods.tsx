import { LoaderArgs, ActionArgs, json} from "@remix-run/node";
import { Outlet, useLoaderData, useTransition, useFetcher } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getAllIncompleteGoodsWithinGroup, getAllUsersInGroup, getCompletedGoodListItems, getIncompleteGoodListItems, getUser } from "~/models/good.server";
import { updateGood, createGood, deleteGood, markComplete, markIncomplete } from "~/models/good.server";
import ArrowTooltips from "~/components/dropdown";
import React, { Component } from 'react'
import { getUserById } from "~/models/user.server";

// what do i want to do here. I want to get the userId, then get the group of that user and get all items in that group. Possible?

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  // Get GroupId of this user
  const groupId = await user.groupId
  const incompleteGoodListItems = await getIncompleteGoodListItems({ userId });
  const completedGoodListItems = await getCompletedGoodListItems({ userId });
  const allIncompleteGoodsWithinGroup = await getAllIncompleteGoodsWithinGroup({ groupId });

  // const allUsersInGroup = await getAllUsersInGroup({ groupId });

  return json({ completedGoodListItems, incompleteGoodListItems, userId, allIncompleteGoodsWithinGroup, user, groupId });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData) || "restore";
  const title = formData.get("title");
  const id = formData.get("id");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if(_action === "update") {
    await updateGood({ title, id });
  } 
  else if(_action === "create") {
    await createGood({ title, userId });
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

  // i need to create a list containing all incompleted goods from users in a certain group
  // console.log(data.allIncompleteGoodsWithinGroup);
  // console.log(data.allUsersInGroup);

  return (
    <div className="flex flex-col pt-16 mt-16">
      <main>
        <Outlet />
        <div>
          <div className="incomplete-goods">
          <h2 className="text-lg opacity-50">Incomplete Within Entire Group</h2>
            {data.incompleteGoodListItems.length === 0 ? (
            <p className="p-4 empty-list">Nothing is here! Add some items using the field above.</p>
            ) : (
              <ol>
                {data.allIncompleteGoodsWithinGroup.map((element) => 
                  element.goods.map((good) => (
                    <GoodItem key={good.id} good={good} />
                  ))
                )}
              </ol>
            )}
          <h2 className="text-lg opacity-50">Incomplete</h2>
            {data.incompleteGoodListItems.length === 0 ? (
            <p className="p-4 empty-list">Nothing is here! Add some items using the field above.</p>
            ) : (
              <>
                <ol>
                  {/* {data.incompleteGoodListItems.map((good) => (
                    <GoodItem key={good.id} good={good} />
                  ))} */}
                </ol>
              </>
              )}
            </div>
            <div className="completed-goods">
            {data.completedGoodListItems.length === 0 ? (
              <></>
              ) : (
              <>
                <h2 className="text-lg opacity-50">Complete</h2>
                <ol>
                  {data.completedGoodListItems.map((good) => (
                    <GoodItem key={good.id} good={good} />
                  ))}
                </ol>
              </>
              )}
            </div>
        </div>
      </main>
    </div>
  );
}

function GoodItem ({ good }) {

  console.log(good)

  // const userName = good.user.name
  const date = new Date(good.updatedAt)
  const updatedAt = date.toLocaleDateString() + ", " + date.toLocaleTimeString()
  // const firstLetter = good.user.name.charAt(0).toUpperCase()

  const fetcher = useFetcher();

  const checked = fetcher.submission
    ? // use the optimistic version
      Boolean(fetcher.submission.formData.get("checked"))
    : // use the normal version
    good.completed || false;

  const actionValue = checked ? "restore" : "complete";

  // Look into later: It works, but with an odd workaround. Why is "_action" not in the formData when unchecking a box?

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
          <button name="_action" value="update" type="submit" className="hidden">Update</button>
          {/* <ArrowTooltips firstName={userName} firstLetter={firstLetter} date={updatedAt}/> */}
          <button name="_action" value="delete" type="submit" aria-label="delete" className="white-button font-bold py-2 px-4">—</button>
      </fetcher.Form>
    </li>
)}