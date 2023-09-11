import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';

interface TableProps extends CommonProps {
  children: JSX.Element[] | JSX.Element;
  caption?: string;
  header?: string;
  columns: string[];
  items: Array<{
    id: string;
    [key: string]: string | number | boolean | undefined
  }>;
}

export const Table = ({
  classNameOverride,
  classNameAddon,
  id,
  caption,
  header,
  columns,
  items
}: TableProps) => {

  const { className, style } = useInitLC({
    componentType: 'table',
    componentName: 'table',
    classNameAddon,
    classNameOverride,
  });

  return (
    <table className={className} id={id} style={style}>
      {caption &&
        <caption>
          {caption}
        </caption>
      }
      {header &&
        <thead>
          <tr>
            <th colSpan={columns.length}>{header}</th>
          </tr>
        </thead>
      }
      <tbody>
        {
          items.map(item =>
            <tr key={item.id}>
              {
                Object.keys(item).map(key => 
                  <td key={`${item.id}-${item[key]}`}>
                    {item[key]}
                  </td>
                )
              }
            </tr>
          )
        }
      </tbody>
    </table>
  );
};