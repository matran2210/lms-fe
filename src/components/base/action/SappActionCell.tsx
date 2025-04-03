import TableActionCell from './TableActionCell'

interface IProps {
  isShowViewButton?: boolean
  labelButtonView?: string
  handleClickView?: () => void

  isShowEditButton?: boolean
  labelButtonEdit?: string
  handleClickEdit?: () => void

  isShowDeleteButton?: boolean
  labelButtonDelete?: string
  handleClickDelete?: () => void
}

const SappActionCell = ({
  isShowViewButton = true,
  labelButtonView = 'View',
  handleClickView = () => {},
  isShowEditButton = false,
  labelButtonEdit = 'Edit',
  handleClickEdit = () => {},
  isShowDeleteButton = false,
  labelButtonDelete = 'Delete',
  handleClickDelete = () => {},
}: IProps) => {
  return (
    <TableActionCell>
      <div className="flex flex-col">
        {isShowViewButton && (
          <div
            className="cursor-pointer px-3 py-2 transition"
            onClick={handleClickView}
          >
            <div className="px-3 text-sm font-medium text-gray-700 hover:text-primary">
              {labelButtonView}
            </div>
          </div>
        )}
        {isShowEditButton && (
          <div
            className="cursor-pointer px-3 py-2 transition"
            onClick={handleClickEdit}
          >
            <div className="px-3 text-sm font-medium text-gray-700 hover:text-primary">
              {labelButtonEdit}
            </div>
          </div>
        )}
        {isShowDeleteButton && (
          <div
            className="cursor-pointer px-3 py-2 transition"
            onClick={handleClickDelete}
          >
            <div className="px-3 text-sm font-medium text-gray-700 hover:text-primary">
              {labelButtonDelete}
            </div>
          </div>
        )}
      </div>
    </TableActionCell>
  )
}

export default SappActionCell
