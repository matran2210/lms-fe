import ActionItem from './ActionItem'
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
        <ActionItem
          title={labelButtonView}
          onClick={handleClickView}
          isShow={isShowViewButton}
        />
        <ActionItem
          title={labelButtonEdit}
          onClick={handleClickEdit}
          isShow={isShowEditButton}
        />
        <ActionItem
          title={labelButtonDelete}
          onClick={handleClickDelete}
          isShow={isShowDeleteButton}
        />
      </div>
    </TableActionCell>
  )
}

export default SappActionCell
