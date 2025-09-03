"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/atoms/TableComponent";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { Button, Input } from "../atoms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  Search,
  Filter,
  Bug,
  Eye,
  X,
} from "lucide-react";
import { DropdownMenuCheckboxItem } from "../atoms/DropdownMenuComponent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingOverlay } from "../atoms/LoadingPage";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// Opções de filtro baseadas nas colunas reais
const statusOptions = [
  { value: "Resolvido", label: "Resolvido" },
  { value: "Inválido", label: "Em Inválido" },
  { value: "Reaberto", label: "Reaberto" },
  { value: "Em Resolução", label: "Em Resolução" },
  { value: "Aguardando Usuário", label: "Aguardando Usuário" },
  { value: "Novo", label: "Novo" }
];

const severityOptions = [
  { value: "P1", label: "Muito alta (P1)" },
  { value: "P2", label: "Alta (P2)" },
  { value: "P3", label: "Média (P3)" },
  { value: "P4", label: "Baixa (P4)" },
  { value: "P5", label: "Muito baixa (P5)" },
];

export function BugDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const handleRedirect = async (path: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 50));
      router.push(path);
    } catch (err) {
      console.error("Erro ao redirecionar:", err);
      toast.error("Erro ao redirecionar", {
        description: "Ocorreu um problema ao navegar. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const activeFiltersCount = columnFilters.length + (globalFilter ? 1 : 0);

  const clearAllFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    table.resetColumnFilters();
  };

  const getFilterValue = (columnId: string) => {
    return (table.getColumn(columnId)?.getFilterValue() as string) ?? "";
  };

  const setFilterValue = (columnId: string, value: string) => {
    table.getColumn(columnId)?.setFilterValue(value === "all" ? "" : value);
  };

  return (
    <>
      {isLoading && (
        <LoadingOverlay
          title="Buscando defeito..."
          subtitle="Buscando informações do defeito"
          showDots={true}
        />
      )}

      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Bug className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Defeitos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {table.getFilteredRowModel().rows.length} defeito(s)
                encontrado(s)
              </p>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 dark:border-gray-600 dark:hover:border-gray-400"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Buscar em todos os campos..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resumo
                </label>
                <Input
                  placeholder="Filtrar por resumo..."
                  value={getFilterValue("summary")}
                  onChange={(event) =>
                    setFilterValue("summary", event.target.value)
                  }
                  className="h-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={getFilterValue("status")}
                  onChange={(e) => setFilterValue("status", e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Todos os status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prioridade
                </label>
                <select
                  value={getFilterValue("defectPriority")}
                  onChange={(e) => setFilterValue("defectPriority", e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Todas as prioridades</option>
                  {severityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Filtros avançados
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-400"
                  >
                    <Eye className="h-4 w-4" />
                    Colunas
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999]"
                >
                  <div className="space-y-2">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          <span className="text-sm capitalize">
                            {column.id}
                          </span>
                        </DropdownMenuCheckboxItem>
                      ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-700 dark:to-purple-800 dark:hover:from-purple-800 dark:hover:to-purple-900"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-white font-semibold border-r border-purple-500 dark:border-purple-400 last:border-r-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                    cursor-pointer transition-all duration-200
                    hover:bg-purple-50 hover:shadow-sm dark:hover:bg-purple-900/20
                    ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/50 dark:bg-gray-800/50"}
                    ${row.getIsSelected() ? "bg-purple-100 dark:bg-purple-900/30 border-l-4 border-l-purple-500 dark:border-l-purple-400" : ""}
                  `}
                    onClick={() => {
                      const bugId = (row.original as { id: string }).id;
                      handleRedirect(`/www/bugs/view/${bugId}`);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="border-r border-gray-100 dark:border-gray-700 last:border-r-0 py-4 text-gray-900 dark:text-gray-100"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Bug className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <div>
                        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          Nenhum defeito encontrado
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Tente ajustar os filtros ou criar um novo defeito
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  {table.getFilteredSelectedRowModel().rows.length}
                </span>{" "}
                de{" "}
                <span className="font-medium">
                  {table.getFilteredRowModel().rows.length}
                </span>{" "}
                linha(s) selecionadas
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Itens por página:
                </span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </span>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="px-2 dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-400 disabled:dark:text-gray-600 disabled:dark:border-gray-700"
                >
                  ««
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-400 disabled:dark:text-gray-600 disabled:dark:border-gray-700"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-400 disabled:dark:text-gray-600 disabled:dark:border-gray-700"
                >
                  Próxima
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="px-2 dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-400 disabled:dark:text-gray-600 disabled:dark:border-gray-700"
                >
                  »»
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
