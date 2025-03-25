import TableActionCell from '@components/base/action/TableActionCell'

interface IProps {
  Action: (actionType: string) => void
}

const TeachingProgressAction = ({ Action }: IProps) => {
  return (
    <TableActionCell>
      <div
        className="cursor-pointer px-3 py-2 transition"
        onClick={() => Action('attendance-history')}
      >
        <div className="px-3 text-sm font-medium text-gray-700 hover:text-primary">
          View
        </div>
      </div>
    </TableActionCell>
  )
}

export default TeachingProgressAction
