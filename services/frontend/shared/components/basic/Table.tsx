import { CSSProperties, /* MouseEventHandler */ } from "react";

interface TableProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  // children: JSX.Element[] | JSX.Element;
  // onClick?: MouseEventHandler;
  columns: string[];
  caption: string;
}


const Table = ({ className, id, style, /* children, onClick, */ columns, caption }: TableProps) => {

  const classNameSum = className
    ? `table ${className}`
    : `table`;

  return (
    <table className={classNameSum} id={id} style={style}>
      <caption>
        {caption}
      </caption>
      <thead>
        <tr>
          <th colSpan={columns.length}>{/* header */}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>The table body</td>
          <td>with two columns</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;