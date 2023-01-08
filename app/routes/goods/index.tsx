import { json, redirect, ActionArgs} from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import * as React from "react";
import { updateGood, createGood, deleteGood, markComplete, markIncomplete } from "~/models/good.server";
import { requireUserId } from "~/session.server";
import { useRef } from "react";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);
  const title = formData.get("title");
  const id = formData.get("id");
  const completed = formData.get("completed");

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
  else if(_action === "restore") {
    await markIncomplete({ id });
  }
  
  return null;
}

export default function NewGoodForm() {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const formRef = useRef();
  let transition = useTransition();
  let isAdding = 
    transition.state === "submitting" && 
    transition.submission.formData.get("_action") === "create"; 

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  React.useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  return (
    <Form method="post" ref={formRef}>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage= { actionData?.errors?.title ? "title-error" : undefined }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div className="text-right">
        <button name="_action" value="create" type="submit" className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
          Save
        </button>
      </div>
    </Form>
  );
}
