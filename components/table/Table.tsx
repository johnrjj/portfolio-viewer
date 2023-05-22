import React, { CSSProperties, ElementType, ReactNode, useRef } from 'react'
import {
  mergeProps,
  useCheckbox,
  useFocusRing,
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableSelectAllCheckbox,
  VisuallyHidden,
  useTableRowGroup,
  useTableHeaderRow,
  useTableRow,
  useTableSelectionCheckbox,
  AriaTableProps,
  AriaCheckboxProps,
} from 'react-aria'
import {
  SelectionBehavior,
  TableState,
  useTableState,
  useToggleState,
} from 'react-stately'
import type { TableProps } from '@react-types/table'
import type { GridNode } from '@react-types/grid'

interface TableComponentProps<T> extends AriaTableProps<T>, TableProps<T> {
  selectionBehavior?: SelectionBehavior
  children: any
  style?: CSSProperties
}

function Table<T extends object>(props: TableComponentProps<T>) {
  let { selectionMode, selectionBehavior } = props
  let state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === 'multiple' && selectionBehavior !== 'replace',
  })

  let ref = useRef(null)
  let { collection } = state
  let { gridProps } = useTable(props, state, ref)

  return (
    <table
      {...gridProps}
      ref={ref}
      style={{ borderCollapse: 'collapse', width: '100%' }}
    >
      <TableRowGroup type="thead" style={{ marginBottom: 32 }}>
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) =>
              column.props.isSelectionCell ? (
                <TableSelectAllCell
                  key={column.key}
                  column={column}
                  state={state}
                />
              ) : (
                <TableColumnHeader
                  key={column.key}
                  column={column}
                  state={state}
                />
              ),
            )}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup style={{ marginTop: 32, paddingTop: 32 }} type="tbody">
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map((cell) =>
              cell.props.isSelectionCell ? (
                <TableCheckboxCell key={cell.key} cell={cell} state={state} />
              ) : (
                <TableCell key={cell.key} cell={cell} state={state} />
              ),
            )}
          </TableRow>
        ))}
      </TableRowGroup>
    </table>
  )
}

interface CheckboxProps extends AriaCheckboxProps {
  style?: CSSProperties
  className?: string
}

function Checkbox(props: CheckboxProps) {
  let state = useToggleState(props)
  let ref = React.useRef(null)
  let { inputProps } = useCheckbox(props, state, ref)
  let { isFocusVisible, focusProps } = useFocusRing()
  let isSelected = state.isSelected && !props.isIndeterminate

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        opacity: props.isDisabled ? 0.4 : 1,
      }}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <svg width={24} height={24} aria-hidden="true" style={{ marginRight: 4 }}>
        <rect
          x={isSelected ? 4 : 5}
          y={isSelected ? 4 : 5}
          width={isSelected ? 16 : 14}
          height={isSelected ? 16 : 14}
          fill={isSelected ? 'orange' : 'none'}
          stroke={isSelected ? 'none' : 'gray'}
          strokeWidth={2}
        />
        {isSelected && (
          <path
            transform="translate(7 7)"
            d={`M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1
            1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712
            6A.999.999 0 0 1 3.788 9z`}
          />
        )}
        {props.isIndeterminate && (
          <rect x={7} y={11} width={10} height={2} fill="gray" />
        )}
        {isFocusVisible && (
          <rect
            x={1}
            y={1}
            width={22}
            height={22}
            fill="none"
            stroke="orange"
            strokeWidth={2}
          />
        )}
      </svg>
      {props.children}
    </label>
  )
}

interface TableRowProps<T> {
  item: GridNode<T>
  children: ReactNode
  state: TableState<T>
}

function TableRow<T>(props: TableRowProps<T>) {
  const { children, item, state } = props
  let ref = useRef(null)
  let isSelected = state.selectionManager.isSelected(item.key)
  let { rowProps, isPressed } = useTableRow(
    {
      node: item,
    },
    state,
    ref,
  )
  let { isFocusVisible, focusProps } = useFocusRing()

  return (
    <tr
      style={{
        background: isSelected
          ? 'blueviolet'
          : isPressed
          ? 'var(--spectrum-global-color-gray-400)'
          : (item?.index ?? 0) % 2
          ? 'var(--spectrum-alias-highlight-hover)'
          : 'none',
        color: isSelected ? 'white' : null!,
        outline: 'none',
        boxShadow: isFocusVisible ? 'inset 0 0 0 2px orange' : 'none',
      }}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </tr>
  )
}

