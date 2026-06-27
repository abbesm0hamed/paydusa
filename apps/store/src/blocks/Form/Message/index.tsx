import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import React from "react";

import RichText from "@/components/RichText";

import { Width } from "../Width";

export const Message: React.FC<{ message: SerializedEditorState }> = ({
  message,
}) => {
  return (
    <Width className="my-12" width="100">
      {message && <RichText data={message as DefaultTypedEditorState} />}
    </Width>
  );
};
