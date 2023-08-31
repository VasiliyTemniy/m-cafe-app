
import { CommonLCProps, CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";

interface TableProps {
  children: JSX.Element[] | JSX.Element;
  columns: string[];
  caption: string;
}

interface TableSCProps extends TableProps, CommonSCProps {
  TableLC: React.FC<TableLCProps>;
}

export interface TableLCProps extends TableProps, CommonLCProps {
}


/**
 * NEEDS REWORK! This wont work
 */
export const TableSC = ({
  classNameOverride,
  classNameAddon,
  id,
  children,
  columns,
  caption,
  TableLC
}: TableSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'table',
    componentName: 'table',
    classNameAddon,
    classNameOverride,
  });

  return (
    <TableLC
      className={className}
      id={id}
      style={style}
      columns={columns}
      caption={caption}
    >
      {children}
    </TableLC>
  );
};