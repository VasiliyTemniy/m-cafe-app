import { TableLCProps } from "../scBasic";


/**
 * NEEDS REWORK! This wont work
 */
export const TableLC = ({
  className,
  id,
  style,
  // children,
  //onClick,
  columns,
  caption
}: TableLCProps) => {

  return (
    <table className={className} id={id} style={style}>
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