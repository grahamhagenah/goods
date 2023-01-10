import { Form, useActionData, useTransition } from "@remix-run/react";
import * as React from "react";
import { useRef } from "react";

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
    <Form method="post" ref={formRef} action="/goods">
      <div>
        <label className="flex w-full flex-col gap-1">
          <input
            ref={titleRef}
            name="title"
            placeholder="What do you need?"
            className="order-b-4 px-3 text-lg leading-loose"
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
        <button name="_action" value="create" type="submit" className="py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
          Save
        </button>
      </div>
    </Form>
  );
}
