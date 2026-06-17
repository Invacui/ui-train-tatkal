/**
 * @file Data Table component
 * @module components/common/DataTable
 * @description A generic data table built on @tanstack/react-table with
 *   shadcn styling. Handles loading skeletons, empty state, and row rendering.
 */

// TanStack React Table for headless table logic
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';

// Shadcn table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Shadcn skeleton for loading placeholder
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  /** Column definitions from @tanstack/react-table */
  columns: ColumnDef<TData, TValue>[];
  /** Array of data rows to display */
  data: TData[];
  /** When true, renders skeleton loading rows */
  isLoading?: boolean | undefined;
}

/**
 * DataTable
 * @description A generic data table that renders a TanStack React Table
 *   with shadcn styling. Shows skeleton placeholders while loading
 *   and a "No results" message when data is empty.
 * @template TData - The type of each row in the data array
 * @template TValue - The value type for column cells
 * @param props DataTableProps
 * @returns A fully styled table component
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
