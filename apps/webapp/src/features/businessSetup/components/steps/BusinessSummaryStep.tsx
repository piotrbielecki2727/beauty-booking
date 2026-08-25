"use client";

import {
  CarFrontIcon,
  ContactRoundIcon,
  ExternalLinkIcon,
  MapPinIcon,
  StoreIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";

import { IconBadge } from "@/components/reusable";

import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import type { BusinessSetupResponse } from "@beauty-booking/shared";

type BusinessSummaryStepProperties = {
  setup: BusinessSetupResponse | null;
};

type SummaryItemProperties = {
  label: string;
  value: ReactNode;
};

type SummarySectionProperties = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
};

const socialMediaFields = [
  { icon: FaInstagram, key: "instagram", name: "instagramUrl" },
  { icon: FaFacebook, key: "facebook", name: "facebookUrl" },
  { icon: FaTiktok, key: "tiktok", name: "tiktokUrl" },
  { icon: FaPinterest, key: "pinterest", name: "pinterestUrl" },
  { icon: FaYoutube, key: "youtube", name: "youtubeUrl" },
] as const satisfies ReadonlyArray<{
  icon: IconType;
  key: string;
  name: keyof BusinessSetupResponse["publicProfile"];
}>;

const SummaryItem = ({ label, value }: SummaryItemProperties) => (
  <div className="grid min-w-0 gap-1.5">
    <dt className="text-xs font-semibold uppercase tracking-wide text-copy-muted">
      {label}
    </dt>
    <dd className="min-w-0 [overflow-wrap:anywhere] text-sm leading-6 text-copy">
      {value}
    </dd>
  </div>
);

const SummarySection = ({
  children,
  icon,
  title,
}: SummarySectionProperties) => (
  <section className="grid min-w-0 content-start gap-5 rounded-xl border border-line bg-surface p-4 sm:p-5">
    <div className="flex items-center gap-3 border-b border-line pb-4">
      <IconBadge icon={icon} size="sm" />
      <h3 className="font-brand text-lg font-semibold text-brand">{title}</h3>
    </div>
    <dl className="grid min-w-0 gap-5">{children}</dl>
  </section>
);

const toExternalUrl = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

const formatPhoneNumber = (value: string) =>
  value.replace(/(\d{3})(?=\d)/g, "$1 ");

