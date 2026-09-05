"use client";

import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
} from "lucide-react";

import { Button } from "@/components/reusable/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

type AppTableSortDirection = "asc" | "desc" | null;

type AppTableProperties = Omit<
  ComponentProps<typeof Table>,
  "containerClassName"
> & {
  containerClassName?: string;
  minWidthClassName?: string;
  tableContainerClassName?: string;
};

type AppTableHeadProperties = ComponentProps<typeof TableHead> & {
  isSortable?: boolean;
  onSort?: () => void;
  sortDirection?: AppTableSortDirection;
};

type AppTableRowProperties = ComponentProps<typeof TableRow>;

type AppTableEmptyStateProperties = ComponentProps<typeof TableRow> & {
  cellClassName?: string;
  children: ReactNode;
  colSpan: number;
};

export const AppTable = ({
  className,
  containerClassName,
  minWidthClassName = "min-w-[48rem]",
  tableContainerClassName,
  ...properties
}: AppTableProperties) => (
  <div
    className={cn(
      "min-w-0 overflow-hidden rounded-lg border border-[var(--table-border,var(--line))] bg-[var(--table-surface,var(--background))]",
      containerClassName,
    )}
  >
    <Table
      className={cn(minWidthClassName, className)}
      containerClassName={tableContainerClassName}
      {...properties}
    />
  </div>
);

export const AppTableHeader = TableHeader;

export const AppTableBody = TableBody;

export const AppTableFooter = TableFooter;

export const AppTableHead = ({
  children,
  className,
  isSortable = false,
  onSort,
  sortDirection = null,
  ...properties
}: AppTableHeadProperties) => {
  const SortIcon =
    sortDirection === "asc"
      ? ArrowUpIcon
      : sortDirection === "desc"
        ? ArrowDownIcon
        : ArrowUpDownIcon;

  return (
    <TableHead
      className={cn(
        "bg-[var(--table-header-surface,var(--background))] px-3 text-xs text-copy-muted",
        className,
      )}
      {...properties}
    >
      {isSortable ? (
        <Button
          className="-ml-2 h-7 px-2 text-xs text-copy-muted"
          type="button"
          variant="ghost"
          onClick={onSort}
        >
          {children}
          <SortIcon className="size-3.5" aria-hidden="true" />
        </Button>
      ) : (
        children
      )}
    </TableHead>
  );
};

export const AppTableRow = ({
  className,
  ...properties
}: AppTableRowProperties) => (
  <TableRow
    className={cn(
      "h-[65px] border-[var(--table-row-border,var(--border))] hover:bg-[var(--table-row-hover,var(--muted))]",
      className,
    )}
    {...properties}
  />
);

export const AppTableCell = ({
  className,
  ...properties
}: ComponentProps<typeof TableCell>) => (
  <TableCell className={cn("px-3 py-3", className)} {...properties} />
);

export const AppTableActions = ({
  className,
  ...properties
}: ComponentProps<"div">) => (
  <div
    className={cn("flex flex-wrap items-center justify-end gap-2", className)}
    {...properties}
  />
);

export const AppTableEmptyState = ({
  cellClassName,
  children,
  className,
  colSpan,
  ...properties
}: AppTableEmptyStateProperties) => (
  <AppTableRow className={className} {...properties}>
    <AppTableCell
      className={cn("py-4 text-sm text-copy-muted", cellClassName)}
      colSpan={colSpan}
    >
      {children}
    </AppTableCell>
  </AppTableRow>
);

export type { AppTableSortDirection };
