"use client";

import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/layout/PageContainer";
import { customerFooterSections } from "@/components/layout/customerFooter/customerFooterConfig";
import { CustomerFooterBottom } from "@/components/layout/customerFooter/shared/CustomerFooterBottom";
import { CustomerFooterBrand } from "@/components/layout/customerFooter/shared/CustomerFooterBrand";
import { CustomerFooterNewsletter } from "@/components/layout/customerFooter/shared/CustomerFooterNewsletter";
import { CustomerFooterSection } from "@/components/layout/customerFooter/shared/CustomerFooterSection";

export const CustomerFooter = () => {
  const t = useTranslations();
  const translateFooter = (key: string) => t(`footer.${key}`);

  return (
    <footer className="border-t border-border bg-surface-soft">
      <PageContainer className="py-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.3fr]">
          <CustomerFooterBrand
            appName={t("common.appName")}
            description={t("footer.description")}
          />

          {customerFooterSections.map((section) => (
            <CustomerFooterSection
              key={section.labelKey}
              section={section}
              translateLabel={translateFooter}
            />
          ))}

          <CustomerFooterNewsletter
            buttonLabel={t("footer.newsletter.buttonLabel")}
            description={t("footer.newsletter.description")}
            inputLabel={t("footer.newsletter.inputLabel")}
            placeholder={t("footer.newsletter.placeholder")}
            title={t("footer.newsletter.title")}
          />
        </div>
      </PageContainer>

      <PageContainer className="py-0">
        <CustomerFooterBottom
          copyright={t("footer.copyright")}
          translateLabel={translateFooter}
        />
      </PageContainer>
    </footer>
  );
};