interface TableColumnHeaderProps<T> {
  column: GridNode<T>
  state: TableState<T>
}

interface MenuOptions {
  label: string
  id: string
}

function TableColumnHeader<T>(props: TableColumnHeaderProps<T>) {
  const { column, state } = props
  let ref = useRef(null)
  let { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref)
  let { isFocusVisible, focusProps } = useFocusRing()
  let arrowIcon = state.sortDescriptor?.direction === 'ascending' ? '▲' : '▼'

  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      colSpan={column.colspan}
      style={{
        textAlign: (column?.colspan ?? 0) > 1 ? 'center' : 'left',
        padding: '5px 10px',
        outline: 'none',
        boxShadow: isFocusVisible ? 'inset 0 0 0 2px orange' : 'none',
        cursor: 'default',
      }}
      ref={ref}
    >
      {column.rendered}
      {column.props.allowsSorting && (
        <span
          aria-hidden="true"
          style={{
            padding: '0 2px',
            visibility:
              state.sortDescriptor?.column === column.key
                ? 'visible'
                : 'hidden',
          }}
        >
          {arrowIcon}
        </span>
      )}
    </th>
  )
}

interface TableHeaderRowProps<T> {
  item: GridNode<T>
  children: ReactNode
  state: TableState<T>
}

function TableHeaderRow<T>(props: TableHeaderRowProps<T>) {
  const { item, state, children } = props
  let ref = useRef(null)
  let { rowProps } = useTableHeaderRow({ node: item }, state, ref)

  return (
    <tr {...rowProps} ref={ref}>
      {children}
    </tr>
  )
}

interface TableRowGroupProps {
  type: ElementType
  style?: CSSProperties
  children: ReactNode
  onScroll?: () => void
  className?: string
}

export const TableRowGroup = React.forwardRef(
  (props: TableRowGroupProps, ref) => {
    let { type: Element, children, onScroll, className } = props
    let { rowGroupProps } = useTableRowGroup()
    return (
      <Element
        {...rowGroupProps}
        onScroll={onScroll}
        style={
          Element === 'thead'
            ? {
                borderBottom: '2px solid var(--spectrum-global-color-gray-800)',
              }
            : null
        }
        className={className}
        ref={ref}
      >
        {children}
      </Element>
    )
  },
)

function TableSelectAllCell<T>(props: TableCellPropsSpecial<T>) {
  const { column, state } = props
  let ref = useRef(null)
  let { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref)
  let { checkboxProps } = useTableSelectAllCheckbox(state)

  return (
    <th {...columnHeaderProps} ref={ref}>
      {state.selectionManager.selectionMode === 'single' ? (
        <VisuallyHidden>{checkboxProps['aria-label']}</VisuallyHidden>
      ) : (
        <Checkbox {...checkboxProps} />
      )}
    </th>
  )
}

function TableCheckboxCell<T>(props: TableCellProps<T>) {
  const { state, cell } = props
  let ref = useRef(null)
  let { gridCellProps } = useTableCell({ node: cell }, state, ref)
  let { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey! },
    state,
  )

  return (
    <td {...gridCellProps} ref={ref}>
      <Checkbox {...checkboxProps} />
    </td>
  )
}

interface TableCellProps<T> {
  cell: GridNode<T>
  state: TableState<T>
}

interface TableCellPropsSpecial<T> {
  column: GridNode<T>
  state: TableState<T>
}

function TableCell<T>(props: TableCellProps<T>) {
  let { cell, state } = props
  let ref = useRef(null)
  let { gridCellProps } = useTableCell({ node: cell }, state, ref)
  let { isFocusVisible, focusProps } = useFocusRing()

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      style={{
        padding: '5px 10px',
        outline: 'none',
        boxShadow: isFocusVisible ? 'inset 0 0 0 2px orange' : 'none',
        cursor: 'default',
      }}
      ref={ref}
    >
      {cell.rendered}
    </td>
  )
}

export { Table }
