import { Button } from "@ecommerce/ui/components/button";
import { useTranslations } from "next-intl";
import React from "react";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="content-container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{t("page-not-found")}</p>
      </div>
      <Button variant="default" onClick={() => (window.location.href = "/")}>
        {t("go-home")}
      </Button>
    </div>
  );
}