export const BusinessSummaryStep = ({
  setup,
}: BusinessSummaryStepProperties) => {
  const locale = useLocale();
  const t = useTranslations();
  const emptyValue = t("businessSetup.summary.empty");
  const streetAndNumber = [
    setup?.location.street,
    setup?.location.buildingNumber
      ? `${setup.location.buildingNumber}${setup.location.apartmentNumber ? `/${setup.location.apartmentNumber}` : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");
  const addressLines = [
    streetAndNumber,
    [setup?.location.postalCode, setup?.location.city]
      .filter(Boolean)
      .join(" "),
  ].filter(Boolean);
  const socialProfiles = socialMediaFields.flatMap((field) => {
    const value = setup?.publicProfile[field.name];

    return value ? [{ ...field, value }] : [];
  });
  const fixedFeeValue = Number(
    setup?.location.mobileServiceFixedFee.replace(",", "."),
  );
  const formattedFixedFee = Number.isFinite(fixedFeeValue)
    ? new Intl.NumberFormat(locale, {
        currency: "PLN",
        style: "currency",
      }).format(fixedFeeValue)
    : emptyValue;

  return (
    <div className="grid min-w-0 gap-4 @min-[44rem]/step:grid-cols-2">
      <SummarySection
        icon={<StoreIcon />}
        title={t("businessSetup.steps.businessBasics")}
      >
        <SummaryItem
          label={t("businessSetup.summary.fields.name")}
          value={setup?.basics.name || emptyValue}
        />
        <SummaryItem
          label={t("businessSetup.summary.fields.model")}
          value={
            setup?.basics.businessType
              ? t(
                  `businessSetup.modelSelection.options.${setup.basics.businessType}.title`,
                )
              : emptyValue
          }
        />
        <SummaryItem
          label={t("businessSetup.summary.fields.specializations")}
          value={
            setup?.basics.specializations.length ? (
              <span className="flex flex-wrap gap-2">
                {setup.basics.specializations.map((specialization) => (
                  <span
                    key={specialization}
                    className="rounded-full border border-line bg-background px-3 py-1 text-xs font-medium text-copy"
                  >
                    {t(
                      `businessSetup.businessBasics.specializations.${specialization}`,
                    )}
                  </span>
                ))}
              </span>
            ) : (
              emptyValue
            )
          }
        />
      </SummarySection>

      <SummarySection
        icon={<MapPinIcon />}
        title={t("businessSetup.location.sections.address")}
      >
        <SummaryItem
          label={t("businessSetup.summary.fields.address")}
          value={
            addressLines.length ? (
              <span className="grid">
                {addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            ) : (
              emptyValue
            )
          }
        />
        {setup?.location.parkingNote ? (
          <SummaryItem
            label={t("businessSetup.location.fields.parkingNote")}
            value={setup.location.parkingNote}
          />
        ) : null}
        {setup?.location.locationNote ? (
          <SummaryItem
            label={t("businessSetup.location.fields.locationNote")}
            value={setup.location.locationNote}
          />
        ) : null}
      </SummarySection>

      <SummarySection
        icon={<CarFrontIcon />}
        title={t("businessSetup.location.sections.mobileServices")}
      >
        <SummaryItem
          label={t("businessSetup.summary.fields.mobileServices")}
          value={t(
            setup?.location.mobileServicesEnabled
              ? "businessSetup.summary.yes"
              : "businessSetup.summary.no",
          )}
        />
        {setup?.location.mobileServicesEnabled ? (
          <>
            <SummaryItem
              label={t(
                "businessSetup.location.fields.mobileServiceMaxDistanceKm",
              )}
              value={
                setup.location.mobileServiceMaxDistanceKm === null
                  ? emptyValue
                  : t("businessSetup.summary.values.kilometers", {
                      value: setup.location.mobileServiceMaxDistanceKm,
                    })
              }
            />
            <SummaryItem
              label={t(
                "businessSetup.location.fields.mobileServiceTravelTimeMinutes",
              )}
              value={
                setup.location.mobileServiceTravelTimeMinutes === null
                  ? emptyValue
                  : t("businessSetup.summary.values.minutes", {
                      value: setup.location.mobileServiceTravelTimeMinutes,
                    })
              }
            />
            <SummaryItem
              label={t(
                "businessSetup.location.fields.mobileServiceFeeType",
              )}
              value={
                setup.location.mobileServiceFeeType
                  ? t(
                      `businessSetup.location.mobileServiceFeeTypes.${setup.location.mobileServiceFeeType}`,
                    )
                  : emptyValue
              }
            />
            {setup.location.mobileServiceFeeType === "FIXED" ? (
              <SummaryItem
                label={t(
                  "businessSetup.location.fields.mobileServiceFixedFee",
                )}
                value={formattedFixedFee}
              />
            ) : null}
          </>
        ) : null}
      </SummarySection>

      <SummarySection
        icon={<ContactRoundIcon />}
        title={t("businessSetup.steps.publicProfile")}
      >
        <SummaryItem
          label={t("businessSetup.businessDetails.fields.contactEmail")}
          value={
            setup?.publicProfile.contactEmail ? (
              <a
                className="break-all underline decoration-line-strong underline-offset-4 hover:text-brand"
                href={`mailto:${setup.publicProfile.contactEmail}`}
              >
                {setup.publicProfile.contactEmail}
              </a>
            ) : (
              emptyValue
            )
          }
        />
        <SummaryItem
          label={t("businessSetup.businessDetails.fields.contactPhone")}
          value={
            setup?.publicProfile.contactPhone ? (
              <a
                className="underline decoration-line-strong underline-offset-4 hover:text-brand"
                href={`tel:${setup.publicProfile.contactPhone}`}
              >
                {formatPhoneNumber(setup.publicProfile.contactPhone)}
              </a>
            ) : (
              emptyValue
            )
          }
        />
        <SummaryItem
          label={t("businessSetup.summary.fields.socialMedia")}
          value={
            socialProfiles.length ? (
              <span className="grid gap-2">
                {socialProfiles.map(({ icon: Icon, key, value }) => (
                  <a
                    key={key}
                    className="flex min-w-0 items-center gap-2 rounded-lg border border-line bg-background px-3 py-2 transition-colors hover:border-line-strong hover:text-brand"
                    href={toExternalUrl(value)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">
                      {t(
                        `businessSetup.businessDetails.socialMedia.${key}.label`,
                      )}
                    </span>
                    <ExternalLinkIcon
                      className="size-3.5 shrink-0 text-copy-muted"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </span>
            ) : (
              emptyValue
            )
          }
        />
      </SummarySection>
    </div>
  );
};

export type { BusinessSummaryStepProperties };
