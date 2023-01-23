import { Form, useActionData, useTransition } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import * as React from "react";
import { useRef } from "react";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import goods from "~/styles/goods.css";
import global from "~/styles/global.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl }, 
    { rel: "stylesheet", href: goods },
    { rel: "stylesheet", href: global }
  ];
};

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
    <Form method="post" ref={formRef} action="/goods" className="mb-16 lg:mb-16">
      <div>
        <label className="flex w-full flex-col gap-1 relative">
          <input
            ref={titleRef}
            name="title"
            placeholder="Add an item, press enter to save."
            className="order-b-4 px-3 text-lg leading-loose"
            id="main-form"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage= { actionData?.errors?.title ? "title-error" : undefined }
          />
          <button name="_action" value="create" type="submit" className="save-button absolute py-2 px-4 text-white">
          Save
        </button>
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>
    </Form>
  );
}
