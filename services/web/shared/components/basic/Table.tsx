import type { MouseEventHandler } from 'react';
import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';

interface TableProps extends CommonProps {
  caption?: string;
  header?: string;
  columns: string[];
  items: Array<{
    id: number;
    [key: string]: string | number | boolean | undefined
  }>;
  tableName: string;
  footer?: JSX.Element | JSX.Element[];
  onItemClick?: MouseEventHandler;
  onCellClick?: MouseEventHandler;
}

export const Table = ({
  classNameOverride,
  classNameAddon,
  caption,
  header,
  columns,
  items,
  footer,
  tableName,
  onItemClick,
  onCellClick
}: TableProps) => {

  const { className, style } = useInitLC({
    componentType: 'table',
    componentName: 'table',
    classNameAddon,
    classNameOverride,
  });

  return (
    <table className={className} id={tableName} style={style}>
      {caption &&
        <caption>
          {caption}
        </caption>
      }
      <thead>
        {header &&
          <tr className='table-header'>
            <th colSpan={columns.length}>{header}</th>
          </tr>
        }
        <tr className='table-column-names'>
          {
            columns.map(column =>
              <th key={`${tableName}-${column}`}>{column}</th>
            )
          }
        </tr>
      </thead>
      <tbody>
        {
          items.map(item =>
            <tr key={`${tableName}-${item.id}`} id={`${item.id}`} onClick={onItemClick}>
              {
                Object.keys(item).map((key, index) => 
                  <td key={`${tableName}-${item.id}-${index}`} id={`${item.id}-${index}`} onClick={onCellClick}>
                    <div>{item[key]}</div>
                  </td>
                )
              }
            </tr>
          )
        }
      </tbody>
      {footer}
    </table>
  );
};